<script lang="ts" setup>
const placesStore = usePlacesStore()
const dataStore = useDataStore()
const runtimeConfig = useRuntimeConfig()

const era5wrfExtent = 'blockyAlaska'

interface ReferenceEntry {
  id: string
  citation: string
}

const references: ReferenceEntry[] = [
  {
    id: 'ref-aicc-2005',
    citation:
      'Alaska Interagency Coordination Center. (2005). <em>2004 Alaska Fire Season Summary</em>. National Interagency Fire Center. <a href="https://fire.ak.blm.gov/content/aicc/sitreport/2004_Season_Summary.pdf">https://fire.ak.blm.gov/content/aicc/sitreport/2004_Season_Summary.pdf</a>',
  },
  {
    id: 'ref-kasischke-turetsky-2006',
    citation:
      'Kasischke, E. S., &amp; Turetsky, M. R. (2006). Recent changes in the fire regime of the Alaskan boreal forest. <em>Geophysical Research Letters</em>, 33(9), L09703. <a href="https://doi.org/10.1029/2006GL025944">https://doi.org/10.1029/2006GL025944</a>',
  },
  {
    id: 'ref-bieniek-2016',
    citation:
      'Bieniek, P. A., Bhatt, U. S., Walsh, J. E., Rupp, T. S., Zhang, J., &amp; Smikrud, K. M. (2016). Dynamical downscaling of ERA-Interim temperature and precipitation for Alaska. <em>Journal of Applied Meteorology and Climatology</em>, 55(3), 635–654. <a href="https://doi.org/10.1175/JAMC-D-15-0153.1">https://doi.org/10.1175/JAMC-D-15-0153.1</a>',
  },
]

onMounted(() => {
  // Clear any stale errors from other pages/endpoints to prevent
  // false "Failed to load data" messages
  dataStore.dataErrors = {}
})

onUnmounted(() => {
  // Note: We intentionally don't clear location state here to allow
  // navigation between Fire Story and Xray pages while preserving
  // the selected location for better user experience
})
</script>

