<script lang="ts" setup></script>

<template>
  <NotebookTemplate
    notebookUrl="https://notebooks.earthmaps.io"
    githubUrl="https://github.com/ua-snap/ardac-toolbox/blob/main/notebooks/daymet_access.ipynb"
  >
    <h2 class="title is-2">
      Querying Daymet daily precipitation data using polygons from the SNAP Data
      API
    </h2>

    <div class="content is-size-5">
      <p>
        This notebook combines precipitation and USGS stream gauge data to
        produce a visualization that could be used by hydrologists, biologists,
        and scientific programmers.
      </p>

      <p>
        The Python code referenced here explores a method for fetching a polygon
        of interest from the SNAP Data API and then using this polygon&rsquo;s
        bounding box to subset Daymet daily precipitation data. We also
        demonstrate using the <code>regionmask</code> package to futher clip the
        Daymet dataset using the 2-dimensional polygon geometry, and compute
        rolling daily statistics over the time dimension. Finally, we fetch USGS
        stream gauge data for the Chena River and plot it alongside the
        precipitation statistics.
      </p>
      <p>
        The technique shown can be used as an example of accessing data from
        multiple sources, preparing and combining data and performing
        statistical analysis to create visualizations.
      </p>

      <!-- here -->
      <p>Datasets used in this notebook include:</p>
      <ul>
        <li>
          Hydrological unit
          <a href="https://earthmaps.io/boundary/"
            >polygons from our data API</a
          >
        </li>
        <li>
          <a href="https://www.earthdata.nasa.gov/technology/daymet"
            >Daymet data</a
          >, which provides long-term, continuous, gridded estimates of daily
          weather and climatology variables. Provided by
          <a href="https://daac.ornl.gov/about/"
            >Oak Ridge National Laboratory Distributed Active Archive Center</a
          >
          (ORNL DAAC)
        </li>
        <li>
          Stream gauge data, accessed from the
          <a
            href="https://waterdata.usgs.gov/nwis/inventory/?site_no=15514000&amp;agency_cd=USGS"
            >USGS water services API</a
          >
        </li>
      </ul>
      <p>Example output from this notebook:</p>
      <img src="/public/precip-poly.png" />
    </div>
    <h4 class="title is-4">Use &amp; access this code</h4>
    <div class="content is-size-5">
      <ul>
        <li>
          <a
            href="https://github.com/ua-snap/ardac-toolbox/blob/main/notebooks/daymet_access.ipynb"
            >Access source code on Github</a
          >
        </li>
      </ul>
    </div>
  </NotebookTemplate>
</template>

<style lang="scss" scoped></style>
