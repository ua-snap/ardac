import type { Era5WrfVariableKey } from '~/utils/era5WrfConstants'

/**
 * Climatology band data for a single day-of-year
 */
export interface ClimatologyBand {
  dayOfYear: number // 1-365 (366 for leap years)
  date: string // ISO date string aligned to target year
  p10: number // 10th percentile
  p25: number // 25th percentile
  p50: number // 50th percentile (median)
  p75: number // 75th percentile
  p90: number // 90th percentile
  count: number // Number of values used in calculation
}

/**
 * Complete climatology data for a variable
 */
export interface ClimatologyData {
  variable: Era5WrfVariableKey
  period: {
    startYear: number
    endYear: number
  }
  bands: ClimatologyBand[]
}

/**
 * Calculate percentiles from an array of numbers
 *
 * @param values - Array of numbers (will be sorted internally)
 * @param percentiles - Array of percentile values (0-100)
 * @returns Object mapping percentile keys to values
 */
export function calculatePercentiles(
  values: number[],
  percentiles: number[]
): Record<string, number> {
  if (values.length === 0) {
    throw new Error('Cannot calculate percentiles of empty array')
  }

  // Sort values in ascending order
  const sorted = [...values].sort((a, b) => a - b)
  const result: Record<string, number> = {}

  percentiles.forEach(p => {
    if (p < 0 || p > 100) {
      throw new Error(`Invalid percentile: ${p}. Must be between 0 and 100.`)
    }

    // Linear interpolation method (R-7, Excel PERCENTILE.INC)
    const index = (p / 100) * (sorted.length - 1)
    const lower = Math.floor(index)
    const upper = Math.ceil(index)
    const fraction = index - lower

    if (lower === upper) {
      result[`p${p}`] = sorted[lower]
    } else {
      result[`p${p}`] =
        sorted[lower] + fraction * (sorted[upper] - sorted[lower])
    }
  })

  return result
}

/**
 * Get day-of-year from ISO date string (1-365 or 1-366)
 *
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @returns Day of year (1-based)
 */
export function getDayOfYear(dateString: string): number {
  const date = new Date(dateString)
  const yearStart = new Date(date.getFullYear(), 0, 1)
  const diff = date.getTime() - yearStart.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  return Math.floor(diff / oneDay) + 1
}

/**
 * Check if a year is a leap year
 *
 * @param year - Year to check
 * @returns True if leap year
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

/**
 * Group data by day-of-year across multiple years
 *
 * @param apiData - ERA5-WRF API data (date -> variables)
 * @param variable - Variable key to extract
 * @param startYear - Start year of climatology period (inclusive)
 * @param endYear - End year of climatology period (inclusive)
 * @returns Map of day-of-year to array of values
 */
export function groupByDayOfYear(
  apiData: Record<string, any>,
  variable: Era5WrfVariableKey,
  startYear: number,
  endYear: number
): Map<number, number[]> {
  const grouped = new Map<number, number[]>()

  // Initialize map with empty arrays for all possible DOYs (1-365)
  // We exclude Feb 29 (DOY 60 in leap years) to ensure consistent comparison
  for (let doy = 1; doy <= 365; doy++) {
    grouped.set(doy, [])
  }

  Object.keys(apiData).forEach(dateString => {
    const date = new Date(dateString)
    const year = date.getFullYear()

    // Skip if outside climatology period
    if (year < startYear || year > endYear) {
      return
    }

    const value = apiData[dateString]?.[variable]

    // Skip null/undefined values
    if (value === null || value === undefined || isNaN(value)) {
      return
    }

    let doy = getDayOfYear(dateString)

    // Handle leap year: skip Feb 29 (DOY 60), shift all subsequent days back by 1
    if (isLeapYear(year) && doy === 60) {
      return // Skip Feb 29
    }
    if (isLeapYear(year) && doy > 60) {
      doy -= 1 // Shift days after Feb 29 back by 1
    }

    grouped.get(doy)?.push(value)
  })

  return grouped
}

