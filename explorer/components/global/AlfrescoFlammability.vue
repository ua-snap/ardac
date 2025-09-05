<script lang="ts" setup>
const endpoint = 'flammability'

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
  '5modelAvg',
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

const buildChart = () => {
  if (apiData.value) {
    let historicalEras = ['1950-1979', '1980-2008']
    let projectedEras = ['2010-2039', '2040-2069', '2070-2099']

    let traces: Data[] = []

    let values: number[] = []
    historicalEras.forEach(era => {
      let percent = apiData.value[era]['MODEL-SPINUP']['historical'] * 100
      values.push(percent)
    })

    traces.push({
      x: historicalEras,
      y: values,
      mode: 'markers',
      type: 'scatter',
      name: 'MODEL-SPINUP',
      marker: {
        symbol: 'circle',
        size: 8,
      },
    })

    values = []
    projectedEras.forEach(era => {
      let percent =
        apiData.value[era][modelInput.value][scenarioInput.value] * 100
      values.push(percent)
    })

    traces.push({
      x: projectedEras,
      y: values,
      mode: 'markers',
      type: 'scatter',
      name: modelInput.value,
      marker: {
        symbol: 'square',
        size: 8,
      },
    })

    $Plotly.newPlot(
      'chart',
      traces,
      {
        title: {
          text:
            'Flammability for ' +
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
            text: 'Flammability (%)',
            font: {
              size: 18,
            },
          },
        },
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
    id: 'flammability_earlyhistorical_era',
    title: '1950–1979, MODEL-SPINUP',
    source: 'rasdaman',
    wmsLayerName: 'alfresco_relative_flammability_30yr',
    style: 'ardac_flammability',
    legend: 'flammability',
    rasdamanConfiguration: { dim_era: 0, dim_model: 0, dim_scenario: 0 },
    default: true,
  },
  {
    id: 'flammability_latehistorical_era',
    title: '1980–2008, MODEL-SPINUP',
    source: 'rasdaman',
    wmsLayerName: 'alfresco_relative_flammability_30yr',
    style: 'ardac_flammability',
    legend: 'flammability',
    rasdamanConfiguration: { dim_era: 1, dim_model: 0, dim_scenario: 0 },
  },
  {
    id: 'flammability_earlycentury_era',
    title: '2010–2039, NCAR-CCSM4, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'alfresco_relative_flammability_30yr',
    style: 'ardac_flammability',
    legend: 'flammability',
    rasdamanConfiguration: { dim_era: 2, dim_model: 6, dim_scenario: 3 },
  },
  {
    id: 'flammability_midcentury_era',
    title: '2040–2069, NCAR-CCSM4, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'alfresco_relative_flammability_30yr',
    style: 'ardac_flammability',
    legend: 'flammability',
    rasdamanConfiguration: { dim_era: 3, dim_model: 6, dim_scenario: 3 },
  },
  {
    id: 'flammability_latecentury_era',
    title: '2070–2099, NCAR-CCSM4, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'alfresco_relative_flammability_30yr',
    style: 'ardac_flammability',
    legend: 'flammability',
    rasdamanConfiguration: { dim_era: 4, dim_model: 6, dim_scenario: 3 },
  },
]

const legend: Record<string, LegendItem[]> = {
  flammability: [
    { color: '#fef0d9', label: '&ge;0%, &lt;0.02%' },
    { color: '#fdcc8a', label: '&ge;0.02%, &lt;0.05%' },
    { color: '#fc8d59', label: '&ge;0.05%, &lt;0.10%' },
    { color: '#e34a33', label: '&ge;0.10%, &lt;0.20%' },
    { color: '#b30000', label: '&ge;0.20%' },
  ],
}

const mapId = 'flammability'
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
      <h3 class="title is-3">Flammability</h3>
      <XrayIntroblurb resolution="1" unit="km" cmip="5" />
      <p class="mb-6">
        Flammability is defined as the percentage of times a pixel at a
        particular location has burned in model simulations. The map below shows
        ALFRESCO flammability outputs for five eras. Historical eras show model
        spinup outputs. Projected eras show ALFRESCO flammability outputs using
        the NCAR CCSM4 model under the RCP 8.5 emissions scenario.
      </p>

      <MapBlock :mapId="mapId" class="mb-6">
        <template v-slot:layers>
          <MapLayer
            v-for="layer in layers"
            :mapId="mapId"
            :layer="layer"
            :key="layer.id"
            :default="layer.default"
          >
            <template v-slot:title>{{ layer.title }}</template>
          </MapLayer>
        </template>
      </MapBlock>

      <p>
        Enter lat/lon coordinates below to see flammability charts. The data
        shown is not for the lat/lon point itself, but the mean flammability for
        the enclosing HUC-12. Historical eras show model spinup outputs.
        Projected eras show ALFRESCO flammability outputs using the selected
        model and emissions scenario.
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
          <div class="select">
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
          Download flammability data for
          {{ apiData['huc_id'] }}, the HUC-12 enclosing {{ latLng.lat }},
          {{ latLng.lng }}
        </h4>
        <p>
          Note that the values returned from the following URLs are the same
          data used to compute the flammability percentage in the maps and
          charts above, but have not been converted into a percentage. For
          example, a flammability value of 0.002 is equivalent to 0.2%
          flammability.
        </p>
        <DownloadLinks endpoint="/alfresco/flammability/local" />
      </div>
      <GetAndUseDataAlfresco
        :presentInNcr="true"
        geonetworkUrl="https://catalog.snap.uaf.edu/geonetwork/srv/eng/catalog.search#/metadata/eeaaca2c-0280-4226-b126-fda42a2b6214"
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
