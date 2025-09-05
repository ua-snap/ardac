<script lang="ts" setup>
const placesStore = usePlacesStore()
const mapStore = useMapStore()
const dataStore = useDataStore()
const runtimeConfig = useRuntimeConfig()

const apiData = computed<Record<string, any>>(() => dataStore.apiData)
const latLng = computed<LatLngValue>(() => placesStore.latLng)
const selectedCommunity = computed<CommunityValue>(
  () => placesStore.selectedCommunity
)

const layers: MapLayer[] = [
  {
    id: 'indicator_su_historical_era',
    title: '1980–2009, TaiESM1',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_indicators',
    style: 'ardac_indicator_su_historical_era',
    legend: 'summer_days',
    rasdamanConfiguration: { dim_model: 11, dim_scenario: 0 },
    coastline: true,
  },
  {
    id: 'indicator_su_midcentury_era',
    title: '2040–2069, TaiESM1, SSP5-8.5',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_indicators',
    style: 'ardac_indicator_su_midcentury_era',
    legend: 'summer_days',
    rasdamanConfiguration: { dim_model: 11, dim_scenario: 4 },
    coastline: true,
  },
  {
    id: 'indicator_su_latecentury_era',
    title: '2070–2099, TaiESM1, SSP5-8.5',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_indicators',
    style: 'ardac_indicator_su_latecentury_era',
    legend: 'summer_days',
    rasdamanConfiguration: { dim_model: 11, dim_scenario: 4 },
    coastline: true,
  },
]

const legend: Record<string, LegendItem[]> = {
  summer_days: [
    { color: '#f4d4b4', label: '&ge;0 days, &lt;5 days' },
    { color: '#f4bc8f', label: '&ge;5 days, &lt;10 days' },
    { color: '#f5a570', label: '&ge;10 days, &lt;20 days' },
    { color: '#e58057', label: '&ge;20 days, &lt;40 days' },
    { color: '#b8694d', label: '&ge;40 days' },
  ],
}

const mapId = 'summer_days'
mapStore.setLegendItems(mapId, legend)
</script>

<template>
  <section class="section xray">
    <div class="content is-size-5">
      <h3 class="title is-3">Summer Days, CMIP6</h3>
      <XrayIntroblurb resolution="100" unit="km" cmip="6" beta />
      <p class="mb-6">
        Summer days are the number of days per year that are above 77&deg;F. The
        map below shows the 30-year mean of CMIP6 summer days for three eras.
        The historical era (1980&ndash;2009) uses historical modeled data
        provided by the TaiESM1 model. The mid-century (2040&ndash;2069) and
        late-century (2070&ndash;2099) eras use modeled projections from the
        TaiESM1 model under the SSP5-8.5 emissions scenario.
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
        Enter lat/lon coordinates below to see a chart of CMIP6 summer days for
        a point location. This chart displays annual min/mean/max values for
        modeled historical and projected decades for ten models and four
        scenarios. After entering lat/lon coordinates, links will be provided
        where you can download the data that is used to populate the chart.
      </p>

      <Gimme :bbox="[-180, 50, 180, 90]" />
      <IndicatorsCmip6ChartControls />
      <IndicatorsCmip6Chart label="Summer days" dataKey="su" />

      <div v-if="latLng && apiData" class="my-6">
        <h4 class="title is-4">
          Download CMIP6 summer days data for
          {{ selectedCommunity ? selectedCommunity.name + ' at ' : '' }}
          {{ latLng.lat }},
          {{ latLng.lng }}
        </h4>
        <p>
          The following download links bundle summer days data with other CMIP6
          climate indicators. Summer days use the "su" identifier.
        </p>
        <DownloadLinks endpoint="/indicators/cmip6/point" />
      </div>
    </div>
  </section>
</template>

<style scoped></style>
