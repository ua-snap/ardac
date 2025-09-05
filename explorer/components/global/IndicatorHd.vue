<script lang="ts" setup>
const placesStore = usePlacesStore()
const mapStore = useMapStore()
const dataStore = useDataStore()
const runtimeConfig = useRuntimeConfig()

const apiData = computed<Record<string, any>>(() => dataStore.apiData)
const latLng = computed<LatLngValue>(() => placesStore.latLng)

const layers: MapLayer[] = [
  {
    id: 'indicator_hd_historical_era',
    title: '1980–2009, Daymet',
    source: 'rasdaman',
    wmsLayerName: 'ncar12km_indicators_era_summaries',
    style: 'ardac_indicator_hd',
    legend: 'hot_day_threshold',
    rasdamanConfiguration: {
      dim_era: 0,
      dim_model: 0,
      dim_scenario: 0,
      dim_stat: 1,
    },
  },
  {
    id: 'indicator_hd_midcentury_era',
    title: '2040–2069, NCAR CCSM4, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'ncar12km_indicators_era_summaries',
    style: 'ardac_indicator_hd',
    legend: 'hot_day_threshold',
    rasdamanConfiguration: {
      dim_era: 2,
      dim_model: 1,
      dim_scenario: 2,
      dim_stat: 1,
    },
  },
  {
    id: 'indicator_hd_latecentury_era',
    title: '2070–2099, NCAR CCSM4, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'ncar12km_indicators_era_summaries',
    style: 'ardac_indicator_hd',
    legend: 'hot_day_threshold',
    rasdamanConfiguration: {
      dim_era: 1,
      dim_model: 1,
      dim_scenario: 2,
      dim_stat: 1,
    },
  },
]

const legend: Record<string, LegendItem[]> = {
  hot_day_threshold: [
    { color: '#fdd0a2', label: '&lt;20&deg;C' },
    { color: '#fdae6b', label: '&ge;20&deg;C, &lt;25&deg;C' },
    { color: '#fd8d3c', label: '&ge;25&deg;C, &lt;30&deg;C' },
    { color: '#e6550d', label: '&ge;30&deg;C, &lt;35&deg;C' },
    { color: '#a63603', label: '&ge;35&deg;C' },
  ],
}

const mapId = 'hot_day_threshold'
mapStore.setLegendItems(mapId, legend)
</script>

<template>
  <section class="section xray">
    <div class="content is-size-5">
      <h3 class="title is-3">Hot Day Threshold</h3>
      <XrayIntroblurb resolution="~12" unit="km" cmip="5" />
      <p class="mb-6">
        The hot day threshold is the temperature at which only five days in a
        year are hotter. The map below shows the 30-year mean of the hot day
        threshold for three eras. The historical era (1980&ndash;2009) uses
        historical modeled data provided by the Daymet model. The mid-century
        (2040&ndash;2069) and late-century (2070&ndash;2099) eras use modeled
        projections from the NCAR CCSM4 model under the RCP 8.5 emissions
        scenario.
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
        Enter lat/lon coordinates below to see a chart of the hot day threshold
        for a point location. This chart displays min/mean/max values for the
        historical modeled era (1980&ndash;2009) using Daymet and projections
        for the mid-century (2040&ndash;2069) and late-century (2070&ndash;2099)
        eras using both the MRI CGCM3 and NCAR CCSM4 models under two different
        emissions scenarios, RCP 4.5 and RCP 8.5.
      </p>

      <p>
        After entering lat/lon coordinates, links will be provided where you can
        download the data that is used to populate the chart.
      </p>

      <IndicatorsChart label="Hot day threshold" units="&deg;C" dataKey="hd" />

      <div v-if="latLng && apiData" class="my-6">
        <h4 class="title is-4">
          Download hot day threshold data for {{ latLng.lat }},
          {{ latLng.lng }}
        </h4>
        <p>
          The following download links bundle hot day threshold data with other
          climate indicators. Hot day threshold uses the "hd" identifier.
        </p>
        <DownloadLinks endpoint="/indicators/cmip5/point" />
      </div>
      <GetAndUseDataIndicators :presentInNcr="true" />
    </div>
  </section>
</template>

<style scoped></style>
