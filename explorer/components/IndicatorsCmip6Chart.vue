<script lang="ts" setup>
const props = defineProps<{
  label: string
  units?: string
  dataKey: string
}>()

const endpoint = 'indicatorsCmip6'

import type { Data } from 'plotly.js-dist-min'
import { precisionMean } from '~/utils/math'

const { $Plotly, $_ } = useNuxtApp()
const dataStore = useDataStore()
const placesStore = usePlacesStore()
const chartStore = useChartStore()

const apiData = computed<any[]>(() => dataStore.apiData[endpoint])
const latLng = computed<LatLngValue>(() => placesStore.latLng)

const chartLabels = computed<IndicatorsCmip6ChartLabelsObj>(
  () => chartStore.labels[endpoint] as IndicatorsCmip6ChartLabelsObj
)
const chartInputs = computed<IndicatorsCmip6ChartInputsObj>(
  () => chartStore.inputs[endpoint] as IndicatorsCmip6ChartInputsObj
)

let chartData: any

// Get min/max values for the selected month of CMIP6 monthly charts.
const minMax = (chartData: any) => {
  let flatValues: number[] = []
  Object.values(chartData).forEach((scenarios: any) => {
    Object.values(scenarios).forEach((model: any) => {
      if (model) {
        Object.entries(model).forEach(([key, value]) => {
          if (value) {
            let indicatorObj = value as any
            let v = parseFloat(indicatorObj[props.dataKey])
            flatValues.push(v)
          }
        })
      }
    })
  })
  let min = $_.min(flatValues)
  let max = $_.max(flatValues)
  return { min: min, max: max }
}

const getPlotValues = (params: any) => {
  let years = $_.range(params.minYear, params.maxYear + 1)

  // Pad projected decades with nulls to align properly on chart.
  let xTickPaddingLength: number = (params.minYear - 1950) / 10
  let xTickPadding = $_.fill(Array(xTickPaddingLength), null)

  let values: number[] = []

  if (params.historical) {
    years.forEach((year: number) => {
      values.push(chartData['historical'][params.model][year][props.dataKey])
    })
  } else {
    years.forEach((year: number) => {
      values.push(chartData[params.scenario][params.model][year][props.dataKey])
    })
  }

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

  let means: Array<number | null> = []
  let maxes: Array<number | null> = []
  let mins: Array<number | null> = []
  let maxOffsets: Array<number | null> = []
  let minOffsets: Array<number | null> = []

  decades.forEach(decade => {
    // Add null placeholders for min/mean/max if all decade's years are null.
    if (decadeBuckets[decade].every(v => v === null)) {
      means.push(null)
      mins.push(null)
      maxes.push(null)
      maxOffsets.push(null)
      minOffsets.push(null)
      return
    }

    let mean = precisionMean(decadeBuckets[decade].map(Number))
    let min = $_.min(decadeBuckets[decade].map(Number))
    let max = $_.max(decadeBuckets[decade].map(Number))

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
  if (apiData.value && chartLabels.value && chartInputs.value) {
    let traces: Data[] = []
    let allDecades: string[] = []
    chartData = dataStore.apiData[endpoint]

    // Unwrap for performance reasons
    if (isProxy(chartData)) {
      chartData = toRaw(chartData)
    }

    let { min, max } = minMax(chartData)

    for (let i = 1950; i <= 2100; i += 10) {
      allDecades.push(i + '-' + (i + 9))
    }

    let traceParams = [
      {
        model: chartInputs.value?.model,
        scenario: chartInputs.value?.scenario,
        minYear: 1950,
        maxYear: 2009,
        historical: true,
      },
      {
        model: chartInputs.value?.model,
        scenario: chartInputs.value?.scenario,
        minYear: 2020,
        maxYear: 2099,
        historical: false,
      },
    ]

    let symbols: Record<string, string> = {
      historical: 'circle',
      projected: 'square',
    }

    traceParams.forEach(params => {
      let plotValues = getPlotValues(params)
      let ticks = $_.range(1, plotValues.decades.length + 1)

      let symbolKey = params.historical ? 'historical' : 'projected'
      let traceLabel = params.historical ? 'Modeled Baseline' : 'Projected'

      traces.push({
        x: ticks,
        y: plotValues.means,
        error_y: {
          type: 'data',
          symmetric: false,
          array: plotValues.maxOffsets,
          arrayminus: plotValues.minOffsets,
        },
        mode: 'markers',
        type: 'scatter',
        name: traceLabel,
        marker: {
          symbol: symbols[symbolKey],
          size: 8,
        },
        hovertemplate:
          'max: %{customdata[0]}<br />' +
          'mean: %{y:}<br />' +
          'min: %{customdata[1]}',
        customdata: $_.zip(plotValues.maxes, plotValues.mins),
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
            props.label +
            ' for ' +
            placesStore.latLng?.lat +
            ', ' +
            placesStore.latLng?.lng +
            '<br />Model: ' +
            chartInputs.value.model +
            ', Scenario: ' +
            chartLabels.value.scenarios[chartInputs.value.scenario],
          font: {
            size: 24,
          },
        },
        xaxis: {
          // Pad x-axis with one null to avoid overlapping y-axis line.
          tickvals: [null].concat($_.range(1, allDecades.length)),
          ticktext: [''].concat(allDecades),
          dtick: 1,
        },
        yaxis: {
          title: {
            text: yAxisLabel,
            font: {
              size: 18,
            },
          },
          range: [min, max],
          fixedrange: true,
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

watch([apiData, chartLabels, chartInputs], async () => {
  buildChart()
})

watch(latLng, async () => {
  $Plotly.purge('chart')
})

onUnmounted(() => {
  dataStore.apiData[endpoint] = null
})
</script>

<template>
  <div id="chart"></div>
</template>

<style scoped></style>
