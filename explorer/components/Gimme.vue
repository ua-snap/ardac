<script lang="ts" setup>
// bbox order is
// [ lower-left lng, lower-left lat, upper-right lng, upper-right lat ]
interface Props {
  bbox?: number[]
  extent?: Extent
  ocean?: boolean
  communitiesEnabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  bbox: () => [-179.1506, 51.229, -129.9795, 71.3526],
  extent: null,
  ocean: false,
  communitiesEnabled: true,
})

let bbox = props.bbox
let extent = props.extent
let communitiesEnabled = props.communitiesEnabled

const placesStore = usePlacesStore()

const { $autoComplete, $parseDMS } = useNuxtApp()

const fieldMessage = ref('') // Helper message when user is entering lat/lng
const parsedLatLng: Ref<LatLngValue> = ref(undefined)
const latLngIsValid = ref(false)
const placeIsSelected = ref(false) // has the user confirmed a place?
const placeSelectionType: Ref<PlaceType> = ref(undefined) // community | latLng
const selectedCommunityName = ref('') // i.e. Fairbanks, etc
const inputValue = ref('') // input value for autocompleter
const gimmeInput = ref() // DOM element of #gimme

onMounted(() => {
  let placeHolderText: string
  if (communitiesEnabled) {
    placeHolderText = 'Search community names or enter a lat/long'
  } else {
    placeHolderText = 'Enter a lat/long'
  }
  let config = {
    selector: '#gimme',
    placeHolder: placeHolderText,
    data: {
      src: async (query: string) => {
        if (!(query.length >= 3 && communitiesEnabled)) {
          return []
        }
        const extentParam = typeof extent === 'string' ? extent : undefined
        let results = await placesStore.fetchCommunitiesBySubstringAndExtent(
          query,
          extentParam
        )
        if (bbox) {
          results = results.filter(
            (c: Community) =>
              c.longitude >= bbox[0] &&
              c.longitude <= bbox[2] &&
              c.latitude >= bbox[1] &&
              c.latitude <= bbox[3]
          )
        }
        if (results.length === 0) {
          fieldMessage.value = '⚠️ Sorry, no matching communities within the extent of this dataset were found.'
        } else {
          fieldMessage.value = ''
        }
        return results
      },
      keys: ['name'],
    },
    searchEngine: (query: string, record: any) => {
      // Required for the autocomplete library to not filter results
      return record
    },
    threshold: 3,
    debounce: 200,
    resultsList: {
      maxResults: 999,
    },
    // Include alt name if possible
    resultItem: {
      element: (element: HTMLElement, match: any) => {
        let community = match.value
        if (community.alt_name) {
          element.innerHTML =
            element.innerHTML + ' <span>/ ' + community.alt_name + '</span>'
        }
        if (community.region) {
          element.innerHTML =
            element.innerHTML +
            ', <span class="region"> ' +
            community.region +
            '</span>'
        }
        element.innerHTML +=
          '<span class="country">, ' + community.country + '</span>'
      },
    },
    // Intercept/test for valid Lat/Lng
    query: (input: string) => {
      validate(input)
      return input
    },
  }

  new $autoComplete(config)

  // When a placename is selected, populate the store.
  gimmeInput.value.addEventListener('selection', function (event: CustomEvent) {
    let community = event.detail.selection.value

    // If it's an ocean type selector, choose the associated ocean pixel.
    if (props.ocean) {
      placesStore.latLng = {
        lat: community.ocean_lat1,
        lng: community.ocean_lon1,
      }
    } else {
      placesStore.latLng = { lat: community.latitude, lng: community.longitude }
    }
    placesStore.selectedCommunity = community
    placeIsSelected.value = true
    placeSelectionType.value = 'community'
    selectedCommunityName.value = community.name
    if (community.alt_name) {
      selectedCommunityName.value += ' / ' + community.alt_name
    }
    if (community.region) {
      selectedCommunityName.value += ', ' + community.region
    }
    selectedCommunityName.value += ', ' + community.country
  })
})

