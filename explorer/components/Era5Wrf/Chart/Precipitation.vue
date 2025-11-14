<script lang="ts" setup>
import type { Data } from 'plotly.js-dist-min'
import type { Era5WrfSeriesPoint } from '~/utils/era5WrfTransforms'
import { CHART_CONFIG, ERA5_WRF_VARIABLES } from '~/utils/era5WrfConstants'

const chartStore = useChartStore()

interface Props {
  rainnc: Era5WrfSeriesPoint[]
  lat: number
  lng: number
  chartId?: string
  // Fire season filtering indicator
  isFireSeason?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  chartId: 'era5-precipitation-chart',
  isFireSeason: false,
})

const { $Plotly } = useNuxtApp()
const chartId = props.chartId

const rainncVar = ERA5_WRF_VARIABLES.find(v => v.key === 'rainnc_sum')!

const buildChart = () => {
  const traces: Data[] = [
    {
      x: props.rainnc.map(p => p.date),
      y: props.rainnc.map(p => p.value),
      name: rainncVar.label,
      type: 'bar',
      marker: { color: rainncVar.color, opacity: 0.7 },
    },
  ]

  $Plotly.newPlot(
    chartId,
    traces,
    {
      title: {
        text: `Daily Total Precipitation<br><sub>${chartStore.getChartTitle('')}</sub>`,
        font: { size: 24 },
      },
      xaxis: {
        title: {
          text: props.isFireSeason ? 'Date (March 15 - October 15)' : '',
          font: { size: 18 },
          standoff: 20,
        },
        type: 'date',
        fixedrange: true,
      },
      yaxis: {
        title: {
          text: 'Precipitation (mm)',
          font: { size: 18 },
        },
        rangemode: 'tozero',
      },
      ...CHART_CONFIG.layout,
    },
    CHART_CONFIG.plotlyOptions
  )
}

watch(() => props.rainnc, buildChart, { deep: true })

onMounted(buildChart)
onUnmounted(() => {
  try {
    const element = document.getElementById(chartId)
    if (element && element.hasChildNodes()) {
      $Plotly.purge(chartId)
    }
  } catch (error) {
    // Ignore purge errors - chart may already be cleaned up by wrapper
    console.debug(`Chart purge skipped for ${chartId}:`, error)
  }
})
</script>

<template>
  <div :id="chartId" class="era5-chart" />
</template>

<style scoped>
.era5-chart {
  min-height: 400px;
}
</style>
