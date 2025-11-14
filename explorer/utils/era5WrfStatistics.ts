import type { Era5WrfSeriesPoint } from '~/utils/era5WrfTransforms'
import type { ClimatologyData } from '~/utils/era5WrfClimatology'
import { getClimatologyValueForDate, getDayOfYear, isLeapYear } from '~/utils/era5WrfClimatology'

/**
 * Configuration for fire weather thresholds
 */
export interface ThresholdConfig {
  hotPercentile: number // Percentile threshold for hot days (default: 90)
  dryPercentile: number // Percentile threshold for dry days (default: 10)
  extremelyDryPercentile: number // Percentile threshold for extremely dry days (default: 5)
}

/**
 * Default thresholds for fire weather analysis
 */
export const DEFAULT_THRESHOLDS: ThresholdConfig = {
  hotPercentile: 90,
  dryPercentile: 10,
  extremelyDryPercentile: 5,
}

/**
 * Statistics about fire weather conditions
 */
export interface FireWeatherStatistics {
  totalDays: number // Total number of days analyzed
  hotDays: number // Days exceeding hot threshold
  dryDays: number // Days below dry threshold
  fireProneDays: number // Days that are both hot AND dry
  extremelyDryDays: number // Days below extremely dry threshold
  hotDayDates: string[] // ISO date strings of hot days
  dryDayDates: string[] // ISO date strings of dry days
  fireProneDayDates: string[] // ISO date strings of fire-prone days
  extremelyDryDayDates: string[] // ISO date strings of extremely dry days
  temperatureAnomalies: DayAnomaly[] // Temperature deviations from climatology
  humidityAnomalies: DayAnomaly[] // Humidity deviations from climatology
}

/**
 * Anomaly data for a single day
 */
export interface DayAnomaly {
  date: string // ISO date string
  value: number // Actual observed value
  climatologyMedian: number // Climatology median (p50) for this day
  anomaly: number // Difference (value - climatologyMedian)
  percentileExceeded: number | null // Highest percentile exceeded (or null if below median)
}

/**
 * Detect days where values exceed a climatology threshold
 *
 * @param data - Time series data points
 * @param climatology - Climatology data for comparison
 * @param threshold - 'above' to detect values above percentile, 'below' to detect values below
 * @param percentile - Percentile threshold to compare against
 * @returns Array of ISO date strings matching the criteria
 */
export function detectAnomalousDays(
  data: Era5WrfSeriesPoint[],
  climatology: ClimatologyData,
  threshold: 'above' | 'below',
  percentile: number
): string[] {
  if (percentile < 0 || percentile > 100) {
    throw new Error(`Invalid percentile: ${percentile}. Must be between 0 and 100.`)
  }

  const percentileKey = `p${percentile}` as 'p10' | 'p25' | 'p50' | 'p75' | 'p90'
  const anomalousDates: string[] = []

  data.forEach(point => {
    // Skip null/undefined values
    if (point.value === null || point.value === undefined) {
      return
    }

    const climatologyValue = getClimatologyValueForDate(
      climatology,
      point.date,
      percentileKey
    )

    if (climatologyValue === null) {
      return // No climatology data for this date
    }

    if (threshold === 'above' && point.value > climatologyValue) {
      anomalousDates.push(point.date)
    } else if (threshold === 'below' && point.value < climatologyValue) {
      anomalousDates.push(point.date)
    }
  })

  return anomalousDates
}

/**
 * Find dates that appear in both arrays (intersection)
 *
 * @param dates1 - First array of ISO date strings
 * @param dates2 - Second array of ISO date strings
 * @returns Array of dates present in both inputs
 */
export function findIntersectingDays(dates1: string[], dates2: string[]): string[] {
  const set1 = new Set(dates1)
  return dates2.filter(date => set1.has(date))
}

/**
 * Calculate anomalies (deviations from climatology median) for each day
 *
 * @param data - Time series data points
 * @param climatology - Climatology data for comparison
 * @returns Array of anomaly data for each day
 */
export function calculateAnomalies(
  data: Era5WrfSeriesPoint[],
  climatology: ClimatologyData
): DayAnomaly[] {
  const anomalies: DayAnomaly[] = []

  data.forEach(point => {
    // Skip null/undefined values
    if (point.value === null || point.value === undefined) {
      return
    }

    const p50 = getClimatologyValueForDate(climatology, point.date, 'p50')
    if (p50 === null) {
      return // No climatology data for this date
    }

    const anomaly = point.value - p50

    // Determine which percentile was exceeded (if any)
    let percentileExceeded: number | null = null

    if (anomaly > 0) {
      // Above median - check upper percentiles
      const p75 = getClimatologyValueForDate(climatology, point.date, 'p75')
      const p90 = getClimatologyValueForDate(climatology, point.date, 'p90')

      if (p90 !== null && point.value > p90) {
        percentileExceeded = 90
      } else if (p75 !== null && point.value > p75) {
        percentileExceeded = 75
      } else {
        percentileExceeded = 50
      }
    } else if (anomaly < 0) {
      // Below median - check lower percentiles
      const p25 = getClimatologyValueForDate(climatology, point.date, 'p25')
      const p10 = getClimatologyValueForDate(climatology, point.date, 'p10')

      if (p10 !== null && point.value < p10) {
        percentileExceeded = 10
      } else if (p25 !== null && point.value < p25) {
        percentileExceeded = 25
      } else {
        percentileExceeded = 50
      }
    }

    anomalies.push({
      date: point.date,
      value: point.value,
      climatologyMedian: p50,
      anomaly,
      percentileExceeded,
    })
  })

  return anomalies
}

