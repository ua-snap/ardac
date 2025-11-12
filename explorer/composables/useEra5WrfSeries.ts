import type { Ref } from 'vue'
import { ERA5_WRF_CONFIG, ERA5_SEASONS } from '~/utils/era5WrfConstants'
import type { Era5WrfVariableKey } from '~/utils/era5WrfConstants'
import type { Era5WrfSeriesPoint } from '~/utils/era5WrfTransforms'

/**
 * Composable for preparing ERA5-WRF time series data
 *
 * Handles filtering by date range and transforming API data
 * into chart-ready series format. For fire weather analysis,
 * automatically filters to fire season (March 15 - October 15).
 *
 * @param startDate - ISO date string (YYYY-MM-DD)
 * @param endDate - ISO date string (YYYY-MM-DD)
 * @param variables - Array of ERA5-WRF variable keys to prepare
 * @param filterToFireSeason - Whether to filter to fire season dates (default: false)
 * @returns Object with apiData and seriesByVariable computed refs
 */
export const useEra5WrfSeries = (
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

    // Get sorted dates
    let dates = Object.keys(apiData.value).sort()

    // Filter to fire season if requested (March 15 - October 15)
    if (filterToFireSeason) {
      const { start, end } = ERA5_SEASONS.fireSeasonDates
      dates = dates.filter(date => {
        const monthDay = date.slice(5) // Extract MM-DD from YYYY-MM-DD
        return monthDay >= start && monthDay <= end
      })
    }

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
