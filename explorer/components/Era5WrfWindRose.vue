<script lang="ts" setup>
import type { Data, Layout } from 'plotly.js-dist-min'
import {
  prepareWindRoseData,
  type Era5WrfSeriesPoint,
  type WindRoseData,
} from '~/utils/era5WrfTransforms'

interface Props {
  speedSeries: Era5WrfSeriesPoint[]
  directionSeries: Era5WrfSeriesPoint[]
  speedLabel: string
  chartId?: string
}

const props = withDefaults(defineProps<Props>(), {
  chartId: 'era5-wrf-wind-rose',
})

const { $Plotly } = useNuxtApp()
const chartId = props.chartId

const windRoseData = computed<WindRoseData | null>(() => {
  if (!props.speedSeries.length || !props.directionSeries.length) return null
  return prepareWindRoseData(props.speedSeries, props.directionSeries)
})

// Color scale for speed ranges (light to dark blue-green)
const SPEED_COLORS = [
  '#f7fbff',
  '#deebf7',
  '#c6dbef',
  '#9ecae1',
  '#6baed6',
  '#4292c6',
  '#2171b5',
]

const buildWindRose = () => {
  if (!windRoseData.value) {
    $Plotly.newPlot(
      chartId,
      [],
      {
        title: {
          text: 'Wind Rose',
          font: { size: 16 },
        },
        polar: {
          angularaxis: {
            rotation: 90,
            direction: 'clockwise',
          },
        },
      },
      {
        responsive: true,
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: [
          'zoom2d',
          'pan2d',
          'select2d',
          'lasso2d',
          'zoomIn2d',
          'zoomOut2d',
          'autoScale2d',
          'resetScale2d',
        ],
      }
    )
    return
  }

  const data = windRoseData.value
  const traces: Data[] = []

  // Create one trace per speed range (stacked)
  data.speedRanges.forEach((speedRange, speedIdx) => {
    const frequencies = data.directionSectors.map(direction => {
      const bin = data.bins.find(
        b => b.direction === direction && b.speedRange === speedRange
      )
      return bin ? bin.frequency : 0
    })

    traces.push({
      type: 'barpolar',
      r: frequencies,
      theta: data.directionSectors,
      name: speedRange,
      marker: {
        color: SPEED_COLORS[speedIdx % SPEED_COLORS.length],
        line: {
          color: 'white',
          width: 1,
        },
      },
      hovertemplate:
        '<b>%{theta}°</b><br>' +
        speedRange +
        '<br>' +
        'Frequency: %{r:.1f}%' +
        '<extra></extra>',
    } as Data)
  })

  const layout: Partial<Layout> = {
    title: {
      text: `Wind Rose - ${props.speedLabel}<br><sub>n = ${data.totalCount} observations</sub>`,
      font: { size: 24 },
    },
    barmode: 'stack',
    bargap: 0,
    polar: {
      angularaxis: {
        rotation: 90,
        direction: 'clockwise',
      },
      radialaxis: {
        ticksuffix: '%',
        angle: 45,
      },
    },
    showlegend: true,
    legend: {
      x: 1.05,
      xanchor: 'left',
      y: 0.5,
      yanchor: 'middle',
      title: {
        text: 'Wind Speed (m/s)',
        font: { size: 12 },
      },
    },
    margin: { t: 80, b: 40, l: 40, r: 160 },
  }

  $Plotly.newPlot(chartId, traces, layout, {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: [
      'zoom2d',
      'pan2d',
      'select2d',
      'lasso2d',
      'zoomIn2d',
      'zoomOut2d',
      'autoScale2d',
      'resetScale2d',
    ],
  })
}

watch(() => [props.speedSeries, props.directionSeries], buildWindRose, {
  deep: true,
})

onMounted(() => {
  buildWindRose()
})

onUnmounted(() => {
  $Plotly.purge(chartId)
})
</script>

<template>
  <div :id="chartId" class="wind-rose-chart" />
</template>

<style scoped>
.wind-rose-chart {
  min-height: 500px;
}
</style>
