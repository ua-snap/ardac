<script lang="ts" setup>
const props = defineProps<{
  defaultModel?: string
  defaultMonth?: string
  datasetKeys?: string[]
}>()

const endpoint = 'cmip6Monthly'

const dataStore = useDataStore()
const placesStore = usePlacesStore()
const chartStore = useChartStore()

const defaultScenario = 'ssp585'

const modelInput = defineModel('model', { default: 'EC-Earth3-Veg' })
const scenarioInput = defineModel('scenario', { default: defaultScenario })
const monthInput = defineModel('month', { default: '08' })

if (props.defaultModel) {
  modelInput.value = props.defaultModel
}

if (props.defaultMonth) {
  monthInput.value = props.defaultMonth
}

const apiData = computed<any[]>(() => dataStore.apiData[endpoint])
const latLng = computed<LatLngValue>(() => placesStore.latLng)

const chartLabels = computed<Cmip6MonthlyChartLabels>(
  () => chartStore.labels[endpoint] as Cmip6MonthlyChartLabels
)

chartStore.labels[endpoint] = {
  models: {
    CESM2: 'CESM2',
    'CNRM-CM6-1-HR': 'CNRM-CM6-1-HR',
    'E3SM-1-1': 'E3SM-1-1',
    'E3SM-2-0': 'E3SM-2-0',
    'EC-Earth3-Veg': 'EC-Earth3-Veg',
    'GFDL-ESM4': 'GFDL-ESM4',
    'HadGEM3-GC31-LL': 'HadGEM3-GC31-LL',
    'HadGEM3-GC31-MM': 'HadGEM3-GC31-MM',
    'KACE-1-0-G': 'KACE-1-0-G',
    MIROC6: 'MIROC6',
    'MPI-ESM1-2-HR': 'MPI-ESM1-2-HR',
    'MRI-ESM2-0': 'MRI-ESM2-0',
    'NorESM2-MM': 'NorESM2-MM',
    TaiESM1: 'TaiESM1',
  },
  scenarios: {
    ssp126: 'SSP1-2.6',
    ssp245: 'SSP2-4.5',
    ssp370: 'SSP3-7.0',
    ssp585: 'SSP5-8.5',
  },
  months: {
    '01': 'January',
    '02': 'February',
    '03': 'March',
    '04': 'April',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'August',
    '09': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December',
  },
}

// Sea ice concentration data is only available for some models.
if (props.datasetKeys?.includes('siconc')) {
  if (props.datasetKeys?.includes('siconc')) {
    chartStore.labels[endpoint] = {
      ...chartStore.labels[endpoint],
      models: {
        'HadGEM3-GC31-LL': 'HadGEM3-GC31-LL',
        'HadGEM3-GC31-MM': 'HadGEM3-GC31-MM',
        MIROC6: 'MIROC6',
        'NorESM2-MM': 'NorESM2-MM',
        TaiESM1: 'TaiESM1',
      },
    }
  }
}

// Some models do not have data for all scenarios. Use this function to react
// accordingly by graying out scenario options or reverting back to the default
// scenario if user accidentally lands on an invalid model/scenrio combination.
const scenarioPresent = (value: string) => {
  if (apiData.value) {
    return apiData.value[modelInput.value as any][value] != null
  }
}

// If the user switched the model and the selected scenario is not available,
// revert back to the default scenario if it is available. Otherwise, pick the
// first found scenario that is available.
const chooseScenario = () => {
  if (!scenarioPresent(scenarioInput.value)) {
    if (scenarioPresent(defaultScenario)) {
      scenarioInput.value = defaultScenario
    } else {
      let possibleScenarios = Object.keys(
        chartStore.labels[endpoint]?.scenarios!
      )
      for (const scenario of possibleScenarios) {
        if (scenarioPresent(scenario)) {
          scenarioInput.value = scenario
          break
        }
      }
    }
  }
}

watch([latLng, modelInput, scenarioInput, monthInput], async () => {
  chooseScenario()
  chartStore.inputs[endpoint] = {
    model: modelInput.value,
    scenario: scenarioInput.value,
    month: monthInput.value,
  }
})

watch(latLng, async () => {
  dataStore.apiData[endpoint] = null
  let params = ''
  if (props.datasetKeys) {
    params = '?vars=' + props.datasetKeys.join(',')
  }
  dataStore.fetchData(endpoint, params)
})
</script>

<template>
  <div v-if="latLng && chartLabels && apiData">
    <div class="parameter">
      <label for="scenario" class="label">Model:</label>
      <div class="select mb-5 mr-3">
        <select id="scenario" v-model="modelInput">
          <option
            v-for="model in Object.keys(chartLabels.models)"
            :value="model"
          >
            {{ chartLabels.models[model] }}
          </option>
        </select>
      </div>
    </div>
    <div class="parameter mb-5">
      <label for="scenario" class="label">Scenario:</label>
      <div class="select mb-5 mr-3">
        <select id="scenario" v-model="scenarioInput">
          <option
            v-for="(label, value) in chartLabels.scenarios"
            :key="value"
            :value="value"
            :disabled="!scenarioPresent(value)"
          >
            {{ label }}
          </option>
        </select>
      </div>
    </div>
    <div class="parameter mb-5">
      <label for="month" class="label">Month:</label>
      <div class="select">
        <select id="month" v-model="monthInput">
          <option
            v-for="month in Object.keys(chartLabels.months).sort()"
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
