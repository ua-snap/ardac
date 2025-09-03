<script lang="ts" setup></script>

<template>
  <FrontPageSectionWrapper tag="Climate">
    <div class="tile is-ancestor">
      <div class="tile is-parent pr-5 border-right">
        <div class="tile is-child">
          <ItemTextPicture slug="climate-beetle-protection" />
        </div>
      </div>

      <div class="tile is-parent">
        <div class="tile is-child">
          <ItemTextPicture slug="story-arctic-climate-data-node" />
        </div>
      </div>

      <div class="tile is-vertical is-parent">
        <div class="tile is-child border-bottom">
          <ItemText slug="indicator-ftc-cmip6" />
        </div>
        <div class="tile is-child border-bottom">
          <ItemText slug="indicator-wsdi" />
        </div>
        <div class="tile is-child">
          <ItemText slug="notebook-raster-database" />
        </div>
      </div>
    </div>
  </FrontPageSectionWrapper>
</template>

<style scoped lang="scss">
@import '~/assets/styles/items.scss';
</style>
