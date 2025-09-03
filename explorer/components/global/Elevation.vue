<script lang="ts" setup>
const endpoint = 'elevation'

const placesStore = usePlacesStore()
const mapStore = useMapStore()
const dataStore = useDataStore()
const runtimeConfig = useRuntimeConfig()

const apiData = computed<Record<string, any>>(() => dataStore.apiData[endpoint])
const latLng = computed<LatLngValue>(() => placesStore.latLng)

const layers: MapLayer[] = [
  {
    id: 'elevation_min',
    title: 'Minimum Elevation',
    wmsLayerName: 'astergdem_min_max_avg',
    style: 'elevation_min',
    legend: 'elevation',
  },
  {
    id: 'elevation_avg',
    title: 'Mean Elevation',
    wmsLayerName: 'astergdem_min_max_avg',
    style: 'elevation_avg',
    legend: 'elevation',
  },
  {
    id: 'elevation_max',
    title: 'Maximum Elevation',
    wmsLayerName: 'astergdem_min_max_avg',
    style: 'elevation_max',
    legend: 'elevation',
  },
]

const legend: Record<string, LegendItem[]> = {
  elevation: [
    { color: '#000000', label: '&ge;0m, &lt;250m' },
    { color: '#525252', label: '&ge;250m, &lt;500m' },
    { color: '#969696', label: '&ge;500m, &lt;750m' },
    { color: '#cccccc', label: '&ge;750m, &lt;1000m' },
    { color: '#f7f7f7', label: '&ge;1000m' },
  ],
}

const mapId = 'elevation'
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
  <section class="section">
    <div class="content is-size-5">
      <h3 class="title is-3">Elevation</h3>
      <XrayIntroblurb resolution="1" unit="km" />
      <p class="mb-6">
        The map below shows minimum, mean, and maximum elevation at a resolution
        of 1km:
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
        Enter lat/lon coordinates below to see a table of mimimum, mean, and
        maximum elevation for that location. After entering lat/lon coordinates,
        links will be provided where you can download the data that is used to
        populate the table.
      </p>

      <Gimme extent="elevation" class="mb-5" />

      <div v-if="latLng && apiData">
        <h4 class="title is-4">
          Elevation for {{ latLng.lat }}, {{ latLng.lng }}
        </h4>

        <table class="elevation mb-6">
          <tr>
            <th>Statistic</th>
            <th>Elevation</th>
          </tr>
          <tr>
            <td>Minimum</td>
            <td>{{ apiData['min'] }}m</td>
          </tr>
          <tr>
            <td>Mean</td>
            <td>{{ apiData['mean'] }}m</td>
          </tr>
          <tr>
            <td>Maximum</td>
            <td>{{ apiData['max'] }}m</td>
          </tr>
        </table>
        <h4 class="title is-4">
          Download elevation data for
          {{ latLng.lat }},
          {{ latLng.lng }}
        </h4>
        <ul>
          <li>
            <a
              :href="
                runtimeConfig.public.apiUrl +
                '/elevation/point/' +
                latLng!.lat +
                '/' +
                latLng!.lng
              "
              >Download as JSON</a
            >
          </li>
        </ul>
      </div>
      <GetAndUseData
        :presentInNcr="true"
        :presentInEds="true"
        apiUrl="https://earthmaps.io/elevation/"
      >
        <li>
          Academic reference:
          <blockquote>
            <p>
              NASA/METI/AIST/Japan Spacesystems and U.S./Japan ASTER Science
              Team (2019).
              <i>ASTER Global Digital Elevation Model V003</i> [Data set]. NASA
              EOSDIS Land Processes Distributed Active Archive Center. Accessed
              2023-09-08 from
              <a href="https://doi.org/10.5067/ASTER/ASTGTM.003"
                >https://doi.org/10.5067/ASTER/ASTGTM.003</a
              >
            </p>
          </blockquote>
        </li>
      </GetAndUseData>
    </div>
  </section>
</template>

<style lang="scss" scoped>
table.elevation {
  max-width: 600px;
}
</style>
