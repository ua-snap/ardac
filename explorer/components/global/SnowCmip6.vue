<script lang="ts" setup>
const placesStore = usePlacesStore()
const mapStore = useMapStore()
const dataStore = useDataStore()
const runtimeConfig = useRuntimeConfig()

const apiData = computed<Record<string, any>>(() => dataStore.apiData)
const latLng = computed<LatLngValue>(() => placesStore.latLng)

const prsn_layers: MapLayer[] = [
  {
    id: 'prsn_cmip6_1950',
    title: 'March 1950, MIROC6',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_prsn',
    legend: 'prsn',
    default: true,
    rasdamanConfiguration: {
      dim_model: 9,
      dim_scenario: 0,
      time: '1950-03-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'prsn_cmip6_1975',
    title: 'March 1975, MIROC6',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_prsn',
    legend: 'prsn',
    rasdamanConfiguration: {
      dim_model: 9,
      dim_scenario: 0,
      time: '1975-03-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'prsn_cmip6_2000',
    title: 'March 2000, MIROC6',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_prsn',
    legend: 'prsn',
    rasdamanConfiguration: {
      dim_model: 9,
      dim_scenario: 0,
      time: '2000-03-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'prsn_cmip6_2025',
    title: 'March 2025, MIROC6',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_prsn',
    legend: 'prsn',
    rasdamanConfiguration: {
      dim_model: 9,
      dim_scenario: 4,
      time: '2025-03-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'prsn_cmip6_2050',
    title: 'March 2050, MIROC6',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_prsn',
    legend: 'prsn',
    rasdamanConfiguration: {
      dim_model: 9,
      dim_scenario: 4,
      time: '2050-03-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'prsn_cmip6_2075',
    title: 'March 2075, MIROC6',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_prsn',
    legend: 'prsn',
    rasdamanConfiguration: {
      dim_model: 9,
      dim_scenario: 4,
      time: '2075-03-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'prsn_cmip6_2100',
    title: 'March 2100, MIROC6',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_prsn',
    legend: 'prsn',
    rasdamanConfiguration: {
      dim_model: 9,
      dim_scenario: 4,
      time: '2100-03-15T12:00:00.000Z',
    },
    coastline: true,
  },
]

const snw_layers: MapLayer[] = [
  {
    id: 'snw_cmip6_1950',
    title: 'March 1950, MIROC6',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_snw',
    legend: 'snw',
    rasdamanConfiguration: {
      dim_model: 9,
      dim_scenario: 0,
      time: '1950-03-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'snw_cmip6_1975',
    title: 'March 1975, MIROC6',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_snw',
    legend: 'snw',
    rasdamanConfiguration: {
      dim_model: 9,
      dim_scenario: 0,
      time: '1975-03-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'snw_cmip6_2000',
    title: 'March 2000, MIROC6',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_snw',
    legend: 'snw',
    rasdamanConfiguration: {
      dim_model: 9,
      dim_scenario: 0,
      time: '2000-03-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'snw_cmip6_2025',
    title: 'March 2025, MIROC6',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_snw',
    legend: 'snw',
    rasdamanConfiguration: {
      dim_model: 9,
      dim_scenario: 4,
      time: '2025-03-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'snw_cmip6_2050',
    title: 'March 2050, MIROC6',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_snw',
    legend: 'snw',
    rasdamanConfiguration: {
      dim_model: 9,
      dim_scenario: 4,
      time: '2050-03-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'snw_cmip6_2075',
    title: 'March 2075, MIROC6',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_snw',
    legend: 'snw',
    rasdamanConfiguration: {
      dim_model: 9,
      dim_scenario: 4,
      time: '2075-03-15T12:00:00.000Z',
    },
    coastline: true,
  },
  {
    id: 'snw_cmip6_2100',
    title: 'March 2100, MIROC6',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_monthly',
    style: 'ardac_snw',
    legend: 'snw',
    rasdamanConfiguration: {
      dim_model: 9,
      dim_scenario: 4,
      time: '2100-03-15T12:00:00.000Z',
    },
    coastline: true,
  },
]

const legend: Record<string, LegendItem[]> = {
  prsn: [
    {
      color: '#edf8fbff',
      label:
        '&ge; 0 kg m&#8315;&sup2; s&#8315;&sup1;, &lt; 20 kg m&#8315;&sup2; s&#8315;&sup1;',
    },
    {
      color: '#b2e2e2ff',
      label:
        '&ge; 20 kg m&#8315;&sup2; s&#8315;&sup1;, &lt; 40 kg m&#8315;&sup2; s&#8315;&sup1;',
    },
    {
      color: '#66c2a4ff',
      label:
        '&ge; 40 kg m&#8315;&sup2; s&#8315;&sup1;, &lt; 60 kg m&#8315;&sup2; s&#8315;&sup1;',
    },
    {
      color: '#2ca25fff',
      label:
        '&ge; 60 kg m&#8315;&sup2; s&#8315;&sup1;, &lt; 80 kg m&#8315;&sup2; s&#8315;&sup1;',
    },
    { color: '#006d2cff', label: '&ge; 80 kg m&#8315;&sup2; s&#8315;&sup1;' },
  ],
  snw: [
    { color: '#edf8fbff', label: '&ge;0 mm, &lt;75 mm' },
    { color: '#b2e2e2ff', label: '&ge;75 mm, &lt;150 mm' },
    { color: '#66c2a4ff', label: '&ge;150 mm, &lt;225 mm' },
    { color: '#2ca25fff', label: '&ge;225 mm, &lt;300 mm' },
    { color: '#006d2cff', label: '&ge;300 mm' },
  ],
}

const mapId = 'sea_ice_cmip6'
mapStore.setLegendItems(mapId, legend)
</script>

<template>
  <section class="section xray">
    <div class="content is-size-5">
      <XrayIntroblurb resolution="100" unit="km" cmip="6" beta />
      <h3 class="title is-3">Snow, CMIP6</h3>
      <p class="mb-6">
        The map below shows modeled snow variables for the month of March using
        the MIROC6 model at 25-year intervals from 1950&ndash;2100. Intervals
        from 2025&ndash;2100 are based on the SSP5-8.5 emissions scenario.
      </p>

      <MapBlock :mapId="mapId" crs="EPSG:3572" class="mb-6">
        <template v-slot:layers>
          <h4 class="title is-4 mb-3">Precipitation as Snow</h4>
          <MapLayer
            v-for="layer in prsn_layers"
            :mapId="mapId"
            :layer="layer"
            :key="layer.id"
            :default="layer.default"
          >
            <template v-slot:title>{{ layer.title }}</template>
          </MapLayer>
          <h4 class="title is-4 mb-3">Snow Water Equivalent</h4>
          <MapLayer
            v-for="layer in snw_layers"
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
        Enter a location below to see a chart of the monthly snow water
        equivalent and precipitation as snow for a point location using the
        selected model, emissions scenario, and month. After entering a
        location, links will be provided where you can download the data that is
        used to populate the chart.
      </p>

      <Gimme :bbox="[-180, 45, 180, 90]" />
      <Cmip6MonthlyChartControls
        defaultModel="MIROC6"
        defaultMonth="12"
        :datasetKeys="['prsn', 'snw']"
      />
      <Cmip6MonthlyChart
        label="Precipitation as Snow"
        units="kg m⁻² s⁻¹"
        dataKey="prsn"
        class="mb-5"
      />
      <Cmip6MonthlyChart
        label="Snow Water Equivalent"
        units="mm"
        dataKey="snw"
      />

      <div v-if="latLng && apiData" class="my-6">
        <h4 class="title is-4">
          Download CMIP6 snow data for {{ latLng.lat }},
          {{ latLng.lng }}
        </h4>
        <ul>
          <li>
            <a
              :href="
                runtimeConfig.public.apiUrl +
                '/cmip6/point/' +
                latLng.lat +
                '/' +
                latLng.lng +
                '?vars=prsn,snw&format=csv'
              "
              >Download as CSV</a
            >
          </li>
          <li>
            <a
              :href="
                runtimeConfig.public.apiUrl +
                '/cmip6/point/' +
                latLng.lat +
                '/' +
                latLng.lng +
                '?vars=prsn,snw'
              "
              >Download as JSON</a
            >
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
