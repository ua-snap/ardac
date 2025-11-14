<script lang="ts" setup>
const placesStore = usePlacesStore()
const dataStore = useDataStore()
const runtimeConfig = useRuntimeConfig()

const era5wrfExtent = 'cmip6Downscaled'

import { calculateFireWeatherStatistics } from '~/utils/era5WrfStatistics'
import {
  ERA5_WRF_CONFIG,
  ERA5_CLIMATOLOGY_PERIODS,
  type Era5WrfVariableKey,
} from '~/utils/era5WrfConstants'

const { $Plotly } = useNuxtApp()

const { latLng } = storeToRefs(placesStore)

const endpoint = ERA5_WRF_CONFIG.endpoint

// User-controlled state
const selectedYear = ref<number>(2023)
// BRUCE TODO -- squint after reviewing the composable?
const climatologyPeriod = ref<string>(ERA5_WRF_CONFIG.defaultClimatologyPeriod)

// Available years for ERA5-WRF data (1960-2023)
const availableYears = Array.from(
  { length: 2023 - 1960 + 1 },
  (_, i) => 1960 + i
)


// Date range for selected year
const startDate = computed(() => `${selectedYear.value}-01-01`)
const endDate = computed(() => `${selectedYear.value}-12-31`)

// Define all variables to visualize
const variables: Era5WrfVariableKey[] = [
  't2_max',
  't2_mean',
  't2_min',
  'rh2_max',
  'rh2_mean',
  'rh2_min',
  'rainnc_sum',
]

// Get series data for selected year, filtered to fire season
const { apiData, seriesByVariable } = useEra5WrfSeries(
  startDate,
  endDate,
  variables,
  true
)

// Calculate climatology
const climatologyVariables: Era5WrfVariableKey[] = [
  't2_max',
  't2_mean',
  't2_min',
  'rh2_max',
  'rh2_mean',
  'rh2_min',
]

// BRUCE -- Squint!
const { climatologyData, hasData: hasClimatologyData } = useEra5WrfClimatology({
  variables: climatologyVariables,
  climatologyPeriod,
  selectedYear,
})

// Calculate fire weather statistics
const fireStatistics = computed(() => {
  if (
    !seriesByVariable.value.t2_max.length ||
    !seriesByVariable.value.rh2_min.length ||
    !climatologyData.value.t2_max ||
    !climatologyData.value.rh2_min
  ) {
    return null
  }

  return calculateFireWeatherStatistics(
    seriesByVariable.value.t2_max,
    seriesByVariable.value.rh2_min,
    climatologyData.value.t2_max,
    climatologyData.value.rh2_min
  )
})

// Chart IDs used by Era5Wrf chart components
const CHART_IDS = [
  'era5-fire-temperature-chart',
  'era5-fire-humidity-chart',
  'era5-fire-precipitation-chart',
]

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

// Data fetching
const fetchData = () => {
  if (!latLng.value) return
  dataStore.fetchData(endpoint)
}

onMounted(() => {
  fetchData()
})

watch(latLng, async () => {
  // Proactively purge all charts before data changes
  purgeAllCharts()
  dataStore.apiData[endpoint] = null
  fetchData()
})

onUnmounted(() => {
  purgeAllCharts()
  dataStore.apiData[endpoint] = null
})
</script>

