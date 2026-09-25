<script lang="ts" setup>
import type { Config, Data, Layout } from 'plotly.js-dist-min'
import tananaZoneSouthBuiProjected from '~/assets/cffdrs_demo/tanana_zone_south_bui_2040_2069.json'
import tananaZoneSouthIsiProjected from '~/assets/cffdrs_demo/tanana_zone_south_isi_2040_2069.json'
import tananaZoneSouthBuiHistorical from '~/assets/cffdrs_demo/tanana_zone_south_bui_1980_2020.json'
import tananaZoneSouthIsiHistorical from '~/assets/cffdrs_demo/tanana_zone_south_isi_1980_2020.json'
import tananaValleyWestBuiProjected from '~/assets/cffdrs_demo/tanana_valley_west_bui_2040_2069.json'
import tananaValleyWestIsiProjected from '~/assets/cffdrs_demo/tanana_valley_west_isi_2040_2069.json'
import tananaValleyWestBuiHistorical from '~/assets/cffdrs_demo/tanana_valley_west_bui_1980_2020.json'
import tananaValleyWestIsiHistorical from '~/assets/cffdrs_demo/tanana_valley_west_isi_1980_2020.json'
import tananaValleyEastBuiProjected from '~/assets/cffdrs_demo/tanana_valley_east_bui_2040_2069.json'
import tananaValleyEastIsiProjected from '~/assets/cffdrs_demo/tanana_valley_east_isi_2040_2069.json'
import tananaValleyEastBuiHistorical from '~/assets/cffdrs_demo/tanana_valley_east_bui_1980_2020.json'
import tananaValleyEastIsiHistorical from '~/assets/cffdrs_demo/tanana_valley_east_isi_1980_2020.json'
import bristolBayBuiProjected from '~/assets/cffdrs_demo/bristol_bay_and_ak_peninsula_bui_2040_2069.json'
import bristolBayIsiProjected from '~/assets/cffdrs_demo/bristol_bay_and_ak_peninsula_isi_2040_2069.json'
import bristolBayBuiHistorical from '~/assets/cffdrs_demo/bristol_bay_and_ak_peninsula_bui_1980_2020.json'
import bristolBayIsiHistorical from '~/assets/cffdrs_demo/bristol_bay_and_ak_peninsula_isi_1980_2020.json'
import middleYukonBuiProjected from '~/assets/cffdrs_demo/middle_yukon_bui_2040_2069.json'
import middleYukonIsiProjected from '~/assets/cffdrs_demo/middle_yukon_isi_2040_2069.json'
import middleYukonBuiHistorical from '~/assets/cffdrs_demo/middle_yukon_bui_1980_2020.json'
import middleYukonIsiHistorical from '~/assets/cffdrs_demo/middle_yukon_isi_1980_2020.json'
import lowerYukonBuiProjected from '~/assets/cffdrs_demo/lower_yukon_bui_2040_2069.json'
import lowerYukonIsiProjected from '~/assets/cffdrs_demo/lower_yukon_isi_2040_2069.json'
import lowerYukonBuiHistorical from '~/assets/cffdrs_demo/lower_yukon_bui_1980_2020.json'
import lowerYukonIsiHistorical from '~/assets/cffdrs_demo/lower_yukon_isi_1980_2020.json'
import kuskokwimValleyBuiProjected from '~/assets/cffdrs_demo/kuskokwim_valley_bui_2040_2069.json'
import kuskokwimValleyIsiProjected from '~/assets/cffdrs_demo/kuskokwim_valley_isi_2040_2069.json'
import kuskokwimValleyBuiHistorical from '~/assets/cffdrs_demo/kuskokwim_valley_bui_1980_2020.json'
import kuskokwimValleyIsiHistorical from '~/assets/cffdrs_demo/kuskokwim_valley_isi_1980_2020.json'
import tananaZoneNorthBuiProjected from '~/assets/cffdrs_demo/tanana_zone_north_bui_2040_2069.json'
import tananaZoneNorthIsiProjected from '~/assets/cffdrs_demo/tanana_zone_north_isi_2040_2069.json'
import tananaZoneNorthBuiHistorical from '~/assets/cffdrs_demo/tanana_zone_north_bui_1980_2020.json'
import tananaZoneNorthIsiHistorical from '~/assets/cffdrs_demo/tanana_zone_north_isi_1980_2020.json'
import upperYukonValleyBuiProjected from '~/assets/cffdrs_demo/upper_yukon_valley_bui_2040_2069.json'
import upperYukonValleyIsiProjected from '~/assets/cffdrs_demo/upper_yukon_valley_isi_2040_2069.json'
import upperYukonValleyBuiHistorical from '~/assets/cffdrs_demo/upper_yukon_valley_bui_1980_2020.json'
import upperYukonValleyIsiHistorical from '~/assets/cffdrs_demo/upper_yukon_valley_isi_1980_2020.json'
import chenaRiverBuiProjected from '~/assets/cffdrs_demo/huc8_19080306_bui_2040_2069.json'
import chenaRiverIsiProjected from '~/assets/cffdrs_demo/huc8_19080306_isi_2040_2069.json'
import chenaRiverBuiHistorical from '~/assets/cffdrs_demo/huc8_19080306_bui_1980_2020.json'
import chenaRiverIsiHistorical from '~/assets/cffdrs_demo/huc8_19080306_isi_1980_2020.json'
import fairbanksBuiProjected from '~/assets/cffdrs_demo/fairbanks_bui_2040_2069.json'
import fairbanksIsiProjected from '~/assets/cffdrs_demo/fairbanks_isi_2040_2069.json'
import fairbanksBuiHistorical from '~/assets/cffdrs_demo/fairbanks_bui_1980_2020.json'
import fairbanksIsiHistorical from '~/assets/cffdrs_demo/fairbanks_isi_1980_2020.json'
import mcgrathBuiProjected from '~/assets/cffdrs_demo/mcgrath_bui_2040_2069.json'
import mcgrathIsiProjected from '~/assets/cffdrs_demo/mcgrath_isi_2040_2069.json'
import mcgrathBuiHistorical from '~/assets/cffdrs_demo/mcgrath_bui_1980_2020.json'
import mcgrathIsiHistorical from '~/assets/cffdrs_demo/mcgrath_isi_1980_2020.json'
import stonyRiverBuiProjected from '~/assets/cffdrs_demo/huc8_19030405_bui_2040_2069.json'
import stonyRiverIsiProjected from '~/assets/cffdrs_demo/huc8_19030405_isi_2040_2069.json'
import stonyRiverBuiHistorical from '~/assets/cffdrs_demo/huc8_19030405_bui_1980_2020.json'
import stonyRiverIsiHistorical from '~/assets/cffdrs_demo/huc8_19030405_isi_1980_2020.json'

