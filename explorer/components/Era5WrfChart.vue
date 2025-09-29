<script lang="ts" setup>
import type { Data } from 'plotly.js-dist-min'
import type { ClimatologyData } from '~/utils/era5WrfStatistics'
import { CHART_COLORS, CHART_CONFIG } from '~/utils/era5WrfConstants'

interface Props {
  showTemperature: boolean
  showHumidity: boolean
  selectedYear: string
  showClimatology: boolean
  showPercentileBands: boolean
  highlightExtremes: boolean
  climatologyPeriod: string
  currentClimatology: ClimatologyData | null
  filteredDates: string[]
}

const props = defineProps<Props>()

const { $Plotly } = useNuxtApp()
const dataStore = useDataStore()
const placesStore = usePlacesStore()

const endpoint = 'era5wrf'
const apiData = computed(() => dataStore.apiData[endpoint])
const latLng = computed(() => placesStore.latLng)

const buildChart = () => {
  if (!apiData.value || !latLng.value) return

  if (props.filteredDates.length === 0) {
    $Plotly.newPlot('era5-chart', [], {
      title: {
        text: `Fire Weather Conditions: ${props.selectedYear}<br>${latLng.value.lat.toFixed(3)}°N, ${latLng.value.lng.toFixed(3)}°W`,
        font: { size: 18 },
      },
      xaxis: {
        title: 'Date (March 15 - October 15)',
        type: 'date',
        tickformat: '%b %d',
      },
      yaxis: {
        title: 'Temperature (°C)',
        side: 'left',
        color: CHART_COLORS.temperature,
      },
      yaxis2: {
        title: 'Relative Humidity Min (%)',
        side: 'right',
        overlaying: 'y',
        color: CHART_COLORS.humidity,
      },
      ...CHART_CONFIG.layout,
      legend: {
        ...CHART_CONFIG.layout.legend,
        y: -0.15,
      },
    })
    return
  }
  let traces: Data[] = []

  // Add percentile bands if enabled
  if (props.showPercentileBands && props.currentClimatology) {
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
      fillcolor: CHART_COLORS.temperatureBand,
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
      fillcolor: CHART_COLORS.humidityBand,
      line: { width: 0 },
      name: `Humidity Normal Range (${props.climatologyPeriod})`,
      showlegend: true,
      hoverinfo: 'skip',
      yaxis: 'y2',
    })
  }

  // Add climatology average lines
  if (props.showClimatology && props.currentClimatology) {
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
        color: CHART_COLORS.temperature,
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
        color: CHART_COLORS.humidity,
        width: 1,
        dash: 'dash',
      },
      yaxis: 'y2',
      hovertemplate: 'Average: %{y:.1f}%<extra></extra>',
    })
  }

  // Enhanced annual data traces with anomaly information
  if (props.showTemperature) {
    const temperatureTrace: any = {
      x: props.filteredDates,
      y: props.filteredDates.map(date => apiData.value[date].t2_max),
      name: `Max Temperature (${props.selectedYear})`,
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: CHART_COLORS.temperature, width: 2 },
      yaxis: 'y',
      hovertemplate: props.showClimatology
        ? '%{x}<br>Temperature: %{y:.1f}°C<br>Anomaly: %{customdata:.1f}°C<extra></extra>'
        : '%{x}<br>Temperature: %{y:.1f}°C<extra></extra>',
    }

    // Add anomaly calculations if climatology is shown
    if (props.showClimatology && props.currentClimatology) {
      temperatureTrace.customdata = props.filteredDates.map(date => {
        const dayOfYear = date.slice(5)
        const observed = apiData.value[date].t2_max
        const climatologyMean =
          props.currentClimatology?.[dayOfYear]?.t2_max?.mean
        return climatologyMean ? observed - climatologyMean : null
      })

      // Highlight extreme values (only hot days for temperature)
      if (props.highlightExtremes) {
        temperatureTrace.marker = {
          size: props.filteredDates.map(date => {
            const dayOfYear = date.slice(5)
            const observed = apiData.value[date].t2_max
            const p90 = props.currentClimatology?.[dayOfYear]?.t2_max?.p90
            return p90 !== undefined && observed > p90 ? 8 : 4 // Only highlight hot days
          }),
          color: props.filteredDates.map(date => {
            const dayOfYear = date.slice(5)
            const observed = apiData.value[date].t2_max
            const p90 = props.currentClimatology?.[dayOfYear]?.t2_max?.p90
            if (p90 !== undefined && observed > p90)
              return CHART_COLORS.extremeHighlight // Hot extreme
            return CHART_COLORS.temperature // Normal
          }),
        }
      } else {
        temperatureTrace.marker = { size: 4 }
      }
    } else {
      temperatureTrace.marker = { size: 4 }
    }

    traces.push(temperatureTrace)
  }

  // Enhanced humidity trace
  if (props.showHumidity) {
    const humidityTrace: any = {
      x: props.filteredDates,
      y: props.filteredDates.map(date => apiData.value[date].rh2_min),
      name: `Min Relative Humidity (${props.selectedYear})`,
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: CHART_COLORS.humidity, width: 2 },
      yaxis: 'y2',
      hovertemplate: props.showClimatology
        ? '%{x}<br>Humidity: %{y:.1f}%<br>Anomaly: %{customdata:.1f}%<extra></extra>'
        : '%{x}<br>Humidity: %{y:.1f}%<extra></extra>',
    }

    // Add anomaly calculations if climatology is shown
    if (props.showClimatology && props.currentClimatology) {
      humidityTrace.customdata = props.filteredDates.map(date => {
        const dayOfYear = date.slice(5)
        const observed = apiData.value[date].rh2_min
        const climatologyMean =
          props.currentClimatology?.[dayOfYear]?.rh2_min?.mean
        return climatologyMean ? observed - climatologyMean : null
      })

      // Highlight extreme values
      if (props.highlightExtremes) {
        humidityTrace.marker = {
          size: props.filteredDates.map(date => {
            const dayOfYear = date.slice(5)
            const observed = apiData.value[date].rh2_min
            const p10 = props.currentClimatology?.[dayOfYear]?.rh2_min?.p10
            return p10 !== undefined && observed < p10 ? 8 : 4 // Only highlight dry days
          }),
          color: props.filteredDates.map(date => {
            const dayOfYear = date.slice(5)
            const observed = apiData.value[date].rh2_min
            const p10 = props.currentClimatology?.[dayOfYear]?.rh2_min?.p10
            if (p10 !== undefined && observed < p10)
              return CHART_COLORS.extremeHighlight // Dry extreme
            return CHART_COLORS.humidity // Normal
          }),
        }
      } else {
        humidityTrace.marker = { size: 4 }
      }
    } else {
      humidityTrace.marker = { size: 4 }
    }

    traces.push(humidityTrace)
  }

  $Plotly.newPlot(
    'era5-chart',
    traces,
    {
      title: {
        text: `Fire Weather Conditions: ${props.selectedYear}<br>${latLng.value.lat.toFixed(3)}°N, ${latLng.value.lng.toFixed(3)}°W`,
        font: { size: 18 },
      },
      xaxis: {
        title: 'Date (March 15 - October 15)',
        type: 'date',
        tickformat: '%b %d',
      },
      yaxis: {
        title: 'Temperature (°C)',
        side: 'left',
        color: CHART_COLORS.temperature,
      },
      yaxis2: {
        title: 'Relative Humidity (%)',
        side: 'right',
        overlaying: 'y',
        color: CHART_COLORS.humidity,
      },
      ...CHART_CONFIG.layout,
    },
    CHART_CONFIG.plotlyOptions
  )
}

// Watchers - chart rebuilds when props change
watch(
  [
    apiData,
    () => props.showTemperature,
    () => props.showHumidity,
    () => props.selectedYear,
    () => props.showClimatology,
    () => props.showPercentileBands,
    () => props.highlightExtremes,
    () => props.climatologyPeriod,
    () => props.currentClimatology,
    () => props.filteredDates,
  ],
  buildChart
)
</script>

<template>
  <div id="era5-chart"></div>
</template>
