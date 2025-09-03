<script lang="ts" setup>
const props = defineProps<{
  defaultMonth?: string
}>()

const endpoint = 'hydrology'

const dataStore = useDataStore()
const placesStore = usePlacesStore()
const chartStore = useChartStore()

const modelInput = defineModel('model', { default: 'CanESM2' })
const scenarioInput = defineModel('scenario', { default: 'rcp85' })
const monthInput = defineModel('month', { default: 'mar' })

if (props.defaultMonth) {
  monthInput.value = props.defaultMonth
}

const apiData = computed<any[]>(() => dataStore.apiData[endpoint])
const latLng = computed<LatLngValue>(() => placesStore.latLng)

const chartLabels = computed<HydrologyChartLabels>(
  () => chartStore.labels[endpoint] as HydrologyChartLabels
)

chartStore.labels[endpoint] = {
  models: {
    'ACCESS1-3': 'ACCESS1-3',
    CCSM4: 'CCSM4',
    'CSIRO-Mk3-6-0': 'CSIRO-Mk3-6-0',
    CanESM2: 'CanESM2',
    'GFDL-ESM2M': 'GFDL-ESM2M',
    'HadGEM2-ES': 'HadGEM2-ES',
    inmcm4: 'INMCM4.0',
    MIROC5: 'MIROC5',
    'MPI-ESM-MR': 'MPI-ESM-MR',
    'MRI-CGCM3': 'MRI-CGCM3',
  },
  scenarios: {
    rcp45: 'RCP 4.5',
    rcp85: 'RCP 8.5',
  },
  months: {
    jan: 'January',
    feb: 'February',
    mar: 'March',
    apr: 'April',
    may: 'May',
    jun: 'June',
    jul: 'July',
    aug: 'August',
    sep: 'September',
    oct: 'October',
    nov: 'November',
    dec: 'December',
  },
}

watch([latLng, modelInput, scenarioInput, monthInput], async () => {
  chartStore.inputs[endpoint] = {
    model: modelInput.value,
    scenario: scenarioInput.value,
    month: monthInput.value,
  }
})

watch(latLng, async () => {
  dataStore.apiData[endpoint] = null
  dataStore.fetchData(endpoint)
})
</script>

<template>
  <div v-if="latLng && chartLabels && apiData">
    <div class="parameter">
      <label for="model" class="label">Model:</label>
      <div class="select mb-5 mr-3">
        <select id="model" v-model="modelInput">
          <option
            v-for="model in Object.keys(chartLabels.models)"
            :value="model"
          >
            {{ chartLabels.models[model] }}
          </option>
        </select>
      </div>
    </div>
    <div class="parameter">
      <label for="scenario" class="label">Scenario:</label>
      <div class="select mb-5 mr-3">
        <select id="scenario" v-model="scenarioInput">
          <option
            v-for="scenario in Object.keys(chartLabels.scenarios)"
            :value="scenario"
          >
            {{ chartLabels.scenarios[scenario] }}
          </option>
        </select>
      </div>
    </div>
    <div class="parameter mb-5">
      <label for="month" class="label">Month:</label>
      <div class="select">
        <select id="month" v-model="monthInput">
          <option
            v-for="month in Object.keys(chartLabels.months)"
            :value="month"
          >
            {{ chartLabels.months[month] }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.parameter {
  display: inline-block;
  select {
    background-color: $white-lighter;
  }
}
</style>
