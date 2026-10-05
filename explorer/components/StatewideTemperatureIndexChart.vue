<script lang="ts" setup>
import type { Data } from 'plotly.js-dist-min'
import { offsetDate, rollingMean } from '~/utils/statewideTemperatureIndex'

const props = defineProps<{
  dailyIndex: StatewideTemperatureIndexDay[]
}>()

const { $Plotly } = useNuxtApp()
const chartId = 'statewide-temperature-index-chart'

const colors = {
  cold: '#405bfe',
  hot: '#ff3d00',
}

const buildChart = () => {
  const dates = props.dailyIndex.map(day => day.date)
  const values = props.dailyIndex.map(day => day.dailyIndex)
  const above = props.dailyIndex.filter(day => day.dailyIndex > 0)
  const below = props.dailyIndex.filter(day => day.dailyIndex <= 0)

  const traces: Data[] = [
    {
      x: dates,
      y: values,
      showlegend: false,
      mode: 'lines',
      fill: 'tozeroy',
      hoverinfo: 'none',
      line: { shape: 'spline', width: 0.5, color: '#ccc' },
    },
    {
      x: above.map(day => day.date),
      y: above.map(day => day.dailyIndex),
      name: 'Above Average',
      mode: 'markers',
      marker: { color: colors.hot },
      cliponaxis: false,
      hovertemplate: '%{x}<br><b>Daily Index:</b> %{y}<extra></extra>',
    },
    {
      x: below.map(day => day.date),
      y: below.map(day => day.dailyIndex),
      name: 'Below Average',
      mode: 'markers',
      marker: { color: colors.cold },
      cliponaxis: false,
      hovertemplate: '%{x}<br><b>Daily Index:</b> %{y}<extra></extra>',
    },
    {
      x: dates,
      y: rollingMean(values, 30),
      name: '30-day Average',
      mode: 'lines',
      line: { shape: 'spline', color: '#333' },
      hovertemplate: '%{x}<br><b>30-day Average:</b> %{y}<extra></extra>',
    },
  ]

  // Show the last six months by default; the range slider below the chart
  // covers the full two years of data.
  const layout = getLayout('Alaska Statewide Temperature Index', 'Index', {
    type: 'date',
    tickformat: '%b %-d, %Y',
    range: [offsetDate(-180), offsetDate(-1)],
    rangeslider: {
      range: [dates[0], dates[dates.length - 1]],
      visible: true,
    },
  })

  $Plotly.newPlot(
    chartId,
    traces,
    layout,
    getConfig('Statewide_Temperature_Index')
  )
}

watch(() => props.dailyIndex, buildChart)

onMounted(buildChart)
onUnmounted(() => {
  $Plotly.purge(chartId)
})
</script>

<template>
  <div :id="chartId"></div>
</template>
