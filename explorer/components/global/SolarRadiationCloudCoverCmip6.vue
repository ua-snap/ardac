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
    id: 'rsds_cmip6_2000',
    title: 'August 2000, HadGEM3-GC31-MM',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_rsds',
    legend: 'rsds',
    rasdamanConfiguration: {
      dim_model: 7,
      dim_scenario: 0,
      time: '2000-08-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'rsds_cmip6_2100',
    title: 'August 2100, HadGEM3-GC31-MM, SSP5-8.5',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_rsds',
    legend: 'rsds',
    rasdamanConfiguration: {
      dim_model: 7,
      dim_scenario: 4,
      time: '2100-08-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'rlds_cmip6_2000',
    title: 'August 2000, HadGEM3-GC31-MM',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_rlds',
    legend: 'rlds',
    rasdamanConfiguration: {
      dim_model: 7,
      dim_scenario: 0,
      time: '2000-08-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'rlds_cmip6_2100',
    title: 'August 2100, HadGEM3-GC31-MM, SSP5-8.5',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_rlds',
    legend: 'rlds',
    rasdamanConfiguration: {
      dim_model: 7,
      dim_scenario: 4,
      time: '2100-08-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'clt_cmip6_2000',
    title: 'August 2000, HadGEM3-GC31-MM',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_clt',
    legend: 'clt',
    rasdamanConfiguration: {
      dim_model: 7,
      dim_scenario: 0,
      time: '2000-08-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'clt_cmip6_2100',
    title: 'August 2100, HadGEM3-GC31-MM, SSP5-8.5',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_clt',
    legend: 'clt',
    rasdamanConfiguration: {
      dim_model: 7,
      dim_scenario: 4,
      time: '2100-08-15T12:00:00.000Z',
    },
    coastline: true,
  },
]

const legend: Record<string, LegendItem[]> = {
  rsds: [
    {
      color: '#f5f5c8',
      label: '&ge;0 W/m<sup>2</sup>, &lt;50 W/m<sup>2</sup>',
    },
    {
      color: '#f4e0a9',
      label: '&ge;50 W/m<sup>2</sup>, &lt;100 W/m<sup>2</sup>',
    },
    {
      color: '#f4bc88',
      label: '&ge;100 W/m<sup>2</sup>, &lt;150 W/m<sup>2</sup>',
    },
    {
      color: '#ef9073',
      label: '&ge;150 W/m<sup>2</sup>, &lt;200 W/m<sup>2</sup>',
    },
    {
      color: '#dc6961',
      label: '&ge;200 W/m<sup>2</sup>',
    },
  ],
  rlds: [
    {
      color: '#f5f5c8',
      label: '&ge;100 W/m<sup>100</sup>, &lt;175 W/m<sup>2</sup>',
    },
    {
      color: '#f4e0a9',
      label: '&ge;175 W/m<sup>2</sup>, &lt;250 W/m<sup>2</sup>',
    },
    {
      color: '#f4bc88',
      label: '&ge;250 W/m<sup>2</sup>, &lt;325 W/m<sup>2</sup>',
    },
    {
      color: '#ef9073',
      label: '&ge;325 W/m<sup>2</sup>, &lt;400 W/m<sup>2</sup>',
    },
    {
      color: '#dc6961',
      label: '&ge;400 W/m<sup>2</sup>',
    },
  ],
  clt: [
    { color: '#5082a5', label: '&ge;0%, &lt;60%' },
    { color: '#67a4c7', label: '&ge;60%, &lt;70%' },
    { color: '#94b9d4', label: '&ge;70%, &lt;80%' },
    { color: '#c7cfe0', label: '&ge;80%, &lt;90%' },
    { color: '#ebe9f0', label: '&ge;90%' },
  ],
}

const mapId = 'solar_radiation_and_cloud_cover'
mapStore.setLegendItems(mapId, legend)

onUnmounted(() => {
  dataStore.apiData[endpoint] = null
})
</script>

<template>
  <section class="section xray">
    <div class="content is-size-5">
      <h3 class="title is-3">Solar Radiation & Cloud Cover, CMIP6</h3>
      <XrayIntroblurb resolution="100" unit="km" cmip="6" beta />
      <p class="mb-6">
        The map below shows modeled mean downwelling shortwave and longwave flux
        and cloud area fraction (cloud cover) for the month of August in the
        years 2000 and 2100 using the HadGEM3-GC31-MM model. The maps for the
        year 2100 are based on the SSP5-8.5 emissions scenario.
      </p>

      <MapBlock :mapId="mapId" crs="EPSG:3572" class="mb-6">
        <template v-slot:layers>
          <h4 class="title is-4 mb-3">Downwelling Shortwave Flux</h4>
          <MapLayer :mapId="mapId" :layer="layers[0]" default>
            <template v-slot:title>{{ layers[0].title }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="layers[1]">
            <template v-slot:title>{{ layers[1].title }}</template>
          </MapLayer>
          <hr />
          <h4 class="title is-4 mb-3">Downwelling Longwave Flux</h4>
          <MapLayer :mapId="mapId" :layer="layers[2]">
            <template v-slot:title>{{ layers[2].title }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="layers[3]">
            <template v-slot:title>{{ layers[3].title }}</template>
          </MapLayer>
          <hr />
          <h4 class="title is-4 mb-3">Cloud Area Fraction (Cloud Cover)</h4>
          <MapLayer :mapId="mapId" :layer="layers[4]">
            <template v-slot:title>{{ layers[4].title }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="layers[5]">
            <template v-slot:title>{{ layers[5].title }}</template>
          </MapLayer>
        </template>
      </MapBlock>

      <p>
        Enter a location below to see charts of downwelling flux, upward heat
        flux, and cloud area fraction (cloud cover) for a point location using
        the selected model, emissions scenario, and month. After entering a
        location, links will be provided where you can download the data that is
        used to populate the charts.
      </p>

      <Gimme :bbox="[-180, 50, 180, 90]" />
      <Cmip6MonthlyChartControls
        defaultModel="HadGEM3-GC31-MM"
        defaultMonth="08"
        :datasetKeys="['rsds', 'rlds', 'hfss', 'hfls', 'clt']"
      />
      <Cmip6MonthlyChart
        label="Downwelling Shortwave Flux"
        units="W/m<sup>2</sup>"
        dataKey="rsds"
        class="mb-5"
      />
      <Cmip6MonthlyChart
        label="Downwelling Longwave Flux"
        units="W/m<sup>2</sup>"
        dataKey="rlds"
        class="mb-5"
      />
      <Cmip6MonthlyChart
        label="Surface Upward Sensible Heat Flux"
        units="W/m<sup>2</sup>"
        dataKey="hfss"
        class="mb-5"
      />
      <Cmip6MonthlyChart
        label="Surface Upward Latent Heat Flux"
        units="W/m<sup>2</sup>"
        dataKey="hfls"
        class="mb-5"
      />
      <Cmip6MonthlyChart label="Cloud Area Fraction" units="%" dataKey="clt" />

      <div v-if="latLng && apiData" class="my-6">
        <h4 class="title is-4">
          Download CMIP6 downwelling flux, upward heat flux, and cloud area
          fraction data for
          {{ selectedCommunity ? selectedCommunity.name + ' at ' : '' }}
          {{ latLng.lat }},
          {{ latLng.lng }}
        </h4>
        <DownloadLinks
          endpoint="/cmip6/point"
          variables="rsds,rlds,hfss,hfls,clt"
        />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
