<script lang="ts" setup>
const endpoint = 'hydrology'

const placesStore = usePlacesStore()
const mapStore = useMapStore()
const dataStore = useDataStore()
const runtimeConfig = useRuntimeConfig()

const apiData = computed<any[]>(() => dataStore.apiData[endpoint])
const latLng = computed<LatLngValue>(() => placesStore.latLng)
const selectedCommunity = computed<CommunityValue>(
  () => placesStore.selectedCommunity
)

const layers: MapLayer[] = [
  {
    id: 'runoff_historical_era',
    title: '1980–2009, CanESM2, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'hydrology',
    style: 'ardac_runoff_historical_era',
    legend: 'runoff',
    rasdamanConfiguration: { dim_model: 3, dim_scenario: 1 },
  },
  {
    id: 'runoff_midcentury_era',
    title: '2040–2069, CanESM2, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'hydrology',
    style: 'ardac_runoff_midcentury_era',
    legend: 'runoff',
    rasdamanConfiguration: { dim_model: 3, dim_scenario: 1 },
  },
  {
    id: 'runoff_latecentury_era',
    title: '2070–2099, CanESM2, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'hydrology',
    style: 'ardac_runoff_latecentury_era',
    legend: 'runoff',
    rasdamanConfiguration: { dim_model: 3, dim_scenario: 1 },
  },
]

const legend: Record<string, LegendItem[]> = {
  runoff: [
    { color: '#edf8fb', label: '&ge;0㎜, &lt;100㎜' },
    { color: '#b2e2e2', label: '&ge;100㎜, &lt;200㎜' },
    { color: '#66c2a4', label: '&ge;200㎜, &lt;300㎜' },
    { color: '#2ca25f', label: '&ge;300㎜, &lt;400㎜' },
    { color: '#006d2c', label: '&ge;400㎜' },
  ],
}

const mapId = 'runoff'
mapStore.setLegendItems(mapId, legend)

onUnmounted(() => {
  dataStore.apiData[endpoint] = null
})
</script>

<template>
  <section class="section xray">
    <div class="content is-size-5">
      <h3 class="title is-3">Runoff</h3>
      <XrayIntroblurb resolution="~12" unit="km" cmip="5" />
      <p class="mb-6">
        The map below shows the 30-year mean annual runoff for three eras using
        the CanESM2 model under the RCP 8.5 emissions scenario.
      </p>

      <MapBlock :mapId="mapId" class="mb-6">
        <template v-slot:layers>
          <MapLayer :mapId="mapId" :layer="layers[0]" default>
            <template v-slot:title>{{ layers[0].title }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="layers[1]">
            <template v-slot:title>{{ layers[1].title }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="layers[2]">
            <template v-slot:title>{{ layers[2].title }}</template>
          </MapLayer>
        </template>
      </MapBlock>

      <p>
        Enter a location below to see a chart of mean annual runoff per decade
        for a point location using the selected model, emissions scenario, and
        month. After entering a location, links will be provided where you can
        download the data that is used to populate the chart.
      </p>

      <Gimme extent="mizukami" />
      <HydrologyChartControls />
      <HydrologyChart label="Runoff" units="㎜" dataKey="runoff" />

      <div v-if="latLng && apiData" class="my-6">
        <h4 class="title is-4">
          Download runoff data for
          {{ selectedCommunity ? selectedCommunity.name + ' at ' : '' }}
          {{ latLng.lat }},
          {{ latLng.lng }}
        </h4>
        <p>
          The following download links bundle runoff data with other hydrology
          data. Runoff uses the "runoff" identifier.
        </p>
        <DownloadLinks endpoint="/hydrology/point" />
      </div>
      <GetAndUseDataHydrology :presentInNcr="true" />
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
