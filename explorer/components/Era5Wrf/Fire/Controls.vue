<script lang="ts" setup>
import { ERA5_CLIMATOLOGY_PERIODS } from '~/utils/era5WrfConstants'

interface Props {
  availableYears: number[]
}

const props = defineProps<Props>()

// v-model bindings
const selectedYear = defineModel<number>('selectedYear', { required: true })
const climatologyPeriod = defineModel<string>('climatologyPeriod', {
  default: '1960-1989',
})

// Available climatology periods from constants
const climatologyPeriods = ERA5_CLIMATOLOGY_PERIODS
</script>

<template>
  <div class="controls mb-5">
    <div class="columns">
      <!-- Year Selection -->
      <div class="column is-half">
        <label class="label">Year Selection: 1960-2023</label>
        <div class="control">
          <div class="select is-fullwidth">
            <select v-model.number="selectedYear">
              <option v-for="year in availableYears" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Climatology Period -->
      <div class="column is-half">
        <label class="label">Climatology Baseline</label>
        <p class="help mb-3">
          Compare the selected year to a 30-year baseline period, including the 10th-90th
          percentile range.
        </p>

        <div class="mb-2">
          <strong class="is-size-6">Reference Period</strong>
        </div>

        <div class="field">
          <div class="control">
            <label class="radio">
              <input type="radio" value="1960-1989" v-model="climatologyPeriod" />
              {{ climatologyPeriods['1960-1989'].label }}
            </label>
          </div>
        </div>

        <div class="field">
          <div class="control">
            <label class="radio">
              <input type="radio" value="1990-2019" v-model="climatologyPeriod" />
              {{ climatologyPeriods['1990-2019'].label }}
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.controls {
  padding: 1rem;
  background-color: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}
</style>
