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
    id: 'magt3m_earlycentury_era',
    title: '2021–2039, GFDL CM3, RCP 8.5',
    subtext: 'Depth: 3 meters',
    source: 'rasdaman',
    wmsLayerName: 'crrel_gipl_outputs_nc',
    style: 'ardac_magt3m_earlycentury_era',
    legend: 'magt',
    rasdamanConfiguration: { dim_model: 1, dim_scenario: 1 },
  },
  {
    id: 'magt3m_midcentury_era',
    title: '2040–2069, GFDL CM3, RCP 8.5',
    subtext: 'Depth: 3 meters',
    source: 'rasdaman',
    wmsLayerName: 'crrel_gipl_outputs_nc',
    style: 'ardac_magt3m_midcentury_era',
    legend: 'magt',
    rasdamanConfiguration: { dim_model: 1, dim_scenario: 1 },
  },
  {
    id: 'magt3m_latecentury_era',
    title: '2070–2099, GFDL CM3, RCP 8.5',
    subtext: 'Depth: 3 meters',
    source: 'rasdaman',
    wmsLayerName: 'crrel_gipl_outputs_nc',
    style: 'ardac_magt3m_latecentury_era',
    legend: 'magt',
    rasdamanConfiguration: { dim_model: 1, dim_scenario: 1 },
  },
]

const legend: Record<string, LegendItem[]> = {
  magt: [
    { color: '#2166ac', label: '&lt;-6°C' },
    { color: '#4393c3', label: '&ge;-6°C, &lt;-4°C' },
    { color: '#92c5de', label: '&ge;-4°C, &lt;-2°C' },
    { color: '#d1e5f0', label: '&ge;-2°C, &lt;-1°C' },
    { color: '#f7f7f7', label: '&ge;-1°C, &lt;0°C' },
    { color: '#fddbc7', label: '&ge;0°C, &lt;1°C' },
    { color: '#f4a582', label: '&ge;1°C, &lt;2°C' },
    { color: '#d6604d', label: '&ge;2°C' },
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
      <h3 class="title is-3">Ground Temperature</h3>
      <XrayIntroblurb resolution="~12" unit="km" cmip="5" />
      <p class="mb-6">
        The map below shows mean annual ground temperature at 3 meters depth for
        three eras using the GFDL CM3 under the RCP 8.5 emissions scenario.
      </p>

      <MapBlock :mapId="mapId" class="mb-6">
        <template v-slot:layers>
          <MapLayer :mapId="mapId" :layer="layers[0]" default>
            <template v-slot:title>{{ layers[0].title }}</template>
            <template v-slot:subtext>{{ layers[0].subtext }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="layers[1]">
            <template v-slot:title>{{ layers[1].title }}</template>
            <template v-slot:subtext>{{ layers[1].subtext }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="layers[2]">
            <template v-slot:title>{{ layers[2].title }}</template>
            <template v-slot:subtext>{{ layers[2].subtext }}</template>
          </MapLayer>
        </template>
      </MapBlock>

      <p>
        Enter a location below to see charts of mean annual ground temperature
        using the GFDL CM3 and NCAR CCSM4 models and the selected emissions
        scenario. After entering a location, links will be provided where you
        can download the data that is used to populate the charts.
      </p>

      <Gimme extent="alaska" />
      <PermafrostChartControls />
      <PermafrostChart
        label="Mean annual ground temperature"
        depth="Surface"
        units="°C"
        dataKey="magtsurface"
        class="mb-5"
      />
      <PermafrostChart
        label="Mean annual ground temperature"
        depth="0.5 meters"
        units="°C"
        dataKey="magt0.5m"
        class="mb-5"
      />
      <PermafrostChart
        label="Mean annual ground temperature"
        depth="1 meters"
        units="°C"
        dataKey="magt1m"
        class="mb-5"
      />
      <PermafrostChart
        label="Mean annual ground temperature"
        depth="2 meters"
        units="°C"
        dataKey="magt2m"
        class="mb-5"
      />
      <PermafrostChart
        label="Mean annual ground temperature"
        depth="3 meters"
        units="°C"
        dataKey="magt3m"
        class="mb-5"
      />
      <PermafrostChart
        label="Mean annual ground temperature"
        depth="4 meters"
        units="°C"
        dataKey="magt4m"
        class="mb-5"
      />
      <PermafrostChart
        label="Mean annual ground temperature"
        depth="5 meters"
        units="°C"
        dataKey="magt5m"
      />

      <div v-if="latLng && apiData" class="my-6">
        <h4 class="title is-4">
          Download mean annual ground temperature data for
          {{ selectedCommunity ? selectedCommunity.name + ' at ' : '' }}
          {{ latLng.lat }},
          {{ latLng.lng }}
        </h4>
        <p>
          The following download links bundle mean annual ground temperature
          data with other permafrost data. Mean annual ground temperature uses
          the "magt" identifier prefix.
        </p>
        <DownloadLinks endpoint="/permafrost/point/gipl" />
      </div>
      <GetAndUseDataPermafrost :presentInNcr="true" :presentInEds="true" />
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
