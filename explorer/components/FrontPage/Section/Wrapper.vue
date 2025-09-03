<script lang="ts" setup>
const props = defineProps<{
  tag: Tag
}>()
</script>

<template>
  <div class="frontpage-section-wrapper mt-6">
    <h2 class="section-title title is-2 mx-6">
      <NuxtLink :to="'/tag/' + tag"
        >{{ tag }} <span class="more">&#x2192; see all</span></NuxtLink
      >
    </h2>
    <hr class="light" />
    <section class="section topic pt-3 pb-6">
      <slot></slot>
    </section>
  </div>
</template>

<style lang="scss" scoped>
// Styles for the Sections on the home page
h2.section-title.title.is-2 a {
  padding-top: 8rem;
  color: $black; 
  &:hover {
    color: $link;
  }
  .more {
    position: relative;
    bottom: 0.28rem;
    font-size: 60%;
    font-weight: 300;
  }
}

</style>
