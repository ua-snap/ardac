<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'

// Lazy load the map components
const RandomLocationMap = defineAsyncComponent(
  () => import('~/components/RandomLocationMap.vue')
)
const RandomPolygonMap = defineAsyncComponent(
  () => import('~/components/RandomPolygonMap.vue')
)

defineOptions({
  name: 'PlacesAndPolygons',
})

const regionsList = [
  { name: 'Alaska', key: 'alaska', countryCode: 'US' },
  { name: 'Alberta', key: 'alberta', countryCode: 'CA' },
  { name: 'British Columbia', key: 'british_columbia', countryCode: 'CA' },
  { name: 'Faroe Islands', key: 'faroe', countryCode: 'FO' },
  { name: 'Finland', key: 'finland', countryCode: 'FI' },
  { name: 'Greenland', key: 'greenland', countryCode: 'GL' },
  { name: 'Iceland', key: 'iceland', countryCode: 'IS' },
  { name: 'Manitoba', key: 'manitoba', countryCode: 'CA' },
  {
    name: 'Newfoundland and Labrador',
    key: 'newfoundland_and_labrador',
    countryCode: 'CA',
  },
  {
    name: 'Northwest Territories',
    key: 'northwest_territories',
    countryCode: 'CA',
  },
  { name: 'Norway', key: 'norway', countryCode: 'NO' },
  { name: 'Nunavut', key: 'nunavut', countryCode: 'CA' },
  { name: 'Ontario', key: 'ontario', countryCode: 'CA' },
  { name: 'Quebec', key: 'quebec', countryCode: 'CA' },
  { name: 'Russia', key: 'russia', countryCode: 'RU' },
  { name: 'Saskatchewan', key: 'saskatchewan', countryCode: 'CA' },
  { name: 'Sweden', key: 'sweden', countryCode: 'SE' },
  { name: 'Yukon', key: 'yukon', countryCode: 'CA' },
]

const getFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}
</script>

