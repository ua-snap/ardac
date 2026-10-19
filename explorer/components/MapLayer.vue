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
    @keydown.enter.prevent="toggleLayer"
    @keydown.space.prevent="toggleLayer"
    class="layer"
    :class="{ active: active }"
    role="button"
    tabindex="0"
    :aria-pressed="active"
  >
    <span class="layer-wrapper">
      <div class="layer-title">
        <slot name="title">{{ layer.title }}</slot>
      </div>
      <div class="subtext"><slot name="subtext"></slot></div>
    </span>
    <span class="active-pointer">
      <div v-if="active" aria-hidden="true">&#x25b6;</div>
    </span>
  </div>
</template>

<style lang="scss" scoped>
.layer {
  line-height: 1.2;
  font-size: 1.25rem;
  cursor: pointer;

  // The negative margins let the highlight of the active layer extend past
  // the text, while the text stays lined up with the content around it.
  margin: -0.75rem -0.75rem 0.75rem;
  padding: 0.75rem 0 0.75rem 0.75rem;
  &:last-child {
    margin-bottom: -0.75rem;
  }
  @include tablet {
    display: flex;
  }

  &.active {
    font-weight: 600;
    background-color: #f2c716;
  }

  .layer-wrapper {
    display: block;
    flex: 1 1 80%;
  }

  .subtext {
    display: block;
    margin-top: 0;
    padding-top: 0;
    font-weight: 300;
  }

  .active-pointer {
    display: flex;
    flex: 1 1 0;
    align-items: center;
    font-size: 125%;
  }
}
</style>
