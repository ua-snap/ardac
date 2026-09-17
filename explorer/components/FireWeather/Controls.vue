<script lang="ts" setup>
import {
  FIRE_WEATHER_COMPARISON_PERIODS,
  FIRE_WEATHER_VARIABLES,
  type FireWeatherPeriod,
  type FireWeatherVariableKey,
} from '~/utils/fireWeather'

const selectedVariable = defineModel<FireWeatherVariableKey>(
  'selectedVariable',
  {
    default: 'fwi',
  }
)

const comparisonPeriodId = defineModel<FireWeatherPeriod['id']>(
  'comparisonPeriodId',
  { default: 'latecentury' }
)
</script>

<template>
  <fieldset>
    <legend>Choose what to compare</legend>
    <p>
      <label for="fire-weather-variable">Fire-weather component</label>
      <select id="fire-weather-variable" v-model="selectedVariable">
        <option
          v-for="variable in FIRE_WEATHER_VARIABLES"
          :key="variable.key"
          :value="variable.key"
        >
          {{ variable.label }} ({{ variable.shortLabel }})
        </option>
      </select>
    </p>
    <p>
      <label for="fire-weather-period">Comparison period</label>
      <select id="fire-weather-period" v-model="comparisonPeriodId">
        <option
          v-for="period in FIRE_WEATHER_COMPARISON_PERIODS"
          :key="period.id"
          :value="period.id"
        >
          {{ period.label }}
        </option>
      </select>
    </p>
  </fieldset>
</template>
