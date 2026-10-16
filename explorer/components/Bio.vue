<script lang="ts" setup>
import bios from '~/assets/bios'
import { personAnchor } from '~/utils/slugs'

const props = withDefaults(
  defineProps<{
    person: Person
    // Heading level for the name: 3 on the People page, 4 under an item
    // page's "People behind this work" heading.
    level?: 3 | 4
    // Link the name to this person's card on the People page.
    linkToPeople?: boolean
    // List the items this person worked on.
    showItems?: boolean
  }>(),
  { level: 3 }
)

const store = useStore()

const bio = bios.find(i => {
  return i.person === props.person
})
const anchor = personAnchor(props.person)
const items = props.showItems ? store.itemsByPerson(props.person) : []
</script>

<template>
  <article v-if="bio" :id="anchor" class="bio person-card">
    <div class="is-flex is-align-items-center mb-3">
      <figure class="image person-card-photo mr-4">
        <img class="is-rounded" :src="'/images/people/' + bio.image" alt="" />
      </figure>
      <div>
        <component :is="`h${level}`" class="title is-5 mb-1">
          <NuxtLink
            v-if="linkToPeople"
            :to="{ path: '/people', hash: '#' + anchor }"
          >
            {{ bio.person }}
          </NuxtLink>
          <template v-else>{{ bio.person }}</template>
        </component>
        <p v-if="bio.role" class="role">{{ bio.role }}</p>
      </div>
    </div>
    <p v-html="bio.blurb"></p>
    <template v-if="items.length">
      <p :id="anchor + '-items'" class="worked-on mt-4 mb-1">Worked on</p>
      <ul :aria-labelledby="anchor + '-items'">
        <li v-for="item in items" :key="item.slug">
          <ItemBrief :slug="item.slug" />
        </li>
      </ul>
    </template>
  </article>
</template>

<style lang="scss" scoped>
.bio {
  scroll-margin-top: 1rem;
}

figure img {
  height: 100%;
  object-fit: cover;
}

.role {
  color: $gray;
}

.worked-on {
  font-weight: 600;
}

ul li + li {
  margin-top: 0.25rem;
}
</style>
