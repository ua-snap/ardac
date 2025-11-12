<script lang="ts" setup>
import { calculateFireWeatherStatistics } from '~/utils/era5WrfStatistics'
import {
  ERA5_WRF_CONFIG,
  ERA5_CLIMATOLOGY_PERIODS,
  type Era5WrfVariableKey,
} from '~/utils/era5WrfConstants'

interface Props {
  showLocationPrompt?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showLocationPrompt: true,
})

const { $Plotly } = useNuxtApp()
const dataStore = useDataStore()
const placesStore = usePlacesStore()
const { latLng } = storeToRefs(placesStore)

const endpoint = ERA5_WRF_CONFIG.endpoint

// User-controlled state
const selectedYear = ref<number>(2023)
const climatologyPeriod = ref<string>(ERA5_WRF_CONFIG.defaultClimatologyPeriod)

const dataError = computed(() => dataStore.dataErrors[endpoint] ?? false)

// Compute available years from API data
const availableYears = computed(() => {
  const apiData = dataStore.apiData[endpoint]
  if (!apiData) return []
  const dates = Object.keys(apiData)
  const years = [...new Set(dates.map(d => new Date(d).getFullYear()))]
  return years.sort((a, b) => a - b)
})

// Initialize with most recent complete year when data loads
watch(
  availableYears,
  years => {
    if (years.length && !selectedYear.value) {
      // Use second-to-last year (most recent complete year)
      selectedYear.value =
        years.length > 1 ? years[years.length - 2] : years[years.length - 1]
    }
  },
  { immediate: true }
)

// Date range for selected year
const startDate = computed(() => `${selectedYear.value}-01-01`)
const endDate = computed(() => `${selectedYear.value}-12-31`)

// Define all variables to visualize
const variables: Era5WrfVariableKey[] = [
  't2_max',
  't2_mean',
  't2_min',
  'rh2_max',
  'rh2_mean',
  'rh2_min',
  'rainnc_sum',
]

// Get series data for selected year, filtered to fire season
const { apiData, seriesByVariable } = useEra5WrfSeries(
  startDate,
  endDate,
  variables,
  true
)

// Calculate climatology
const climatologyVariables: Era5WrfVariableKey[] = [
  't2_max',
  't2_mean',
  't2_min',
  'rh2_max',
  'rh2_mean',
  'rh2_min',
]

const { climatologyData, hasData: hasClimatologyData } = useEra5WrfClimatology({
  variables: climatologyVariables,
  climatologyPeriod,
  selectedYear,
})

// Calculate fire weather statistics
const fireStatistics = computed(() => {
  if (
    !seriesByVariable.value.t2_max.length ||
    !seriesByVariable.value.rh2_min.length ||
    !climatologyData.value.t2_max ||
    !climatologyData.value.rh2_min
  ) {
    return null
  }

  return calculateFireWeatherStatistics(
    seriesByVariable.value.t2_max,
    seriesByVariable.value.rh2_min,
    climatologyData.value.t2_max,
    climatologyData.value.rh2_min
  )
})

// Chart IDs used by Era5Wrf chart components
const CHART_IDS = [
  'era5-fire-temperature-chart',
  'era5-fire-humidity-chart',
  'era5-fire-precipitation-chart',
]

// Proactively purge all Era5Wrf charts (following WetDaysPerYear pattern)
const purgeAllCharts = () => {
  CHART_IDS.forEach(chartId => {
    try {
      const element = document.getElementById(chartId)
      if (element && element.hasChildNodes()) {
        $Plotly.purge(chartId)
      }
    } catch (error) {
      // Ignore purge errors - chart may already be cleaned up
      console.debug(`Chart purge skipped for ${chartId}:`, error)
    }
  })
}

// Data fetching
const fetchData = () => {
  if (!latLng.value) return
  dataStore.fetchData(endpoint)
}

onMounted(() => {
  fetchData()
})

watch(latLng, async () => {
  // Proactively purge all charts before data changes
  purgeAllCharts()
  dataStore.apiData[endpoint] = null
  dataStore.dataErrors[endpoint] = false
  fetchData()
})

onUnmounted(() => {
  purgeAllCharts()
  dataStore.apiData[endpoint] = null
  dataStore.dataErrors[endpoint] = false
})

const isLoading = computed(
  () => !!latLng.value && !apiData.value && !dataError.value
)
</script>

<template>
  <div class="fire-weather-wrapper">
    <div v-if="latLng">
      <!-- Controls -->
      <Era5WrfFireControls
        v-model:selectedYear="selectedYear"
        v-model:climatologyPeriod="climatologyPeriod"
        :availableYears="availableYears"
      />

      <!-- Error State -->
      <div v-if="dataError" class="notification is-danger mt-4">
        Unable to load data for this location. Try a different location.
      </div>

      <!-- Loading State -->
      <div v-else-if="isLoading" class="mt-4">
        <div class="loading-state">
          <progress class="progress is-small is-primary" max="100">
            Loading
          </progress>
          <span>Fetching downscaled ERA5 reanalysis time series…</span>
        </div>
      </div>

      <!-- Data Loaded -->
      <div v-else-if="apiData" class="mt-4">
        <!-- Statistics Panel -->
        <Era5WrfFireStatisticsPanel
          v-if="fireStatistics"
          :statistics="fireStatistics"
          :selectedYear="selectedYear"
          :climatologyPeriodLabel="climatologyPeriod"
          class="mb-5"
        />

        <!-- Temperature Chart with Climatology -->
        <div class="mb-5">
          <Era5WrfChartTemperature
            :t2Max="seriesByVariable.t2_max"
            :t2Mean="seriesByVariable.t2_mean"
            :t2Min="seriesByVariable.t2_min"
            :climatologyT2Max="climatologyData.t2_max"
            :climatologyT2Mean="climatologyData.t2_mean"
            :climatologyT2Min="climatologyData.t2_min"
            :showClimatology="hasClimatologyData"
            :isFireSeason="true"
            :lat="latLng.lat"
            :lng="latLng.lng"
            chartId="era5-fire-temperature-chart"
          />
        </div>

        <!-- Humidity Chart with Climatology -->
        <div class="mb-5">
          <Era5WrfChartHumidity
            :rh2Max="seriesByVariable.rh2_max"
            :rh2Mean="seriesByVariable.rh2_mean"
            :rh2Min="seriesByVariable.rh2_min"
            :climatologyRh2Max="climatologyData.rh2_max"
            :climatologyRh2Mean="climatologyData.rh2_mean"
            :climatologyRh2Min="climatologyData.rh2_min"
            :showClimatology="hasClimatologyData"
            :isFireSeason="true"
            :lat="latLng.lat"
            :lng="latLng.lng"
            chartId="era5-fire-humidity-chart"
          />
        </div>

        <!-- Precipitation Chart -->
        <div>
          <Era5WrfChartPrecipitation
            :rainnc="seriesByVariable.rainnc_sum"
            :isFireSeason="true"
            :lat="latLng.lat"
            :lng="latLng.lng"
            chartId="era5-fire-precipitation-chart"
          />
        </div>
      </div>
    </div>

    <!-- Location Prompt -->
    <div v-else-if="props.showLocationPrompt" class="notification is-info">
      Select a location to analyze fire weather conditions.
    </div>
  </div>
</template>

<style scoped>
.loading-state {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}
</style>
