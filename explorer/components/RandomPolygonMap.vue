<script setup lang="ts">
import {
  usePolygonsStore,
  type PolygonFeature,
  type PolygonGeometry,
} from '~/stores/polygons'
import { useMapStore } from '~/stores/map'

const polygonsStore = usePolygonsStore()
const mapStore = useMapStore()
const config = useRuntimeConfig()
const { $L } = useNuxtApp()

const isMapVisible = ref(false)
const mapId = 'random-polygon-map'
const mapInstance = ref<any>(null)
const polygonLayer = ref<any>(null)
const baseLayer = ref<any>(null)

const loading = computed(() => polygonsStore.isLoading)
const error = computed(() => polygonsStore.error)
const feature = computed(() => polygonsStore.randomFeature)
const geometry = computed(() => polygonsStore.featureGeometry)
const category = computed(() => polygonsStore.selectedCategory)

const featureLabel = computed(() => {
  if (!feature.value) return ''
  return feature.value.name
})

const headerLabel = computed(() => {
  if (!feature.value || !category.value) return ''

  return `${feature.value.name} - ${category.value.name}`
})

async function showRandomPolygon() {
  await polygonsStore.fetchRandomPolygon()
  if (feature.value && geometry.value) {
    isMapVisible.value = true
    nextTick(() => {
      initMap()
    })
  }
}

function initMap() {
  if (!feature.value || !geometry.value || !geometry.value.geometry) {
    console.error('Missing feature or geometry data')
    polygonsStore.setError('Missing or invalid polygon data')
    return
  }

  // Clean up existing map if it exists
  if (mapInstance.value) {
    mapInstance.value.remove()
  }

  // Create the map with default center (will be updated when polygon is added)
  const map = $L.map(mapId, {
    center: [65, -155], // Default center in Alaska
    zoom: 4, // Default zoom
    scrollWheelZoom: false,
    zoomControl: true,
    attributionControl: true,
  })

  baseLayer.value = $L.tileLayer(
    'https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}',
    {
      attribution: 'USGS The National Map',
      maxZoom: 12,
    }
  )

  baseLayer.value.addTo(map)

  try {
    // Create a valid GeoJSON feature from the geometry
    const geoJsonFeature = {
      type: 'Feature',
      properties: {
        name: feature.value.name,
        id: feature.value.id,
      },
      geometry: geometry.value.geometry,
    }

    polygonLayer.value = $L
      .geoJSON(geoJsonFeature as any, {
        style: {
          color: '#0077cc',
          weight: 2,
          opacity: 0.7,
          fillColor: '#00aaff',
          fillOpacity: 0.3,
        },
      })
      .addTo(map)

    // Fit map to polygon bounds
    if (polygonLayer.value && polygonLayer.value.getBounds) {
      map.fitBounds(polygonLayer.value.getBounds(), { padding: [20, 20] })
    } else {
      // Fallback if bounds not available
      console.warn('Could not determine polygon bounds')
    }
  } catch (e) {
    console.error('Error creating polygon layer:', e)
    polygonsStore.setError('Error displaying polygon')
  }

  // Save map instance reference
  mapInstance.value = map
}

onBeforeUnmount(() => {
  if (mapInstance.value) {
    mapInstance.value.remove()
  }
})
</script>

<template>
  <div class="mb-5">
    <button
      class="button is-info is-medium"
      @click="showRandomPolygon"
      :class="{ 'is-loading': loading }"
      :disabled="loading"
    >
      Show a random polygon feature
    </button>

    <div v-if="isMapVisible && feature && geometry" class="mt-4">
      <h4 class="title is-5">{{ headerLabel }}</h4>
      <div :id="mapId" class="map-element"></div>
    </div>

    <div v-if="error" class="notification is-danger is-light mt-4">
      Argh! Something went wrong. Try again later!
    </div>
  </div>
</template>

<style lang="scss" scoped>

  .map-element {
    height: 400px;
    width: 100%;
  }

</style>
