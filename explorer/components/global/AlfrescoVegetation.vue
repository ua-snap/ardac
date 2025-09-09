<script lang="ts" setup>
const endpoint = 'vegType'

import type { Data } from 'plotly.js-dist-min'

const { $Plotly, $_ } = useNuxtApp()
const placesStore = usePlacesStore()
const mapStore = useMapStore()
const dataStore = useDataStore()
const runtimeConfig = useRuntimeConfig()

const modelInput = defineModel('model', { default: 'NCAR-CCSM4' })
const scenarioInput = defineModel('scenario', { default: 'rcp85' })

const apiData = computed<any>(() => dataStore.apiData[endpoint])
const latLng = computed<LatLngValue>(() => placesStore.latLng)

const models = [
  'GFDL-CM3',
  'GISS-E2-R',
  'IPSL-CM5A-LR',
  'MRI-CGCM3',
  'NCAR-CCSM4',
]

const scenarioLabels: Record<string, string> = {
  rcp45: 'RCP 4.5',
  rcp60: 'RCP 6.0',
  rcp85: 'RCP 8.5',
}

const vegTypeLabels: Record<string, string> = {
  barren_lichen_moss: 'Barren/Lichen/Moss',
  black_spruce: 'Black Spruce',
  deciduous_forest: 'Deciduous Forest',
  graminoid_tundra: 'Graminoid Tundra',
  shrub_tundra: 'Shrub Tundra',
  temperate_rainforest: 'Temperate Rainforest',
  wetland_tundra: 'Wetland Tundra',
  white_spruce: 'White Spruce',
  not_modeled: 'Not Modeled',
}

const vegTypeColors: Record<string, string> = {
  barren_lichen_moss: '#616161',
  black_spruce: '#035500',
  deciduous_forest: '#dcdc67',
  graminoid_tundra: '#b9ba85',
  shrub_tundra: '#abab02',
  temperate_rainforest: '#448844',
  wetland_tundra: '#7fc5da',
  white_spruce: '#51ab00',
  not_modeled: '#ffffff',
}

const buildChart = () => {
  if (apiData.value) {
    let eras = ['1950-2008', '2010-2039', '2040-2069', '2070-2099']

    let traces: Data[] = []

    Object.keys(vegTypeLabels).forEach(vegType => {
      if (vegType == 'not_modeled') return
      let values: number[] = []
      eras.forEach(era => {
        let model: string
        let scenario: string
        if (era == '1950-2008') {
          model = 'MODEL-SPINUP'
          scenario = 'historical'
        } else {
          model = modelInput.value
          scenario = scenarioInput.value
        }
        values.push(apiData.value[era][model][scenario][vegType])
      })
      traces.unshift({
        x: eras,
        y: values,
        mode: 'markers',
        type: 'bar',
        name: vegTypeLabels[vegType],
        marker: {
          color: vegTypeColors[vegType],
        },
      })
    })

    $Plotly.newPlot(
      'chart',
      traces,
      {
        title: {
          text:
            'Vegetation type for ' +
            'HUC-12 ' +
            apiData.value['huc_id'] +
            '<br />' +
            'Model: ' +
            modelInput.value +
            ', Scenario: ' +
            scenarioLabels[scenarioInput.value],
          font: {
            size: 24,
          },
        },
        yaxis: {
          title: {
            text: 'Vegetation type coverage (%)',
            font: {
              size: 18,
            },
          },
        },
        barmode: 'stack',
      },
      {
        responsive: true, // changes the height / width dynamically for charts
        displayModeBar: true, // always show the camera icon
        displaylogo: false,
        modeBarButtonsToRemove: [
          'zoom2d',
          'pan2d',
          'select2d',
          'lasso2d',
          'zoomIn2d',
          'zoomOut2d',
          'autoScale2d',
          'resetScale2d',
        ],
      }
    )
  }
}

