<script lang="ts" setup>
import type { Data } from 'plotly.js-dist-min'
import {
  MONTHS,
  calmText,
  compassAxis,
  getRoseTraces,
  maxPetal,
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
const chartId = 'airport-winds-monthly-roses'

// Grid of 4 rows by 3 columns, one rose per month.
const rows = 4
const cols = 3
const xSpacing = 0.03
const ySpacing = 0.04
const cellWidth = (1 - (cols - 1) * xSpacing) / cols
const cellHeight = (1 - (rows - 1) * ySpacing) / rows

const subplotId = (index: number) =>
  index === 0 ? 'polar' : `polar${index + 1}`

const buildChart = () => {
  const roses = props.winds.roses[props.petalCount]
  const traces: Data[] = []
  const layout: Record<string, any> = {
    title: {
      text: `Monthly wind speed/direction distribution<br><sub>${stationTitle(props.station)}</sub>`,
      font: { size: 24 },
    },
    height: 1700,
    margin: { l: 0, r: 0, b: 0, t: 160 },
    legend: { orientation: 'h', x: 0, y: 1, yanchor: 'bottom' },
    annotations: [],
  }

  // Use the same radial axis for every month so they can be compared.
  const rmax = Math.max(...MONTHS.map((_, i) => maxPetal(roses[i + 1]))) + 1
  const rstep = Math.floor(rmax / 2.5)

  MONTHS.forEach((month, i) => {
    const subplot = subplotId(i)
    const row = Math.floor(i / cols)
    const col = i % cols
    const x0 = col * (cellWidth + xSpacing)
    const y1 = 1 - row * (cellHeight + ySpacing)
    const domain = {
      x: [x0, x0 + cellWidth],
      y: [y1 - cellHeight, y1 - 0.01],
    }
    const calm = props.winds.calms[i + 1]

    traces.push(
      ...getRoseTraces(roses[i + 1], props.units, {
        showLegend: i === 0,
        subplot,
      })
    )

    layout[subplot] = {
      domain,
      hole: calm / 100,
      angularaxis: { ...compassAxis, tickfont: { color: '#444', size: 12 } },
      radialaxis: {
        ...radialAxis,
        range: [0, rmax],
        tick0: 1,
        dtick: rstep,
      },
    }

    layout.annotations.push(
      {
        text: `<b>${month}</b>`,
        x: x0 + cellWidth / 2,
        y: y1 + 0.005,
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
        y: (domain.y[0] + domain.y[1]) / 2,
        xref: 'paper',
        yref: 'paper',
        showarrow: false,
        font: { size: 12, color: '#000' },
      }
    )
  })

  $Plotly.newPlot(
    chartId,
    traces,
    layout,
    getConfig(`${props.station.sid}_monthly_wind_rose`)
  )
}

watch(() => [props.winds, props.units, props.petalCount], buildChart)

onMounted(buildChart)

onUnmounted(() => purgeChart(chartId))
</script>

<template>
  <div :id="chartId" />
</template>
