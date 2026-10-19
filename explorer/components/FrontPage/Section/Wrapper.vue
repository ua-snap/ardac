<script lang="ts" setup>
const props = defineProps<{
  tag: Tag
  // One line under the heading saying what the section covers.
  subtitle: string
}>()
</script>

<template>
  <div class="frontpage-section-wrapper py-6">
    <h2 class="section-title title is-3 is-spaced mx-6 mb-2">
      <NuxtLink :to="'/tag/' + tag"
        >{{ tag }} <span class="more">&#x2192; see all</span></NuxtLink
      >
    </h2>
    <p class="subtitle is-5 mx-6 mb-3">{{ subtitle }}</p>
    <section class="section topic pt-3 pb-5">
      <slot></slot>
    </section>
  </div>
</template>

<style lang="scss" scoped>
// Styles for the Sections on the home page
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