const validate = (latLng: string) => {
  let lat: number
  let lon: number

  // If it's alphanumeric or empty or too short, don't try to parse / validate
  if (latLng === '' || /^[a-zA-Z]+/.test(latLng) || latLng.length <= 3) {
    fieldMessage.value = ''
    latLngIsValid.value = false
    return false
  }

  // ParseDMS throws if parsing fails: capture + ignore
  try {
    let parsedDms = $parseDMS(latLng)
    if (parsedDms && parsedDms.lat && parsedDms.lon) {
      lat = parsedDms.lat
      lon = parsedDms.lon

      // This currently does not support BBOXes that cross the antimeridian.
      let isInsideBBOX =
        lat >= bbox[1] && lat <= bbox[3] && lon >= bbox[0] && lon <= bbox[2]

      if (!isInsideBBOX) {
        fieldMessage.value =
          '⚠️ This point is outside the bounding box of data: latitude between ' +
          bbox[1] +
          ' – ' +
          bbox[3] +
          ', longitude between ' +
          bbox[0] +
          ' – ' +
          bbox[2]
        latLngIsValid.value = false
        return false
      }

      fieldMessage.value = ''

      // Rounding!
      lat = +lat.toFixed(4)
      lon = +lon.toFixed(4)
      parsedLatLng.value = { lat: lat, lng: lon } as LatLng
      latLngIsValid.value = true
      return parsedLatLng.value
    }
  } catch (e) {
    // ignore, it's ParseDMS throwing an error
  }
  fieldMessage.value = `Lat/long must be in decimal degrees or DMS format, i.e. 65°30'0.56" -140°7'34.45"`
  latLngIsValid.value = false
  parsedLatLng.value = undefined
  placesStore.latLng = undefined
  return false
}

function setLatLng() {
  placesStore.latLng = parsedLatLng.value
  placeIsSelected.value = true
  placeSelectionType.value = 'latLng'
}

async function clearSelectedPlace() {
  placesStore.latLng = undefined
  placesStore.selectedCommunity = undefined
  placeIsSelected.value = false
  placeSelectionType.value = undefined
  inputValue.value = '' // clear input
  fieldMessage.value = '' // clear field message
  latLngIsValid.value = false // hide button

  await nextTick() // so the focus works
  gimmeInput.value.focus()
}

const placeName = computed(() => {
  if (placeSelectionType.value === 'latLng') {
    return parsedLatLng.value?.lat + ', ' + parsedLatLng.value?.lng
  } else {
    return selectedCommunityName.value
  }
})

const nothingButErrors = computed(() => {
  return Object.values(dataErrors.value).every(error => error == true)
})

const dataStore = useDataStore()
const dataErrors = computed<Record<string, boolean>>(() => dataStore.dataErrors)
watch(nothingButErrors, async () => {
  if (nothingButErrors) {
    fieldMessage.value =
      '⚠️ Failed to load data for the selected location. Please choose a different location.'
  } else {
    fieldMessage.value = ''
  }
})

onUnmounted(() => {
  placesStore.latLng = undefined
  placesStore.selectedCommunity = undefined
})
</script>

<template>
  <div class="my-3">
    <div v-show="placeIsSelected && !nothingButErrors" class="selected-place">
      <div class="content is-size-5">
        <p>
          Showing data for
          <span v-if="props.ocean && communitiesEnabled"
            >an ocean location near</span
          >
          {{ placeName }}.
          <button class="button is-link is-light" @click="clearSelectedPlace">
            &#x21BA; Pick a new place
          </button>
        </p>
      </div>
    </div>
    <div v-show="!placeIsSelected || nothingButErrors" class="field">
      <div class="control">
        <label class="label is-size-4"
          >Get data for
          <span v-if="communitiesEnabled">a community or by</span>
          lat/long</label
        >
        <p v-if="communitiesEnabled" class="is-size-5">
          Only communities within the footprint of the data are included in this
          search.
          <span v-if="ocean"
            >Because this dataset covers the ocean,
            <strong>only coastal communities are available</strong>, and the
            closest point in the ocean is used to retrieve data.</span
          >
        </p>
        <p v-else>
          <strong>Communities are not available for this dataset.</strong>
          Please choose a lat/long coordinate.
        </p>
        <input id="gimme" v-model="inputValue" ref="gimmeInput" />
        <button
          v-if="latLngIsValid"
          @click="setLatLng"
          class="button is-link is-light ml-3"
        >
          Get data for {{ parsedLatLng?.lat }}, {{ parsedLatLng?.lng }}
        </button>
      </div>
      <p class="help" v-html="fieldMessage" />
    </div>
  </div>
  <LoadIndicator />
</template>

<style lang="scss" scoped>
@import '~/node_modules/@tarekraafat/autocomplete.js/dist/css/autoComplete.02.css';

:deep(.autoComplete_wrapper > ul > li:hover) {
  background-color: $highlight;
}

:deep(.autoComplete_wrapper > ul > li[aria-selected='true']) {
  background-color: $highlight;
}

.selected-place button {
  vertical-align: baseline;
}

#gimme {
  background-image: none;
}

.help {
  font-size: 1.25rem;
}
</style>
