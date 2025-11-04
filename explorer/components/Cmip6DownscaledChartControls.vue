<script lang="ts" setup>
const props = defineProps<{
  datasetKeys: string[]
}>()

const endpoint = 'cmip6Downscaled'

const { $_ } = useNuxtApp()
const dataStore = useDataStore()
const placesStore = usePlacesStore()
const chartStore = useChartStore()

const defaultScenario = 'ssp585'

const modelInput = defineModel('model', { default: '6ModelAvg' })
const scenarioInput = defineModel('scenario', { default: 'ssp585' })
const baselineYearInput = defineModel('baselineYear', { default: '1965' })
const projectedYearInput = defineModel('projectedYear', { default: '2100' })

const apiData = computed<any[]>(() => dataStore.apiData[endpoint])
const latLng = computed<LatLngValue>(() => placesStore.latLng)

const chartLabels = computed<Cmip6DownscaledChartLabels>(
  () => chartStore.labels[endpoint] as Cmip6DownscaledChartLabels
)

type Cmip6DownscaledOptions = {
  [key: string]: {
    [model: string]: string[]
  }
}

// Supported variable/model/scenario combinations are hard-coded here because,
// unlike other data x-ray items, daily downscaled CMIP6 data is fetched in
// variable/model/scenario chunks for performance reasons. Since only a subset
// of data is available, we cannot determine all variable/model/scenario
// combinations are present just by looking at the data.
const cmip6_downscaled_options: Cmip6DownscaledOptions = {
  tasmax: {
    '6ModelAvg': ['historical', 'ssp126', 'ssp245', 'ssp370', 'ssp585'],
    'CNRM-CM6-1-HR': ['historical', 'ssp126', 'ssp585'],
    'E3SM-2-0': ['historical', 'ssp370'],
    'EC-Earth3-Veg': ['historical', 'ssp370', 'ssp585'],
    'HadGEM3-GC31-LL': ['historical', 'ssp126', 'ssp245', 'ssp585'],
    'HadGEM3-GC31-MM': ['historical', 'ssp126', 'ssp585'],
    'KACE-1-0-G': ['historical', 'ssp126', 'ssp245', 'ssp370', 'ssp585'],
    MIROC6: ['historical', 'ssp126', 'ssp245', 'ssp370', 'ssp585'],
    'MPI-ESM1-2-HR': ['historical', 'ssp126', 'ssp245', 'ssp370', 'ssp585'],
    'MRI-ESM2-0': ['historical', 'ssp126', 'ssp245', 'ssp370', 'ssp585'],
    'NorESM2-MM': ['historical', 'ssp126', 'ssp245', 'ssp370', 'ssp585'],
    TaiESM1: ['historical', 'ssp126', 'ssp245', 'ssp370', 'ssp585'],
  },
  tasmin: {
    '6ModelAvg': ['historical', 'ssp126', 'ssp245', 'ssp370', 'ssp585'],
    'CNRM-CM6-1-HR': ['historical', 'ssp126', 'ssp585'],
    'E3SM-2-0': ['historical', 'ssp370'],
    'EC-Earth3-Veg': ['historical', 'ssp370', 'ssp585'],
    'HadGEM3-GC31-LL': ['historical', 'ssp126', 'ssp245', 'ssp585'],
    'HadGEM3-GC31-MM': ['historical', 'ssp126', 'ssp585'],
    'KACE-1-0-G': ['historical', 'ssp126', 'ssp245', 'ssp370', 'ssp585'],
    MIROC6: ['historical', 'ssp126', 'ssp245', 'ssp370', 'ssp585'],
    'MPI-ESM1-2-HR': ['historical', 'ssp126', 'ssp245', 'ssp370', 'ssp585'],
    'MRI-ESM2-0': ['historical', 'ssp126', 'ssp245', 'ssp370', 'ssp585'],
    'NorESM2-MM': ['historical', 'ssp126', 'ssp245', 'ssp370', 'ssp585'],
    TaiESM1: ['historical', 'ssp126', 'ssp245', 'ssp370', 'ssp585'],
  },
  pr: {
    '6ModelAvg': ['historical', 'ssp126', 'ssp245', 'ssp370', 'ssp585'],
    CESM2: ['historical', 'ssp126', 'ssp585'],
    'CNRM-CM6-1-HR': ['historical', 'ssp126', 'ssp585'],
    'E3SM-2-0': ['historical', 'ssp370'],
    'EC-Earth3-Veg': ['historical', 'ssp126', 'ssp370', 'ssp585'],
    'HadGEM3-GC31-LL': ['historical', 'ssp126', 'ssp245', 'ssp585'],
    'HadGEM3-GC31-MM': ['historical', 'ssp126', 'ssp585'],
    'KACE-1-0-G': ['historical', 'ssp126', 'ssp245', 'ssp370', 'ssp585'],
    MIROC6: ['historical', 'ssp126', 'ssp245', 'ssp370', 'ssp585'],
    'MPI-ESM1-2-HR': ['historical', 'ssp126', 'ssp245', 'ssp370', 'ssp585'],
    'MRI-ESM2-0': ['historical', 'ssp126', 'ssp245', 'ssp370', 'ssp585'],
    'NorESM2-MM': ['historical', 'ssp126', 'ssp245', 'ssp370', 'ssp585'],
    TaiESM1: ['historical', 'ssp126', 'ssp245', 'ssp370', 'ssp585'],
  },
}

