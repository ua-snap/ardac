<script lang="ts" setup>
import type { ConcreteComponent } from 'vue'
import { getCurrentInstance } from 'vue'
import { validSlug, slugToCamelCase } from '~/utils/slugs'

const route = useRoute()
let slug = route.params.slug
let itemComponent: ConcreteComponent | string

const componentFileExists = computed<boolean>(() => {
  let slugString = slug.toString()
  if (!validSlug(slugString)) {
    return false
  }
  let camelCaseString = slugToCamelCase(slugString)

  let vueComponents = getCurrentInstance()?.appContext.components
  if (vueComponents?.hasOwnProperty(camelCaseString)) {
    itemComponent = resolveComponent(camelCaseString)
    return true
  } else {
    return false
  }
})
</script>

<template>
  <div v-if="componentFileExists">
    <Component :is="itemComponent" />
  </div>
  <div v-else>
    <article class="message is-warning">
      <div class="message-header">
        <p>
          Undefined content: <code>{{ slug }}</code>
        </p>
      </div>
      <div class="message-body">
        <p>
          This slug has no content defined or was not found. We will want to
          distinguish between a 404 and an incomplete content entity at some
          point, once things are settled down.
        </p>
      </div>
    </article>
  </div>
</template>

<style scoped></style>
