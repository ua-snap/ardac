<script lang="ts" setup>
const endpoint = 'hydrology'

const placesStore = usePlacesStore()
const mapStore = useMapStore()
const dataStore = useDataStore()
const runtimeConfig = useRuntimeConfig()

const apiData = computed<any[]>(() => dataStore.apiData[endpoint])
const latLng = computed<LatLngValue>(() => placesStore.latLng)

const layers: MapLayer[] = [
  {
    id: 'iwe_historical_era',
    title: 'Ice Water Equivalent, 1980–2009, CanESM2, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'hydrology',
    style: 'ardac_iwe_historical_era',
    legend: 'iwe',
    rasdamanConfiguration: { dim_model: 3, dim_scenario: 1 },
  },
  {
    id: 'iwe_midcentury_era',
    title: 'Ice Water Equivalent, 2040–2069, CanESM2, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'hydrology',
    style: 'ardac_iwe_midcentury_era',
    legend: 'iwe',
    rasdamanConfiguration: { dim_model: 3, dim_scenario: 1 },
  },
  {
    id: 'iwe_latecentury_era',
    title: 'Ice Water Equivalent, 2070–2099, CanESM2, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'hydrology',
    style: 'ardac_iwe_latecentury_era',
    legend: 'iwe',
    rasdamanConfiguration: { dim_model: 3, dim_scenario: 1 },
  },
  {
    id: 'swe_historical_era',
    title: 'Snow Water Equivalent, 1980–2009, CanESM2, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'hydrology',
    style: 'ardac_swe_historical_era',
    legend: 'swe',
    rasdamanConfiguration: { dim_model: 3, dim_scenario: 1 },
  },
  {
    id: 'swe_midcentury_era',
    title: 'Snow Water Equivalent, 2040–2069, CanESM2, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'hydrology',
    style: 'ardac_swe_midcentury_era',
    legend: 'swe',
    rasdamanConfiguration: { dim_model: 3, dim_scenario: 1 },
  },
  {
    id: 'swe_latecentury_era',
    title: 'Snow Water Equivalent, 2070–2099, CanESM2, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'hydrology',
    style: 'ardac_swe_latecentury_era',
    legend: 'swe',
    rasdamanConfiguration: { dim_model: 3, dim_scenario: 1 },
  },
]

const legend: Record<string, LegendItem[]> = {
  iwe: [
    { color: '#9ecae1', label: '&gt;0m, &lt;15m' },
    { color: '#6baed6', label: '&ge;15m, &lt;30m' },
    { color: '#4292c6', label: '&ge;30m, &lt;45m' },
    { color: '#2171b5', label: '&ge;45m, &lt;60m' },
    { color: '#084594', label: '&ge;60m' },
  ],
  swe: [
    { color: '#9ecae1', label: '&ge;0㎜, &lt;15㎜' },
    { color: '#6baed6', label: '&ge;15㎜, &lt;30㎜' },
    { color: '#4292c6', label: '&ge;30㎜, &lt;45㎜' },
    { color: '#2171b5', label: '&ge;45㎜, &lt;60㎜' },
    { color: '#084594', label: '&ge;60㎜' },
  ],
}

const mapId = 'iswe'
mapStore.setLegendItems(mapId, legend)

onUnmounted(() => {
  dataStore.apiData[endpoint] = null
})
</script>

<template>
  <section class="section xray">
    <div class="content is-size-5">
      <h3 class="title is-3">Ice/Snow Water Equivalent</h3>
      <XrayIntroblurb resolution="~12" unit="km" cmip="5" />
      <p class="mb-6">
        The map below shows the 30-year mean monthly ice/snow water equivalent
        for three eras using the CanESM2 model under the RCP 8.5 emissions
        scenario.
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
          <MapLayer :mapId="mapId" :layer="layers[3]">
            <template v-slot:title>{{ layers[3].title }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="layers[4]">
            <template v-slot:title>{{ layers[4].title }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="layers[5]">
            <template v-slot:title>{{ layers[5].title }}</template>
          </MapLayer>
        </template>
      </MapBlock>

      <p>
        Enter a location below to see charts of mean annual ice/snow water
        equivalent per decade for a point location using the selected model,
        emissions scenario, and month. After entering a location, links will be
        provided where you can download the data that is used to populate the
        charts.
      </p>

      <Gimme extent="mizukami" />
      <HydrologyChartControls />
      <HydrologyChart
        label="Ice water equivalent"
        units="㎜"
        dataKey="iwe"
        class="mb-5"
      />
      <HydrologyChart label="Snow water equivalent" units="㎜" dataKey="swe" />

      <div v-if="latLng && apiData" class="my-6">
        <h4 class="title is-4">
          Download ice/snow water equivalent data for {{ latLng.lat }},
          {{ latLng.lng }}
        </h4>
        <p>
          The following download links bundle ice/snow water equivalent data
          with other hydrology data. Ice water equivalent uses the "iwe"
          identifier and snow water equivalent uses the "swe" identifier.
        </p>
        <ul>
          <li>
            <a
              :href="
                runtimeConfig.public.apiUrl +
                '/hydrology/point/' +
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
                '/hydrology/point/' +
                latLng.lat +
                '/' +
                latLng.lng
              "
              >Download as JSON</a
            >
          </li>
        </ul>
      </div>
      <GetAndUseDataHydrology />
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
