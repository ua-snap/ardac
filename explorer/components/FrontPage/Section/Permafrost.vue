<script lang="ts" setup></script>

<template>
  <FrontPageSectionWrapper tag="Permafrost">
    <div class="tile is-ancestor">
      <div class="tile is-vertical is-parent pr-5 border-right">
        <div class="tile is-child border-bottom">
          <ItemText slug="permafrost-talik" />
        </div>
        <div class="tile is-child">
          
          <ItemTextPicture slug="map-permafrost" />
        </div>
      </div>
      <div class="tile is-parent px-5">
        <div class="tile is-child">
          <ItemTextPicture slug="permafrost-base-top" />
        </div>
      </div>
      <div class="tile is-parent pl-5 border-left">
        <div class="tile is-child">
          <ItemTextPicture slug="permafrost-magt" />
        </div>
      </div>
    </div>
  </FrontPageSectionWrapper>
</template>

<style scoped lang="scss">
@import '~/assets/styles/items.scss';
</style>
