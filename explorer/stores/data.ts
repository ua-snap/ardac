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

  return {
    fetchData,
    apiData,
    dataErrors,
  }
})
