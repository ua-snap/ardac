<script lang="ts" setup>
import type { Data } from 'plotly.js-dist-min'
import type { Era5WrfSeriesPoint } from '~/utils/era5WrfTransforms'
import type { ClimatologyData } from '~/utils/era5WrfClimatology'
import {
  CHART_CONFIG,
  ERA5_WRF_VARIABLES,
  ERA5_SEASONS,
} from '~/utils/era5WrfConstants'

interface Props {
  rh2Max: Era5WrfSeriesPoint[]
  rh2Mean: Era5WrfSeriesPoint[]
  rh2Min: Era5WrfSeriesPoint[]
  lat: number
  lng: number
  chartId?: string
  // Optional climatology props for fire weather analysis
  climatologyRh2Max?: ClimatologyData
  climatologyRh2Mean?: ClimatologyData
  climatologyRh2Min?: ClimatologyData
  showClimatology?: boolean
  // Fire season filtering indicator
  isFireSeason?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  chartId: 'era5-humidity-chart',
  showClimatology: false,
  isFireSeason: false,
})

const { $Plotly } = useNuxtApp()
const chartId = props.chartId

const rh2MaxVar = ERA5_WRF_VARIABLES.find(v => v.key === 'rh2_max')!
const rh2MeanVar = ERA5_WRF_VARIABLES.find(v => v.key === 'rh2_mean')!
const rh2MinVar = ERA5_WRF_VARIABLES.find(v => v.key === 'rh2_min')!

// Helper to filter climatology bands to fire season if needed
const filterBandsToSeason = (bands: any[]) => {
  if (!props.isFireSeason) return bands
  const { start, end } = ERA5_SEASONS.fireSeasonDates
  return bands.filter(b => {
    const monthDay = b.date.slice(5) // Extract MM-DD
    return monthDay >= start && monthDay <= end
  })
}

const buildChart = () => {
  const traces: Data[] = []

  // Add climatology bands if enabled and available
  if (props.showClimatology) {
    // RH2 Min climatology bands (most relevant for fire weather - low humidity)
    if (props.climatologyRh2Min && props.climatologyRh2Min.bands.length > 0) {
      const filteredBands = filterBandsToSeason(props.climatologyRh2Min.bands)
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
        fillcolor: rh2MinVar.climatologyBand,
        line: { width: 0 },
        name: 'Climatology Range (10th-90th percentile)',
        showlegend: true,
        hovertemplate: '<b>Climatology</b><br>10th: %{y:.1f}%<extra></extra>',
      })
      // Median line (50th percentile)
      traces.push({
        x: filteredBands.map(b => b.date),
        y: filteredBands.map(b => b.p50),
        type: 'scatter',
        mode: 'lines',
        line: { color: rh2MinVar.color, width: 1, dash: 'dot' },
        name: 'Climatology Median',
        opacity: 0.7,
        hovertemplate: '<b>Climatology Median</b><br>%{y:.1f}%<extra></extra>',
      })
    }

    // Only show mean and max climatology if not in fire season mode
    if (!props.isFireSeason) {
      // RH2 Mean climatology median
      if (
        props.climatologyRh2Mean &&
        props.climatologyRh2Mean.bands.length > 0
      ) {
        const filteredMeanBands = filterBandsToSeason(
          props.climatologyRh2Mean.bands
        )
        traces.push({
          x: filteredMeanBands.map(b => b.date),
          y: filteredMeanBands.map(b => b.p50),
          type: 'scatter',
          mode: 'lines',
          line: { color: rh2MeanVar.color, width: 1, dash: 'dot' },
          name: 'Climatology Median (Mean)',
          opacity: 0.7,
          hovertemplate:
            '<b>Climatology Median</b><br>%{y:.1f}%<extra></extra>',
        })
      }

      // RH2 Max climatology median
      if (props.climatologyRh2Max && props.climatologyRh2Max.bands.length > 0) {
        const filteredMaxBands = filterBandsToSeason(
          props.climatologyRh2Max.bands
        )
        traces.push({
          x: filteredMaxBands.map(b => b.date),
          y: filteredMaxBands.map(b => b.p50),
          type: 'scatter',
          mode: 'lines',
          line: { color: rh2MaxVar.color, width: 1, dash: 'dot' },
          name: 'Climatology Median (Max)',
          opacity: 0.7,
          hovertemplate:
            '<b>Climatology Median</b><br>%{y:.1f}%<extra></extra>',
        })
      }
    }
  }

  // Add actual data traces
  // In fire season mode, only show min humidity
  if (props.isFireSeason) {
    traces.push({
      x: props.rh2Min.map(p => p.date),
      y: props.rh2Min.map(p => p.value),
      name: rh2MinVar.label,
      type: 'scatter',
      mode: 'lines',
      line: { color: rh2MinVar.color, width: 2 },
      hovertemplate: '<b>Min Humidity</b><br>%{x}<br>%{y:.1f}%<extra></extra>',
    })
  } else {
    // Show all three humidity traces
    traces.push(
      {
        x: props.rh2Max.map(p => p.date),
        y: props.rh2Max.map(p => p.value),
        name: rh2MaxVar.label,
        type: 'scatter',
        mode: 'lines',
        line: { color: rh2MaxVar.color, width: 2 },
        hovertemplate:
          '<b>Max Humidity</b><br>%{x}<br>%{y:.1f}%<extra></extra>',
      },
      {
        x: props.rh2Mean.map(p => p.date),
        y: props.rh2Mean.map(p => p.value),
        name: rh2MeanVar.label,
        type: 'scatter',
        mode: 'lines',
        line: { color: rh2MeanVar.color, width: 2 },
        hovertemplate:
          '<b>Mean Humidity</b><br>%{x}<br>%{y:.1f}%<extra></extra>',
      },
      {
        x: props.rh2Min.map(p => p.date),
        y: props.rh2Min.map(p => p.value),
        name: rh2MinVar.label,
        type: 'scatter',
        mode: 'lines',
        line: { color: rh2MinVar.color, width: 2 },
        hovertemplate:
          '<b>Min Humidity</b><br>%{x}<br>%{y:.1f}%<extra></extra>',
      }
    )
  }

  $Plotly.newPlot(
    chartId,
    traces,
    {
      title: {
        text: props.isFireSeason
          ? `Daily Minimum Relative Humidity<br><sub>${props.lat.toFixed(3)}°N, ${props.lng.toFixed(3)}°W</sub>`
          : `Daily 2m Relative Humidity<br><sub>${props.lat.toFixed(3)}°N, ${props.lng.toFixed(3)}°W</sub>`,
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
          text: 'Relative Humidity (%)',
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
    props.rh2Max,
    props.rh2Mean,
    props.rh2Min,
    props.climatologyRh2Max,
    props.climatologyRh2Mean,
    props.climatologyRh2Min,
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
