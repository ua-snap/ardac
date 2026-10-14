<script lang="ts" setup>
import { useMapStore } from '~/stores/map'
const mapStore = useMapStore()

const props = defineProps<{
  mapId: string
  crs?: string
}>()

let crs = props.crs || 'EPSG:3338'

// Describe the map by the layer it's currently showing.
const { activeLayers } = storeToRefs(mapStore)
const mapLabel = computed(() => {
  let layer = activeLayers.value[props.mapId]
  if (!layer) {
    return 'Map'
  }
  // Layer titles and subtext can contain markup.
  let text = [layer.title, layer.subtext]
    .filter(part => part)
    .join(', ')
    .replace(/<[^>]*>/g, '')
  return 'Map of ' + text
})

onMounted(() => {
  mapStore.create(props.mapId, crs)
})

onUnmounted(() => {
  mapStore.destroy(props.mapId)
})
</script>

<template>
  <div
    :id="mapId"
    :crs="crs"
    class="map"
    role="region"
    :aria-label="mapLabel"
  ></div>
</template>

<style lang="scss" scoped>
.map {
  aspect-ratio: 1/1;
  height: 100%;
}
:deep(.legend) {
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.7);
  .legend-item {
    display: flex;
    align-items: center;
    font-size: 1rem;
  }
  .legend-swatch {
    display: inline-block;
    border: 1px solid #666;
    margin: 5px;
    width: 20px;
    height: 20px;
  }
  sup {
    position: relative;
    top: -0.2em;
    font-size: 0.8em;
  }
}
:deep(.leaflet-marker-icon) {
  cursor: grab;
}
</style>
