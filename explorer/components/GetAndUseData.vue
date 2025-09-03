<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  presentInNcr: {
    type: Boolean,
    default: false,
  },
  presentInEds: {
    type: Boolean,
    default: false,
  },
  apiUrl: {
    type: String,
  },
  geonetworkUrl: {
    type: String,
    required: false,
  },
  gitHubRepo: {
    type: String,
    required: false,
  },
})
</script>

<template>
  <div class="get-and-use-data">
    <h4 class="title is-4 mt-6">Get &amp; use this data</h4>
    <slot name="preamble"></slot>
    <div class="content is-size-5">
      <ul>
        <li v-if="props.presentInNcr && props.presentInEds">
          Access this data in the context of climate change projections at
          <a href="https://northernclimatereports.org"
            >Northern Climate Reports</a
          >
          and in the context of additional data for engineers at the
          <a href="https://arcticeds.org"
            >Arctic Environmental and Engineering Data and Design Support System
            (Arctic-EDS)</a
          >
        </li>
        <li v-else-if="props.presentInNcr">
          Access this data in the context of climate change projections at
          <a href="https://northernclimatereports.org"
            >Northern Climate Reports</a
          >
        </li>
        <li v-else-if="props.presentInEds">
          Access this data in the context of additional data for engineers at
          the
          <a href="https://arcticeds.org"
            >Arctic Engineering Decision Support (Arctic-EDS)</a
          >
        </li>
        <li>
          Query this and other datasets from an
          <a :href="props.apiUrl"
            >API that provides data in CSV and JSON format</a
          >
        </li>
        <li v-if="props.geonetworkUrl">
          <a :href="props.geonetworkUrl"
            >Download the source dataset and access metadata</a
          >
        </li>
        <li v-if="props.gitHubRepo">
          <a :href="props.gitHubRepo"
            >Visit the GitHub repository for this item.</a
          >
        </li>
        <slot></slot>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
