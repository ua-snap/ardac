/**
 * ERA5-WRF data transformation utilities
 * Provides wind rose preparation, timeseries and date window helpers
 */

import {
  ERA5_WRF_CONFIG,
  ERA5_FIRE_SEASON,
  ERA5_CLIMATOLOGY_PERIODS,
} from '~/utils/era5WrfConstants'
import type { Era5WrfVariableKey } from '~/utils/era5WrfConstants'
import {
  calculateClimatology,
  getAvailableYears,
} from '~/utils/era5WrfClimatology'
import type { ClimatologyData } from '~/utils/era5WrfClimatology'

/**
 * Calculate climatology (only needed for fire season right now)
 */
export const calculateEra5WrfClimatology = (
  variables: Era5WrfVariableKey[], // Variables to calculate climatology for
  climatologyPeriod: Ref<string>, // Climatology baseline period ('1960-1989' or '1990-2019')
  selectedYear: Ref<number> // Year to align climatology bands to (for chart display)
) => {
  const dataStore = useDataStore()
  const endpoint = ERA5_WRF_CONFIG.endpoint

  // Get available years from API data
  const availableYears = computed<number[]>(() => {
    const apiData = dataStore.apiData[endpoint]
    if (!apiData) return []
    return getAvailableYears(apiData)
  })

  // Calculate climatology data for all variables
  const climatologyData = computed<Record<string, ClimatologyData>>(() => {
    const apiData = dataStore.apiData[endpoint]

    // Return empty if no API data
    if (!apiData || Object.keys(apiData).length === 0) {
      return {}
    }

    // Get period from constant
    const periodKey =
      climatologyPeriod.value as keyof typeof ERA5_CLIMATOLOGY_PERIODS
    const period = ERA5_CLIMATOLOGY_PERIODS[periodKey]

    const { start: startYear, end: endYear } = period

    // Validate selected year
    const targetYear = selectedYear.value
    console.log(selectedYear.value)

    // Calculate climatology for each variable
    const result: Record<string, ClimatologyData> = {}

    variables.forEach(variable => {
      result[variable] = calculateClimatology(
        apiData,
        variable,
        startYear,
        endYear,
        targetYear
      )
    })

    return result
  })

  return {
    climatologyData,
    availableYears,
  }
}

/**
 * Utility function for filtering ERA5 data by date range, fire season and variable.
 *
 * @param startDate - ISO date string (YYYY-MM-DD)
 * @param endDate - ISO date string (YYYY-MM-DD)
 * @param variables - Array of ERA5-WRF variable keys to prepare
 * @param filterToFireSeason - Whether to filter to fire season dates (default: false)
 * @returns Object with apiData and seriesByVariable
 */
export const filterEra5WrfSeries = (
  startDate: Ref<string>,
  endDate: Ref<string>,
  variables: Era5WrfVariableKey[],
  filterToFireSeason = false
) => {
  const dataStore = useDataStore()
  const endpoint = ERA5_WRF_CONFIG.endpoint

  const apiData = computed(() => dataStore.apiData[endpoint] ?? null)

  const seriesByVariable = computed(() => {
    // Initialize empty series for all variables
    const result: Record<string, Era5WrfSeriesPoint[]> = {}
    variables.forEach(variable => {
      result[variable] = []
    })

    // Return empty if no data or no date range
    if (!apiData.value || !startDate.value || !endDate.value) {
      return result
    }

    // API returns data in date-sorted order, which we use here.
    let dates = Object.keys(apiData.value)

    // Filter dates to the requested date range
    dates = dates.filter(
      date => date >= startDate.value && date <= endDate.value
    )

    // Filter to fire season if requested (March 15 - October 15)
    if (filterToFireSeason) {
      const { start, end } = ERA5_FIRE_SEASON
      dates = dates.filter(date => {
        const monthDay = date.slice(5) // Extract MM-DD from YYYY-MM-DD
        return monthDay >= start && monthDay <= end
      })
    }

    // Build series for each variable
    variables.forEach(variable => {
      result[variable] = dates.map(date => ({
        date,
        value: apiData.value[date]?.[variable] ?? null,
      }))
    })
    return result
  })

  return {
    seriesByVariable,
  }
}

export interface Era5WrfSeriesPoint {
  date: string
  value: number | null
  label?: string
}

const toDate = (value: string) => new Date(`${value}T00:00:00Z`)

