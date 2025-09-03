<script lang="ts" setup>
const endpoint = 'permafrost'

const mapStore = useMapStore()
const dataStore = useDataStore()
const placesStore = usePlacesStore()
const runtimeConfig = useRuntimeConfig()

const apiData = computed<any[]>(() => dataStore.apiData[endpoint])
const latLng = computed<LatLngValue>(() => placesStore.latLng)

const layers: MapLayer[] = [
  {
    id: 'talikthickness_earlycentury_era',
    title: '2021–2039, GFDL CM3, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'crrel_gipl_outputs_nc',
    style: 'ardac_talikthickness_earlycentury_era',
    legend: 'talikthickness',
    rasdamanConfiguration: { dim_model: 1, dim_scenario: 1 },
  },
  {
    id: 'talikthickness_midcentury_era',
    title: '2040–2069, GFDL CM3, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'crrel_gipl_outputs_nc',
    style: 'ardac_talikthickness_midcentury_era',
    legend: 'talikthickness',
    rasdamanConfiguration: { dim_model: 1, dim_scenario: 1 },
  },
  {
    id: 'talikthickness_latecentury_era',
    title: '2070–2099, GFDL CM3, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'crrel_gipl_outputs_nc',
    style: 'ardac_talikthickness_latecentury_era',
    legend: 'talikthickness',
    rasdamanConfiguration: { dim_model: 1, dim_scenario: 1 },
  },
]

const legend: Record<string, LegendItem[]> = {
  talikthickness: [
    { color: '#253494', label: '&ge;0m, &lt;0.25m' },
    { color: '#2c7fb8', label: '&ge;0.25m, &lt;0.5m' },
    { color: '#41b6c4', label: '&ge;0.5m, &lt;1m' },
    { color: '#a1dab4', label: '&ge;1m, &lt;2m' },
    { color: '#ffffcc', label: '&ge;2m' },
  ],
}

const mapId = 'talikthickness'
mapStore.setLegendItems(mapId, legend)

onUnmounted(() => {
  dataStore.apiData[endpoint] = null
})
</script>

<template>
  <section class="section xray">
    <div class="content is-size-5">
      <h3 class="title is-3">Talik Thickness</h3>
      <XrayIntroblurb resolution="~12" unit="km" cmip="5" />
      <p class="mb-6">
        The map below shows talik thickness for three eras using the GFDL CM3
        model under the RCP 8.5 emissions scenario.
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
        Enter a location below to see a chart of talik thickness using the GFDL
        CM3 and NCAR CCSM4 models and the selected emissions scenario. After
        entering a location, links will be provided where you can download the
        data that is used to populate the chart.
      </p>

      <Gimme extent="alaska" />
      <PermafrostChartControls />
      <PermafrostChart
        label="Talik thickness"
        units="m"
        dataKey="talikthickness"
      />

      <div v-if="latLng && apiData" class="my-6">
        <h4 class="title is-4">
          Download talik thickness data for {{ latLng.lat }},
          {{ latLng.lng }}
        </h4>
        <p>
          The following download links bundle talik thickness data with other
          permafrost data. Talik thickness uses the "talikthickness" identifier.
        </p>
        <ul>
          <li>
            <a
              :href="
                runtimeConfig.public.apiUrl +
                '/permafrost/point/gipl/' +
                latLng.lat +
                '/' +
                latLng.lng +
                '?format=csv'
              "
              >Download as CSV</a
            >
          </li>
          <li>
            <a
              :href="
                runtimeConfig.public.apiUrl +
                '/permafrost/point/gipl/' +
                latLng.lat +
                '/' +
                latLng.lng
              "
              >Download as JSON</a
            >
          </li>
        </ul>
      </div>
      <GetAndUseDataPermafrost />
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
