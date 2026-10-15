<script lang="ts" setup>
import type { Data } from 'plotly.js-dist-min'
import {
  MONTHS,
  SPEED_COLORS,
  purgeChart,
  stationTitle,
  type AirportStation,
  type AirportWindsData,
} from '~/utils/airportWinds'

const props = defineProps<{
  station: AirportStation
  winds: AirportWindsData
}>()

const { $Plotly } = useNuxtApp()
const chartId = 'airport-winds-energy'

const buildChart = () => {
  const wep = props.winds.wep
  const traces: Data[] = [
    {
      type: 'box',
      name: '',
      x: wep.month,
      y: wep.wep,
      text: wep.year.map(String),
      fillcolor: SPEED_COLORS[2],
      marker: { color: SPEED_COLORS[5] },
      line: { color: SPEED_COLORS[5] },
    },
  ]

  $Plotly.newPlot(
    chartId,
    traces,
    {
      title: {
        text: `Average monthly wind energy potential (100 m height)<br><sub>${stationTitle(props.station)}</sub>`,
        font: { size: 24 },
      },
      height: 550,
      showlegend: false,
      xaxis: {
        tickvals: MONTHS.map((_, i) => i + 1),
        ticktext: MONTHS,
        fixedrange: true,
      },
      yaxis: {
        title: { text: 'Wind energy potential (W/m²)', font: { size: 18 } },
        rangemode: 'tozero',
        fixedrange: true,
      },
    },
    getConfig(`${props.station.sid}_wind_energy_potential_boxplots`)
  )
}

watch(() => props.winds, buildChart)

onMounted(buildChart)

onUnmounted(() => purgeChart(chartId))
</script>

<template>
  <div :id="chartId" />
</template>
