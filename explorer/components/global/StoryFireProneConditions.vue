<script lang="ts" setup>
import {
  FIRE_WEATHER_BASELINE,
  FIRE_WEATHER_COMPARISON_PERIODS,
  FIRE_WEATHER_VARIABLES,
  buildFireWeatherPath,
  calculateHighDangerDays,
  getFireDangerPeriod,
  getFireWeatherRollingPeriod,
  summarizeFireWeatherComparison,
  type FireDangerResponse,
  type FireWeatherPeriod,
  type FireWeatherRollingResponse,
  type FireWeatherVariableKey,
} from '~/utils/fireWeather'

const placesStore = usePlacesStore()
const dataStore = useDataStore()
const runtimeConfig = useRuntimeConfig()
const { latLng, selectedCommunity } = storeToRefs(placesStore)

const selectedVariable = ref<FireWeatherVariableKey>('fwi')
const comparisonPeriodId = ref<FireWeatherPeriod['id']>('latecentury')
const loadedKeys = new Set<string>()

const comparisonPeriod = computed(
  () =>
    FIRE_WEATHER_COMPARISON_PERIODS.find(
      period => period.id === comparisonPeriodId.value
    ) ?? FIRE_WEATHER_COMPARISON_PERIODS[1]
)

const variable = computed(
  () =>
    FIRE_WEATHER_VARIABLES.find(item => item.key === selectedVariable.value) ??
    FIRE_WEATHER_VARIABLES[0]
)

const dangerBaselineKey = 'fire-weather-danger-baseline'
const dangerComparisonKey = computed(
  () => 'fire-weather-danger-' + comparisonPeriod.value.id
)
const rollingBaselineKey = computed(
  () => 'fire-weather-rolling-baseline-' + selectedVariable.value
)
const rollingComparisonKey = computed(
  () =>
    'fire-weather-rolling-' +
    comparisonPeriod.value.id +
    '-' +
    selectedVariable.value
)

const dangerBaselineResponse = computed<FireDangerResponse | null>(
  () => dataStore.apiData[dangerBaselineKey] ?? null
)
const dangerComparisonResponse = computed<FireDangerResponse | null>(
  () => dataStore.apiData[dangerComparisonKey.value] ?? null
)
const rollingBaselineResponse = computed<FireWeatherRollingResponse | null>(
  () => dataStore.apiData[rollingBaselineKey.value] ?? null
)
const rollingComparisonResponse = computed<FireWeatherRollingResponse | null>(
  () => dataStore.apiData[rollingComparisonKey.value] ?? null
)

const dangerBaseline = computed(() =>
  getFireDangerPeriod(dangerBaselineResponse.value, FIRE_WEATHER_BASELINE)
)
const dangerComparison = computed(() =>
  getFireDangerPeriod(dangerComparisonResponse.value, comparisonPeriod.value)
)
const rollingBaseline = computed(() =>
  getFireWeatherRollingPeriod(
    rollingBaselineResponse.value,
    FIRE_WEATHER_BASELINE,
    selectedVariable.value
  )
)
const rollingComparison = computed(() =>
  getFireWeatherRollingPeriod(
    rollingComparisonResponse.value,
    comparisonPeriod.value,
    selectedVariable.value
  )
)

const baselineVariableData = computed(
  () => dangerBaseline.value?.[selectedVariable.value] ?? null
)
const comparisonVariableData = computed(
  () => dangerComparison.value?.[selectedVariable.value] ?? null
)

const comparisonSummary = computed(() => {
  if (!baselineVariableData.value || !comparisonVariableData.value) return null
  return summarizeFireWeatherComparison(
    baselineVariableData.value,
    comparisonVariableData.value
  )
})

const era5HighDangerDays = computed(() => {
  const era5 = baselineVariableData.value?.era5
  return era5 ? calculateHighDangerDays(era5) : null
})

const currentKeys = computed(() => [
  dangerBaselineKey,
  dangerComparisonKey.value,
  rollingBaselineKey.value,
  rollingComparisonKey.value,
])

const isLoading = computed(() =>
  currentKeys.value.some(key => dataStore.dataLoading[key])
)
const hasError = computed(() =>
  currentKeys.value.some(key => dataStore.dataErrors[key])
)
const hasAllData = computed(
  () =>
    dangerBaseline.value &&
    dangerComparison.value &&
    rollingBaseline.value &&
    rollingComparison.value
)

