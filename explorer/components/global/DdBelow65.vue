<script lang="ts" setup>
const placesStore = usePlacesStore()
const mapStore = useMapStore()
const dataStore = useDataStore()
const runtimeConfig = useRuntimeConfig()

const apiData = computed<Record<string, any>>(() => dataStore.apiData)
const latLng = computed<LatLngValue>(() => placesStore.latLng)

const layers: MapLayer[] = [
  {
    id: 'dd_below_65_historical_era',
    title: '1980–2009, Daymet',
    source: 'rasdaman',
    wmsLayerName: 'heating_degree_days_Fdays',
    style: 'ardac_dd_below_65_historical_era',
    legend: 'dd_below_65',
  },
  {
    id: 'dd_below_65_midcentury_era',
    title: '2040–2069, NCAR CCSM4, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'heating_degree_days_Fdays',
    style: 'ardac_dd_below_65_midcentury_era',
    legend: 'dd_below_65',
  },
  {
    id: 'dd_below_65_latecentury_era',
    title: '2070–2099, NCAR CCSM4, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'heating_degree_days_Fdays',
    style: 'ardac_dd_below_65_latecentury_era',
    legend: 'dd_below_65',
  },
]

const legend: Record<string, LegendItem[]> = {
  dd_below_65: [
    { color: '#c6dbef', label: '&ge;0 F&sdot;days, &lt;4000 F&sdot;days' },
    { color: '#9ecae1', label: '&ge;4000 F&sdot;days, &lt;8000 F&sdot;days' },
    { color: '#6baed6', label: '&ge;8000 F&sdot;days, &lt;12000 F&sdot;days' },
    { color: '#3182bd', label: '&ge;12000 F&sdot;days, &lt;16000 F&sdot;days' },
    { color: '#08519c', label: '&ge;16000 F&sdot;days' },
  ],
}

const mapId = 'dd_below_65'
mapStore.setLegendItems(mapId, legend)
</script>

<template>
  <section class="section xray">
    <div class="content is-size-5">
      <h3 class="title is-3">Degree Days Below 65&deg;F</h3>
      <XrayIntroblurb resolution="~12" unit="km" cmip="5" />
      <p class="mb-6">
        Degree days below 65&deg;F, also known as heating degree days, are used
        to approximate the energy needed to heat a building in a given year. The
        map below shows the 30-year mean of degree bays below 65&deg;F for three
        eras. The historical era (1980&ndash;2009) uses historical modeled data
        provided by the Daymet model. The mid-century (2040&ndash;2069) and
        late-century (2070&ndash;2099) eras use modeled projections from the
        NCAR CCSM4 model under the RCP 8.5 emissions scenario.
      </p>

      <MapBlock :mapId="mapId" class="mb-6">
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
        Enter lat/lon coordinates below to see a chart of degree days below
        65&deg;F for a point location. This chart displays min/mean/max values
        for historical decades using the Daymet model and projected decades
        using both the GFDL CM3 and NCAR CCSM4 models under the RCP 8.5
        emissions scenario.
      </p>

      <p>
        After entering lat/lon coordinates, links will be provided where you can
        download the data that is used to populate the chart.
      </p>

      <DegreeDaysChart
        endpoint="heatingDegreeDays"
        label="Degree days below 65&deg;F"
      />

      <div v-if="latLng && apiData" class="my-6">
        <h4 class="title is-4">
          Download degree days below 65&deg;F data for {{ latLng.lat }},
          {{ latLng.lng }}
        </h4>
        <DownloadLinks endpoint="/degree_days/heating" />
      </div>
      <GetAndUseDataDegreeDays :presentInEds="true" />
    </div>
  </section>
</template>

<style scoped></style>
