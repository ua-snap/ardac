<script lang="ts" setup>
import type { Data, Layout } from 'plotly.js-dist-min'

const props = defineProps<{
  // Model name as it appears in the CMIP6 API response (e.g. "CESM2").
  model: string
  // SSP scenario used for the projected period 2015–2100 (e.g. "ssp370").
  scenario: string
  // The full CMIP6 siconc API response, keyed by model -> scenario -> "YYYY-MM".
  apiData: Record<string, any> | null
  // Historical sea ice concentration data (1850-2025), keyed by "YYYY-MM" -> value
  historicalData: Record<string, number> | null
}>()

const { $Plotly } = useNuxtApp()

// Unique chart container id per model so multiple heatmaps can coexist.
const chartId = computed<string>(
  () => 'siconc-heatmap-' + props.model.replace(/[^a-zA-Z0-9]/g, '-')
)

const validChart = ref<boolean>(true)

// The year a decade begins. We average each calendar month across the ten
// years in the decade. 1950s through 2090s covers 1950–2099.
const decadeStarts: number[] = [
  1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 2030, 2040, 2050, 2060, 2070,
  2080, 2090,
]
const decadeLabels: string[] = decadeStarts.map(start => `${start}s`)

// Months arranged in "ice year" order: an ice year begins in September and
// runs through the following August. This is the top-to-bottom reading order
// we want on the chart.
const iceYearMonths: { num: string; label: string }[] = [
  { num: '09', label: 'Sep' },
  { num: '10', label: 'Oct' },
  { num: '11', label: 'Nov' },
  { num: '12', label: 'Dec' },
  { num: '01', label: 'Jan' },
  { num: '02', label: 'Feb' },
  { num: '03', label: 'Mar' },
  { num: '04', label: 'Apr' },
  { num: '05', label: 'May' },
  { num: '06', label: 'Jun' },
  { num: '07', label: 'Jul' },
  { num: '08', label: 'Aug' },
]

// The last year of historical observations; later years come from model projections
const lastHistoricalYear = 2025

// Average the monthly siconc values across a single decade for one month.
const decadalAverage = (monthNum: string, startYear: number): number | null => {
  let sum = 0
  let count = 0

  // For the 2020s decade, only use historical data (2020-2025)
  // to avoid mixing observational and model data
  const decadeEndYear = startYear + 9
  const endYear =
    startYear <= lastHistoricalYear && decadeEndYear > lastHistoricalYear
      ? lastHistoricalYear
      : decadeEndYear

  for (let year = startYear; year <= endYear; year++) {
    let value: number | null | undefined = null

    // Use historical observations for years 1950-2025
    if (year <= lastHistoricalYear && props.historicalData) {
      const key = `${year}-${monthNum}`
      value = props.historicalData[key]
    }
    // Use CMIP6 model data for years after 2025
    else if (props.apiData && props.apiData[props.model]) {
      const modelData = props.apiData[props.model]
      const scenarioKey = year <= 2014 ? 'historical' : props.scenario
      const scenarioData = modelData[scenarioKey]
      if (scenarioData) {
        const entry = scenarioData[`${year}-${monthNum}`]
        value = entry?.siconc
      }
    }

    if (value !== null && value !== undefined) {
      sum += value
      count++
    }
  }

  return count > 0 ? sum / count : null
}

const buildChart = () => {
  // Need at least one data source
  if (
    !props.historicalData &&
    (!props.apiData || !props.apiData[props.model])
  ) {
    validChart.value = false
    return
  }

  // Plotly draws the first y entry at the bottom of the heatmap, so reverse the
  // ice-year order to place September at the top and August at the bottom.
  const monthsBottomToTop = [...iceYearMonths].reverse()

  // z is a 2D array indexed [row (month)][column (decade)].
  const z: (number | null)[][] = monthsBottomToTop.map(month =>
    decadeStarts.map(start => decadalAverage(month.num, start))
  )

  // If every cell is empty, there is nothing to plot.
  const hasData = z.some(row => row.some(cell => cell !== null))
  if (!hasData) {
    validChart.value = false
    return
  }

  const plotData: Data[] = [
    {
      x: decadeLabels,
      y: monthsBottomToTop.map(month => month.label),
      z: z,
      type: 'heatmap',
      // Sea ice concentration: darker blue = open water (low %),
      // lighter yellow/green = near-complete ice cover (high %).
      // Uses YlGnBu colorscale to match other sea ice visualizations.
      colorscale: 'YlGnBu',
      zmin: 0,
      zmax: 100,
      xgap: 1,
      ygap: 1,
      colorbar: {
        title: 'Sea ice concentration (%)',
        titleside: 'right',
        ticksuffix: '%',
      },
      hovertemplate:
        '%{y} (%{x})<br>Sea ice concentration: %{z:.0f}%<extra></extra>',
      hoverongaps: false,
    } as Data,
  ]

  const titleText =
    'Decadal Mean Sea Ice Concentration<br>' +
    `<span style="font-size:14px">Historical Obs (1950-2025) + ${props.model} ${props.scenario.toUpperCase()} (2026-2100) at 71°N, 143°W</span>`

  // Find the index where historical data ends and projections begin
  // Historical ends in 2025 (in the 2020s), projections start in 2026 (2030s)
  const historicalEndIndex = decadeStarts.findIndex(start => start === 2020)

  const layout: Partial<Layout> = {
    title: {
      text: titleText,
      font: { size: 20 },
    },
    xaxis: {
      title: { text: 'Decade', font: { size: 16 } },
      type: 'category',
      showgrid: false,
    },
    yaxis: {
      title: { text: 'Month (ice year)', font: { size: 16 } },
      type: 'category',
      showgrid: false,
    },
    shapes: [
      {
        type: 'line',
        xref: 'x',
        yref: 'paper',
        x0: historicalEndIndex + 0.5,
        y0: 0,
        x1: historicalEndIndex + 0.5,
        y1: 1,
        line: {
          color: 'black',
          width: 2,
        },
      },
    ],
    margin: { t: 70 },
  }

  const config = getConfig(`siconc-heatmap-${props.model}`)

  $Plotly.newPlot(chartId.value, plotData, layout, config)
}

const purgeChart = () => {
  try {
    const element = document.getElementById(chartId.value)
    if (element && element.hasChildNodes()) {
      $Plotly.purge(chartId.value)
    }
  } catch (error) {
    console.debug(`Chart purge skipped for ${chartId.value}:`, error)
  }
}

watch(
  () => [props.apiData, props.historicalData, props.model, props.scenario],
  async () => {
    purgeChart()
    validChart.value = true
    await nextTick()
    if (props.historicalData || props.apiData) {
      buildChart()
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (props.historicalData || props.apiData) {
    nextTick(() => buildChart())
  }
})

onUnmounted(() => {
  purgeChart()
})
</script>

<template>
  <div>
    <div :id="chartId" v-if="validChart"></div>
    <div v-else class="notification is-warning is-light">
      No sea ice concentration data is available for {{ model }} under
      {{ scenario.toUpperCase() }}.
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
