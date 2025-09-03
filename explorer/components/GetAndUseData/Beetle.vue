<script lang="ts" setup></script>

<template>
  <GetAndUseData
    :presentInNcr="true"
    apiUrl="https://earthmaps.io/beetles/"
    geonetworkUrl="https://catalog.snap.uaf.edu/geonetwork/srv/eng/catalog.search#/metadata/090daa3e-b1f1-4dc5-81f2-b7817bd011ee"
  >
    <template #preamble>
      <slot name="preamble"></slot>
    </template>
    <li><a href="https://uaf-snap.org/wp-content/uploads/2023/06/20230627_spruce-beetle-climate-model-white-paper.pdf">Read a report about this project</a></li>
    <li>
      Academic paper submission is in progress.  Reach out to us at uaf-snap-data-tools@alaska.edu if you have questions
    </li>
  </GetAndUseData>
</template>
