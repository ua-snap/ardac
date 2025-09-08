import { defineStore } from 'pinia'

export const useChartStore = defineStore('chart', () => {
  let labels: Ref<
    Record<
      string,
      | HydrologyChartLabelsObj
      | PermafrostChartLabelsObj
      | IndicatorsCmip6ChartLabelsObj
    >
  > = ref({})
  let inputs: Ref<
    Record<
      string,
      | HydrologyChartInputsObj
      | PermafrostChartInputsObj
      | IndicatorsCmip6ChartInputsObj
    >
  > = ref({})

  function getChartTitle(label: string): string {
    const placesStore = usePlacesStore()
    let title = label + ' for '
    if (placesStore.selectedCommunity) {
      title += placesStore.selectedCommunity.name + ' '
    }
    if (placesStore.latLng) {
      title += placesStore.latLng.lat + ', ' + placesStore.latLng.lng
    }
    return title
  }

  return {
    labels,
    inputs,
    getChartTitle,
  }
})
