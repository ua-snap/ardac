<script lang="ts" setup>
import type { SeasonalStats } from '~/utils/era5WrfStatistics'

interface Props {
  seasonalStatistics: SeasonalStats | null
  selectedYear: string
  showClimatology: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <div
    v-if="seasonalStatistics && showClimatology"
    class="statistics-panel mt-4"
  >
    <h5 class="title is-5">
      {{ selectedYear }} vs {{ seasonalStatistics.period }}
    </h5>

    <div class="columns is-multiline">
      <div class="column is-4">
        <div class="stat-box">
          <span class="stat-label">Hot Days</span>
          <span class="stat-value">{{ seasonalStatistics.hotDays }}</span>
          <span class="stat-unit">days >90th percentile</span>
        </div>
      </div>

      <div class="column is-4">
        <div class="stat-box">
          <span class="stat-label">Dry Days</span>
          <span class="stat-value">{{ seasonalStatistics.dryDays }}</span>
          <span class="stat-unit">days <10th percentile</span>
        </div>
      </div>

      <div class="column is-4">
        <div class="stat-box">
          <span class="stat-label">Hot and Dry Days</span>
          <span class="stat-value compound">{{
            seasonalStatistics.compoundEvents.length
          }}</span>
          <span class="stat-unit"></span>
        </div>
      </div>
    </div>

    <div class="anomaly-summary">
      <div class="columns">
        <div class="column">
          <strong>Seasonal Temperature Anomaly: </strong>
          <span
            :class="{
              positive: seasonalStatistics.temperatureAnomaly > 0,
              negative: seasonalStatistics.temperatureAnomaly < 0,
            }"
          >
            {{ seasonalStatistics.temperatureAnomaly > 0 ? '+' : ''
            }}{{ seasonalStatistics.temperatureAnomaly.toFixed(1) }}°C
          </span>
        </div>
        <div class="column">
          <strong>Seasonal Humidity Anomaly: </strong>
          <span
            :class="{
              positive: seasonalStatistics.humidityAnomaly > 0,
              negative: seasonalStatistics.humidityAnomaly < 0,
            }"
          >
            {{ seasonalStatistics.humidityAnomaly > 0 ? '+' : ''
            }}{{ seasonalStatistics.humidityAnomaly.toFixed(1) }}%
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.statistics-panel {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.stat-box {
  text-align: center;
  padding: 1rem;
  background: white;
  border-radius: 4px;
  border: 1px solid #ddd;
  height: 100%;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #d62728;
}

.stat-value.compound {
  font-size: 2rem;
}

.stat-label {
  display: block;
  font-size: 0.9rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.stat-unit {
  display: block;
  font-size: 0.8rem;
  color: #666;
}

.anomaly-summary {
  margin-top: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 4px;
  border-left: 4px solid #d62728;
}

.anomaly-summary .positive {
  color: #d73027;
  font-weight: bold;
}

.anomaly-summary .negative {
  color: #4575b4;
  font-weight: bold;
}
</style>
