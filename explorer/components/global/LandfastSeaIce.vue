<script lang="ts" setup>
const endpoint = 'landfastSeaIce'

const placesStore = usePlacesStore()
const mapStore = useMapStore()
const dataStore = useDataStore()
const runtimeConfig = useRuntimeConfig()

const { $Plotly, $_ } = useNuxtApp()
import type { Data } from 'plotly.js-dist-min'

const yearInput = defineModel('snowpack', { default: '2023' })

const apiData = computed<Record<string, any>>(() => dataStore.apiData[endpoint])
const latLng = computed<LatLngValue>(() => placesStore.latLng)

const years = $_.range(1996, 2024)

const layers: MapLayer[] = [
  {
    id: 'ardac_beaufort_daily_slie_2000',
    title: 'June 1st, 2000',
    source: 'rasdaman',
    wmsLayerName: 'ardac_beaufort_daily_slie',
    style: 'ardac_daily_slie',
    legend: 'landfast_sea_ice',
    rasdamanConfiguration: { time: '2000-06-01T00:00:00.000Z' },
  },
  {
    id: 'ardac_beaufort_daily_slie_2005',
    title: 'June 1st, 2005',
    source: 'rasdaman',
    wmsLayerName: 'ardac_beaufort_daily_slie',
    style: 'ardac_daily_slie',
    legend: 'landfast_sea_ice',
    rasdamanConfiguration: { time: '2005-06-01T00:00:00.000Z' },
  },
  {
    id: 'ardac_beaufort_daily_slie_2010',
    title: 'June 1st, 2010',
    source: 'rasdaman',
    wmsLayerName: 'ardac_beaufort_daily_slie',
    style: 'ardac_daily_slie',
    legend: 'landfast_sea_ice',
    rasdamanConfiguration: { time: '2010-06-01T00:00:00.000Z' },
  },
  {
    id: 'ardac_beaufort_daily_slie_2015',
    title: 'June 1st, 2015',
    source: 'rasdaman',
    wmsLayerName: 'ardac_beaufort_daily_slie',
    style: 'ardac_daily_slie',
    legend: 'landfast_sea_ice',
    rasdamanConfiguration: { time: '2015-06-01T00:00:00.000Z' },
  },
  {
    id: 'ardac_beaufort_daily_slie_2020',
    title: 'June 1st, 2020',
    source: 'rasdaman',
    wmsLayerName: 'ardac_beaufort_daily_slie',
    style: 'ardac_daily_slie',
    legend: 'landfast_sea_ice',
    rasdamanConfiguration: { time: '2020-06-01T00:00:00.000Z' },
  },
  {
    id: 'ardac_chukchi_daily_slie_2000',
    title: 'June 1st, 2000',
    source: 'rasdaman',
    wmsLayerName: 'ardac_chukchi_daily_slie',
    style: 'ardac_daily_slie',
    legend: 'landfast_sea_ice',
    rasdamanConfiguration: { time: '2000-06-01T00:00:00.000Z' },
  },
  {
    id: 'ardac_chukchi_daily_slie_2005',
    title: 'June 1st, 2005',
    source: 'rasdaman',
    wmsLayerName: 'ardac_chukchi_daily_slie',
    style: 'ardac_daily_slie',
    legend: 'landfast_sea_ice',
    rasdamanConfiguration: { time: '2005-06-01T00:00:00.000Z' },
  },
  {
    id: 'ardac_chukchi_daily_slie_2010',
    title: 'June 1st, 2010',
    source: 'rasdaman',
    wmsLayerName: 'ardac_chukchi_daily_slie',
    style: 'ardac_daily_slie',
    legend: 'landfast_sea_ice',
    rasdamanConfiguration: { time: '2010-06-01T00:00:00.000Z' },
  },
  {
    id: 'ardac_chukchi_daily_slie_2015',
    title: 'June 1st, 2015',
    source: 'rasdaman',
    wmsLayerName: 'ardac_chukchi_daily_slie',
    style: 'ardac_daily_slie',
    legend: 'landfast_sea_ice',
    rasdamanConfiguration: { time: '2015-06-01T00:00:00.000Z' },
  },
  {
    id: 'ardac_chukchi_daily_slie_2020',
    title: 'June 1st, 2020',
    source: 'rasdaman',
    wmsLayerName: 'ardac_chukchi_daily_slie',
    style: 'ardac_daily_slie',
    legend: 'landfast_sea_ice',
    rasdamanConfiguration: { time: '2020-06-01T00:00:00.000Z' },
  },
]

const legend: Record<string, LegendItem[]> = {
  landfast_sea_ice: [
    { color: '#ffffff', label: 'Absent' },
    { color: '#ccccff', label: 'Present' },
    { color: '#cce6cc', label: 'Land' },
  ],
}

const mapId = 'landfast_sea_ice'
mapStore.setLegendItems(mapId, legend)