/**
 * Align climatology bands to a specific year for chart x-axis
 *
 * This converts day-of-year values to actual dates in the target year,
 * allowing climatology bands to align with time series data.
 *
 * @param bands - Climatology bands with generic dates
 * @param year - Target year to align to
 * @returns Bands with dates aligned to target year
 */
export function alignBandsToYear(
  bands: ClimatologyBand[],
  year: number
): ClimatologyBand[] {
  return bands.map(band => {
    // Create date for this DOY in the target year
    const date = new Date(year, 0, 1) // Jan 1 of target year
    date.setDate(band.dayOfYear)

    return {
      ...band,
      date: date.toISOString().split('T')[0], // YYYY-MM-DD
    }
  })
}

/**
 * Calculate climatology percentiles for ERA5-WRF data
 *
 * Groups data by day-of-year and calculates percentiles across all years
 * in the climatology period. Excludes Feb 29 to ensure consistent comparison.
 *
 * @param apiData - ERA5-WRF API data (date -> variables)
 * @param variable - Variable key to calculate climatology for
 * @param startYear - Start year of climatology period (inclusive)
 * @param endYear - End year of climatology period (inclusive)
 * @param targetYear - Optional year to align bands to (defaults to endYear)
 * @returns Complete climatology data with percentile bands
 */
export function calculateClimatology(
  apiData: Record<string, any>,
  variable: Era5WrfVariableKey,
  startYear: number,
  endYear: number,
  targetYear?: number
): ClimatologyData {
  if (!apiData || Object.keys(apiData).length === 0) {
    throw new Error('API data is empty')
  }

  if (startYear > endYear) {
    throw new Error(
      `Invalid climatology period: start year (${startYear}) > end year (${endYear})`
    )
  }

  const alignYear = targetYear ?? endYear

  // Group data by day-of-year
  const grouped = groupByDayOfYear(apiData, variable, startYear, endYear)

  // Calculate percentiles for each day-of-year
  const bands: ClimatologyBand[] = []

  for (let doy = 1; doy <= 365; doy++) {
    const values = grouped.get(doy) ?? []

    // Skip days with insufficient data
    if (values.length < 3) {
      continue
    }

    const percentiles = calculatePercentiles(values, [10, 25, 50, 75, 90])

    // Create temporary date for this DOY (will be aligned later)
    const tempDate = new Date(alignYear, 0, 1)
    tempDate.setDate(doy)

    bands.push({
      dayOfYear: doy,
      date: tempDate.toISOString().split('T')[0],
      p10: percentiles.p10,
      p25: percentiles.p25,
      p50: percentiles.p50,
      p75: percentiles.p75,
      p90: percentiles.p90,
      count: values.length,
    })
  }

  // Align bands to target year if specified
  const alignedBands = alignBandsToYear(bands, alignYear)

  return {
    variable,
    period: {
      startYear,
      endYear,
    },
    bands: alignedBands,
  }
}

/**
 * Get climatology value for a specific date and percentile
 *
 * Useful for comparing a single date's value against climatology
 *
 * @param climatology - Climatology data
 * @param date - ISO date string to look up
 * @param percentile - Percentile to retrieve ('p10', 'p25', 'p50', 'p75', 'p90')
 * @returns Percentile value for that day-of-year, or null if not found
 */
export function getClimatologyValueForDate(
  climatology: ClimatologyData,
  date: string,
  percentile: 'p10' | 'p25' | 'p50' | 'p75' | 'p90'
): number | null {
  const year = new Date(date).getFullYear()
  let doy = getDayOfYear(date)

  // Handle leap year adjustment
  if (isLeapYear(year) && doy === 60) {
    return null // Feb 29 has no climatology
  }
  if (isLeapYear(year) && doy > 60) {
    doy -= 1
  }

  const band = climatology.bands.find(b => b.dayOfYear === doy)
  return band ? band[percentile] : null
}
