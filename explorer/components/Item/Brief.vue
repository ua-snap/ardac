<script lang="ts" setup>
const props = defineProps<{
  slug: Slug
  showTag?: boolean
}>()

const store = useStore()
let item = store.itemBySlug(props.slug)
</script>

<template>
  <div v-if="store.itemHasComponent(item)" class="item brief">
    <Tag v-if="showTag" :tag="item.tags[0]" />
    <NuxtLink :to="{ name: 'item-slug', params: { slug: item.slug } }">
      <h3 class="title is-5" v-html="item.title"></h3>
    </NuxtLink>
  </div>
  <div v-else class="item brief missing" title="Content not impemented yet">
    <!-- If missing component -->
    <Tag v-if="showTag" :tag="item.tags[0]" />
    <h3 class="title is-5" v-html="item.title"></h3>
  </div>
</template>

<style lang="scss" scoped></style>
