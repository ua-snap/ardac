<script lang="ts" setup>
import {
  PETAL_COUNT_LABELS,
  UNITS_LABELS,
  type PetalCount,
  type WindSpeedUnits,
} from '~/utils/airportWinds'

const units = defineModel<WindSpeedUnits>('units', { default: 'kts' })
const petalCount = defineModel<PetalCount>('petalCount', { default: '16' })
</script>

<template>
  <div class="field">
    <label class="label">Wind speed units</label>
    <div class="control mb-2">
      <label v-for="(label, value) in UNITS_LABELS" class="radio mr-3">
        <input type="radio" name="units" :value="value" v-model="units" />
        {{ label }}
      </label>
    </div>
  </div>
  <div class="field">
    <label class="label">Wind rose display petals</label>
    <div class="control mb-5">
      <label v-for="(label, value) in PETAL_COUNT_LABELS" class="radio mr-3">
        <input
          type="radio"
          name="petal-count"
          :value="value"
          v-model="petalCount"
        />
        {{ label }}
      </label>
    </div>
  </div>
</template>