const { $Plotly } = useNuxtApp()

const PROJECTED_YEARS = '2070/2099'

const buiColor = '#2a78d6'
const isiColor = '#eb6834'
const buiHistoricalColor = 'rgba(42, 120, 214, 0.4)'
const isiHistoricalColor = 'rgba(235, 104, 52, 0.4)'

interface LocationOption {
  label: string
  bui: Record<string, number>
  isi: Record<string, number>
  projectedYears?: string
  buiHistorical?: Record<string, number>
  isiHistorical?: Record<string, number>
  historicalYears?: string
}

// Every area fetched with the newer cffdrs_demo.py (which produces a
// Modeled Baseline period alongside a Mid-Century projection) shares the
// same two period labels, so this fills those in for each one. The area
// type (plus, for a HUC-8, its number) is appended to the label so the
// dropdown shows what kind of boundary each option uses.
const areaLocation = (
  label: string,
  areaType: string,
  buiProjected: Record<string, number>,
  isiProjected: Record<string, number>,
  buiHistorical: Record<string, number>,
  isiHistorical: Record<string, number>
): LocationOption => ({
  label: `${label} (${areaType})`,
  bui: buiProjected,
  isi: isiProjected,
  projectedYears: '2040/2069',
  buiHistorical,
  isiHistorical,
  historicalYears: '1980/2020',
})

