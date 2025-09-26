<script lang="ts" setup>
const props = defineProps<{
  label: string
  units?: string
  dataKey: string
  chartType?: string
  multiplier?: number
}>()

const endpoint = 'cmip6Downscaled'

import type { Data } from 'plotly.js-dist-min'
import { isProxy, toRaw } from 'vue'

// Multiplier is an optional prop that can be used to change the scale of units
// during chart population.
let multiplier = 1
if (props.multiplier) {
  multiplier = props.multiplier
}

const { $Plotly, $_ } = useNuxtApp()
const dataStore = useDataStore()
const placesStore = usePlacesStore()
const chartStore = useChartStore()

const apiData = computed<any[]>(() => dataStore.apiData[endpoint])
const latLng = computed<LatLngValue>(() => placesStore.latLng)

const chartLabels = computed<Cmip6DownscaledChartLabelsObj>(
  () => chartStore.labels[endpoint] as Cmip6DownscaledChartLabelsObj
)
const chartInputs = computed<Cmip6DownscaledChartInputsObj>(
  () => chartStore.inputs[endpoint] as Cmip6DownscaledChartInputsObj
)

const chartId = computed<string>(() => props.dataKey + '-chart')
const validChart = ref(true)

const buildChart = () => {
  if (apiData.value && chartLabels.value && chartInputs.value) {
    let traces: Data[] = []
    let chartData = dataStore.apiData[endpoint]

    // Unwrap for performance reasons
    if (isProxy(chartData)) {
      chartData = toRaw(chartData)
    }

    // Pad the historical/projected with nulls as needed to line up properly
    // with the chart x-axis ticks.
    let traceConfig = [
      {
        label: chartInputs.value!.projectedYear + ' (Projected)',
        years: $_.range(1, 365 + 1),
        scenario: chartInputs.value!.scenario,
        symbol: 'square',
      },
      {
        label: chartInputs.value!.baselineYear + ' (Baseline)',
        years: $_.range(1, 365 + 1),
        scenario: 'historical',
        symbol: 'circle',
      },
    ]

    let model = chartInputs.value!.model
    let allChartValues: Array<number | null> = []

    traceConfig.forEach(config => {
      let values: Array<number | null> = []

      let year: string
      if (config.scenario === 'historical') {
        year = chartInputs.value!.baselineYear
      } else {
        year = chartInputs.value!.projectedYear
      }

      let dailyData = chartData[model][config.scenario][props.dataKey]
      let entries = $_.pickBy(dailyData, (value: number, key: string) =>
        key.startsWith(year)
      )

      values = Object.values(entries)

      // Makes chart for sea ice concentration into a line chart
      if (props.chartType === 'lines') {
        traces.push({
          x: config.years,
          y: values,
          mode: 'lines',
          // type: 'scatter',
          name: config.label,
          line: {
            shape: 'linear',
          },
        })
      } else {
        traces.push({
          x: config.years,
          y: values,
          mode: 'lines',
          // type: 'scatter',
          name: config.label,
          marker: {
            symbol: config.symbol,
          },
        })
      }

      allChartValues = allChartValues.concat(values)
    })

    // If trace values are nothing but a mixture of nulls and undefineds,
    // then this is not a valid chart. Hide the chart.
    if (allChartValues.every(value => value == null || value === undefined)) {
      validChart.value = false
      return
    }

    let yAxisLabel = props.label
    if (props.units) {
      yAxisLabel += ' (' + props.units + ')'
    }

    let xTickVals = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335]
    let xTickLabels = [
      'Jan. 1',
      'Feb. 1',
      'Mar. 1',
      'Apr. 1',
      'May. 1',
      'Jun. 1',
      'Jul. 1',
      'Aug. 1',
      'Sep. 1',
      'Oct. 1',
      'Nov. 1',
      'Dec. 1',
    ]

    $Plotly.newPlot(
      chartId.value,
      traces,
      {
        title: {
          text:
            props.label +
            ' for ' +
            placesStore.latLng?.lat +
            ', ' +
            placesStore.latLng?.lng +
            '<br />' +
            'Model: ' +
            chartLabels.value.models[chartInputs.value.model] +
            ', Scenario: ' +
            chartLabels.value.scenarios[chartInputs.value.scenario],
          font: {
            size: 24,
          },
        },
        xaxis: {
          tickangle: 45,
          tickvals: xTickVals,
          ticktext: xTickLabels,
          // showgrid: false,
          // ticklen: 5,
        },
        yaxis: {
          title: {
            text: yAxisLabel,
            font: {
              size: 18,
            },
          },
          // range: [min, max],
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

const purgeChart = () => {
  if (validChart.value) {
    $Plotly.purge(chartId.value)
  }
}

watch([apiData, chartLabels, chartInputs], async () => {
  purgeChart()

  // Need to wait until nextTick to trigger v-if of the chart div.
  validChart.value = true
  await nextTick()

  if (apiData.value) {
    buildChart()
  }
})

watch(latLng, async () => {
  purgeChart()
})

onUnmounted(() => {
  dataStore.apiData[endpoint] = null
})
</script>

<template>
  <div :id="chartId" v-if="validChart"></div>
</template>

<style lang="scss" scoped></style>