<template>
  <section class="section">
    <div class="content clamp is-size-5">
      <h3 class="title is-3">
        Hotter, Drier Summers and Fire-Prone Conditions
      </h3>

      <p>
        Explore daily fire weather conditions using the high-resolution ERA5-WRF
        dynamically downscaled dataset. This reanalysis makes it easy to step
        through six decades of temperature and humidity data.
      </p>

      <p>
        Set the <strong>Year Selection</strong> control to 2004 (the default)
        and notice how the chart and summary statistics respond, then experiment
        with any fire season from <strong>1960 through 2023</strong>. The 2004
        Alaska summer was marked by significant meteorological anomalies,
        culminating in the largest fire season on record for Alaska: 6.6 million
        acres burned.<sup>
          <a href="#ref-aicc-2005" aria-label="Jump to reference 1">[1]</a>
        </sup>
        The Taylor Complex, a group of several large fires accounted for more
        than 1.7 million acres burned in eastern Alaska near the Yukon border.
        Use the <strong>Reference Period</strong> radio buttons to compare any
        season against either the 1960-1989 or 1990-2019 baseline and see how
        conditions deviated from the climatological normals. To learn more about
        how overlapping extremes drove the Taylor Complex fire behavior, choose
        Tok or drop a custom latitude/longitude in the community selector and
        follow along with the narrative below.
      </p>

      <div class="box mt-5">
        <h4 class="title is-4">Fire Weather Analysis</h4>

        <!-- Use ARDAC's standard location picker -->
        <p class="mb-3">
          Pick any catalog community or enter coordinates directly to load
          ERA5-WRF data for that location.
        </p>
        <Gimme :communities-enabled="true" :extent="era5wrfExtent" />

        <!-- Chart component -->
        <Era5WrfWrapper />
      </div>

      <h4 class="title is-4">
        Taylor Complex 2004: Heat, Drying, and Rapid Expansion
      </h4>
      <p>
        The Taylor Complex and related 2004 fires demonstrate how overlapping
        extremes drive fire behavior. The story begins with a seemingly benign
        May—above-average rainfall and forecasts that gave no hint of the
        record-breaking warmth and dryness to come. As you scrub the chart
        through June, watch the daily maximum temperature trace climb toward the
        high 20s&nbsp;&deg;C while the minimum relative humidity collapses: the
        hot-dry pairing that allowed surface fuels to flash-dry.<sup>
          <a
            href="#ref-kasischke-turetsky-2006"
            aria-label="Jump to reference 2"
            >[2]</a
          >
        </sup>
      </p>
      <p>
        By mid-June, Interior Alaska logged its second warmest June in the
        100-year record, triggering widespread convection and a record number of
        lightning strikes. Lightning on <strong>June 26</strong> ignited the
        Taylor Complex.<sup>
          <a href="#ref-aicc-2005" aria-label="Jump to reference 1">[1]</a>
        </sup>
        The statistics panel captures the fallout—count how many hot, dry, and
        compound hot-dry days erupted once ignition occurred.
      </p>

      <h5 class="title is-5 mt-5">
        1. Precursor Conditions and Ignition (May to Mid-June 2004)
      </h5>
      <ul>
        <li>
          <strong>Drying Trend and Warming:</strong> After the wet May, a rapid
          drying trend began in mid-June. Temperatures surged, making June 2004
          the second warmest June on record for Interior Alaska.
        </li>
        <li>
          <strong>Lightning Surge:</strong> Warmer air supported deep
          thunderstorms and a record lightning count, setting the stage for
          numerous ignitions.
        </li>
        <li>
          <strong>Taylor Complex Ignition:</strong> Lightning ignited the
          complex on <strong>June 26</strong>. Use the year selector to jump to
          other seasons and compare how rare these combined signals are.
        </li>
      </ul>

      <h5 class="title is-5 mt-5">
        2. First Surge: Chinook, Low RH, and Extreme Heat (Late June)
      </h5>
      <p>
        Late June shows how temperature, humidity, and wind stacked to produce
        explosive growth. Around Day Number (DN) 170 (June&nbsp;18), maximum
        temperatures approached <strong>28&nbsp;&deg;C</strong> while minimum RH
        dropped near <strong>20%</strong>. By DN 179-184
        (June&nbsp;27&ndash;July&nbsp;2) the complex entered a crown-fire phase.
        Chinook winds from the east-northeast averaged about
        <strong>6.5&nbsp;m&nbsp;s<sup>&minus;1</sup></strong
        >, well above the
        <strong>4.47&nbsp;m&nbsp;s<sup>&minus;1</sup></strong> crown-fire
        threshold. In the chart, notice how simultaneous high temperatures and
        very low RH persist over several days—perfect conditions for rapid
        spread.
      </p>

      <h5 class="title is-5 mt-5">3. Smoke-Induced Lull (Early July)</h5>
      <p>
        Around DN 181 (June&nbsp;30), the complex generated such a dense smoke
        plume that local solar radiation fell by roughly <strong>60%</strong>.
        Temperatures dropped toward <strong>15&nbsp;&deg;C</strong> and humidity
        rebounded into the <strong>50&ndash;100%</strong> range. Crown fire
        activity briefly ceased. In the ERA5-WRF chart, this pause appears as a
        dip in temperature and the statistics panel records a short break in hot
        and dry day counts.
      </p>

      <h5 class="title is-5 mt-5">
        4. Re-Ignition and Secondary Peak (Mid-July)
      </h5>
      <p>
        Once the smoke shield thinned, solar heating returned. By DN 194
        (July&nbsp;12) maximum temperatures rebounded to
        <strong>24&nbsp;&deg;C</strong> and soon topped
        <strong>27&nbsp;&deg;C</strong>, while RH again fell below
        <strong>50%</strong>. The second active period (July&nbsp;12&ndash;17)
        shows up in the chart as another cluster of hot, dry days and reinforces
        how persistent drying primes fuels for renewed growth.
      </p>

      <h5 class="title is-5 mt-5">
        5. Drought-Driven Continuation (August and September)
      </h5>
      <p>
        August, typically the wettest month in Interior Alaska, became the
        driest August in more than a century for Fairbanks. The seasonal
        controls let you compare August 2004 with other years—note how the
        percentile bands highlight the depth of the anomaly. A third major fire
        peak around DN 234 (August&nbsp;21) extended activity well into
        September, when the first major snowfall finally ended the season.
        Later-burned sites recorded higher fire severity because deep fuels
        remained dry.
      </p>

      <p>
        In total, the Taylor Complex expanded during two dominant hot-dry
        episodes (late June and mid-July) and a drought-driven late-season
        pulse. Use the controls to juxtapose 2004 with quieter seasons and to
        see how each year diverges from the 1960-1989 and 1990-2019 baselines.
        The ERA5-WRF chart and statistics panel together offer a fast way to
        spot the hallmarks of extreme fire weather: simultaneous heat,
        atmospheric drying, and the persistence of desiccated fuels.
      </p>

      <h4 class="title is-4">Understanding Fire Weather Variables</h4>

      <div class="columns">
        <div class="column">
          <div class="content">
            <h5 class="title is-5">Daily Maximum Temperature</h5>
            <p>
              Daily maximum air temperature at 2 meters above ground. Higher
              temperatures increase evaporation rates, reduce fuel moisture
              content, and create conditions favorable for fire ignition and
              rapid spread.
            </p>
          </div>
        </div>

        <div class="column">
          <div class="content">
            <h5 class="title is-5">Daily Minimum Relative Humidity</h5>
            <p>
              Daily minimum relative humidity at 2 meters above ground. Lower
              minimum humidity values indicate drier air conditions, which
              accelerate vegetation moisture loss and increase fire potential.
            </p>
          </div>
        </div>
      </div>

      <h4 class="title is-4">About the ERA5-WRF Dataset</h4>
      <p>
        This analysis uses data from the ERA5-WRF dynamically downscaled
        dataset, which provides high-resolution (4 km) meteorological data by
        using the Weather Research and Forecasting Model to downscale ERA5
        reanalysis data.<sup>
          <a href="#ref-bieniek-2016" aria-label="Jump to reference 3">[3]</a>
        </sup>
        The dataset covers Central Alaska with hourly temporal resolution.
      </p>

      <div class="content">
        <h5 class="title is-5">Key Dataset Features:</h5>
        <ul>
          <li><strong>Spatial Resolution:</strong> 4 km grid spacing</li>
          <li><strong>Temporal Coverage:</strong> 1960 to 2023</li>
          <li>
            <strong>Temporal Resolution:</strong> Hourly data aggregated to
            daily values
          </li>
          <li><strong>Domain:</strong>Central Alaska</li>
          <li>
            <strong>Variables:</strong> Temperature, humidity, precipitation,
            wind, and more
          </li>
          <li>
            <strong>Methodology:</strong> WRF v4.3.3 dynamical downscaling of
            ERA5
          </li>
        </ul>
      </div>

      <div class="content">
        <h5 class="title is-5">Research Applications:</h5>
        <p>This high-resolution dataset enables detailed analysis of:</p>
        <ul>
          <li>Fire weather conditions and extreme event frequency</li>
          <li>Compound hot-dry events and their spatial patterns</li>
          <li>Climate change impacts on fire weather</li>
        </ul>
      </div>

      <!-- Data access information -->
      <GetAndUseData :api-url="`${runtimeConfig.public.apiUrl}/era5wrf/`">
        <template #preamble>
          <p>
            Access ERA5-WRF data with an API that provides daily values for
            selected variables.
          </p>
        </template>
      </GetAndUseData>

      <ReferencesList class="mt-6" :references="references" />
    </div>
  </section>
</template>

<style scoped>
.box {
  background-color: #fafafa;
  border: 1px solid #e0e0e0;
}
</style>
