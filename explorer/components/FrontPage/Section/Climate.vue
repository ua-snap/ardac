<script lang="ts" setup></script>

<template>
  <FrontPageSectionWrapper tag="Climate">
    <div class="columns">
      <div class="column pr-5 border-right">
        <ItemTextPicture slug="story-cmip6-downscaled" />
      </div>

      <div class="column">
        <ItemTextPicture slug="story-fire-prone-conditions" />
      </div>

      <div class="column stack">
        <div class="border-bottom">
          <ItemText slug="era5-wrf-xray" />
        </div>
        <div class="border-bottom">
          <ItemText slug="temperature-cmip6-downscaled" />
        </div>
        <div>
          <ItemText slug="precipitation-cmip6-downscaled" />
        </div>
      </div>
    </div>
  </FrontPageSectionWrapper>
</template>

<style scoped lang="scss">
@import '~/assets/styles/items.scss';
</style>
