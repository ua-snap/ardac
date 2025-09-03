<script lang="ts" setup>
const props = defineProps<{
  defaultMonth?: string
}>()

const endpoint = 'indicatorsCmip6'

const dataStore = useDataStore()
const placesStore = usePlacesStore()
const chartStore = useChartStore()

const defaultScenario = 'ssp585'

const modelInput = defineModel('model', { default: 'TaiESM1' })
const scenarioInput = defineModel('scenario', { default: defaultScenario })

const apiData = computed<any[]>(() => dataStore.apiData[endpoint])
const latLng = computed<LatLngValue>(() => placesStore.latLng)

const chartLabels = computed<IndicatorsCmip6ChartLabels>(
  () => chartStore.labels[endpoint] as IndicatorsCmip6ChartLabels
)

chartStore.labels[endpoint] = {
  models: {
    CESM2: 'CESM2',
    'CNRM-CM6-1-HR': 'CNRM-CM6-1-HR',
    'EC-Earth3-Veg': 'EC-Earth3-Veg',
    'GFDL-ESM4': 'GFDL-ESM4',
    'HadGEM-GC31-LL': 'HadGEM-GC31-LL',
    'HadGEM-GC31-MM': 'HadGEM-GC31-MM',
    'KACE-1-0-G': 'KACE-1-0-G',
    MIROC6: 'MIROC6',
    'MPI-ESM1-2-LR': 'MPI-ESM1-2-LR',
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
}

// Some models do not have data for all scenarios. Use this function to react
// accordingly by graying out scenario options or reverting back to the default
// scenario if user accidentally lands on an invalid model/scenrio combination.
const scenarioPresent = (value: string) => {
  if (apiData.value) {
    return apiData.value[value as any][modelInput.value] != null
  }
}

watch(latLng, async () => {
  dataStore.apiData[endpoint] = null
  dataStore.fetchData('indicatorsCmip6')
})

watch([latLng, modelInput, scenarioInput], async () => {
  if (!scenarioPresent(scenarioInput.value)) {
    scenarioInput.value = defaultScenario
  }
  chartStore.inputs[endpoint] = {
    model: modelInput.value,
    scenario: scenarioInput.value,
  }
})
</script>

<template>
  <div v-if="latLng && chartLabels && apiData">
    <div class="parameter">
      <label for="model" class="label">Model:</label>
      <div class="select mb-5 mr-3">
        <select v-model="modelInput">
          <option
            v-for="(label, value) in chartLabels.models"
            :key="value"
            :value="value"
          >
            {{ label }}
          </option>
        </select>
      </div>
    </div>
    <div class="parameter">
      <label for="scenario" class="label">Scenario:</label>
      <div class="select">
        <select v-model="scenarioInput">
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