export const getDefaultWindow = (
  apiData: Record<string, any> | null
): { start: string; end: string } | null => {
  if (!apiData) return null

  const sortedDates = Object.keys(apiData).sort()
  if (!sortedDates.length) return null

  const end = sortedDates[sortedDates.length - 1]
  const endDate = toDate(end)
  const startDate = new Date(endDate)
  startDate.setUTCFullYear(startDate.getUTCFullYear() - 1)

  const startCandidate = `${startDate.getUTCFullYear()}-${String(
    startDate.getUTCMonth() + 1
  ).padStart(2, '0')}-${String(startDate.getUTCDate()).padStart(2, '0')}`

  const start =
    sortedDates.find(date => date >= startCandidate) ?? sortedDates[0]

  return { start, end }
}

export interface WindRoseBin {
  direction: number // Center of direction sector in degrees
  directionLabel: string // Compass direction label
  speedRange: string // Speed range label
  frequency: number // Percentage of total observations
  count: number // Raw count
}

export interface WindRoseData {
  bins: WindRoseBin[]
  speedRanges: string[]
  directionSectors: number[]
  totalCount: number
}

const DIRECTION_SECTORS = 8 // 8 compass directions (45° each)
const SECTOR_SIZE = 360 / DIRECTION_SECTORS

const DIRECTION_LABELS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']

// Wind speed ranges (m/s)
const SPEED_BINS = [
  { min: 0, max: 0.5 },
  { min: 0.5, max: 3 },
  { min: 3, max: 5 },
  { min: 5, max: 8 },
  { min: 8, max: 11 },
  { min: 11, max: 14 },
  { min: 14, max: Infinity },
]

const binDirection = (degrees: number): number => {
  // Normalize to 0-360
  const normalized = ((degrees % 360) + 360) % 360
  // Calculate sector index, offset by half a sector so North is centered at 0°
  const sectorIndex =
    Math.floor((normalized + SECTOR_SIZE / 2) / SECTOR_SIZE) % DIRECTION_SECTORS
  return sectorIndex
}

const binSpeed = (speed: number): number => {
  for (let i = 0; i < SPEED_BINS.length; i++) {
    if (speed >= SPEED_BINS[i].min && speed < SPEED_BINS[i].max) {
      return i
    }
  }
  return SPEED_BINS.length - 1
}

export const prepareWindRoseData = (
  speedSeries: Era5WrfSeriesPoint[],
  directionSeries: Era5WrfSeriesPoint[]
): WindRoseData => {
  // Create a map for quick direction lookup
  const directionMap = new Map(directionSeries.map(d => [d.date, d.value]))

  // Count occurrences in each (direction sector × speed bin) combination
  const counts: number[][] = Array(DIRECTION_SECTORS)
    .fill(0)
    .map(() => Array(SPEED_BINS.length).fill(0))

  let totalCount = 0

  speedSeries.forEach(speedPoint => {
    const speed = speedPoint.value
    const direction = directionMap.get(speedPoint.date)

    if (
      speed !== null &&
      speed !== undefined &&
      direction !== null &&
      direction !== undefined
    ) {
      const dirSector = binDirection(direction)
      const speedBin = binSpeed(speed)
      counts[dirSector][speedBin]++
      totalCount++
    }
  })

  // Convert to bins with frequencies
  const bins: WindRoseBin[] = []
  const directionSectors: number[] = []

  for (let dirIdx = 0; dirIdx < DIRECTION_SECTORS; dirIdx++) {
    const centerDegrees = dirIdx * SECTOR_SIZE
    directionSectors.push(centerDegrees)

    for (let speedIdx = 0; speedIdx < SPEED_BINS.length; speedIdx++) {
      const count = counts[dirIdx][speedIdx]
      const frequency = totalCount > 0 ? (count / totalCount) * 100 : 0

      bins.push({
        direction: centerDegrees,
        directionLabel: DIRECTION_LABELS[dirIdx],
        speedRange:
          SPEED_BINS[speedIdx].max === Infinity
            ? `>${SPEED_BINS[speedIdx].min}`
            : `${SPEED_BINS[speedIdx].min}-${SPEED_BINS[speedIdx].max}`,
        frequency,
        count,
      })
    }
  }

  return {
    bins,
    speedRanges: SPEED_BINS.map(b =>
      b.max === Infinity ? `>${b.min}` : `${b.min}-${b.max}`
    ),
    directionSectors,
    totalCount,
  }
}
