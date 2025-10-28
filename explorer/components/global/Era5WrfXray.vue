<script lang="ts" setup>
import { ERA5_WRF_VARIABLES } from '~/utils/era5WrfConstants'

const runtimeConfig = useRuntimeConfig()
const dataStore = useDataStore()
const placesStore = usePlacesStore()

const endpoint = 'era5wrf'
const era5wrfExtent = 'blockyAlaska'

const latLng = computed(() => placesStore.latLng)
const apiData = computed(() => dataStore.apiData[endpoint] ?? null)

const downloadLinks = computed(() => {
  if (!latLng.value) return null
  const { lat, lng } = latLng.value
  const base = `${runtimeConfig.public.apiUrl}/era5wrf/point/${lat}/${lng}`
  return {
    base,
    csv: `${base}?format=csv`,
  }
})

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

onUnmounted(() => {
  // Note: We intentionally don't clear location state here to allow
  // navigation between Fire Story and Xray pages while preserving
  // the selected location for better user experience
})
</script>

<template>
  <section class="section xray">
    <div class="content clamp is-size-5">
      <h3 class="title is-3">ERA5-WRF Xray</h3>
      <XrayIntroblurb resolution="4" unit="km">
        <div class="variable-overview mt-4">
          <h4 class="title is-5 mb-2">Available variables</h4>
          <div class="columns is-multiline">
            <div
              class="column is-half-tablet is-one-third-desktop"
              v-for="group in variableGroups"
              :key="group.category"
            >
              <h5 class="title is-6 mb-2">{{ group.category }}</h5>
              <ul>
                <li v-for="variable in group.variables" :key="variable.key">
                  <strong>{{ variable.label }}</strong>
                  <span class="has-text-grey"> ({{ variable.unit }}) </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </XrayIntroblurb>

      <p>
        Explore the high-resolution ERA5-WRF reanalysis archive covering
        <strong>1960&ndash;2023</strong>. These data take the ERA5 reanalysis
        and dynamically downscale it with the Weather Research and Forecasting
        (WRF) model to a <strong>4 km</strong> grid spanning mainland Alaska and
        adjacent Canada.
      </p>

      <p>
        Select a community or enter coordinates to view charts of temperature,
        humidity, precipitation, and wind patterns for your location. Choose a
        date range to focus your analysis.
      </p>

      <Gimme :communities-enabled="true" :extent="era5wrfExtent" />

      <div v-if="!latLng" class="notification is-info mt-4">
        Select a community or enter coordinates above to load the ERA5-WRF time
        series.
      </div>

      <Era5WrfXrayWrapper :show-location-prompt="false" />

      <div
        v-if="latLng && apiData && downloadLinks"
        class="download-block mt-4"
      >
        <h4 class="title is-4">
          Download ERA5-WRF data for {{ latLng.lat.toFixed(3) }},
          {{ latLng.lng.toFixed(3) }}
        </h4>
        <ul>
          <li>
            <a :href="downloadLinks.csv">Download as CSV</a> (all variables)
          </li>
          <li>
            <a :href="downloadLinks.base">Download as JSON</a>
          </li>
          <li>
            Limit the response with query variables, for example
            <code>?vars=t2_mean,rh2_mean</code>
          </li>
        </ul>
      </div>

      <GetAndUseData
        v-if="latLng"
        :api-url="`${runtimeConfig.public.apiUrl}/era5wrf/`"
        class="mt-5"
      >
        <template #preamble>
          <p>
            Use these programmatic endpoints to automate downloads for multiple
            locations or to integrate ERA5-WRF statistics into your workflows.
          </p>
        </template>
        <li>
          Append <code>?format=csv</code> or <code>?vars=&lt;list&gt;</code> to
          tailor the API response for your scenario.
        </li>
      </GetAndUseData>
    </div>
  </section>
</template>

<style scoped>
.variable-overview ul {
  margin-left: 1.25rem;
}

.variable-overview li + li {
  margin-top: 0.5rem;
}

.introblurb .variable-overview {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 6px;
  padding: 1rem 1.25rem;
}

.download-block ul {
  margin-left: 1.25rem;
}

.download-block li + li {
  margin-top: 0.5rem;
}
</style>
