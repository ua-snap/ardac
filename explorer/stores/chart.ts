import { get } from 'lodash'
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
      title += placesStore.selectedCommunity.name + ' at '
    }
    if (placesStore.latLng) {
      title += placesStore.latLng.lat + ', ' + placesStore.latLng.lng
    }
    return title
  }

  function getTitleText(options: {
    chartTitle: string
    model?: string
    scenario?: string
    month?: string
    depth?: string
    season?: string
    year?: string
    duration?: string
    returnInterval?: string
  }): string {
    const params = [
      options.model && `Model: ${options.model}`,
      options.depth && `Depth: ${options.depth}`,
      options.season && `Season: ${options.season}`,
      options.scenario && `Scenario: ${options.scenario}`,
      options.month && `Month: ${options.month}`,
      options.year && `Year: ${options.year}`,
      options.duration && `Duration: ${options.duration}`,
      options.returnInterval && `Return Interval: ${options.returnInterval}`,
    ]
      .filter(Boolean) // remove undefined values
      .join(', ')

    return `${options.chartTitle}<br />${params}`
  }

  return {
    labels,
    inputs,
    getChartTitle,
    getTitleText,
  }
})
