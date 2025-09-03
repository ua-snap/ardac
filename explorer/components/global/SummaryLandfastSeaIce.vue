<script lang="ts" setup>
const mapStore = useMapStore()

const layers: MapLayer[] = [
  {
    id: 'slie_early_era',
    title: 'January, 1996–2005',
    source: 'rasdaman',
    wmsLayerName: 'ardac_beaufort_landfast_sea_ice_mmm',
    style: 'ardac_landfast_ice_MMM',
    legend: 'slie',
    rasdamanConfiguration: { dim_month: 0, dim_era: 0 },
    bbox: [-170, 71, -131, 76],
  },
  {
    id: 'slie_mid_era',
    title: 'January, 2005–2014',
    source: 'rasdaman',
    wmsLayerName: 'ardac_beaufort_landfast_sea_ice_mmm',
    style: 'ardac_landfast_ice_MMM',
    legend: 'slie',
    rasdamanConfiguration: { dim_month: 0, dim_era: 1 },
    bbox: [-170, 71, -131, 76],
  },
  {
    id: 'slie_late_era',
    title: 'January, 2014–2023',
    source: 'rasdaman',
    wmsLayerName: 'ardac_beaufort_landfast_sea_ice_mmm',
    style: 'ardac_landfast_ice_MMM',
    legend: 'slie',
    rasdamanConfiguration: { dim_month: 0, dim_era: 2 },
    bbox: [-170, 71, -131, 76],
  },
]

const legend: Record<string, LegendItem[]> = {
  slie: [
    { color: '#2b8cbe', label: 'Minimum extent' },
    { color: '#a6bddb', label: 'Median extent' },
    { color: '#000000', label: 'Mean extent' },
    { color: '#ece7f2', label: 'Maximum extent' },
  ],
}

const mapId = 'slie'
mapStore.setLegendItems(mapId, legend)
</script>

