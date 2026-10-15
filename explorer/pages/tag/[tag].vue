<script lang="ts" setup>
import items from '~/assets/items'
import { useStore } from '~/stores/store'
import type { ConcreteComponent } from 'vue'
import { getCurrentInstance } from 'vue'
const route = useRoute()
const store = useStore()

// Get stuff filtered/prioritized
let tag = route.params.tag as Tag
useHead({ title: tag })
let filteredItems: Item[] = items.filter((item: Item) =>
  item.tags?.includes(tag)
)
store.filteredItems = filteredItems
let filteredItemsCount = store.sortedFilteredItems.length

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

// Build the grid view of items.
var gridItems: Item[][] = []
for (let row = 0; row < store.sortedFilteredItems.length / 4; row++) {
  gridItems[row] = []
  for (let col = 0; col < 4; col++) {
    let offset = row * 4 + col
    if (store.sortedFilteredItems[offset]) {
      gridItems[row][col] = store.sortedFilteredItems[offset]
    }
  }
}
</script>

<template>
  <section class="section" v-if="componentFileExists">
    <Component :is="itemComponent" />
  </section>
  <section class="section">
    <div class="container">
      <h2 class="title is-3">{{ tag }}</h2>
      <p class="subtitle is-4">
        Showing all matching items ({{ filteredItemsCount }})
      </p>
      <div v-for="row in gridItems" class="columns is-gapless">
        <div v-for="item in row" class="column is-3 border-right border-bottom">
          <ItemTextPicture :slug="item.slug" />
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/items.scss';
// is-gapless removes the columns' padding, so these need to outrank it.
.columns.is-gapless > .column {
  padding: 0 1rem 1rem 1rem !important;
  &:first-of-type {
    padding-left: 0 !important;
  }
  &:last-of-type {
    border-right: none;
  }
}
</style>
