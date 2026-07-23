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
          <strong>What's new?</strong> Dive into the latest ARDAC updates! Read
          about
          <NuxtLink to="/item/story-cold-snap-1989"
            >the historic 1989 Cold Snap</NuxtLink
          >&mdash;this data story uses the
          <NuxtLink to="/item/era5-wrf-xray"
            >dynamically downscaled ERA5</NuxtLink
          >
          dataset to make the historical record come alive with reanalysis data.
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
