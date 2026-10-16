<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    slug: Slug
    showTag?: boolean
    // Heading level for the title: 4 when the card sits under an h3.
    level?: 3 | 4
  }>(),
  { level: 3 }
)

const store = useStore()
let item = store.itemBySlug(props.slug)
</script>

<template>
  <div v-if="store.itemHasComponent(item)" class="item text">
    <Tag v-if="showTag" :tag="item.tags[0]" />
    <NuxtLink
      :to="{ name: 'item-slug', params: { slug: item.slug } }"
      @click="trackEvent('Item Clicked', { title: item.title })"
    >
      <component :is="`h${level}`" class="title is-4" v-html="item.title" />
      <p v-html="item.blurb" class="mb-4" />
    </NuxtLink>
  </div>
  <div v-else class="item text missing" title="Content not implemented yet">
    <Tag v-if="showTag" :tag="item.tags[0]" />
    <component :is="`h${level}`" class="title is-4" v-html="item.title" />
    <p v-html="item.blurb" class="mb-4" />
  </div>
</template>

<style lang="scss" scoped></style>
