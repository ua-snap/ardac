<script setup lang="ts">
import { useMapStore } from '~/stores/map'
const mapStore = useMapStore()

const props = defineProps<{
  layer: MapLayer
  mapId: string
  default?: boolean
}>()

const { activeLayers } = storeToRefs(mapStore)

const active = computed(() => {
  return activeLayers.value[props.mapId]?.id === props.layer.id
})

async function toggleLayer() {
  await nextTick() // so this doesn't fire before the map DOM is ready
  mapStore.toggleLayer({
    layer: props.layer,
    mapId: props.mapId,
  })
}

onMounted(() => {
  if (props.default === true) {
    toggleLayer()
  }
})
</script>

<template>
  <div
    @click="toggleLayer"
    class="layer tile is-ancestor is-parent"
    :class="{ active: active }"
  >
    <span class="tile is-child layer-wrapper">
      <div class="layer-title">
        <slot name="title">{{ layer.title }}</slot>
      </div>
      <div class="subtext"><slot name="subtext"></slot></div>
    </span>
    <span class="tile is-child active-pointer">
      <div v-if="active">&#x25b6;</div>
    </span>
  </div>
</template>

<style lang="scss" scoped>
.layer {
  line-height: 1.2;
  font-size: 1.25rem;
  cursor: pointer;
  padding-right: 0;

  &.active {
    font-weight: 600;
    background-color: #f2c716;
  }

  .layer-wrapper {
    flex-basis: 80%;
  }

  .subtext {
    display: block;
    margin-top: 0;
    padding-top: 0;
    font-weight: 300;
  }

  .active-pointer {
    display: flex;
    align-items: center;
    font-size: 125%;
  }
}
</style>