/**
 * Calculate comprehensive fire weather statistics
 *
 * Analyzes temperature and humidity data to identify hot, dry, and fire-prone days
 * based on climatological thresholds.
 *
 * @param temperatureData - Daily temperature time series (typically t2_max)
 * @param humidityData - Daily humidity time series (typically rh2_min)
 * @param temperatureClimatology - Temperature climatology for comparison
 * @param humidityClimatology - Humidity climatology for comparison
 * @param thresholds - Optional custom thresholds (uses defaults if not provided)
 * @returns Complete fire weather statistics
 */
export function calculateFireWeatherStatistics(
  temperatureData: Era5WrfSeriesPoint[],
  humidityData: Era5WrfSeriesPoint[],
  temperatureClimatology: ClimatologyData,
  humidityClimatology: ClimatologyData,
  thresholds: ThresholdConfig = DEFAULT_THRESHOLDS
): FireWeatherStatistics {
  // Validate inputs
  if (temperatureData.length === 0 || humidityData.length === 0) {
    return {
      totalDays: 0,
      hotDays: 0,
      dryDays: 0,
      fireProneDays: 0,
      extremelyDryDays: 0,
      hotDayDates: [],
      dryDayDates: [],
      fireProneDayDates: [],
      extremelyDryDayDates: [],
      temperatureAnomalies: [],
      humidityAnomalies: [],
    }
  }

  // Find hot days (temperature > 90th percentile)
  const hotDayDates = detectAnomalousDays(
    temperatureData,
    temperatureClimatology,
    'above',
    thresholds.hotPercentile
  )

  // Find dry days (humidity < 10th percentile)
  const dryDayDates = detectAnomalousDays(
    humidityData,
    humidityClimatology,
    'below',
    thresholds.dryPercentile
  )

  // Find extremely dry days (humidity < 5th percentile)
  // Need to manually check against 5th percentile since it's not in standard bands
  const extremelyDryDayDates = humidityData
    .filter(point => {
      if (point.value === null || point.value === undefined) return false

      // Get 10th percentile as proxy (extremely dry is even lower)
      const p10 = getClimatologyValueForDate(humidityClimatology, point.date, 'p10')
      if (p10 === null) return false

      // Approximate 5th percentile as being significantly below 10th percentile
      // This is a rough estimate; ideally we'd calculate exact 5th percentile
      const p25 = getClimatologyValueForDate(humidityClimatology, point.date, 'p25')
      if (p25 === null) return false

      // Linear extrapolation: p5 ≈ p10 - (p25 - p10)
      const p5Estimate = p10 - (p25 - p10)
      return point.value < p5Estimate
    })
    .map(point => point.date)

  // Find fire-prone days (both hot AND dry)
  const fireProneDayDates = findIntersectingDays(hotDayDates, dryDayDates)

  // Calculate anomalies for context
  const temperatureAnomalies = calculateAnomalies(
    temperatureData,
    temperatureClimatology
  )
  const humidityAnomalies = calculateAnomalies(humidityData, humidityClimatology)

  // Count total days with valid data for both variables
  const validDates = new Set<string>()
  temperatureData.forEach(point => {
    if (point.value !== null && point.value !== undefined) {
      validDates.add(point.date)
    }
  })
  humidityData.forEach(point => {
    if (point.value !== null && point.value !== undefined) {
      validDates.add(point.date)
    }
  })

  return {
    totalDays: validDates.size,
    hotDays: hotDayDates.length,
    dryDays: dryDayDates.length,
    fireProneDays: fireProneDayDates.length,
    extremelyDryDays: extremelyDryDayDates.length,
    hotDayDates,
    dryDayDates,
    fireProneDayDates,
    extremelyDryDayDates,
    temperatureAnomalies,
    humidityAnomalies,
  }
}

/**
 * Get summary statistics for anomalies
 *
 * @param anomalies - Array of day anomalies
 * @returns Summary statistics
 */
export function getAnomalySummary(anomalies: DayAnomaly[]): {
  meanAnomaly: number
  maxAnomaly: number
  minAnomaly: number
  daysAboveMedian: number
  daysBelowMedian: number
} {
  if (anomalies.length === 0) {
    return {
      meanAnomaly: 0,
      maxAnomaly: 0,
      minAnomaly: 0,
      daysAboveMedian: 0,
      daysBelowMedian: 0,
    }
  }

  const anomalyValues = anomalies.map(a => a.anomaly)
  const meanAnomaly =
    anomalyValues.reduce((sum, val) => sum + val, 0) / anomalyValues.length
  const maxAnomaly = Math.max(...anomalyValues)
  const minAnomaly = Math.min(...anomalyValues)
  const daysAboveMedian = anomalies.filter(a => a.anomaly > 0).length
  const daysBelowMedian = anomalies.filter(a => a.anomaly < 0).length

  return {
    meanAnomaly,
    maxAnomaly,
    minAnomaly,
    daysAboveMedian,
    daysBelowMedian,
  }
}

/**
 * Format date for display
 *
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @returns Formatted date string (e.g., "Jun 15")
 */
export function formatFireWeatherDate(dateString: string): string {
  const date = new Date(dateString)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[date.getMonth()]} ${date.getDate()}`
}

/**
 * Group fire-prone days by month for summary display
 *
 * @param dates - Array of ISO date strings
 * @returns Object mapping month names to day counts
 */
export function groupFireProneDaysByMonth(dates: string[]): Record<string, number> {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const grouped: Record<string, number> = {}

  months.forEach(month => {
    grouped[month] = 0
  })

  dates.forEach(dateString => {
    const date = new Date(dateString)
    const monthName = months[date.getMonth()]
    grouped[monthName]++
  })

  return grouped
}