<template>
  <section class="section">
    <div class="content clamp is-size-5">
      <h3 class="title is-3">
        Places & Polygons: Geographic Lenses for Arctic Data
      </h3>

      <h3 class="title is-4">Why Geographic Context Matters</h3>
      <p>
        Geospatial data is at a minimum two-dimensional: a coordinate pair
        (latitude and longitude, or y and x) attaches data to a location on
        Earth. And while coordinates like (68.1399, -151.7321) or (-419837,
        1225439) are perfectly suited to computational data mapping and
        extraction, they fail to convey a sense of place. That's why ARDAC
        includes place names. Communities. Airports. National Parks. Wildlife
        Refuges. Climate Divisions. Fire Management Zones. Game Management
        Units. And more.
      </p>

      <p>
        Place names are how humans navigate their daily geospatial context, and
        representation matters because that context varies across space, time,
        and culture. Every single named location in Alaska (and many throughout
        the circumpolar North) are available in ARDAC. Every community is on the
        map. In some instances, an Indigenous name is included when it was
        possible to verify the name with the
        <a href="https://www.uaf.edu/anlc"
          >Alaska Native Language Center at the University of Alaska
          Fairbanks</a
        > or another expert source.
      </p>
      <p>
        From Afognak (Agw'aneq) to Yakutat (Yaakwdáat), over 500 named Alaska
        communities and locations are in ARDAC. But that is just the beginning:
        ARDAC has numerous other geographic lenses for analyzing climate and
        environmental data, including polygon vector data such as:
      </p>
      <ul class="has-list-style-none">
        <li>
          <span class="emoji-bullet">⚖️</span>
          <strong>Administrative boundaries</strong> (boroughs, census areas)
        </li>
        <li>
          <span class="emoji-bullet">🔥</span>
          <strong>Fire management zones</strong>
        </li>
        <li>
          <span class="emoji-bullet">🐻</span>
          <strong>Wildlife management units</strong>
        </li>
        <li>
          <span class="emoji-bullet">🌿</span>
          <strong>Protected areas</strong> (parks, wildlife refuges, critical
          habitat areas)
        </li>
        <li>
          <span class="emoji-bullet">🌊</span>
          <strong>Watersheds</strong> (hydrologic units)
        </li>
        <li>
          <span class="emoji-bullet">➕</span>
          <strong>And more!</strong> (ethnolinguistic regions, climate
          divisions, ecoregions, etc.)
        </li>
      </ul>
    </div>
  </section>
  <section class="section blurbs">
    <div class="columns is-desktop is-variable is-4">
      <div class="column pr-6">
        <div class="content is-size-5">
          <h3 class="title is-4">Point Locations</h3>
          <p>
            Over <strong>25,000 named point locations</strong> across the
            circumpolar North are available in ARDAC.
          </p>
          <RandomLocationMap />
          <p>
            Indigenous toponyms and/or proper orthography are included where
            appropriate, for example:
          </p>
          <ul>
            <li>Utqiaġvik (Barrow), Alaska</li>
            <li>Igluligaarjuk / ᐃᒡᓗᓕᒑᕐᔪᒃ (Chesterfield Inlet), Nunavut</li>
            <li>Воркута (Vorkuta), Russia</li>
            <li>Bjørnøya, Svalbard, Norway</li>
          </ul>

          <p>
            &#x2192; see an example:
            <NuxtLink to="/item/notebook-perm-obs-temp"
              >Combine and compare permafrost observations with modeled baseline
              air temperature data using SNAP Data API point location
              queries.</NuxtLink
            >
          </p>

          <h4 class="title is-5 mt-6 mb-2">Point Location Features</h4>
          <p>
            Thousands of point locations are manually vetted for geographic
            accuracy. Place name correctness is provided by third party
            governmental organizations and research institutions.
          </p>
          <ul>
            <li>Geographic extent: the circumpolar North</li>
            <li>Decimal degree precision to 4 places (≈11m accuracy)</li>
            <li>Pre-computed shortest distance between point and ocean</li>
            <li>Multiple name variants where available</li>
            <li>Unique alphanumeric ID for each point</li>
          </ul>

          <div class="is-size-6 mt-3">
            <table class="table is-bordered mb-0">
              <caption>
                Alaska point location CSV file preview with Indigenous names
                verified by the
                <a href="https://www.uaf.edu/anlc/"
                  >Alaska Native Language Center</a
                >
              </caption>
              <thead>
                <tr>
                  <th>id</th>
                  <th>name</th>
                  <th>alt_name</th>
                  <th>latitude</th>
                  <th>longitude</th>
                  <th>km to ocean</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>AK1</td>
                  <td>Afognak</td>
                  <td>Agw'aneq</td>
                  <td>58.0078</td>
                  <td>-152.768</td>
                  <td>1</td>
                </tr>
                <tr>
                  <td>AK2</td>
                  <td>Akhiok</td>
                  <td>Kasukuak</td>
                  <td>56.9455</td>
                  <td>-154.170</td>
                  <td>0.8</td>
                </tr>
                <tr>
                  <td>AK3</td>
                  <td>Akiachak</td>
                  <td>Akiacuar</td>
                  <td>60.9094</td>
                  <td>-161.431</td>
                  <td>33.5</td>
                </tr>
                <tr>
                  <td>AK4</td>
                  <td>Akiak</td>
                  <td>Akiaq</td>
                  <td>60.9122</td>
                  <td>-161.214</td>
                  <td>43</td>
                </tr>
                <tr>
                  <td>AK5</td>
                  <td>Akutan</td>
                  <td>Achan-ingiiga</td>
                  <td>54.1385</td>
                  <td>-165.778</td>
                  <td>1.4</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="column pl-6">
        <div class="content is-size-5">
          <h3 class="title is-4">Polygon Boundaries</h3>

          <p>
            Choose from over <strong>17,000 polygon features</strong> that
            enable zonal statistics&mdash;cookie cutters, for data.
          </p>
          <RandomPolygonMap />
          <p>Examples of types of places included:</p>
          <ul>
            <li>Izembek National Wildlife Refuge</li>
            <li>Yukon Game Management Subzone 3-14</li>
            <li>Pikmiktalik River (HUC 1903050230)</li>
            <li>Matanuska-Susitna Borough</li>
            <li>Vuntut Gwitchin First Nation Traditional Territory</li>
          </ul>
          <p>
            &#x2192; see an example:
            <NuxtLink to="/item/notebook-precip-poly"
              >Fetch a polygon from the SNAP Data API, subset historical
              baseline daily precipitation data using the polygon, compute
              statistics, and compare results with USGS streamgage
              data.</NuxtLink
            >
          </p>

          <h4 class="title is-5 mt-6 mb-2">Polygon Boundary Features</h4>
          <p>
            <a href="https://earthmaps.io/places/"
              >Polygons are sourced from governmental agencies, research
              institutions, and international organizations.</a
            >
            Data are lightly curated to ensure usefulness for web applications
            and statistical analysis.
          </p>
          <ul>
            <li>Optimized geometries for web performance and analysis</li>
            <li>Minimum area threshold: 10 km²</li>
            <li>Topological integrity: geometries are valid</li>
            <li>Consistency across political boundaries</li>
            <li>Data do not constitute legal or official boundaries</li>
          </ul>

          <div class="is-size-6">
            <table class="table is-bordered">
              <caption>
                Some example polygon features of different types: a view similar
                to a GIS attribute table.
              </caption>
              <thead>
                <tr>
                  <th>name</th>
                  <th>type</th>
                  <th>geometry</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Central Interior</td>
                  <td>climate_division</td>
                  <td>POLYGON ((-152.9662...))</td>
                </tr>
                <tr>
                  <td>Sealaska Corporation</td>
                  <td>corporation</td>
                  <td>POLYGON ((-153.3263...))</td>
                </tr>
                <tr>
                  <td>Copper Plateau</td>
                  <td>ecoregion</td>
                  <td>POLYGON ((-143.5992...))</td>
                </tr>
                <tr>
                  <td>Upper Tanana</td>
                  <td>ethnolinguistic_region</td>
                  <td>POLYGON ((-140.9682...))</td>
                </tr>
                <tr>
                  <td>Tok Area</td>
                  <td>fire_zone</td>
                  <td>POLYGON ((-143.4561...))</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="section mb-6">
    <div class="clamp">
      <GetAndUseData
        presentInNcr
        apiUrl="https://earthmaps.io/places/"
        gitHubRepo="https://github.com/ua-snap/geospatial-vector-veracity"
      >
        <li>
          Download point location CSV files for:
          <div class="columns is-multiline mt-1">
            <div
              class="column is-one-third py-0"
              v-for="(col, index) in 3"
              :key="index"
            >
              <ul class="has-list-style-none mb-0">
                <li
                  v-for="region in regionsList.slice(
                    index * 6,
                    (index + 1) * 6
                  )"
                  :key="region.key"
                >
                  <span class="mr-2">{{
                    getFlagEmoji(region.countryCode)
                  }}</span>
                  <a
                    :href="`https://github.com/ua-snap/geospatial-vector-veracity/raw/main/vector_data/point/${region.key}_point_locations.csv`"
                  >
                    {{ region.name }}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </li>
      </GetAndUseData>
    </div>
  </section>
</template>

<style lang="scss" scoped>
table caption {
  caption-side: bottom;
  text-align: left;
  font-size: 90%;
}

.has-list-style-none {
  list-style: none;
}

.blurbs .columns .column:first-of-type {
  border-right: 1px dashed $grey-lighter;
}

@media (max-width: 1023px) {
  .blurbs .columns .column:nth-of-type(2) {
    margin-left: -2rem;
  }
}

span.emoji-bullet {
  font-size: 120%;
  display: inline-block;
  margin-right: 1rem;
}
</style>
