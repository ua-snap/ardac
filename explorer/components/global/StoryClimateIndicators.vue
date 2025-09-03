<script lang="ts" setup>
const endpoints = ['cmip6Monthly', 'cmip6MonthlyIndicators']

import { usePlacesStore } from '~/stores/places'
import { useChartStore } from '~/stores/chart'

const placesStore = usePlacesStore()
const chartStore = useChartStore()

onMounted(() => {
  // Set Fairbanks location when component is mounted
  placesStore.latLng = {
    lat: 64.8378,
    lng: -147.7164,
  }
})

onUnmounted(() => {
  placesStore.latLng = undefined
  endpoints.forEach(endpoint => {
    chartStore.inputs[endpoint] = undefined
    chartStore.labels[endpoint] = undefined
  })
})
</script>

<template>
  <section class="section">
    <div class="content clamp is-size-5">
      <h3 class="title is-3">
        Climate Indicators: Making More Meaning from Data
      </h3>
      <h4>What is a climate indicator?</h4>
      <p>
        A climate indicator is a value intended to represent a specific aspect
        of the climate, such as the number of very cold days expected per year. 
        Climate indicators summarize complex climate data into
        singular values that make it easier to understand the state of the
        environment at a given moment in time, and create connections between
        climate data and the human experience.
      </p>
      <p>
        Indicators are calculated from direct observations and from variables in
        global climate models (like temperature, rainfall, or snow). When
        indicators are presented for both the historical period and climate
        futures, they help us track and predict changes in the environment over
        time. For example, comparing historical and future counts of "deep
        winter days" (the number of days per year that are below -22°F) can help
        us understand how the winter season could be different in the future.
      </p>
    </div>
    <div class="content clamp is-size-5">
      <h4>Why do we need climate indicators?</h4>
      <p>
        Climate models are complex datasets that may contain dozens of variables
        and millions of data points. To derive meaningful information from these
        datasets, we need to summarize the data in a way that is comprehensible
        and relevant to people and their interests.
      </p>
      <p>
        Indicators help us to communicate climate data trends in ways that are
        more useful in human contexts. By condensing the key components of the
        datasets into indicators, we reduce complexity and increase value for
        people.
      </p>
      <p>
        For example, compare the two plots below. In the first plot, the values
        show a general warming trend of the winter season in Fairbanks, AK. But
        we can only draw vague conclusions about what this might mean for daily
        life in the city.
      </p>
      <Cmip6MonthlyChartControls
        defaultModel="TaiESM1"
        defaultMonth="01"
        :datasetKeys="['tas']"
      />
      <Cmip6MonthlyChart
        label="Mean Near-surface Air Temperature"
        units="°C"
        dataKey="tas"
        class="mb-5"
      />
      <p>
        In the second plot, we see air temperature data
        summarized and expressed as "deep winter days" (the number of days per
        year that are below -22°F). The indicator is further summarized by
        decade. This is more easily translated into a meaningful informational
        statement:
      </p>
      <p>
        <strong>When compared to the historical record, by the end of the century
        Fairbanks is predicted to have 25 to 30 fewer days per year where the
        air temperature is below -22°F.
        </strong>
      </p>
      <IndicatorsCmip6ChartControls :datasetKeys="['dw']" />
      <IndicatorsCmip6Chart label="Deep winter days" dataKey="dw" />
    </div>
    <div class="content clamp is-size-5">
      <h4>What makes a good climate indictator?</h4>
      <p>
        The quality of any indicator depends on the user. For example, the air
        temperature indicator above may be quite useful in the context of
        planning a community's outdoor recreation but may not be useful in the
        context of plant physiology. There are really no "one-size-fits-all"
        indicators, though some indicators may be good for multiple user groups.
      </p>
      <p>In general, a good indicator will:</p>
      <ul>
        <li>be simple to communicate</li>
        <li>be understood by all members of the user group</li>
        <li>correspond to real world experience of the user group</li>
        <li>provide meaningful or actionable information</li>
      </ul>
    </div>
    <div class="content clamp is-size-5">
      <h4>How does SNAP develop regionally-relevant climate indicators?</h4>
      <p>
        With input from scientists, community members, and a wide variety of
        user groups, SNAP has calculated a set of climate indicators that are
        relevant to people living, working, and researching in Alaska and the
        Arctic. SNAP's selection of indicators are designed to be relevant to a
        broad cross-section of users, and avoid measures and indices specific to
        any one field.
      </p>
      <p>
        Indicators are usually calculated on a yearly basis, and can be averaged
        over longer time spans to provide a general overview of climate trends.
        Regionally-relevant indicators analyzed over multi-decadal periods of
        time provide highly valuable information without requiring any
        downloads or preprocessing of large and complex climate datasets.
      </p>
      <h5>SNAP's climate indicators include:</h5>
      <dl>
        <dt><strong>hd</strong></dt>
        <dd>
          "Hot day" Threshold &mdash; the highest observed daily maximum air
          temperature where there are only 5 other observations equal to or
          greater than this value. Only five days per year are hotter than this value.
        </dd>
        <dt><strong>cd</strong></dt>
        <dd>
          "Cold day" Threshold &mdash; the lowest observed daily minimum air
          temperature where there are only 5 other observations equal to or less
          than this value. Only five days per year are colder than this value.
        </dd>
        <dt><strong>su</strong></dt>
        <dd>
          "Summer Days" &mdash; annual number of days with maximum air
          temperature above 25°C (77°F).
        </dd>
        <dt><strong>dw</strong></dt>
        <dd>
          "Deep Winter Days" &mdash; annual number of days with minimum air
          temperature below -30°C (-22°F).
        </dd>
        <dt><strong>wsdi</strong></dt>
        <dd>
          Warm Spell Duration Index &mdash; annual count of occurrences of at
          least 5 consecutive days with daily mean air temperature above the 90th
          percentile of historical values for that date.
        </dd>
        <dt><strong>cdsi</strong></dt>
        <dd>
          Cold Spell Duration Index &mdash; annual count of occurrences of at
          least 5 consecutive days with daily mean air temperature below the 10th
          percentile of historical values for that date. The opposite of WDSI.
        </dd>
        <dt><strong>rx1day</strong></dt>
        <dd>
          "Maximum 1-day Precipitation" &mdash; annual maximum amount of
          precipitation measured over a 24-hour period.
        </dd>
        <dt><strong>rx5day</strong></dt>
        <dd>
          "Maximum 5-day Precipitation" &mdash; annual maximum amount of
          precipitation measured over a 5-day period.
        </dd>
        <dt><strong>r10mm</strong></dt>
        <dd>
          "Rainy Days" &mdash; number of days per year with at least 10mm of
          rainfall.
        </dd>
        <dt><strong>cwd</strong></dt>
        <dd>
          Consecutive Wet Days &mdash; number of the most consecutive days with
          precipitation of at least 1mm.
        </dd>
        <dt><strong>cdd</strong></dt>
        <dd>
          Consecutive Dry Days &mdash; number of the most consecutive days with
          precipitation less than 1mm.
        </dd>
      </dl>
    </div>
    <div class="content clamp is-size-5">
      <h4>Where do I find climate indicator data?</h4>
      <p>There are multiple ways to access the climate indicators data.</p>
      <ul>
        <li>
          Charts summarizing trends in temperature and precipitation indicators
          are available in the individual report pages of SNAP's
          <a href="https://northernclimatereports.org"
            >Northern Climate Reports</a
          >
          tool. This is a great place to start if you are looking for a
          pre-packaged overview of indicators for your community or area of
          interest.
        </li>
        <li>
          Get started right here in
          <a href="https://arcticdatascience.org">ARDAC</a>: this tool provides
          Alaska-wide maps and a search interface to find individual climate
          indicators for communities. This is a good resource if you are looking
          for a specific indicator and want an off-ramp to download a portion of
          the indicator dataset for your own work.
        </li>
        <li>
          SNAP's <a href="https://earthmaps.io">API</a> provides programmatic
          access to indicators derived from both CMIP5 and CMIP6 climate model
          outputs. Here, you can access the full indicators dataset in JSON or
          CSV format for use in your own scientific analysis.
        </li>
      </ul>
    </div>
    <div class="content clamp is-size-5">
      <h4>Can I suggest an indicator?</h4>
      <p>
        Of course! If there is a useful indicator missing from our collection,
        we'd like to know about it. Send us your ideas for a climate indicator 
        relevant to your needs. Please contact
        <a href="mailto:uaf-snap-data-tools@alaska.edu"
          >uaf-snap-data-tools@alaska.edu</a
        >
        with questions or comments.
      </p>
    </div>
    <div class="content clamp is-size-5">
      <h4>Read more about indicators</h4>
      <p>
        <li><a href="https://www.epa.gov/climate-indicators">Climate Change Indicators in the United States</a> (U.S. Environmental Protection Agency)</li>
        <li>Fifth National Climate Assessment, <a href="https://nca2023.globalchange.gov/chapter/appendix-4/">Appendix 4: Indicators</a></li>
        <li>Climdex Project <a href="https://www.climdex.org/learn/indices/">Indices</a></li>
      </p>
    </div>
  </section>
</template>

<style scoped></style>
