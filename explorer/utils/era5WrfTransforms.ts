import {
  ERA5_WRF_VARIABLE_LOOKUP,
  ERA5_WRF_VARIABLES,
  ERA5_WRF_AGGREGATION_MODES,
  type Era5WrfVariableKey,
} from '~/utils/era5WrfConstants'

export type Era5WrfAggregationMode =
  (typeof ERA5_WRF_AGGREGATION_MODES)[number]['key']

export interface Era5WrfSeriesPoint {
  date: string
  value: number | null
  label?: string
}

const SEASON_LABELS = ['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec']
const SEASON_START_MONTH = [1, 4, 7, 10]

const toDate = (value: string) => new Date(`${value}T00:00:00Z`)

const getDayOfYear = (date: Date) => {
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  const diff = date.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

const normalizeWindDirection = (value: number) => {
  const normalized = value % 360
  return normalized < 0 ? normalized + 360 : normalized
}

interface AggregateBucket {
  sum: number
  count: number
  min: number
  max: number
  // For vector mean (wind direction)
  sumSin: number
  sumCos: number
}

const createBucket = (): AggregateBucket => ({
  sum: 0,
  count: 0,
  min: Number.POSITIVE_INFINITY,
  max: Number.NEGATIVE_INFINITY,
  sumSin: 0,
  sumCos: 0,
})

const addValueToBucket = (
  bucket: AggregateBucket,
  value: number,
  mode: 'mean' | 'sum' | 'vector-mean'
) => {
  if (Number.isNaN(value)) return
  if (mode === 'sum' || mode === 'mean') {
    bucket.sum += value
    bucket.count += 1
    bucket.min = Math.min(bucket.min, value)
    bucket.max = Math.max(bucket.max, value)
  }

  if (mode === 'vector-mean') {
    const radians = (value * Math.PI) / 180
    bucket.sumSin += Math.sin(radians)
    bucket.sumCos += Math.cos(radians)
    bucket.count += 1
  }
}

const finalizeBucket = (
  bucket: AggregateBucket,
  mode: 'mean' | 'sum' | 'vector-mean'
) => {
  if (bucket.count === 0) return null

  if (mode === 'sum') {
    return bucket.sum
  }

  if (mode === 'mean') {
    return bucket.sum / bucket.count
  }

  const meanRadians = Math.atan2(bucket.sumSin, bucket.sumCos)
  const degrees = (meanRadians * 180) / Math.PI
  return normalizeWindDirection(degrees)
}

const getSeasonKey = (dateString: string) => {
  const date = toDate(dateString)
  const year = date.getUTCFullYear()
  const dayOfYear = getDayOfYear(date)
  const index = Math.min(SEASON_LABELS.length - 1, Math.floor(dayOfYear / 91))
  const month = SEASON_START_MONTH[index]
  const seasonStart = new Date(Date.UTC(year, month - 1, 1))
  return {
    label: `${SEASON_LABELS[index]} ${year}`,
    key: `${year}-${String(month).padStart(2, '0')}-01`,
  }
}

export const getAllVariables = () => ERA5_WRF_VARIABLES.map(v => v.key)

export const prepareEra5WrfSeries = (
  apiData: Record<string, any> | null,
  variables: Era5WrfVariableKey[],
  aggregationMode: Era5WrfAggregationMode
): Partial<Record<Era5WrfVariableKey, Era5WrfSeriesPoint[]>> => {
  if (!apiData)
    return variables.reduce(
      (acc, variable) => {
        acc[variable] = []
        return acc
      },
      {} as Partial<Record<Era5WrfVariableKey, Era5WrfSeriesPoint[]>>
    )

  const sortedDates = Object.keys(apiData).sort()
  const result: Partial<Record<Era5WrfVariableKey, Era5WrfSeriesPoint[]>> = {}

  if (aggregationMode === 'daily') {
    variables.forEach(variable => {
      result[variable] = sortedDates.map(date => {
        const value = apiData[date]?.[variable]
        return {
          date,
          value: value === null || value === undefined ? null : Number(value),
          label: date,
        }
      })
    })
    return result
  }

  const bucketsByVariable: Record<
    Era5WrfVariableKey,
    Record<string, AggregateBucket>
  > = {} as any

  variables.forEach(variable => {
    bucketsByVariable[variable] = {}
  })

  sortedDates.forEach(date => {
    variables.forEach(variable => {
      const rawValue = apiData[date]?.[variable]
      if (rawValue === null || rawValue === undefined) return

      const meta = ERA5_WRF_VARIABLE_LOOKUP[variable]
      const bucketMode = meta.aggregator

      let bucketKey: string
      let label: string

      if (aggregationMode === 'monthly') {
        bucketKey = `${date.slice(0, 7)}-01`
        label = `${date.slice(0, 7)}`
      } else {
        const season = getSeasonKey(date)
        bucketKey = season.key
        label = season.label
      }

      const bucketCollection = bucketsByVariable[variable]
      if (!bucketCollection[bucketKey]) {
        bucketCollection[bucketKey] = createBucket()
      }

      addValueToBucket(
        bucketCollection[bucketKey],
        Number(rawValue),
        bucketMode
      )
      ;(bucketCollection[bucketKey] as any).label = label
    })
  })

  variables.forEach(variable => {
    const entries = Object.entries(bucketsByVariable[variable])
    entries.sort((a, b) => (a[0] < b[0] ? -1 : 1))
    const meta = ERA5_WRF_VARIABLE_LOOKUP[variable]
    const mode = meta.aggregator

    result[variable] = entries.map(([key, bucket]) => {
      const value = finalizeBucket(bucket, mode)
      const label = (bucket as any).label as string | undefined
      return {
        date: key,
        value: value,
        label,
      }
    })
  })

  return result
}

export const downsampleSeries = (
  series: Era5WrfSeriesPoint[],
  maxPoints = 2000
) => {
  if (series.length <= maxPoints) return series

  const stride = Math.ceil(series.length / maxPoints)
  return series.filter(
    (_, index) => index % stride === 0 || index === series.length - 1
  )
}

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

export const filterSeriesByDateRange = (
  series: Partial<Record<Era5WrfVariableKey, Era5WrfSeriesPoint[]>>,
  startDate: string,
  endDate: string
): Partial<Record<Era5WrfVariableKey, Era5WrfSeriesPoint[]>> => {
  if (!startDate || !endDate) return series

  const filtered: Partial<Record<Era5WrfVariableKey, Era5WrfSeriesPoint[]>> = {}

  Object.entries(series).forEach(([variable, points]) => {
    if (!points) {
      filtered[variable as Era5WrfVariableKey] = []
      return
    }

    filtered[variable as Era5WrfVariableKey] = points.filter(
      point => point.date >= startDate && point.date <= endDate
    )
  })

  return filtered
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

const DIRECTION_SECTORS = 16 // 16 compass directions (22.5° each)
const SECTOR_SIZE = 360 / DIRECTION_SECTORS

const DIRECTION_LABELS = [
  'N',
  'NNE',
  'NE',
  'ENE',
  'E',
  'ESE',
  'SE',
  'SSE',
  'S',
  'SSW',
  'SW',
  'WSW',
  'W',
  'WNW',
  'NW',
  'NNW',
]

// Meteorological wind speed ranges (m/s)
const SPEED_BINS = [
  { min: 0, max: 0.5, label: 'Calm (0-0.5)' },
  { min: 0.5, max: 3, label: 'Light (0.5-3)' },
  { min: 3, max: 5, label: 'Gentle (3-5)' },
  { min: 5, max: 8, label: 'Moderate (5-8)' },
  { min: 8, max: 11, label: 'Fresh (8-11)' },
  { min: 11, max: 14, label: 'Strong (11-14)' },
  { min: 14, max: Infinity, label: 'Very Strong (>14)' },
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
        speedRange: SPEED_BINS[speedIdx].label,
        frequency,
        count,
      })
    }
  }

  return {
    bins,
    speedRanges: SPEED_BINS.map(b => b.label),
    directionSectors,
    totalCount,
  }
}
