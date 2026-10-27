<script lang="ts" setup>
import { metas } from '@/utils/metas'

// SEO meta tag configuration
useSeoMeta({
  title: metas.title,
  ogTitle: metas.title,
  description: metas.description,
  ogDescription: metas.description,
  ogImage: metas.image,
  twitterCard: 'summary_large_image',
})

// Pages set their own title with useHead({ title }), and it gets the site
// name appended here so every page has a unique, descriptive title.
useHead({
  titleTemplate: pageTitle =>
    pageTitle && pageTitle !== metas.title
      ? `${pageTitle} | ${metas.title}`
      : metas.title,
})

// Client-side navigation doesn't trigger a page load, so screen readers are
// not told that the page changed. Announce the new page title instead.
const announcement = ref('')
const router = useRouter()
router.afterEach((to, from) => {
  if (to.path !== from.path) {
    // Wait for the new page to set its title.
    setTimeout(() => {
      announcement.value = document.title
    }, 300)
  }
})
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <div class="is-sr-only" aria-live="polite" aria-atomic="true">
      {{ announcement }}
    </div>
  </div>
</template>
