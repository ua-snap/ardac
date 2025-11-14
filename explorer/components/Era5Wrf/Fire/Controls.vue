<script lang="ts" setup>
import {
  ERA5_CLIMATOLOGY_PERIODS,
  ERA5_AVAILABLE_YEARS,
} from '~/utils/era5WrfConstants'

// Bidirectional bindings to parent component
const selectedYear = defineModel<number>('selectedYear', { required: true })
const climatologyPeriod = defineModel<string>('climatologyPeriod', {
  default: '1960-1989',
})

// Available climatology periods from constants
const climatologyPeriods = ERA5_CLIMATOLOGY_PERIODS
</script>

<template>
  <div class="mb-5">
    <p class="is-size-5">
      Compare the selected year to a 30-year baseline period, including the
      10<sup>th</sup>&ndash;90<sup>th</sup> percentile range.
    </p>

    <div class="field">
      <label class="label">Select a year, 1960&ndash;2023</label>
      <div class="control">
        <div class="select">
          <select v-model.number="selectedYear">
            <option v-for="year in ERA5_AVAILABLE_YEARS" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>
      </div>

      <div class="field mt-4">
        <label class="label">30-year baseline</label>
        <div class="control">
          <label class="radio">
            <input type="radio" value="1960-1989" v-model="climatologyPeriod" />
            <span v-html="climatologyPeriods['1960-1989'].label"></span>
          </label>

          <label class="radio">
            <input type="radio" value="1990-2019" v-model="climatologyPeriod" />
            <span v-html="climatologyPeriods['1990-2019'].label"></span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.radio span {
  display: inline-block;
  margin-left: 0.5rem;
  margin-right: 1.5rem;
}
</style>
