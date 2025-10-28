<script lang="ts" setup>
import type { Data } from 'plotly.js-dist-min'
import type { Era5WrfSeriesPoint } from '~/utils/era5WrfTransforms'
import { CHART_CONFIG } from '~/utils/era5WrfConstants'

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

const buildChart = () => {
  const traces: Data[] = [
    {
      x: props.rh2Max.map(p => p.date),
      y: props.rh2Max.map(p => p.value),
      name: 'Max Humidity',
      type: 'scatter',
      mode: 'lines',
      line: { color: '#1f77b4', width: 2 },
    },
    {
      x: props.rh2Mean.map(p => p.date),
      y: props.rh2Mean.map(p => p.value),
      name: 'Mean Humidity',
      type: 'scatter',
      mode: 'lines',
      line: { color: '#17becf', width: 2 },
    },
    {
      x: props.rh2Min.map(p => p.date),
      y: props.rh2Min.map(p => p.value),
      name: 'Min Humidity',
      type: 'scatter',
      mode: 'lines',
      line: { color: '#2ca02c', width: 2 },
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
