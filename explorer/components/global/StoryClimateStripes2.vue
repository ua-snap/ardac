<script lang="ts" setup>
const endpoint = 'temperatureAnomalies'

const placesStore = usePlacesStore()
const dataStore = useDataStore()

const { $Plotly, $_ } = useNuxtApp()
import type { Data, ColorBar } from 'plotly.js-dist-min'

interface ExtendedColorBar extends ColorBar {
  orientation?: 'h' | 'v'
}

const apiData = computed<Record<string, any>>(() => dataStore.apiData[endpoint])
const latLng = computed<LatLngValue>(() => placesStore.latLng)
const selectedCommunity = computed<CommunityValue>(
  () => placesStore.selectedCommunity
)

const modelInput = defineModel('model', { default: 'EC-Earth3-Veg' })

const models: string[] = [
  'CESM2',
  'CNRM-CM6-1-HR',
  'EC-Earth3-Veg',
  'GFDL-ESM4',
  'HadGEM3-GC31-LL',
  'HadGEM3-GC31-MM',
  'KACE-1-0-G',
  'MIROC6',
  'MPI-ESM1-2-HR',
  'MRI-ESM2-0',
  'NorESM2-MM',
  'TaiESM1',
]

const scenarioLabels: Record<string, string> = {
  ssp126: 'SSP1-2.6',
  ssp245: 'SSP2-4.5',
  ssp370: 'SSP3-7.0',
  ssp585: 'SSP5-8.5',
}

let startYear = 1900
let projectedStartYear = 2025
let endYear = 2100

let historicalYears = $_.range(startYear, projectedStartYear)
let projectedYears = $_.range(projectedStartYear, endYear + 1)

let locationMin: number | undefined
let locationMax: number | undefined

// Get the overall min and max temperature anomalies across all models and
// scenarios for the selected location.
const setLocationMinMax = () => {
  let anomalies: number[] = []
  $_.eachDeep(
    apiData.value,
    (value: number, key: string, parent: any, context: any) => {
      // Collect all temperature anomalies from 1900 onward.
      if (
        context.parents.length == 4 &&
        context.parents[2].key == 'temperature_anomalies' &&
        parseInt(key) >= 1900
      ) {
        anomalies.push(value)
      }
    }
  )
  locationMin = $_.min(anomalies)
  locationMax = $_.max(anomalies)
}

