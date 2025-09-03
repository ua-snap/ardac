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
    id: 'sfcWind_cmip6_2000',
    title: 'August 2000, EC-Earth3-Veg',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_sfcWind',
    legend: 'sfcWind',
    rasdamanConfiguration: {
      dim_model: 4,
      dim_scenario: 0,
      time: '2000-08-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'sfcWind_cmip6_2100',
    title: 'August 2100, EC-Earth3-Veg, SSP5-8.5',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_sfcWind',
    legend: 'sfcWind',
    rasdamanConfiguration: {
      dim_model: 4,
      dim_scenario: 4,
      time: '2100-08-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'uas_cmip6_2000',
    title: 'August 2000, EC-Earth3-Veg',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_uas',
    legend: 'uas',
    rasdamanConfiguration: {
      dim_model: 4,
      dim_scenario: 0,
      time: '2000-08-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'uas_cmip6_2100',
    title: 'August 2100, EC-Earth3-Veg, SSP5-8.5',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_uas',
    legend: 'uas',
    rasdamanConfiguration: {
      dim_model: 4,
      dim_scenario: 4,
      time: '2100-08-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'vas_cmip6_2000',
    title: 'August 2000, EC-Earth3-Veg',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_vas',
    legend: 'vas',
    rasdamanConfiguration: {
      dim_model: 4,
      dim_scenario: 0,
      time: '2000-08-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'vas_cmip6_2100',
    title: 'August 2100, EC-Earth3-Veg, SSP5-8.5',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_vas',
    legend: 'vas',
    rasdamanConfiguration: {
      dim_model: 4,
      dim_scenario: 4,
      time: '2100-08-15T12:00:00.000Z',
    },
    coastline: true,
  },
]

const legend: Record<string, LegendItem[]> = {
  sfcWind: [
    { color: '#5c5c5c', label: '&ge;0 m/s, &lt;1.5 m/s' },
    { color: '#878787', label: '&ge;1.5 m/s, &lt;3 m/s' },
    { color: '#ababab', label: '&ge;3 m/s, &lt;4.5 m/s' },
    { color: '#d1d1d1', label: '&ge;4.5 m/s, &lt;6 m/s' },
    { color: '#efefef', label: '&ge;6 m/s' },
  ],
  uas: [
    { color: '#cf5c9a', label: '&lt;-3 m/s' },
    { color: '#e096bd', label: '&ge;-3 m/s, &lt;-2 m/s' },
    { color: '#ecc2da', label: '&ge;-2 m/s, &lt;-1 m/s' },
    { color: '#f3dfea', label: '&ge;-1 m/s, &lt;0 m/s' },
    { color: '#e3eed5', label: '&ge;0 m/s, &lt;1 m/s' },
    { color: '#c4dfa1', label: '&ge;1 m/s, &lt;2 m/s' },
    { color: '#9cc674', label: '&ge;2 m/s, &lt;3 m/s' },
    { color: '#7aa95f', label: '&ge;3 m/s' },
  ],
  vas: [
    { color: '#cf5c9a', label: '&lt;-3 m/s' },
    { color: '#e096bd', label: '&ge;-3 m/s, &lt;-2 m/s' },
    { color: '#ecc2da', label: '&ge;-2 m/s, &lt;-1 m/s' },
    { color: '#f3dfea', label: '&ge;-1 m/s, &lt;0 m/s' },
    { color: '#e3eed5', label: '&ge;0 m/s, &lt;1 m/s' },
    { color: '#c4dfa1', label: '&ge;1 m/s, &lt;2 m/s' },
    { color: '#9cc674', label: '&ge;2 m/s, &lt;3 m/s' },
    { color: '#7aa95f', label: '&ge;3 m/s' },
  ],
}

const mapId = 'wind'
mapStore.setLegendItems(mapId, legend)

onUnmounted(() => {
  dataStore.apiData[endpoint] = null
})
</script>

<template>
  <section class="section xray">
    <div class="content is-size-5">
      <h3 class="title is-3">Wind, CMIP6</h3>
      <XrayIntroblurb resolution="100" unit="km" cmip="6" beta />
      <p class="mb-6">
        The map below shows modeled mean near-surface wind speed, mean
        near-surface eastward wind speed, and near-surface northward wind speed
        for the month of August in the years 2000 and 2100 using the
        EC-Earth3-Veg model. The maps for the year 2100 are based on the
        SSP5-8.5 emissions scenario.
      </p>

      <MapBlock :mapId="mapId" crs="EPSG:3572" class="mb-6">
        <template v-slot:layers>
          <h4 class="title is-4 mb-3">August Near-surface Wind Speed</h4>
          <MapLayer :mapId="mapId" :layer="layers[0]" default>
            <template v-slot:title>{{ layers[0].title }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="layers[1]">
            <template v-slot:title>{{ layers[1].title }}</template>
          </MapLayer>
          <hr />
          <h4 class="title is-4 mb-3">
            August Near-surface Eastward Wind Speed
          </h4>
          <MapLayer :mapId="mapId" :layer="layers[2]">
            <template v-slot:title>{{ layers[2].title }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="layers[3]">
            <template v-slot:title>{{ layers[3].title }}</template>
          </MapLayer>
          <hr />
          <h4 class="title is-4 mb-3">
            August Near-surface Northward Wind Speed
          </h4>
          <MapLayer :mapId="mapId" :layer="layers[4]">
            <template v-slot:title>{{ layers[4].title }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="layers[5]">
            <template v-slot:title>{{ layers[5].title }}</template>
          </MapLayer>
        </template>
      </MapBlock>

      <p>
        Enter a location below to see charts of the mean near-surface wind
        speed, near-surface eastern wind speed, and near-surface northward wind
        speed for a point location using the selected model, emissions scenario,
        and month. After entering a location, links will be provided where you
        can download the data that is used to populate the charts.
      </p>

      <Gimme :bbox="[-180, 50, 180, 90]" />
      <Cmip6MonthlyChartControls
        defaultMonth="08"
        :datasetKeys="['sfcWind', 'uas', 'vas']"
      />
      <Cmip6MonthlyChart
        label="Near-surface Wind Speed"
        units="m/s"
        dataKey="sfcWind"
        class="mb-5"
      />
      <Cmip6MonthlyChart
        label="Near-surface Eastward Wind Speed"
        units="m/s"
        dataKey="uas"
        class="mb-5"
      />
      <Cmip6MonthlyChart
        label="Near-surface Northward Wind Speed"
        units="m/s"
        dataKey="vas"
      />

      <div v-if="latLng && apiData" class="my-6">
        <h4 class="title is-4">
          Download CMIP6 near-surface wind speed data for {{ latLng.lat }},
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
                '?vars=sfcWind,uas,vas&format=csv'
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
                '?vars=sfcWind,uas,vas'
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
