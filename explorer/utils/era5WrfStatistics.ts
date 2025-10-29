/**
 * Statistical utility functions for ERA5-WRF climo norms, percentiles, counting days meeting criteria, etc.
 */

export interface HotDryStats {
  period: string
  hotDays: number
  dryDays: number
  compoundEvents: Array<{
    date: string
    temperature: number
    humidity: number
  }>
  temperatureAnomaly: number
  humidityAnomaly: number
}

export interface ClimatologyData {
  [dayOfYear: string]: {
    t2_max?: {
      mean: number
      p10: number
      p90: number
    }
    rh2_min?: {
      mean: number
      p10: number
      p90: number
    }
  }
}

/**
 * Calculate mean of an array of numbers
 */
export const calculateMean = (values: number[]): number =>
  values.reduce((a, b) => a + b, 0) / values.length

/**
 * Calculate percentile of an array of numbers
 */
export const calculatePercentile = (values: number[], percentile: number): number => {
  const sorted = [...values].sort((a, b) => a - b)
  const index = (percentile / 100) * (sorted.length - 1)
  const lower = Math.floor(index)
  const upper = Math.ceil(index)
  const weight = index % 1
  return sorted[lower] * (1 - weight) + sorted[upper] * weight
}

/**
 * Calculate climatology for a selected period, right now these are specific to t2_max, rh2_min, but could be extended to other variables.
 */
export const calculateClimatology = (
  data: Record<string, any>,
  startYear: number,
  endYear: number
): ClimatologyData => {
  const climatology: ClimatologyData = {}

  // Group data by day-of-year (MM-DD)
  const dayOfYearData: Record<string, any> = {}

  Object.entries(data).forEach(([date, values]) => {
    const year = parseInt(date.substring(0, 4))
    const dayOfYear = date.substring(5) // MM-DD

    // Filter for climatology period
    if (year >= startYear && year <= endYear) {
      if (!dayOfYearData[dayOfYear]) {
        dayOfYearData[dayOfYear] = { t2_max: [], rh2_min: [] }
      }
      if (values.t2_max !== null && values.t2_max !== undefined) {
        dayOfYearData[dayOfYear].t2_max.push(values.t2_max)
      }
      if (values.rh2_min !== null && values.rh2_min !== undefined) {
        dayOfYearData[dayOfYear].rh2_min.push(values.rh2_min)
      }
    }
  })

  // Calculate statistics for each day-of-year
  Object.entries(dayOfYearData).forEach(
    ([dayOfYear, values]: [string, any]) => {
      climatology[dayOfYear] = {}

      if (values.t2_max.length > 0) {
        climatology[dayOfYear].t2_max = {
          mean: calculateMean(values.t2_max),
          p10: calculatePercentile(values.t2_max, 10),
          p90: calculatePercentile(values.t2_max, 90),
        }
      }

      if (values.rh2_min.length > 0) {
        climatology[dayOfYear].rh2_min = {
          mean: calculateMean(values.rh2_min),
          p10: calculatePercentile(values.rh2_min, 10),
          p90: calculatePercentile(values.rh2_min, 90),
        }
      }
    }
  )

  return climatology
}

/**
 * Calculate seasonal statistics for the selected year vs climatology, also specific to rh2_min and t2_max
 */
export const calculateHotDryStatistics = (
  apiData: Record<string, any>,
  filteredDates: string[],
  climatology: ClimatologyData,
  period: { label: string; start: number; end: number }
): HotDryStats => {
  const stats: HotDryStats = {
    period: period.label,
    hotDays: 0,
    dryDays: 0,
    compoundEvents: [],
    temperatureAnomaly: 0,
    humidityAnomaly: 0,
  }

  let tempAnomalySum = 0
  let humidityAnomalySum = 0
  let validTempDays = 0
  let validHumidityDays = 0

  filteredDates.forEach(date => {
    const dayOfYear = date.slice(5)
    const dayData = apiData[date]
    const climatologyDay = climatology[dayOfYear]

    if (!climatologyDay) return

    // Temperature analysis
    if (climatologyDay.t2_max) {
      const tempAnomaly = dayData.t2_max - climatologyDay.t2_max.mean
      tempAnomalySum += tempAnomaly
      validTempDays++

      // Check temperature extremes
      if (dayData.t2_max > climatologyDay.t2_max.p90) stats.hotDays++
    }

    // Humidity analysis
    if (climatologyDay.rh2_min) {
      const humidityAnomaly = dayData.rh2_min - climatologyDay.rh2_min.mean
      humidityAnomalySum += humidityAnomaly
      validHumidityDays++

      // Check humidity extremes
      if (dayData.rh2_min < climatologyDay.rh2_min.p10) stats.dryDays++
    }

    // Compound extreme events (hot + dry)
    if (
      climatologyDay.t2_max &&
      climatologyDay.rh2_min &&
      dayData.t2_max > climatologyDay.t2_max.p90 &&
      dayData.rh2_min < climatologyDay.rh2_min.p10
    ) {
      stats.compoundEvents.push({
        date,
        temperature: dayData.t2_max,
        humidity: dayData.rh2_min,
      })
    }
  })

  // Calculate final statistics
  if (validTempDays > 0) {
    stats.temperatureAnomaly = tempAnomalySum / validTempDays
  }

  if (validHumidityDays > 0) {
    stats.humidityAnomaly = humidityAnomalySum / validHumidityDays
  }

  return stats  
}
