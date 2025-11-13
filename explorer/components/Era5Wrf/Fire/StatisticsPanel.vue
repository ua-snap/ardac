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

const props = defineProps<Props>()
</script>

<template>
  <div v-if="statistics" class="card my-6">
    <div class="card-content py-5">
      <h3 class="card-title">
        {{ selectedCommunity ? selectedCommunity.name + ',' : '' }}
        {{ selectedYear }} <span class="jazz">vs</span>
        {{ climatologyPeriodLabel }}
      </h3>
      <div class="content mt-6">
        <div class="level">
          <div class="level-item has-text-centered">
            <div>
              <p class="subtitle">Hot Days</p>
              <p class="title">{{ statistics.hotDays }}</p>
              <p class="heading">days >90th percentile</p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <p class="subtitle">Dry Days</p>
              <p class="title">{{ statistics.dryDays }}</p>
              <p class="heading">days <10th percentile</p>
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
.card-title {
  text-align: center;
  font-size: 180%;
  color: #434343;

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
  }

  .hot-dry {
    color: oklch(0.6952 0.2492 36.28);
  }
}
</style>
