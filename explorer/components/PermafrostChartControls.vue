<script lang="ts" setup>
const props = defineProps<{
  defaultMonth?: string
}>()

const endpoint = 'permafrost'

const dataStore = useDataStore()
const placesStore = usePlacesStore()
const chartStore = useChartStore()

const scenarioInput = defineModel({ default: 'RCP 8.5' })

const latLng = computed<LatLngValue>(() => placesStore.latLng)
const apiData = computed<any[]>(() => dataStore.apiData[endpoint])

const chartLabels = computed<PermafrostChartLabels>(
  () => chartStore.labels[endpoint] as PermafrostChartLabels
)

chartStore.labels[endpoint] = {
  scenarios: { 'RCP 4.5': 'RCP 4.5', 'RCP 8.5': 'RCP 8.5' },
}

watch(latLng, async () => {
  dataStore.apiData[endpoint] = null
  dataStore.fetchData(endpoint)
})

watch([latLng, scenarioInput], async () => {
  chartStore.inputs[endpoint] = {
    scenario: scenarioInput.value,
  }
})
</script>

<template>
  <div v-if="latLng && chartLabels && apiData">
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
