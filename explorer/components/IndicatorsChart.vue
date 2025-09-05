<script lang="ts" setup>
const props = defineProps<{
  label: string
  units?: string
  dataKey: string
}>()

const endpoint = 'indicators'

import type { Data } from 'plotly.js-dist-min'

const { $Plotly, $_ } = useNuxtApp()
const dataStore = useDataStore()
const placesStore = usePlacesStore()

const scenarioInput = defineModel({ default: 'rcp85' })

const apiData = computed<any[]>(() => dataStore.apiData[endpoint])
const latLng = computed<LatLngValue>(() => placesStore.latLng)

const scenarioLabels: Record<string, string> = {
  rcp45: 'RCP 4.5',
  rcp85: 'RCP 8.5',
}

const buildChart = () => {
  let eraLabels: string[] = ['1988–2017', '2040–2069', '2070–2099']
  if (apiData.value) {
    let projectedModels = ['MRI-CGCM3', 'NCAR-CCSM4']
    let projectedEras = ['midcentury', 'longterm']

    let traces: Data[] = []
    let offsets: Record<string, number> = {
      Daymet: 0,
      'MRI-CGCM3': -0.05,
      'NCAR-CCSM4': 0.05,
    }
    let symbols: Record<string, string> = {
      Daymet: 'circle',
      'MRI-CGCM3': 'square',
      'NCAR-CCSM4': 'diamond',
    }
    let ticks: number[] = [1, 2, 3]
    let chartData = dataStore.apiData[endpoint][props.dataKey]

    let means: Array<number | null> = []
    let maxes: Array<number | null> = []
    let mins: Array<number | null> = []
    let maxOffsets: Array<number | null> = []
    let minOffsets: Array<number | null> = []

    let era = 'historical'
    let model = 'Daymet'

    let historicalData = chartData[era][model]['historical']

    let mean = historicalData['mean']
    let max = historicalData['max']
    let min = historicalData['min']

    means.push(mean)
    maxes.push(max)
    mins.push(min)

    // Calculate max/min as offsets from mean for error bars.
    maxOffsets.push(max - mean)
    minOffsets.push(mean - min)

    traces.push({
      x: ticks,
      y: means,
      error_y: {
        type: 'data',
        symmetric: false,
        array: maxOffsets,
        arrayminus: minOffsets,
      },
      mode: 'markers',
      type: 'scatter',
      name: model,
      marker: {
        symbol: Array(ticks.length).fill(symbols[model]),
        size: 8,
      },
      hovertemplate:
        'max: %{customdata[0]}<br />' +
        'mean: %{y:}<br />' +
        'min: %{customdata[1]}',
      customdata: $_.zip(maxes, mins),
    })

    projectedModels.forEach(model => {
      means = []
      maxes = []
      mins = []
      maxOffsets = []
      minOffsets = []

      // Offset the chart markers/bars slightly so they don't overlap.
      // Omit the first tick mark because it's just the placeholder for the
      // 0 x-axis position, where the y-axis line is drawn.
      let offsetTicks = ticks.slice(1).map(tick => tick + offsets[model])

      projectedEras.forEach(era => {
        let scenarioData = chartData[era][model][scenarioInput.value]
        let mean = scenarioData['mean']
        let max = scenarioData['max']
        let min = scenarioData['min']

        means.push(mean)
        maxes.push(max)
        mins.push(min)

        // Calculate max/min as offsets from mean for error bars.
        maxOffsets.push(max - mean)
        minOffsets.push(mean - min)
      })

      traces.push({
        x: offsetTicks,
        y: means,
        error_y: {
          type: 'data',
          symmetric: false,
          array: maxOffsets,
          arrayminus: minOffsets,
        },
        mode: 'markers',
        type: 'scatter',
        name: model,
        marker: {
          symbol: Array(ticks.length).fill(symbols[model]),
          size: 8,
        },
        hovertemplate:
          'max: %{customdata[0]}<br />' +
          'mean: %{y:}<br />' +
          'min: %{customdata[1]}',
        customdata: $_.zip(maxes, mins),
      })
    })

    let yAxisLabel = props.label
    if (props.units) {
      yAxisLabel += ' (' + props.units + ')'
    }

    $Plotly.newPlot(
      'chart',
      traces,
      {
        title: {
          text:
            placesStore.getChartTitle(props.label) +
            '<br />' +
            'Scenario: ' +
            scenarioLabels[scenarioInput.value],
          font: {
            size: 24,
          },
        },
        xaxis: {
          // Pad x-axis with one null to avoid overlapping y-axis line.
          tickvals: ([null] as Array<number | null>).concat(ticks),
          ticktext: [''].concat(eraLabels),
          dtick: 1,
        },
        yaxis: {
          title: {
            text: yAxisLabel,
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
        toImageButtonOptions: {
          format: 'png',
          filename: placesStore.getChartTitle(props.label),
          scale: 2,
        },
      }
    )
  }
}

watch([apiData, scenarioInput], async () => {
  buildChart()
})

watch(latLng, async () => {
  $Plotly.purge('chart')
  dataStore.apiData[endpoint] = null
  dataStore.fetchData(endpoint)
})

onUnmounted(() => {
  dataStore.apiData[endpoint] = null
})
</script>

<template>
  <Gimme extent="mizukami" />
  <div v-if="latLng && apiData">
    <div class="control mb-5">
      <label class="radio mr-3">
        <input
          type="radio"
          name="scenario"
          value="rcp45"
          v-model="scenarioInput"
        />
        RCP 4.5
      </label>
      <label class="radio mr-3">
        <input
          type="radio"
          name="scenario"
          value="rcp85"
          v-model="scenarioInput"
        />
        RCP 8.5
      </label>
    </div>
  </div>
  <div id="chart"></div>
</template>

<style scoped></style>
