<script lang="ts" setup>
definePageMeta({
  layout: 'home',
})
</script>

<template>
  <FrontPageMain />
  <hr />
  <section class="section">
    <FrontPageSectionPermafrost />
    <FrontPageSectionPrecipitation />
    <FrontPageSectionSeaIce />
    <FrontPageSectionSnow />
  </section>
</template>

<style lang="scss" scoped></style>
