<script lang="ts" setup>
const props = defineProps<{
  label: string
  depth?: string
  units?: string
  dataKey: string
}>()

const endpoint = 'permafrost'

import type { Data } from 'plotly.js-dist-min'
import { precisionMean } from '~/utils/math'

const { $Plotly, $_ } = useNuxtApp()
const dataStore = useDataStore()
const placesStore = usePlacesStore()
const chartStore = useChartStore()

const apiData = computed<any[]>(() => dataStore.apiData[endpoint])
const latLng = computed<LatLngValue>(() => placesStore.latLng)

const chartInputs = computed<PermafrostChartInputs>(
  () => chartStore.inputs[endpoint] as PermafrostChartInputs
)

const chartId = computed<string>(() => props.dataKey + '-chart')

let chartData: any

const getPlotValues = (minYear: number, maxYear: number, model: string) => {
  let years = $_.range(minYear, maxYear + 1)

  let values: number[] = []

  years.forEach((year: number) => {
    values.push(
      chartData[model][year][chartInputs.value.scenario][props.dataKey]
    )
  })

  // Group yearly values into decade buckets to make it easier to calculate
  // min/mean/max for each decade.
  let decadeBuckets: Record<string, number[]> = {}
  for (let i = 0; i < values.length; i += 10) {
    let yearRange = years[i] + '-' + years[i + 9]
    decadeBuckets[yearRange] = []
    for (let j = 0; j < 10; j++) {
      decadeBuckets[yearRange].push(values[i + j])
    }
  }

  let decades = Object.keys(decadeBuckets)

  let means: number[] = []
  let maxes: number[] = []
  let mins: number[] = []
  let maxOffsets: number[] = []
  let minOffsets: number[] = []

  decades.forEach(decade => {
    let mean = precisionMean(decadeBuckets[decade])
    let min = $_.min(decadeBuckets[decade])
    let max = $_.max(decadeBuckets[decade])

    // Calculate max/min as offsets from mean for error bars.
    let maxOffset = max - mean
    let minOffset = mean - min

    means.push(mean)
    mins.push(min)
    maxes.push(max)
    maxOffsets.push(maxOffset)
    minOffsets.push(minOffset)
  })

  return {
    decades,
    means,
    maxes,
    mins,
    maxOffsets,
    minOffsets,
  }
}

const buildChart = () => {
  if (apiData.value) {
    let traces: Data[] = []
    let allDecades: string[] = ['']
    chartData = dataStore.apiData[endpoint]

    for (let i = 2021; i <= 2120; i += 10) {
      allDecades.push(i + '-' + (i + 9))
    }

    let traceParams = [
      {
        model: 'GFDL-CM3',
        minYear: 2021,
        maxYear: 2120,
      },
      {
        model: 'NCAR-CCSM4',
        minYear: 2021,
        maxYear: 2120,
      },
    ]

    let symbols: Record<string, string> = {
      'GFDL-CM3': 'circle',
      'NCAR-CCSM4': 'square',
    }

    let offsets: Record<string, number> = {
      'GFDL-CM3': -0.15,
      'NCAR-CCSM4': 0.15,
    }

    traceParams.forEach(params => {
      let plotValues = getPlotValues(
        params.minYear,
        params.maxYear,
        params.model
      )
      let ticks = $_.range(0, plotValues.decades.length + 1)

      // Offset the chart markers/bars slightly so they don't overlap.
      // Omit the first tick mark because it's just the placeholder for the
      // 0 x-axis position, where the y-axis line is drawn.
      let offsetTicks = ticks
        .slice(1)
        .map((tick: number) => tick + offsets[params.model])

      traces.push({
        x: offsetTicks,
        y: plotValues.means,
        error_y: {
          type: 'data',
          symmetric: false,
          array: plotValues.maxOffsets,
          arrayminus: plotValues.minOffsets,
        },
        mode: 'markers',
        type: 'scatter',
        name: params.model,
        marker: {
          symbol: symbols[params.model],
          size: 8,
        },
        hovertemplate:
          'max: %{customdata[0]}<br />' +
          'mean: %{y:}<br />' +
          'min: %{customdata[1]}',
        customdata: $_.zip(plotValues.maxes, plotValues.mins),
      })
    })

    let titleText: string =
      props.label +
      ' for ' +
      placesStore.latLng?.lat +
      ', ' +
      placesStore.latLng?.lng

    if (props.depth) {
      titleText += '<br />Depth: ' + props.depth + ', '
    } else {
      titleText += '<br />'
    }

    titleText += 'Scenario: ' + chartInputs.value.scenario

    $Plotly.newPlot(
      chartId.value,
      traces,
      {
        title: {
          text: titleText,
          font: {
            size: 24,
          },
        },
        xaxis: {
          // Pad x-axis with one null to avoid overlapping y-axis line.
          tickvals: [null].concat($_.range(1, allDecades.length)),
          ticktext: allDecades,
          dtick: 1,
        },
        yaxis: {
          title: {
            text: props.label + ' (' + props.units + ')',
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

watch([apiData, chartInputs], async () => {
  $Plotly.purge(chartId.value)
  if (apiData.value) {
    buildChart()
  }
})

watch(latLng, async () => {
  $Plotly.purge(chartId.value)
})

onUnmounted(() => {
  dataStore.apiData[endpoint] = null
})
</script>

<template>
  <div :id="chartId"></div>
</template>

<style scoped></style>
