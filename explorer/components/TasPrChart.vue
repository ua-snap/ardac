<script lang="ts" setup>
const props = defineProps<{
  endpoint: string
  label: string
  units: string
  dataKey: string
}>()

const endpoint = props.endpoint

import type { Data, BoxPlotData } from 'plotly.js-dist-min'

// Add additional boxplot properties that are not included in
// @types/plotly.js-dist-min, even though Plotly does support them.
interface ExtendedBoxPlotData extends BoxPlotData {
  median: number[]
  q1: number[]
  q3: number[]
  upperfence: number[]
  lowerfence: number[]
}

const { $Plotly } = useNuxtApp()
const store = useStore()
const dataStore = useDataStore()
const placesStore = usePlacesStore()

const seasonInput = defineModel('season', { default: 'DJF' })
const scenarioInput = defineModel('scenario', { default: 'rcp85' })

const apiData = computed<any[]>(() => dataStore.apiData[endpoint])
const dataError = computed<boolean>(() => dataStore.dataErrors[endpoint])
const latLng = computed<LatLngValue>(() => placesStore.latLng)
const errorMsg = ref('')

const seasonLabels: Record<string, string> = {
  DJF: 'Winter',
  MAM: 'Spring',
  JJA: 'Summer',
  SON: 'Fall',
}

const scenarioLabels: Record<string, string> = {
  rcp45: 'RCP 4.5',
  rcp60: 'RCP 6.0',
  rcp85: 'RCP 8.5',
}

const buildChart = () => {
  if (apiData.value) {
    const models = ['5modelAvg']
    const yearRanges = [
      '1950_2009',
      '2010_2019',
      '2020_2029',
      '2030_2039',
      '2040_2049',
      '2050_2059',
      '2060_2069',
      '2070_2079',
      '2080_2089',
      '2090_2099',
    ]

    const yearRangesWithDashes = yearRanges.map(yearRange => {
      return yearRange.replace('_', '–')
    })

    let traces: Array<Partial<ExtendedBoxPlotData> | Data> = []
    let chartData = dataStore.apiData
    let historicalData =
      chartData['1950_2009'][seasonInput.value]['CRU-TS40']['CRU_historical'][
        props.dataKey
      ]

    let trace = {
      type: 'box',
      name: 'Historical',
      x: [yearRanges[0]],
      q1: [historicalData['q1']],
      median: [historicalData['median']],
      q3: [historicalData['q3']],
      lowerfence: [historicalData['min']],
      upperfence: [historicalData['max']],
      marker: {
        color: '#888888',
      },
      fillcolor: '#cccccc',
      hoverinfo: 'skip',
    } as Partial<ExtendedBoxPlotData>

    traces.push(trace)

    // Omit the first tick mark because it's just the placeholder for the
    // 0 x-axis position, where the y-axis line is drawn.
    let yValues: Array<number | null> = [null]
    yearRanges.slice(1).forEach(decade => {
      yValues.push(
        chartData[decade][seasonInput.value]['5modelAvg'][scenarioInput.value][
          props.dataKey
        ]
      )
    })

    traces.push({
      x: yearRanges,
      y: yValues,
      mode: 'markers',
      type: 'scatter',
      name: '5 Model Avg.',
      marker: {
        size: 8,
      },
    })

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
            ' (5-Model Average)<br />' +
            'Season: ' +
            seasonLabels[seasonInput.value] +
            ', Scenario: ' +
            scenarioLabels[scenarioInput.value],
          font: {
            size: 24,
          },
        },
        xaxis: {
          tickvals: yearRanges,
          ticktext: yearRangesWithDashes,
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

watch([apiData, seasonInput, scenarioInput], async () => {
  buildChart()
})

watch(latLng, async () => {
  errorMsg.value = ''
  $Plotly.purge('chart')
  dataStore.fetchData(endpoint)
})

watch(dataError, async () => {
  if (dataError.value === true) {
    errorMsg.value =
      'There was an error fetching data for this location. Please try another location.'
  }
})

onUnmounted(() => {
  dataStore.apiData[endpoint] = null
})
</script>

<template>
  <LatLngSelector
    label="Get chart and data for lat/lon point:"
    :errorMsg="errorMsg"
  />
  <div v-if="apiData">
    <div class="control mb-2">
      <label v-for="season in Object.keys(seasonLabels)" class="radio mr-3">
        <input
          type="radio"
          name="season"
          :value="season"
          v-model="seasonInput"
        />
        {{ seasonLabels[season] }}
      </label>
    </div>
    <div class="control mb-5">
      <label v-for="scenario in Object.keys(scenarioLabels)" class="radio mr-3">
        <input
          type="radio"
          name="scenario"
          :value="scenario"
          v-model="scenarioInput"
        />
        {{ scenarioLabels[scenario] }}
      </label>
    </div>
  </div>
  <div id="chart"></div>
</template>

<style scoped></style>