chartStore.labels[endpoint] = {
  models: {
    '6ModelAvg': '6-Model Average',
    CESM2: 'CESM2',
    'CNRM-CM6-1-HR': 'CNRM-CM6-1-HR',
    'E3SM-2-0': 'E3SM-2-0',
    'EC-Earth3-Veg': 'EC-Earth3-Veg',
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
  baselineYears: $_.range(1965, 2014 + 1).map(String),
  projectedYears: $_.range(2015, 2100 + 1).map(String),
}

const modelPresent = (model: string) => {
  if (props.datasetKeys.length) {
    return model in cmip6_downscaled_options[props.datasetKeys[0]]
  }
  return false
}

const scenarioPresent = (scenario: string) => {
  if (
    props.datasetKeys.length &&
    modelInput.value in cmip6_downscaled_options[props.datasetKeys[0]]
  ) {
    return cmip6_downscaled_options[props.datasetKeys[0]][
      modelInput.value
    ].includes(scenario)
  }
  return false
}

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

watch(
  [latLng, modelInput, scenarioInput, baselineYearInput, projectedYearInput],
  async () => {
    chooseScenario()
    chartStore.inputs[endpoint] = {
      model: modelInput.value,
      scenario: scenarioInput.value,
      baselineYear: baselineYearInput.value,
      projectedYear: projectedYearInput.value,
    }
  }
)

watch([latLng, modelInput, scenarioInput], async () => {
  dataStore.apiData[endpoint] = null
  let paramsArray = []
  paramsArray.push('vars=' + props.datasetKeys.join(','))
  paramsArray.push('models=' + modelInput.value)
  paramsArray.push('scenarios=historical,' + scenarioInput.value)
  let params = paramsArray.length ? '?' + paramsArray.join('&') : ''
  dataStore.fetchData(endpoint, params)
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
            :disabled="!modelPresent(model)"
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
            v-for="(label, scenario) in chartLabels.scenarios"
            :key="scenario"
            :value="scenario"
            :disabled="!scenarioPresent(scenario)"
          >
            {{ label }}
          </option>
        </select>
      </div>
    </div>
    <div class="parameter mb-5">
      <label for="year" class="label">Baseline Year:</label>
      <div class="select mb-5 mr-3">
        <select id="year" v-model="baselineYearInput">
          <option v-for="year in chartLabels.baselineYears" :value="year">
            {{ year }}
          </option>
        </select>
      </div>
    </div>
    <div class="parameter mb-5">
      <label for="year" class="label">Projected Year:</label>
      <div class="select">
        <select id="year" v-model="projectedYearInput">
          <option v-for="year in chartLabels.projectedYears" :value="year">
            {{ year }}
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
