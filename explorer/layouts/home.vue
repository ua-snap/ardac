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
  </header>
  <main id="main-content" class="container is-fullhd" tabindex="-1">
    <section class="section pt-0 pb-5">
      <div class="content">
        <p class="trumpet is-size-3 is-size-4-mobile">
          <span aria-hidden="true">📢</span>
          <strong>What&rsquo;s new?</strong> Explore more than 70,000 field
          observations of permafrost, active layer and thaw depth in
          <strong
            ><NuxtLink to="/item/cusp-permafrost-observations"
              >CUSP: the CommUnity near-Surface Permafrost dataset</NuxtLink
            ></strong
          >, a community-built dataset that you can help us build out.
        </p>
        <p class="is-size-4 is-size-5-mobile">
          The Arctic Data Collaborative (ARDAC) provides highly-curated,
          relevant <b>Arctic datasets</b>, streamlined <b>data access</b> and
          <b>visualizations</b> to support research in the North.
        </p>
      </div>
    </section>
    <Tagbar />
    <slot />
  </main>
  <Footer />
</template>

<style lang="scss" scoped>
// Each intro paragraph is capped at 65 characters of its own font size.
.content p {
  max-width: 65ch;
}

.trumpet span {
  display: inline-block;
  margin-right: 0.75rem;
  -webkit-transform: rotateY(180deg);
  -moz-transform: rotateY(180deg);
  -o-transform: rotateY(180deg);
  -ms-transform: rotateY(180deg);
}
</style>
