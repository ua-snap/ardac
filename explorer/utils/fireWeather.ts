export type FireWeatherVariableKey =
  | 'bui'
  | 'dc'
  | 'dmc'
  | 'ffmc'
  | 'fwi'
  | 'isi'

export type FireDangerClass = 'Low' | 'Mod' | 'High' | 'VHigh' | 'Ext'

export interface FireWeatherPeriod {
  id: 'baseline' | 'midcentury' | 'latecentury'
  label: string
  startYear: number
  endYear: number
}

export interface FireWeatherVariable {
  key: FireWeatherVariableKey
  label: string
  shortLabel: string
  description: string
  thresholds: {
    high: number
    veryHigh: number
    extreme: number
  }
}

export type FireDangerCounts = Record<FireDangerClass, number>

export type FireDangerModelData = Record<string, FireDangerCounts>

export type FireDangerPeriodData = Record<
  FireWeatherVariableKey,
  FireDangerModelData
>

export type FireDangerResponse = Record<string, FireDangerPeriodData>

export interface FireWeatherRollingStatistics {
  min: number
  mean: number
  max: number
}

export type FireWeatherRollingModelData = Record<
  string,
  FireWeatherRollingStatistics
>

export type FireWeatherRollingPeriodData = Record<
  string,
  FireWeatherRollingModelData
>

export type FireWeatherRollingResponse = Record<
  string,
  Record<FireWeatherVariableKey, FireWeatherRollingPeriodData>
>

export interface FireWeatherEnvelopePoint {
  date: string
  min: number
  median: number
  max: number
}

export interface FireWeatherComparisonSummary {
  baselineMedian: number
  comparisonMedian: number
  change: number
  increasingModels: number
  decreasingModels: number
  unchangedModels: number
  comparisonMin: number
  comparisonMax: number
}

export const FIRE_WEATHER_MODELS = [
  'CNRM-CM6-1-HR',
  'EC-Earth3-Veg',
  'MPI-ESM1-2-HR',
  'MRI-ESM2-0',
] as const

export const FIRE_DANGER_CLASSES: {
  key: FireDangerClass
  label: string
  color: string
}[] = [
  { key: 'Low', label: 'Low', color: '#4c78a8' },
  { key: 'Mod', label: 'Moderate', color: '#72b7b2' },
  { key: 'High', label: 'High', color: '#f2cf5b' },
  { key: 'VHigh', label: 'Very high', color: '#f58518' },
  { key: 'Ext', label: 'Extreme', color: '#b279a2' },
]

export const FIRE_WEATHER_BASELINE: FireWeatherPeriod = {
  id: 'baseline',
  label: '1981–2010',
  startYear: 1981,
  endYear: 2010,
}

export const FIRE_WEATHER_COMPARISON_PERIODS: FireWeatherPeriod[] = [
  {
    id: 'midcentury',
    label: '2040–2069',
    startYear: 2040,
    endYear: 2069,
  },
  {
    id: 'latecentury',
    label: '2070–2099',
    startYear: 2070,
    endYear: 2099,
  },
]

export const FIRE_WEATHER_VARIABLES: FireWeatherVariable[] = [
  {
    key: 'fwi',
    label: 'Fire Weather Index',
    shortLabel: 'FWI',
    description:
      'Overall potential fire intensity, combining expected spread and available fuel.',
    thresholds: { high: 18, veryHigh: 28, extreme: 35 },
  },
  {
    key: 'ffmc',
    label: 'Fine Fuel Moisture Code',
    shortLabel: 'FFMC',
    description:
      'Dryness and ease of ignition of litter and other fine surface fuels.',
    thresholds: { high: 86, veryHigh: 89, extreme: 92 },
  },
  {
    key: 'dmc',
    label: 'Duff Moisture Code',
    shortLabel: 'DMC',
    description:
      'Dryness of loosely compacted organic layers at moderate depth.',
    thresholds: { high: 60, veryHigh: 80, extreme: 100 },
  },
  {
    key: 'dc',
    label: 'Drought Code',
    shortLabel: 'DC',
    description:
      'Longer-term drying in deep organic layers and large woody fuels.',
    thresholds: { high: 350, veryHigh: 400, extreme: 450 },
  },
  {
    key: 'isi',
    label: 'Initial Spread Index',
    shortLabel: 'ISI',
    description:
      'Expected spread potential based on wind speed and fine-fuel moisture.',
    thresholds: { high: 5, veryHigh: 8, extreme: 11 },
  },
  {
    key: 'bui',
    label: 'Buildup Index',
    shortLabel: 'BUI',
    description:
      'Total fuel available for combustion, combining duff and drought codes.',
    thresholds: { high: 60, veryHigh: 90, extreme: 110 },
  },
]

