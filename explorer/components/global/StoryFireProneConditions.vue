<script lang="ts" setup>
const placesStore = usePlacesStore()
const dataStore = useDataStore()
const runtimeConfig = useRuntimeConfig()

const era5wrfExtent = 'cmip6Downscaled'
</script>

<template>
  <section class="section">
    <div class="content clamp is-size-5">
      <h3 class="title is-3">Fire-Prone Conditions in Alaska</h3>

      <p>
        Explore daily fire weather conditions using the high-resolution ERA5-WRF
        dynamically downscaled reanalysis dataset. By analyzing temperature,
        humidity, and precipitation, we can identify periods when conditions
        were particularly favorable for wildfires. Several atmospheric
        conditions combine to influence wildfire ignition: heat, humidity, and
        precipitation. Days that are both hot (temperature exceeds the 90th
        percentile of the climatological normal range) and dry (humidity falls
        below the 10th percentile of the climatological normal range)
        simultaneously may be considered &ldquo;fire-prone&rdquo; days. High
        temperatures and low humidity dry out vegetation while extended periods
        without precipitation allow fuels to accumulate and become increasingly
        flammable.
      </p>
      <p>
        The 2004 Alaska summer produced several instances of fire-prone
        conditions, culminating in the largest fire season on record for Alaska:
        6.6 million acres burned. The Taylor Complex, a group of several large
        fires, accounted for more than 1.7 million acres burned in eastern
        Alaska near the Yukon border. To analyze how temperature and humidity
        extremes drove the Taylor Complex fire behavior, set the
        <strong>Year Selection</strong> control to 2004 and choose Tok (or
        another nearby community or latitude/longitude location) in the location
        selector and follow along with the narrative below. and notice how the
        chart and count of hot and dry days respond. Afterward, experiment with
        any fire season from <strong>1960 through 2023</strong> to see how other
        years compare to 2004. Use the <strong>Reference Period</strong> radio
        buttons to compare any season against either the 1960&ndash;1989 or
        1990&ndash;2019 reference period and see how conditions deviated from
        the climatological normals.
      </p>

      <div class="mt-5">
        <h4 class="title is-4">Fire-Prone Conditions</h4>

        <p class="mb-3">
          Pick a community or enter latitude/longitude coordinates to load
          ERA5-WRF data for that location. Select a fire season year to analyze
          and compare against the climatologies.
        </p>
        <Gimme :communities-enabled="true" :extent="era5wrfExtent" />

        <Era5WrfFireWeatherWrapper />
      </div>

      <h4 class="title is-4">
        Taylor Complex 2004: Heat, Drying, and Rapid Expansion
      </h4>
      <p>
        The Taylor Complex and related 2004 fires demonstrate how overlapping
        extremes drive fire behavior. In June the daily maximum temperatures
        climb into the high 20s&#8239;&deg;C while the minimum relative humidity
        plummets creating hot and dry pairing that allowed surface fuels to
        flash-dry. Warmer air supported widespread convection, numerous
        thunderstorms, and a record lightning count. Lightning on
        <strong>June 26</strong> ignited the Taylor Complex.
      </p>
      <p>
        Around June 28, daily maximum temperatures approached
        <strong>29&#8239;&deg;C</strong> while minimum relative humidity dropped
        to near <strong>20%</strong>. In the chart, notice how simultaneous high
        temperatures and very low RH persist over several days at the end of
        June.
      </p>
      <p>
        In early July, the Taylor Complex begins to moderate its own weather:
        the complex generated such a dense smoke plume that local solar
        radiation was blcoked and temperatures dropped toward 15&#8239;&deg;C
        and humidity rebounded into the 50 percent range. Fire activity
        lessened. In the chart, this pause appears as a dip in temperature and
        and a spike in relative humidity. As the smoke plume thinned, solar
        heating returned. By July 15 maximum temperatures rebounded to around
        27&#8239;&deg;C while relative humidity again fell. This second active
        fire period shows up in the chart as another cluster of hot, dry days
        that fall outside the normal climatology range.
      </p>
      <p>
        August, typically one of the cooler and wetter summer months in Interior
        Alaska, was unusually warm and dry. Compare August 2004 with other years
        to see how the percentile bands highlight the depth of the anomalies.A
        third major fire peak around August 21 extended fire activity into
        September, until cooling temperatures, and ultimately snowfall
        diminished fire activity. The Taylor Complex expanded during two
        dominant hot-dry episodes (late June and mid&ndash;July) and a a
        late-season pulse. Use the controls to juxtapose 2004 with quieter fire
        seasons and learn how each year diverges from the 1960&ndash;1989 and
        1990&ndash;2019 baselines. Explore other locations to see how fire
        weather conditions differ across Alaska for different fire seasons.
      </p>

      <h4 class="title is-4">About the ERA5-WRF Dataset</h4>

      <p>
        This data story uses the ERA5-WRF dynamically downscaled dataset, which
        provides high-resolution (4&#8239;km) meteorological data by using the Weather
        Research and Forecasting Model to downscale ERA5 reanalysis data. The
        dataset covers mainland Alaska and adjacent Canada. The source dataset
        has hourly temporal resolution, and is aggregated to a daily resolution
        here.
      </p>

      <GetAndUseData :api-url="`${runtimeConfig.public.apiUrl}/era5wrf/`">
        <template #preamble>
          <p>
            Access ERA5-WRF data with an API that provides daily values for
            selected variables.
          </p>
        </template>
      </GetAndUseData>
    </div>
  </section>
</template>

<style scoped>
.box {
  background-color: #fafafa;
  border: 1px solid #e0e0e0;
}
</style>
