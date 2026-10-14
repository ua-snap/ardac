<script lang="ts" setup>
const endpoint = 'cmip6DaysAboveThreshold'

const dataStore = useDataStore()
const placesStore = usePlacesStore()
const chartStore = useChartStore()

const apiData = computed<Record<string, any>>(() => dataStore.apiData[endpoint])
const latLng = computed<LatLngValue>(() => placesStore.latLng)

const chartLabels = computed<Cmip6DaysAboveThresholdChartLabelsObj>(
  () => chartStore.labels[endpoint] as Cmip6DaysAboveThresholdChartLabelsObj
)
const chartInputs = computed<Cmip6DaysAboveThresholdChartInputsObj>(
  () => chartStore.inputs[endpoint] as Cmip6DaysAboveThresholdChartInputsObj
)

const modelData = computed<Record<string, Record<string, number>> | null>(
  () => apiData.value?.[chartInputs.value?.model ?? ''] ?? null
)

// Time periods present in this model's data, i.e. 1965-2014, 2041-2070.
const periods = computed<string[]>(() => {
  if (!modelData.value) {
    return []
  }
  const allPeriods = Object.values(modelData.value).flatMap(scenario =>
    Object.keys(scenario)
  )
  return [...new Set(allPeriods)].sort()
})

const caption = computed<string>(() => {
  const community = placesStore.selectedCommunity
  const place = community
    ? community.name + (community.alt_name ? ` (${community.alt_name})` : '')
    : ''
  return (
    'Days per year above threshold for ' +
    (place ? place + ' at ' : '') +
    latLng.value?.lat +
    ', ' +
    latLng.value?.lng
  )
})

onUnmounted(() => {
  dataStore.apiData[endpoint] = null
})
</script>

<template>
  <div v-if="latLng && chartLabels && modelData" class="table-container">
    <table class="table is-fullwidth">
      <caption class="has-text-left mb-3">
        {{
          caption
        }}
      </caption>
      <thead>
        <tr>
          <th>Scenario</th>
          <th v-for="period in periods" :key="period">{{ period }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(values, scenario) in modelData" :key="scenario">
          <td>{{ chartLabels.scenarios[scenario] ?? scenario }}</td>
          <td v-for="period in periods" :key="period">
            {{ values[period] ?? 'N/A' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
