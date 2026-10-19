<script lang="ts" setup>
import items from '~/assets/items'
import type { ConcreteComponent } from 'vue'
import { getCurrentInstance } from 'vue'
const route = useRoute()

let tag = route.params.tag as Tag
useHead({ title: tag })

// Explainers keep their registry order. X-rays are alphabetical so a long
// list is easy to scan and pairs like "Summer Days" and "Summer Days, CMIP6"
// sit together.
const tagItems: Item[] = items.filter((item: Item) => item.tags?.includes(tag))
const explainers = tagItems.filter(item => item.type === 'explainer')
const xrays = tagItems
  .filter(item => item.type === 'xray')
  .sort((a, b) => a.title.localeCompare(b.title))

// For example, "7 explainers and 17 data X-rays".
const count = (n: number, one: string, many: string) =>
  `${n} ${n === 1 ? one : many}`
const summary = [
  explainers.length && count(explainers.length, 'explainer', 'explainers'),
  xrays.length && count(xrays.length, 'data X-ray', 'data X-rays'),
]
  .filter(Boolean)
  .join(' and ')

// Fetch dynamic component for this topic if present.
let itemComponent: ConcreteComponent | string = ''

const componentFileExists = computed<boolean>(() => {
  let slugString = 'Topic' + tag
  let vueComponents = getCurrentInstance()?.appContext.components
  if (vueComponents?.hasOwnProperty(slugString)) {
    itemComponent = resolveComponent(slugString)
    return true
  } else {
    return false
  }
})
</script>

<template>
  <section class="section" v-if="componentFileExists">
    <Component :is="itemComponent" />
  </section>
  <section class="section">
    <div class="container">
      <h2 class="title is-2">{{ tag }}</h2>
      <p class="subtitle is-4">{{ summary }}</p>

      <!-- Explainers on the left and data X-rays on the right, stacked on
           phones. When a tag has only one type, its section fills the row. -->
      <div class="columns is-8-desktop mt-5">
        <div v-if="explainers.length" class="column">
          <h3 class="title is-3 mb-2">Explainers</h3>
          <p class="is-size-5 mb-5">
            Stories and guides that put the data in context.
          </p>
          <div class="grid is-auto-fill explainer-grid">
            <div v-for="item in explainers" :key="item.slug" class="cell">
              <ItemTextPicture :slug="item.slug" :level="4" />
            </div>
          </div>
        </div>

        <div v-if="xrays.length" class="column">
          <h3 class="title is-3 mb-2">Data X-rays</h3>
          <p class="is-size-5 mb-5">
            Maps, charts, and downloads for a place you choose.
          </p>
          <div class="grid is-auto-fill xray-grid">
            <div v-for="item in xrays" :key="item.slug" class="cell">
              <ItemText :slug="item.slug" :level="4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/items.scss';

// Bulma's grid fills each row with columns at least this wide; min() keeps
// one column from overflowing a phone screen.
.grid {
  row-gap: 1.5rem;
  column-gap: 2rem;
  --bulma-grid-column-min: min(100%, 17rem);
}

// Push each explainer's picture to the bottom of its cell so the pictures in
// a row line up whatever the length of the text above.
.explainer-grid :deep(.item) {
  height: 100%;
  display: flex;
  flex-direction: column;
  > a {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  figure {
    margin-top: auto;
  }
}
</style>