<template>
  <section class="section">
    <div class="clamp">
      <h2 class="title is-2">Landfast Sea Ice</h2>
      <figure class="image">
        <img src="/previews/ARC18_Landfast_Fig2.jpg" />
        <figcaption>
          Two community members returning by snowmobile from a flaw lead at the
          seaward edge of the landfast ice near Utqiaġvik, Alaska.
        </figcaption>
      </figure>
      <div class="content is-size-5 mt-5">
        <p>
          <strong>
            Landfast ice is sea ice that is effectively stationary and attached
            to land.
          </strong>
          Landfast sea ice is an integral component of Arctic coastal systems
          and controls numerous geological and biological processes as well as
          human activities (e.g., Mahoney, 2018). In the dataset presented here
          landfast sea ice is defined as being contiguous to the coast and
          lacking detectable motion for approximately 20 consecutive days (<a
            href="https://citeseerx.ist.psu.edu/document?repid=rep1&type=pdf&doi=a5467a7bbec6a6e31e9898f89041fbb5378a26c2"
            >Mahoney et al. 2005</a
          >). In this case, the limit of detectable motion is estimated to be
          approximately 200 m.
        </p>
      </div>
    </div>

    <div class="my-6">
      <MapBlock :mapId="mapId" class="mb-6">
        <template v-slot:layers>
          <MapLayer :mapId="mapId" :layer="layers[0]" default>
            <template v-slot:title>{{ layers[0].title }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="layers[1]">
            <template v-slot:title>{{ layers[1].title }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="layers[2]">
            <template v-slot:title>{{ layers[2].title }}</template>
          </MapLayer>
        </template>
      </MapBlock>
    </div>

    <div class="clamp">
      <div class="content is-size-5">
        <h4 class="title is-4">Summarizing ice edge data</h4>
        <p>
          This data visualization summarizes the position of the seaward
          landfast ice edge (SLIE) for the Beaufort Sea region. Each month of
          the ice season (October through July) is summarized over three 9-year
          periods (1996-2005, 2005-2014, 2014-2023) using the minimum, maximum,
          median, and mean distance of SLIE from the coastline. The minimum
          extent is shown in the darkest shade of blue and indicates the region
          that was always occupied by landfast ice during a particular calendar
          month. The median extent is shown by the mid-shade of blue and
          indicates where landfast occurred at least 50% of the time. The
          lightest shade of blue indicates the maximum landfast ice, which
          represents regions that may only have been landfast ice on one
          occasion during the selected time period. The black line represents
          the mean SLIE position for the selected months and time period and,
          together with the median, provides an alternative way to visualize the
          typical extent of landfast ice.
        </p>

        <h4 class="title is-4">The consequences of a changing ice regime</h4>

        <p>
          <strong>
            Landfast sea ice is diminishing throughout the Arctic (Mahoney,
            2018) and this can be seen in both its extent and timing.
          </strong>
          The reduction in landfast ice extent over time can be visualized by
          comparing the data for a given calendar month over all three 9-year
          periods. In most locations, and for most months, the area of landfast
          decreases over the course of the record. However we note that there is
          comparatively little change in the median extent of landfast ice the
          Beaufort Sea during April. This represents the maximum stable extent
          of the landfast ice which, in most of the Beaufort Sea, is primarily
          controlled by bathymetry. In comparison, landfast sea ice in the
          Chukchi Sea in April shows more substantial declines, particularly in
          the most recent 9-year period. One illustration of the change in
          timing is the striking similarity between the landfast ice extent in
          October in the Chukchi Sea during the first 9-year period (1996-2005)
          with that for the month of November during the last 9-year period
          (2014-2023). These changes in the seasonality of landfast ice can have
          important impacts on other natural and human components of the Arctic
          coastal system. The shortened duration of the landfast ice season
          limits the useful period for ice road operations while shifts in
          seasonal landfast ice extent, duration, and timing can impact
          Indigenous peoples' subsistence activities, marine vessel navigation,
          natural resource development, coastal dynamics, and wildlife. Later
          formation of early season ice results in increased opportunities for
          coastal erosion from winter storms - seen in the data visualization
          here where the January minimum SLIE extent declines to zero (this is
          why the dark blue color is largely absent from the map) for much of
          the Beaufort region for the 2014-2023 ice era.
        </p>

        <h4 class="title is-4">Bringing diverse data together</h4>

        <p>
          The data explored here are a novel assemblage of several data sources
          including satellite imagery, ice chart products, and expert
          interpretations. Two synthetic aperture radar (SAR) platforms
          (RADARSAT-1 and EnviSAT) were leveraged to classify landfast sea ice
          between 1995 and 2008. RADARSAT-1 data were acquired using the
          moderate-resolution ScanSAR operation mode of the SAR sensor using the
          C-Band (5.3 GHz), 5.6 cm wavelength, HH polarized microwave frequency.
          Landfast ice has a distinct backscatter signature compared to
          surrounding pack ice, land, or open water which enables broad scale
          classification of landfast sea ice. Several agencies publish daily
          charts of sea ice chart concentrations for navigational purposes that
          can also be used to infer the presence or absence of landfast sea ice.
          Such charts are produced by fusing several different data sources
          under the guidance of sea ice experts. Chart data sources include the
          <a href="https://www.weather.gov/afc/ice"
            >Alaska Sea Ice Program (ASIP)</a
          >
          and the G10013 SIGRID-3 Arctic Ice Charts produced by the
          <a href="https://usicecenter.gov/">National Ice Center (NIC)</a>.
        </p>
      </div>
      <div class="references content">
        <h4 class="title is-4">References</h4>
        <blockquote>
          Mahoney, A., Eicken, H., Shapiro, L., & Graves, A. (2005). Defining
          and locating the seaward landfast ice edge in northern Alaska. In 18th
          International Conference on Port and Ocean Engineering under Arctic
          Conditions (POAC’05), Potsdam, NY (pp. 991-1001).
        </blockquote>
        <blockquote>
          Eicken, H., L. Shapiro, A. G. Gaylord, A. Mahoney, and P. Cotter.
          2006. Mapping and Characterization of Recurring Spring Leads and
          Landfast Ice in the Beaufort and Chukchi Seas. Final Report, Minerals
          Management Service OCS Study MMS 2005-068.
        </blockquote>
        <blockquote>
          Mahoney, A., Eicken, H., Gaylord, A. G., and Shapiro, L. (2007),
          Alaska landfast sea ice: Links with bathymetry and atmospheric
          circulation, J. Geophys. Res., 112, C02001, doi:10.1029/2006JC003559.
        </blockquote>
        <blockquote>
          Eicken, H., L. Shapiro, A. G. Gaylord, A. Mahoney, and P. W. Cotter.
          2009. Recurring Spring Leads and Landfast Ice in the Beaufort and
          Chukchi Seas, 1993-2004, Version 1. Boulder, Colorado USA. NSIDC:
          National Snow and Ice Data Center. doi:
          <a href="https://doi.org/10.7265/N5SB43P0"
            >https://doi.org/10.7265/N5SB43P0</a
          >.
        </blockquote>
        <blockquote>
          Mahoney, A. R., Eicken, H., Gaylord, A. G., & Gens, R. (2014).
          Landfast sea ice extent in the Chukchi and Beaufort Seas: The annual
          cycle and decadal variability.
          <em>Cold Regions Science and Technology</em>, 103, 41-56.
        </blockquote>
        <blockquote>
          Mahoney, A. R. (2018),
          <a
            href="https://arctic.noaa.gov/Report-Card/Report-Card-2018/ArtMID/7878/ArticleID/788/Landfast-Sea-Ice-in-a-Changing-Arctic"
            >Landfast Sea Ice in a Changing Arctic</a
          >, in <em>Arctic Report Card 2018</em>, edited by E. Osborne, J. A.
          Richter-Menge and M. O. Jeffries.
          <a
            href="https://arctic.noaa.gov/Report-Card/Report-Card-2018/ArtMID/7878/ArticleID/788/Landfast-Sea-Ice-in-a-Changing-Arctic"
            >https://arctic.noaa.gov/Report-Card/Report-Card-2018/ArtMID/7878/ArticleID/788/Landfast-Sea-Ice-in-a-Changing-Arctic</a
          >
        </blockquote>
      </div>
    </div>
    <Bios :people="['Hajo Eicken', 'Andy Mahoney']" />
  </section>
</template>

<style lang="scss" scoped>
:deep(.map) {
  aspect-ratio: 2/1;
}
</style>
