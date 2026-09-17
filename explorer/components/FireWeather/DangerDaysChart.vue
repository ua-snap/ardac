<script lang="ts" setup>
import type { Data } from 'plotly.js-dist-min'
import {
  FIRE_DANGER_CLASSES,
  FIRE_WEATHER_MODELS,
  type FireDangerModelData,
  type FireWeatherPeriod,
  type FireWeatherVariable,
} from '~/utils/fireWeather'

interface Props {
  baseline: FireDangerModelData
  comparison: FireDangerModelData
  baselinePeriod: FireWeatherPeriod
  comparisonPeriod: FireWeatherPeriod
  variable: FireWeatherVariable
  locationLabel: string
}

const props = defineProps<Props>()
const { $Plotly } = useNuxtApp()
const chartId = 'fire-weather-danger-days-chart'
const chartElement = ref<HTMLDivElement | null>(null)

const buildChart = () => {
  if (!chartElement.value) return

  const labels: string[] = []
  const modelPeriods: { model: string; period: FireWeatherPeriod }[] = []

  FIRE_WEATHER_MODELS.forEach(model => {
    labels.push(`${model}<br>${props.baselinePeriod.label}`)
    labels.push(`${model}<br>${props.comparisonPeriod.label}`)
    modelPeriods.push({ model, period: props.baselinePeriod })
    modelPeriods.push({ model, period: props.comparisonPeriod })
  })

  if (props.baseline.era5) {
    labels.unshift(`ERA5 reanalysis<br>${props.baselinePeriod.label}`)
    modelPeriods.unshift({ model: 'era5', period: props.baselinePeriod })
  }

  const traces: Data[] = FIRE_DANGER_CLASSES.map(dangerClass => ({
    x: labels,
    y: modelPeriods.map(({ model, period }) => {
      const data =
        period.id === props.baselinePeriod.id
          ? props.baseline
          : props.comparison
      return data[model]?.[dangerClass.key] ?? 0
    }),
    name: dangerClass.label,
    type: 'bar',
    marker: { color: dangerClass.color },
    hovertemplate: `${dangerClass.label}: %{y} days<extra></extra>`,
  }))

  $Plotly.newPlot(
    chartElement.value,
    traces,
    {
      title: {
        text: `${props.variable.shortLabel} summer danger classes<br><sub>${props.locationLabel}; average days per June–August season</sub>`,
      },
      barmode: 'stack',
      xaxis: { fixedrange: true },
      yaxis: {
        title: { text: 'Average days per summer' },
        fixedrange: true,
      },
      legend: { orientation: 'h' },
      margin: { t: 90, b: 130 },
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
    aria-label="Stacked chart of summer fire-danger days"
  />
</template>
