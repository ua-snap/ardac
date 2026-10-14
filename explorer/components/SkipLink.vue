<script lang="ts" setup>
// Lets keyboard users jump past the navigation that repeats on every page.
const skipToMain = () => {
  document.getElementById('main-content')?.focus()
}
</script>

<template>
  <a class="skip-link" href="#main-content" @click.prevent="skipToMain"
    >Skip to main content</a
  >
</template>

<style lang="scss" scoped>
.skip-link {
  position: absolute;
  left: 0.5rem;
  top: -10rem;
  z-index: 1000; // above the header banner
  padding: 0.75rem 1rem;
  background-color: $white-lighter;
  color: $link;
  font-weight: 600;
  text-decoration: underline;
  &:focus {
    top: 0.5rem;
  }
}
</style>
