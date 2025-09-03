<script lang="ts" setup>
const endpoint = 'wetDaysPerYear'

import type { Data } from 'plotly.js-dist-min'
import { precisionMean } from '~/utils/math'
import { useMapStore } from '~/stores/map'

const { $Plotly, $_ } = useNuxtApp()

const placesStore = usePlacesStore()
const mapStore = useMapStore()
const dataStore = useDataStore()
const runtimeConfig = useRuntimeConfig()

const apiData = computed<Record<string, any>>(() => dataStore.apiData[endpoint])
const latLng = computed<LatLngValue>(() => placesStore.latLng)

const layers: MapLayer[] = [
  {
    id: 'wdpy_historical_era',
    title: '1980–2009, ERA-Interim',
    source: 'rasdaman',
    wmsLayerName: 'wet_days_per_year',
    style: 'ardac_wdpy_historical_era',
    legend: 'wdpy',
    rasdamanConfiguration: { dim_model: 0 },
  },
  {
    id: 'wdpy_midcentury_era',
    title: '2040–2069, NCAR CCSM4, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'wet_days_per_year',
    style: 'ardac_wdpy_midcentury_era',
    legend: 'wdpy',
    rasdamanConfiguration: { dim_model: 2 },
  },
  {
    id: 'wdpy_latecentury_era',
    title: '2070–2099, NCAR CCSM4, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'wet_days_per_year',
    style: 'ardac_wdpy_latecentury_era',
    legend: 'wdpy',
    rasdamanConfiguration: { dim_model: 2 },
  },
]

const legend: Record<string, LegendItem[]> = {
  wdpy: [
    { color: '#edf8fb', label: '&ge;0 days, &lt;60 days' },
    { color: '#ccece6', label: '&ge;60 days, &lt;120 days' },
    { color: '#99d8c9', label: '&ge;120 days, &lt;180 days' },
    { color: '#66C2a4', label: '&ge;180 days' },
  ],
}

const mapId = 'wdpy'
mapStore.setLegendItems(mapId, legend)

let chartData: any

const getPlotValues = (minYear: number, maxYear: number, model: string) => {
  let years = $_.range(minYear, maxYear + 1)

  // Pad projected decades with nulls to align properly on chart.
  let xTickPaddingLength: number = (minYear - 1980) / 10
  let xTickPadding = $_.fill(Array(xTickPaddingLength), null)

  let degreeDays: number[] = []

  years.forEach((year: number) => {
    degreeDays.push(chartData[model][year]['wdpy'])
  })

  // Group yearly values into decade buckets to make it easier to calculate
  // min/mean/max for each decade.
  let decadeBuckets: Record<string, number[]> = {}
  for (let i = 0; i < degreeDays.length; i += 10) {
    let yearRange = years[i] + '-' + years[i + 9]
    decadeBuckets[yearRange] = []
    for (let j = 0; j < 10; j++) {
      decadeBuckets[yearRange].push(degreeDays[i + j])
    }
  }

  let decades = Object.keys(decadeBuckets)

  let means: number[] = []
  let maxes: number[] = []
  let mins: number[] = []
  let maxOffsets: number[] = []
  let minOffsets: number[] = []

  decades.forEach(decade => {
    let mean = precisionMean(decadeBuckets[decade])
    let min = $_.min(decadeBuckets[decade])
    let max = $_.max(decadeBuckets[decade])

    // Calculate max/min as offsets from mean for error bars.
    let maxOffset = max - mean
    let minOffset = mean - min

    means.push(mean)
    mins.push(min)
    maxes.push(max)
    maxOffsets.push(maxOffset)
    minOffsets.push(minOffset)
  })

  decades = xTickPadding.concat(decades)
  means = xTickPadding.concat(means)
  maxes = xTickPadding.concat(maxes)
  mins = xTickPadding.concat(mins)
  maxOffsets = xTickPadding.concat(maxOffsets)
  minOffsets = xTickPadding.concat(minOffsets)

  return {
    decades,
    means,
    maxes,
    mins,
    maxOffsets,
    minOffsets,
  }
}

