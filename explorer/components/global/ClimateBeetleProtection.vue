<script lang="ts" setup>
const endpoint = 'beetles'

const placesStore = usePlacesStore()
const mapStore = useMapStore()
const dataStore = useDataStore()
const runtimeConfig = useRuntimeConfig()

const snowpackInput = defineModel('snowpack', { default: 'medium' })
const scenarioInput = defineModel('scenario', { default: 'rcp85' })

const apiData = computed<Record<string, any>>(() => dataStore.apiData[endpoint])
const latLng = computed<LatLngValue>(() => placesStore.latLng)

const eras = ['2010-2039', '2040-2069', '2070-2099']
const models = ['NCAR-CCSM4', 'GFDL-ESM2M', 'HadGEM2-ES', 'MRI-CGCM3']

const snowpackLabels: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
}

const scenarioLabels: Record<string, string> = {
  rcp45: 'RCP 4.5',
  rcp85: 'RCP 8.5',
}

const layers: MapLayer[] = [
  {
    id: 'beetles_historical_era',
    title: '1980–2009, Daymet, Medium Snowpack',
    source: 'rasdaman',
    wmsLayerName: 'beetle_risk',
    style: 'beetle_risk',
    legend: 'beetles',
    rasdamanConfiguration: {
      dim_era: 0,
      dim_model: 0,
      dim_scenario: 0,
      dim_snowpack: 1,
    },
  },
  {
    id: 'beetles_midcentury_era',
    title: '2040–2069, NCAR CCSM4, RCP 8.5, Medium Snowpack',
    source: 'rasdaman',
    wmsLayerName: 'beetle_risk',
    style: 'beetle_risk',
    legend: 'beetles',
    rasdamanConfiguration: {
      dim_era: 2,
      dim_model: 1,
      dim_scenario: 2,
      dim_snowpack: 1,
    },
  },
  {
    id: 'beetles_latecentury_era',
    title: '2070–2099, NCAR CCSM4, RCP 8.5, Medium Snowpack',
    source: 'rasdaman',
    wmsLayerName: 'beetle_risk',
    style: 'beetle_risk',
    legend: 'beetles',
    rasdamanConfiguration: {
      dim_era: 3,
      dim_model: 1,
      dim_scenario: 2,
      dim_snowpack: 1,
    },
  },
]

const legend: Record<string, LegendItem[]> = {
  beetles: [
    { color: '#00B800', label: 'High' },
    { color: '#FFEF0A', label: 'Minimal' },
    { color: '#FB2F18', label: 'None' },
  ],
}

const mapId = 'beetles'
mapStore.setLegendItems(mapId, legend)

watch(latLng, async () => {
  dataStore.apiData[endpoint] = null
  dataStore.fetchData(endpoint)
})

onUnmounted(() => {
  dataStore.apiData[endpoint] = null
})
</script>

<template>
  <section class="section xray">
    <div class="content is-size-5">
      <h3 class="title is-3">Climate Protection from Spruce Beetles</h3>
      <XrayIntroblurb resolution="~12" unit="km" cmip="5" />
      <p class="mb-6">
        The map below shows the 30-year mean of climate protection from spruce
        beetles for three eras with medium snowpack. The historical era
        (1980&ndash;2009) uses historical modeled data provided by the Daymet
        model. The mid-century (2040&ndash;2069) and late-century
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
        Enter lat/lon coordinates below to see a table of climate protection
        from spruce beetles for a point location. This table displays climate
        protection levels for the historical modeled era (1980&ndash;2009) using
        Daymet and projections for the mid-century (2040&ndash;2069) and
        late-century (2070&ndash;2099) eras using the NCAR CCSM4, GFDL ESM2M,
        HadGEM2 ES, and MRI CGCM3 models under two different emissions scenarios
        (RCP 4.5 and RCP 8.5) and two different snowpack levels (low and
        medium).
      </p>

      <p>
        After entering lat/lon coordinates, links will be provided where you can
        download the data that is used to populate the table.
      </p>

      <Gimme extent="blockyAlaska" />

      <div v-if="latLng && apiData">
        <div class="parameter">
          <label for="snowpack" class="label">Snowpack:</label>
          <div class="select mb-5 mr-3">
            <select id="snowpack" v-model="snowpackInput">
              <option
                v-for="snowpack in Object.keys(snowpackLabels)"
                :value="snowpack"
              >
                {{ snowpackLabels[snowpack] }}
              </option>
            </select>
          </div>
        </div>
        <div class="parameter mb-5">
          <label for="scenario" class="label">Scenario:</label>
          <div class="select">
            <select id="scenario" v-model="scenarioInput">
              <option
                v-for="scenario in Object.keys(scenarioLabels)"
                :value="scenario"
              >
                {{ scenarioLabels[scenario] }}
              </option>
            </select>
          </div>
        </div>
        <h4 class="title is-4">
          Climate protection from spruce beetles for {{ latLng.lat }},
          {{ latLng.lng }} with
          {{ snowpackLabels[snowpackInput].toLowerCase() }} snowpack
        </h4>
        <table class="mb-6">
          <tr>
            <th>Model</th>
            <th>1988&ndash;2017</th>
            <th>2010&ndash;2039</th>
            <th>2040&ndash;2069</th>
            <th>2070&ndash;2099</th>
          </tr>
          <tr>
            <td>Daymet</td>
            <td>
              {{
                apiData['1988-2017']['Daymet']['Historical'][snowpackInput][
                  'climate-protection'
                ]
              }}
            </td>
            <td>N/A</td>
            <td>N/A</td>
            <td>N/A</td>
          </tr>
          <tr v-for="model in models">
            <td>
              {{ model.replace('-', ' ') }} ({{
                scenarioLabels[scenarioInput]
              }})
            </td>
            <td>N/A</td>
            <td v-for="era in eras">
              <span v-if="era == '1988-2017'">
                {{
                  apiData[era]['Daymet']['Historical'][snowpackInput][
                    'climate-protection'
                  ]
                }}
              </span>
              <span v-else>
                {{
                  apiData[era][model][scenarioInput][snowpackInput][
                    'climate-protection'
                  ]
                }}
              </span>
            </td>
          </tr>
        </table>
        <h4 class="title is-4">
          Download climate protection from spruce beetles data for
          {{ latLng.lat }},
          {{ latLng.lng }}
        </h4>
        <DownloadLinks endpoint="/beetles/point" />
      </div>
      <GetAndUseDataBeetle />
    </div>
    <Bios :people="['Nancy Fresco', 'Kyle Redilla']" />
  </section>
</template>

<style lang="scss" scoped>
.parameter {
  display: inline-block;
  select {
    background-color: $white-lighter;
  }
}
</style>
