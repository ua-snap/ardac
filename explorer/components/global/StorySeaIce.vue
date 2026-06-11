<script lang="ts" setup>
const runtimeConfig = useRuntimeConfig()

const selectedModel = ref<string>('MIROC6')
const selectedScenario = ref<string>('ssp585')

// CMIP6 Monthly data for the heatmap - structured by model -> scenario -> date
const siconData = ref<Record<string, any> | null>(null)
const isLoadingHeatmapData = ref(false)
const heatmapDataError = ref(false)

// Available models and scenarios for the heatmap
const availableModels = [
  'CESM2',
  'GFDL-ESM4',
  'MIROC6',
  'MRI-ESM2-0',
  'NorESM2-MM',
]

const availableScenarios = [
  { value: 'ssp245', label: 'SSP2-4.5' },
  { value: 'ssp370', label: 'SSP3-7.0' },
  { value: 'ssp585', label: 'SSP5-8.5' },
]

// Fetch CMIP6 monthly sea ice concentration data for the heatmap
// The heatmap uses a specific point in the Beaufort Sea (81.5, -147)
const fetchHeatmapData = async () => {
  isLoadingHeatmapData.value = true
  heatmapDataError.value = false

  const lat = 81.5
  const lng = -147
  const url = `${runtimeConfig.public.apiUrl}/cmip6/point/${lat}/${lng}?vars=siconc`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (response.status === 200) {
      siconData.value = data
    } else {
      heatmapDataError.value = true
      console.error('Error fetching heatmap data:', response.status)
    }
  } catch (error) {
    heatmapDataError.value = true
    console.error('Error fetching heatmap data:', error)
  } finally {
    isLoadingHeatmapData.value = false
  }
}

// Fetch data on mount
onMounted(() => {
  fetchHeatmapData()
})
</script>

<template>
  <section class="section">
    <div class="content clamp is-size-5">
      <h3 class="title is-3">Sea Ice in Alaska: A Story of Change</h3>

      <p>
        Sea ice is a critical component of Alaska's marine ecosystems and an
        essential resource for coastal communities that depend on it for
        subsistence hunting, transportation, and coastal protection. As Arctic
        temperatures rise, the extent, thickness, and duration of sea ice have
        undergone dramatic changes, with profound implications for both the
        environment and the people who call Alaska home.
      </p>

      <!-- Sea Ice Concentration Heatmap -->
      <div class="box mt-5 mb-5">
        <h5 class="title is-5">Future Sea Ice Projections: Decadal Averages</h5>
        <p class="mb-4">
          This heatmap displays decadal average sea ice concentration by month
          for a point location in the Beaufort Sea (81.5°N, -147°E). Select
          different climate models and emission scenarios to explore how
          projected conditions vary across models and future pathways. The "ice
          year" begins in September and runs through the following August,
          reflecting the natural cycle of sea ice formation and melt.
        </p>

        <div class="field is-horizontal mb-4">
          <div class="field-body">
            <div class="field">
              <label class="label">Climate Model</label>
              <div class="control">
                <div class="select is-fullwidth">
                  <select v-model="selectedModel">
                    <option
                      v-for="model in availableModels"
                      :key="model"
                      :value="model"
                    >
                      {{ model }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div class="field">
              <label class="label">Emission Scenario</label>
              <div class="control">
                <div class="select is-fullwidth">
                  <select v-model="selectedScenario">
                    <option
                      v-for="scenario in availableScenarios"
                      :key="scenario.value"
                      :value="scenario.value"
                    >
                      {{ scenario.label }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="isLoadingHeatmapData" class="notification is-info is-light">
          Loading sea ice concentration data...
        </div>

        <div
          v-else-if="heatmapDataError"
          class="notification is-warning is-light"
        >
          Unable to load sea ice concentration data. Please try again later.
        </div>

        <SeaIceConcentrationHeatmap
          v-else
          :model="selectedModel"
          :scenario="selectedScenario"
          :apiData="siconData"
        />
      </div>

      <Bios :people="['Andy Mahoney']" />
    </div>
  </section>
</template>

<style scoped>
.box {
  background-color: #fafafa;
  border: 1px solid #e0e0e0;
  padding: 1.5rem;
}

.notification {
  margin-top: 1rem;
}
</style>
