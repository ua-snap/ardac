<script lang="ts" setup></script>

<template>
  <HeaderBanner />
  <Navbar />
  <Edition />
  <div class="container is-fullhd">
    <Header />
    <section class="section">
      <div class="content">
        <p class="is-size-3">
          The Arctic Data Collaborative (ARDAC) provides highly-curated,
          relevant <b>Arctic datasets</b>, streamlined <b>data access</b>,
          processing <code>code examples</code> and <b>visualizations</b> to
          support research in the North.
        </p>
        <p class="trumpet is-size-4">
          <span>📢</span>
          <strong>What&rsquo;s new?</strong> Interactive data stories about
          <NuxtLink to="/item/places-and-polygons"
            >places &amp; polygons</NuxtLink
          >
          in ARDAC, a
          <NuxtLink to="/item/story-climate-stripes-2"
            >climate stripe visualization</NuxtLink
          >
          that incorporates projected climate data, an introduction about how
          <NuxtLink to="/item/story-climate-indicators"
            >climate indicators</NuxtLink
          >
          help explain important ecological thresholds, and integration of the
          <NuxtLink to="/tag/CMIP6">E3SM CMIP6 climate model output</NuxtLink>
          throughout all available CMIP6 variables.
        </p>
      </div>
    </section>
    <Tagbar />
    <slot />
  </div>
  <Footer />
</template>

<style lang="scss" scoped>
.trumpet span {
  display: inline-block;
  margin-right: 0.75rem;
  -webkit-transform: rotateY(180deg);
  -moz-transform: rotateY(180deg);
  -o-transform: rotateY(180deg);
  -ms-transform: rotateY(180deg);
}
</style>