const buildChart = () => {
  // Package the data into a 2D array (months x days) for the heatmap chart.
  // 0 = sea ice absent
  // 1 = land (converted from 128 to work with heatmap colormap)
  // 2 = sea ice present (converted from 255 to work with heatmap colormap)
  // 3 = no data
  // 4 = grid padding for invalid dates
  let dataByMonth: number[][] = []
  for (let month = 1; month < 13; month++) {
    let monthData: number[] = []
    let daysInMonth = new Date(parseInt(yearInput.value), month, 0).getDate()
    let paddedMonth = month.toString().padStart(2, '0')
    for (let dayOfMonth = 1; dayOfMonth < daysInMonth + 1; dayOfMonth++) {
      let paddedDay = dayOfMonth.toString().padStart(2, '0')
      let date = `${yearInput.value}-${paddedMonth}-${paddedDay}`
      if (!apiData.value.hasOwnProperty(date)) {
        monthData.push(3)
        continue
      }
      let data = parseInt(apiData.value[date])
      switch (data) {
        case 0:
          // Sea ice absent.
          monthData.push(0)
          break
        case 128:
          // Land. Convert 128 to 1 for heatmap colormap to work properly.
          monthData.push(1)
          break
        case 255:
          // Sea ice present. Convert 255 to 2 for heatmap colormap to work properly.
          monthData.push(2)
          break
        default:
          // This shouldn't happen, but mark as nodata if value is unrecognized.
          monthData.push(3)
          break
      }
    }
    let paddingLength = Math.abs(31 - daysInMonth)
    let monthPadding = $_.fill(Array(paddingLength), 4, 0, paddingLength)
    monthData = monthData.concat(monthPadding)
    dataByMonth.push(monthData)
  }

  let abbreviatedMonths = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  // Reverse these arrays so they are ordered correctly on chart.
  abbreviatedMonths = abbreviatedMonths.reverse()
  dataByMonth = dataByMonth.reverse()

  // Create hover labels for each data point and pass them into the chart
  // using the "customdata" property to give us more conditional logic.
  // Mostly, this just allows us to hide non-existent dates for placeholder
  // cells in the heatmap so we don't have labels like "Feb 31: No data".
  let dataLabels: string[][] = []
  for (let i = 0; i < dataByMonth.length; i++) {
    dataLabels[i] = Array(31)
    for (let j = 0; j < dataByMonth[i].length; j++) {
      let dayofMonth = j + 1
      if (dataByMonth[i][j] == 0) {
        dataLabels[i][j] =
          abbreviatedMonths[i] + ' ' + dayofMonth + ': Sea ice absent'
      } else if (dataByMonth[i][j] == 1) {
        dataLabels[i][j] = abbreviatedMonths[i] + ' ' + dayofMonth + ': Land'
      } else if (dataByMonth[i][j] == 2) {
        dataLabels[i][j] =
          abbreviatedMonths[i] + ' ' + dayofMonth + ': Sea ice present'
      } else if (dataByMonth[i][j] == 3) {
        dataLabels[i][j] = abbreviatedMonths[i] + ' ' + dayofMonth + ': No data'
      } else {
        dataLabels[i][j] = 'Invalid date'
      }
    }
  }

  let plotData = [
    {
      x: $_.range(1, 31),
      y: abbreviatedMonths,
      z: dataByMonth,
      type: 'heatmap',
      colorscale: [
        [0.0, 'rgb(255,255,255)'],
        [0.25, 'rgb(204,230,204)'],
        [0.5, 'rgb(204,204,255)'],
        [0.75, 'rgb(180,180,180)'],
        [1.0, 'rgb(96,96,96)'],
      ],
      showscale: false,
      xgap: 2,
      ygap: 2,
      zmin: 0,
      zmax: 4,
      hovertemplate: '%{customdata}<extra></extra>',
      customdata: dataLabels,
    } satisfies Data,
  ]

  $Plotly.newPlot(
    'chart',
    plotData,
    {
      title: {
        text: placesStore.getChartTitle('Landfast sea ice'),
        font: {
          size: 24,
        },
      },
      xaxis: {
        title: {
          text: 'Day of the month',
          font: {
            size: 18,
          },
        },
        showgrid: false,
      },
      yaxis: {
        showgrid: false,
      },
    },
    {
      responsive: true, // changes the height / width dynamically for charts
      displayModeBar: true, // always show the camera icon
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
        format: 'png',
        filename: placesStore.getChartTitle('Landfast sea ice'),
        scale: 2,
      },
    }
  )
}

watch(latLng, async () => {
  $Plotly.purge('chart')
  dataStore.apiData[endpoint] = null
  dataStore.fetchData(endpoint)
})

watch([apiData, yearInput], async () => {
  if (apiData.value) {
    buildChart()
  }
})

onUnmounted(() => {
  dataStore.apiData[endpoint] = null
})
</script>

