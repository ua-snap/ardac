<script lang="ts" setup>
import { computed } from 'vue'

interface ReferenceItem {
  id?: string
  citation: string
}

const props = withDefaults(
  defineProps<{
    references: ReferenceItem[]
    title?: string
    ordered?: boolean
  }>(),
  {
    title: 'References',
    ordered: true,
  },
)

const resolvedReferences = computed(() =>
  props.references.map((reference, index) => ({
    ...reference,
    anchorId: reference.id ?? `reference-${index + 1}`,
  })),
)
</script>

<template>
  <div class="references content">
    <h4 class="title is-4">{{ props.title }}</h4>
    <component :is="props.ordered ? 'ol' : 'ul'" class="references-list">
      <li
        v-for="reference in resolvedReferences"
        :key="reference.anchorId"
        :id="reference.anchorId"
        v-html="reference.citation"
      ></li>
    </component>
  </div>
</template>

<style scoped>
.references-list {
  padding-left: 1.5rem;
}

.references-list li + li {
  margin-top: 0.5rem;
}
</style>
