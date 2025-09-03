<script setup lang="ts">
const props = defineProps<{
  mapId: string
  crs?: string
}>()
</script>

<template>
  <div class="columns">
    <div class="column is-one-third mt-3 ml-4">
      <slot name="layers"></slot>
    </div>
    <div class="column">
      <Map :mapId="mapId" :crs="crs" class="map" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
