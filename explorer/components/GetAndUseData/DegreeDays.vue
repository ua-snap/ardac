<script lang="ts" setup>
const props = defineProps({
  presentInEds: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <GetAndUseData
    :presentInEds="props.presentInEds"
    apiUrl="https://earthmaps.io/degree_days/"
    geonetworkUrl="https://catalog.snap.uaf.edu/geonetwork/srv/eng/catalog.search#/metadata/f9831074-cd3f-4c06-8601-687bd2911b7e"
  >
    <slot></slot>
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
