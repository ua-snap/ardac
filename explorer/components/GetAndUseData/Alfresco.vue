<script lang="ts" setup>
const props = defineProps({
  presentInNcr: {
    type: Boolean,
    default: false,
  },
  geonetworkUrl: {
    type: String,
  },
})
</script>

<template>
  <GetAndUseData
    :presentInNcr="props.presentInNcr"
    apiUrl="https://earthmaps.io/alfresco/"
    :geonetworkUrl="props.geonetworkUrl"
  >
    <li>
      Read a
      <a href="https://doi.org/10.1007/s10980-011-9574-6"
        >paper about the research methodology</a
      >
      used to prepare the dataset from which this indicator was derived
    </li>
    <li>
      Academic reference:
      <blockquote>
        <p>
          Johnstone, J. F., Rupp, T. S., Olson, M. &amp; Verbyla, D. (2011).
          Modeling impacts of fire severity on successional trajectories and
          future fire behavior in Alaskan boreal forests.
          <i>Landscape Ecology, 26</i>, 487&ndash;500.
          <a href="https://doi.org/10.1007/s10980-011-9574-6"
            >https://doi.org/10.1007/s10980-011-9574-6</a
          >
        </p>
      </blockquote>
    </li>
  </GetAndUseData>
</template>
