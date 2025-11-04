<script lang="ts" setup>
const startDate = defineModel<string>('startDate', { default: '' })
const endDate = defineModel<string>('endDate', { default: '' })

// Date validation
const dateRangeError = computed(() => {
  if (!startDate.value || !endDate.value) return null
  if (startDate.value > endDate.value) {
    return 'Start date must be before end date'
  }
  if (startDate.value < '1960-01-01') {
    return 'Start date cannot be before 1960-01-01'
  }
  if (endDate.value > '2023-12-31') {
    return 'End date cannot be after 2023-12-31'
  }
  return null
})
</script>

<template>
  <div class="controls panel">
    <div class="panel-heading has-background-white">Select Date Range</div>

    <div class="panel-block is-block">
      <label class="label">Date Range</label>
      <div class="columns is-mobile">
        <div class="column">
          <label class="label is-size-7">Start Date</label>
          <div class="control">
            <input
              type="date"
              class="input"
              v-model="startDate"
              min="1960-01-01"
              max="2023-12-31"
            />
          </div>
        </div>
        <div class="column">
          <label class="label is-size-7">End Date</label>
          <div class="control">
            <input
              type="date"
              class="input"
              v-model="endDate"
              min="1960-01-01"
              max="2023-12-31"
            />
          </div>
        </div>
      </div>
      <p v-if="dateRangeError" class="help is-danger">
        {{ dateRangeError }}
      </p>
      <p v-else class="help">
        Select the time window to display. Default shows the most recent year.
      </p>
    </div>
  </div>
</template>

<style scoped>
.controls {
  border: 1px solid #dbdbdb;
  border-radius: 6px;
  overflow: hidden;
}

.panel-heading {
  font-weight: 600;
}
</style>
