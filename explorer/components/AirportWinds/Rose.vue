<script lang="ts" setup>
import {
  compassAxis,
  getRoseTraces,
  purgeChart,
  radialAxis,
  stationTitle,
  type AirportStation,
  type AirportWindsData,
  type PetalCount,
  type WindSpeedUnits,
} from '~/utils/airportWinds'

const props = defineProps<{
  station: AirportStation
  winds: AirportWindsData
  units: WindSpeedUnits
  petalCount: PetalCount
}>()

const { $Plotly } = useNuxtApp()
const chartId = 'airport-winds-rose'

// Radial axis tick spacing that works well for each petal count.
const radialTicks: Record<PetalCount, number> = { '8': 6, '16': 4, '36': 3 }

const buildChart = () => {
  const calm = Math.round(props.winds.calms[0])
  const traces = getRoseTraces(
    props.winds.roses[props.petalCount][0],
    props.units,
    { showLegend: true }
  )

  $Plotly.newPlot(
    chartId,
    traces,
    {
      title: {
        text: `Wind speed/direction distribution<br><sub>${stationTitle(props.station)}</sub>`,
        font: { size: 24 },
      },
      height: 700,
      margin: { l: 0, r: 0, b: 20, t: 100 },
      legend: { orientation: 'h', x: 0, y: 1 },
      annotations: [
        {
          x: 0.5,
          y: 0.5,
          showarrow: false,
          text: `${calm}% calm`,
          xref: 'paper',
          yref: 'paper',
        },
      ],
      polar: {
        angularaxis: compassAxis,
        radialaxis: {
          ...radialAxis,
          tick0: 0,
          dtick: radialTicks[props.petalCount],
        },
        hole: calm / 100,
      },
    },
    getConfig(`${props.station.sid}_summary_wind_rose`)
  )
}

watch(() => [props.winds, props.units, props.petalCount], buildChart)

onMounted(buildChart)

onUnmounted(() => purgeChart(chartId))
</script>

<template>
  <div :id="chartId" />
</template>
