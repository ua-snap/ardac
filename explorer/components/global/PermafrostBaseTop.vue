<script lang="ts" setup>
const endpoint = 'permafrost'

const mapStore = useMapStore()
const dataStore = useDataStore()
const placesStore = usePlacesStore()
const runtimeConfig = useRuntimeConfig()

const apiData = computed<any[]>(() => dataStore.apiData[endpoint])
const latLng = computed<LatLngValue>(() => placesStore.latLng)
const selectedCommunity = computed<CommunityValue>(
  () => placesStore.selectedCommunity
)

const layers: MapLayer[] = [
  {
    id: 'permafrost_base_earlycentury_era',
    title: '2021–2039, GFDL CM3, RCP 8.5',
    subtext: 'Permafrost Base Depth',
    source: 'rasdaman',
    wmsLayerName: 'crrel_gipl_outputs_nc',
    style: 'ardac_permafrost_base_earlycentury_era',
    legend: 'permafrost_base',
    rasdamanConfiguration: { dim_model: 1, dim_scenario: 1 },
  },
  {
    id: 'permafrost_top_earlycentury_era',
    title: '2021–2039, GFDL CM3, RCP 8.5',
    subtext: 'Permafrost Top Depth',
    source: 'rasdaman',
    wmsLayerName: 'crrel_gipl_outputs_nc',
    style: 'ardac_permafrost_top_earlycentury_era',
    legend: 'permafrost_top',
    rasdamanConfiguration: { dim_model: 1, dim_scenario: 1 },
  },
  {
    id: 'permafrost_base_midcentury_era',
    title: '2040–2069, GFDL CM3, RCP 8.5',
    subtext: 'Permafrost Base Depth',
    source: 'rasdaman',
    wmsLayerName: 'crrel_gipl_outputs_nc',
    style: 'ardac_permafrost_base_midcentury_era',
    legend: 'permafrost_base',
    rasdamanConfiguration: { dim_model: 1, dim_scenario: 1 },
  },
  {
    id: 'permafrost_top_midcentury_era',
    title: '2040–2069, GFDL CM3, RCP 8.5',
    subtext: 'Permafrost Top Depth',
    source: 'rasdaman',
    wmsLayerName: 'crrel_gipl_outputs_nc',
    style: 'ardac_permafrost_top_midcentury_era',
    legend: 'permafrost_top',
    rasdamanConfiguration: { dim_model: 1, dim_scenario: 1 },
  },
  {
    id: 'permafrost_base_latecentury_era',
    title: '2070–2099, GFDL CM3, RCP 8.5',
    subtext: 'Permafrost Base Depth',
    source: 'rasdaman',
    wmsLayerName: 'crrel_gipl_outputs_nc',
    style: 'ardac_permafrost_base_latecentury_era',
    legend: 'permafrost_base',
    rasdamanConfiguration: { dim_model: 1, dim_scenario: 1 },
  },
  {
    id: 'permafrost_top_latecentury_era',
    title: '2070–2099, GFDL CM3, RCP 8.5',
    subtext: 'Permafrost Top Depth',
    source: 'rasdaman',
    wmsLayerName: 'crrel_gipl_outputs_nc',
    style: 'ardac_permafrost_top_latecentury_era',
    legend: 'permafrost_top',
    rasdamanConfiguration: { dim_model: 1, dim_scenario: 1 },
  },
]

const legend: Record<string, LegendItem[]> = {
  permafrost_base: [
    { color: '#ffffcc', label: '&ge;0m, &lt;100m' },
    { color: '#a1dab4', label: '&ge;100m, &lt;200m' },
    { color: '#41b6c4', label: '&ge;200m, &lt;300m' },
    { color: '#2c7fb8', label: '&ge;300m, &lt;400m' },
    { color: '#253494', label: '&ge;400m' },
  ],
  permafrost_top: [
    { color: '#ffffcc', label: '&ge;0m, &lt;1m' },
    { color: '#a1dab4', label: '&ge;1m, &lt;2m' },
    { color: '#41b6c4', label: '&ge;2m, &lt;3m' },
    { color: '#2c7fb8', label: '&ge;3m, &lt;4m' },
    { color: '#253494', label: '&ge;4m' },
  ],
}

const mapId = 'magt'
mapStore.setLegendItems(mapId, legend)

onUnmounted(() => {
  dataStore.apiData[endpoint] = null
})
</script>

<template>
  <section class="section xray">
    <div class="content is-size-5">
      <h3 class="title is-3">Permafrost Depth: Base & Top</h3>
      <XrayIntroblurb resolution="~12" unit="km" cmip="5" />
      <p class="mb-6">
        The map below shows permafrost base and top depth for three eras using
        the GFDL CM3 under the RCP 8.5 emissions scenario.
      </p>

      <MapBlock :mapId="mapId" class="mb-6">
        <template v-slot:layers>
          <h4 class="title is-4 mb-3">Permafrost Base Depth</h4>
          <MapLayer :mapId="mapId" :layer="layers[0]" default>
            <template v-slot:title>{{ layers[0].title }}</template>
          </MapLayer>

          <MapLayer :mapId="mapId" :layer="layers[2]">
            <template v-slot:title>{{ layers[2].title }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="layers[4]">
            <template v-slot:title>{{ layers[4].title }}</template>
          </MapLayer>
          <hr />
          <h4 class="title is-4 mb-3">Permafrost Top Depth</h4>
          <MapLayer :mapId="mapId" :layer="layers[1]">
            <template v-slot:title>{{ layers[1].title }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="layers[3]">
            <template v-slot:title>{{ layers[3].title }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="layers[5]">
            <template v-slot:title>{{ layers[5].title }}</template>
          </MapLayer>
        </template>
      </MapBlock>

      <p>
        Enter a location below to see charts of permafrost base and top depth
        using the GFDL CM3 and NCAR CCSM4 models and the selected emissions
        scenario. After entering a location, links will be provided where you
        can download the data that is used to populate the charts.
      </p>

      <Gimme extent="alaska" />
      <PermafrostChartControls />
      <PermafrostChart
        label="Depth of permafrost base"
        units="m"
        dataKey="permafrostbase"
        class="mb-5"
      />
      <PermafrostChart
        label="Depth of permafrost top"
        units="m"
        dataKey="permafrosttop"
      />

      <div v-if="latLng && apiData" class="my-6">
        <h4 class="title is-4">
          Download permafrost base and top depth data for
          {{ selectedCommunity ? selectedCommunity.name + ' at ' : '' }}
          {{ latLng.lat }},
          {{ latLng.lng }}
        </h4>
        <p>
          The following download links bundle permafrost base and top depth data
          with other permafrost data. Permafrost base depth uses the
          "permafrostbase" identifier. Permafrost top depth uses the
          "permafrosttop" identifier.
        </p>
        <DownloadLinks endpoint="/permafrost/point/gipl" />
      </div>
      <GetAndUseDataPermafrost :presentInNcr="true" :presentInEds="true" />
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
