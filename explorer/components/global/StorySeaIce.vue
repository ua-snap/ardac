<script lang="ts" setup>
const runtimeConfig = useRuntimeConfig()
const mapStore = useMapStore()
const placesStore = usePlacesStore()
const dataStore = useDataStore()

const selectedModel = ref<string>('MIROC6')
const selectedScenario = ref<string>('ssp370')

// CMIP6 Monthly data for the heatmap - structured by model -> scenario -> date
const siconData = ref<Record<string, any> | null>(null)
// Historical sea ice concentration data (1950-2025)
const historicalData = ref<Record<string, number> | null>(null)
const isLoadingHeatmapData = ref(false)
const heatmapDataError = ref(false)

// Track if user has selected a location
const latLng = computed(() => placesStore.latLng)

// Function to clear the selected location and return to map
const clearLocation = () => {
  placesStore.latLng = undefined
  siconData.value = null
  historicalData.value = null
  heatmapDataError.value = false
}

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

// Interactive map layer for location selection (2050 CMIP6)
const interactiveMapLayer: MapLayer = {
  id: 'sea_ice_interactive_2050',
  title: 'March 2050, MIROC6, SSP3-7.0',
  source: 'rasdaman',
  wmsLayerName: 'cmip6_monthly_cf_wms',
  style: 'ardac_siconc',
  legend: 'siconc',
  default: true,
  rasdamanConfiguration: {
    dim_model: 8,
    dim_scenario: 3,
    time: 36598,
  },
  coastline: true,
}

const interactiveMapId = 'sea_ice_story_interactive'

// Historical sea ice concentration map layers (March)
const historicalLayers: MapLayer[] = [
  {
    id: 'sea_ice_story_1950',
    title: 'March, 1950',
    source: 'rasdaman',
    wmsLayerName: 'hsia_arctic_production',
    style: 'ardac_sea_ice_concentration',
    legend: 'sea_ice_concentration',
    rasdamanConfiguration: { time: '1950-03-01T00:00:00.000Z' },
  },
  {
    id: 'sea_ice_story_1975',
    title: 'March, 1975',
    source: 'rasdaman',
    wmsLayerName: 'hsia_arctic_production',
    style: 'ardac_sea_ice_concentration',
    legend: 'sea_ice_concentration',
    rasdamanConfiguration: { time: '1975-03-01T00:00:00.000Z' },
  },
  {
    id: 'sea_ice_story_2000',
    title: 'March, 2000',
    source: 'rasdaman',
    wmsLayerName: 'hsia_arctic_production',
    style: 'ardac_sea_ice_concentration',
    legend: 'sea_ice_concentration',
    rasdamanConfiguration: { time: '2000-03-01T00:00:00.000Z' },
  },
  {
    id: 'sea_ice_story_2025',
    title: 'March, 2025',
    source: 'rasdaman',
    wmsLayerName: 'hsia_arctic_production',
    style: 'ardac_sea_ice_concentration',
    legend: 'sea_ice_concentration',
    rasdamanConfiguration: { time: '2025-03-01T00:00:00.000Z' },
    default: true,
  },
]

// CMIP6 projection layers (March, MIROC6, SSP3-7.0)
const projectionLayers: MapLayer[] = [
  {
    id: 'siconc_story_2050',
    title: 'March 2050, MIROC6, SSP3-7.0',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly_cf_wms',
    style: 'ardac_siconc',
    legend: 'siconc',
    rasdamanConfiguration: {
      dim_model: 8,
      dim_scenario: 3,
      time: 36598,
    },
    coastline: true,
  },
  {
    id: 'siconc_story_2075',
    title: 'March 2075, MIROC6, SSP3-7.0',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly_cf_wms',
    style: 'ardac_siconc',
    legend: 'siconc',
    rasdamanConfiguration: {
      dim_model: 8,
      dim_scenario: 3,
      time: 45729,
    },
    coastline: true,
  },
  {
    id: 'siconc_story_2100',
    title: 'March 2100, MIROC6, SSP3-7.0',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly_cf_wms',
    style: 'ardac_siconc',
    legend: 'siconc',
    rasdamanConfiguration: {
      dim_model: 8,
      dim_scenario: 3,
      time: 54860,
    },
    coastline: true,
  },
]

const historicalLegend: Record<string, LegendItem[]> = {
  sea_ice_concentration: [
    { color: '#084594', label: '&ge;0%, &lt;20%' },
    { color: '#2171b5', label: '&ge;20%, &lt;40%' },
    { color: '#4292c6', label: '&ge;40%, &lt;60%' },
    { color: '#6baed6', label: '&ge;60%, &lt;80%' },
    { color: '#9ecae1', label: '&ge;80%' },
  ],
}

const projectionLegend: Record<string, LegendItem[]> = {
  siconc: [
    { color: '#045a8d', label: '0&#37; &ndash; 70&#37;' },
    { color: '#2b8cbe', label: '70&#37; &ndash; 80&#37;' },
    { color: '#74a9cf', label: '80&#37; &ndash; 90&#37;' },
    { color: '#bdc9e1', label: '90&#37; &ndash; 100&#37;' },
  ],
}

// Set legend for interactive map
mapStore.setLegendItems(interactiveMapId, projectionLegend)

