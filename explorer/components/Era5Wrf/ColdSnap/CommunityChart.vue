<script lang="ts" setup>
import type { Data, Layout } from 'plotly.js-dist-min'
import type { Era5WrfSeriesPoint } from '~/utils/era5WrfTransforms'
import type { ColdSnapAnnotation } from '~/utils/coldSnap1989Communities'
import { CHART_CONFIG, ERA5_WRF_VARIABLES } from '~/utils/era5WrfConstants'

interface Props {
  communityName: string
  t2Min: Era5WrfSeriesPoint[]
  t2Max: Era5WrfSeriesPoint[]
  lat: number
  lng: number
  chartId: string
  annotations?: ColdSnapAnnotation[]
}

const props = withDefaults(defineProps<Props>(), {
  annotations: () => [],
})

const { $Plotly } = useNuxtApp()
const chartId = props.chartId

const t2MaxVar = ERA5_WRF_VARIABLES.find(v => v.key === 't2_max')!
const t2MinVar = ERA5_WRF_VARIABLES.find(v => v.key === 't2_min')!

const formatLng = (lng: number) =>
  lng < 0 ? `${Math.abs(lng)}°W` : `${lng}°E`

const buildChart = () => {
  if (!props.t2Min.length && !props.t2Max.length) return

  const traces: Data[] = [
    {
      x: props.t2Max.map(point => point.date),
      y: props.t2Max.map(point => point.value),
      name: 'Daily Max 2 m Temperature',
      type: 'scatter',
      mode: 'lines',
      line: { color: t2MaxVar.color, width: 2 },
      hovertemplate:
        '<b>Max Temperature</b><br>%{x}<br>%{y:.1f}°F<extra></extra>',
    },
    {
      x: props.t2Min.map(point => point.date),
      y: props.t2Min.map(point => point.value),
      name: 'Daily Min 2 m Temperature',
      type: 'scatter',
      mode: 'lines',
      line: { color: t2MinVar.color, width: 2 },
      hovertemplate:
        '<b>Min Temperature</b><br>%{x}<br>%{y:.1f}°F<extra></extra>',
    },
  ]

  const shapes: NonNullable<Layout['shapes']> = []
  const plotAnnotations: NonNullable<Layout['annotations']> = []

  props.annotations?.forEach(annotation => {
    shapes.push({
      type: 'line',
      x0: props.t2Min[0]?.date,
      x1: props.t2Max[props.t2Max.length - 1]?.date,
      y0: annotation.valueF,
      y1: annotation.valueF,
      line: {
        color: annotation.type === 'min' ? t2MinVar.color : t2MaxVar.color,
        width: 2,
        dash: 'dash',
      },
    })

    plotAnnotations.push({
      x:
        annotation.date ??
        props.t2Max[Math.floor(props.t2Max.length / 2)]?.date,
      y: annotation.valueF,
      xref: 'x',
      yref: 'y',
      text: annotation.label,
      showarrow: true,
      arrowhead: 2,
      ax: 0,
      ay: annotation.type === 'min' ? 40 : -40,
      font: { size: 12 },
      bgcolor: 'rgba(255,255,255,0.85)',
    })
  })

  $Plotly.newPlot(
    chartId,
    traces,
    {
      title: {
        text: `${props.communityName}<br><sub>Daily Min/Max 2 m Temperature, Jan 1 – Apr 1, 1989 (${props.lat}°N, ${formatLng(props.lng)})</sub>`,
        font: { size: 24 },
      },
      xaxis: {
        title: { text: 'Date', font: { size: 18 } },
        type: 'date',
        fixedrange: true,
      },
      yaxis: {
        title: { text: 'Temperature (°F)', font: { size: 18 } },
      },
      shapes,
      annotations: plotAnnotations,
      ...CHART_CONFIG.layout,
    },
    CHART_CONFIG.plotlyOptions
  )
}

watch(() => [props.t2Min, props.t2Max, props.annotations], buildChart, {
  deep: true,
})

onMounted(buildChart)
onUnmounted(() => {
  try {
    const element = document.getElementById(chartId)
    if (element && element.hasChildNodes()) {
      $Plotly.purge(chartId)
    }
  } catch (error) {
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
