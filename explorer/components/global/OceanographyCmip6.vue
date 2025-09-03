<script lang="ts" setup>
const endpoint = 'cmip6Monthly'

const placesStore = usePlacesStore()
const mapStore = useMapStore()
const dataStore = useDataStore()
const runtimeConfig = useRuntimeConfig()

const apiData = computed<any[]>(() => dataStore.apiData[endpoint])
const latLng = computed<LatLngValue>(() => placesStore.latLng)

const layers: MapLayer[] = [
  {
    id: 'psl_cmip6_2000',
    title: 'August 2000, EC-Earth3-Veg',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_psl',
    legend: 'psl',
    rasdamanConfiguration: {
      dim_model: 4,
      dim_scenario: 0,
      time: '2000-08-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'psl_cmip6_2100',
    title: 'August 2100, EC-Earth3-Veg, SSP5-8.5',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_psl',
    legend: 'psl',
    rasdamanConfiguration: {
      dim_model: 4,
      dim_scenario: 4,
      time: '2100-08-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'ts_cmip6_2000',
    title: 'August 2000, EC-Earth3-Veg',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_ts',
    legend: 'ts',
    rasdamanConfiguration: {
      dim_model: 4,
      dim_scenario: 0,
      time: '2000-08-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'ts_cmip6_2100',
    title: 'August 2100, EC-Earth3-Veg, SSP5-8.5',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_ts',
    legend: 'ts',
    rasdamanConfiguration: {
      dim_model: 4,
      dim_scenario: 4,
      time: '2100-08-15T12:00:00.000Z',
    },
    coastline: true,
  },
]

const legend: Record<string, LegendItem[]> = {
  psl: [
    { color: '#7394c1', label: '&ge;100000 Pa, &lt;100250 Pa' },
    { color: '#a8c8db', label: '&ge;100250 Pa, &lt;100500 Pa' },
    { color: '#e0ecf1', label: '&ge;100500 Pa, &lt;100750 Pa' },
    { color: '#f4e0a9', label: '&ge;100750 Pa, &lt;101000 Pa' },
    { color: '#f4a582', label: '&ge;101000 Pa' },
  ],
  ts: [
    { color: '#6468ac', label: '&lt;-20°C' },
    { color: '#7394c1', label: '&ge;-20°C, &lt;-15°C' },
    { color: '#94bcd5', label: '&ge;-15°C, &lt;-10°C' },
    { color: '#badae5', label: '&ge;-10°C, &lt;-5°C' },
    { color: '#e0ecf1', label: '&ge;-5°C, &lt;0°C' },
    { color: '#f4e0a9', label: '&ge;0°C, &lt;5°C' },
    { color: '#f4bc88', label: '&ge;5°C, &lt;10°C' },
    { color: '#ef9073', label: '&ge;10°C, &lt;15°C' },
    { color: '#dc6961', label: '&ge;15°C, &lt;20°C' },
    { color: '#ba505e', label: '&ge;20°C' },
  ],
}

const mapId = 'psl_and_ts'
mapStore.setLegendItems(mapId, legend)

onUnmounted(() => {
  dataStore.apiData[endpoint] = null
})
</script>

<template>
  <section class="section xray">
    <div class="content is-size-5">
      <h3 class="title is-3">Oceanography, CMIP6</h3>
      <XrayIntroblurb resolution="100" unit="km" cmip="6" beta />
      <p class="mb-6">
        The map below shows modeled mean sea level pressure and surface
        temperature for the month of August in the years 2000 and 2100 using the
        EC-Earth3-Veg model. The maps for the year 2100 are based on the
        SSP5-8.5 emissions scenario.
      </p>

      <MapBlock :mapId="mapId" crs="EPSG:3572" class="mb-6">
        <template v-slot:layers>
          <h4 class="title is-4 mb-3">Sea Level Pressure</h4>
          <MapLayer :mapId="mapId" :layer="layers[0]" default>
            <template v-slot:title>{{ layers[0].title }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="layers[1]">
            <template v-slot:title>{{ layers[1].title }}</template>
          </MapLayer>
          <hr />
          <h4 class="title is-4 mb-3">Surface Temperature</h4>
          <MapLayer :mapId="mapId" :layer="layers[2]">
            <template v-slot:title>{{ layers[2].title }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="layers[3]">
            <template v-slot:title>{{ layers[3].title }}</template>
          </MapLayer>
        </template>
      </MapBlock>

      <p>
        Enter a location below to see charts of the mean sea level pressure and
        surface temperature for a point location using the selected model,
        emissions scenario, and month. After entering a location, links will be
        provided where you can download the data that is used to populate the
        charts.
      </p>

      <Gimme :bbox="[-180, 50, 180, 90]" />
      <Cmip6MonthlyChartControls
        defaultMonth="08"
        :datasetKeys="['psl', 'ts']"
      />
      <Cmip6MonthlyChart
        label="Sea Level Pressure"
        units="Pa"
        dataKey="psl"
        class="mb-5"
      />
      <Cmip6MonthlyChart label="Surface Temperature" units="°C" dataKey="ts" />

      <div v-if="latLng && apiData" class="my-6">
        <h4 class="title is-4">
          Download CMIP6 sea level pressure and surface temperature data for
          {{ latLng.lat }},
          {{ latLng.lng }}
        </h4>
        <ul>
          <li>
            <a
              :href="
                runtimeConfig.public.apiUrl +
                '/cmip6/point/' +
                latLng.lat +
                '/' +
                latLng.lng +
                '?vars=psl,ts&format=csv'
              "
              >Download as CSV</a
            >
          </li>
          <li>
            <a
              :href="
                runtimeConfig.public.apiUrl +
                '/cmip6/point/' +
                latLng.lat +
                '/' +
                latLng.lng +
                '?vars=psl,ts'
              "
              >Download as JSON</a
            >
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
