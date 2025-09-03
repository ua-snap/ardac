import { defineStore } from 'pinia'
import items from '~/assets/items'

// To determine if an item has a component
import type { ConcreteComponent } from 'vue'
import { getCurrentInstance } from 'vue'
import { validSlug, slugToCamelCase } from '~/utils/slugs'

export const useStore = defineStore('store', () => {
  const totalItemCount = ref(items.length)
  const filteredItems: Ref<Item[]> = ref(items)
  const searchActive = ref(false)

  // Sort items with a priority field above items without a priority field.
  // For items with a priority field, lower numbers sort higher.
  const sortedFilteredItems = computed(() => {
    let itemsWithPriority = filteredItems.value.filter(
      item => item.priority !== undefined
    )
    let itemsWithoutPriority = filteredItems.value.filter(
      item => !item.priority
    )
    itemsWithPriority.sort((a, b) => a.priority! - b.priority!)
    return itemsWithPriority.concat(itemsWithoutPriority)
  })

  const itemBySlug = (slug: Slug): Item => {
    return items.find(item => item.slug === slug)!
  }

  // True if the item has an implemented component.
  // There's code duplication between this and pages/item/[slug]
  // but this is probably interim code -- consider refactoring
  // before merge?
  const itemHasComponent = (item: Item): boolean => {
    let slugString = item.slug
    if (!validSlug(slugString)) {
      return false
    }
    let camelCaseString = slugToCamelCase(slugString)

    let vueComponents = getCurrentInstance()?.appContext.components
    if (vueComponents?.hasOwnProperty(camelCaseString)) {
      return true
    }
    return false
  }

  return {
    filteredItems,
    totalItemCount,
    sortedFilteredItems,
    itemBySlug,
    itemHasComponent,
  }
})
