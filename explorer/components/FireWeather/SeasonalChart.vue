<script lang="ts" setup>
import type { Data } from 'plotly.js-dist-min'
import {
  calculateModelEnvelope,
  type FireWeatherPeriod,
  type FireWeatherRollingPeriodData,
  type FireWeatherVariable,
} from '~/utils/fireWeather'

interface Props {
  baseline: FireWeatherRollingPeriodData
  comparison: FireWeatherRollingPeriodData
  baselinePeriod: FireWeatherPeriod
  comparisonPeriod: FireWeatherPeriod
  variable: FireWeatherVariable
  locationLabel: string
}

const props = defineProps<Props>()
const { $Plotly } = useNuxtApp()
const chartId = 'fire-weather-seasonal-chart'
const chartElement = ref<HTMLDivElement | null>(null)

const buildBandTraces = (
  data: FireWeatherRollingPeriodData,
  period: FireWeatherPeriod,
  color: string,
  fillColor: string
): Data[] => {
  const envelope = calculateModelEnvelope(data)
  const dates = envelope.map(point => `2001-${point.date}`)

  return [
    {
      x: dates,
      y: envelope.map(point => point.max),
      type: 'scatter',
      mode: 'lines',
      line: { width: 0 },
      hoverinfo: 'skip',
      showlegend: false,
    },
    {
      x: dates,
      y: envelope.map(point => point.min),
      type: 'scatter',
      mode: 'lines',
      fill: 'tonexty',
      fillcolor: fillColor,
      line: { width: 0 },
      name: `${period.label} GCM range`,
      hovertemplate: `${period.label} model minimum: %{y:.1f}<extra></extra>`,
    },
    {
      x: dates,
      y: envelope.map(point => point.median),
      type: 'scatter',
      mode: 'lines',
      line: { color, width: 3 },
      name: `${period.label} GCM median`,
      hovertemplate: `${period.label} model median: %{y:.1f}<extra></extra>`,
    },
  ]
}

const buildChart = () => {
  if (!chartElement.value) return

  const traces: Data[] = [
    ...buildBandTraces(
      props.baseline,
      props.baselinePeriod,
      '#4c78a8',
      'rgba(76, 120, 168, 0.18)'
    ),
    ...buildBandTraces(
      props.comparison,
      props.comparisonPeriod,
      '#f58518',
      'rgba(245, 133, 24, 0.18)'
    ),
  ]

  const era5 = props.baseline.era5
  if (era5) {
    const dates = Object.keys(era5)
      .filter(date => date >= '04-04' && date <= '10-28')
      .sort()
    traces.push({
      x: dates.map(date => `2001-${date}`),
      y: dates.map(date => era5[date].mean),
      type: 'scatter',
      mode: 'lines',
      line: { color: '#222222', width: 2, dash: 'dash' },
      name: `${props.baselinePeriod.label} ERA5`,
      hovertemplate: 'ERA5 mean: %{y:.1f}<extra></extra>',
    })
  }

  $Plotly.newPlot(
    chartElement.value,
    traces,
    {
      title: {
        text: `${props.variable.label}: seasonal pattern<br><sub>${props.locationLabel}; mean seven-day rolling value</sub>`,
      },
      xaxis: {
        tickformat: '%b %d',
        fixedrange: true,
      },
      yaxis: {
        title: { text: `${props.variable.shortLabel} (unitless code)` },
        rangemode: 'tozero',
        fixedrange: true,
      },
      legend: { orientation: 'h' },
      margin: { t: 90, b: 100 },
    },
    {
      responsive: true,
      displayModeBar: false,
      displaylogo: false,
    }
  )
}

watch(
  () => [
    props.baseline,
    props.comparison,
    props.baselinePeriod,
    props.comparisonPeriod,
    props.variable,
    props.locationLabel,
  ],
  buildChart,
  { deep: true }
)

onMounted(buildChart)
onBeforeUnmount(() => {
  if (chartElement.value) $Plotly.purge(chartElement.value)
})
</script>

<template>
  <div
    :id="chartId"
    ref="chartElement"
    aria-label="Seasonal fire-weather comparison chart"
  />
</template>
