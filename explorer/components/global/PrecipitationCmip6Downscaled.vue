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
    id: 'pr_cmip6_2000',
    title: 'August 2000, 7-Model Average',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_downscaled_pr_wms',
    style: 'ardac_pr',
    legend: 'pr',
    rasdamanConfiguration: {
      dim_scenario: 0,
      dim_year: 0,
    },
    coastline: true,
  },
  {
    id: 'pr_cmip6_2100',
    title: 'August 2100, 7-Model Average, SSP5-8.5',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_downscaled_pr_wms',
    style: 'ardac_pr',
    legend: 'pr',
    rasdamanConfiguration: {
      dim_scenario: 1,
      dim_year: 1,
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

const mapId = 'pr'
mapStore.setLegendItems(mapId, legend)

onUnmounted(() => {
  dataStore.apiData[endpoint] = null
})
</script>

<template>
  <section class="section xray">
    <div class="content is-size-5">
      <h3 class="title is-3">Precipitation, Downscaled CMIP6</h3>
      <XrayIntroblurb resolution="4" unit="km" cmip="6" beta />
      <MapBlock :mapId="mapId" class="mb-6">
        <template v-slot:layers>
          <MapLayer :mapId="mapId" :layer="layers[0]" default>
            <template v-slot:title>{{ layers[0].title }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="layers[1]">
            <template v-slot:title>{{ layers[1].title }}</template>
          </MapLayer>
        </template>
      </MapBlock>

      <Gimme extent="cmip6Downscaled" />
      <Cmip6DownscaledChartControls :datasetKeys="['pr']" />
      <Cmip6DownscaledChart
        label="Precipitation"
        units="㎜"
        dataKey="pr"
        class="mb-5"
      />

      <div v-if="latLng && apiData" class="my-6">
        <h4 class="title is-4">
          Download downscaled CMIP6 precipitation data for {{ latLng.lat }},
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
                '&vars=pr&format=csv'
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
                '&vars=pr'
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
