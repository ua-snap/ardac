<script lang="ts" setup>
const placesStore = usePlacesStore()
const mapStore = useMapStore()
const dataStore = useDataStore()
const runtimeConfig = useRuntimeConfig()

const apiData = computed<Record<string, any>>(() => dataStore.apiData)
const latLng = computed<LatLngValue>(() => placesStore.latLng)

const layers: MapLayer[] = [
  {
    id: 'freezing_index_historical_era',
    title: '1980–2009, Daymet',
    source: 'rasdaman',
    wmsLayerName: 'air_freezing_index_Fdays',
    style: 'ardac_freezing_index_historical_era',
    legend: 'freezing_index',
  },
  {
    id: 'freezing_index_midcentury_era',
    title: '2040–2069, NCAR CCSM4, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'air_freezing_index_Fdays',
    style: 'ardac_freezing_index_midcentury_era',
    legend: 'freezing_index',
  },
  {
    id: 'freezing_index_latecentury_era',
    title: '2070–2099, NCAR CCSM4, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'air_freezing_index_Fdays',
    style: 'ardac_freezing_index_latecentury_era',
    legend: 'freezing_index',
  },
]

const legend: Record<string, LegendItem[]> = {
  freezing_index: [
    { color: '#c6dbef', label: '&ge;0 F&sdot;days, &lt;1000 F&sdot;days' },
    { color: '#9ecae1', label: '&ge;1000 F&sdot;days, &lt;2000 F&sdot;days' },
    { color: '#6baed6', label: '&ge;2000 F&sdot;days, &lt;3000 F&sdot;days' },
    { color: '#3182bd', label: '&ge;3000 F&sdot;days, &lt;4000 F&sdot;days' },
    { color: '#08519c', label: '&ge;4000 F&sdot;days' },
  ],
}

const mapId = 'freezing_index'
mapStore.setLegendItems(mapId, legend)
</script>

<template>
  <section class="section">
    <div class="content is-size-5">
      <h3 class="title is-3">Freezing Index</h3>
      <XrayIntroblurb resolution="~12" unit="km" cmip="5" />
      <p class="mb-6">
        The freezing index is the number of degree days above freezing per year.
        The map below shows the 30-year mean of the freezing index for three
        eras. The historical era (1980&ndash;2009) uses historical modeled data
        provided by the Daymet model. The mid-century (2040&ndash;2069) and
        late-century (2070&ndash;2099) eras use modeled projections from the
        NCAR CCSM4 model under the RCP 8.5 emissions scenario.
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
        Enter lat/lon coordinates below to see a chart of the freezing index for
        a point location. This chart displays min/mean/max values for historical
        decades using the Daymet model and projected decades using both the GFDL
        CM3 and NCAR CCSM4 models under the RCP 8.5 emissions scenario.
      </p>

      <p>
        After entering lat/lon coordinates, links will be provided where you can
        download the data that is used to populate the chart.
      </p>

      <DegreeDaysChart endpoint="freezingIndex" label="Freezing index" />

      <div v-if="latLng && apiData" class="my-6">
        <h4 class="title is-4">
          Download freezing index data for {{ latLng.lat }},
          {{ latLng.lng }}
        </h4>
        <DownloadLinks endpoint="/degree_days/freezing_index" />
      </div>
      <GetAndUseDataDegreeDays :presentInEds="true">
        <li>
          Use this data in an
          <a
            href="https://ua-snap.github.io/ardac-notebooks/lab/?path=frost_depth%2FModified+Berggren+Frost+Depth.ipynb"
            >interactive computational module for computing modified Berggren
            frost depth</a
          >
        </li>
        <li>
          Use this data in an
          <a
            href="https://ua-snap.github.io/ardac-notebooks/lab/index.html?path=design_freezing_index%2Fdesign_freezing_index_module.ipynb"
            >interactive computational module for computing design freezing
            index</a
          >
        </li>
      </GetAndUseDataDegreeDays>
    </div>
  </section>
</template>

<style scoped></style>
