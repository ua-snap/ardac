<script lang="ts" setup>
import type { Config, Data, Layout } from 'plotly.js-dist-min'
import tananaZoneSouthBui from '~/assets/cffdrs_demo/tanana_zone_south_bui_2070_2099.json'
import tananaZoneSouthIsi from '~/assets/cffdrs_demo/tanana_zone_south_isi_2070_2099.json'
import tananaValleyWestBui from '~/assets/cffdrs_demo/tanana_valley_west_bui_2070_2099.json'
import tananaValleyWestIsi from '~/assets/cffdrs_demo/tanana_valley_west_isi_2070_2099.json'
import tananaValleyEastBui from '~/assets/cffdrs_demo/tanana_valley_east_bui_2070_2099.json'
import tananaValleyEastIsi from '~/assets/cffdrs_demo/tanana_valley_east_isi_2070_2099.json'

const { $Plotly } = useNuxtApp()

const PROJECTED_YEARS = '2070/2099'

const buiColor = '#2a78d6'
const isiColor = '#eb6834'

interface LocationOption {
  label: string
  bui: Record<string, number>
  isi: Record<string, number>
}

const locationOptions: LocationOption[] = [
  {
    label: 'Tanana Zone South',
    bui: tananaZoneSouthBui,
    isi: tananaZoneSouthIsi,
  },
  {
    label: 'Tanana Valley-West',
    bui: tananaValleyWestBui,
    isi: tananaValleyWestIsi,
  },
  {
    label: 'Tanana Valley-East',
    bui: tananaValleyEastBui,
    isi: tananaValleyEastIsi,
  },
]

const selectedLocation = ref<string>('Tanana Zone South')

const currentLocation = computed<LocationOption>(
  () =>
    locationOptions.find(o => o.label === selectedLocation.value) ??
    locationOptions[0]
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
// both below the given threshold's low-end values.
const daysUnderThreshold = (option: ThresholdOption): string[] => {
  const { bui, isi } = currentLocation.value
  const days = Object.keys(bui)
    .filter(day => day in isi)
    .sort()
  return days.filter(day => bui[day] < option.bui && isi[day] < option.isi)
}

// Count of days where both BUI and ISI fall below the selected threshold's
// low-end values.
const daysBelowThreshold = computed<number | null>(() => {
  const option = thresholdOptions.find(o => o.label === selectedThreshold.value)
  if (!option) {
    return null
  }

  return daysUnderThreshold(option).length
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

// Groups the days under the threshold into contiguous date ranges, so
// separate stretches get their own shaded rectangle instead of one spanning
// the gap between them.
const buildUnderThresholdRanges = (
  option: ThresholdOption
): { start: string; end: string }[] => {
  const ranges: { start: string; end: string }[] = []

  daysUnderThreshold(option).forEach(day => {
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

// Draws a dotted horizontal line for BUI and one for ISI at the low end of
// the selected fire danger threshold, each labeled with its value near the
// right edge of the plot, plus a faint shaded rectangle over the full plot
// area for each stretch of days where both indices are under threshold.
const buildThresholdOverlay = () => {
  const option = thresholdOptions.find(o => o.label === selectedThreshold.value)
  if (!option) {
    return { shapes: [], annotations: [] }
  }

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

  const line = (
    y: number,
    color: string
  ): NonNullable<Layout['shapes']>[number] => ({
    type: 'line',
    xref: 'paper',
    x0: 0,
    x1: 1,
    yref: 'y',
    y0: y,
    y1: y,
    line: { color, width: 2, dash: 'dot' },
  })

  const annotation = (
    y: number,
    color: string,
    text: string
  ): NonNullable<Layout['annotations']>[number] => ({
    xref: 'paper',
    x: 1,
    xanchor: 'right',
    yref: 'y',
    y,
    yshift: 10,
    xshift: -3,
    text,
    showarrow: false,
    font: { size: 11, color },
  })

  const underThresholdRects = buildUnderThresholdRanges(option).map(range =>
    rect(range.start, addDays(range.end, 1))
  )

  return {
    shapes: [
      ...underThresholdRects,
      line(option.bui, buiColor),
      line(option.isi, isiColor),
    ],
    annotations: [
      annotation(option.bui, buiColor, `${option.label} BUI`),
      annotation(option.isi, isiColor, `${option.label} ISI`),
    ],
  }
}

const buildChart = () => {
  const location = currentLocation.value
  const projectedBui = buildSeries(location.bui)
  const projectedIsi = buildSeries(location.isi)

  const projectedYearsLabel = PROJECTED_YEARS.replace('/', '–')
  const overlay = buildThresholdOverlay()

  $Plotly.newPlot(
    'chart',
    [
      {
        x: projectedBui.x,
        y: projectedBui.y,
        type: 'scatter',
        mode: 'lines',
        name: `Buildup Index (BUI), Projected (${projectedYearsLabel})`,
        line: { color: buiColor, width: 2 },
        hovertemplate: '%{y:.1f}<extra></extra>',
      } as Data,
      {
        x: projectedIsi.x,
        y: projectedIsi.y,
        type: 'scatter',
        mode: 'lines',
        name: `Initial Spread Index (ISI), Projected (${projectedYearsLabel})`,
        line: { color: isiColor, width: 2 },
        hovertemplate: '%{y:.2f}<extra></extra>',
      } as Data,
    ],
    {
      xaxis: {
        type: 'date',
        tickformat: '%b %-d',
        title: { text: 'Day of fire season' },
      },
      yaxis: { title: { text: 'Index value' } },
      hovermode: 'x unified',
      legend: {
        orientation: 'h',
        x: 0.5,
        xanchor: 'center',
        y: -0.22,
        yanchor: 'top',
        entrywidth: 300,
        entrywidthmode: 'pixels',
      },
      height: 520,
      margin: { t: 100, b: 90, r: 40 },
      title: {
        text:
          'Buildup Index (BUI) and Initial Spread Index (ISI): Projected<br />' +
          location.label,
        font: { size: 20 },
      },
      shapes: overlay.shapes,
      annotations: overlay.annotations,
    } as Partial<Layout>,
    {
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
      toImageButtonOptions: {
        filename: 'BUI and ISI for ' + location.label,
        format: 'png',
      },
    } as Partial<Config>
  )
}

window.addEventListener('resize', () => {
  $Plotly.purge('chart')
  buildChart()
})

watch(selectedThreshold, () => {
  const overlay = buildThresholdOverlay()
  $Plotly.relayout('chart', {
    shapes: overlay.shapes,
    annotations: overlay.annotations,
  })
})

watch(selectedLocation, () => {
  $Plotly.purge('chart')
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
        October) for the {{ selectedLocation }} zone. Values shown are 3-day
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
      <p v-if="daysBelowThreshold !== null" class="mb-3">
        <strong>{{ daysBelowThreshold }}</strong> days are below both the
        {{ selectedThreshold }} BUI and ISI thresholds.
      </p>
      <div id="chart"></div>
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
