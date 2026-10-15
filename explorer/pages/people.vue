<script lang="ts" setup>
import bios from '~/assets/bios'

useHead({ title: 'People' })

// Alphabetical by last name.
const lastName = (person: Person) => person.split(' ').at(-1)!
const people = bios
  .map(bio => bio.person)
  .sort((a, b) => lastName(a).localeCompare(lastName(b)))
</script>

<template>
  <div class="section">
    <div class="content is-size-5">
      <h2 class="title is-2">People</h2>
      <p>
        The Arctic Data Collaborative is increasing access to high quality
        climate information for the Arctic by partnering with experts committed
        to accessible data and trans-disciplinary research. Each card lists the
        datasets and stories that person worked on.
      </p>
    </div>
  </div>
  <div class="section pt-0">
    <div class="grid people-grid">
      <div v-for="person in people" :key="person" class="cell">
        <Bio :person="person" show-items />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
