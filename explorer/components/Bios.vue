<script lang="ts" setup>
const props = defineProps<{
  slug: Slug
}>()

const store = useStore()
const people = store.itemBySlug(props.slug).people ?? []
</script>

<template>
  <template v-if="people.length">
    <hr class="light" />
    <h3 class="title is-4">People behind this work</h3>
    <div class="grid people-grid">
      <div v-for="person in people" :key="person" class="cell">
        <Bio :person="person" :level="4" link-to-people />
      </div>
    </div>
  </template>
</template>

<style lang="scss" scoped></style>
