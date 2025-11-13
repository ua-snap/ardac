<script lang="ts" setup>
const startDate = defineModel<string>('startDate', { default: '' })
const endDate = defineModel<string>('endDate', { default: '' })
const selectedYear = ref<number>(2023)

const startYear = 1960
const endYear = 2023
const availableYears = Array.from(
  { length: endYear - startYear + 1 },
  (_, i) => startYear + i
)

watch(
  selectedYear,
  newYear => {
    if (newYear) {
      startDate.value = `${newYear}-01-01`
      endDate.value = `${newYear}-12-31`
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="field">
    <label class="label"
      >Select a year, {{ startYear }}&ndash;{{ endYear }}</label
    >
    <div class="control">
      <div class="select">
        <select v-model.number="selectedYear">
          <option v-for="year in availableYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
