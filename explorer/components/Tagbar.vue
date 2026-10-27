<script lang="ts" setup>
const tags: Tag[] = [
  'Humidity',
  'Hydrology',
  'Permafrost',
  'Precipitation',
  'Sea Ice',
  'Snow',
  'Temperature',
  'Wildfire',
  'Wind',
]
</script>

<template>
  <nav class="tagbar mb-2" aria-label="Topics">
    <ul class="container is-fullhd">
      <li v-for="tag in tags" :key="tag">
        <NuxtLink
          :to="'/tag/' + tag"
          @click="trackEvent('Tagbar Clicked', { tag })"
          >{{ tag }}</NuxtLink
        >
      </li>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
// The white band and its borders run the full width of the window, and the
// list inside is a container, which keeps the links in line with the page
// content.
.tagbar {
  background-color: $white-lighter;
  // The same gray as the HeaderBanner at the top of the page.
  border-top: 1px solid $gray;
  border-bottom: 1px solid $gray;
  // One row on desktop; an even grid (5 + 4, then 3 × 3) as space runs out.
  // Side padding matches the page heading's section padding.
  ul {
    display: flex;
    flex-wrap: wrap;
    column-gap: clamp(1rem, 2.2vw, 2.5rem);
    row-gap: 0.4rem;
    padding: 0.9rem 3rem;
    @include touch {
      padding: 0.75rem 1.5rem;
    }
    @include tablet-only {
      display: grid;
      grid-template-columns: repeat(5, max-content);
      column-gap: 1.25rem;
    }
    @include mobile {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      column-gap: 0.75rem;
    }
  }
  a {
    display: inline-block;
    font-size: 1.3rem;
    font-weight: 700;
    line-height: 1.6;
    white-space: nowrap;
    color: var(--bulma-link-text);
    text-decoration: underline 2px transparent;
    text-underline-offset: 0.35em;
    transition:
      color 0.2s,
      text-decoration-color 0.2s;
    @include mobile {
      font-size: 1rem;
    }
    &:hover,
    &:focus-visible {
      color: $black;
      text-decoration-color: $black;
    }
    &.router-link-active {
      text-decoration-color: var(--bulma-link-text);
    }
  }
}
</style>
