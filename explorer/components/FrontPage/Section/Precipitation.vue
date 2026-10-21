<script lang="ts" setup></script>

<template>
  <FrontPageSectionWrapper
    tag="Precipitation"
    subtitle="Rain and snow feed rivers, soils, and ecosystems. How much falls, and how hard, matters for water resources, flood risk, and infrastructure design."
  >
    <div class="columns">
      <div class="column stack pr-4">
        <div>
          <ItemText slug="precipitation-cmip6-downscaled" />
        </div>
        <div>
          <ItemText slug="indicator-rx1day-cmip6" />
        </div>
      </div>
      <div class="column stack px-4">
        <div>
          <ItemText slug="indicator-rx1day" />
        </div>
        <div>
          <ItemText slug="indicator-rx5day" />
        </div>
      </div>
      <div class="column pl-4">
        <ItemText slug="precipitation-frequency" />
      </div>
    </div>
  </FrontPageSectionWrapper>
</template>

<style scoped lang="scss">
@use '../../../assets/styles/items.scss';
</style>
