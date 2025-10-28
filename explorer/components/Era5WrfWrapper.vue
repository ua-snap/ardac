<script lang="ts" setup>
// Fire Story extension: Adds climatology, statistics, and fire-specific analysis
// Builds on Xray foundation with specialized controls and overlays
// Uses separate cache key (era5wrf-fire) to avoid collision with basic Xray
import {
  calculateClimatology,
  calculateSeasonalStatistics,
  type SeasonalStats,
  type ClimatologyData,
} from '~/utils/era5WrfStatistics'
import {
  ERA5_WRF_CONFIG,
  CLIMATOLOGY_PERIODS,
  type Era5WrfVariableKey,
} from '~/utils/era5WrfConstants'

const dataStore = useDataStore()
const placesStore = usePlacesStore()

// Use different endpoint to avoid cache collision with Xray
const endpoint = 'era5wrf-fire'

// Define specific variables for fire analysis
const variables: Era5WrfVariableKey[] = ['t2_max', 'rh2_min']
const requestParams = `?vars=${variables.join(',')}`

const apiData = computed(() => dataStore.apiData[endpoint])
const latLng = computed(() => placesStore.latLng)

// Control state (managed by controls component)
const selectedYear = ref(ERA5_WRF_CONFIG.defaultYear)
const climatologyPeriod = ref(ERA5_WRF_CONFIG.defaultClimatologyPeriod)

// Climatology periods from constants
const climatologyPeriods = CLIMATOLOGY_PERIODS

// Computed climatology based on selected period
const currentClimatology = computed((): ClimatologyData | null => {
  if (!apiData.value) return null

  const period = climatologyPeriods[climatologyPeriod.value]
  return calculateClimatology(apiData.value, period.start, period.end)
})

// Get filtered dates for the selected year and season
const filteredDates = computed(() => {
  if (!apiData.value) return []
  const dates = Object.keys(apiData.value).sort()
  const seasonDates = dates.filter(date => {
    const compareDate = date.slice(5)
    return compareDate >= '03-15' && compareDate <= '10-15'
  })
  return seasonDates.filter(date => date.startsWith(`${selectedYear.value}-`))
})

// Computed seasonal statistics
const seasonalStatistics = computed((): SeasonalStats | null => {
  if (
    !apiData.value ||
    !filteredDates.value?.length ||
    !currentClimatology.value
  )
    return null

  const period = climatologyPeriods[climatologyPeriod.value]
  return calculateSeasonalStatistics(
    apiData.value,
    filteredDates.value,
    currentClimatology.value,
    period
  )
})

// API data fetching
const fetchChartData = () => {
  if (!latLng.value) return
  dataStore.fetchData(endpoint, requestParams)
}

// Watch for location changes
watch(latLng, fetchChartData, { immediate: true })

// Cleanup
onUnmounted(() => {
  dataStore.apiData[endpoint] = null
})
</script>

<template>
  <div class="chart-container">
    <!-- Controls Section -->
    <Era5WrfChartControls
      v-model:selectedYear="selectedYear"
      v-model:climatologyPeriod="climatologyPeriod"
      :showAdvancedControls="!!apiData"
    />

    <!-- Statistics Panel -->
    <Era5WrfStatisticsPanel
      :seasonalStatistics="seasonalStatistics"
      :selectedYear="selectedYear"
    />

    <!-- Chart Section -->
    <div v-if="latLng" class="chart-section">
      <Era5WrfChart
        :selectedYear="selectedYear"
        :climatologyPeriod="climatologyPeriod"
        :currentClimatology="currentClimatology"
        :filteredDates="filteredDates"
        chartId="era5-fire-chart"
      />
    </div>

    <!-- No location selected message -->
    <div v-else class="notification is-info">
      <p class="is-size-5">
        Please select a location above to view fire weather data.
      </p>
    </div>
  </div>
</template>

<style scoped>
.chart-section {
  margin-top: 2rem;
}
</style>
