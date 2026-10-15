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
const route = useRoute()

const bio = bios.find(i => {
  return i.person === props.person
})
const anchor = personAnchor(props.person)
const items = props.showItems ? store.itemsByPerson(props.person) : []

// Outline the card a link from an item page landed on.
// :target doesn't update when the router changes the hash.
const isTarget = computed(() => route.hash === '#' + anchor)
</script>

<template>
  <article
    v-if="bio"
    :id="anchor"
    class="bio"
    :class="{ 'is-target': isTarget }"
  >
    <div class="is-flex is-align-items-center mb-3">
      <figure class="image mr-4">
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
// A card that fills its grid cell, so cards in a row share a height.
.bio {
  height: 100%;
  padding: 1rem;
  @include tablet {
    padding: 1.25rem 1.5rem;
  }
  background-color: $white-lighter;
  border: 1px solid $white-darker;
  border-radius: 0.5rem;
  line-height: 1.5;
  scroll-margin-top: 1rem;

  &.is-target {
    outline: 2px solid $link;
    outline-offset: -1px;
  }
}

// Smaller photos on phones leave room for the name beside them.
figure {
  flex: none;
  width: 64px;
  height: 64px;
  @include tablet {
    width: 96px;
    height: 96px;
  }
  img {
    height: 100%;
    object-fit: cover;
  }
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
