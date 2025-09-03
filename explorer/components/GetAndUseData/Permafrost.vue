<script lang="ts" setup>
const props = defineProps({
  presentInNcr: {
    type: Boolean,
    default: false,
  },
  presentInEds: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <GetAndUseData
    :presentInNcr="props.presentInNcr"
    :presentInEds="props.presentInEds"
    apiUrl="https://earthmaps.io/permafrost/"
    geonetworkUrl="https://catalog.snap.uaf.edu/geonetwork/srv/eng/catalog.search#/metadata/c24a957b-8a56-40bf-bc09-43a567182d36"
  >
    <li>
      Academic reference:
      <blockquote>
        <p>
          Marchenko, S., Romanovsky, V., &amp; Tipenko, G. (2008). Numerical
          modeling of spatial permafrost dynamics in Alaska.
          <i
            >Ninth International Conference on Permafrost, Online Proceedings,
            Volume 2</i
          >, 1125&ndash;1130. Accessed 2023-09-08 from
          <a href="https://www.permafrost.org/event/icop9/"
            >https://www.permafrost.org/event/icop9/</a
          >
        </p>
      </blockquote>
    </li>
  </GetAndUseData>
</template>
