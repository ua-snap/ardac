<script lang="ts" setup>
import type { Data } from 'plotly.js-dist-min'
import type { Era5WrfSeriesPoint } from '~/utils/era5WrfTransforms'
import type { ClimatologyData } from '~/utils/era5WrfClimatology'
import {
  CHART_CONFIG,
  ERA5_WRF_VARIABLES,
  ERA5_FIRE_SEASON,
} from '~/utils/era5WrfConstants'

const chartStore = useChartStore()

interface Props {
  t2Max: Era5WrfSeriesPoint[]
  t2Mean: Era5WrfSeriesPoint[]
  t2Min: Era5WrfSeriesPoint[]
  lat: number
  lng: number
  chartId?: string
  // Optional climatology props for fire weather analysis
  climatologyT2Max?: ClimatologyData
  climatologyT2Mean?: ClimatologyData
  climatologyT2Min?: ClimatologyData
  showClimatology?: boolean
  // Fire season used to label chart
  isFireSeason?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  chartId: 'era5-temperature-chart',
  showClimatology: false,
  isFireSeason: false,
})

const { $Plotly } = useNuxtApp()
const chartId = props.chartId

const t2MaxVar = ERA5_WRF_VARIABLES.find(v => v.key === 't2_max')!
const t2MeanVar = ERA5_WRF_VARIABLES.find(v => v.key === 't2_mean')!
const t2MinVar = ERA5_WRF_VARIABLES.find(v => v.key === 't2_min')!

const buildChart = () => {
  const traces: Data[] = []

  // Add climatology bands if enabled and available
  if (props.showClimatology) {
    // T2 Max climatology bands
    if (props.climatologyT2Max && props.climatologyT2Max.bands.length > 0) {
      const filteredBands = props.climatologyT2Max.bands
      // 10th-90th percentile band (filled area)
      traces.push({
        x: filteredBands.map(b => b.date),
        y: filteredBands.map(b => b.p90),
        type: 'scatter',
        mode: 'lines',
        line: { width: 0 },
        showlegend: false,
        hoverinfo: 'skip',
        name: 'Upper Band',
      })
      traces.push({
        x: filteredBands.map(b => b.date),
        y: filteredBands.map(b => b.p10),
        type: 'scatter',
        mode: 'lines',
        fill: 'tonexty',
        fillcolor: t2MaxVar.climatologyBand,
        line: { width: 0 },
        name: 'Climatology Range (10th-90th percentile)',
        showlegend: true,
        hovertemplate: '<b>Climatology</b><br>90th: %{y:.1f}°C<extra></extra>',
      })
      // Median line (50th percentile)
      traces.push({
        x: filteredBands.map(b => b.date),
        y: filteredBands.map(b => b.p50),
        type: 'scatter',
        mode: 'lines',
        line: { color: t2MaxVar.color, width: 1, dash: 'dot' },
        name: 'Climatology Median',
        opacity: 0.7,
        hovertemplate: '<b>Climatology Median</b><br>%{y:.1f}°C<extra></extra>',
      })
    }

    // Only show mean and min climatology if not in fire season mode
    if (!props.isFireSeason) {
      // T2 Mean climatology median
      if (props.climatologyT2Mean && props.climatologyT2Mean.bands.length > 0) {
        const filteredMeanBands = props.climatologyT2Mean.bands

        traces.push({
          x: filteredMeanBands.map(b => b.date),
          y: filteredMeanBands.map(b => b.p50),
          type: 'scatter',
          mode: 'lines',
          line: { color: t2MeanVar.color, width: 1, dash: 'dot' },
          name: 'Climatology Median (Mean)',
          opacity: 0.7,
          hovertemplate:
            '<b>Climatology Median</b><br>%{y:.1f}°C<extra></extra>',
        })
      }

      // T2 Min climatology median
      if (props.climatologyT2Min && props.climatologyT2Min.bands.length > 0) {
        const filteredMinBands = props.climatologyT2Min.bands

        traces.push({
          x: filteredMinBands.map(b => b.date),
          y: filteredMinBands.map(b => b.p50),
          type: 'scatter',
          mode: 'lines',
          line: { color: t2MinVar.color, width: 1, dash: 'dot' },
          name: 'Climatology Median (Min)',
          opacity: 0.7,
          hovertemplate:
            '<b>Climatology Median</b><br>%{y:.1f}°C<extra></extra>',
        })
      }
    }
  }

  // Add actual data traces
  // In fire season mode, only show max temperature
  if (props.isFireSeason) {
    traces.push({
      x: props.t2Max.map(p => p.date),
      y: props.t2Max.map(p => p.value),
      name: t2MaxVar.label,
      type: 'scatter',
      mode: 'lines',
      line: { color: t2MaxVar.color, width: 2 },
      hovertemplate:
        '<b>Max Temperature</b><br>%{x}<br>%{y:.1f}°C<extra></extra>',
    })
  } else {
    // Show all three temperature traces
    traces.push(
      {
        x: props.t2Max.map(p => p.date),
        y: props.t2Max.map(p => p.value),
        name: t2MaxVar.label,
        type: 'scatter',
        mode: 'lines',
        line: { color: t2MaxVar.color, width: 2 },
        hovertemplate:
          '<b>Max Temperature</b><br>%{x}<br>%{y:.1f}°C<extra></extra>',
      },
      {
        x: props.t2Mean.map(p => p.date),
        y: props.t2Mean.map(p => p.value),
        name: t2MeanVar.label,
        type: 'scatter',
        mode: 'lines',
        line: { color: t2MeanVar.color, width: 2 },
        hovertemplate:
          '<b>Mean Temperature</b><br>%{x}<br>%{y:.1f}°C<extra></extra>',
      },
      {
        x: props.t2Min.map(p => p.date),
        y: props.t2Min.map(p => p.value),
        name: t2MinVar.label,
        type: 'scatter',
        mode: 'lines',
        line: { color: t2MinVar.color, width: 2 },
        hovertemplate:
          '<b>Min Temperature</b><br>%{x}<br>%{y:.1f}°C<extra></extra>',
      }
    )
  }

  $Plotly.newPlot(
    chartId,
    traces,
    {
      title: {
        text: props.isFireSeason
          ? `Daily Maximum Temperature<br><sub>${chartStore.getChartTitle('')}</sub>`
          : `Daily 2m Temperature<br><sub>${chartStore.getChartTitle('')}</sub>`,
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
          text: 'Temperature (°C)',
          font: { size: 18 },
        },
      },
      ...CHART_CONFIG.layout,
    },
    CHART_CONFIG.plotlyOptions
  )
}

watch(
  () => [
    props.t2Max,
    props.t2Mean,
    props.t2Min,
    props.climatologyT2Max,
    props.climatologyT2Mean,
    props.climatologyT2Min,
    props.showClimatology,
  ],
  buildChart,
  { deep: true }
)

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
