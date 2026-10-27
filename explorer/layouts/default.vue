<script lang="ts" setup></script>

<template>
  <SkipLink />
  <header>
    <HeaderBanner />
    <Navbar />
    <Edition />
    <div class="container is-fullhd">
      <Header />
    </div>
    <Tagbar />
  </header>
  <main id="main-content" class="container is-fullhd" tabindex="-1">
    <slot />
  </main>
  <Footer />
</template>

<style scoped></style>
