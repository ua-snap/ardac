<script lang="ts" setup></script>

<template>
  <FrontPageSectionWrapper tag="Precipitation">
    <div class="columns">
      <div class="column stack pr-5 border-right">
        <div class="border-bottom">
          <ItemTextPicture slug="precipitation-cmip6-downscaled" />
        </div>
        <div>
          <ItemTextPicture slug="indicator-rx1day-cmip6" />
        </div>
      </div>
      <div class="column stack pr-5 border-right">
        <div class="border-bottom">
          <ItemText slug="indicator-rx1day" />
        </div>
        <div>
          <ItemText slug="indicator-rx5day" />
        </div>
      </div>
      <div class="column pl-5 border-left">
        <ItemTextPicture slug="precipitation-frequency" />
      </div>
    </div>
  </FrontPageSectionWrapper>
</template>

<style scoped lang="scss">
@import '~/assets/styles/items.scss';
</style>
