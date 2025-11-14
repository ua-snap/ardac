<script lang="ts" setup></script>

<template>
  <FrontPageSectionWrapper tag="Climate">
    <div class="tile is-ancestor">
      <div class="tile is-parent pr-5 border-right">
        <div class="tile is-child">
          <ItemTextPicture slug="story-cmip6-downscaled" />
        </div>
      </div>

      <div class="tile is-parent">
        <div class="tile is-child">
          <ItemTextPicture slug="story-fire-prone-conditions" />
        </div>
      </div>

      <div class="tile is-vertical is-parent">
        <div class="tile is-child border-bottom">
          <ItemText slug="era5-wrf-xray" />
        </div>
        <div class="tile is-child border-bottom">
          <ItemText slug="temperature-cmip6-downscaled" />
        </div>
        <div class="tile is-child">
          <ItemText slug="precipitation-cmip6-downscaled" />
        </div>
      </div>
    </div>
  </FrontPageSectionWrapper>
</template>

<style scoped lang="scss">
@import '~/assets/styles/items.scss';
</style>
