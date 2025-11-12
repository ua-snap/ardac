<script lang="ts" setup>
import { getDefaultWindow } from '~/utils/era5WrfTransforms'
import {
  ERA5_WRF_VARIABLES,
  ERA5_WRF_CONFIG,
  type Era5WrfVariableKey,
} from '~/utils/era5WrfConstants'

const { $Plotly } = useNuxtApp()
const runtimeConfig = useRuntimeConfig()
const dataStore = useDataStore()
const placesStore = usePlacesStore()
const mapStore = useMapStore()

const endpoint = 'era5wrf'
const era5wrfExtent = 'cmip6Downscaled'

const latLng = computed(() => placesStore.latLng)
const apiData = computed(() => dataStore.apiData[endpoint] ?? null)
const selectedCommunity = computed<CommunityValue>(
  () => placesStore.selectedCommunity
)

// Chart IDs used by Era5Wrf chart components
const CHART_IDS = [
  'era5-temperature-chart',
  'era5-humidity-chart',
  'era5-precipitation-chart',
  'wind-rose-mean',
]

const dataError = computed(() => dataStore.dataErrors[endpoint] ?? false)

// Date range state
const startDate = ref<string>('')
const endDate = ref<string>('')

// Define all variables to visualize
// omitting seaice_max and wspd10_max for now
const variables: Era5WrfVariableKey[] = [
  't2_max',
  't2_mean',
  't2_min',
  'rh2_max',
  'rh2_mean',
  'rh2_min',
  'rainnc_sum',
  'wspd10_mean',
  'wdir10_mean',
]

// Use composable for series preparation
const { seriesByVariable } = useEra5WrfSeries(startDate, endDate, variables)

// Initialize date range when data loads
watch(
  apiData,
  newData => {
    if (newData && !startDate.value) {
      const defaultWindow = getDefaultWindow(newData)
      if (defaultWindow) {
        startDate.value = defaultWindow.start
        endDate.value = defaultWindow.end
      }
    }
  },
  { immediate: true }
)

// Proactively purge all Era5Wrf charts (following WetDaysPerYear pattern)
const purgeAllCharts = () => {
  CHART_IDS.forEach(chartId => {
    try {
      const element = document.getElementById(chartId)
      if (element && element.hasChildNodes()) {
        $Plotly.purge(chartId)
      }
    } catch (error) {
      // Ignore purge errors - chart may already be cleaned up
      console.debug(`Chart purge skipped for ${chartId}:`, error)
    }
  })
}

const fetchData = () => {
  if (!latLng.value) return
  dataStore.fetchData(endpoint)
}

const layers: MapLayer[] = [
  {
    id: 'era5_extreme_cold',
    title: 'Extreme Cold: January 23, 1971',
    source: 'rasdaman',
    wmsLayerName: 'era5_4km_daily_t2_min',
    style: 'ardac_t2_min_daily',
    legend: 'era5_cold',
    rasdamanConfiguration: { time: '1971-01-23T00:00:00.000Z' },
  },
  {
    id: 'era5_extreme_precip',
    title: 'Extreme Precipitation: October 10, 1986',
    source: 'rasdaman',
    wmsLayerName: 'era5_4km_daily_rainnc_sum',
    style: 'ardac_rainnc_sum_daily',
    legend: 'era5_precip',
    rasdamanConfiguration: { time: '1986-10-10T00:00:00.000Z' },
  },
  {
    id: 'era5_extreme_heat',
    title: 'Extreme Heat: June 21, 1991',
    source: 'rasdaman',
    wmsLayerName: 'era5_4km_daily_t2_max',
    style: 'ardac_t2_max_daily',
    legend: 'era5_heat',
    rasdamanConfiguration: { time: '1991-06-21T00:00:00.000Z' },
  },
  {
    id: 'era5_extreme_wind',
    title: 'Extreme Wind: December 22, 2020',
    source: 'rasdaman',
    wmsLayerName: 'era5_4km_daily_wspd10_max',
    style: 'ardac_wspd10_max_daily',
    legend: 'era5_wind',
    rasdamanConfiguration: { time: '2020-12-22T00:00:00.000Z' },
  },
]

const legend: Record<string, LegendItem[]> = {
  era5_cold: [
    { color: '#3b4cc0', label: '&lt;-40°C' },
    { color: '#9bb2e8', label: '-40°C to -20°C' },
    { color: '#f7f7f7', label: '-20°C to 0°C' },
    { color: '#fcbba1', label: '0°C to 15°C' },
    { color: '#d6604d', label: '&ge;15°C' },
  ],
  era5_heat: [
    { color: '#3b4cc0', label: '&lt;-40°C' },
    { color: '#9bb2e8', label: '-40°C to -20°C' },
    { color: '#f7f7f7', label: '-20°C to 0°C' },
    { color: '#fcbba1', label: '0°C to 15°C' },
    { color: '#d6604d', label: '&ge;15°C' },
  ],
  era5_precip: [
    { color: '#ffffff', label: '0mm' },
    { color: '#9ecae1', label: '1-5mm' },
    { color: '#4292c6', label: '5-20mm' },
    { color: '#08519c', label: '20-40mm' },
    { color: '#006837', label: '40-60mm' },
    { color: '#ffbf00', label: '60-80mm' },
    { color: '#ff7f00', label: '80-100mm' },
    { color: '#ff0000', label: '&ge;100mm' },
  ],
  era5_wind: [
    { color: '#ffffff', label: '0 m/s' },
    { color: '#7fcdbb', label: '2-5 m/s' },
    { color: '#2c7fb8', label: '5-15 m/s' },
    { color: '#253494', label: '15-20 m/s' },
    { color: '#ffffbf', label: '20-25 m/s' },
    { color: '#fdae61', label: '25-35 m/s' },
    { color: '#d73027', label: '35-50 m/s' },
    { color: '#a50026', label: '&ge;50 m/s' },
  ],
}