const layers: MapLayer[] = [
  {
    id: 'veg_type_historical_era',
    title: '1950–2008, MODEL-SPINUP',
    source: 'rasdaman',
    wmsLayerName: 'alfresco_vegetation_mode_statistic',
    style: 'ardac_veg_type',
    legend: 'veg_type',
    rasdamanConfiguration: { dim_era: 0, dim_model: 0, dim_scenario: 0 },
  },
  {
    id: 'veg_type_earlycentury_era',
    title: '2010–2039, NCAR-CCSM4, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'alfresco_vegetation_mode_statistic',
    style: 'ardac_veg_type',
    legend: 'veg_type',
    rasdamanConfiguration: { dim_era: 1, dim_model: 5, dim_scenario: 3 },
  },
  {
    id: 'veg_type_midcentury_era',
    title: '2040–2069, NCAR-CCSM4, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'alfresco_vegetation_mode_statistic',
    style: 'ardac_veg_type',
    legend: 'veg_type',
    rasdamanConfiguration: { dim_era: 2, dim_model: 5, dim_scenario: 3 },
  },
  {
    id: 'veg_type_latecentury_era',
    title: '2070–2099, NCAR-CCSM4, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'alfresco_vegetation_mode_statistic',
    style: 'ardac_veg_type',
    legend: 'veg_type',
    rasdamanConfiguration: { dim_era: 3, dim_model: 5, dim_scenario: 3 },
  },
]

let legend: Record<string, LegendItem[]> = {
  veg_type: [],
}

Object.keys(vegTypeColors).forEach(vegType => {
  legend.veg_type.push({
    color: vegTypeColors[vegType],
    label: vegTypeLabels[vegType],
  })
})

const mapId = 'veg_type'
mapStore.setLegendItems(mapId, legend)

watch([apiData, modelInput, scenarioInput], async () => {
  buildChart()
})

watch(latLng, async () => {
  $Plotly.purge('chart')
  dataStore.fetchData(endpoint)
})

onUnmounted(() => {
  dataStore.apiData[endpoint] = null
})
</script>

<template>
  <section class="section xray">
    <div class="content is-size-5">
      <h3 class="title is-3">Vegetation Type</h3>
      <XrayIntroblurb resolution="1" unit="km" cmip="5" />
      <p class="mb-6">
        The map below shows a 5-model mode of ALFRESCO dominant vegetation type
        outputs across four eras. Historical eras show model spinup outputs.
        Projected eras show ALFRESCO vegetation type outputs using five CMIP5
        models under the RCP 8.5 emissions scenario.
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
        Enter lat/lon coordinates below to see vegetation type charts. The data
        shown is not for the lat/lon point itself, but the mean percentage of
        the vegetation type values for the enclosing HUC-12. Historical eras
        show model spinup outputs. Projected eras show ALFRESCO vegetation type
        outputs using the selected model.
      </p>

      <p>
        After entering lat/lon coordinates, links will be provided where you can
        download the data that is used to populate the chart.
      </p>

      <!-- HUC-12 API summaries return data only for Alaska, not Canada -->
      <Gimme extent="blockyAlaska" />

      <div v-if="latLng && apiData">
        <div class="chart-input">
          <label for="model" class="label">Model:</label>
          <div class="select mb-5 mr-3">
            <select id="model" v-model="modelInput">
              <option v-for="model in models" :value="model">
                {{ model }}
              </option>
            </select>
          </div>
        </div>
        <div class="chart-input">
          <label for="scenario" class="label">Scenario:</label>
          <div class="select mr-3">
            <select id="scenario" v-model="scenarioInput">
              <option
                v-for="scenario in Object.keys(scenarioLabels)"
                :value="scenario"
              >
                {{ scenarioLabels[scenario] }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div id="chart"></div>
      <div v-if="latLng && apiData" class="my-6">
        <h4 class="title is-4">
          Download vegetation type data for {{ apiData['huc_id'] }}, the HUC-12
          enclosing {{ latLng.lat }},
          {{ latLng.lng }}
        </h4>
        <DownloadLinks endpoint="/alfresco/veg_type/local" />
      </div>
      <GetAndUseDataAlfresco
        :presentInNcr="true"
        geonetworkUrl="https://catalog.snap.uaf.edu/geonetwork/srv/eng/catalog.search#/metadata/a077b382-c7e5-44a7-8b2a-1cf764c448f6"
      />
    </div>
    <Bios :people="['Scott Rupp', 'Nancy Fresco']" />
  </section>
</template>

<style lang="scss" scoped>
.chart-input {
  display: inline-block;
  select {
    background-color: $white-lighter;
  }
}
</style>
