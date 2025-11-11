<script lang="ts" setup>
// Xray wrapper for basic visualization of ERA5-WRF variables
import { getDefaultWindow } from '~/utils/era5WrfTransforms'
import {
  ERA5_WRF_CONFIG,
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

// Chart IDs used by Era5Wrf chart components
const CHART_IDS = [
  'era5-temperature-chart',
  'era5-humidity-chart',
  'era5-precipitation-chart',
  'wind-rose-mean',
]

const dataError = computed(() => dataStore.dataErrors[endpoint] ?? false)

// Date range state
const startDate = ref<string>('')
const endDate = ref<string>('')

// Define all variables to visualize
// omitting seaice_max and wspd10_max for now
const variables: Era5WrfVariableKey[] = [
  't2_max',
  't2_mean',
  't2_min',
  'rh2_max',
  'rh2_mean',
  'rh2_min',
  'rainnc_sum',
  'wspd10_mean',
  'wdir10_mean',
]

// Use composable for series preparation
const { apiData, seriesByVariable } = useEra5WrfSeries(
  startDate,
  endDate,
  variables
)

// Initialize date range when data loads
watch(
  apiData,
  newData => {
    if (newData && !startDate.value) {
      const defaultWindow = getDefaultWindow(newData)
      if (defaultWindow) {
        startDate.value = defaultWindow.start
        endDate.value = defaultWindow.end
      }
    }
  },
  { immediate: true }
)

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

const fetchData = () => {
  if (!latLng.value) return
  dataStore.fetchData(endpoint)
}

onMounted(() => {
  fetchData()
})

watch(latLng, async () => {
  // Proactively purge all charts before data changes (following WetDaysPerYear pattern)
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
  <div class="xray-wrapper">
    <div v-if="latLng">
      <Era5WrfXrayControls
        v-model:startDate="startDate"
        v-model:endDate="endDate"
      />

      <div v-if="dataError" class="notification is-danger mt-4">
        Unable to load data for this location. Try a different location.
      </div>

      <div v-else-if="isLoading" class="mt-4">
        <div class="loading-state">
          <progress class="progress is-small is-primary" max="100">
            Loading
          </progress>
          <span>Fetching downscaled ERA5 reanalysis time series…</span>
        </div>
      </div>

      <div v-else-if="apiData" class="mt-4">
        <!-- Temperature -->
        <div class="mb-5">
          <Era5WrfTemperatureChart
            :t2Max="seriesByVariable.t2_max"
            :t2Mean="seriesByVariable.t2_mean"
            :t2Min="seriesByVariable.t2_min"
            :lat="latLng.lat"
            :lng="latLng.lng"
          />
        </div>

        <!-- Humidity -->
        <div class="mb-5">
          <Era5WrfHumidityChart
            :rh2Max="seriesByVariable.rh2_max"
            :rh2Mean="seriesByVariable.rh2_mean"
            :rh2Min="seriesByVariable.rh2_min"
            :lat="latLng.lat"
            :lng="latLng.lng"
          />
        </div>

        <!-- Precipitation -->
        <div class="mb-5">
          <Era5WrfPrecipitationChart
            :rainnc="seriesByVariable.rainnc_sum"
            :lat="latLng.lat"
            :lng="latLng.lng"
          />
        </div>

        <!-- Wind Rose -->
        <div>
          <Era5WrfWindRose
            :speedSeries="seriesByVariable.wspd10_mean"
            :directionSeries="seriesByVariable.wdir10_mean"
            speedLabel="Mean Wind Speed"
            chartId="wind-rose-mean"
          />
        </div>
      </div>
    </div>

    <div v-else-if="props.showLocationPrompt" class="notification is-info">
      Select a location to query the downscaled ERA5 reanalysis dataset.
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
