<script lang="ts" setup>
import type { Data } from 'plotly.js-dist-min'
import type { Era5WrfSeriesPoint } from '~/utils/era5WrfTransforms'
import { CHART_CONFIG, ERA5_WRF_VARIABLES } from '~/utils/era5WrfConstants'

interface Props {
  rh2Max: Era5WrfSeriesPoint[]
  rh2Mean: Era5WrfSeriesPoint[]
  rh2Min: Era5WrfSeriesPoint[]
  lat: number
  lng: number
  chartId?: string
}

const props = withDefaults(defineProps<Props>(), {
  chartId: 'era5-humidity-chart',
})

const { $Plotly } = useNuxtApp()
const chartId = props.chartId

const rh2MaxVar = ERA5_WRF_VARIABLES.find(v => v.key === 'rh2_max')!
const rh2MeanVar = ERA5_WRF_VARIABLES.find(v => v.key === 'rh2_mean')!
const rh2MinVar = ERA5_WRF_VARIABLES.find(v => v.key === 'rh2_min')!

const buildChart = () => {
  const traces: Data[] = [
    {
      x: props.rh2Max.map(p => p.date),
      y: props.rh2Max.map(p => p.value),
      name: rh2MaxVar.label,
      type: 'scatter',
      mode: 'lines',
      line: { color: rh2MaxVar.color, width: 2 },
    },
    {
      x: props.rh2Mean.map(p => p.date),
      y: props.rh2Mean.map(p => p.value),
      name: rh2MeanVar.label,
      type: 'scatter',
      mode: 'lines',
      line: { color: rh2MeanVar.color, width: 2 },
    },
    {
      x: props.rh2Min.map(p => p.date),
      y: props.rh2Min.map(p => p.value),
      name: rh2MinVar.label,
      type: 'scatter',
      mode: 'lines',
      line: { color: rh2MinVar.color, width: 2 },
    },
  ]

  $Plotly.newPlot(
    chartId,
    traces,
    {
      title: {
        text: `Daily 2m Relative Humidity<br><sub>${props.lat.toFixed(3)}°N, ${props.lng.toFixed(3)}°W</sub>`,
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
          text: 'Relative Humidity (%)',
          font: { size: 18 },
        },
      },
      ...CHART_CONFIG.layout,
    },
    CHART_CONFIG.plotlyOptions
  )
}

watch(() => [props.rh2Max, props.rh2Mean, props.rh2Min], buildChart, {
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
