<script lang="ts" setup></script>

<template>
  <FrontPageSectionWrapper tag="Precipitation">
    <div class="tile is-ancestor">
      <div class="tile is-vertical is-parent pr-5 border-right">
        <div class="tile is-child border-bottom">
          <ItemText slug="indicator-rx1day" />
        </div>
        <div class="tile is-child">
          <ItemText slug="indicator-rx5day" />
        </div>
      </div>
      <div class="tile is-parent px-5">
        <div class="tile is-child">
          <ItemTextPicture slug="indicator-rx1day-cmip6" />
        </div>
      </div>
      <div class="tile is-parent pl-5 border-left">
        <div class="tile is-child">
          <ItemTextPicture slug="notebook-precip-poly" />
        </div>
      </div>
    </div>
  </FrontPageSectionWrapper>
</template>

<style scoped lang="scss">
@import '~/assets/styles/items.scss';
</style>
