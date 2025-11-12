<script lang="ts" setup>
import type { FireWeatherStatistics } from '~/utils/era5WrfStatistics'

interface Props {
  statistics: FireWeatherStatistics
  selectedYear: number
  climatologyPeriodLabel: string
}

const props = defineProps<Props>()
</script>

<template>
  <div v-if="statistics" class="statistics-panel mt-4">
    <h5 class="title is-5">
      {{ selectedYear }} vs {{ climatologyPeriodLabel }}
    </h5>

    <div class="columns is-multiline">
      <div class="column is-4">
        <div class="stat-box">
          <span class="stat-label">Hot Days</span>
          <span class="stat-value">{{ statistics.hotDays }}</span>
          <span class="stat-unit">days >90th percentile</span>
        </div>
      </div>

      <div class="column is-4">
        <div class="stat-box">
          <span class="stat-label">Dry Days</span>
          <span class="stat-value">{{ statistics.dryDays }}</span>
          <span class="stat-unit">days <10th percentile</span>
        </div>
      </div>

      <div class="column is-4">
        <div class="stat-box">
          <span class="stat-label">Hot and Dry Days</span>
          <span class="stat-value compound">{{
            statistics.fireProneDays
          }}</span>
          <span class="stat-unit"></span>
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
  border: 1px solid #dee2e6;
}

.stat-box {
  background: white;
  padding: 1.25rem;
  border-radius: 4px;
  text-align: center;
  border: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  height: 100%;
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1;
}

.stat-value.compound {
  color: #d32f2f;
}

.stat-unit {
  font-size: 0.75rem;
  color: #868e96;
}
</style>
