const { $_ } = useNuxtApp()

// Calculate mean and choose rounding precision based on the range of values.
export const precisionMean = values => {
  let diff = $_.max(values) - $_.min(values)
  let mean = $_.mean(values)
  return diff < 10 ? $_.round(mean, 1) : $_.round(mean)
}