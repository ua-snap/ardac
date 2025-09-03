<script lang="ts" setup>
const placesStore = usePlacesStore()
const mapStore = useMapStore()
const dataStore = useDataStore()
const runtimeConfig = useRuntimeConfig()

const apiData = computed<Record<string, any>>(() => dataStore.apiData)
const latLng = computed<LatLngValue>(() => placesStore.latLng)

const layers: MapLayer[] = [
  {
    id: 'indicator_csdi_historical_era',
    title: '1980–2009, Daymet',
    source: 'rasdaman',
    wmsLayerName: 'ncar12km_indicators_era_summaries',
    style: 'ardac_indicator_csdi',
    legend: 'csdi',
    rasdamanConfiguration: {
      dim_era: 0,
      dim_model: 0,
      dim_scenario: 0,
      dim_stat: 1,
    },
  },
  {
    id: 'indicator_csdi_midcentury_era',
    title: '2040–2069, NCAR CCSM4, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'ncar12km_indicators_era_summaries',
    style: 'ardac_indicator_csdi',
    legend: 'csdi',
    rasdamanConfiguration: {
      dim_era: 2,
      dim_model: 1,
      dim_scenario: 2,
      dim_stat: 1,
    },
  },
  {
    id: 'indicator_csdi_latecentury_era',
    title: '2070–2099, NCAR CCSM4, RCP 8.5',
    source: 'rasdaman',
    wmsLayerName: 'ncar12km_indicators_era_summaries',
    style: 'ardac_indicator_csdi',
    legend: 'csdi',
    rasdamanConfiguration: {
      dim_era: 1,
      dim_model: 1,
      dim_scenario: 2,
      dim_stat: 1,
    },
  },
]

const legend: Record<string, LegendItem[]> = {
  csdi: [
    { color: '#c6dbef', label: '&ge;0 occurrences, &lt;1 occurrences' },
    { color: '#9ecae1', label: '&ge;1 occurrences, &lt;2 occurrences' },
    { color: '#6baed6', label: '&ge;2 occurrences, &lt;4 occurrences' },
    { color: '#3182bd', label: '&ge;4 occurrences, &lt;8 occurrences' },
    { color: '#08519c', label: '&ge;8 occurrences' },
  ],
}

const mapId = 'cold_spell_duration_index'
mapStore.setLegendItems(mapId, legend)
</script>

<template>
  <section class="section xray">
    <div class="content is-size-5">
      <h3 class="title is-3">Cold Spell Duration Index</h3>
      <XrayIntroblurb resolution="~12" unit="km" cmip="5"/>
      <p class="mb-6">
        The cold spell duration index is the annual count of occurrences of at
        least 5 consecutive days with daily mean 2m air temperature above 90th
        percentile of historical values for the date. The map below shows the
        30-year mean of the cold spell duration index for three eras. The
        historical era (1980&ndash;2009) uses historical modeled data provided
        by the Daymet model. The mid-century (2040&ndash;2069) and late-century
        (2070&ndash;2099) eras use modeled projections from the NCAR CCSM4 model
        under the RCP 8.5 emissions scenario.
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
        Enter lat/lon coordinates below to see a chart of the cold spell
        duration index for a point location. This chart displays min/mean/max
        values for the historical modeled era (1980&ndash;2009) using Daymet and
        projections for the mid-century (2040&ndash;2069) and late-century
        (2070&ndash;2099) eras using both the MRI CGCM3 and NCAR CCSM4 models
        under two different emissions scenarios, RCP 4.5 and RCP 8.5.
      </p>

      <p>
        After entering lat/lon coordinates, links will be provided where you can
        download the data that is used to populate the chart.
      </p>

      <IndicatorsChart
        label="Cold spell duration index"
        units="occurrences"
        dataKey="csdi"
      />

      <div v-if="latLng && apiData" class="my-6">
        <h4 class="title is-4">
          Download cold spell duration index data for {{ latLng.lat }},
          {{ latLng.lng }}
        </h4>
        <p>
          The following download links bundle cold spell duration index data
          with other climate indicators. Cold spell duration index uses the
          "csdi" identifier.
        </p>
        <ul>
          <li>
            <a
              :href="
                runtimeConfig.public.apiUrl +
                '/indicators/base/point/' +
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
                '/indicators/base/point/' +
                latLng.lat +
                '/' +
                latLng.lng
              "
              >Download as JSON</a
            >
          </li>
        </ul>
      </div>
      <GetAndUseDataIndicators :presentInNcr="true" />
    </div>
  </section>
</template>

<style scoped></style>
