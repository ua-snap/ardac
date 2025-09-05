<script lang="ts" setup>
const props = defineProps<{
  endpoint: string
  label: string
}>()

const endpoint = props.endpoint

import type { Data } from 'plotly.js-dist-min'
import { precisionMean } from '~/utils/math'

const { $Plotly, $_ } = useNuxtApp()
const dataStore = useDataStore()
const placesStore = usePlacesStore()

const apiData = computed<any[]>(() => dataStore.apiData[endpoint])
const latLng = computed<LatLngValue>(() => placesStore.latLng)

let chartData: any

const getPlotValues = (minYear: number, maxYear: number, model: string) => {
  let years = $_.range(minYear, maxYear + 1)

  // Pad projected decades with nulls to align properly on chart.
  let xTickPaddingLength: number = (minYear - 1980) / 10
  let xTickPadding = $_.fill(Array(xTickPaddingLength), null)

  let degreeDays: number[] = []

  let scenario = model == 'daymet' ? 'modeled_baseline' : 'rcp85'

  years.forEach((year: number) => {
    degreeDays.push(chartData[model][scenario][year]['dd'])
  })

  // Group yearly values into decade buckets to make it easier to calculate
  // min/mean/max for each decade.
  let decadeBuckets: Record<string, number[]> = {}
  for (let i = 0; i < degreeDays.length; i += 10) {
    let yearRange = years[i] + '-' + years[i + 9]
    decadeBuckets[yearRange] = []
    for (let j = 0; j < 10; j++) {
      decadeBuckets[yearRange].push(degreeDays[i + j])
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

  decades = xTickPadding.concat(decades)
  means = xTickPadding.concat(means)
  maxes = xTickPadding.concat(maxes)
  mins = xTickPadding.concat(mins)
  maxOffsets = xTickPadding.concat(maxOffsets)
  minOffsets = xTickPadding.concat(minOffsets)

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
    chartData = dataStore.apiData[props.endpoint]

    for (let i = 1980; i <= 2090; i += 10) {
      allDecades.push(i + '-' + (i + 9))
    }

    let traceParams = [
      {
        model: 'daymet',
        minYear: 1980,
        maxYear: 2009,
      },
      {
        model: 'GFDL-ESM2M',
        minYear: 2010,
        maxYear: 2099,
      },
      {
        model: 'CCSM4',
        minYear: 2010,
        maxYear: 2099,
      },
    ]

    let symbols: Record<string, string> = {
      daymet: 'circle',
      'GFDL-ESM2M': 'square',
      CCSM4: 'diamond',
    }

    let offsets: Record<string, number> = {
      daymet: 0,
      'GFDL-ESM2M': -0.15,
      CCSM4: 0.15,
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

    $Plotly.newPlot(
      'chart',
      traces,
      {
        title: {
          text: placesStore.getChartTitle(props.label),
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
            text: props.label + ' (°F⋅days)',
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

watch(apiData, async () => {
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
  <div id="chart"></div>
</template>

<style scoped></style>
