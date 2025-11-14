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
          <strong>What's new?</strong> Dive into the latest ARDAC updates!
          Explore the
          <NuxtLink to="/item/era5-xray">ERA5 X-Ray module</NuxtLink> to view
          the full <strong>ERA5 reanalysis dataset</strong> through interactive
          maps and charts and interact with
          <strong>CMIP6 Downscaled Data</strong>, including daily
          <NuxtLink to="/item/temperature-cmip6-downscaled"
            >temperature (min/max)</NuxtLink
          >
          and
          <NuxtLink to="/item/precipitation-cmip6-downscaled"
            >precipitation</NuxtLink
          >
          visualizations. Also freshly added are the
          <NuxtLink to="/item/story-cmip6-downscaled"
            >Downscaled CMIP6 Data Story</NuxtLink
          >, offering insights into Alaska's future climate, and the
          <NuxtLink to="/item/story-fire-prone-conditions"
            >Fire Prone Conditions Data Story</NuxtLink
          >, exploring fire-prone conditions in Alaska using downscaled ERA5-WRF
          data.
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
