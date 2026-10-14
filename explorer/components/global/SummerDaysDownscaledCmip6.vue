<script lang="ts" setup>
const endpoint = 'cmip6DaysAboveThreshold'

const placesStore = usePlacesStore()
const mapStore = useMapStore()
const dataStore = useDataStore()
const chartStore = useChartStore()
const runtimeConfig = useRuntimeConfig()

const apiData = computed<Record<string, any>>(() => dataStore.apiData[endpoint])
const latLng = computed<LatLngValue>(() => placesStore.latLng)

const chartInputs = computed<Cmip6DaysAboveThresholdChartInputsObj>(
  () => chartStore.inputs[endpoint] as Cmip6DaysAboveThresholdChartInputsObj
)

// Matches the default threshold in Cmip6DaysAboveThresholdChartControls.
const defaultThreshold = 25
const threshold = computed<number>(
  () => chartInputs.value?.threshold ?? defaultThreshold
)

// Dimension indexes in the coverage: scenario 0 = historical, 4 = ssp585;
// era 0 = 1965-2014, 1 = 2041-2070, 2 = 2071-2100. The style counts days per
// year at or above the @threshold GetMap parameter, which Rasdaman requires to
// be prefixed with @.
const wmsLayerName = 'cmip6_wrf_climatologies_tmax_daily_wms_crstephenson'
const wmsUrl = 'https://zeus.snap.uaf.edu/rasdaman/ows'

const getLayer = (
  id: string,
  title: string,
  scenario: number,
  era: number
): MapLayer => ({
  id,
  title,
  source: 'rasdaman',
  wmsUrl,
  wmsLayerName,
  style: 'ardac_tmax_days_above_threshold',
  legend: 'days_above_threshold',
  rasdamanConfiguration: {
    dim_scenario: scenario,
    dim_era: era,
    '@threshold': threshold.value,
  },
  coastline: true,
})

const layers = computed<MapLayer[]>(() => [
  getLayer('days_historical', '1965–2014, Historical', 0, 0),
  getLayer('days_midcentury', '2041–2070, SSP5-8.5', 4, 1),
  getLayer('days_latecentury', '2071–2100, SSP5-8.5', 4, 2),
])

// Colors and breaks come from the Rasdaman style
// ardac_tmax_days_above_threshold.
const legend: Record<string, LegendItem[]> = {
  days_above_threshold: [
    { color: '#ffffb2', label: '0 days' },
    { color: '#fecc5c', label: '&ge;1 day, &lt;30 days' },
    { color: '#fd8d3c', label: '&ge;30 days, &lt;90 days' },
    { color: '#f03b20', label: '&ge;90 days, &lt;180 days' },
    { color: '#bd0026', label: '&ge;180 days' },
  ],
}

const mapId = 'days_above_threshold'
mapStore.setLegendItems(mapId, legend)

// Redraw the active layer when the threshold changes.
watch(threshold, () => {
  const activeLayer = mapStore.activeLayers[mapId]
  const layer = layers.value.find(layer => layer.id === activeLayer?.id)
  if (layer) {
    mapStore.toggleLayer({ mapId, layer })
  }
})
</script>

<template>
  <section class="section xray">
    <div class="content is-size-5">
      <h3 class="title is-3">Summer Days, Downscaled CMIP6</h3>
      <p class="mb-6">
        Summer days are the number of days per year when the daily maximum
        temperature is above a threshold. The traditional threshold is 25&deg;C
        (77&deg;F), but you can choose any threshold below. Enter lat/lon
        coordinates or search for a community to see a table of the number of
        days above the threshold for a modeled historical period and for
        mid-century and late-century projections under several emissions
        scenarios.
      </p>
      <p class="mb-6">
        The map below shows the number of days per year when the daily maximum
        temperature is at or above the threshold you choose below (25&deg;C
        until you change it), for a modeled historical era and for mid-century
        and late-century projections under the SSP5-8.5 emissions scenario. Days
        are counted using the mean daily maximum temperature across the years in
        each era.
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

      <Gimme />
      <Cmip6DaysAboveThresholdChartControls />
      <Cmip6DaysAboveThresholdTable class="mb-5" />

      <div v-if="latLng && apiData && chartInputs" class="my-6">
        <h4 class="title is-4">
          Download downscaled CMIP6 summer days data for {{ latLng.lat }},
          {{ latLng.lng }}
        </h4>
        <ul>
          <li>
            <a
              :href="
                runtimeConfig.public.apiUrl +
                '/cmip6_dynamic_indicators/days_above_threshold/' +
                latLng.lat +
                '/' +
                latLng.lng +
                '?threshold=' +
                chartInputs.threshold
              "
              >Download as JSON</a
            >
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
