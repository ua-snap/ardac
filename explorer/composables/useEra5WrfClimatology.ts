import type { Ref, ComputedRef } from 'vue'
import type { Era5WrfVariableKey } from '~/utils/era5WrfConstants'
import { calculateClimatology, getAvailableYears } from '~/utils/era5WrfClimatology'
import type { ClimatologyData } from '~/utils/era5WrfClimatology'
import { ERA5_WRF_CONFIG, ERA5_CLIMATOLOGY_PERIODS } from '~/utils/era5WrfConstants'

/**
 * Options for useEra5WrfClimatology composable
 */
export interface UseEra5WrfClimatologyOptions {
  variables: Era5WrfVariableKey[] // Variables to calculate climatology for
  climatologyPeriod: Ref<string> // Climatology baseline period ('1960-1989' or '1990-2019')
  selectedYear: Ref<number> // Year to align climatology bands to (for chart display)
}

/**
 * Return type for useEra5WrfClimatology composable
 */
export interface UseEra5WrfClimatologyReturn {
  climatologyData: ComputedRef<Record<string, ClimatologyData>> // Climatology for each variable
  availableYears: ComputedRef<number[]> // Years available in API data
  isCalculating: Ref<boolean> // Loading state
  error: Ref<string | null> // Error state
  hasData: ComputedRef<boolean> // Whether climatology data is available
}

/**
 * Composable for reactive ERA5-WRF climatology data management
 *
 * Automatically calculates climatology when API data, climatology period,
 * or selected year changes. Provides loading states and error handling.
 *
 * @param options - Configuration options
 * @returns Reactive climatology data and state
 *
 * @example
 * ```vue
 * <script setup>
 * const selectedYear = ref(2023)
 * const climatologyPeriod = ref('1991-2020')
 *
 * const { climatologyData, isCalculating, error } = useEra5WrfClimatology({
 *   variables: ['t2_max', 't2_mean', 't2_min'],
 *   climatologyPeriod,
 *   selectedYear
 * })
 * </script>
 * ```
 */
export const useEra5WrfClimatology = (
  options: UseEra5WrfClimatologyOptions
): UseEra5WrfClimatologyReturn => {
  const dataStore = useDataStore()
  const endpoint = ERA5_WRF_CONFIG.endpoint

  const isCalculating = ref(false)
  const error = ref<string | null>(null)

  // Get available years from API data
  const availableYears = computed<number[]>(() => {
    const apiData = dataStore.apiData[endpoint]
    if (!apiData) return []
    return getAvailableYears(apiData)
  })

  // Calculate climatology data for all variables
  const climatologyData = computed<Record<string, ClimatologyData>>(() => {
    const apiData = dataStore.apiData[endpoint]

    // Return empty if no API data
    if (!apiData || Object.keys(apiData).length === 0) {
      return {}
    }

    // Get period from constant
    const periodKey = options.climatologyPeriod.value as keyof typeof ERA5_CLIMATOLOGY_PERIODS
    const period = ERA5_CLIMATOLOGY_PERIODS[periodKey]
    
    if (!period) {
      error.value = `Invalid climatology period: ${periodKey}`
      return {}
    }

    const { start: startYear, end: endYear } = period

    // Validate selected year
    const targetYear = options.selectedYear.value
    if (!targetYear || targetYear < 1900 || targetYear > 2100) {
      error.value = `Invalid target year: ${targetYear}`
      return {}
    }

    // Clear any previous errors
    error.value = null

    // Calculate climatology for each variable
    const result: Record<string, ClimatologyData> = {}

    try {
      isCalculating.value = true

      options.variables.forEach(variable => {
        try {
          result[variable] = calculateClimatology(
            apiData,
            variable,
            startYear,
            endYear,
            targetYear
          )
        } catch (err) {
          console.error(`Failed to calculate climatology for ${variable}:`, err)
          // Continue with other variables even if one fails
        }
      })

      isCalculating.value = false
    } catch (err) {
      isCalculating.value = false
      error.value = err instanceof Error ? err.message : 'Unknown error calculating climatology'
      console.error('Error calculating climatology:', err)
      return {}
    }

    return result
  })

  // Check if we have valid climatology data
  const hasData = computed<boolean>(() => {
    return Object.keys(climatologyData.value).length > 0
  })

  return {
    climatologyData,
    availableYears,
    isCalculating,
    error,
    hasData,
  }
}

