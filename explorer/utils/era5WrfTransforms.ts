/**
 * ERA5-WRF data transformation utilities
 * Provides wind rose preparation and date window helpers
 */

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

const DIRECTION_LABELS = [
  'N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW',
]

// Wind speed ranges (m/s)
const SPEED_BINS = [
  { min: 0, max: 0.5},
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
        speedRange: `${SPEED_BINS[speedIdx].min}-${SPEED_BINS[speedIdx].max}`,
        frequency,
        count,
      })
    }
  }

  return {
    bins,
    speedRanges: SPEED_BINS.map(b => `${b.min}-${b.max}`),
    directionSectors,
    totalCount,
  }
}
