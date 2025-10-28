import type { Ref } from 'vue'
import type { Era5WrfVariableKey } from '~/utils/era5WrfConstants'
import type { Era5WrfSeriesPoint } from '~/utils/era5WrfTransforms'

/**
 * Composable for preparing ERA5-WRF time series data
 *
 * Handles filtering by date range and transforming API data
 * into chart-ready series format.
 *
 * @param startDate - ISO date string (YYYY-MM-DD)
 * @param endDate - ISO date string (YYYY-MM-DD)
 * @param variables - Array of ERA5-WRF variable keys to prepare
 * @returns Object with apiData and seriesByVariable computed refs
 */
export const useEra5WrfSeries = (
  startDate: Ref<string>,
  endDate: Ref<string>,
  variables: Era5WrfVariableKey[]
) => {
  const dataStore = useDataStore()
  const endpoint = 'era5wrf'

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

    // Get sorted dates
    const dates = Object.keys(apiData.value).sort()

    // Build series for each variable
    variables.forEach(variable => {
      result[variable] = dates
        .filter(date => date >= startDate.value && date <= endDate.value)
        .map(date => ({
          date,
          value: apiData.value[date]?.[variable] ?? null,
        }))
    })

    return result
  })

  return {
    apiData,
    seriesByVariable,
  }
}
