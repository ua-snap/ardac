<script lang="ts" setup>
import {
  SPEED_COLORS,
  compassAxis,
  getRoseTraces,
  purgeChart,
  radialAxis,
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
const chartId = 'airport-winds-change-rose'

// Radial axis tick spacing that works well for each petal count.
const radialTicks: Record<PetalCount, number> = { '8': 2, '16': 2, '36': 1 }

const buildChart = () => {
  const comparison = props.winds.comparison
  if (!comparison) return

  // Change in frequency of each speed range & direction, recent minus oldest.
  const [oldest, recent] = comparison.roses[props.petalCount]
  const difference = recent.map((speedRange, i) =>
    speedRange.map((frequency, j) => frequency - oldest[i][j])
  )
  const traces = getRoseTraces(difference, props.units, {
    showLegend: true,
    lines: true,
  })

  // Shade the calm label by how much calms changed, gray for an increase
  // and blue for a decrease, fully opaque at a change of 20% or more.
  const calmDifference = comparison.calms[1] - comparison.calms[0]
  const increased = calmDifference > 0
  const opacity = Math.min(Math.abs(calmDifference) / 20, 1)
  const [r, g, b] = (increased ? '#bbbbbb' : SPEED_COLORS[2])
    .match(/\w\w/g)!
    .map(hex => parseInt(hex, 16))
  const [oldestDecade, recentDecade] = comparison.decades

  $Plotly.newPlot(
    chartId,
    traces,
    {
      title: {
        text: `Change in winds from ${oldestDecade} to ${recentDecade}<br><sub>${props.station.name} (${props.station.sid})</sub>`,
        font: { size: 24 },
      },
      height: 700,
      margin: { l: 0, r: 0, b: 20, t: 140 },
      legend: { orientation: 'h', x: 0, y: 1, yanchor: 'bottom' },
      annotations: [
        {
          x: 0.5,
          y: 0.5,
          showarrow: false,
          text: `calms <b>${increased ? 'increased' : 'decreased'}</b><br>by ${Math.abs(calmDifference).toFixed(1)}%`,
          xref: 'paper',
          yref: 'paper',
          bgcolor: `rgba(${r}, ${g}, ${b}, ${opacity})`,
          borderpad: 6,
        },
      ],
      polar: {
        angularaxis: compassAxis,
        radialaxis: {
          ...radialAxis,
          tick0: 0,
          dtick: radialTicks[props.petalCount],
        },
        hole: 0.2,
      },
    } as Record<string, any>,
    getConfig(`${props.station.sid}_change_in_winds`)
  )
}

watch(() => [props.winds, props.units, props.petalCount], buildChart)

onMounted(buildChart)

onUnmounted(() => purgeChart(chartId))
</script>

<template>
  <div :id="chartId" />
</template>
