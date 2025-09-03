<script lang="ts" setup></script>

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
        <li><ItemBrief slug="lightning-climatology" /></li>
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

    <Bio person="Andy Mahoney">
      <ul>
        <li><ItemBrief slug="landfast-sea-ice" /></li>
      </ul>
    </Bio>
    
    <Bio person="Josh Paul">
      <ul>
        <li><ItemBrief slug="notebook-corporation-hdd" /></li>
        <li><ItemBrief slug="notebook-fmz-flammability" /></li>
      </ul>
    </Bio>

    <Bio person="Charlie Parr">
      <ul>
        <li><ItemBrief slug="notebook-frost-depth" /></li>
        <li><ItemBrief slug="notebook-design-freezing-index" /></li>
        <li><ItemBrief slug="notebook-design-thawing-index" /></li>
      </ul>
    </Bio>

    <Bio person="Kyle Redilla">
      <ul>
        <li><ItemBrief slug="notebook-raster-database" /></li>
        <li><ItemBrief slug="climate-beetle-protection" /></li>
        <li><ItemBrief slug="notebook-era5-cds-api" /></li>
      </ul>
    </Bio>

    <Bio person="Scott Rupp">
      <ul>
        <li><ItemBrief slug="story-arctic-climate-data-node" /></li>
        <li><ItemBrief slug="alfresco-flammability" /></li>
        <li><ItemBrief slug="alfresco-vegetation" /></li>
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
