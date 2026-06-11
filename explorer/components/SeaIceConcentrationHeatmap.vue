<script lang="ts" setup>
import type { Data, Layout } from 'plotly.js-dist-min'

const props = defineProps<{
  // Model name as it appears in the CMIP6 API response (e.g. "CESM2").
  model: string
  // SSP scenario used for the projected period 2015–2100 (e.g. "ssp370").
  scenario: string
  // The full CMIP6 siconc API response, keyed by model -> scenario -> "YYYY-MM".
  apiData: Record<string, any> | null
}>()

const { $Plotly } = useNuxtApp()

// Unique chart container id per model so multiple heatmaps can coexist.
const chartId = computed<string>(
  () => 'siconc-heatmap-' + props.model.replace(/[^a-zA-Z0-9]/g, '-')
)

const validChart = ref<boolean>(true)

// The year a decade begins. We average each calendar month across the ten
// years in the decade. 1950s through 2090s (2090–2099) covers 1950–2100.
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

// The last year of historical data; later years come from the SSP scenario.
const lastHistoricalYear = 2014

// Average the monthly siconc values across a single decade for one month.
const decadalAverage = (monthNum: string, startYear: number): number | null => {
  if (!props.apiData || !props.apiData[props.model]) {
    return null
  }

  const modelData = props.apiData[props.model]
  let sum = 0
  let count = 0

  for (let year = startYear; year <= startYear + 9; year++) {
    const scenarioKey =
      year <= lastHistoricalYear ? 'historical' : props.scenario
    const scenarioData = modelData[scenarioKey]
    if (!scenarioData) continue

    const entry = scenarioData[`${year}-${monthNum}`]
    const value = entry?.siconc
    if (value === null || value === undefined) continue

    sum += value
    count++
  }

  return count > 0 ? sum / count : null
}

const buildChart = () => {
  if (!props.apiData || !props.apiData[props.model]) {
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
    `<span style="font-size:14px">${props.model}, ${props.scenario.toUpperCase()} (81.5, -147)</span>`

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
  () => [props.apiData, props.scenario],
  async () => {
    purgeChart()
    validChart.value = true
    await nextTick()
    if (props.apiData) {
      buildChart()
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (props.apiData) {
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
