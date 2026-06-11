<script setup lang="ts">
import type { Data, Layout, Config } from 'plotly.js-dist-min'
const mapStore = useMapStore()

const layers: MapLayer[] = [
  {
    id: 'permafrost_thickness_top_early',
    title: 'Active layer thickness, 2021–2039, GFDL CM3, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'crrel_gipl_outputs_nc',
    style: 'ardac_permafrost_top_earlycentury_era',
    legend: 'permafrost_top',
    coastline: true,
    default: true,
  },
  {
    id: 'permafrost_thickness_top_mid',
    title: 'Active layer thickness, 2040–2069, GFDL CM3, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'crrel_gipl_outputs_nc',
    style: 'ardac_permafrost_top_midcentury_era',
    legend: 'permafrost_top',
    coastline: true,
    default: true,
  },
  {
    id: 'permafrost_change_top',
    title: 'Change in active layer thickness',
    source: 'rasdaman',
    wmsLayerName: 'crrel_gipl_outputs_nc',
    style: 'permafrost_change_top',
    legend: 'permafrost_depth_delta',
    coastline: true,
    default: true,
  },
]

const legend: Record<string, LegendItem[]> = {
  permafrost_top: [
    { color: '#ffffcc', label: '&ge;0m, &lt;100m' },
    { color: '#a1dab4', label: '&ge;100m, &lt;200m' },
    { color: '#41b6c4', label: '&ge;200m, &lt;300m' },
    { color: '#2c7fb8', label: '&ge;300m, &lt;400m' },
    { color: '#253494', label: '&ge;400m' },
  ],
  permafrost_depth_delta: [
    { color: '#8c510a', label: '&lt;-4.1m' },
    { color: '#bf812d', label: '&ge;-4.1m, &lt;-2.1m' },
    { color: '#dfc27d', label: '&ge;-2.1m, &lt;-0.6m' },
    { color: '#f6e8c3', label: '&ge;-0.6m, &lt;-0.1m' },
    { color: '#f5f5f5', label: '0m' },
    { color: '#c7eae5', label: '&ge;-0.1m, &lt;0.1m' },
    { color: '#80cdc1', label: '&ge;0.1m, &lt;0.6m' },
    { color: '#35978f', label: '&ge;0.6m, &lt;2.1m' },
    { color: '#01665e', label: '&ge;2.1m' },
  ],
}

const { $Plotly } = useNuxtApp()
const dataStore = useDataStore()
const placesStore = usePlacesStore()

const endpoint = 'permafrost'
const latLng = computed<LatLngValue>(() => placesStore.latLng)
const apiData = computed<any>(() => dataStore.apiData[endpoint])

const mapId = 'permafrost_data_story'
mapStore.setLegendItems(mapId, legend)

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
      name: 'Not Permafrost',
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

  const communityName =
    (placesStore as any)?.communityName ||
    (placesStore as any)?.community?.name ||
    (placesStore as any)?.selectedCommunity?.name ||
    (placesStore as any)?.place?.name
  const locationLabel =
    communityName ||
    `${latLng.value.lat.toFixed(2)}, ${latLng.value.lng.toFixed(2)}`

  const layout: Partial<Layout> = {
    barmode: 'stack',
    bargap: 0,
    title: {
      text: `Permafrost Depth Through Time (${locationLabel})`,
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
    hovermode: false,
    legend: {
      traceorder: 'normal',
    },
  }

  let config = getConfig('permafrost-depth-over-time')

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
  } else {
    $Plotly.purge(chartId)
    dataStore.apiData[endpoint] = null
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
      <h3 class="title is-3">Permafrost isn't permanent!</h3>

      <p>Permafrost means different things to different people.</p>

      <p>
        Geoscientists may be interested in frozen ground at depths of up to
        hundreds of meters. Engineers concerned with building homes, septic
        systems, roads, and other infrastructure are more concerned with tens of
        meters depth. But for those traveling across the land for subsistence or
        recreational use, or for ecologists or farmers, the most important story
        occurs close to the surface, in the upper two meters.
      </p>
      <p>
        Soils near the surface may freeze in the winter, but also thaw in the
        summer. We refer to the maximum annual depth of thaw as the “active
        layer”.
      </p>
      <p>
        In some cases, the bottom of the active layer is the top of the
        permafrost. But in many cases, due to ongoing climate change, there is a
        layer of unfrozen ground, talik, where deeper permafrost still exists.
      </p>
      <p>
        With a warming climate, the thickness of the active layer is expected to
        increase over time, sometimes dramatically.
      </p>
      <p class="mb-6">
        Changes in the active layer have huge impacts on vegetation, because the
        active layer determines rooting depth and soil drainage. Some plants
        require deeper rooting depths and warmer, less saturated soils. Where
        the active layer is very shallow (less than half a meter), trees cannot
        grow and tundra or shrubs dominate. Where the top of the permafrost is
        half a meter to one meter, shrubs and black spruce tend to dominate.
        Where the active layer is deeper than one meter, a broader range of
        forest species can thrive.
      </p>

      <MapBlock :mapId="mapId" crs="EPSG:3338" class="mb-6">
        <template v-slot:layers>
          <MapLayer
            v-for="layer in layers"
            :mapId="mapId"
            :layer="layer"
            :key="layer.id"
            :default="layer.default"
          >
            <template v-slot:title>{{ layer.title }}</template>
          </MapLayer>
        </template>
      </MapBlock>

      <p>
        In this data story we explore the trends in active layer thickness over
        time at three locations, which represent three common ecological types
        in Alaska. We use data derived from the GIPL 2.0 model to construct the
        three plots below. You can also enter your own location to see active
        layer changes in your area.
      </p>

      <h4>Prudhoe Area, north slope tussock tundra (69.92, -148.53)</h4>

      <figure class="image">
        <img src="assets/images/permafrost_chart_prudhoe_area.png" />
      </figure>

      <h4>Fairbanks area, south of Tanana River (64.67, -147.79)</h4>

      <figure class="image">
        <img src="assets/images/permafrost_chart_fairbanks_area.png" />
      </figure>

      <h4>Anchorage Bicentennial Park (61.16, -149.76)</h4>

      <figure class="image">
        <img src="assets/images/permafrost_chart_anchorage.png" />
      </figure>

      <h3>Now choose your own location!</h3>

      <Gimme />
      <div v-if="latLng && apiData">
        <p>
          This chart shows the evolution of permafrost depth from
          {{ years[0] }} to {{ years[years.length - 1] }} using the
          {{ modelKey }} model under the {{ scenarioKey }} emissions scenario.
        </p>
      </div>
      <div :id="chartId" class="story-chart"></div>
    </div>
  </section>
</template>

<style scoped>
.story-chart {
  margin: 2rem 0;
}
</style>
