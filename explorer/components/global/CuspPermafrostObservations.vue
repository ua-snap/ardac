<script lang="ts" setup>
import cuspSources from '~/assets/cuspSources'
const mapStore = useMapStore()
const placesStore = usePlacesStore()
const dataStore = useDataStore()

const latLng = computed(() => placesStore.latLng)

watch(latLng, () => {
  dataStore.fetchCuspObservations()
})

onUnmounted(() => {
  dataStore.clearCuspObservations()
})

const cuspObservations = computed(() => dataStore.cuspObservations)
const cuspObservationsError = computed(() => dataStore.cuspObservationsError)

const observations = computed(() => cuspObservations.value?.features ?? [])
const nearbyObservationCount = computed(
  () => cuspObservations.value?.numberMatched ?? 0
)
const sourceSummary = computed(() => {
  const counts = new Map<string | null, number>()

  observations.value.forEach(observation => {
    const source = observation.properties.source
    counts.set(source, (counts.get(source) ?? 0) + 1)
  })

  return Array.from(counts, ([source, count]) => ({ source, count })).sort(
    (a, b) => b.count - a.count
  )
})

const displayedSourceSummary = computed(() => sourceSummary.value.slice(0, 5))
function displayObservationValue(value: string | number | null) {
  if (value === null || value === '') {
    return 'Not reported'
  }

  return value
}
function getSourceCitation(source: string | null) {
  if (!source) return undefined

  return cuspSources[source]
}

function formatSourceCitation(source: string | null) {
  const citation = getSourceCitation(source)

  if (!citation) return undefined

  const publisher =
    citation.publisher ??
    citation.institution ??
    citation.journal ??
    citation.howpublished

  return [
    citation.author,
    citation.year && `(${citation.year})`,
    citation.title,
    publisher,
  ]
    .filter(Boolean)
    .join('. ')
}
const layers: MapLayer[] = [
  {
    id: 'cusp_pf_observed',
    title: 'Permafrost Observed?',
    wmsLayerName: 'cusp_observations',
    style: ' cusp_permafrost_observed',
    legend: 'cusp_pf_binary',
  },
  {
    id: 'cusp_method',
    title: 'Observation Method',
    wmsLayerName: 'cusp_observations',
    style: ' cusp_observation_method',
    legend: 'cusp_observation',
  },
]
const legend: Record<string, LegendItem[]> = {
  cusp_pf_binary: [
    { color: '#f1a340', label: 'No Permafrost Observed' },
    { color: '#998ec3', label: 'Permafrost Observed' },
  ],
  cusp_observation: [
    { color: '#1F78B4', label: 'Ground Probe' },
    { color: '#A6CEE3', label: 'Thaw Probe' },
    { color: '#33A02C', label: 'Soil Pit' },
    { color: '#B2DF8A', label: 'Auger' },
    { color: '#6A3D9A', label: 'Pit and Auger' },
    { color: '#CAB2D6', label: 'Thaw Probe and Pit' },
    { color: '#E31A1C', label: 'Temperature Profile / Interpretation' },
    { color: '#FB9A99', label: 'Thaw Tube' },
    { color: '#FF7F00', label: 'InSAR / Remote-Sensing-Derived' },
    { color: '#999999', label: 'Unknown Method' },
  ],
}

const mapId = 'cusp_pf_binary'
mapStore.setLegendItems(mapId, legend)
</script>

