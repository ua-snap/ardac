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
    id: 'precipitation_cmip6_1950',
    title: 'August 1950, EC-Earth3-Veg',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_pr',
    legend: 'pr',
    rasdamanConfiguration: {
      dim_model: 4,
      dim_scenario: 0,
      time: '1950-08-15T12:00:00.000Z',
    },
    coastline: true,
    default: true,
  },
  {
    id: 'precipitation_cmip6_1975',
    title: 'August 1975, EC-Earth3-Veg',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_pr',
    legend: 'pr',
    rasdamanConfiguration: {
      dim_model: 4,
      dim_scenario: 0,
      time: '1975-08-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'precipitation_cmip6_2000',
    title: 'August 2000, EC-Earth3-Veg',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_pr',
    legend: 'pr',
    rasdamanConfiguration: {
      dim_model: 4,
      dim_scenario: 0,
      time: '2000-08-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'precipitation_cmip6_2025',
    title: 'August 2025, EC-Earth3-Veg, SSP5-8.5',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_pr',
    legend: 'pr',
    rasdamanConfiguration: {
      dim_model: 4,
      dim_scenario: 4,
      time: '2025-08-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'precipitation_cmip6_2050',
    title: 'August 2050, EC-Earth3-Veg, SSP5-8.5',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_pr',
    legend: 'pr',
    rasdamanConfiguration: {
      dim_model: 4,
      dim_scenario: 4,
      time: '2050-08-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'precipitation_cmip6_2075',
    title: 'August 2075, EC-Earth3-Veg, SSP5-8.5',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_pr',
    legend: 'pr',
    rasdamanConfiguration: {
      dim_model: 4,
      dim_scenario: 4,
      time: '2075-08-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'precipitation_cmip6_2100',
    title: 'August 2100, EC-Earth3-Veg, SSP5-8.5',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_pr',
    legend: 'pr',
    rasdamanConfiguration: {
      dim_model: 4,
      dim_scenario: 4,
      time: '2100-08-15T12:00:00.000Z',
    },
    coastline: true,
  },
]

const legend: Record<string, LegendItem[]> = {
  pr: [
    { color: '#e9f0f2', label: '&ge;0㎜, &lt;50㎜' },
    { color: '#c0e1e2', label: '&ge;50㎜, &lt;100㎜' },
    { color: '#8dcbb5', label: '&ge;100㎜, &lt;150㎜' },
    { color: '#6ab385', label: '&ge;150㎜, &lt;200㎜' },
    { color: '#548f62', label: '&ge;200㎜' },
  ],
}

const mapId = 'snow_melt'
mapStore.setLegendItems(mapId, legend)

onUnmounted(() => {
  dataStore.apiData[endpoint] = null
})
</script>

<template>
  <section class="section xray">
    <div class="content is-size-5">
      <h3 class="title is-3">Precipitation, CMIP6</h3>
      <XrayIntroblurb resolution="100" unit="km" cmip="6" beta />
      <p class="mb-6">
        The map below shows modeled total precipitation for the month of August
        using the EC-Earth3-Veg model at 25-year intervals from 1950&ndash;2100.
        Intervals from 2025&ndash;2100 are based on the SSP5-8.5 emissions
        scenario.
      </p>

      <MapBlock :mapId="mapId" crs="EPSG:3572" class="mb-6">
        <template v-slot:layers>
          <MapLayer
            v-for="layer in layers"
            :mapId="mapId"
            :layer="layer"
            :key="layer.id"
            :default="layer.default"
          >
            <template v-slot:title>{{ layer.title }}</template>
          </MapLayer>
        </template>
      </MapBlock>

      <p>
        Enter a location below to see a chart of the total monthly precipitation
        for a point location using the selected model, emissions scenario, and
        month. After entering a location, links will be provided where you can
        download the data that is used to populate the chart.
      </p>

      <Gimme :bbox="[-180, 50, 180, 90]" />
      <Cmip6MonthlyChartControls defaultMonth="08" :datasetKeys="['pr']" />
      <Cmip6MonthlyChart label="Precipitation" units="㎜" dataKey="pr" />

      <div v-if="latLng && apiData" class="my-6">
        <h4 class="title is-4">
          Download CMIP6 precipitation data for {{ latLng.lat }},
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
                '?vars=pr&format=csv'
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
                '?vars=pr'
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
