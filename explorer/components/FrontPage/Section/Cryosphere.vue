<script lang="ts" setup></script>

<template>
  <FrontPageSectionWrapper tag="Cryosphere">
    <div class="tile is-ancestor">
      <div class="tile is-parent pr-5 border-right">
        <div class="tile is-child">
          <ItemTextPicture slug="landfast-sea-ice" />
        </div>
      </div>
      <div class="tile is-parent pr-5 border-right">
        <div class="tile is-child">
          <ItemTextPicture slug="sea-ice-concentration" />
        </div>
      </div>
      <div class="tile is-parent pr-5 border-right">
        <div class="tile is-child">
          <ItemTextPicture slug="notebook-sea-ice-traffic" />
        </div>
      </div>
    </div>
  </FrontPageSectionWrapper>
</template>

<style scoped lang="scss">
@import '~/assets/styles/items.scss';
</style>
