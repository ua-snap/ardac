<script setup lang="ts">
import { usePlacesStore } from '~/stores/places'
import { useMapStore } from '~/stores/map'
import type { LatLngTuple } from 'leaflet'
import L from 'leaflet'

// Identifies the marker icons for Leaflet when in production
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

const placesStore = usePlacesStore()
const mapStore = useMapStore()
const config = useRuntimeConfig()
const { $L } = useNuxtApp()

const isMapVisible = ref(false)
const mapId = 'random-location-map'
const mapInstance = ref<any>(null)
const marker = ref<any>(null)
const baseLayer = ref<any>(null)

const loading = computed(() => placesStore.isLoading)
const error = computed(() => placesStore.error)
const location = computed(() => placesStore.randomLocation)

const locationLongitudeDisplay = computed(() => {
  if (!location.value) return ''
  let long = Number.parseFloat(location.value.longitude.toFixed(4))
  if (long < 0) {
    return Math.abs(long) + '&deg;W'
  } else {
    return long + '&deg;E'
  }
})

const locationLabel = computed(() => {
  if (!location.value) return ''

  return location.value.alt_name
    ? `${location.value.name} (${location.value.alt_name})`
    : location.value.name
})

const headerLabel = computed(() => {
  if (!location.value) return ''

  let label = locationLabel.value

  // Add region and country if available
  const parts = []
  if (location.value.region && location.value.region.trim()) {
    parts.push(location.value.region)
  }
  if (location.value.country && location.value.country.trim()) {
    parts.push(location.value.country)
  }

  if (parts.length > 0) {
    label += `, ${parts.join(', ')}`
  }

  return label
})

async function showRandomLocation() {
  await placesStore.fetchRandomLocation()
  if (location.value) {
    isMapVisible.value = true
    nextTick(() => {
      initMap()
    })
  }
}

function initMap() {
  if (!location.value) return

  // Clean up existing map if it exists
  if (mapInstance.value) {
    mapInstance.value.remove()
  }

  // Create the map
  const map = $L.map(mapId, {
    center: [location.value.latitude, location.value.longitude],
    zoom: 8,
    scrollWheelZoom: false,
    zoomControl: true,
    attributionControl: true,
  })

  // Use USGS National Map for all locations
  baseLayer.value = $L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 16,
    }
  )

  baseLayer.value.addTo(map)

  // Add marker for the location
  const pointCoords: LatLngTuple = [
    location.value.latitude,
    location.value.longitude,
  ]
  marker.value = $L.marker(pointCoords).addTo(map)

  // Add popup with location name
  marker.value.bindPopup(locationLabel.value).openPopup()

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
      @click="showRandomLocation"
      :class="{ 'is-loading': loading }"
      :disabled="loading"
    >
      Show a random point location
    </button>

    <div v-if="isMapVisible && location" class="mt-4">
      <div class="map-header">
        <h4 class="title is-5">{{ headerLabel }}</h4>
        <h5 class="subtitle is-6">
          {{ location.latitude.toFixed(4) }}&deg;N,
          <span v-html="locationLongitudeDisplay"></span>
        </h5>
      </div>

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
