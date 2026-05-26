import type { Era5WrfSeriesPoint } from '~/utils/era5WrfTransforms'
import type { Era5WrfVariableKey } from '~/utils/era5WrfConstants'

export type Era5WrfPointData = Record<
  string,
  Record<string, number | null | undefined>
>

export const celsiusToFahrenheit = (valueC: number | null): number | null => {
  if (valueC === null || valueC === undefined) return null
  return (valueC * 9) / 5 + 32
}

export const filterEra5WrfSeriesForWindow = (
  apiData: Era5WrfPointData,
  startDate: string,
  endDate: string,
  variables: Era5WrfVariableKey[]
): Record<string, Era5WrfSeriesPoint[]> => {
  const result: Record<string, Era5WrfSeriesPoint[]> = {}
  variables.forEach(variable => {
    result[variable] = []
  })

  const dates = Object.keys(apiData)
    .filter(date => date >= startDate && date <= endDate)
    .sort()

  variables.forEach(variable => {
    result[variable] = dates.map(date => ({
      date,
      value: apiData[date]?.[variable] ?? null,
    }))
  })

  return result
}

export const filterEra5WrfSeriesForWindowFahrenheit = (
  apiData: Era5WrfPointData,
  startDate: string,
  endDate: string,
  variables: Era5WrfVariableKey[]
): Record<string, Era5WrfSeriesPoint[]> => {
  const series = filterEra5WrfSeriesForWindow(
    apiData,
    startDate,
    endDate,
    variables
  )

  const fahrenheitSeries: Record<string, Era5WrfSeriesPoint[]> = {}
  variables.forEach(variable => {
    fahrenheitSeries[variable] = series[variable].map(point => ({
      ...point,
      value: celsiusToFahrenheit(point.value),
    }))
  })

  return fahrenheitSeries
}
