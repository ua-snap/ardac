<script lang="ts" setup>
// Following existing story patterns
const placesStore = usePlacesStore()
const runtimeConfig = useRuntimeConfig()

// Search extent for ERA5-WRF domain (matches other ARDAC wildfire tools)
const era5wrfExtent = 'blockyAlaska'

onUnmounted(() => {
  // Clean up stores
  placesStore.latLng = undefined
  placesStore.selectedCommunity = undefined
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
        dataset. This 4 km resolution, dynamically downscaled reanalysis data
        allows detailed analysis of historical temperature and humidity patterns
        that create fire-prone conditions in Alaska.
      </p>

      <p>
        The combination of high temperatures and low humidity creates
        particularly dangerous fire weather conditions.
      </p>

      <div class="box mt-5">
        <h4 class="title is-4">Fire Weather Analysis</h4>

        <!-- Use ARDAC's standard location picker -->
        <Gimme :communities-enabled="true" :extent="era5wrfExtent" />

        <!-- Chart component -->
        <Era5WrfWrapper />
      </div>

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
        reanalysis data. The dataset covers Central Alaska with hourly temporal
        resolution.
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
    </div>
  </section>
</template>

<style scoped>
.box {
  background-color: #fafafa;
  border: 1px solid #e0e0e0;
}
</style>
