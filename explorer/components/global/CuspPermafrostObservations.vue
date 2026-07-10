<script lang="ts" setup>
const mapStore = useMapStore()

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
