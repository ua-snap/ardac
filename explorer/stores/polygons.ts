import { defineStore } from 'pinia'

export interface PolygonFeature {
  id: string | number
  name: string
  type: string
}

export interface PolygonGeometry {
  geometry: {
    coordinates: any[]
    type: string
  }
  type: string
}

export interface PolygonCategory {
  name: string
  endpoint: string
}

export const usePolygonsStore = defineStore('polygons', () => {
  const randomFeature = ref<PolygonFeature | null>(null)
  const featureGeometry = ref<PolygonGeometry | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const config = useRuntimeConfig()

  // Define the available polygon categories
  const polygonCategories: PolygonCategory[] = [
    { name: 'Hydrological Unit', endpoint: '/places/hucs' },
    { name: 'Protected Area', endpoint: '/places/protected_areas' },
    { name: 'Alaska Native Corporation', endpoint: '/places/corporations' },
    { name: 'Alaska Climate Division', endpoint: '/places/climate_divisions' },
    { name: 'Fire Management Zone', endpoint: '/places/fire_zones' },
    {
      name: 'Ethnolinguistic Region',
      endpoint: '/places/ethnolinguistic_regions',
    },
    { name: 'Alaska Borough', endpoint: '/places/boroughs' },
    { name: 'Alaska Census Area', endpoint: '/places/census_areas' },
    { name: 'Game Management Unit', endpoint: '/places/game_management_units' },
    { name: 'First Nation', endpoint: '/places/first_nations' },
  ]

  const selectedCategory = ref<PolygonCategory | null>(null)

  // Function to fetch a random polygon feature
  async function fetchRandomPolygon() {
    isLoading.value = true
    error.value = null
    randomFeature.value = null
    featureGeometry.value = null

    try {
      // Choose a random category
      const randomCategoryIndex = Math.floor(
        Math.random() * polygonCategories.length
      )
      selectedCategory.value = polygonCategories[randomCategoryIndex]

      // Fetch features from the selected category
      const featuresUrl = `${config.public.apiUrl}${selectedCategory.value.endpoint}`
      const featuresResponse = await fetch(featuresUrl)

      if (!featuresResponse.ok) {
        throw new Error(
          `API request failed with status ${featuresResponse.status}`
        )
      }

      const featuresData = await featuresResponse.json()

      if (!Array.isArray(featuresData) || featuresData.length === 0) {
        throw new Error('Invalid or empty features data received from API')
      }

      // Select a random feature from the array
      const randomFeatureIndex = Math.floor(Math.random() * featuresData.length)
      randomFeature.value = featuresData[randomFeatureIndex]

      // Fetch the geometry for the selected feature
      if (randomFeature.value) {
        await fetchFeatureGeometry(randomFeature.value.id)
      }
    } catch (err) {
      console.error('Error fetching random polygon:', err)
      error.value =
        err instanceof Error ? err.message : 'Unknown error occurred'
      randomFeature.value = null
      featureGeometry.value = null
    } finally {
      isLoading.value = false
    }
  }

  // Function to fetch the geometry for a specific feature ID
  async function fetchFeatureGeometry(featureId: string | number) {
    try {
      const geometryUrl = `${config.public.apiUrl}/boundary/area/${featureId}`
      const geometryResponse = await fetch(geometryUrl)

      if (!geometryResponse.ok) {
        throw new Error(
          `Geometry API request failed with status ${geometryResponse.status}`
        )
      }

      const geometryData = await geometryResponse.json()
      featureGeometry.value = geometryData
    } catch (err) {
      console.error('Error fetching feature geometry:', err)
      error.value =
        err instanceof Error ? err.message : 'Unknown error occurred'
      featureGeometry.value = null
    }
  }

  function clearRandomPolygon() {
    randomFeature.value = null
    featureGeometry.value = null
    selectedCategory.value = null
  }

  function setError(message: string) {
    error.value = message
  }

  return {
    randomFeature,
    featureGeometry,
    selectedCategory,
    isLoading,
    error,
    fetchRandomPolygon,
    clearRandomPolygon,
    setError,
  }
})