<template>
  <section class="section">
    <div class="content is-size-5">
      <h3 class="title is-3">
        The CommUnity near-Surface Permafrost (CUSP) Dataset
      </h3>
      <CollabIntroblurb
        collaborator="Los Alamos National Lab"
        vector_geom_type="point"
        feature_count_floor="230,000"
      />
      <p class="mb-6">
        CUSP is a data synthesis for near-surface permafrost, active-layer,
        thaw-depth, and related field observations. CUSP brings many published
        and field datasets into one documented table with source citations and
        tools that make the data corpus easier to use, build, and extend.
      </p>
      <MapBlock :mapId="mapId" class="mb-6">
        <template v-slot:layers>
          <MapLayer :mapId="mapId" :layer="layers[0]" default>
            <template v-slot:title>{{ layers[0].title }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="layers[1]" default>
            <template v-slot:title>{{ layers[1].title }}</template>
          </MapLayer>
        </template>
      </MapBlock>
      <h4 class="title is-4">Find observations near a place</h4>
      <p class="mb-6">
        Choose a community or enter coordinates to view CUSP observations near
        that location. The nearby search area is a 0.5° by 0.5° box centered on
        the selected point.
      </p>
      <Gimme
        :bbox="[-171.63023, 9.16667, 177.2, 83.09]"
        :show-load-indicator="false"
      />
      <p v-if="cuspObservationsError">
        {{ cuspObservationsError }}
      </p>
      <template v-else-if="cuspObservations">
        <p v-if="nearbyObservationCount === 0">
          No CUSP observations were found near this location.
        </p>
        <template v-else>
          <p>
            {{ nearbyObservationCount }} CUSP observations were found near this
            location.
            <span v-if="nearbyObservationCount > observations.length">
              Showing the first {{ observations.length }} records.
            </span>
          </p>
          <h5>Sources in displayed records</h5>
          <ul>
            <li
              v-for="sourceSummaryEntry in displayedSourceSummary"
              :key="sourceSummaryEntry.source ?? 'not-reported'"
            >
              <strong v-if="sourceSummaryEntry.source">
                CUSP source: <code>{{ sourceSummaryEntry.source }}</code>
              </strong>
              <strong v-else>CUSP source not reported</strong>
              — {{ sourceSummaryEntry.count }} records
              <br />
              <small v-if="formatSourceCitation(sourceSummaryEntry.source)">
                {{ formatSourceCitation(sourceSummaryEntry.source) }}
              </small>
            </li>
          </ul>
          <p v-if="sourceSummary.length > displayedSourceSummary.length">
            Additional source datasets are represented in the table below.
          </p>
          <table>
            <caption>
              CUSP observations near the selected location; source citations
              appear above.
            </caption>
            <thead>
              <tr>
                <th scope="col">Source / site</th>
                <th scope="col">Date</th>
                <th scope="col">Method</th>
                <th scope="col">Permafrost observation</th>
                <th scope="col">Depth information</th>
                <th scope="col">Quality flags</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="observation in observations"
                :key="observation.properties.cusp_obs_id ?? observation.id"
              >
                <td>
                  <code>
                    {{ displayObservationValue(observation.properties.source) }}
                  </code>
                  <br />
                  <small>
                    Site:
                    {{
                      displayObservationValue(observation.properties.site_id)
                    }}
                  </small>
                </td>
                <td>
                  {{
                    displayObservationValue(
                      observation.properties.observation_date
                    )
                  }}
                </td>
                <td>
                  {{
                    displayObservationValue(observation.properties.method_label)
                  }}
                </td>
                <td>
                  {{
                    displayObservationValue(
                      observation.properties.pf_observed_label
                    )
                  }}
                </td>
                <td>
                  Thaw:
                  {{
                    displayObservationValue(
                      observation.properties.thaw_depth_cm
                    )
                  }}
                  <br />
                  Permafrost:
                  {{
                    displayObservationValue(observation.properties.pf_depth_cm)
                  }}
                  <br />
                  Limit:
                  {{
                    displayObservationValue(observation.properties.obs_limit_cm)
                  }}
                </td>
                <td>
                  {{
                    displayObservationValue(
                      observation.properties.quality_flags
                    )
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </template>
      </template>
      <h4 class="title is-4">Contribute to CUSP</h4>
      <p>
        CUSP grows through community contributions. If you have near-surface
        permafrost observations, including unpublished data, or know of a public
        dataset that is not included, please
        <a href="https://jonschwenk.github.io/cusp/contributing/">
          suggest a dataset or learn how to contribute to CUSP </a
        >.
      </p>
      <h4 class="title is-4">CUSP Usage Caveats</h4>
      <p class="mb-6">
        CUSP brings many source datasets into one shared format. That makes the
        data easier to use, but it also means that some source-specific choices
        have already been made before the records appear in the release table.
        Users should treat CUSP as a carefully documented synthesis, not as a
        replacement for reading the source datasets and publications behind the
        records they use.
      </p>
      <h5 class="title is-5">Source Differences</h5>
      <p class="mb-6">
        CUSP sources were collected for different projects, at different times,
        with different measurement methods. A shared data schema cannot remove
        those differences. Important variation may remain in: field method (thaw
        probing, augering, pits, thaw tubes, temperature profiles, geophysics,
        or remote-sensing-assisted interpretation), observation season and
        timing within the thaw season, whether a record reports direct
        permafrost presence, thaw depth, active-layer thickness, depth to
        permafrost, or an observation limit, spatial sampling design (from dense
        local grids to widely separated field sites). The method and source
        information are meant to help users keep those differences visible
        during analysis. CUSP includes quality flags: compact caveat codes which
        can be used to exclude data with specific such as geophysics-inferred
        observations.
      </p>
      <h5 class="title is-5">Interpretation During Processing</h5>
      <p class="mb-6">
        Each distinct data source has its own processing script that converts
        source data files into the common CUSP schema and this may require
        interpretation choices. These choices are part of the data synthesis.
        Common examples include: converting depths to centimeters, converting
        source-specific permafrost or frost-table labels into a value for
        <code>pf_observed</code>, mapping source methods into the CUSP method
        vocabulary, deriving permafrost depth, thaw depth, or the observation
        limit from source fields, assigning campaign-level or year-level dates
        when the source does not provide exact observation dates, and filtering
        rows that are duplicate, invalid, outside the source scope, or not
        usable as near-surface permafrost observations.
      </p>
      <h5 class="title is-5">Presence, Absence, And Observation Limits</h5>
      <p class="mb-6">
        Permafrost observed (<code>pf_observed = 1</code>) means permafrost was
        observed in the source data. A value of
        <code>pf_observed = 0</code> means permafrost was not observed within
        the reported observation context. However, that
        <strong
          >does not always mean that permafrost is absent at all depths</strong
        >, nearby locations, or later dates. The <code>obs_limit</code> column
        is especially important for absence-like observations because it records
        the depth limit of the observation when available. A shallow observation
        with no permafrost encountered should be interpreted differently from a
        deeper observation with the same <code>pf_observed</code> value.
      </p>
      <h5 class="title is-5">Dates And Seasonality</h5>
      <p class="mb-6">
        Near-surface permafrost observations are seasonally sensitive. Thaw
        depth and active-layer thickness can change substantially within a
        single summer. CUSP preserves dates where possible, but some sources
        only support approximate dates, campaign dates, or year-level timing.
        Users should be careful when combining records from different parts of
        the thaw season.
      </p>
      <h5 class="title is-5">Location And Scale</h5>
      <p class="mb-6">
        CUSP uses point coordinates when possible, but coordinate precision
        varies by source. Some records may represent a plot, transect, grid
        cell, field site, or sampling area rather than a precisely surveyed
        point. This matters when joining CUSP to environmental rasters,
        especially coarse climate, soil, or surface water layers. Dense
        Sampling: Some CUSP sources contain many observations in a very small
        area. Those records are valuable, but they can overweight a local field
        site in analyses that assume independent or evenly distributed
        observations. The aggregation guide describes one way to create spatial
        and temporal summaries when that is more appropriate for your use case.
      </p>
      <h5 class="title is-5">Attribution: Permafrost observations</h5>
      <p class="mb-6">
        Permafrost observations are costly in time and money. If you use CUSP,
        please cite CUSP and the original datasets or publications behind the
        records you used.
      </p>
    </div>
  </section>
</template>
