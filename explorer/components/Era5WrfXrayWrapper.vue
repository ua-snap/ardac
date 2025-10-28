<script lang="ts" setup>
// Xray foundation: Provides basic visualization of all ERA5-WRF variables
// Extended by specialized stories like Fire Weather Analysis
import { getDefaultWindow } from '~/utils/era5WrfTransforms'
import type { Era5WrfVariableKey } from '~/utils/era5WrfConstants'

interface Props {
  showLocationPrompt?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showLocationPrompt: true,
})

const dataStore = useDataStore()
const placesStore = usePlacesStore()

const endpoint = 'era5wrf'

const dataError = computed(() => dataStore.dataErrors[endpoint] ?? false)
const latLng = computed(() => placesStore.latLng)

// Date range state
const startDate = ref<string>('')
const endDate = ref<string>('')

// Define all variables to visualize
const variables: Era5WrfVariableKey[] = [
  't2_max',
  't2_mean',
  't2_min',
  'rh2_max',
  'rh2_mean',
  'rh2_min',
  'rainnc_sum',
  'wspd10_max',
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

const fetchData = () => {
  if (!latLng.value) return
  dataStore.fetchData(endpoint)
}

watch(latLng, fetchData, { immediate: true })

onUnmounted(() => {
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
        Unable to load ERA5-WRF data for this location. Try a different point or
        reload the page.
      </div>

      <div v-else-if="isLoading" class="mt-4">
        <div class="loading-state">
          <progress class="progress is-small is-primary" max="100">
            Loading
          </progress>
          <span>Fetching ERA5-WRF time series…</span>
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

        <!-- Wind Rose - Mean Speed -->
        <div class="mb-5">
          <Era5WrfWindRose
            :speedSeries="seriesByVariable.wspd10_mean"
            :directionSeries="seriesByVariable.wdir10_mean"
            speedLabel="Mean Wind Speed"
            chartId="wind-rose-mean"
          />
        </div>

        <!-- Wind Rose - Max Speed -->
        <div>
          <Era5WrfWindRose
            :speedSeries="seriesByVariable.wspd10_max"
            :directionSeries="seriesByVariable.wdir10_mean"
            speedLabel="Max Wind Speed"
            chartId="wind-rose-max"
          />
        </div>
      </div>
    </div>

    <div v-else-if="props.showLocationPrompt" class="notification is-info">
      Select a location to query the ERA5-WRF dataset.
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