<template>
  <section class="section xray">
    <div class="content is-size-5">
      <h3 class="title is-3">Landfast Sea Ice Extent</h3>
      <XrayIntroblurb resolution="100" unit="m" />
      <p class="mb-6">
        Landfast ice is sea ice that is mostly stationary and attached to land.
        In the dataset presented here landfast sea ice is defined as being
        contiguous to the coast and lacking detectable motion for approximately
        20 consecutive days (<a
          href="https://citeseerx.ist.psu.edu/document?repid=rep1&type=pdf&doi=a5467a7bbec6a6e31e9898f89041fbb5378a26c2"
          >Mahoney et al. 2005</a
        >). Landfast sea ice is an integral component of Arctic coastal systems
        and hosts numerous geological and biological processes as well as human
        activities.
      </p>
      <p class="mb-6">
        The map below shows the June 1st landfast sea ice extent for the
        Beaufort Sea and Chukchi Sea from 2000&ndash;2020 at five-year
        intervals.
      </p>

      <MapBlock :mapId="mapId" class="mb-6">
        <template v-slot:layers>
          <h4 class="title is-4 mb-3">Beaufort Sea</h4>
          <MapLayer :mapId="mapId" :layer="layers[0]" default>
            <template v-slot:title>{{ layers[0].title }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="layers[1]" default>
            <template v-slot:title>{{ layers[1].title }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="layers[2]" default>
            <template v-slot:title>{{ layers[2].title }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="layers[3]">
            <template v-slot:title>{{ layers[3].title }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="layers[4]">
            <template v-slot:title>{{ layers[4].title }}</template>
          </MapLayer>
          <hr />
          <h4 class="title is-4 mb-3">Chukchi Sea</h4>
          <MapLayer :mapId="mapId" :layer="layers[5]">
            <template v-slot:title>{{ layers[5].title }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="layers[6]">
            <template v-slot:title>{{ layers[6].title }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="layers[7]">
            <template v-slot:title>{{ layers[7].title }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="layers[8]">
            <template v-slot:title>{{ layers[8].title }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="layers[9]">
            <template v-slot:title>{{ layers[9].title }}</template>
          </MapLayer>
        </template>
      </MapBlock>

      <p>
        Enter lat/lon coordinates below to see a chart of landfast sea ice
        presence for a point location over time. After entering lat/lon
        coordinates, links will be provided where you can download the data that
        is used to populate the chart.
      </p>

      <Gimme extent="slie" ocean />

      <div v-if="latLng && apiData">
        <div class="parameter">
          <label for="year" class="label">Year:</label>
          <div class="select mb-5 mr-3">
            <select id="year" v-model="yearInput">
              <option v-for="year in years" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div id="chart"></div>
      <div v-if="latLng && apiData" class="my-6">
        <div class="legend mb-6">
          <div class="color is-flex is-flex-direction-row">
            <div
              class="swatch bordered"
              style="background-color: rgb(255, 255, 255)"
            ></div>
            <div>Sea ice absent</div>
          </div>
          <div class="color is-flex is-flex-direction-row">
            <div
              class="swatch"
              style="background-color: rgb(204, 204, 255)"
            ></div>
            <div>Sea ice present</div>
          </div>
          <div class="color is-flex is-flex-direction-row">
            <div
              class="swatch"
              style="background-color: rgb(204, 230, 204)"
            ></div>
            <div>Land</div>
          </div>
          <div class="color is-flex is-flex-direction-row">
            <div
              class="swatch"
              style="background-color: rgb(180, 180, 180)"
            ></div>
            <div>No data</div>
          </div>
          <div class="color is-flex is-flex-direction-row">
            <div class="swatch" style="background-color: rgb(96, 96, 96)"></div>
            <div>Invalid date</div>
          </div>
        </div>
        <h4 class="title is-4">
          Download landfast sea ice data for {{ latLng.lat }},
          {{ latLng.lng }}
        </h4>
        <ul>
          <li>
            <a
              :href="
                runtimeConfig.public.apiUrl +
                '/landfastice/point/' +
                latLng.lat +
                '/' +
                latLng.lng +
                '?format=csv'
              "
              >Download as CSV</a
            >
          </li>
          <li>
            <a
              :href="
                runtimeConfig.public.apiUrl +
                '/landfastice/point/' +
                latLng.lat +
                '/' +
                latLng.lng
              "
              >Download as JSON</a
            >
          </li>
        </ul>
      </div>
      <GetAndUseData apiUrl="https://earthmaps.io/landfastice/" />
      <Bios :people="['Andy Mahoney', 'Hajo Eicken']" />
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
.legend {
  overflow: hidden;
  max-width: 630px;
  margin: 20px auto;
  line-height: 1.2;
}
.color {
  width: 210px;
  padding: 0 10px;
  float: left;
  margin: 4px 0;
}
.swatch {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  &.bordered {
    border: 1px solid #ccc;
  }
}
</style>
