<script lang="ts" setup>
import type { Data } from 'plotly.js-dist-min'
import type { ClimatologyData } from '~/utils/era5WrfStatistics'
import {
  ERA5_WRF_CHART_COLORS,
  ERA5_WRF_CHART_CONFIG,
  ERA5_WRF_CONFIG,
} from '~/utils/era5WrfConstants'

interface Props {
  selectedYear: string
  climatologyPeriod: string
  currentClimatology: ClimatologyData | null
  filteredDates: string[]
  chartId?: string
}

const props = withDefaults(defineProps<Props>(), {
  chartId: 'era5-chart',
})

const { $Plotly } = useNuxtApp()
const dataStore = useDataStore()
const placesStore = usePlacesStore()

// Use fire endpoint to match wrapper
const endpoint = ERA5_WRF_CONFIG.fireEndpoint
const apiData = computed(() => dataStore.apiData[endpoint])
const latLng = computed(() => placesStore.latLng)
const chartId = props.chartId

const buildChart = () => {
  if (!apiData.value || !latLng.value) return

  if (props.filteredDates.length === 0) {
    $Plotly.newPlot(chartId, [], {
      title: {
        text: `Fire Weather Conditions: ${props.selectedYear}<br>${latLng.value.lat.toFixed(3)}°N, ${latLng.value.lng.toFixed(3)}°W`,
        font: { size: 18 },
      },
      xaxis: {
        title: {
          text: 'Date (March 15 - October 15)',
          font: { size: 18 },
          standoff: 20,
        },
        type: 'date',
        tickformat: '%b %d',
      },
      yaxis: {
        title: 'Temperature (°C)',
        side: 'left',
        color: ERA5_WRF_CHART_COLORS.temperature,
      },
      yaxis2: {
        title: 'Relative Humidity Min (%)',
        side: 'right',
        overlaying: 'y',
        color: ERA5_WRF_CHART_COLORS.humidity,
      },
      ...ERA5_WRF_CHART_CONFIG.layout,
      legend: {
        ...ERA5_WRF_CHART_CONFIG.layout.legend,
        y: -0.15,
      },
    })
    return
  }
  let traces: Data[] = []

  // Add percentile bands if enabled
  if (props.currentClimatology) {
    // Temperature percentile bands (p10 first, then p90 with fill)
    traces.push({
      x: props.filteredDates,
      y: props.filteredDates.map(date => {
        const dayOfYear = date.slice(5)
        return props.currentClimatology?.[dayOfYear]?.t2_max?.p10 || null
      }),
      line: { width: 0 },
      showlegend: false,
      hoverinfo: 'skip',
      yaxis: 'y',
    })

    traces.push({
      x: props.filteredDates,
      y: props.filteredDates.map(date => {
        const dayOfYear = date.slice(5)
        return props.currentClimatology?.[dayOfYear]?.t2_max?.p90 || null
      }),
      fill: 'tonexty',
      fillcolor: ERA5_WRF_CHART_COLORS.temperatureBand,
      line: { width: 0 },
      name: `Temperature Normal Range (${props.climatologyPeriod})`,
      showlegend: true,
      hoverinfo: 'skip',
      yaxis: 'y',
    })

    // Humidity percentile bands (p10 first, then p90 with fill)
    traces.push({
      x: props.filteredDates,
      y: props.filteredDates.map(date => {
        const dayOfYear = date.slice(5)
        return props.currentClimatology?.[dayOfYear]?.rh2_min?.p10 || null
      }),
      line: { width: 0 },
      showlegend: false,
      hoverinfo: 'skip',
      yaxis: 'y2',
    })

    traces.push({
      x: props.filteredDates,
      y: props.filteredDates.map(date => {
        const dayOfYear = date.slice(5)
        return props.currentClimatology?.[dayOfYear]?.rh2_min?.p90 || null
      }),
      fill: 'tonexty',
      fillcolor: ERA5_WRF_CHART_COLORS.humidityBand,
      line: { width: 0 },
      name: `Humidity Normal Range (${props.climatologyPeriod})`,
      showlegend: true,
      hoverinfo: 'skip',
      yaxis: 'y2',
    })
  }

  // Add climatology average lines
  if (props.currentClimatology) {
    traces.push({
      x: props.filteredDates,
      y: props.filteredDates.map(date => {
        const dayOfYear = date.slice(5)
        return props.currentClimatology?.[dayOfYear]?.t2_max?.mean || null
      }),
      name: `Temperature Average (${props.climatologyPeriod})`,
      type: 'scatter',
      mode: 'lines',
      line: {
        color: ERA5_WRF_CHART_COLORS.temperature,
        width: 1,
        dash: 'dash',
      },
      yaxis: 'y',
      hovertemplate: 'Average: %{y:.1f}°C<extra></extra>',
    })

    traces.push({
      x: props.filteredDates,
      y: props.filteredDates.map(date => {
        const dayOfYear = date.slice(5)
        return props.currentClimatology?.[dayOfYear]?.rh2_min?.mean || null
      }),
      name: `Humidity Average (${props.climatologyPeriod})`,
      type: 'scatter',
      mode: 'lines',
      line: {
        color: ERA5_WRF_CHART_COLORS.humidity,
        width: 1,
        dash: 'dash',
      },
      yaxis: 'y2',
      hovertemplate: 'Average: %{y:.1f}%<extra></extra>',
    })
  }

  // Temperature trace
  const temperatureTrace: any = {
    x: props.filteredDates,
    y: props.filteredDates.map(date => apiData.value[date].t2_max),
    name: `Max Temperature (${props.selectedYear})`,
    type: 'scatter',
    mode: 'lines+markers',
    line: { color: ERA5_WRF_CHART_COLORS.temperature, width: 2 },
    yaxis: 'y',
    hovertemplate: props.currentClimatology
      ? '%{x}<br>Temperature: %{y:.1f}°C<br>Anomaly: %{customdata:.1f}°C<extra></extra>'
      : '%{x}<br>Temperature: %{y:.1f}°C<extra></extra>',
  }

  if (props.currentClimatology) {
    temperatureTrace.customdata = props.filteredDates.map(date => {
      const dayOfYear = date.slice(5)
      const observed = apiData.value[date].t2_max
      const climatologyMean =
        props.currentClimatology?.[dayOfYear]?.t2_max?.mean
      return climatologyMean ? observed - climatologyMean : null
    })
  }
  temperatureTrace.marker = { size: 4 }
  traces.push(temperatureTrace)

  // Humidity trace
  const humidityTrace: any = {
    x: props.filteredDates,
    y: props.filteredDates.map(date => apiData.value[date].rh2_min),
    name: `Min Relative Humidity (${props.selectedYear})`,
    type: 'scatter',
    mode: 'lines+markers',
    line: { color: ERA5_WRF_CHART_COLORS.humidity, width: 2 },
    yaxis: 'y2',
    hovertemplate: props.currentClimatology
      ? '%{x}<br>Humidity: %{y:.1f}%<br>Anomaly: %{customdata:.1f}%<extra></extra>'
      : '%{x}<br>Humidity: %{y:.1f}%<extra></extra>',
  }

  if (props.currentClimatology) {
    humidityTrace.customdata = props.filteredDates.map(date => {
      const dayOfYear = date.slice(5)
      const observed = apiData.value[date].rh2_min
      const climatologyMean =
        props.currentClimatology?.[dayOfYear]?.rh2_min?.mean
      return climatologyMean ? observed - climatologyMean : null
    })
  }
  humidityTrace.marker = { size: 4 }
  traces.push(humidityTrace)

  $Plotly.newPlot(
    chartId,
    traces,
    {
      title: {
        text: `Fire Weather Conditions: ${props.selectedYear}<br>${latLng.value.lat.toFixed(3)}°N, ${latLng.value.lng.toFixed(3)}°W`,
        font: { size: 18 },
      },
      xaxis: {
        title: {
          text: 'Date (March 15 - October 15)',
          font: { size: 18 },
          standoff: 20,
        },
        type: 'date',
        tickformat: '%b %d',
      },
      yaxis: {
        title: 'Temperature (°C)',
        side: 'left',
        color: ERA5_WRF_CHART_COLORS.temperature,
      },
      yaxis2: {
        title: 'Relative Humidity (%)',
        side: 'right',
        overlaying: 'y',
        color: ERA5_WRF_CHART_COLORS.humidity,
      },
      ...ERA5_WRF_CHART_CONFIG.layout,
    },
    ERA5_WRF_CHART_CONFIG.plotlyOptions
  )
}

// Watchers - chart rebuilds when props change
watch(
  [
    apiData,
    () => props.selectedYear,
    () => props.climatologyPeriod,
    () => props.currentClimatology,
    () => props.filteredDates,
  ],
  buildChart
)
</script>

<template>
  <div :id="chartId"></div>
</template>
