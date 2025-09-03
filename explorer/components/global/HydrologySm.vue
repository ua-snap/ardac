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
    id: 'sm1_historical_era',
    title: 'Soil Moisture (Layer 1), 1980–2009, CanESM2, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'hydrology',
    style: 'ardac_sm1_historical_era',
    legend: 'sm1',
    rasdamanConfiguration: { dim_model: 3, dim_scenario: 1 },
  },
  {
    id: 'sm1_midcentury_era',
    title: 'Soil Moisture (Layer 1), 2040–2069, CanESM2, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'hydrology',
    style: 'ardac_sm1_midcentury_era',
    legend: 'sm1',
    rasdamanConfiguration: { dim_model: 3, dim_scenario: 1 },
  },
  {
    id: 'sm1_latecentury_era',
    title: 'Soil Moisture (Layer 1), 2070–2099, CanESM2, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'hydrology',
    style: 'ardac_sm1_latecentury_era',
    legend: 'sm1',
    rasdamanConfiguration: { dim_model: 3, dim_scenario: 1 },
  },
  {
    id: 'sm2_historical_era',
    title: 'Soil Moisture (Layer 2), 1980–2009, CanESM2, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'hydrology',
    style: 'ardac_sm2_historical_era',
    legend: 'sm2',
    rasdamanConfiguration: { dim_model: 3, dim_scenario: 1 },
  },
  {
    id: 'sm2_midcentury_era',
    title: 'Soil Moisture (Layer 2), 2040–2069, CanESM2, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'hydrology',
    style: 'ardac_sm2_midcentury_era',
    legend: 'sm2',
    rasdamanConfiguration: { dim_model: 3, dim_scenario: 1 },
  },
  {
    id: 'sm2_latecentury_era',
    title: 'Soil Moisture (Layer 2), 2070–2099, CanESM2, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'hydrology',
    style: 'ardac_sm2_latecentury_era',
    legend: 'sm2',
    rasdamanConfiguration: { dim_model: 3, dim_scenario: 1 },
  },
  {
    id: 'sm3_historical_era',
    title: 'Soil Moisture (Layer 3), 1980–2009, CanESM2, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'hydrology',
    style: 'ardac_sm3_historical_era',
    legend: 'sm3',
    rasdamanConfiguration: { dim_model: 3, dim_scenario: 1 },
  },
  {
    id: 'sm3_midcentury_era',
    title: 'Soil Moisture (Layer 3), 2040–2069, CanESM2, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'hydrology',
    style: 'ardac_sm3_midcentury_era',
    legend: 'sm3',
    rasdamanConfiguration: { dim_model: 3, dim_scenario: 1 },
  },
  {
    id: 'sm3_latecentury_era',
    title: 'Soil Moisture (Layer 3), 2070–2099, CanESM2, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'hydrology',
    style: 'ardac_sm3_latecentury_era',
    legend: 'sm3',
    rasdamanConfiguration: { dim_model: 3, dim_scenario: 1 },
  },
]

const legend: Record<string, LegendItem[]> = {
  sm1: [
    { color: '#edf8fb', label: '&ge;0.0㎜, &lt;2.5㎜' },
    { color: '#b2e2e2', label: '&ge;2.5㎜, &lt;5.0㎜' },
    { color: '#66c2a4', label: '&ge;5.0㎜, &lt;7.5㎜' },
    { color: '#2ca25f', label: '&ge;7.5㎜, &lt;10.0㎜' },
    { color: '#006d2c', label: '&ge;10.0㎜' },
  ],
  sm2: [
    { color: '#edf8fb', label: '&ge;0.0㎜, &lt;100㎜' },
    { color: '#b2e2e2', label: '&ge;100㎜, &lt;200㎜' },
    { color: '#66c2a4', label: '&ge;200㎜, &lt;300㎜' },
    { color: '#2ca25f', label: '&ge;300㎜, &lt;400㎜' },
    { color: '#006d2c', label: '&ge;400㎜' },
  ],
  sm3: [
    { color: '#edf8fb', label: '&ge;0㎜, &lt;5㎜' },
    { color: '#b2e2e2', label: '&ge;5㎜, &lt;10㎜' },
    { color: '#66c2a4', label: '&ge;10㎜, &lt;15㎜' },
    { color: '#2ca25f', label: '&ge;15㎜, &lt;20㎜' },
    { color: '#006d2c', label: '&ge;20㎜' },
  ],
}

const mapId = 'sm'
mapStore.setLegendItems(mapId, legend)

onUnmounted(() => {
  dataStore.apiData[endpoint] = null
})
</script>

<template>
  <section class="section xray">
    <div class="content is-size-5">
      <h3 class="title is-3">Soil Moisture</h3>
      <XrayIntroblurb resolution="~12" unit="km" cmip="5" />
      <p class="mb-6">
        The map below shows the mean monthly soil moisture for soil layers
        1&ndash;3 across three 30-year eras using the CanESM2 model under the
        RCP 8.5 emissions scenario.
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
          <MapLayer :mapId="mapId" :layer="layers[6]">
            <template v-slot:title>{{ layers[6].title }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="layers[7]">
            <template v-slot:title>{{ layers[7].title }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="layers[8]">
            <template v-slot:title>{{ layers[8].title }}</template>
          </MapLayer>
        </template>
      </MapBlock>

      <p>
        Enter a location below to see charts of mean monthly soil moisture per
        decade for a point location using the selected model, emissions
        scenario, and month. After entering a location, links will be provided
        where you can download the data that is used to populate the charts.
      </p>

      <Gimme extent="mizukami" />
      <HydrologyChartControls />
      <HydrologyChart
        label="Soil moisture, layer 1"
        units="㎜"
        dataKey="sm1"
        class="mb-5"
      />
      <HydrologyChart
        label="Soil moisture, layer 2"
        units="㎜"
        dataKey="sm2"
        class="mb-5"
      />
      <HydrologyChart
        label="Soil moisture, layer 3"
        units="㎜"
        dataKey="sm3"
        class="mb-5"
      />

      <div v-if="latLng && apiData" class="my-6">
        <h4 class="title is-4">
          Download soil moisture data for {{ latLng.lat }},
          {{ latLng.lng }}
        </h4>
        <p>
          The following download links bundle soil moisture data with other
          hydrology data. Soil moisture uses the "sm1" (layer 1), "sm2" (layer
          2), and "sm3" (layer 3) identifiers.
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