const locationLabel = computed(() => {
  if (selectedCommunity.value) {
    return (
      selectedCommunity.value.name +
      ' (' +
      latLng.value?.lat +
      '°N, ' +
      latLng.value?.lng +
      '°E)'
    )
  }
  if (latLng.value) {
    return latLng.value.lat + '°N, ' + latLng.value.lng + '°E'
  }
  return 'selected location'
})

const modelAgreementText = computed(() => {
  if (!comparisonSummary.value) return ''
  const summary = comparisonSummary.value

  if (summary.increasingModels === 4) {
    return 'All four climate models show an increase.'
  }
  if (summary.decreasingModels === 4) {
    return 'All four climate models show a decrease.'
  }

  const outcomes = [
    [summary.increasingModels, 'an increase'],
    [summary.decreasingModels, 'a decrease'],
    [summary.unchangedModels, 'no rounded change'],
  ] as const
  const statements = outcomes
    .filter(([count]) => count > 0)
    .map(([count, outcome]) => formatModelCount(count, outcome))

  return (
    new Intl.ListFormat('en', { type: 'conjunction' }).format(statements) + '.'
  )
})

const formatChange = (value: number): string =>
  (value > 0 ? '+' : '') + value.toFixed(1)

const formatModelCount = (count: number, outcome: string): string => {
  const verb = count === 1 ? 'shows' : 'show'
  const modelLabel = count === 1 ? 'model' : 'models'
  return `${count} ${modelLabel} ${verb} ${outcome}`
}

const registerKey = (key: string): string => {
  loadedKeys.add(key)
  return key
}

const fetchDangerData = async () => {
  if (!latLng.value) return

  await Promise.all([
    dataStore.fetchData(
      'fireWeather',
      buildFireWeatherPath(
        FIRE_WEATHER_BASELINE,
        'summer_fire_danger_rating_days'
      ),
      { key: registerKey(dangerBaselineKey) }
    ),
    dataStore.fetchData(
      'fireWeather',
      buildFireWeatherPath(
        comparisonPeriod.value,
        'summer_fire_danger_rating_days'
      ),
      { key: registerKey(dangerComparisonKey.value) }
    ),
  ])
}

const fetchRollingData = async () => {
  if (!latLng.value) return

  await Promise.all([
    dataStore.fetchData(
      'fireWeather',
      buildFireWeatherPath(FIRE_WEATHER_BASELINE, '7_day_rolling_average', [
        selectedVariable.value,
      ]),
      { key: registerKey(rollingBaselineKey.value) }
    ),
    dataStore.fetchData(
      'fireWeather',
      buildFireWeatherPath(comparisonPeriod.value, '7_day_rolling_average', [
        selectedVariable.value,
      ]),
      { key: registerKey(rollingComparisonKey.value) }
    ),
  ])
}

const fetchAllData = async () => {
  await Promise.all([fetchDangerData(), fetchRollingData()])
}

watch([latLng, comparisonPeriod], fetchAllData, { immediate: true })
watch(selectedVariable, fetchRollingData)

onUnmounted(() => {
  loadedKeys.forEach(key => {
    dataStore.apiData[key] = null
    dataStore.dataErrors[key] = false
    dataStore.dataLoading[key] = false
  })
})
</script>