// Combine all map layers (historical + projections)
const allLayers = [...historicalLayers, ...projectionLayers]

// Combined legend with both historical and projection legends
const combinedLegend = {
  ...historicalLegend,
  ...projectionLegend,
}

const mapId = 'sea_ice_story_maps'

mapStore.setLegendItems(mapId, combinedLegend)

// Fetch both historical and CMIP6 data for the heatmap based on selected location
const fetchHeatmapData = async () => {
  if (!latLng.value) {
    return
  }

  isLoadingHeatmapData.value = true
  heatmapDataError.value = false
  siconData.value = null
  historicalData.value = null

  const lat = latLng.value.lat
  const lng = latLng.value.lng

  try {
    // Fetch historical observations (1950-2025)
    const historicalUrl = `${runtimeConfig.public.apiUrl}/seaice/point/${lat}/${lng}/`
    const historicalResponse = await fetch(historicalUrl)
    const historicalDataJson = await historicalResponse.json()

    // Fetch CMIP6 model data
    const cmip6Url = `${runtimeConfig.public.apiUrl}/cmip6/point/${lat}/${lng}?vars=siconc`
    const cmip6Response = await fetch(cmip6Url)
    const cmip6DataJson = await cmip6Response.json()

    if (historicalResponse.status === 200 && cmip6Response.status === 200) {
      historicalData.value = historicalDataJson
      siconData.value = cmip6DataJson
    } else {
      heatmapDataError.value = true
      console.error('Error fetching heatmap data:', {
        historical: historicalResponse.status,
        cmip6: cmip6Response.status,
      })
    }
  } catch (error) {
    heatmapDataError.value = true
    console.error('Error fetching heatmap data:', error)
  } finally {
    isLoadingHeatmapData.value = false
  }
}

// Initialize the interactive map with layer and click handler
const initializeInteractiveMap = () => {
  nextTick(() => {
    // Load the interactive layer on the map
    mapStore.toggleLayer({
      layer: interactiveMapLayer,
      mapId: interactiveMapId,
    })
    // Enable clicking to select location
    mapStore.enableUserLocationSelection(interactiveMapId)
  })
}

// Watch for location changes
watch(latLng, async (newVal, oldVal) => {
  if (newVal) {
    // Location selected - fetch data
    await fetchHeatmapData()
  } else if (oldVal && !newVal) {
    // Location cleared - reinitialize map after it's recreated
    initializeInteractiveMap()
  }
})

// Enable map clicking for location selection
onMounted(() => {
  initializeInteractiveMap()
})

// Clear data when component unmounts
onUnmounted(() => {
  siconData.value = null
  historicalData.value = null
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

      <!-- Sea Ice Maps: Historical and Projections -->
      <h4 class="title is-4 mt-5">Sea Ice Extent: 1950-2100</h4>
      <p class="mb-4">
        These maps show sea ice concentration in March. Toggle between
        historical observations (1950-2025) and future projections (2050-2100,
        MIROC6 model, SSP3-7.0 scenario). March typically represents peak ice
        extent before the spring melt begins. Compare these snapshots to see how
        sea ice coverage has changed over the past seven decades and how it's
        projected to change through the end of the century.
      </p>

      <MapBlock :mapId="mapId" crs="EPSG:3572" class="mb-6">
        <template v-slot:layers>
          <MapLayer
            v-for="layer in allLayers"
            :mapId="mapId"
            :layer="layer"
            :key="layer.id"
            :default="layer.default"
          >
            <template v-slot:title>{{ layer.title }}</template>
          </MapLayer>
        </template>
      </MapBlock>

      <!-- Interactive Map for Location Selection -->
      <div v-if="!latLng">
        <h4 class="title is-4 mt-5">Explore Sea Ice by Location</h4>
        <p class="mb-4">
          Click on the map below to select a location and view decadal average
          sea ice concentration for that point. The map shows projected sea ice
          concentration for March 2050 using the MIROC6 model under the SSP3-7.0
          scenario.
        </p>

        <Map
          :mapId="interactiveMapId"
          crs="EPSG:3572"
          class="mb-6 interactive-map"
        />
      </div>

      <!-- Sea Ice Concentration Heatmap -->
      <div v-if="latLng">
        <div class="mb-4">
          <button class="button is-link is-light" @click="clearLocation">
            ← Pick a different location
          </button>
        </div>

        <h4 class="title is-4 mt-5">
          Decadal Averages for {{ latLng.lat }}, {{ latLng.lng }}
        </h4>
        <p class="mb-4">
          This heatmap displays decadal average sea ice concentration by month
          for the selected location. The chart combines historical observations
          (1950-2025) with climate model projections (2026-2100). Select
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
          Unable to load sea ice concentration data for this location. Please
          select a different location on the map.
        </div>

        <SeaIceConcentrationHeatmap
          v-else-if="siconData && historicalData"
          :model="selectedModel"
          :scenario="selectedScenario"
          :apiData="siconData"
          :historicalData="historicalData"
        />
      </div>

      <Bios :people="['Andy Mahoney']" />
    </div>
  </section>
</template>

<style scoped>
.notification {
  margin-top: 1rem;
}

.interactive-map {
  cursor: pointer;
}

.interactive-map :deep(.map) {
  cursor: pointer;
}
</style>
