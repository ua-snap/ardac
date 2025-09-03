<script lang="ts" setup>
const placesStore = usePlacesStore()
const mapStore = useMapStore()
const dataStore = useDataStore()
const runtimeConfig = useRuntimeConfig()

const apiData = computed<Record<string, any>>(() => dataStore.apiData)
const latLng = computed<LatLngValue>(() => placesStore.latLng)

const layers: MapLayer[] = [
  {
    id: 'indicator_rx1day_historical_era',
    title: '1980–2009, TaiESM1',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_indicators',
    style: 'ardac_indicator_rx1day_historical_era',
    legend: 'rx1day',
    rasdamanConfiguration: { dim_model: 11, dim_scenario: 0 },
    coastline: true,
  },
  {
    id: 'indicator_rx1day_midcentury_era',
    title: '2040–2069, TaiESM1, SSP5-8.5',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_indicators',
    style: 'ardac_indicator_rx1day_midcentury_era',
    legend: 'rx1day',
    rasdamanConfiguration: { dim_model: 11, dim_scenario: 4 },
    coastline: true,
  },
  {
    id: 'indicator_rx1day_latecentury_era',
    title: '2070–2099, TaiESM1, SSP5-8.5',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_indicators',
    style: 'ardac_indicator_rx1day_latecentury_era',
    legend: 'rx1day',
    rasdamanConfiguration: { dim_model: 11, dim_scenario: 4 },
    coastline: true,
  },
]

const legend: Record<string, LegendItem[]> = {
  rx1day: [
    { color: '#e9f0f2', label: '&ge;0㎜, &lt;10㎜' },
    { color: '#c0e1e2', label: '&ge;10㎜, &lt;20㎜' },
    { color: '#8dcbb5', label: '&ge;20㎜, &lt;30㎜' },
    { color: '#6ab385', label: '&ge;30㎜, &lt;40㎜' },
    { color: '#548f62', label: '&ge;40㎜' },
  ],
}

const mapId = 'maximum_1_day_precipitation'
mapStore.setLegendItems(mapId, legend)
</script>

<template>
  <section class="section xray">
    <div class="content is-size-5">
      <h3 class="title is-3">Maximum 1-day Precipitation, CMIP6</h3>
      <XrayIntroblurb resolution="100" unit="km" cmip="6" beta />
      <p class="mb-6">
        The map below shows the 30-year mean of CMIP6 maximum 1-day
        precipitation for three eras. The historical era (1980&ndash;2009) uses
        historical modeled data provided by the TaiESM1 model. The mid-century
        (2040&ndash;2069) and late-century (2070&ndash;2099) eras use modeled
        projections from the TaiESM1 model under the SSP5-8.5 emissions
        scenario.
      </p>

      <MapBlock :mapId="mapId" crs="EPSG:3572" class="mb-6">
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
        Enter lat/lon coordinates below to see a chart of maximum 1-day
        precipitation for a point location. This chart displays annual
        min/mean/max values for modeled historical and projected decades for ten
        models and four scenarios. After entering lat/lon coordinates, links
        will be provided where you can download the data that is used to
        populate the chart.
      </p>

      <Gimme :bbox="[-180, 50, 180, 90]" />
      <IndicatorsCmip6ChartControls />
      <IndicatorsCmip6Chart
        label="Maximum 1-day precipitation"
        units="㎜"
        dataKey="rx1day"
      />

      <div v-if="latLng && apiData" class="my-6">
        <h4 class="title is-4">
          Download maximum 1-day precipitation data for {{ latLng.lat }},
          {{ latLng.lng }}
        </h4>
        <p>
          The following download links bundle maximum 1-day precipitation data
          with other climate indicators. Maximum 1-day precipitation uses the
          "rx1day" identifier.
        </p>
        <ul>
          <li>
            <a
              :href="
                runtimeConfig.public.apiUrl +
                '/indicators/cmip6/point/' +
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
                '/indicators/cmip6/point/' +
                latLng.lat +
                '/' +
                latLng.lng
              "
              >Download as JSON</a
            >
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
