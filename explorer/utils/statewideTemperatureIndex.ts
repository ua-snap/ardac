import { STATEWIDE_TEMPERATURE_INDEX_STATIONS } from '~/assets/statewideTemperatureIndexStations'

// Roughly two years of daily data are requested, ending yesterday.
export const STATEWIDE_TEMPERATURE_INDEX_DAYS = 732

// Standard deviation of the normal distribution used to convert the weighted
// mean departure into an index value.  Updated for 2021 per Rick Thoman.
const INDEX_DISTRIBUTION_SD = 0.69423

const DAY_MS = 24 * 60 * 60 * 1000

// Returns the YYYY-MM-DD date that is `days` away from today.
export const offsetDate = (days: number): string => {
  const today = new Date()
  const utcToday = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  )
  return new Date(utcToday + days * DAY_MS).toISOString().slice(0, 10)
}

// Index into the 366-day normals arrays for a YYYY-MM-DD date.
const normalsDayIndex = (date: string): number => {
  const [, month, day] = date.split('-').map(Number)
  return (Date.UTC(2020, month - 1, day) - Date.UTC(2020, 0, 1)) / DAY_MS
}

// Matches NumPy rounding (round half to even), which the original
// Statewide Temperature Index used.
const roundHalfEven = (value: number, decimals: number): number => {
  const factor = 10 ** decimals
  const scaled = value * factor
  let rounded = Math.round(scaled)
  if (Math.abs(scaled % 1) === 0.5 && rounded % 2 !== 0) {
    rounded -= 1
  }
  return rounded / factor
}

// Series expansion of the error function, which has no cancellation error:
// erf(x) = 2/sqrt(pi) * exp(-x^2) * sum((2x^2)^n * x / (1 * 3 * ... * (2n+1)))
const erf = (x: number): number => {
  if (Math.abs(x) > 6) return Math.sign(x)
  let term = x
  let sum = x
  for (let n = 1; Math.abs(term) > 1e-17 * Math.abs(sum); n++) {
    term *= (2 * x * x) / (2 * n + 1)
    sum += term
  }
  return (2 / Math.sqrt(Math.PI)) * Math.exp(-x * x) * sum
}

const normalCdf = (x: number, sd: number): number =>
  0.5 * (1 + erf(x / (sd * Math.SQRT2)))

// Builds the daily index from an ACIS MultiStnData response containing daily
// max and min temperatures for each station, starting on `startDate`.
export const buildDailyIndex = (
  acisData: AcisMultiStationData,
  startDate: string
): StatewideTemperatureIndexDay[] => {
  const startMs = Date.parse(startDate)
  const departuresByDate: Record<string, number[]> = {}

  acisData.data.forEach(stationData => {
    const usw = stationData.meta.sids
      .find(sid => sid.includes('USW'))
      ?.split(' ')[0]
    const station = usw && STATEWIDE_TEMPERATURE_INDEX_STATIONS[usw]
    if (!station) return

    stationData.data.forEach(([maxTemp, minTemp], i) => {
      const max = parseFloat(maxTemp)
      const min = parseFloat(minTemp)
      if (isNaN(max) || isNaN(min)) return

      const date = new Date(startMs + i * DAY_MS).toISOString().slice(0, 10)
      const dayIndex = normalsDayIndex(date)
      const average = (max + min) / 2

      // Departure in standard deviations from the daily normal
      const departure = roundHalfEven(
        (average - station.mean[dayIndex]) / station.sd[dayIndex],
        3
      )

      departuresByDate[date] ??= []
      departuresByDate[date].push(departure * station.weight)
    })
  })

  return Object.keys(departuresByDate)
    .sort()
    .map(date => {
      const weightedDepartures = departuresByDate[date]
      const meanDeparture =
        weightedDepartures.reduce((sum, value) => sum + value, 0) /
        weightedDepartures.length
      const probability = normalCdf(meanDeparture, INDEX_DISTRIBUTION_SD)

      return {
        date,
        dailyIndex: roundHalfEven(20 * (probability - 0.5), 2),
        count: weightedDepartures.length,
      }
    })
}

// Trailing average over the previous `window` days of index values.
export const rollingMean = (values: number[], window: number) =>
  values.map((_, i) => {
    if (i < window - 1) return null
    const windowValues = values.slice(i - window + 1, i + 1)
    const mean = windowValues.reduce((sum, value) => sum + value, 0) / window
    return roundHalfEven(mean, 2)
  })

export const dailyIndexToCsv = (dailyIndex: StatewideTemperatureIndexDay[]) =>
  ['Date,Daily Index']
    .concat(dailyIndex.map(day => `${day.date},${day.dailyIndex}`))
    .join('\n')
