import { defineStore } from 'pinia'
import { STATEWIDE_TEMPERATURE_INDEX_STATIONS } from '~/assets/statewideTemperatureIndexStations'
import {
  STATEWIDE_TEMPERATURE_INDEX_DAYS,
  buildDailyIndex,
  offsetDate,
} from '~/utils/statewideTemperatureIndex'
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
  const statewideTemperatureIndex: Ref<StatewideTemperatureIndexDay[] | null> =
    ref(null)
  const statewideTemperatureIndexLoading = ref(false)
  const statewideTemperatureIndexError = ref<string | null>(null)

  function clearStatewideTemperatureIndex() {
    statewideTemperatureIndex.value = null
    statewideTemperatureIndexLoading.value = false
    statewideTemperatureIndexError.value = null
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

  async function fetchStatewideTemperatureIndex() {
    clearStatewideTemperatureIndex()

    const startDate = offsetDate(-STATEWIDE_TEMPERATURE_INDEX_DAYS)
    const searchParams = new URLSearchParams({
      sids: Object.keys(STATEWIDE_TEMPERATURE_INDEX_STATIONS).join(','),
      sdate: startDate,
      edate: offsetDate(-1),
      elems: '1,2', // Max temp, min temp
      output: 'json',
    })

    statewideTemperatureIndexLoading.value = true

    try {
      const response = await fetch(
        `${runtimeConfig.public.acisUrl}?${searchParams}`
      )

      if (!response.ok) {
        throw new Error(`ACIS request failed with status ${response.status}`)
      }

      const acisData = (await response.json()) as AcisMultiStationData
      statewideTemperatureIndex.value = buildDailyIndex(acisData, startDate)
    } catch {
      statewideTemperatureIndexError.value =
        'Unable to load station temperature data. Please try again later.'
    } finally {
      statewideTemperatureIndexLoading.value = false
    }
  }

  return {
    fetchData,
    apiData,
    dataErrors,
    statewideTemperatureIndex,
    statewideTemperatureIndexLoading,
    statewideTemperatureIndexError,
    clearStatewideTemperatureIndex,
    fetchStatewideTemperatureIndex,
  }
})
