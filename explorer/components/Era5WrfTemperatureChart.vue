<script lang="ts" setup>
import type { Data } from 'plotly.js-dist-min'
import type { Era5WrfSeriesPoint } from '~/utils/era5WrfTransforms'
import { CHART_CONFIG, ERA5_WRF_VARIABLES } from '~/utils/era5WrfConstants'

interface Props {
  t2Max: Era5WrfSeriesPoint[]
  t2Mean: Era5WrfSeriesPoint[]
  t2Min: Era5WrfSeriesPoint[]
  lat: number
  lng: number
  chartId?: string
}

const props = withDefaults(defineProps<Props>(), {
  chartId: 'era5-temperature-chart',
})

const { $Plotly } = useNuxtApp()
const chartId = props.chartId

const t2MaxVar = ERA5_WRF_VARIABLES.find(v => v.key === 't2_max')!
const t2MeanVar = ERA5_WRF_VARIABLES.find(v => v.key === 't2_mean')!
const t2MinVar = ERA5_WRF_VARIABLES.find(v => v.key === 't2_min')!

const buildChart = () => {
  const traces: Data[] = [
    {
      x: props.t2Max.map(p => p.date),
      y: props.t2Max.map(p => p.value),
      name: t2MaxVar.label,
      type: 'scatter',
      mode: 'lines',
      line: { color: t2MaxVar.color, width: 2 },
    },
    {
      x: props.t2Mean.map(p => p.date),
      y: props.t2Mean.map(p => p.value),
      name: t2MeanVar.label,
      type: 'scatter',
      mode: 'lines',
      line: { color: t2MeanVar.color, width: 2 },
    },
    {
      x: props.t2Min.map(p => p.date),
      y: props.t2Min.map(p => p.value),
      name: t2MinVar.label,
      type: 'scatter',
      mode: 'lines',
      line: { color: t2MinVar.color, width: 2 },
    },
  ]

  $Plotly.newPlot(
    chartId,
    traces,
    {
      title: {
        text: `Daily 2m Temperature<br><sub>${props.lat.toFixed(3)}°N, ${props.lng.toFixed(3)}°W</sub>`,
        font: { size: 24 },
      },
      xaxis: {
        title: {
          text: 'Date',
          font: { size: 18 },
          standoff: 20,
        },
        type: 'date',
        fixedrange: true,
      },
      yaxis: {
        title: {
          text: 'Temperature (°C)',
          font: { size: 18 },
        },
      },
      ...CHART_CONFIG.layout,
    },
    CHART_CONFIG.plotlyOptions
  )
}

watch(() => [props.t2Max, props.t2Mean, props.t2Min], buildChart, {
  deep: true,
})

onMounted(buildChart)
onUnmounted(() => $Plotly.purge(chartId))
</script>

<template>
  <div :id="chartId" class="era5-chart" />
</template>

<style scoped>
.era5-chart {
  min-height: 400px;
}
</style>
