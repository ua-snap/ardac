<script lang="ts" setup>
const props = defineProps<{
  label: string
  units?: string
  dataKey: string
}>()

const endpoint = 'hydrology'

import type { Data } from 'plotly.js-dist-min'

const { $Plotly, $_ } = useNuxtApp()
const dataStore = useDataStore()
const placesStore = usePlacesStore()
const chartStore = useChartStore()

const apiData = computed<any[]>(() => dataStore.apiData[endpoint])
const latLng = computed<LatLngValue>(() => placesStore.latLng)

const chartLabels = computed<HydrologyChartLabelsObj>(
  () => chartStore.labels[endpoint] as HydrologyChartLabelsObj
)
const chartInputs = computed<HydrologyChartInputsObj>(
  () => chartStore.inputs[endpoint] as HydrologyChartInputsObj
)

const chartId = computed<string>(() => props.dataKey + '-chart')

const buildChart = () => {
  if (apiData.value && chartLabels.value && chartInputs.value) {
    let decades = [
      '1950-1959',
      '1960-1969',
      '1970-1979',
      '1980-1989',
      '1990-1999',
      '2000-2009',
      '2010-2019',
      '2020-2029',
      '2030-2039',
      '2040-2049',
      '2050-2059',
      '2060-2069',
      '2070-2079',
      '2080-2089',
      '2090-2099',
    ]

    let traces: Data[] = []
    let chartData = dataStore.apiData[endpoint]
    let means: number[] = []

    decades.forEach(decade => {
      let model = chartInputs.value!.model
      let scenario = chartInputs.value!.scenario
      let month = chartInputs.value!.month
      let decadeData = chartData[model][scenario][month][decade]
      let mean = decadeData[props.dataKey]
      means.push(mean)
    })

    traces.push({
      x: decades,
      y: means,
      mode: 'markers',
      type: 'scatter',
      name: '',
      marker: {
        size: 8,
      },
    })

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
            props.label +
            ' for ' +
            placesStore.latLng?.lat +
            ', ' +
            placesStore.latLng?.lng +
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

<style lang="scss" scoped></style>
