<script lang="ts" setup>
const props = defineProps<{
  slug: Slug
  showTag?: boolean
}>()

const store = useStore()
let item = store.itemBySlug(props.slug)
</script>

<template>
  <div v-if="store.itemHasComponent(item)" class="item text-picture">
    <Tag v-if="showTag" :tag="item.tags[0]" />
    <NuxtLink :to="{ name: 'item-slug', params: { slug: item.slug } }">
      <h3 class="title is-4" v-html="item.title"></h3>
      <p v-html="item.blurb" class="mb-4" />
      <figure v-if="item.image" class="image is-5by4">
        <img
          :src="'/previews/' + item.image"
          :alt="item.imageAlt"
          class="mb-4"
        />
      </figure>
    </NuxtLink>
  </div>
  <div
    v-else
    class="item text-picture missing"
    title="Content not implemented yet"
  >
    <Tag v-if="showTag" :tag="item.tags[0]" />
    <h3 class="title is-4" v-html="item.title"></h3>
    <p v-html="item.blurb" class="mb-4" />
    <figure v-if="item.image" class="image is-5by4">
      <img :src="'/previews/' + item.image" :alt="item.imageAlt" class="mb-4" />
    </figure>
  </div>
</template>

<style lang="scss" scoped></style>
