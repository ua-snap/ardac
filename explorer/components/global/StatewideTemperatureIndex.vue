<script lang="ts" setup>
import { dailyIndexToCsv } from '~/utils/statewideTemperatureIndex'

const dataStore = useDataStore()

const statewideTemperatureIndex = computed(
  () => dataStore.statewideTemperatureIndex
)
const statewideTemperatureIndexLoading = computed(
  () => dataStore.statewideTemperatureIndexLoading
)
const statewideTemperatureIndexError = computed(
  () => dataStore.statewideTemperatureIndexError
)

const csvHref = computed(() => {
  if (!statewideTemperatureIndex.value) return ''
  return (
    'data:text/csv;charset=utf-8,' +
    encodeURIComponent(dailyIndexToCsv(statewideTemperatureIndex.value))
  )
})

onMounted(() => {
  dataStore.fetchStatewideTemperatureIndex()
})

onUnmounted(() => {
  dataStore.clearStatewideTemperatureIndex()
})
</script>

<template>
  <section class="section">
    <div class="content is-size-5">
      <h3 class="title is-3">Alaska Statewide Temperature Index</h3>
      <p>
        &ldquo;Has it been warmer or colder lately in Alaska?&rdquo; Answer:
        &ldquo;It&rsquo;s complicated.&rdquo; Why? Alaska is a very large region
        with complex geography and sparse data availability. The statewide
        temperature index is a simple indicator that balances accessible
        information on temperature variation with the complexity of
        Alaska&rsquo;s climate.
      </p>
      <p>
        The graph below shows the average temperature across Alaska each day,
        and compares it to the historical average. Each dot represents the
        average temperature across Alaska for that day, and the line marked at 0
        represents the average historical temperature.
      </p>
      <ul>
        <li>
          Click the camera icon in the upper-right of the chart to download it.
        </li>
        <li>
          You can show up to two years of data by adjusting the controls
          immediately below the main chart.
        </li>
      </ul>

      <div v-if="statewideTemperatureIndexLoading">
        <p>
          Loading temperature data from weather stations across Alaska&hellip;
        </p>
        <progress class="progress" />
      </div>
      <p v-else-if="statewideTemperatureIndexError">
        {{ statewideTemperatureIndexError }}
      </p>
      <template v-else-if="statewideTemperatureIndex">
        <StatewideTemperatureIndexChart
          :daily-index="statewideTemperatureIndex"
        />
        <p>
          <a :href="csvHref" download="statewide_temperature_daily_index.csv"
            >Download the daily index as CSV</a
          >
        </p>
      </template>

      <h4 class="title is-4">About this graph</h4>
      <ul>
        <li>
          Red dots indicate &ldquo;warmer than normal&rdquo; temperatures. Blue
          dots indicate &ldquo;colder than normal.&rdquo;
        </li>
        <li>
          The distance above or below the historical average (where the index is
          0) represents the amount of deviation from normal. A value of +1, for
          instance, means that the day is warmer than 10% of all above-normal
          days. A value of +2 is warmer than 20% of all above-normal days. And a
          value of +10 is a record high for that day, with a temperature higher
          than all other above-normal days.
        </li>
        <li>
          The black line represents a running 30-day average. This line is less
          affected by short-term (1&ndash;3 day) temperature anomalies.
        </li>
        <li>
          Below the chart, a diagram displays the past two years of index data
          and what portion of that data is displayed in the larger chart. These
          boundaries are set to the last 6 months by default. Shift the
          boundaries in this box to define the beginning and end dates of the
          larger chart.
        </li>
      </ul>

      <h4 class="title is-4">How this graph works</h4>
      <p>
        This graph compares reliable observations from a network of stations
        distributed across the state to baseline normals collected and averaged
        over the three-decade period from 1991 to 2020. Data is collected from
        the National Weather Service&rsquo;s
        <a href="https://www.weather.gov/asos/"
          >Automated Surface Observing Systems</a
        >
        (ASOS). This system includes mean and standard deviations of daily
        normal temperatures, and covers most of the state.
      </p>
      <figure class="image">
        <img
          src="assets/images/StatewideTemperatureIndex/asos_station_map.png"
          alt="Map of the ASOS stations used to determine the Statewide Temperature Index"
        />
      </figure>
      <p>
        Map of the ASOS stations used to determine the Statewide Temperature
        Index
      </p>
      <p>
        Utilizing this network allows for the geographic and latitudinal
        variation inherent to the state of Alaska to be taken into account
        without a large degree of complexity.
      </p>

      <h5 class="title is-5">Advantages of a daily temperature index</h5>
      <ul>
        <li>
          It is not strongly influenced by occasional missing data points.
        </li>
        <li>
          It is best at distinguishing moderate anomalies in statewide
          temperatures.
        </li>
        <li>A single number is easy to understand and disseminate.</li>
      </ul>

      <h5 class="title is-5">Other considerations</h5>
      <ul>
        <li>
          A single index number can make the data easy to misunderstand, and
          makes it challenging to quantify extreme temperature variations.
        </li>
        <li>
          Production of the index using the ASOS system also means that the
          index has the same gaps in its regional coverage as that system. The
          ASOS system is subject to occasional sensor failures, as well as
          failures in communication systems. There can be some lag between
          failure and repair.
        </li>
      </ul>

      <p>
        The Alaska Statewide Temperature Index was developed by Rick Thoman and
        Brian Brettschneider from data provided by the National Weather Service
        ASOS system.
      </p>

      <GetAndUseData api-url="https://www.rcc-acis.org/docs_webservices.html">
        <template #preamble>
          <p>
            Daily station temperatures are provided by the Applied Climate
            Information System (ACIS), and daily normals by the NOAA National
            Centers for Environmental Information (NCEI).
          </p>
        </template>
        <li>
          <a
            href="https://www.ncei.noaa.gov/products/land-based-station/us-climate-normals"
            >U.S. Climate Normals (1991&ndash;2020) from NCEI</a
          >
        </li>
        <li>
          <NuxtLink to="/item/story-cold-snap-1989"
            >1989 Alaska Cold Snap</NuxtLink
          >
        </li>
      </GetAndUseData>

      <Bios :people="['Rick Thoman']" />
    </div>
  </section>
</template>