const buildChart = () => {
  if (apiData.value) {
    let dataByScenario: Array<Array<number | string>> = []
    let allValues: number[] = []
    let maxHistoricalValue: number = 0

    // Get available scenarios for the selected model.
    let availableScenarios = Object.keys(
      apiData.value[modelInput.value]['temperature_anomalies']
    )
    availableScenarios.forEach(scenario => {
      let scenarioData: number[] = []
      historicalYears.forEach((year: any) => {
        let anomaly =
          apiData.value['Berkeley-Earth']['temperature_anomalies'][
            'historical'
          ][year]
        let absoluteTemperature = anomaly
        absoluteTemperature = parseFloat(absoluteTemperature.toFixed(2))
        scenarioData.push(absoluteTemperature)
        allValues.push(absoluteTemperature)
      })
      maxHistoricalValue = $_.max(scenarioData)
      projectedYears.forEach((year: any) => {
        let anomaly =
          apiData.value[modelInput.value]['temperature_anomalies'][scenario][
            year
          ]
        let absoluteTemperature = anomaly
        absoluteTemperature = parseFloat(absoluteTemperature.toFixed(2))
        scenarioData.push(absoluteTemperature)
        allValues.push(absoluteTemperature)
      })
      dataByScenario.push(scenarioData)
    })

    if (locationMin == undefined || locationMax == undefined) {
      setLocationMinMax()
    }

    // Lots of exclamation marks here because we know location min/max are
    // actual numbers and not undefined.
    let range = locationMax! - locationMin!
    let redPoint = (maxHistoricalValue - locationMin!) / range
    let whitePoint = (0 - locationMin!) / range
    let plumPoint = redPoint + (locationMax! - maxHistoricalValue) / range / 2

    // Create hover labels for each data point and pass them into the chart
    // using the "customdata" property to give us more conditional logic. This is
    // necessary to hide the "Scenarios" label for historical data.
    let dataLabels: string[][] = []
    for (let i = 0; i < dataByScenario.length; i++) {
      dataLabels[i] = []
      for (let j = 0; j < dataByScenario[i].length; j++) {
        if ((dataByScenario[i][j] as number) > 0) {
          dataByScenario[i][j] = '+' + dataByScenario[i][j]
        }
        let year = j + startYear
        if (year < projectedStartYear) {
          dataLabels[i][j] =
            'Year: ' +
            year +
            '<br />Mean Annual Temperature: ' +
            dataByScenario[i][j] +
            '°C'
        } else {
          dataLabels[i][j] =
            'Year: ' +
            year +
            '<br />Scenario: ' +
            scenarioLabels[Object.keys(scenarioLabels)[i]] +
            '<br />Mean Annual Temperature: ' +
            dataByScenario[i][j] +
            '°C'
        }
      }
    }

    // Reverse arrays so they are ordered correctly on chart.
    dataByScenario = dataByScenario.reverse()
    dataLabels = dataLabels.reverse()

    // Get subset of scenarioLabels corresponding to model's scenarios.
    let scenarioLabelsSubset: Record<string, string> = {}
    for (let i = 0; i < availableScenarios.length; i++) {
      scenarioLabelsSubset[availableScenarios[i]] =
        scenarioLabels[availableScenarios[i]]
    }

    // Calculate step for colorscale legend tick marks.
    let step = 1
    if (range > 10) {
      step = 2
    }
    let tickvals = $_.range(
      Math.floor(locationMin!),
      Math.ceil(locationMax!) + 1,
      step
    )

    // Add a "+" sign to any tickval that is positive, and set it to ticktext variable.
    let ticktext = tickvals.map((tickval: any) => {
      if (tickval > 0) {
        return '+' + tickval + '°C'
      } else {
        return tickval + '°C'
      }
    })

    let plotData = [
      {
        x: $_.range(startYear, endYear + 1),
        y: Object.values(scenarioLabelsSubset).reverse(),
        z: dataByScenario,
        type: 'heatmap',
        colorscale: [
          [0, 'hsl(223, 97%, 44%)'],
          [whitePoint, 'hsl(0, 0%, 100%)'],
          [redPoint, 'hsl(0, 100%, 50%)'],
          [plumPoint, 'hsl(300, 100%, 35%)'],
          [1, 'hsl(300, 100%, 50%)'],
        ],
        zmin: locationMin,
        zmax: locationMax,
        colorbar: {
          orientation: 'h',
          x: 0.5,
          y: -0.15,
          xanchor: 'center',
          yanchor: 'top',
          tickmode: 'array',
          tickvals: tickvals,
          ticktext: ticktext,
        } as ExtendedColorBar,
        hovertemplate: '%{customdata}',
        xhoverformat: '.0f',
        hoverlabel: {
          namelength: 0,
        },
        customdata: dataLabels,
      } satisfies Data,
    ]

    let titleText = 'Temperature Change (°C)<br />'
    if (selectedCommunity.value && selectedCommunity.value.name) {
      titleText +=
        selectedCommunity.value.name + ', ' + selectedCommunity.value.region
    } else {
      titleText += latLng.value?.lat + ', ' + latLng.value?.lng
    }
    titleText += ', Model: ' + modelInput.value

    let viewportWidth = window.innerWidth

    // Numbers to be used as the numerator for annotationOffset calculation
    let numerator
    if (viewportWidth > 1500) {
      numerator = 30000
    } else if (viewportWidth > 800) {
      numerator = 20000
    } else {
      numerator = 22000
    }

    let annotationOffset = numerator / viewportWidth

    let footerText =
      "Historical data is provided by Berkeley Earth's high-resolution global monthly land + ocean dataset.<br />" +
      'Historical temperature anomalies were calculated from the Berkeley Earth 1951-1980 baseline temperature.<br />' +
      'Projected temperature anomalies were calculated from the ' +
      modelInput.value +
      ' 1951-1980 baseline temperature.'

    let annotationX = projectedStartYear - 0.5

    $Plotly.newPlot(
      'chart',
      plotData,
      {
        title: {
          text: titleText,
          font: {
            size: 24,
          },
          y: 0.92,
          yanchor: 'top',
        },
        xaxis: {
          showgrid: false,
        },
        yaxis: {
          showgrid: false,
          side: 'right',
        },
        shapes: [
          {
            type: 'line',
            x0: annotationX,
            y0: -0.1,
            x1: annotationX,
            y1: 1.1,
            yref: 'paper',
            line: {
              color: '#333333',
              width: 2,
            },
          },
        ],
        annotations: [
          {
            x: annotationX - annotationOffset,
            y: 1.1,
            xref: 'x',
            yref: 'paper',
            text: '← Historical',
            showarrow: false,
            font: {
              size: 16,
            },
          },
          {
            x: annotationX + annotationOffset,
            y: 1.1,
            xref: 'x',
            yref: 'paper',
            text: 'Projected →',
            showarrow: false,
            font: {
              size: 16,
            },
          },

          {
            xref: 'paper',
            yref: 'paper',
            x: 0.5,
            y: -0.45,
            xanchor: 'center',
            yanchor: 'top',
            text: footerText,
            showarrow: false,
          },
        ],
        height: 600,
        margin: {
          t: 130,
          b: 200,
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
          filename:
            'Climate Stripes for ' +
            (selectedCommunity.value?.name ||
              latLng.value?.lat + ', ' + latLng.value?.lng) +
            ', ' +
            modelInput.value,
          format: 'png',
        },
      }
    )
  }
}