<template>
  <section class="section">
    <div class="content clamp is-size-5">
      <h3 class="title is-3">Fire Weather Has More Than One Future</h3>

      <p class="is-size-4">
        How might the weather that primes Alaska&rsquo;s boreal forests for fire
        change by the end of this century? Four climate models do not give one
        answer&mdash;and the differences are scientifically useful.
      </p>

      <p>
        Wildland fire needs an ignition and burnable fuel as well as suitable
        weather. This story isolates the weather part of that system. It uses
        the Canadian Forest Fire Weather Index System to track drying at several
        fuel depths, potential spread, available fuel, and potential intensity.
        These indices describe conditions that can support fire; they are not a
        record or forecast of fire starts, acres burned, smoke, or damage.
      </p>

      <h4 class="title is-4">One system, six views of fire weather</h4>

      <p>
        Daily temperature, relative humidity, rain, and wind feed three moisture
        codes. Fine Fuel Moisture Code responds to litter and fine fuels, Duff
        Moisture Code follows a deeper organic layer, and Drought Code responds
        more slowly to seasonal drying. Initial Spread Index combines wind with
        fine-fuel moisture; Buildup Index combines the two deeper moisture
        codes; Fire Weather Index combines spread and buildup into a relative
        rating of potential intensity.
      </p>

      <p>
        Because each component emphasizes a different process, a future with
        more dry fine-fuel days does not automatically have more drought-code
        days. Selecting several components below is more informative than
        treating &ldquo;fire weather&rdquo; as a single number.
      </p>

      <h4 class="title is-4">Compare a place across time</h4>

      <Gimme
        :bbox="[-177.125, 51.229, -129.0, 71.3694]"
        extent="cmip6Downscaled"
        :communities-enabled="true"
      >
        <template #additionalInstructions>
          Choose a community or coordinates within Alaska&rsquo;s boreal region.
          The charts compare a 1981&ndash;2010 baseline with a future period
          under SSP5-8.5, a high-emissions pathway.
        </template>
      </Gimme>

      <FireWeatherControls
        v-if="latLng"
        v-model:selected-variable="selectedVariable"
        v-model:comparison-period-id="comparisonPeriodId"
      />

      <p v-if="isLoading" role="status">
        Loading four model projections and the ERA5 baseline&hellip;
      </p>
      <p v-if="hasError" role="alert">
        Fire-weather data are unavailable at this location. The dataset is
        limited to the North American boreal ecoregion; try a location farther
        inland or another boreal community.
      </p>

      <template v-if="latLng && hasAllData && !hasError">
        <h4 class="title is-4">
          First question: how many days cross a threshold?
        </h4>

        <p>
          {{ variable.description }} For {{ variable.shortLabel }},
          Alaska&rsquo;s operational classes begin at
          {{ variable.thresholds.high }} for high,
          {{ variable.thresholds.veryHigh }} for very high, and
          {{ variable.thresholds.extreme }} for extreme. The chart classifies
          each June&ndash;August day, then shows the average days per summer in
          each class. All codes are unitless relative ratings.
        </p>

        <p v-if="comparisonSummary" aria-live="polite">
          At {{ locationLabel }}, the four-model median for high through extreme
          {{ variable.shortLabel }} days changes from
          {{ comparisonSummary.baselineMedian.toFixed(1) }} in
          {{ FIRE_WEATHER_BASELINE.label }} to
          {{ comparisonSummary.comparisonMedian.toFixed(1) }} in
          {{ comparisonPeriod.label }} ({{
            formatChange(comparisonSummary.change)
          }}
          days). {{ modelAgreementText }} Future model results span
          {{ comparisonSummary.comparisonMin }}&ndash;{{
            comparisonSummary.comparisonMax
          }}
          days.
        </p>

        <FireWeatherDangerDaysChart
          v-if="baselineVariableData && comparisonVariableData"
          :baseline="baselineVariableData"
          :comparison="comparisonVariableData"
          :baseline-period="FIRE_WEATHER_BASELINE"
          :comparison-period="comparisonPeriod"
          :variable="variable"
          :location-label="locationLabel"
        />

        <p>
          The ERA5 comparison is deliberately limited to the historical
          baseline. ERA5 shows {{ era5HighDangerDays }}
          high-through-extreme days for this index. Agreement between ERA5 and a
          climate model&rsquo;s historical run is a useful first diagnostic, but
          it is not a full model validation. Individual model changes should be
          read alongside their baseline performance.
        </p>

        <h4 class="title is-4">Second question: when do conditions build?</h4>

        <p>
          Annual counts hide timing. The seasonal chart shows the mean seven-day
          rolling value for each day from April through October. Each shaded
          band is the minimum-to-maximum range among four model climatologies;
          its center line is their median. The ERA5 line provides a reanalysis
          reference for {{ FIRE_WEATHER_BASELINE.label }}. The first and last
          three days are omitted because a centered seven-day window is not
          fully contained within the dataset&rsquo;s April&ndash;October season.
        </p>

        <FireWeatherSeasonalChart
          v-if="rollingBaseline && rollingComparison"
          :baseline="rollingBaseline"
          :comparison="rollingComparison"
          :baseline-period="FIRE_WEATHER_BASELINE"
          :comparison-period="comparisonPeriod"
          :variable="variable"
          :location-label="locationLabel"
        />

        <p>
          Look for separation between the blue historical and orange future
          envelopes, a shift in the seasonal peak, and whether the ERA5 line
          falls within the historical model range. A wide or overlapping model
          envelope is itself a result: it identifies where model structure and
          weather sequences matter enough that a single-number projection would
          hide uncertainty.
        </p>
      </template>

      <h4 class="title is-4">What the data can&mdash;and cannot&mdash;say</h4>

      <ul>
        <li>
          The source is a static USGS data release of daily CFFDRS indices made
          from bias-corrected CMIP6 data and an ERA5 historical baseline. The
          application queries the ARDAC Data API at 0.25&deg; spatial resolution
          in WGS 84 (EPSG:4326).
        </li>
        <li>
          The four future simulations use SSP5-8.5. They are conditional
          projections, not predictions of what will occur and not a probability
          distribution of every possible future.
        </li>
        <li>
          The API covers April 1 through October 31 from 1980 through 2099 over
          the North American boreal ecoregion. It has no published update
          schedule. ERA5 ends in 2020 and is not shown for future periods.
        </li>
        <li>
          Fire-weather codes represent a standard forest fuel system. Actual
          fire behaviour also depends on ignition, vegetation and fuel type,
          fuel continuity, topography, suppression, and prior disturbance.
        </li>
        <li>
          Danger-day counts use thresholds from the Alaska Fire Danger Operating
          Plan. The API rounds each class average to a whole day, so stacked
          totals can differ slightly from the 92 days in June&ndash;August.
        </li>
        <li>
          A point represents the containing 0.25&deg; grid cell, not a weather
          station or conditions at a specific home, road, or fire perimeter.
        </li>
      </ul>

      <h4 class="title is-4">Questions to take into research</h4>

      <p>
        The API&rsquo;s point and polygon routes make the same comparisons
        available for reproducible analysis. Researchers can test whether
        conclusions persist across indices, models, periods, and places; compare
        modeled historical values with independent observations; and combine
        fire weather with fuels, lightning, fire perimeters, or ecological data.
        Those additions are necessary before making claims about future fire
        occurrence, spread, or area burned.
      </p>

      <h4 class="title is-4">Sources and methods</h4>

      <ul>
        <li>
          <a href="https://earthmaps.io/fire_weather/"
            >ARDAC Data API: CMIP6 Fire Weather Indices</a
          >
        </li>
        <li>
          <a href="https://doi.org/10.5066/P1DEMGYZ"
            >Young, Littell, and Rupp (2026), USGS data release</a
          >
        </li>
        <li>
          <a
            href="https://natural-resources.canada.ca/forests-forestry/wildland-fires/canada-fire-weather-index-system"
            >Natural Resources Canada: Canada&rsquo;s Fire Weather Index
            System</a
          >
        </li>
        <li>
          <a
            href="https://fire.ak.blm.gov/content/FuelFire/Alaska%20Fire%20Danger%20Operating%20Plan/Alaska_FDOP_FINAL_SIGNED.pdf"
            >Alaska Fire Danger Operating Plan</a
          >
        </li>
        <li>
          <a
            href="https://doi.org/10.1641/0006-3568(2001)051%5B0933:TEOTWA%5D2.0.CO;2"
            >Olson et al. (2001), source of the boreal ecoregion domain</a
          >
        </li>
      </ul>

      <GetAndUseData :api-url="runtimeConfig.public.apiUrl + '/fire_weather/'">
        <template #preamble>
          <p>
            Recreate these comparisons in JSON or CSV, or use the area route to
            summarize supported polygons. Record coordinates, periods,
            variables, operation, retrieval date, and model names with every
            analysis.
          </p>
        </template>
        <li>
          <a href="https://doi.org/10.5066/P1DEMGYZ"
            >Download source data and metadata from the current USGS release.</a
          >
        </li>
      </GetAndUseData>

      <Bios :people="['Jeremy Littell', 'Scott Rupp', 'Charlie Parr']" />
    </div>
  </section>
</template>
