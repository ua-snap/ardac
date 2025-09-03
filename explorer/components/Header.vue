<script lang="ts" setup></script>

<template>
  <section class="section">
    <div class="brand">
      <h1 class="title is-1">Arctic Data Collaborative.</h1>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.brand {
  h1 {
    font-weight: 800;
    line-height: 0.9;
    font-size: 5rem;
    @include until($desktop) {
      font-size: 2.75rem;
    }
  }
}
</style>