const mapId = 'era5_extremes'
mapStore.setLegendItems(mapId, legend)

const variableGroups = computed(() =>
  Object.entries(
    ERA5_WRF_VARIABLES.reduce<
      Record<string, (typeof ERA5_WRF_VARIABLES)[number][]>
    >((groups, variable) => {
      if (!groups[variable.category]) {
        groups[variable.category] = []
      }
      groups[variable.category].push(variable)
      return groups
    }, {})
  ).map(([category, variables]) => ({
    category,
    variables,
  }))
)

onMounted(() => {
  fetchData()
})

watch(latLng, async () => {
  // Proactively purge all charts before data changes (following WetDaysPerYear pattern)
  purgeAllCharts()
  dataStore.apiData[endpoint] = null
  dataStore.dataErrors[endpoint] = false
  fetchData()
})

onUnmounted(() => {
  purgeAllCharts()
  dataStore.apiData[endpoint] = null
  dataStore.dataErrors[endpoint] = false
})
</script>

<template>
  <section class="section xray">
    <div class="content clamp is-size-5">
      <h3 class="title is-3">Dynamically Downscaled ERA5</h3>
      <XrayIntroblurb resolution="4" unit="km">
        <template #ERA5variables>
          <li>
            Available variables:
            <div class="columns is-multiline mt-3">
              <div
                class="column is-half"
                v-for="group in variableGroups"
                :key="group.category"
              >
                <strong>{{ group.category }}</strong>
                <ul class="ml-5 mt-1">
                  <li
                    v-for="variable in group.variables"
                    :key="variable.key"
                    class="mt-2"
                  >
                    {{ variable.label }}
                    <span class="has-text-grey">({{ variable.unit }})</span>
                  </li>
                </ul>
              </div>
            </div>
          </li>
        </template>
      </XrayIntroblurb>

      <p>
        Explore the high-resolution dynamically downscaled ERA5 reanalysis
        archive covering
        <strong>1960&ndash;2023</strong>. These data were generated by using the
        Weather Research and Forecasting (WRF) model to downscale the ERA5
        reanalysis to a 4 km grid spanning mainland Alaska and adjacent Canada.
      </p>

      <p>
        The maps below showcase four extreme weather events captured by the
        WRF-downscaled ERA5 reanalysis. Toggle between the layers to explore
        snapshots of these historic weather events.
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
          <MapLayer :mapId="mapId" :layer="layers[3]">
            <template v-slot:title>{{ layers[3].title }}</template>
          </MapLayer>
        </template>
      </MapBlock>

      <p>
        Select a community or enter coordinates to view charts of temperature,
        humidity, precipitation, and wind for your location. Choose a date range
        to focus on a time period of interest.
      </p>

      <Gimme :communities-enabled="true" :extent="era5wrfExtent" />

      <div v-if="latLng && apiData" class="mt-4">
        <Era5WrfChartControls
          v-model:startDate="startDate"
          v-model:endDate="endDate"
        />
        <!-- Temperature -->
        <div class="mb-5">
          <Era5WrfChartTemperature
            :t2Max="seriesByVariable.t2_max"
            :t2Mean="seriesByVariable.t2_mean"
            :t2Min="seriesByVariable.t2_min"
            :lat="latLng.lat"
            :lng="latLng.lng"
          />
        </div>

        <!-- Humidity -->
        <div class="mb-5">
          <Era5WrfChartHumidity
            :rh2Max="seriesByVariable.rh2_max"
            :rh2Mean="seriesByVariable.rh2_mean"
            :rh2Min="seriesByVariable.rh2_min"
            :lat="latLng.lat"
            :lng="latLng.lng"
          />
        </div>

        <!-- Precipitation -->
        <div class="mb-5">
          <Era5WrfChartPrecipitation
            :rainnc="seriesByVariable.rainnc_sum"
            :lat="latLng.lat"
            :lng="latLng.lng"
          />
        </div>

        <!-- Wind Rose -->
        <div>
          <Era5WrfChartWindRose
            :speedSeries="seriesByVariable.wspd10_mean"
            :directionSeries="seriesByVariable.wdir10_mean"
            speedLabel="Mean Wind Speed"
            chartId="wind-rose-mean"
          />
        </div>
      </div>

      <div v-if="latLng && apiData" class="download-block mt-4">
        <h4 class="title is-4">
          Download ERA5-WRF data for
          {{ selectedCommunity ? selectedCommunity.name + ' at ' : ''
          }}{{ latLng.lat }},
          {{ latLng.lng }}
        </h4>
        <DownloadLinks endpoint="/era5wrf/point" />
        <p class="mt-2">
          Limit the response with query variables, for example
          <code>?vars=t2_mean,rh2_mean</code>
        </p>
      </div>

      <GetAndUseData
        v-if="latLng && apiData"
        :api-url="`${runtimeConfig.public.apiUrl}/era5wrf/`"
        class="mt-5"
      >
        <template #preamble>
          <p>
            Use these API endpoints to automate downloads for multiple locations
            or to integrate dynamically downscaled ERA5 reanalysis data into
            your research.
          </p>
        </template>
      </GetAndUseData>
    </div>
  </section>
</template>

<style scoped></style>
