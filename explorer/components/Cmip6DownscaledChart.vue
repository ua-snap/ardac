<script lang="ts" setup>
const props = defineProps<{
  label: string
  units: string
  dataKey: string
}>()

const endpoint = 'cmip6Downscaled'
const units = props.units

import type { Data } from 'plotly.js-dist-min'
import { isProxy, toRaw } from 'vue'

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

const doyToDateString = (doy: number) => {
  const year = 2025 // Can be any year, but not a leap year.
  const date = new Date(year, 0) // January 1st of the given year
  date.setDate(doy) // Add DOY as days offset
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  return date.toLocaleDateString('en-US', options)
}

const doys = $_.range(1, 365 + 1)
const dataLabels = doys.map((doy: number) => {
  return doyToDateString(doy)
})
const dataUnits = Array(doys.length).fill(units)

const buildChart = () => {
  if (apiData.value && chartLabels.value && chartInputs.value) {
    let traces: Data[] = []
    let chartData = dataStore.apiData[endpoint]

    // Unwrap for performance reasons
    if (isProxy(chartData)) {
      chartData = toRaw(chartData)
    }

    let traceConfig = [
      {
        label: chartInputs.value!.projectedYear + ' (Projected)',
        years: $_.range(1, 365 + 1),
        scenario: chartInputs.value!.scenario,
      },
      {
        label: chartInputs.value!.baselineYear + ' (Baseline)',
        years: $_.range(1, 365 + 1),
        scenario: 'historical',
      },
    ]

    let model = chartInputs.value!.model
    let allChartValues: Array<number | null> = []

    traceConfig.forEach(config => {
      let values: Array<number | null> = []

      let year: string
      let labelSuffix = ''
      if (config.scenario === 'historical') {
        year = chartInputs.value!.baselineYear
        labelSuffix = ' (Baseline)'
      } else {
        year = chartInputs.value!.projectedYear
        labelSuffix = ' (Projected)'
      }

      let dailyData = chartData[model][config.scenario]
      let entries = $_.pickBy(dailyData, (value: number, key: string) =>
        key.startsWith(year)
      )

      // Get daily values for the selected dataKey.
      values = Object.values(entries).map((value: any) => value[props.dataKey])

      let labelSuffixArray = Array(values.length).fill(labelSuffix)
      traces.push({
        x: config.years,
        y: values,
        mode: 'lines',
        name: config.label,
        hoverlabel: { namelength: -1 },
        hovertemplate:
          '%{customdata[0]}: %{customdata[1]}%{customdata[2]}%{customdata[3]}<extra></extra>',
        customdata: $_.zip(dataLabels, values, dataUnits, labelSuffixArray),
      })

      allChartValues = allChartValues.concat(values)
    })

    // If trace values are nothing but a mixture of nulls and undefineds,
    // then this is not a valid chart. Hide the chart.
    if (allChartValues.every(value => value == null || value === undefined)) {
      validChart.value = false
      return
    }

    const yAxisLabel = props.label + ' (' + units + ')'

    // These numbers correspond to the 1st of each month in a non-leap year.
    let xTickVals = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335]
    let xTickLabels = xTickVals.map((doy: number) => {
      return doyToDateString(doy)
    })

    const chartTitle = chartStore.getChartTitle(props.label)

    const titleText: string = chartStore.getTitleText({
      chartTitle,
      model: chartLabels.value.models[chartInputs.value.model],
      scenario: chartLabels.value.scenarios[chartInputs.value.scenario],
    })

    const layout = getLayout(titleText, yAxisLabel, {
      tickangle: 45,
    })

    layout.xaxis = {
      tickmode: 'array',
      tickvals: xTickVals,
      ticktext: xTickLabels,
    }

    const config = getConfig(chartTitle)

    $Plotly.newPlot(chartId.value, traces, layout, config)
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
