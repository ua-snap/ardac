<script lang="ts" setup>

const props = defineProps<{
  tag: Tag
}>()

const tagPath = computed(() => {
  return '/tag/' + props.tag
})
</script>

<template>
  <NuxtLink :to="tagPath" class="tag mb-1">
    {{ tag }}
  </NuxtLink>
</template>

<style lang="scss" scoped>
  @use 'sass:color';

  .tag {
    background-color: color.adjust($white-darker, $lightness: 8%);
  }
</style>
