<script lang="ts" setup>
const endpoint = 'cmip6Monthly'

const mapStore = useMapStore()
const dataStore = useDataStore()

const cmip6_layers: MapLayer[] = [
  {
    id: 'tasmax_cmip6_2000',
    title: '2000, CNRM-CM6-1-HR',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_tasmax',
    legend: 'tas',
    rasdamanConfiguration: {
      dim_model: 1,
      dim_scenario: 0,
      time: '2000-07-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'tasmax_cmip6_2100',
    title: '2100, CNRM-CM6-1-HR, SSP5-8.5',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_tasmax',
    legend: 'tas',
    rasdamanConfiguration: {
      dim_model: 1,
      dim_scenario: 4,
      time: '2100-07-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'tasmin_cmip6_2000',
    title: '2000, CNRM-CM6-1-HR',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_tasmin',
    legend: 'tas',
    rasdamanConfiguration: {
      dim_model: 1,
      dim_scenario: 0,
      time: '2000-01-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'tasmin_cmip6_2100',
    title: '2100, CNRM-CM6-1-HR, SSP5-8.5',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_tasmin',
    legend: 'tas',
    rasdamanConfiguration: {
      dim_model: 1,
      dim_scenario: 4,
      time: '2100-01-15T12:00:00.000Z',
    },
    coastline: true,
  },
]

const cmip6_legend: Record<string, LegendItem[]> = {
  tas: [
    { color: '#6468ac', label: '&lt;-20°C' },
    { color: '#7394c1', label: '&ge;-20°C, &lt;-15°C' },
    { color: '#94bcd5', label: '&ge;-15°C, &lt;-10°C' },
    { color: '#badae5', label: '&ge;-10°C, &lt;-5°C' },
    { color: '#e0ecf1', label: '&ge;-5°C, &lt;0°C' },
    { color: '#f4e0a9', label: '&ge;0°C, &lt;5°C' },
    { color: '#f4bc88', label: '&ge;5°C, &lt;10°C' },
    { color: '#ef9073', label: '&ge;10°C, &lt;15°C' },
    { color: '#dc6961', label: '&ge;15°C, &lt;20°C' },
    { color: '#ba505e', label: '&ge;20°C' },
  ],
}

const cmip6_mapId = 'cmip6_tas'
mapStore.setLegendItems(cmip6_mapId, cmip6_legend)

const cmip6_downscaled_layers: MapLayer[] = [
  {
    id: 'tasmax_cmip6_2000',
    title: '2000, CNRM-CM6-1-HR',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_downscaled_tasmax_wms',
    style: 'ardac_tasmax',
    legend: 'tas',
    rasdamanConfiguration: {
      dim_model: 1,
      dim_scenario: 0,
      dim_year: 0,
    },
    coastline: true,
  },
  {
    id: 'tasmax_cmip6_2100',
    title: '2100, CNRM-CM6-1-HR',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_downscaled_tasmax_wms',
    style: 'ardac_tasmax',
    legend: 'tas',
    rasdamanConfiguration: {
      dim_model: 1,
      dim_scenario: 1,
      dim_year: 1,
    },
    coastline: true,
  },
  {
    id: 'tasmin_cmip6_2000',
    title: '2000, CNRM-CM6-1-HR',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_downscaled_tasmin_wms',
    style: 'ardac_tasmin',
    legend: 'tas',
    rasdamanConfiguration: {
      dim_model: 1,
      dim_scenario: 0,
      dim_year: 0,
    },
    coastline: true,
  },
  {
    id: 'tasmin_cmip6_2100',
    title: '2100, CNRM-CM6-1-HR, SSP5-8.5',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_downscaled_tasmin_wms',
    style: 'ardac_tasmin',
    legend: 'tas',
    rasdamanConfiguration: {
      dim_model: 1,
      dim_scenario: 1,
      dim_year: 1,
    },
    coastline: true,
  },
]

const cmip6_downscaled_legend: Record<string, LegendItem[]> = {
  tas: [
    { color: '#6468ac', label: '&lt;-20°C' },
    { color: '#7394c1', label: '&ge;-20°C, &lt;-15°C' },
    { color: '#94bcd5', label: '&ge;-15°C, &lt;-10°C' },
    { color: '#badae5', label: '&ge;-10°C, &lt;-5°C' },
    { color: '#e0ecf1', label: '&ge;-5°C, &lt;0°C' },
    { color: '#f4e0a9', label: '&ge;0°C, &lt;5°C' },
    { color: '#f4bc88', label: '&ge;5°C, &lt;10°C' },
    { color: '#ef9073', label: '&ge;10°C, &lt;15°C' },
    { color: '#dc6961', label: '&ge;15°C, &lt;20°C' },
    { color: '#ba505e', label: '&ge;20°C' },
  ],
}

const cmip6_downscaled_mapId = 'cmip6_downscaled_tas'
mapStore.setLegendItems(cmip6_downscaled_mapId, cmip6_downscaled_legend)
</script>

<template>
  <section class="section">
    <div class="content is-size-5">
      <h3 class="title is-3">
        CMIP6: Increasing resolution through downscaling
      </h3>

      <p>
        Raw outputs from General Circulation Models (GCMs) are helpful to get a
        glimpse into how the climate is likely to change at a global scale, but
        they have limitations. When zooming in on a particular region like
        Alaska, for example, the data is very coarse (low resolution) and
        difficult to relate to local communities and areas. This is where
        downscaling helps.
      </p>

      <p>
        Downscaling is the process of producing a higher-resolution dataset from
        low-resolution GCM data. Downscaling has two flavors:
      </p>

      <ul>
        <li>
          <strong>Statistical downscaling:</strong> Use the historical period of
          a high-resolution dataset that is based on observed data, compared to
          the historical baseline of a low-resolution GCM dataset, to draw
          inferences about how conditions are likely to change at a local scale
        </li>
        <li>
          <strong>Dynamical downscaling</strong>: Use low-resolution GCM data as
          inputs into a weather forecasting model to simulate conditions at a
          local scale using physical laws
        </li>
      </ul>

      <p>
        <a href="https://uaf-snap.org/how-do-we-do-it/downscaling/"
          >Read more about these downscaling methods</a
        >
      </p>

      <p>
        Previously, we have made CMIP6 data of the non-downscaled variety
        available through ARDAC Explorer. These datasets are not strictly raw
        CMIP6 data. They are cropped and regridded to a pan-Arctic projection
        but still very coarse at a resolution of 100 km. For example, here is a
        map of regridded, low-resolution, pan-Arctic mean monthly temperature
        data for the CNRM-CM6-1-HR model:
      </p>

      <MapBlock :mapId="cmip6_mapId" crs="EPSG:3572" :zoom="7" class="mb-6">
        <template v-slot:layers>
          <h4 class="title is-4 mb-3">
            July Maximum Near-surface Air Temperature
          </h4>
          <MapLayer :mapId="cmip6_mapId" :layer="cmip6_layers[0]" default>
            <template v-slot:title>{{ cmip6_layers[0].title }}</template>
          </MapLayer>
          <MapLayer :mapId="cmip6_mapId" :layer="cmip6_layers[1]">
            <template v-slot:title>{{ cmip6_layers[1].title }}</template>
          </MapLayer>
          <hr />
          <h4 class="title is-4 mb-3">
            January Minimum Near-surface Air Temperature
          </h4>
          <MapLayer :mapId="cmip6_mapId" :layer="cmip6_layers[2]">
            <template v-slot:title>{{ cmip6_layers[2].title }}</template>
          </MapLayer>
          <MapLayer :mapId="cmip6_mapId" :layer="cmip6_layers[3]">
            <template v-slot:title>{{ cmip6_layers[3].title }}</template>
          </MapLayer>
        </template>
      </MapBlock>

      <p>
        Zoom into Alaska and notice how coarse the data are compared to the map
        below of the new downscaled CMIP6 product. The high resolution (4 km)
        CMIP6 data are produced by statistically downscaling the low resolution
        CMIP6 model outputs to a dynamically downscaled (via the Weather
        Research and Forecasting model) ERA5 reanalysis historical reference.
      </p>

      <MapBlock :mapId="cmip6_downscaled_mapId" class="mb-6">
        <template v-slot:layers>
          <h4 class="title is-4 mb-3">
            July Maximum Near-surface Air Temperature
          </h4>
          <MapLayer
            :mapId="cmip6_downscaled_mapId"
            :layer="cmip6_downscaled_layers[0]"
            default
          >
            <template v-slot:title>{{
              cmip6_downscaled_layers[0].title
            }}</template>
          </MapLayer>
          <MapLayer
            :mapId="cmip6_downscaled_mapId"
            :layer="cmip6_downscaled_layers[1]"
          >
            <template v-slot:title>{{
              cmip6_downscaled_layers[1].title
            }}</template>
          </MapLayer>
          <hr />
          <h4 class="title is-4 mb-3">
            January Minimum Near-surface Air Temperature
          </h4>
          <MapLayer
            :mapId="cmip6_downscaled_mapId"
            :layer="cmip6_downscaled_layers[2]"
          >
            <template v-slot:title>{{
              cmip6_downscaled_layers[2].title
            }}</template>
          </MapLayer>
          <MapLayer
            :mapId="cmip6_downscaled_mapId"
            :layer="cmip6_downscaled_layers[3]"
          >
            <template v-slot:title>{{
              cmip6_downscaled_layers[3].title
            }}</template>
          </MapLayer>
        </template>
      </MapBlock>

      <p>
        Notice that the downscaled map has a much higher resolution, and also
        how the downscaled data correlates with the blockier non-downscaled map
        for Alaska. You will also notice that the extent of the downscaled
        dataset is limited to most of Alaska and a small region of western
        Canada. Computational capacity, observed historical data, and local
        expertise are all factors that influence the extent of a downscaled data
        product.
      </p>

      <p>
        To explore our new downscaled CMIP6 data products, visit the
        <NuxtLink to="/tag/CMIP6">CMIP6 topic</NuxtLink>
        page.
      </p>
    </div>
  </section>
</template>

<style scoped></style>
