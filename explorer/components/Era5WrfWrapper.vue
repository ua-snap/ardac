<script lang="ts" setup>
import {
  calculateClimatology,
  calculateSeasonalStatistics,
  type SeasonalStats,
  type ClimatologyData,
} from '~/utils/era5WrfStatistics'
import { ERA5_WRF_CONFIG, CLIMATOLOGY_PERIODS } from '~/utils/era5WrfConstants'

const dataStore = useDataStore()
const placesStore = usePlacesStore()

const endpoint = ERA5_WRF_CONFIG.endpoint
const requestParams = ERA5_WRF_CONFIG.requestParams

const apiData = computed(() => dataStore.apiData[endpoint])
const latLng = computed(() => placesStore.latLng)

// Control state (managed by controls component)
const showTemperature = ref(true)
const showHumidity = ref(true)
const selectedYear = ref(ERA5_WRF_CONFIG.defaultYear)
const showClimatology = ref(false)
const showPercentileBands = ref(false)
const highlightExtremes = ref(false)
const climatologyPeriod = ref(ERA5_WRF_CONFIG.defaultClimatologyPeriod)

// Climatology periods from constants
const climatologyPeriods = CLIMATOLOGY_PERIODS

// Computed climatology based on selected period
const currentClimatology = computed((): ClimatologyData | null => {
  if (!apiData.value || !showClimatology.value) return null

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
  if (latLng.value) {
    dataStore.fetchData(endpoint, requestParams)
  }
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
      v-model:showTemperature="showTemperature"
      v-model:showHumidity="showHumidity"
      v-model:selectedYear="selectedYear"
      v-model:showClimatology="showClimatology"
      v-model:showPercentileBands="showPercentileBands"
      v-model:highlightExtremes="highlightExtremes"
      v-model:climatologyPeriod="climatologyPeriod"
      :showAdvancedControls="!!apiData"
    />

    <!-- Statistics Panel -->
    <Era5WrfStatisticsPanel
      :seasonalStatistics="seasonalStatistics"
      :selectedYear="selectedYear"
      :showClimatology="showClimatology"
    />

    <!-- Chart Section -->
    <div v-if="latLng" class="chart-section">
      <Era5WrfChart
        :showTemperature="showTemperature"
        :showHumidity="showHumidity"
        :selectedYear="selectedYear"
        :showClimatology="showClimatology"
        :showPercentileBands="showPercentileBands"
        :highlightExtremes="highlightExtremes"
        :climatologyPeriod="climatologyPeriod"
        :currentClimatology="currentClimatology"
        :filteredDates="filteredDates"
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
