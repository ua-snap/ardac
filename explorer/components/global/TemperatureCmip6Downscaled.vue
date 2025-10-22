<script lang="ts" setup>
const endpoint = 'cmip6Downscaled'

const placesStore = usePlacesStore()
const mapStore = useMapStore()
const dataStore = useDataStore()
const chartStore = useChartStore()
const runtimeConfig = useRuntimeConfig()

const apiData = computed<any[]>(() => dataStore.apiData[endpoint])
const latLng = computed<LatLngValue>(() => placesStore.latLng)

const chartInputs = computed<Cmip6DownscaledChartInputsObj>(
  () => chartStore.inputs[endpoint] as Cmip6DownscaledChartInputsObj
)

const layers: MapLayer[] = [
  {
    id: 'tasmax_cmip6_2000',
    title: '2000, 6-Model Average',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_downscaled_tasmax_wms',
    style: 'ardac_tasmax',
    legend: 'tas',
    rasdamanConfiguration: {
      dim_scenario: 0,
      dim_year: 0,
    },
    coastline: true,
  },
  {
    id: 'tasmax_cmip6_2100',
    title: '2100, 6-Model Average, SSP5-8.5',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_downscaled_tasmax_wms',
    style: 'ardac_tasmax',
    legend: 'tas',
    rasdamanConfiguration: {
      dim_scenario: 1,
      dim_year: 1,
    },
    coastline: true,
  },
  {
    id: 'tasmin_cmip6_2000',
    title: '2000, 6-Model Average',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_downscaled_tasmin_wms',
    style: 'ardac_tasmin',
    legend: 'tas',
    rasdamanConfiguration: {
      dim_scenario: 0,
      dim_year: 0,
    },
    coastline: true,
  },
  {
    id: 'tasmin_cmip6_2100',
    title: '2100, 6-Model Average, SSP5-8.5',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_downscaled_tasmin_wms',
    style: 'ardac_tasmin',
    legend: 'tas',
    rasdamanConfiguration: {
      dim_scenario: 1,
      dim_year: 1,
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
      <h3 class="title is-3">Temperature, Downscaled CMIP6</h3>
      <XrayIntroblurb resolution="4" unit="km" cmip="6" beta />
      <p class="mb-6">
        The map below shows maximum near-surface air temperature for the month
        of July and minimum near-surface air temperature for the month of
        January in the years 2000 and 2100 using a downscaled 6-model average.
        The maps for the year 2100 are based on the SSP5-8.5 emissions scenario.
      </p>

      <MapBlock :mapId="mapId" class="mb-6">
        <template v-slot:layers>
          <h4 class="title is-4 mb-3">
            July Maximum Near-surface Air Temperature
          </h4>
          <MapLayer :mapId="mapId" :layer="layers[0]" default>
            <template v-slot:title>{{ layers[0].title }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="layers[1]">
            <template v-slot:title>{{ layers[1].title }}</template>
          </MapLayer>
          <hr />
          <h4 class="title is-4 mb-3">
            January Minimum Near-surface Air Temperature
          </h4>
          <MapLayer :mapId="mapId" :layer="layers[2]">
            <template v-slot:title>{{ layers[2].title }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="layers[3]">
            <template v-slot:title>{{ layers[3].title }}</template>
          </MapLayer>
        </template>
      </MapBlock>

      <Gimme extent="cmip6Downscaled" />
      <Cmip6DownscaledChartControls :datasetKeys="['tasmax', 'tasmin']" />
      <Cmip6DownscaledChart
        label="Maximum Near-surface Air Temperature"
        units="°C"
        dataKey="tasmax"
        class="mb-5"
      />
      <Cmip6DownscaledChart
        label="Minimum Near-surface Air Temperature"
        units="°C"
        dataKey="tasmin"
        class="mb-5"
      />

      <div v-if="latLng && apiData" class="my-6">
        <h4 class="title is-4">
          Download downscaled CMIP6 temperature data for {{ latLng.lat }},
          {{ latLng.lng }}
        </h4>
        <ul>
          <li>
            <a
              :href="
                runtimeConfig.public.apiUrl +
                '/cmip6_downscaled/point/' +
                latLng.lat +
                '/' +
                latLng.lng +
                '?models=' +
                chartInputs!.model +
                '&scenarios=historical,' +
                chartInputs!.scenario +
                '&vars=tasmin,tasmax&format=csv'
              "
              >Download as CSV</a
            >
          </li>
          <li>
            <a
              :href="
                runtimeConfig.public.apiUrl +
                '/cmip6_downscaled/point/' +
                latLng.lat +
                '/' +
                latLng.lng +
                '?models=' +
                chartInputs!.model +
                '&scenarios=historical,' +
                chartInputs!.scenario +
                '&vars=tasmin,tasmax'
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