export function buildFireWeatherPath(
  period: FireWeatherPeriod,
  operation: '7_day_rolling_average' | 'summer_fire_danger_rating_days',
  variables?: FireWeatherVariableKey[]
): string {
  const searchParams = new URLSearchParams({ op: operation })
  if (variables?.length) {
    searchParams.set('vars', variables.join(','))
  }

  return `/${period.startYear}/${period.endYear}?${searchParams.toString()}`
}

export function getFireDangerPeriod(
  response: FireDangerResponse | null | undefined,
  period: FireWeatherPeriod
): FireDangerPeriodData | null {
  return response?.[`${period.startYear}-${period.endYear}`] ?? null
}

export function getFireWeatherRollingPeriod(
  response: FireWeatherRollingResponse | null | undefined,
  period: FireWeatherPeriod,
  variable: FireWeatherVariableKey
): FireWeatherRollingPeriodData | null {
  return response?.[`${period.startYear}-${period.endYear}`]?.[variable] ?? null
}

export function calculateHighDangerDays(counts: FireDangerCounts): number {
  return counts.High + counts.VHigh + counts.Ext
}

export function summarizeFireWeatherComparison(
  baseline: FireDangerModelData,
  comparison: FireDangerModelData
): FireWeatherComparisonSummary {
  const baselineValues = FIRE_WEATHER_MODELS.map(model =>
    calculateHighDangerDays(baseline[model])
  )
  const comparisonValues = FIRE_WEATHER_MODELS.map(model =>
    calculateHighDangerDays(comparison[model])
  )
  const changes = comparisonValues.map(
    (value, index) => value - baselineValues[index]
  )

  return {
    baselineMedian: calculateMedian(baselineValues),
    comparisonMedian: calculateMedian(comparisonValues),
    change: calculateMedian(comparisonValues) - calculateMedian(baselineValues),
    increasingModels: changes.filter(change => change > 0).length,
    decreasingModels: changes.filter(change => change < 0).length,
    unchangedModels: changes.filter(change => change === 0).length,
    comparisonMin: Math.min(...comparisonValues),
    comparisonMax: Math.max(...comparisonValues),
  }
}

export function calculateModelEnvelope(
  data: FireWeatherRollingPeriodData
): FireWeatherEnvelopePoint[] {
  const dates = Array.from(
    new Set(
      FIRE_WEATHER_MODELS.flatMap(model => Object.keys(data[model] ?? {}))
    )
  ).sort()

  return dates
    .filter(date => date >= '04-04' && date <= '10-28')
    .map(date => {
      const values = FIRE_WEATHER_MODELS.map(
        model => data[model]?.[date]?.mean
      ).filter((value): value is number => Number.isFinite(value))

      return {
        date,
        min: Math.min(...values),
        median: calculateMedian(values),
        max: Math.max(...values),
      }
    })
    .filter(point => Number.isFinite(point.median))
}

function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0

  const sortedValues = [...values].sort((a, b) => a - b)
  const midpoint = Math.floor(sortedValues.length / 2)

  if (sortedValues.length % 2 === 0) {
    return (sortedValues[midpoint - 1] + sortedValues[midpoint]) / 2
  }

  return sortedValues[midpoint]
}
