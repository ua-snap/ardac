<script lang="ts" setup>
const props = defineProps({
  presentInNcr: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <GetAndUseData
    :presentInNcr="props.presentInNcr"
    apiUrl="https://earthmaps.io/indicators/"
    geonetworkUrl="https://catalog.snap.uaf.edu/geonetwork/srv/eng/catalog.search#/metadata/1c1de476-cc9d-4c7b-b8ab-25e8f68a317e"
  >
    <li>
      Academic reference:
      <blockquote>
        <p>
          Mizukami, N., Newman, A. J., Littell, J. S., Giambelluca, T. W., Wood,
          A. W., Gutmann, E. D., Hamman, J. J., Gergel, D. R., Nijsenn, B.,
          Clark, M. P., and Arnold, J. R. (2022). New projections of 21st
          century climate and hydrology for Alaska and Hawaiʻi.
          <i>Climate Services, 27</i>, 100312.
          <a href="https://doi.org/10.1016/j.cliser.2022.100312"
            >https://doi.org/10.1016/j.cliser.2022.100312</a
          >
        </p>
      </blockquote>
    </li>
  </GetAndUseData>
</template>
