<script lang="ts" setup>
import type { Data } from 'plotly.js-dist-min'
import {
  THRESHOLD_COLORS,
  THRESHOLD_LABELS,
  purgeChart,
  stationTitle,
  type AirportStation,
  type AirportWindsData,
  type WindSpeedUnits,
} from '~/utils/airportWinds'

const props = defineProps<{
  station: AirportStation
  winds: AirportWindsData
  units: WindSpeedUnits
}>()

const { $Plotly } = useNuxtApp()
const chartId = 'airport-winds-crosswind'

// Draw each runway heading as a shaded strip with a dashed center line.
// Runways sharing a heading are combined into one strip.
const getRunwayTraces = (height: number): Data[] => {
  const runwaysByHeading: Record<number, string[]> = {}
  props.station.runways.forEach(runway => {
    runwaysByHeading[runway.heading] ??= []
    runwaysByHeading[runway.heading].push(runway.name)
  })

  return Object.entries(runwaysByHeading).flatMap(([heading, names]) => {
    const x = Number(heading)
    return [
      {
        type: 'scatter',
        x: [x - 3, x - 3, x + 3, x + 3, x - 3],
        y: [0, height, height, 0, 0],
        fill: 'tozerox',
        fillcolor: 'rgba(211, 211, 211, 0.25)',
        line: { color: 'black', width: 1 },
        mode: 'lines',
        showlegend: false,
        hovertemplate: `Runway heading: ${x}°<br><br>${names.join('<br>')}<extra></extra>`,
      },
      {
        type: 'scatter',
        x: [x, x],
        y: [height * 0.01, height * 0.99],
        line: { dash: 'dash', color: 'black' },
        mode: 'lines',
        showlegend: false,
        hoverinfo: 'skip',
      },
    ] as Data[]
  })
}

const buildChart = () => {
  const exceedance = props.winds.exceedance
  const traces: Data[] = exceedance.thresholds.map((threshold, i) => ({
    type: 'scatter',
    mode: 'lines',
    x: exceedance.directions,
    y: threshold.exceedance,
    name: THRESHOLD_LABELS[props.units][i],
    line: { color: THRESHOLD_COLORS[i] },
    hovertemplate: `RDC Class: ${threshold.rdcClass}<br>Runway direction: %{x}°<br>Exceedance frequency: %{y}%<extra></extra>`,
  }))

  const height = Math.max(
    ...exceedance.thresholds.flatMap(threshold => threshold.exceedance)
  )
  traces.push(...getRunwayTraces(height))

  $Plotly.newPlot(
    chartId,
    traces,
    {
      title: {
        text: `Runway direction vs. allowable crosswind exceedance<br><sub>${stationTitle(props.station)}</sub>`,
        font: { size: 24 },
      },
      height: 550,
      hovermode: 'closest',
      legend: { title: { text: 'Threshold' } },
      xaxis: {
        title: {
          text: 'Runway direction (degrees from true north)',
          font: { size: 18 },
        },
        showline: true,
        linecolor: 'black',
        fixedrange: true,
      },
      yaxis: {
        title: { text: 'Exceedance frequency (%)', font: { size: 18 } },
        rangemode: 'tozero',
        showline: true,
        linecolor: 'black',
        fixedrange: true,
      },
    },
    getConfig(`${props.station.sid}_crosswind_exceedance`)
  )
}

watch(() => [props.winds, props.units], buildChart)

onMounted(buildChart)

onUnmounted(() => purgeChart(chartId))
</script>

<template>
  <div :id="chartId" />
</template>
