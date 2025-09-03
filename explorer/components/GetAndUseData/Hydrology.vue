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
    apiUrl="https://earthmaps.io/hydrology/"
    geonetworkUrl="https://catalog.snap.uaf.edu/geonetwork/srv/eng/catalog.search#/metadata/2610188c-aa38-4f47-8987-b36ec72cdd0d"
  >
    <li>
      Academic references:
      <blockquote>
        <p>
          Mizukami, N., Newman, A. J., Wood, A. W., Gutmann, E. D., and Hamman,
          J. J. (2022). Boulder, CO: UCAR/NCAR/RAL.
          <a href="https://doi.org/10.5065/c3kn-2y77"
            >https://doi.org/10.5065/c3kn-2y77</a
          >
        </p>
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
