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
    id: 'snow_melt_historical_era',
    title: '1980–2009, CanESM2, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'hydrology',
    style: 'ardac_snow_melt_historical_era',
    legend: 'snow_melt',
    rasdamanConfiguration: { dim_model: 3, dim_scenario: 1 },
  },
  {
    id: 'snow_melt_midcentury_era',
    title: '2040–2069, CanESM2, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'hydrology',
    style: 'ardac_snow_melt_midcentury_era',
    legend: 'snow_melt',
    rasdamanConfiguration: { dim_model: 3, dim_scenario: 1 },
  },
  {
    id: 'snow_melt_latecentury_era',
    title: '2070–2099, CanESM2, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'hydrology',
    style: 'ardac_snow_melt_latecentury_era',
    legend: 'snow_melt',
    rasdamanConfiguration: { dim_model: 3, dim_scenario: 1 },
  },
]

const legend: Record<string, LegendItem[]> = {
  snow_melt: [
    { color: '#9ecae1', label: '&ge;0㎜, &lt;50㎜' },
    { color: '#6baed6', label: '&ge;50㎜, &lt;100㎜' },
    { color: '#4292c6', label: '&ge;100㎜, &lt;150㎜' },
    { color: '#2171b5', label: '&ge;150㎜, &lt;200㎜' },
    { color: '#084594', label: '&ge;200㎜' },
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
      <h3 class="title is-3">Snow Melt</h3>
      <XrayIntroblurb resolution="~12" unit="km" cmip="5" />
      <p class="mb-6">
        The map below shows the 30-year mean annual snow melt for three eras
        using the CanESM2 model under the RCP 8.5 emissions scenario.
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
        </template>
      </MapBlock>

      <p>
        Enter a location below to see a chart of mean annual snow melt per
        decade for a point location using the selected model, emissions
        scenario, and month. After entering a location, links will be provided
        where you can download the data that is used to populate the chart.
      </p>

      <Gimme extent="mizukami" />
      <HydrologyChartControls defaultMonth="mar" />
      <HydrologyChart label="Snow melt" units="㎜" dataKey="snow_melt" />

      <div v-if="latLng && apiData" class="my-6">
        <h4 class="title is-4">
          Download snow melt data for {{ latLng.lat }},
          {{ latLng.lng }}
        </h4>
        <p>
          The following download links bundle snow melt data with other
          hydrology data. Snow melt uses the "snow_melt" identifier.
        </p>
        <DownloadLinks endpoint="/hydrology/point" />
      </div>
      <GetAndUseDataHydrology />
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
