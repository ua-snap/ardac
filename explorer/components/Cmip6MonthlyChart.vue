<script lang="ts" setup>
const props = defineProps<{
  label: string
  units?: string
  dataKey: string
  chartType?: string
  multiplier?: number
}>()

const endpoint = 'cmip6Monthly'

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

const chartLabels = computed<Cmip6MonthlyChartLabelsObj>(
  () => chartStore.labels[endpoint] as Cmip6MonthlyChartLabelsObj
)
const chartInputs = computed<Cmip6MonthlyChartInputsObj>(
  () => chartStore.inputs[endpoint] as Cmip6MonthlyChartInputsObj
)

const chartId = computed<string>(() => props.dataKey + '-chart')
const validChart = ref(true)

// Get min/max values for the selected month of CMIP6 monthly charts.
const monthMinMax = (values: any, month: string, dataKey: string) => {
  let monthValues = <any>[]
  Object.values(values).forEach((scenarios: any) => {
    Object.values(scenarios).forEach((months: any) => {
      Object.entries(months).forEach(([key, value]) => {
        let last2 = key.slice(-2)
        if (last2 == month) {
          let typed = value as any
          monthValues.push(typed[dataKey] * multiplier)
        }
      })
    })
  })
  let min = $_.min(monthValues)
  let max = $_.max(monthValues)
  return { min: min, max: max }
}

const buildChart = () => {
  if (apiData.value && chartLabels.value && chartInputs.value) {
    let traces: Data[] = []
    let chartData = dataStore.apiData[endpoint]
    let projectedStartYear = 2015

    // Unwrap for performance reasons
    if (isProxy(chartData)) {
      chartData = toRaw(chartData)
    }

    // Pad the historical/projected with nulls as needed to line up properly
    // with the chart x-axis ticks.
    let traceConfig = [
      {
        label: 'Modeled Baseline',
        years: $_.range(1950, projectedStartYear).concat(
          Array(2100 - projectedStartYear + 1).fill(null)
        ),
        symbol: 'circle',
      },
      {
        label: 'Projected',
        years: $_.range(projectedStartYear, 2101).concat(
          Array(2100 - projectedStartYear + 1).fill(null)
        ),
        symbol: 'square',
      },
    ]

    let model = chartInputs.value!.model
    let month = chartInputs.value!.month
    let scenario: string
    let allChartValues: Array<number | null> = []

    let { min, max } = monthMinMax(chartData, month, props.dataKey)

    traceConfig.forEach(config => {
      let values: Array<number | null> = []
      config.years.forEach((year: number) => {
        let yearMonth = year + '-' + month
        if (year < projectedStartYear) {
          scenario = 'historical'
        } else {
          scenario = chartInputs.value!.scenario
        }

        if (year == null) {
          values.push(null)
          return
        }

        if (!chartData[model][scenario]) {
          values.push(null)
          return
        }

        let yearMonthData = chartData[model][scenario][yearMonth]
        let value = yearMonthData[props.dataKey]

        // Pushing undefined is intentional to allow later logic to hide the chart
        // when all values are undefined.
        if (value === undefined) {
          values.push(value)
        } else {
          values.push(value * multiplier)
        }
      })

      // Makes chart for sea ice concentration into a line chart
      if (props.chartType === 'lines') {
        traces.push({
          x: config.years,
          y: values,
          mode: 'lines',
          type: 'scatter',
          name: config.label,
          line: {
            shape: 'linear',
          },
        })
      } else {
        traces.push({
          x: config.years,
          y: values,
          mode: 'markers',
          type: 'scatter',
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

    $Plotly.newPlot(
      chartId.value,
      traces,
      {
        title: {
          text:
            placesStore.getChartTitle(props.label) +
            '<br />' +
            'Model: ' +
            chartLabels.value.models[chartInputs.value.model] +
            ', Scenario: ' +
            chartLabels.value.scenarios[chartInputs.value.scenario] +
            ', Month: ' +
            chartLabels.value.months[chartInputs.value.month],
          font: {
            size: 24,
          },
        },
        xaxis: {
          tickangle: 45,
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
        toImageButtonOptions: {
          format: 'png',
          filename: placesStore.getChartTitle(props.label),
          scale: 2,
        },
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
