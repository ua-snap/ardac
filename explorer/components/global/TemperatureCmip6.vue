<script lang="ts" setup>
const endpoint = 'cmip6Monthly'

const placesStore = usePlacesStore()
const mapStore = useMapStore()
const dataStore = useDataStore()
const runtimeConfig = useRuntimeConfig()

const apiData = computed<any[]>(() => dataStore.apiData[endpoint])
const latLng = computed<LatLngValue>(() => placesStore.latLng)
const selectedCommunity = computed<CommunityValue>(
  () => placesStore.selectedCommunity
)

const layers: MapLayer[] = [
  {
    id: 'tas_cmip6_2000',
    title: '2000, GFDL-ESM4',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_tas',
    legend: 'tas',
    rasdamanConfiguration: {
      dim_model: 5,
      dim_scenario: 0,
      time: '2000-07-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'tas_cmip6_2100',
    title: '2100, GFDL-ESM4, SSP5-8.5',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_tas',
    legend: 'tas',
    rasdamanConfiguration: {
      dim_model: 5,
      dim_scenario: 4,
      time: '2100-07-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'tasmax_cmip6_2000',
    title: '2000, GFDL-ESM4',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_tasmax',
    legend: 'tas',
    rasdamanConfiguration: {
      dim_model: 5,
      dim_scenario: 0,
      time: '2000-07-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'tasmax_cmip6_2100',
    title: '2100, GFDL-ESM4, SSP5-8.5',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_tasmax',
    legend: 'tas',
    rasdamanConfiguration: {
      dim_model: 5,
      dim_scenario: 4,
      time: '2100-07-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'tasmin_cmip6_2000',
    title: '2000, GFDL-ESM4',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_tasmin',
    legend: 'tas',
    rasdamanConfiguration: {
      dim_model: 5,
      dim_scenario: 0,
      time: '2000-01-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'tasmin_cmip6_2100',
    title: '2100, GFDL-ESM4, SSP5-8.5',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_tasmin',
    legend: 'tas',
    rasdamanConfiguration: {
      dim_model: 5,
      dim_scenario: 4,
      time: '2100-01-15T12:00:00.000Z',
    },
    coastline: true,
  },
]

const legend: Record<string, LegendItem[]> = {
  tas: [
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

const mapId = 'tas'
mapStore.setLegendItems(mapId, legend)

onUnmounted(() => {
  dataStore.apiData[endpoint] = null
})
</script>

<template>
  <section class="section xray">
    <div class="content is-size-5">
      <h3 class="title is-3">Temperature, CMIP6</h3>
      <XrayIntroblurb resolution="100" unit="km" cmip="6" beta />
      <p class="mb-6">
        The map below shows modeled mean near-surface air temperature for the
        month of July, the maximum near-surface air temperature for the month of
        July, and the minimum near-surface air temperature for the month of
        January in the years 2000 and 2100 using the GFDL-ESM4 model. The maps
        for the year 2100 are based on the SSP5-8.5 emissions scenario.
      </p>

      <MapBlock :mapId="mapId" crs="EPSG:3572" class="mb-6">
        <template v-slot:layers>
          <h4 class="title is-4 mb-3">
            July Mean Near-surface Air Temperature
          </h4>
          <MapLayer :mapId="mapId" :layer="layers[0]" default>
            <template v-slot:title>{{ layers[0].title }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="layers[1]">
            <template v-slot:title>{{ layers[1].title }}</template>
          </MapLayer>
          <hr />
          <h4 class="title is-4 mb-3">
            July Maximum Near-surface Air Temperature
          </h4>
          <MapLayer :mapId="mapId" :layer="layers[2]">
            <template v-slot:title>{{ layers[2].title }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="layers[3]">
            <template v-slot:title>{{ layers[3].title }}</template>
          </MapLayer>
          <hr />
          <h4 class="title is-4 mb-3">
            January Minimum Near-surface Air Temperature
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
        Enter a location below to see charts of near-surface air temperature for
        a point location using the selected model, emissions scenario, and
        month. After entering a location, links will be provided where you can
        download the data that is used to populate the charts.
      </p>

      <Gimme :bbox="[-180, 50, 180, 90]" />
      <Cmip6MonthlyChartControls
        defaultModel="GFDL-ESM4"
        defaultMonth="07"
        :datasetKeys="['tas', 'tasmax', 'tasmin']"
      />
      <Cmip6MonthlyChart
        label="Mean Near-surface Air Temperature"
        units="°C"
        dataKey="tas"
        class="mb-5"
      />
      <Cmip6MonthlyChart
        label="Maximum Near-surface Air Temperature"
        units="°C"
        dataKey="tasmax"
        class="mb-5"
      />
      <Cmip6MonthlyChart
        label="Mininum Near-surface Air Temperature"
        units="°C"
        dataKey="tasmin"
        class="mb-5"
      />

      <div v-if="latLng && apiData" class="my-6">
        <h4 class="title is-4">
          Download CMIP6 temperature data for
          {{ selectedCommunity ? selectedCommunity.name + ' at ' : '' }}
          {{ latLng.lat }},
          {{ latLng.lng }}
        </h4>
        <DownloadLinks endpoint="/cmip6/point" variables="tas,tasmax,tasmin" />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
