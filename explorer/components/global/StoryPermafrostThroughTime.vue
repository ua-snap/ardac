<script setup lang="ts">
import type { Data, Layout, Config } from 'plotly.js-dist-min'

const { $Plotly } = useNuxtApp()
const dataStore = useDataStore()
const placesStore = usePlacesStore()

const endpoint = 'permafrost'
const latLng = computed<LatLngValue>(() => placesStore.latLng)
const apiData = computed<any>(() => dataStore.apiData[endpoint])

// Default selections
let modelKey = '5ModelAvg'
let scenarioKey = 'RCP 8.5'

let years: number[] = []
let permafrosttopSeries: number[] = []
let permafrostbaseSeries: number[] = []

const chartId = 'top-base-chart'

const fetchPermafrostData = async () => {
  if (!latLng.value) {
    console.log('No location selected yet')
    return
  }

  const url = `https://earthmaps.io/permafrost/point/gipl/${latLng.value.lat}/${latLng.value.lng}`

  try {
    console.log('Fetching data from:', url)
    dataStore.apiData[endpoint] = null
    dataStore.dataErrors[endpoint] = false

    let payload = await $fetch<any>(url)

    // Validate the data structure
    if (!payload || !payload[modelKey]) {
      throw new Error('Unexpected data structure from Earthmaps API')
    }

    // Store in dataStore
    dataStore.apiData[endpoint] = payload
    dataStore.dataErrors[endpoint] = false
    console.log('Data stored in dataStore')
  } catch (error) {
    console.error('Error fetching permafrost data:', error)
    dataStore.apiData[endpoint] = null
    dataStore.dataErrors[endpoint] = true
    throw error
  }
}

const extractTimeSeriesData = () => {
  if (!apiData.value || !apiData.value[modelKey]) {
    return
  }

  let modelSeries = apiData.value[modelKey] as Record<
    string,
    Record<string, any>
  >

  // Clear and populate the outer scope arrays
  years = []
  permafrosttopSeries = []
  permafrostbaseSeries = []

  // Extract yearly data for the selected scenario
  Object.keys(modelSeries)
    .map(year => Number(year))
    .filter(year => Number.isFinite(year))
    .sort((a, b) => a - b)
    .forEach(year => {
      let values = modelSeries[String(year)]?.[scenarioKey]
      let top = Number(values?.permafrosttop)
      let base = Number(values?.permafrostbase)

      if (Number.isFinite(top) && Number.isFinite(base)) {
        years.push(year)

        if (top == 0 && base == 0) {
          permafrosttopSeries.push(2)
        } else {
          permafrosttopSeries.push(top)
        }
        permafrostbaseSeries.push(base)
      }
    })

  console.log('Data extracted:', years.length, 'years')
}

const buildChart = () => {
  if (!latLng.value) {
    return
  }

  console.log('Building chart with data:')
  console.log('Years:', years)
  console.log('Permafrost Top Series:', permafrosttopSeries)
  console.log('Permafrost Base Series:', permafrostbaseSeries)

  if (years.length === 0) {
    console.error('No data available to build chart')
    return
  }

  // Calculate the thickness of the permafrost layer (base - top)
  const thicknesses = years.map((_, i) =>
    Math.max(permafrostbaseSeries[i] - permafrosttopSeries[i], 0)
  )

  // Create stacked bar chart with two traces:
  // 1. Green trace showing active layer (0 to permafrosttop)
  // 2. Blue trace showing the permafrost layer thickness
  const traces: Data[] = [
    {
      type: 'bar',
      name: 'Active Layer',
      x: years,
      y: permafrosttopSeries,
      marker: {
        color: '#2ca02c',
      },
      hovertemplate:
        '<b>Year %{x}</b><br>' +
        'Active layer depth: %{y:.2f} m<extra></extra>',
    },
    {
      type: 'bar',
      name: 'Permafrost Layer',
      x: years,
      y: thicknesses,
      marker: {
        color: '#1f78b4',
      },
      customdata: years.map((year, i) => [
        permafrosttopSeries[i],
        permafrostbaseSeries[i],
        thicknesses[i],
      ]),
      hovertemplate:
        '<b>Year %{x}</b><br>' +
        'Top depth: %{customdata[0]:.2f} m<br>' +
        'Base depth: %{customdata[1]:.2f} m<br>' +
        'Thickness: %{customdata[2]:.2f} m<extra></extra>',
    },
  ]

  const layout: Partial<Layout> = {
    barmode: 'stack',
    bargap: 0,
    title: {
      text: `Permafrost Depth Through Time<br><sub>${modelKey}, ${scenarioKey}</sub>`,
      font: { size: 16 },
    },
    xaxis: {
      title: 'Year',
      tickmode: 'linear',
      dtick: 10,
    },
    yaxis: {
      title: 'Depth (meters)',
      autorange: false,
      range: [2, 0],
    },
    margin: {
      t: 70,
      l: 65,
      r: 30,
      b: 60,
    },
    hovermode: 'closest',
  }

  const config: Partial<Config> = {
    responsive: true,
    displaylogo: false,
    toImageButtonOptions: {
      format: 'png',
      filename: 'permafrost-depth-through-time',
      height: 600,
      width: 1200,
    },
  }

  $Plotly.newPlot(chartId, traces, layout, config)
}

watch(apiData, () => {
  if (apiData.value) {
    extractTimeSeriesData()
    buildChart()
  }
})

watch(latLng, async () => {
  if (latLng.value) {
    $Plotly.purge(chartId)
    dataStore.apiData[endpoint] = null
    await fetchPermafrostData()
  }
})

onUnmounted(() => {
  try {
    dataStore.dataErrors[endpoint] = false
    $Plotly.purge(chartId)
  } catch {
    // Chart may not exist
  }
  dataStore.apiData[endpoint] = null
})
</script>

<template>
  <section class="section">
    <div class="content clamp is-size-5">
      <h3 class="title is-3">Permafrost Depth Through Time</h3>

      <Gimme />

      <div v-if="latLng && apiData">
        <p>
          This chart shows the evolution of permafrost depth from
          {{ years[0] }} to {{ years[years.length - 1] }} using the
          {{ modelKey }} model under the {{ scenarioKey }} emissions scenario
          for {{ latLng.lat }}, {{ latLng.lng }}.
        </p>
      </div>
    </div>
    <div :id="chartId" class="story-chart"></div>
  </section>
</template>

<style scoped>
.story-chart {
  min-height: 500px;
  margin: 2rem 0;
}
</style>
