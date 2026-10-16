import { defineStore } from 'pinia'
const runtimeConfig = useRuntimeConfig()
const placesStore = usePlacesStore()

const endpoints: Record<string, string> = {
  elevation: '/elevation/point/',
  flammability: '/alfresco/flammability/local/',
  beetles: '/beetles/point/',
  cmip6Downscaled: '/cmip6_downscaled/point/',
  cmip6Monthly: '/cmip6/point/',
  indicatorsCmip6: '/indicators/cmip6/point/',
  degreeDaysBelow0: '/degree_days/below_zero/',
  heatingDegreeDays: '/degree_days/heating/',
  hydrology: '/hydrology/point/',
  indicators: '/indicators/base/point/',
  landfastSeaIce: '/landfastice/point/',
  freezingIndex: '/degree_days/freezing_index/',
  meanAnnualTemperature: '/temperature/',
  permafrost: '/permafrost/point/gipl/',
  precipitation: '/precipitation/point/',
  precipitationFrequency: '/precipitation/frequency/point/',
  seaIceConcentration: '/seaice/point/',
  temperature: '/temperature/point/',
  temperatureAnomalies: '/temperature_anomalies/point/',
  thawingIndex: '/degree_days/thawing_index/',
  vegType: '/alfresco/veg_type/local/',
  wetDaysPerYear: '/wet_days_per_year/all/point/',
  era5wrf: '/era5wrf/point/',
}

export const useDataStore = defineStore('data', () => {
  // Use "any" type since apiData will be used to store many different types of
  // data we will get from the API for different ARDAC items.
  const apiData: Ref<Record<string, any>> = ref({})
  const dataErrors: Ref<Record<string, boolean>> = ref({})
  const cuspObservations: Ref<CuspObservationFeatureCollection | null> =
    ref(null)
  const cuspObservationsLoading = ref(false)
  const cuspObservationsError = ref<string | null>(null)

  function clearCuspObservations() {
    cuspObservations.value = null
    cuspObservationsLoading.value = false
    cuspObservationsError.value = null
  }

  const fetchData = async (
    dataset: string,
    params: string = '',
    options: { lat?: number; lng?: number; key?: string } = {}
  ) => {
    const lat = options.lat ?? placesStore.latLng?.lat
    const lng = options.lng ?? placesStore.latLng?.lng

    if (lat === undefined || lng === undefined) {
      return // do not try
    }
    const storeKey = options.key ?? dataset
    apiData.value[storeKey] = null
    dataErrors.value[storeKey] = false
    let url = runtimeConfig.public.apiUrl + endpoints[dataset] + lat + '/' + lng

    if (params) {
      url += params
    }

    try {
      const response = await fetch(url)
      const data = await response.json()
      if (response.status === 200) {
        apiData.value[storeKey] = data
      } else {
        dataErrors.value[storeKey] = true
      }
    } catch (error) {
      dataErrors.value[storeKey] = true
    }
  }

  // Incremented on every request so a slow response for a previous location
  // can't overwrite the results for the current one.
  let cuspRequestId = 0

  async function fetchCuspObservations() {
    const location = placesStore.latLng
    const requestId = ++cuspRequestId

    clearCuspObservations()

    if (!location) return

    cuspObservationsLoading.value = true

    try {
      const response = await fetch(
        `${runtimeConfig.public.apiUrl}/cusp/point/${location.lat}/${location.lng}`
      )
      if (requestId !== cuspRequestId) return

      if (response.status >= 400 && response.status < 500) {
        cuspObservationsError.value =
          'CUSP observations are not available for this location. Try a location within the area covered by the map above.'
        return
      }

      if (!response.ok) {
        throw new Error(`CUSP request failed with status ${response.status}`)
      }

      const observations =
        (await response.json()) as CuspObservationFeatureCollection
      if (requestId !== cuspRequestId) return
      cuspObservations.value = observations
    } catch {
      if (requestId !== cuspRequestId) return
      cuspObservationsError.value =
        'The CUSP data service is not responding right now. Please try again later.'
    } finally {
      if (requestId === cuspRequestId) {
        cuspObservationsLoading.value = false
      }
    }
  }

  return {
    fetchData,
    apiData,
    dataErrors,
    cuspObservations,
    cuspObservationsLoading,
    cuspObservationsError,
    clearCuspObservations,
    fetchCuspObservations,
  }
})
