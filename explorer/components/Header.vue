<script lang="ts" setup></script>

<template>
  <section class="section pt-5 pb-5">
    <div class="brand">
      <Edition />
      <h1 class="title is-1">Arctic Data Collaborative</h1>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.brand {
  h1 {
    font-weight: 800;
    line-height: 0.9;
    letter-spacing: -0.02em;
    font-size: 5rem;
    @include touch {
      font-size: 2.75rem;
    }
  }
}
</style>
