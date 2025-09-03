<script lang="ts" setup></script>

<template>
  <HeaderBanner />
  <Navbar />
  <Edition />
  <div class="container is-fullhd">
    <Header />
    <Tagbar />
    <slot />
  </div>
  <Footer />
</template>

<style scoped></style>
