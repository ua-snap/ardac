<script lang="ts" setup>
const endpoint = 'cmip6DaysAboveThreshold'

const dataStore = useDataStore()
const placesStore = usePlacesStore()
const chartStore = useChartStore()

const defaultModel = 'CMIP6-Ensemble'
const defaultThreshold = 25

const modelInput = defineModel('model', { default: defaultModel })
const thresholdInput = defineModel('threshold', { default: defaultThreshold })

const apiData = computed<Record<string, any>>(() => dataStore.apiData[endpoint])
const latLng = computed<LatLngValue>(() => placesStore.latLng)

const chartLabels = computed<Cmip6DaysAboveThresholdChartLabelsObj>(
  () => chartStore.labels[endpoint] as Cmip6DaysAboveThresholdChartLabelsObj
)

chartStore.labels[endpoint] = {
  scenarios: {
    historical: 'Historical',
    ssp126: 'SSP1-2.6',
    ssp245: 'SSP2-4.5',
    ssp370: 'SSP3-7.0',
    ssp585: 'SSP5-8.5',
  },
}

const models = computed<string[]>(() =>
  apiData.value ? Object.keys(apiData.value) : []
)

const validThreshold = computed<boolean>(() =>
  Number.isFinite(thresholdInput.value)
)

// The API returns all models at once, so only a new location or threshold
// requires a fetch. Model changes only update the chart inputs.
watch(
  [latLng, modelInput, thresholdInput],
  async () => {
    if (!validThreshold.value) {
      return
    }
    chartStore.inputs[endpoint] = {
      model: modelInput.value,
      threshold: thresholdInput.value,
    }
  },
  { immediate: true }
)

watch([latLng, thresholdInput], async () => {
  if (!validThreshold.value) {
    return
  }
  dataStore.apiData[endpoint] = null
  dataStore.fetchData(endpoint, '?threshold=' + thresholdInput.value)
})
</script>

<template>
  <div v-if="chartLabels">
    <div class="parameter mr-3">
      <label for="threshold" class="label">Threshold (&deg;C):</label>
      <div class="control mb-5">
        <input
          id="threshold"
          v-model.lazy.number="thresholdInput"
          class="input is-medium"
          type="number"
          min="-50"
          max="50"
          step="1"
        />
      </div>
    </div>
    <div v-if="apiData" class="parameter">
      <label for="model" class="label">Model:</label>
      <div class="select mb-5">
        <select id="model" v-model="modelInput">
          <option v-for="model in models" :key="model" :value="model">
            {{ model }}
          </option>
        </select>
      </div>
    </div>
    <p v-if="!validThreshold" class="mb-5">
      Enter a numeric threshold in degrees Celsius.
    </p>
  </div>
</template>

<style lang="scss" scoped>
.parameter {
  display: inline-block;
  vertical-align: top;
  select,
  input {
    background-color: $white-lighter;
  }
}
</style>