const locationOptions: LocationOption[] = [
  areaLocation(
    'Tanana Zone-South',
    'PSA',
    tananaZoneSouthBuiProjected,
    tananaZoneSouthIsiProjected,
    tananaZoneSouthBuiHistorical,
    tananaZoneSouthIsiHistorical
  ),
  areaLocation(
    'Tanana Valley-West',
    'PSA',
    tananaValleyWestBuiProjected,
    tananaValleyWestIsiProjected,
    tananaValleyWestBuiHistorical,
    tananaValleyWestIsiHistorical
  ),
  areaLocation(
    'Tanana Valley-East',
    'PSA',
    tananaValleyEastBuiProjected,
    tananaValleyEastIsiProjected,
    tananaValleyEastBuiHistorical,
    tananaValleyEastIsiHistorical
  ),
  areaLocation(
    'Bristol Bay and AK Peninsula',
    'PSA',
    bristolBayBuiProjected,
    bristolBayIsiProjected,
    bristolBayBuiHistorical,
    bristolBayIsiHistorical
  ),
  areaLocation(
    'Middle Yukon',
    'PSA',
    middleYukonBuiProjected,
    middleYukonIsiProjected,
    middleYukonBuiHistorical,
    middleYukonIsiHistorical
  ),
  areaLocation(
    'Lower Yukon',
    'PSA',
    lowerYukonBuiProjected,
    lowerYukonIsiProjected,
    lowerYukonBuiHistorical,
    lowerYukonIsiHistorical
  ),
  areaLocation(
    'Kuskokwim Valley',
    'PSA',
    kuskokwimValleyBuiProjected,
    kuskokwimValleyIsiProjected,
    kuskokwimValleyBuiHistorical,
    kuskokwimValleyIsiHistorical
  ),
  areaLocation(
    'Tanana Zone-North',
    'PSA',
    tananaZoneNorthBuiProjected,
    tananaZoneNorthIsiProjected,
    tananaZoneNorthBuiHistorical,
    tananaZoneNorthIsiHistorical
  ),
  areaLocation(
    'Upper Yukon Valley',
    'PSA',
    upperYukonValleyBuiProjected,
    upperYukonValleyIsiProjected,
    upperYukonValleyBuiHistorical,
    upperYukonValleyIsiHistorical
  ),
  areaLocation(
    'Chena River',
    'HUC-8 19080306',
    chenaRiverBuiProjected,
    chenaRiverIsiProjected,
    chenaRiverBuiHistorical,
    chenaRiverIsiHistorical
  ),
  areaLocation(
    'Fairbanks',
    'Community',
    fairbanksBuiProjected,
    fairbanksIsiProjected,
    fairbanksBuiHistorical,
    fairbanksIsiHistorical
  ),
  areaLocation(
    'McGrath',
    'Community',
    mcgrathBuiProjected,
    mcgrathIsiProjected,
    mcgrathBuiHistorical,
    mcgrathIsiHistorical
  ),
  areaLocation(
    'Stony River',
    'HUC-8 19030405',
    stonyRiverBuiProjected,
    stonyRiverIsiProjected,
    stonyRiverBuiHistorical,
    stonyRiverIsiHistorical
  ),
].sort((a, b) => a.label.localeCompare(b.label))

const selectedLocation = ref<string>('Tanana Zone-South (PSA)')

const currentLocation = computed<LocationOption>(
  () =>
    locationOptions.find(o => o.label === selectedLocation.value) ??
    locationOptions[0]
)

// The location's name without its trailing "(PSA)"/"(HUC-8)" tag, for use
// in prose (the dropdown itself shows the full label with the tag).
const currentLocationName = computed<string>(() =>
  currentLocation.value.label.replace(/\s*\([^)]*\)$/, '')
)

// Low-end value of each fire danger threshold band, for BUI and ISI
// respectively (matching the reference severity table).
interface ThresholdOption {
  label: string
  bui: number
  isi: number
}

