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

  return {
    labels,
    inputs,
  }
})
