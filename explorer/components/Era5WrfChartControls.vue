<script lang="ts" setup>
import {
  CLIMATOLOGY_PERIODS,
  getAvailableYears,
} from '~/utils/era5WrfConstants'

interface Props {
  showAdvancedControls?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showAdvancedControls: false,
})

// Control state
const showTemperature = defineModel<boolean>('showTemperature', {
  default: true,
})
const showHumidity = defineModel<boolean>('showHumidity', { default: true })
const selectedYear = defineModel<string>('selectedYear', { default: '2004' })
const showClimatology = defineModel<boolean>('showClimatology', {
  default: false,
})
const showPercentileBands = defineModel<boolean>('showPercentileBands', {
  default: false,
})
const highlightExtremes = defineModel<boolean>('highlightExtremes', {
  default: false,
})
const climatologyPeriod = defineModel<string>('climatologyPeriod', {
  default: '1990-2019',
})

// Available years and climatology periods from constants
const availableYears = getAvailableYears()
const climatologyPeriods = CLIMATOLOGY_PERIODS

// Use validation composable
const {
  canDisableTemperature,
  canDisableHumidity,
  validationMessage,
  handleTemperatureChange,
  handleHumidityChange,
} = useEra5WrfValidation(showTemperature, showHumidity)
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

      <!-- Variable Selection -->
      <div class="column is-half">
        <label class="label">Variables</label>
        <div class="field">
          <div class="control">
            <label
              class="checkbox"
              :class="{ 'is-disabled': !canDisableTemperature }"
              :title="!canDisableTemperature ? validationMessage : ''"
            >
              <input
                type="checkbox"
                :checked="showTemperature"
                @change="handleTemperatureChange"
              />
              Daily Maximum Temperature
            </label>
          </div>
          <div class="control">
            <label
              class="checkbox"
              :class="{ 'is-disabled': !canDisableHumidity }"
              :title="!canDisableHumidity ? validationMessage : ''"
            >
              <input
                type="checkbox"
                :checked="showHumidity"
                @change="handleHumidityChange"
              />
              Daily Minimum Relative Humidity
            </label>
          </div>
        </div>
        <div v-if="validationMessage" class="help is-info">
          <small>{{ validationMessage }}</small>
        </div>
      </div>
    </div>

    <!-- Climatology Controls -->
    <div class="columns" v-if="showAdvancedControls">
      <div class="column">
        <div class="field">
          <label class="label">Climatological Comparison</label>

          <div class="control mb-3">
            <label class="checkbox">
              <input type="checkbox" v-model="showClimatology" />
              Show climatological average
            </label>
          </div>

          <div v-if="showClimatology" class="control mb-3">
            <label class="label is-size-6">Reference Period</label>
            <div class="select is-fullwidth">
              <select v-model="climatologyPeriod">
                <option
                  v-for="(period, key) in climatologyPeriods"
                  :key="key"
                  :value="key"
                >
                  {{ period.label }}
                </option>
              </select>
            </div>
          </div>

          <div v-if="showClimatology" class="control mb-3">
            <label class="checkbox">
              <input type="checkbox" v-model="showPercentileBands" />
              Show normal range (10th-90th percentile)
            </label>
          </div>

          <div v-if="showClimatology" class="control">
            <label class="checkbox">
              <input type="checkbox" v-model="highlightExtremes" />
              Highlight extreme days
            </label>
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

/* Validation styles */
.checkbox.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.checkbox.is-disabled input[type='checkbox'] {
  cursor: not-allowed;
}

.help.is-info {
  color: #3273dc;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}
</style>
