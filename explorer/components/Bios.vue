<script lang="ts" setup>
const props = defineProps<{
  people: Person[]
}>()
</script>

<template>
  <hr class="light" />
  <Bio v-for="person in people" :person="person" />
</template>

<style lang="scss" scoped></style>