<template>
  <section class="section">
    <div class="content clamp is-size-5">
      <h3 class="title is-3">Fire-Prone Conditions in Alaska</h3>

      <p>
        Explore daily weather conditions using the high-resolution ERA5-WRF
        dynamically downscaled reanalysis dataset. By analyzing temperature,
        humidity, and precipitation, we can identify periods when conditions
        were particularly favorable for wildfires. Several atmospheric
        conditions combine to influence wildfire ignition: heat, humidity, and
        precipitation.
      </p>
      <p>
        Days that are both hot (temperature exceeds the 90th percentile of the
        climatological normal range) and dry (humidity falls below the 10th
        percentile of the climatological normal range) simultaneously may be
        considered &ldquo;fire-prone&rdquo; days. High temperatures and low
        humidity dry out vegetation while extended periods without precipitation
        allow fuels to accumulate and become increasingly flammable.
      </p>
      <p>
        The 2004 Alaska summer produced several instances of fire-prone
        conditions, culminating in the largest fire season on record for Alaska:
        6.6 million acres burned. The Taylor Complex, a group of several large
        fires, accounted for more than 1.7 million acres burned in Southeast
        Interior Alaska near the Yukon border.
      </p>
      <p>
        To analyze how temperature and humidity extremes drove the Taylor
        Complex fire behavior, set the <strong>Year Selection</strong> control
        to 2004 and choose Tok (or another nearby community or
        latitude/longitude location) in the location selector and follow along
        with the narrative below. Afterward, experiment with any fire season
        from <strong>1960 through 2023</strong> to see how other years compare
        to 2004. Use the <strong>Reference Period</strong> radio buttons to
        compare any season against either the 1960&ndash;1989 or 1990&ndash;2019
        reference period to see how conditions deviated from the climatological
        normals.
      </p>

      <div class="mt-5">
        <h4 class="title is-4">Fire-Prone Conditions</h4>

        <Gimme :communities-enabled="true" :extent="era5wrfExtent">
          <template v-slot:additionalInstructions>
            Pick a community or enter latitude/longitude coordinates to load
            ERA5-WRF data for that location. Select a fire season year to
            analyze and compare against the climatologies.</template
          >
        </Gimme>

        <div v-if="latLng && apiData" class="mt-4">
          <!-- Controls -->
          <Era5WrfFireControls
            v-model:selectedYear="selectedYear"
            v-model:climatologyPeriod="climatologyPeriod"
            :availableYears="availableYears"
          />

          <!-- Statistics Panel -->
          <div class="mb-6">
            <Era5WrfFireStatisticsPanel
              v-if="fireStatistics"
              :statistics="fireStatistics"
              :selectedYear="selectedYear"
              :climatologyPeriodLabel="climatologyPeriod"
            />
          </div>

          <!-- Temperature Chart with Climatology -->
          <div class="mb-5">
            <Era5WrfChartTemperature
              :t2Max="seriesByVariable.t2_max"
              :t2Mean="seriesByVariable.t2_mean"
              :t2Min="seriesByVariable.t2_min"
              :climatologyT2Max="climatologyData.t2_max"
              :climatologyT2Mean="climatologyData.t2_mean"
              :climatologyT2Min="climatologyData.t2_min"
              :showClimatology="hasClimatologyData"
              :isFireSeason="true"
              :lat="latLng.lat"
              :lng="latLng.lng"
              chartId="era5-fire-temperature-chart"
            />
          </div>

          <!-- Humidity Chart with Climatology -->
          <div class="mb-5">
            <Era5WrfChartHumidity
              :rh2Max="seriesByVariable.rh2_max"
              :rh2Mean="seriesByVariable.rh2_mean"
              :rh2Min="seriesByVariable.rh2_min"
              :climatologyRh2Max="climatologyData.rh2_max"
              :climatologyRh2Mean="climatologyData.rh2_mean"
              :climatologyRh2Min="climatologyData.rh2_min"
              :showClimatology="hasClimatologyData"
              :isFireSeason="true"
              :lat="latLng.lat"
              :lng="latLng.lng"
              chartId="era5-fire-humidity-chart"
            />
          </div>

          <!-- Precipitation Chart -->
          <div>
            <Era5WrfChartPrecipitation
              :rainnc="seriesByVariable.rainnc_sum"
              :isFireSeason="true"
              :lat="latLng.lat"
              :lng="latLng.lng"
              chartId="era5-fire-precipitation-chart"
            />
          </div>
        </div>
      </div>

      <h4 class="title is-4 mt-6">
        Taylor Complex 2004: Heat, Drying, and Rapid Expansion
      </h4>
      <p>
        The Taylor Complex and related 2004 fires demonstrate how overlapping
        extremes drive fire behavior. In June the daily maximum temperatures
        climb into the high 20s&#8239;&deg;C while the minimum relative humidity
        plummets, creating a hot and dry pairing that allowed fuels to
        flash-dry. Warmer air supported widespread convection, numerous
        thunderstorms, and a large number of lightning strikes. Lightning on
        <strong>June 26</strong> ignited the Taylor Complex.
      </p>
      <p>
        Around June 28, daily maximum temperatures approached
        <strong>29&#8239;&deg;C</strong> while minimum relative humidity dropped
        to near <strong>20%</strong>. In the charts, notice how simultaneous
        high temperatures and very low relative humidity persist over several
        days at the end of June.
      </p>
      <p>
        In early July, the Taylor Complex begins to moderate its own weather:
        the complex generated such a dense smoke plume that local solar
        radiation was blocked and temperatures dropped toward 15&#8239;&deg;C
        and humidity rebounded into the 50 percent range. Fire activity
        lessened. In the charts, this pause appears as a dip in temperature and
        and a spike in relative humidity. As the smoke plume thinned, solar
        heating returned. By July 15 maximum temperatures rebounded to around
        27&#8239;&deg;C while relative humidity again fell. This second active
        fire period shows up in the charts as another cluster of hot, dry days
        that fall outside the normal climatology range.
      </p>
      <p>
        August was unusually warm and dry. Compare August 2004 with other years
        to see how the percentile bands highlight the depth of the anomalies. A
        third major fire peak around August 21 extended fire activity into
        September, until cooling temperatures, and ultimately snowfall concluded
        the fire seasony. The Taylor Complex expanded during two dominant
        hot-dry episodes (late June and mid&ndash;July) and a late-season pulse.
        Use the controls to juxtapose 2004 with quieter fire seasons and learn
        how each year diverges from the 1960&ndash;1989 and 1990&ndash;2019
        climatologies. Explore other locations to see how fire weather
        conditions differ across Alaska for different fire seasons.
      </p>

      <h4 class="title is-4">About the ERA5-WRF Dataset</h4>

      <p>
        This data story uses the ERA5-WRF dynamically downscaled dataset,
        produced at the University of Alaska Fairbanks with funding support from
        the USGS Alaska Climate Adaptation Science Centers (AK CASC).
      </p>
      <p>
        This dataset provides high-resolution (4&#8239;km) meteorological data
        by using the Weather Research and Forecasting Model to downscale ERA5
        reanalysis data. The dataset covers mainland Alaska and adjacent Canada.
        The source dataset has hourly temporal resolution, and is aggregated to
        a daily resolution here.
      </p>
      <p>
        A publication is in progress, and you can email
        <a href="mailto:uaf-snap-data-tools@alaska.edu"
          >uaf-snap-data-tools@alaska.edu</a
        >
        with any questions.
      </p>

      <GetAndUseData :api-url="`${runtimeConfig.public.apiUrl}/era5wrf/`">
        <template #preamble>
          <p>
            Access ERA5-WRF data with an API that provides daily values for
            selected variables.
          </p>
        </template>
      </GetAndUseData>
    </div>
  </section>
</template>

<style scoped>
.box {
  background-color: #fafafa;
  border: 1px solid #e0e0e0;
}
</style>
