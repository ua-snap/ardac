<script lang="ts" setup>
const placesStore = usePlacesStore()
const mapStore = useMapStore()
const dataStore = useDataStore()
const runtimeConfig = useRuntimeConfig()

const apiData = computed<Record<string, any>>(() => dataStore.apiData)
const latLng = computed<LatLngValue>(() => placesStore.latLng)

const layers: MapLayer[] = [
  {
    id: 'indicator_ftc_historical_era',
    title: '1980–2009, TaiESM1',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_indicators',
    style: 'ardac_indicator_ftc_historical_era',
    legend: 'freeze_thaw_cycle',
    rasdamanConfiguration: { dim_model: 11, dim_scenario: 0 },
    coastline: true,
  },
  {
    id: 'indicator_ftc_midcentury_era',
    title: '2040–2069, TaiESM1, SSP5-8.5',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_indicators',
    style: 'ardac_indicator_ftc_midcentury_era',
    legend: 'freeze_thaw_cycle',
    rasdamanConfiguration: { dim_model: 11, dim_scenario: 4 },
    coastline: true,
  },
  {
    id: 'indicator_ftc_latecentury_era',
    title: '2070–2099, TaiESM1, SSP5-8.5',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_indicators',
    style: 'ardac_indicator_ftc_latecentury_era',
    legend: 'freeze_thaw_cycle',
    rasdamanConfiguration: { dim_model: 11, dim_scenario: 4 },
    coastline: true,
  },
]

const legend: Record<string, LegendItem[]> = {
  freeze_thaw_cycle: [
    { color: '#efefef', label: '&ge;0 days, &lt;20 days' },
    { color: '#dddddd', label: '&ge;20 days, &lt;40 days' },
    { color: '#ababab', label: '&ge;40 days, &lt;60 days' },
    { color: '#878787', label: '&ge;60 days, &lt;80 days' },
    { color: '#5c5c5c', label: '&ge;80 days' },
  ],
}

const mapId = 'freeze_thaw_cycle'
mapStore.setLegendItems(mapId, legend)
</script>

<template>
  <section class="section xray">
    <div class="content is-size-5">
      <h3 class="title is-3">Freeze/Thaw Cycle</h3>
      <XrayIntroblurb resolution="100" unit="km" cmip="6" beta />
      <p class="mb-6">
        Freeze/thaw cycle is the number of days where maximum daily temperatures
        are above freezing and minimum daily temperatures are at or below
        freezing. The map below shows the 30-year mean of CMIP6 freeze/thaw
        cycle for three eras. The historical era (1980&ndash;2009) uses
        historical modeled data provided by the TaiESM1 model. The mid-century
        (2040&ndash;2069) and late-century (2070&ndash;2099) eras use modeled
        projections from the TaiESM1 model under the SSP5-8.5 emissions
        scenario.
      </p>

      <MapBlock :mapId="mapId" crs="EPSG:3572" class="mb-6">
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
        Enter lat/lon coordinates below to see a chart of freeze/thaw cycle days
        for a point location. This chart displays annual min/mean/max values for
        modeled historical and projected decades for ten models and four
        scenarios. After entering lat/lon coordinates, links will be provided
        where you can download the data that is used to populate the chart.
      </p>

      <Gimme :bbox="[-180, 50, 180, 90]" />
      <IndicatorsCmip6ChartControls />
      <IndicatorsCmip6Chart
        label="Freeze/thaw cycle"
        units="days"
        dataKey="ftc"
      />

      <div v-if="latLng && apiData" class="my-6">
        <h4 class="title is-4">
          Download freeze/thaw cycle data for {{ latLng.lat }},
          {{ latLng.lng }}
        </h4>
        <p>
          The following download links bundle freeze/thaw cycle data with other
          climate indicators. Freeze/thaw cycle uses the "ftc" identifier.
        </p>
        <ul>
          <li>
            <a
              :href="
                runtimeConfig.public.apiUrl +
                '/indicators/cmip6/point/' +
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
                '/indicators/cmip6/point/' +
                latLng.lat +
                '/' +
                latLng.lng
              "
              >Download as JSON</a
            >
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
