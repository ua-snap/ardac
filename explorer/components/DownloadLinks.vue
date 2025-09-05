<script lang="ts" setup>
interface Props {
  endpoint: string
  variables?: string
}

const props = defineProps<Props>()

const placesStore = usePlacesStore()
const runtimeConfig = useRuntimeConfig()

const latLng = computed<LatLngValue>(() => placesStore.latLng)
const selectedCommunity = computed<CommunityValue>(
  () => placesStore.selectedCommunity
)

const baseUrl = computed(() => {
  if (!latLng.value) return ''
  return (
    runtimeConfig.public.apiUrl +
    props.endpoint +
    '/' +
    latLng.value.lat +
    '/' +
    latLng.value.lng
  )
})

const jsonUrl = computed(() => {
  if (!baseUrl.value) return ''
  let url = baseUrl.value

  // Used by CMIP6 to specify multiple variables.
  if (props.variables) {
    url += '?vars=' + props.variables
  }
  if (selectedCommunity.value) {
    url +=
      (url.includes('?') ? '&' : '?') +
      'community=' +
      selectedCommunity.value.id
  }
  return url
})

const csvUrl = computed(() => {
  if (!jsonUrl.value) return ''
  let url = jsonUrl.value

  url += (url.includes('?') ? '&' : '?') + 'format=csv'

  return url
})
</script>

<template>
  <ul>
    <li>
      <a :href="csvUrl">Download as CSV</a>
    </li>
    <li>
      <a :href="jsonUrl">Download as JSON</a>
    </li>
  </ul>
</template>
