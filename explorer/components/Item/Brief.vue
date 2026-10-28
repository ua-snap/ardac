<script lang="ts" setup>
const props = defineProps<{
  slug: Slug
  showTag?: boolean
}>()

const store = useStore()
let item = store.itemBySlug(props.slug)
</script>

<template>
  <span v-if="store.itemHasComponent(item)" class="item brief">
    <Tag v-if="showTag" :tag="item.tags[0]" />
    <NuxtLink
      :to="{ name: 'item-slug', params: { slug: item.slug } }"
      @click="trackEvent('Item Clicked', { title: item.title })"
    >
      <span v-html="item.title"></span>
    </NuxtLink>
  </span>
  <span v-else class="item brief missing" title="Content not implemented yet">
    <!-- If missing component -->
    <Tag v-if="showTag" :tag="item.tags[0]" />
    <span v-html="item.title"></span>
  </span>
</template>

<style lang="scss" scoped></style>
