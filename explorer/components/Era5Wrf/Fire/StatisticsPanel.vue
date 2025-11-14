<script lang="ts" setup>
import type { FireWeatherStatistics } from '~/utils/era5WrfStatistics'

interface Props {
  statistics: FireWeatherStatistics
  selectedYear: number
  climatologyPeriodLabel: string
}

const placesStore = usePlacesStore()
const selectedCommunity = computed<CommunityValue>(
  () => placesStore.selectedCommunity
)

const latLng = computed<LatLngValue>(
  () => placesStore.latLng
)

const placeName = computed(
  () => {
    if(selectedCommunity.value) {
      return selectedCommunity.value.name
    }
    if(latLng) { return latLng.value }
  }
)

const props = defineProps<Props>()
</script>

<template>
  <div v-if="statistics" class="card my-6 pb-4">
    <div class="card-content my-5 py-6">
      <h3 class="card-title">
        Fire-prone conditions at {{ placeName }}<br>
        {{ selectedYear }} <span class="jazz">vs</span>
        {{ climatologyPeriodLabel }}
      </h3>
      <div class="content mt-6">
        <div class="level">
          <div class="level-item has-text-centered">
            <div>
              <p class="subtitle">Hot Days</p>
              <p class="title">{{ statistics.hotDays }}</p>
              <p class="heading">days &gt;90<sup>th</sup> percentile</p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <p class="subtitle">Dry Days</p>
              <p class="title">{{ statistics.dryDays }}</p>
              <p class="heading">days &lt;10<sup>th</sup> percentile</p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <p class="subtitle">Hot and Dry Days</p>
              <p class="title hot-dry">{{ statistics.fireProneDays }}</p>
              <p>&nbsp;</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Text&display=swap');

.card-title {
  text-align: center;
  font-size: 220%;
  color: oklch(0.2309 0.0271 36.28);
  font-family: "DM Serif Text", serif;
  font-weight: 400;
  font-style: normal;

  span.jazz {
    font-style: italic;
    font-weight: 300;
    font-size: 85%;
    display: inline-block;
    padding-right: 0.2em;
  }
}

.level-item {
  p.subtitle {
    text-transform: uppercase;
    color: oklch(0.4 0.0321 231.35);
    font-weight: 500;
  }
  p.title {
    font-size: 350%;
    font-weight: 900;
    margin-bottom: 0;
    padding-bottom: 0;
  }
  p.heading {
    font-size: 80%;
  }

  .hot-dry {
    color: oklch(0.6952 0.2492 36.28);
  }
}
</style>
