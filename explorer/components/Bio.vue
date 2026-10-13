<script lang="ts" setup>
import bios from '~/assets/bios'

const props = defineProps<{
  person: Person
}>()

const bio = bios.find(i => {
  return i.person === props.person
})

</script>

<template>
  <div v-if="bio && bio.image" class="bio content is-size-5 pb-3 mb-5">
    <figure class="image m-0">
      <img
        class="is-rounded"
        :src="'/images/people/' + bio.image"
        :alt="`Photo of ${bio.person}`"
      />
    </figure>
    <div class="is-align-content-center pl-5">
      <h4 class="mb-1">{{ bio?.person }}</h4>
      <p v-html="bio?.blurb"></p>
    </div>
    <div v-if="$slots.default">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
// Photo, blurb and any related items sit side by side from tablet width up.
.bio {
  @include tablet {
    display: flex;
    > figure {
      flex: none;
      width: calc(100% / 6);
    }
    > div {
      flex: 1 1 0;
    }
  }
}

img {
  max-width: 150px;
}

.bio p {
  max-width: 50rem;
  line-height: 1.3;
}
</style>
