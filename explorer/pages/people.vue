<script lang="ts" setup>
useHead({ title: 'People' })
</script>

<template>
  <div class="section">
    <div class="content is-size-5">
      <h2 class="title is-2">People</h2>
      <p>The Arctic Data Collaborative is increasing access to high quality climate information for the Arctic by partnering with experts committed to accessible data and trans-disciplinary research.</p>
    </div>
  </div>
  <div class="section bios">
    <Bio person="Peter Bieniek">
      <ul>
        <li><ItemBrief slug="era5-wrf-xray" /></li>
      </ul>
    </Bio>

    <Bio person="Bruce Crevensten">
      <ul>
        <li><ItemBrief slug="story-arctic-climate-data-node" /></li>
      </ul>
    </Bio>

    <Bio person="Mike DeLue">
      <ul>
        <li><ItemBrief slug="story-climate-stripes-1" /></li>
      </ul>
    </Bio>

    <Bio person="Hajo Eicken">
      <ul>
        <li><ItemBrief slug="landfast-sea-ice" /></li>
        <li><ItemBrief slug="summary-landfast-sea-ice" /></li>
      </ul>
    </Bio>

    <Bio person="Nancy Fresco">
      <ul>
        <li><ItemBrief slug="story-beetle-climate-protection" /></li>
        <li><ItemBrief slug="climate-beetle-protection" /></li>
        <li><ItemBrief slug="alfresco-vegetation" /></li>
        <li><ItemBrief slug="alfresco-flammability" /></li>
      </ul>
    </Bio>

    <Bio person="Jeremy Littell">
      <ul>
        <li><ItemBrief slug="story-cmip6-downscaled" /></li>
        <li><ItemBrief slug="temperature-cmip6-downscaled" /></li>
        <li><ItemBrief slug="precipitation-cmip6-downscaled" /></li>
      </ul>
    </Bio>

    <Bio person="Andy Mahoney">
      <ul>
        <li><ItemBrief slug="landfast-sea-ice" /></li>
        <li><ItemBrief slug="summary-landfast-sea-ice" /></li>
      </ul>
    </Bio>

    <Bio person="Josh Paul">
      <ul>
        <li><ItemBrief slug="story-cmip6-downscaled" /></li>
      </ul>
    </Bio>

    <Bio person="Charlie Parr">
      <ul>
        <li><ItemBrief slug="era5-wrf-xray" /></li>
        <li><ItemBrief slug="story-fire-prone-conditions" /></li>
        <li><ItemBrief slug="story-cold-snap-1989" /></li>
      </ul>
    </Bio>

    <Bio person="Kyle Redilla">
      <ul>
        <li><ItemBrief slug="climate-beetle-protection" /></li>
      </ul>
    </Bio>

    <Bio person="Scott Rupp">
      <ul>
        <li><ItemBrief slug="story-arctic-climate-data-node" /></li>
        <li><ItemBrief slug="alfresco-flammability" /></li>
        <li><ItemBrief slug="alfresco-vegetation" /></li>
      </ul>
    </Bio>

    <Bio person="Anjali Shah">
      <ul>
        <li><ItemBrief slug="story-cold-snap-1989" /></li>
      </ul>
    </Bio>

    <Bio person="Craig Stephenson">
      <ul>
        <li><ItemBrief slug="story-cmip6-downscaled" /></li>
        <li><ItemBrief slug="temperature-cmip6-downscaled" /></li>
        <li><ItemBrief slug="precipitation-cmip6-downscaled" /></li>
      </ul>
    </Bio>

    <Bio person="Rick Thoman">
      <ul>
        <li><ItemBrief slug="story-cold-snap-1989" /></li>
      </ul>
    </Bio>

    <Bio person="Chris Waigl">
      <ul>
        <li><ItemBrief slug="era5-wrf-xray" /></li>
        <li><ItemBrief slug="story-fire-prone-conditions" /></li>
      </ul>
    </Bio>

    <Bio person="John Walsh">
      <ul>
        <li><ItemBrief slug="sea-ice-concentration" /></li>
      </ul>
    </Bio>
  </div>
</template>

<style lang="scss" scoped>
@import '~/assets/styles/items.scss';

:deep(ul li .item.brief a h3) {
  color: $link;
}
</style>
