<script lang="ts" setup>
const placesStore = usePlacesStore()
const mapStore = useMapStore()
const dataStore = useDataStore()
const runtimeConfig = useRuntimeConfig()

const apiData = computed<Record<string, any>>(() => dataStore.apiData)
const latLng = computed<LatLngValue>(() => placesStore.latLng)

const layers: MapLayer[] = [
  {
    id: 'siconc_cmip6_1950',
    title: 'March 1950, MIROC6',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_siconc',
    legend: 'siconc',
    default: true,
    rasdamanConfiguration: {
      dim_model: 9,
      dim_scenario: 0,
      time: '1950-03-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'siconc_cmip6_1975',
    title: 'March 1975, MIROC6',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_siconc',
    legend: 'siconc',
    rasdamanConfiguration: {
      dim_model: 9,
      dim_scenario: 0,
      time: '1975-03-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'siconc_cmip6_2000',
    title: 'March 2000, MIROC6',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_siconc',
    legend: 'siconc',
    rasdamanConfiguration: {
      dim_model: 9,
      dim_scenario: 0,
      time: '2000-03-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'siconc_cmip6_2025',
    title: 'March 2025, MIROC6',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_siconc',
    legend: 'siconc',
    rasdamanConfiguration: {
      dim_model: 9,
      dim_scenario: 4,
      time: '2025-03-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'siconc_cmip6_2050',
    title: 'March 2050, MIROC6',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_siconc',
    legend: 'siconc',
    rasdamanConfiguration: {
      dim_model: 9,
      dim_scenario: 4,
      time: '2050-03-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'siconc_cmip6_2075',
    title: 'March 2075, MIROC6',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_siconc',
    legend: 'siconc',
    rasdamanConfiguration: {
      dim_model: 9,
      dim_scenario: 4,
      time: '2075-03-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'siconc_cmip6_2100',
    title: 'March 2100, MIROC6',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_siconc',
    legend: 'siconc',
    rasdamanConfiguration: {
      dim_model: 9,
      dim_scenario: 4,
      time: '2100-03-15T12:00:00.000Z',
    },
    coastline: true,
  },
]

const legend: Record<string, LegendItem[]> = {
  siconc: [
    { color: '#045a8d', label: '0&#37; &ndash; 70&#37;' },
    { color: '#2b8cbe', label: '70&#37; &ndash; 80&#37;' },
    { color: '#74a9cf', label: '80&#37; &ndash; 90&#37;' },
    { color: '#bdc9e1', label: '90&#37; &ndash; 100&#37;' },
  ],
}

const mapId = 'sea_ice_cmip6'
mapStore.setLegendItems(mapId, legend)
</script>

<template>
  <section class="section xray">
    <div class="content is-size-5">
      <XrayIntroblurb resolution="100" unit="km" cmip="6" beta />
      <h3 class="title is-3">Sea Ice Concentration, CMIP6</h3>
      <p class="mb-6">
        The map below shows modeled sea ice concentration for the month of March
        using the MIROC6 model at 25-year intervals from 1950&ndash;2100.
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
        Enter a location below to see a chart of the total monthly sea ice
        concentration for a point location using the selected model, emissions
        scenario, and month. After entering a location, links will be provided
        where you can download the data that is used to populate the chart.
      </p>

      <p>
        Coastal community queries are not supported due to the coarse resolution
        of this dataset.
      </p>

      <Gimme :bbox="[-180, 45, 180, 90]" ocean :communitiesEnabled="false" />
      <Cmip6MonthlyChartControls
        defaultModel="MIROC6"
        defaultMonth="03"
        :datasetKeys="['siconc']"
      />
      <Cmip6MonthlyChart
        label="Sea Ice Concentration"
        units="%"
        dataKey="siconc"
        chartType="lines"
      />

      <div v-if="latLng && apiData" class="my-6">
        <h4 class="title is-4">
          Download CMIP6 sea ice concentration data for {{ latLng.lat }},
          {{ latLng.lng }}
        </h4>
        <DownloadLinks endpoint="/cmip6/point" variables="siconc" />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
