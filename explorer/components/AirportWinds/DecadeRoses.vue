<script lang="ts" setup>
import {
  calmText,
  compassAxis,
  getRoseTraces,
  maxPetal,
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
const chartId = 'airport-winds-decade-roses'

const xSpacing = 0.01
const cellWidth = (1 - xSpacing) / 2
const subplots = ['polar', 'polar2']

const buildChart = () => {
  const comparison = props.winds.comparison
  if (!comparison) return

  const roses = comparison.roses[props.petalCount]
  const rmax = Math.max(...roses.map(maxPetal)) + 1
  const layout: Record<string, any> = {
    title: {
      text: `Historical wind comparison<br><sub>${props.station.name} (${props.station.sid})</sub>`,
      font: { size: 24 },
    },
    height: 650,
    margin: { l: 0, r: 0, b: 20, t: 160 },
    legend: { orientation: 'h', x: 0, y: 1, yanchor: 'bottom' },
    annotations: [],
  }

  const traces = subplots.flatMap((subplot, i) => {
    const x0 = i * (cellWidth + xSpacing)
    const calm = comparison.calms[i]

    layout[subplot] = {
      domain: { x: [x0, x0 + cellWidth], y: [0, 0.98] },
      hole: calm / 100,
      angularaxis: { ...compassAxis, tickfont: { color: '#444', size: 14 } },
      radialaxis: {
        ...radialAxis,
        range: [0, rmax],
        tick0: 1,
        dtick: Math.floor(rmax / 2.5),
      },
    }

    layout.annotations.push(
      {
        text: `<b>${comparison.decades[i]}</b>`,
        x: x0 + cellWidth / 2,
        y: 1.02,
        xref: 'paper',
        yref: 'paper',
        xanchor: 'center',
        yanchor: 'bottom',
        showarrow: false,
        font: { size: 14, color: '#444' },
      },
      {
        text: calmText(calm),
        x: x0 + cellWidth / 2,
        y: 0.49,
        xref: 'paper',
        yref: 'paper',
        showarrow: false,
        font: { size: 10, color: '#000' },
      }
    )

    return getRoseTraces(roses[i], props.units, {
      showLegend: i === 0,
      subplot,
    })
  })

  $Plotly.newPlot(
    chartId,
    traces,
    layout,
    getConfig(`${props.station.sid}_comparison_wind_rose`)
  )
}

watch(() => [props.winds, props.units, props.petalCount], buildChart)

onMounted(buildChart)

onUnmounted(() => purgeChart(chartId))
</script>

<template>
  <div :id="chartId" />
</template>
