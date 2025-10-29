<script lang="ts" setup>
import {
  ERA5_CLIMATOLOGY_PERIODS,
  ERA5_WRF_CONFIG,
  getAvailableYears,
} from '~/utils/era5WrfConstants'

interface Props {
  showAdvancedControls?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showAdvancedControls: false,
})

// Control state
const selectedYear = defineModel<string>('selectedYear', {
  default: ERA5_WRF_CONFIG.defaultYear,
})
const climatologyPeriod = defineModel<string>('climatologyPeriod', {
  default: ERA5_WRF_CONFIG.defaultClimatologyPeriod,
})

// Available years and climatology periods from constants
const availableYears = getAvailableYears()
const climatologyPeriods = ERA5_CLIMATOLOGY_PERIODS
</script>

<template>
  <div class="controls mb-5">
    <div class="columns">
      <!-- Year Selection -->
      <div class="column is-half">
        <div class="field">
          <label class="label">Year Selection: 1960-2023</label>
          <div class="control">
            <div class="select is-fullwidth">
              <select v-model="selectedYear">
                <option
                  v-for="year in availableYears"
                  :key="year"
                  :value="year"
                >
                  {{ year }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Climatology Controls -->
    <div class="columns" v-if="showAdvancedControls">
      <div class="column">
        <div class="field">
          <label class="label">Climatological Comparison</label>
          <p class="mb-3">
            Daily values are compared against the selected reference period,
            including the 10th-90th percentile range.
          </p>

          <div class="control">
            <label class="label is-size-6">Reference Period</label>
            <div class="reference-options">
              <label class="radio">
                <input
                  type="radio"
                  value="1960-1989"
                  v-model="climatologyPeriod"
                />
                {{ climatologyPeriods['1960-1989'].label }}
              </label>
              <label class="radio">
                <input
                  type="radio"
                  value="1990-2019"
                  v-model="climatologyPeriod"
                />
                {{ climatologyPeriods['1990-2019'].label }}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.controls {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-3 {
  margin-bottom: 1rem;
}

.reference-options {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}
</style>
