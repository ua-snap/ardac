<script lang="ts" setup>
defineProps([
  'collaborator',
  'vector_geom_type',
  'feature_count_floor',
  'contributeUrl',
])
</script>

<template>
  <blockquote class="introblurb">
    <p>
      This dataset is a call for <strong>collaboration</strong> and includes
      tools for contributing observations to extend the dataset.
    </p>
    <ul>
      <li>
        You can work with <strong>{{ collaborator }}&#8239;</strong> to add data
        to this item.
      </li>
      <li v-if="vector_geom_type">
        This dataset consists of
        <strong>{{ vector_geom_type }}</strong> geometry features.
      </li>
      <li v-if="feature_count_floor">
        There are over <strong>{{ feature_count_floor }}</strong> records in
        this dataset.
      </li>
    </ul>
    <a
      v-if="contributeUrl"
      class="button is-info is-light mt-3"
      :href="contributeUrl"
    >
      Contribute to this dataset
    </a>
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