window.addEventListener('resize', () => {
  $Plotly.purge('chart')
  buildChart()
})

watch(latLng, async () => {
  $Plotly.purge('chart')
  dataStore.apiData[endpoint] = null
  locationMin = undefined
  locationMax = undefined
  dataStore.fetchData(endpoint)
})

watch([apiData, modelInput], async () => {
  buildChart()
})

onUnmounted(() => {
  dataStore.apiData[endpoint] = null
})
</script>

<template>
  <section class="section">
    <div class="content clamp center is-size-5">
      <h3 class="title is-3">Climate Stripes: What Might the Future Hold?</h3>

      <p>
        How much has your town or region already warmed? How does that change
        compare to the normal year-to-year variability in weather that
        we&rsquo;re used to? And what might the future hold?
      </p>

      <p>
        The first two questions
        <NuxtLink to="/item/story-climate-stripes-1"
          >were discussed in the first part of this series</NuxtLink
        >. But how do things change when we turn our attention towards the
        future? What is likely to happen next in your own community, around the
        state, or across the pan-Arctic?
      </p>

      <p>
        Looking into the future requires modeling based on how increases in
        greenhouse gases may affect planetary warming and weather patterns over
        coming decades. Research groups from around the world have created
        complex Global Climate Models and Earth System Models to explore this
        question.
      </p>

      <p>
        Each of these models uses slightly different methods to represent
        effects on our planet&rsquo;s atmosphere, oceans, land, and ice, and
        thus generates slightly different outputs. In addition, modelers cannot
        precisely predict future human choices and behavior regarding emission
        levels of greenhouse gases. Thus, each model has been run multiple
        times, using different possible assumptions.
      </p>

      <p>
        Because of these uncertainties, our Extended Climate Stripes represent
        one past…and several futures.
      </p>

      <h4>Using the past to help visualize the future</h4>

      <figure class="image">
        <img
          src="assets/images/ClimateStripesStory2/fairbanks_projected_climate_stripes.png"
        />
      </figure>

      <p>
        This set of stripes, representing Fairbanks, shows four possible futures
        out to 2100. In this case, we are looking at a single model and varied
        trajectories for human behavior in mitigating climate change. The 2.6
        scenario is the least extreme, while the 8.5 scenario shows the most
        dramatic change.
      </p>

      <p>
        The historical dataset (<a href="https://berkeleyearth.org/data/"
          >Berkeley Earth</a
        >) used to produce this graphic is gridded, meaning it offers “maps
        without gaps”. Climate stations are relatively rare. This dataset, and
        others like it, uses historical measurements from weather stations to
        create realistic estimates of what the weather was like in all the
        locations in between where no station data is available.
      </p>

      <p>
        Because these stripes represent change from the past, the colors are
        calibrated to reflect that. Blue shades show years that were cooler than
        the average for the historical time period, and pink to red to purple
        shades show years that were &mdash; or are projected to be &mdash;
        warmer than that historical “norm”.
      </p>

      <p>
        Notice that even the most modest assumptions predict that coming decades
        will be much warmer than the past. Meanwhile, the 8.5 scenario projects
        that by the end of this century, almost every year is likely to be at
        least 10&deg;C (18&deg;F) warmer than historical averages.
      </p>

      <p>
        What this warming will mean for Alaskans will vary from region to region
        and community to community. What might this kind of dramatic change look
        like where you live?
      </p>

      <h4>Try for yourself!</h4>

      <p>
        This module will let you create historical + projected climate stripes
        anywhere on Earth above 50.5&deg; latitude. Enter a community name or
        lat/long below to get climate stripes derived from climate model data.
      </p>

      <Gimme :bbox="[-180, 50.5, 180, 90]" />
      <div v-if="apiData">
        <div>
          <div class="parameter mb-5">
            <label for="model" class="label">Model</label>
            <div class="select mr-3">
              <select id="model" v-model="modelInput">
                <option v-for="model in models" :value="model">
                  {{ model }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
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
