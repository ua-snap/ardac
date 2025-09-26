import { defineStore } from 'pinia'

export const useChartStore = defineStore('chart', () => {
  let labels: Ref<
    Record<
      string,
      | HydrologyChartLabelsObj
      | PermafrostChartLabelsObj
      | IndicatorsCmip6ChartLabelsObj
      | Cmip6DownscaledChartLabelsObj
    >
  > = ref({})
  let inputs: Ref<
    Record<
      string,
      | HydrologyChartInputsObj
      | PermafrostChartInputsObj
      | IndicatorsCmip6ChartInputsObj
      | Cmip6DownscaledChartInputsObj
    >
  > = ref({})

  return {
    labels,
    inputs,
  }
})
