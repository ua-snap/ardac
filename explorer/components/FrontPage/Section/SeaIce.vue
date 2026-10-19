<script lang="ts" setup></script>

<template>
  <FrontPageSectionWrapper tag="Sea Ice">
    <div class="columns">
      <div class="column pr-5 border-right">
        <ItemText slug="landfast-sea-ice" />
      </div>
      <div class="column px-5">
        <ItemText slug="sea-ice-concentration" />
      </div>
      <div class="column pl-5 border-left">
        <ItemTextPicture slug="summary-landfast-sea-ice" />
      </div>
    </div>
  </FrontPageSectionWrapper>
</template>

<style scoped lang="scss">
@use '../../../assets/styles/items.scss';
</style>
