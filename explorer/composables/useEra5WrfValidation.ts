/**
 * Validation composable for ERA5-WRF chart controls
 * Ensures at least one variable is always selected
 */

export function useEra5WrfValidation(
  showTemperature: Ref<boolean>,
  showHumidity: Ref<boolean>
) {
  // Validation computed properties
  const canDisableTemperature = computed(() => showHumidity.value)
  const canDisableHumidity = computed(() => showTemperature.value)
  
  const validationMessage = computed(() => {
    if (!canDisableTemperature.value) {
      return 'Cannot disable temperature - at least one variable must be selected'
    }
    if (!canDisableHumidity.value) {
      return 'Cannot disable humidity - at least one variable must be selected'
    }
    return ''
  })

  // Validation handlers
  const handleTemperatureChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const newValue = target.checked

    if (!newValue && !showHumidity.value) {
      // Prevent unchecking if humidity is already unchecked
      target.checked = true
      return
    }
    showTemperature.value = newValue
  }

  const handleHumidityChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const newValue = target.checked

    if (!newValue && !showTemperature.value) {
      // Prevent unchecking if temperature is already unchecked
      target.checked = true
      return
    }
    showHumidity.value = newValue
  }

  return {
    canDisableTemperature,
    canDisableHumidity,
    validationMessage,
    handleTemperatureChange,
    handleHumidityChange
  }
}