const buildChart = () => {
  if (apiData.value) {
    let models = ['GFDL-CM3', 'NCAR-CCSM4']
    let eras = ['2020-2049', '2050-2079', '2080-2099']

    let traces: Data[] = []
    let allDecades: string[] = ['']
    chartData = dataStore.apiData[endpoint]

    for (let i = 1980; i <= 2090; i += 10) {
      allDecades.push(i + '-' + (i + 9))
    }

    let traceParams = [
      {
        model: 'ERA-Interim',
        minYear: 1980,
        maxYear: 2009,
      },
      {
        model: 'GFDL-CM3',
        minYear: 2010,
        maxYear: 2099,
      },
      {
        model: 'NCAR-CCSM4',
        minYear: 2010,
        maxYear: 2099,
      },
    ]

    let symbols: Record<string, string> = {
      'ERA-Interim': 'circle',
      'GFDL-CM3': 'square',
      'NCAR-CCSM4': 'diamond',
    }

    let offsets: Record<string, number> = {
      'ERA-Interim': 0,
      'GFDL-CM3': -0.15,
      'NCAR-CCSM4': 0.15,
    }

    traceParams.forEach(params => {
      let plotValues = getPlotValues(
        params.minYear,
        params.maxYear,
        params.model
      )

      let ticks = $_.range(0, plotValues.decades.length + 1)

      // Offset the chart markers/bars slightly so they don't overlap.
      // Omit the first tick mark because it's just the placeholder for the
      // 0 x-axis position, where the y-axis line is drawn.
      let offsetTicks = ticks
        .slice(1)
        .map((tick: number) => tick + offsets[params.model])

      traces.push({
        x: offsetTicks,
        y: plotValues.means,
        error_y: {
          type: 'data',
          symmetric: false,
          array: plotValues.maxOffsets,
          arrayminus: plotValues.minOffsets,
        },
        mode: 'markers',
        type: 'scatter',
        name: params.model,
        marker: {
          symbol: symbols[params.model],
          size: 8,
        },
        hovertemplate:
          'max: %{customdata[0]}<br />' +
          'mean: %{y:}<br />' +
          'min: %{customdata[1]}',
        customdata: $_.zip(plotValues.maxes, plotValues.mins),
      })
    })

    $Plotly.newPlot(
      'chart',
      traces,
      {
        title: {
          text:
            'Wet days per year for ' +
            latLng.value?.lat +
            ', ' +
            latLng.value?.lng,
          font: {
            size: 24,
          },
        },
        xaxis: {
          // Pad x-axis with one null to avoid overlapping y-axis line.
          tickvals: [null].concat($_.range(1, allDecades.length)),
          ticktext: allDecades,
          dtick: 1,
        },
        yaxis: {
          title: {
            text: 'Wet days per year',
            font: {
              size: 18,
            },
          },
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
      }
    )
  }
}

watch(apiData, async () => {
  buildChart()
})

watch(latLng, async () => {
  $Plotly.purge('chart')
  dataStore.apiData[endpoint] = null
  dataStore.fetchData(endpoint)
})

onUnmounted(() => {
  dataStore.apiData[endpoint] = null
})
</script>

<template>
  <section class="section xray">
    <div class="content is-size-5">
      <h3 class="title is-3">Wet Days Per Year</h3>
      <XrayIntroblurb resolution="~12" unit="km" cmip="5" />
      <p class="mb-6">
        A wet day is defined as a day with precipitation accumulation greater
        than or equal to 1.0㎜. The map below shows the 30-year mean of wet days
        per year for three eras. The historical era (1980&ndash;2009) uses
        historical modeled data provided by the ERA-Interim model. The mid
        century (2040&ndash;2069) and late century (2070&ndash;2099) eras use
        modeled projections from the NCAR CCSM4 model under the RCP 8.5
        emissions scenario.
      </p>

      <MapBlock :mapId="mapId" class="mb-6">
        <template v-slot:layers>
          <MapLayer :mapId="mapId" :layer="layers[0]" default>
            <template v-slot:title>{{ layers[0].title }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="layers[1]">
            <template v-slot:title>{{ layers[1].title }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="layers[2]">
            <template v-slot:title>{{ layers[2].title }}</template>
          </MapLayer>
        </template>
      </MapBlock>

      <p>
        Enter lat/lon coordinates below to see a chart of the wet days per year
        for a point location. This chart displays min/mean/max values for
        historical decades using the ERA-Interim model and projected decades
        using both the GFDL CM3 and NCAR CCSM4 models under the RCP 8.5
        emissions scenario.
      </p>

      <p>
        After entering lat/lon coordinates, links will be provided where you can
        download the data that is used to populate the chart.
      </p>

      <Gimme extent="blockyAlaska" />
      <div id="chart"></div>
      <div v-if="latLng && apiData" class="my-6">
        <h4 class="title is-4">
          Download wet days per year data for {{ latLng.lat }},
          {{ latLng.lng }}
        </h4>
        <ul>
          <li>
            <a
              :href="
                runtimeConfig.public.apiUrl +
                '/wet_days_per_year/all/point/' +
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
                '/wet_days_per_year/all/point/' +
                latLng.lat +
                '/' +
                latLng.lng
              "
              >Download as JSON</a
            >
          </li>
        </ul>
      </div>
      <GetAndUseData
        apiUrl="https://earthmaps.io/wet_days_per_year/"
        geonetworkUrl="https://catalog.snap.uaf.edu/geonetwork/srv/eng/catalog.search#/metadata/8b51ce8c-7fd9-4541-9736-990c0a008005"
      >
        <li>
          Academic references:
          <blockquote>
            <p>
              Bieniek P.A., Bhatt U.S, Walsh J.E., Rupp T.S., Zhang J., Krieger
              J.R., &amp; Lader R (2016). Dynamical Downscaling of ERA-Interim
              Temperature and Precipitation for Alaska,
              <i>Journal of Applied Meterology and Climatology 55</i>(3)
              635&ndash;654;
              <a href="https://doi.org/10.1175/JAMC-D-15-0153.1"
                >https://doi.org/10.1175/JAMC-D-15-0153.1</a
              >
            </p>
            <p>
              Lader R., Walsh J.E., Bhatt U.S. &amp; Bieniek P.A. (2017)
              Projections of Twenty-First-Century Climate Extremes for Alaska
              via Dynamical Downscaling and Quantile Mapping
              <i>Journal of Applied Meterology and Climatology 56</i>(9)
              2393&ndash;2409;
              <a href="https://doi.org/10.1175/JAMC-D-16-0415.1"
                >https://doi.org/10.1175/JAMC-D-16-0415.1</a
              >
            </p>
          </blockquote>
        </li>
      </GetAndUseData>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
