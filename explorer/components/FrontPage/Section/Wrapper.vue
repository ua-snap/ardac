<script lang="ts" setup>
const props = defineProps<{
  tag: Tag
  // One line under the heading saying what the section covers.
  subtitle: string
}>()
</script>

<template>
  <div class="frontpage-section-wrapper container is-fullhd">
    <h2 class="section-title title is-3">
      <NuxtLink :to="'/tag/' + tag"
        >{{ tag }} <span class="more">&#x2192; see all</span></NuxtLink
      >
    </h2>
    <p class="subtitle is-5">{{ subtitle }}</p>
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
// Styles for the Sections on the home page
.frontpage-section-wrapper:not(:last-child) {
  margin-bottom: 7rem;
}

h2.section-title.title {
  margin-bottom: 0.5rem;
}

h2.section-title.title a {
  padding-top: 8rem;
  color: $black;
  &:hover {
    color: $link;
  }
  .more {
    position: relative;
    bottom: 0.2rem;
    font-size: 60%;
    font-weight: 300;
  }
}
</style>
