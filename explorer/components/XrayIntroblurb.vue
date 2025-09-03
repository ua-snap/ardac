<script lang="ts" setup>
const props = defineProps(['resolution', 'unit', 'cmip', 'beta'])
</script>

<template>
  <blockquote class="introblurb">
    <p><span class="robot">🔬</span> This is a <strong>dataset x-ray</strong> which lets you view <em>maps</em>, get <em>charts</em>, and <em>drill</em> into this dataset to get a CSV of data for a place.</p>
    <p v-if="cmip">This dataset shows projected climate model output.  Here&rsquo;s some key relevant information:</p>
    <ul>
      <li v-if="beta">⚠️ This dataset, while accurate and of good quality, <strong>does not have a peer-reviewed publication associated with it yet</strong>. &#x2192; <a href="mailto:uaf-snap-data-tools@alaska.edu">get in touch</a> about similar data which are peer reviewed</li>
      <li v-if="cmip == 6">GDFL-ESM4, CESM2, etc&hellip; these are the names of climate models. <a href="https://doi.org/10.1016/j.envsoft.2018.03.021">&#x2192; read more</a></li>
      <li v-if="cmip == 5">NCAR CCSM4, MRI CGCM3, etc&hellip; these are the names of climate models.</li>
      <li v-if="cmip == 6">SSP1-2.5, SSP2-4.5 etc… these are socioeconomic and emission scenarios. <a href="https://glisa.umich.edu/wp-content/uploads/2021/03/A_Practitioners_Guide_to_Climate_Model_Scenarios.pdf">&#x2192; read more</a></li>
      <li v-if="cmip == 5">RCP 4.5, RCP 8.5... these are representative concentration pathways representing emissions scenarios.</li>
      <li v-if="cmip == 6">There are <NuxtLink to="/item/story-arctic-climate-data-node">thirteen models</NuxtLink> included in this dataset, and up to four different models.  Not all models have all scenarios available.</li>
      <li>the spatial resolution of this dataset is <strong>{{ resolution }}&#8239;{{ unit }}</strong>.</li>
    </ul>
  </blockquote>
</template>

<style scoped lang="scss">
.robot {
  font-size: 2rem;
  vertical-align: baseline;
  display: inline-block;
  margin-right: 0.35rem;
}

strong {
  font-weight: 600;
}
</style>