const thresholdOptions: ThresholdOption[] = [
  { label: 'Low', bui: 0, isi: 0 },
  { label: 'Moderate', bui: 40, isi: 2 },
  { label: 'High', bui: 60, isi: 5 },
  { label: 'Very High', bui: 90, isi: 8 },
  { label: 'Extreme', bui: 110, isi: 11 },
]

const selectedThreshold = ref<string>('Moderate')

// Days (sorted, "MM-DD") present in both data sets where BUI and ISI are
// both at or above the given threshold's low-end values.
const daysAboveThreshold = (option: ThresholdOption): string[] => {
  const { bui, isi } = currentLocation.value
  const days = Object.keys(bui)
    .filter(day => day in isi)
    .sort()
  return days.filter(day => bui[day] >= option.bui && isi[day] >= option.isi)
}

// Count of days where both BUI and ISI are at or above the selected
// threshold's low-end values.
const daysAboveThresholdCount = computed<number | null>(() => {
  const option = thresholdOptions.find(o => o.label === selectedThreshold.value)
  if (!option) {
    return null
  }

  return daysAboveThreshold(option).length
})

interface DaySeries {
  x: string[]
  y: number[]
}

// Builds a day-of-year series from the demo data's { "04-01": value, ... }
// shape, anchoring every day to the same placeholder year so Plotly can treat
// the x axis as dates and format them as "Apr 01" etc.
const buildSeries = (dayData: Record<string, number>): DaySeries => {
  const days = Object.keys(dayData).sort()
  return {
    x: days.map(day => `2001-${day}`),
    y: days.map(day => dayData[day]),
  }
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

const addDays = (isoDate: string, days: number): string => {
  const date = new Date(isoDate)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

// Groups the days above the threshold into contiguous date ranges, so
// separate stretches get their own shaded rectangle instead of one spanning
// the gap between them.
const buildAboveThresholdRanges = (
  option: ThresholdOption
): { start: string; end: string }[] => {
  const ranges: { start: string; end: string }[] = []

  daysAboveThreshold(option).forEach(day => {
    const date = `2001-${day}`
    const previous = ranges[ranges.length - 1]
    if (
      previous &&
      new Date(date).getTime() - new Date(previous.end).getTime() === MS_PER_DAY
    ) {
      previous.end = date
    } else {
      ranges.push({ start: date, end: date })
    }
  })

  return ranges
}

// Faint shaded rectangle over the full plot area for each stretch of days
// where both indices are at or above the selected threshold. Shared by both
// the BUI and ISI plots, since the underlying day range is the same.
const buildAboveThresholdRects = (
  option: ThresholdOption
): NonNullable<Layout['shapes']> => {
  const rect = (
    x0: string,
    x1: string
  ): NonNullable<Layout['shapes']>[number] => ({
    type: 'rect',
    xref: 'x',
    x0,
    x1,
    yref: 'paper',
    y0: 0,
    y1: 1,
    fillcolor: 'rgba(120, 120, 120, 0.1)',
    line: { width: 0 },
    layer: 'below',
  })

  return buildAboveThresholdRanges(option).map(range =>
    rect(range.start, addDays(range.end, 1))
  )
}

// Draws a dotted horizontal line at the low end of the given index's
// selected fire danger threshold, labeled with the threshold's name near
// the right edge of the plot, plus the shared above-threshold shading.
const buildIndexOverlay = (
  option: ThresholdOption,
  value: number,
  color: string
) => {
  const line: NonNullable<Layout['shapes']>[number] = {
    type: 'line',
    xref: 'paper',
    x0: 0,
    x1: 1,
    yref: 'y',
    y0: value,
    y1: value,
    line: { color, width: 2, dash: 'dot' },
  }

  const annotation: NonNullable<Layout['annotations']>[number] = {
    xref: 'paper',
    x: 1,
    xanchor: 'right',
    yref: 'y',
    y: value,
    yshift: 10,
    xshift: -3,
    text: option.label + ' Fire Danger',
    showarrow: false,
    font: { size: 11, color },
  }

  return {
    shapes: [...buildAboveThresholdRects(option), line],
    annotations: [annotation],
  }
}

const plotConfig = (filename: string): Partial<Config> => ({
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
  toImageButtonOptions: { filename, format: 'png' },
})

// Trace + legend name for the given index's projected series, plus its
// historical series (if the location has one) drawn first in a fainter
// shade of the same color so the projected line stays visually primary.
const buildIndexTraces = (
  indexLabel: string,
  projected: DaySeries,
  projectedYearsLabel: string,
  color: string,
  historical: DaySeries | null,
  historicalYearsLabel: string,
  historicalColor: string,
  hovertemplate: string
): Data[] => {
  const traces: Data[] = []

  if (historical) {
    traces.push({
      x: historical.x,
      y: historical.y,
      type: 'scatter',
      mode: 'lines',
      name: `${indexLabel}, Modeled Baseline (${historicalYearsLabel})`,
      line: { color: historicalColor, width: 2 },
      hovertemplate,
    } as Data)
  }

  traces.push({
    x: projected.x,
    y: projected.y,
    type: 'scatter',
    mode: 'lines',
    name: `${indexLabel}, Projected (${projectedYearsLabel})`,
    line: { color, width: 2 },
    hovertemplate,
  } as Data)

  return traces
}

const buildChart = () => {
  const location = currentLocation.value
  const projectedBui = buildSeries(location.bui)
  const projectedIsi = buildSeries(location.isi)
  const historicalBui = location.buiHistorical ? buildSeries(location.buiHistorical) : null
  const historicalIsi = location.isiHistorical ? buildSeries(location.isiHistorical) : null

  const projectedYearsLabel = (location.projectedYears ?? PROJECTED_YEARS).replace('/', '–')
  const historicalYearsLabel = (location.historicalYears ?? '').replace('/', '–')
  const option = thresholdOptions.find(o => o.label === selectedThreshold.value)
  const overlayBui = option
    ? buildIndexOverlay(option, option.bui, buiColor)
    : { shapes: [], annotations: [] }
  const overlayIsi = option
    ? buildIndexOverlay(option, option.isi, isiColor)
    : { shapes: [], annotations: [] }

  // With only one series, the title already names the period; with both, the
  // legend distinguishes them so the title just names the index and location.
  const buiTitle = historicalBui
    ? `Buildup Index (BUI)<br />${location.label}`
    : `Buildup Index (BUI): Projected (${projectedYearsLabel})<br />${location.label}`
  const isiTitle = historicalIsi
    ? `Initial Spread Index (ISI)<br />${location.label}`
    : `Initial Spread Index (ISI): Projected (${projectedYearsLabel})<br />${location.label}`

  const legend = {
    orientation: 'h',
    x: 0.5,
    xanchor: 'center',
    y: -0.24,
    yanchor: 'top',
    font: { size: 11 },
    entrywidth: 330,
    entrywidthmode: 'pixels',
  }
  const LEGEND_MARGIN = 40

  $Plotly.newPlot(
    'chart-bui',
    buildIndexTraces(
      'Buildup Index (BUI)',
      projectedBui,
      projectedYearsLabel,
      buiColor,
      historicalBui,
      historicalYearsLabel,
      buiHistoricalColor,
      '%{y:.1f}<extra></extra>'
    ),
    {
      xaxis: {
        type: 'date',
        tickformat: '%b %-d',
        title: { text: 'Day of fire season' },
      },
      yaxis: {
        title: { text: 'Buildup Index (BUI)' },
        rangemode: 'tozero',
      },
      hovermode: 'x unified',
      showlegend: !!historicalBui,
      legend,
      height: historicalBui ? 453 + LEGEND_MARGIN : 453,
      margin: { t: 75, b: historicalBui ? 70 + LEGEND_MARGIN : 70, r: 40 },
      title: {
        text: buiTitle,
        font: { size: 18 },
        pad: { b: 15 },
      },
      shapes: overlayBui.shapes,
      annotations: overlayBui.annotations,
    } as Partial<Layout>,
    plotConfig('BUI for ' + location.label)
  )

  $Plotly.newPlot(
    'chart-isi',
    buildIndexTraces(
      'Initial Spread Index (ISI)',
      projectedIsi,
      projectedYearsLabel,
      isiColor,
      historicalIsi,
      historicalYearsLabel,
      isiHistoricalColor,
      '%{y:.2f}<extra></extra>'
    ),
    {
      xaxis: {
        type: 'date',
        tickformat: '%b %-d',
        title: { text: 'Day of fire season' },
      },
      yaxis: {
        title: { text: 'Initial Spread Index (ISI)' },
        rangemode: 'tozero',
      },
      hovermode: 'x unified',
      showlegend: !!historicalIsi,
      legend,
      height: historicalIsi ? 443 + LEGEND_MARGIN : 443,
      margin: { t: 75, b: historicalIsi ? 70 + LEGEND_MARGIN : 70, r: 40 },
      title: {
        text: isiTitle,
        font: { size: 18 },
        pad: { b: 15 },
      },
      shapes: overlayIsi.shapes,
      annotations: overlayIsi.annotations,
    } as Partial<Layout>,
    plotConfig('ISI for ' + location.label)
  )
}

window.addEventListener('resize', () => {
  $Plotly.purge('chart-bui')
  $Plotly.purge('chart-isi')
  buildChart()
})

watch(selectedThreshold, () => {
  const option = thresholdOptions.find(o => o.label === selectedThreshold.value)
  if (!option) {
    return
  }
  const overlayBui = buildIndexOverlay(option, option.bui, buiColor)
  const overlayIsi = buildIndexOverlay(option, option.isi, isiColor)
  $Plotly.relayout('chart-bui', {
    shapes: overlayBui.shapes,
    annotations: overlayBui.annotations,
  })
  $Plotly.relayout('chart-isi', {
    shapes: overlayIsi.shapes,
    annotations: overlayIsi.annotations,
  })
})

watch(selectedLocation, () => {
  $Plotly.purge('chart-bui')
  $Plotly.purge('chart-isi')
  buildChart()
})

onMounted(() => {
  buildChart()
})
</script>

<template>
  <section class="section">
    <div class="content clamp center is-size-5">
      <h3 class="title is-3">Fire Buildup and Spread</h3>
      <p>
        This is a demo of the Buildup Index (BUI) and Initial Spread Index (ISI)
        &mdash; two components of the Canadian Forest Fire Weather Index System
        &mdash; projected to change across the fire season (April through
        October) for the {{ currentLocationName }} zone. Values shown are 3-day
        rolling averages.
      </p>
      <p>
        BUI is a measure of how much fuel &mdash; like dead leaves, moss, and
        soil &mdash; is dry enough to burn. Higher values mean fires can burn
        hotter and are harder to put out. ISI is a measure of how fast a fire is
        likely to spread, based on wind and the dryness of surface fuels. Higher
        values mean a fire can spread more quickly, leaving less time to
        respond.
      </p>
      <div class="parameter mb-5">
        <label for="location" class="label">Location</label>
        <div class="select mr-3">
          <select id="location" v-model="selectedLocation">
            <option
              v-for="option in locationOptions"
              :key="option.label"
              :value="option.label"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
      <div class="parameter mb-5">
        <label for="threshold" class="label">Fire Danger Threshold</label>
        <div class="select mr-3">
          <select id="threshold" v-model="selectedThreshold">
            <option
              v-for="option in thresholdOptions"
              :key="option.label"
              :value="option.label"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
      <p v-if="daysAboveThresholdCount !== null" class="mb-3">
        <strong>{{ daysAboveThresholdCount }}</strong> days are above both the
        {{ selectedThreshold }} BUI and ISI thresholds.
      </p>
      <div id="chart-bui" class="mb-4"></div>
      <div id="chart-isi"></div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.parameter {
  display: inline-block;
  select {
    background-color: $white-lighter;
  }
}
</style>
