<script lang="ts" setup>
import {
  COLD_SNAP_CHART_IDS,
  COLD_SNAP_COMMUNITIES,
  COLD_SNAP_END_DATE,
  COLD_SNAP_START_DATE,
  type ColdSnapCommunity,
} from '~/utils/coldSnap1989Communities'
import {
  filterEra5WrfSeriesForWindowFahrenheit,
  type Era5WrfPointData,
} from '~/utils/coldSnap1989Transforms'
import type { Era5WrfSeriesPoint } from '~/utils/era5WrfTransforms'

const dataStore = useDataStore()
const mapStore = useMapStore()
const runtimeConfig = useRuntimeConfig()
const { $Plotly } = useNuxtApp()

const mapId = 'cold-snap-1989-maps'

const coldSnapLayers: MapLayer[] = [
  {
    id: 'cold_snap_jan27',
    title: 'Daily Min 2m Temperature: January 27, 1989',
    source: 'rasdaman',
    wmsLayerName: 'era5_4km_daily_t2_min',
    style: 'ardac_t2_min_daily',
    legend: 'era5_cold',
    rasdamanConfiguration: { time: '1989-01-27T00:00:00.000Z' },
  },
  {
    id: 'cold_snap_jan28',
    title: 'Daily Min 2m Temperature: January 28, 1989',
    source: 'rasdaman',
    wmsLayerName: 'era5_4km_daily_t2_min',
    style: 'ardac_t2_min_daily',
    legend: 'era5_cold',
    rasdamanConfiguration: { time: '1989-01-28T00:00:00.000Z' },
  },
]

const legend: Record<string, LegendItem[]> = {
  era5_cold: [
    { color: '#3b4cc0', label: '&lt;-40°C' },
    { color: '#9bb2e8', label: '-40°C to -20°C' },
    { color: '#f7f7f7', label: '-20°C to 0°C' },
    { color: '#fcbba1', label: '0°C to 15°C' },
    { color: '#d6604d', label: '&ge;15°C' },
  ],
}

mapStore.setLegendItems(mapId, legend)

interface CommunitySeries {
  t2Min: Era5WrfSeriesPoint[]
  t2Max: Era5WrfSeriesPoint[]
}

const communitySeries = ref<Record<string, CommunitySeries>>({})
const communityErrors = ref<Record<string, boolean>>({})
const isLoading = ref(true)

const getCommunity = (id: string): ColdSnapCommunity | undefined =>
  COLD_SNAP_COMMUNITIES.find(community => community.id === id)

const getSeries = (id: string): CommunitySeries | undefined =>
  communitySeries.value[id]

const purgeAllCharts = () => {
  COLD_SNAP_CHART_IDS.forEach(chartId => {
    try {
      const element = document.getElementById(chartId)
      if (element && element.hasChildNodes()) {
        $Plotly.purge(chartId)
      }
    } catch (error) {
      console.debug(`Chart purge skipped for ${chartId}:`, error)
    }
  })
}

const loadCommunityData = async () => {
  isLoading.value = true
  communitySeries.value = {}
  communityErrors.value = {}

  await Promise.all(
    COLD_SNAP_COMMUNITIES.map(async community => {
      const apiData = (await dataStore.fetchEra5WrfPoint(
        community.latitude,
        community.longitude
      )) as Era5WrfPointData | null

      if (!apiData) {
        communityErrors.value[community.id] = true
        return
      }

      const series = filterEra5WrfSeriesForWindowFahrenheit(
        apiData,
        COLD_SNAP_START_DATE,
        COLD_SNAP_END_DATE,
        ['t2_min', 't2_max']
      )

      communitySeries.value[community.id] = {
        t2Min: series.t2_min,
        t2Max: series.t2_max,
      }
    })
  )

  isLoading.value = false
}

onMounted(loadCommunityData)

onUnmounted(() => {
  purgeAllCharts()
})
</script>

<template>
  <section class="section">
    <div class="content clamp is-size-5">
      <h3 class="title is-3">1989 Alaska Cold Snap</h3>

      <figure class="image">
        <img
          src="assets/images/ColdSnap1989/hero-ice-fog-uaf.png"
          alt="Ice fog as seen from UAF Campus"
        />
      </figure>
      <p>Ice fog as seen from UAF Campus, Photo credit: UAF</p>

      <h4 class="title is-4">Data Story Intro</h4>

      <p>
        In this data story we use the historic 1989 Cold Snap as a lens for
        understanding how extreme weather events impact Alaska, and to
        understand how downscaled climate reanalysis data can be used to ask new
        questions about extreme weather…
      </p>
      <p>
        This data story integrates work from the ACCAP
        <a href="https://uaf-accap.org/projects/extreme-events-library/"
          >Historic Extreme Events Library</a
        >, SNAP, Dynamical Downscalers, etc…. Big awesome collab yay IARC
      </p>

      <p>
        The end of January 1989 brought sustained, exceptionally low
        temperatures to Alaska, testing even the most prepared Alaskans. Many
        water and sewer systems failed as heating oil jelled. Batteries froze
        and cars wouldn&rsquo;t start. The cold caused plane engines and
        propellers to malfunction. The high pressure of the weather pattern
        interfered with altimeters, grounding planes and preventing deliveries
        to rural Alaska. Mechanics, woodcutters and thawing businesses
        experienced increased demand. Temperature records were broken throughout
        the state, with Interior Alaska temperatures frequently dipping between
        -50&deg;F and -60&deg;F and wind chills reaching as low as -100&deg;F.
        Tanana recorded the lowest temperature, -76&deg;F, but unofficial
        temperatures dipped to the -80s&deg;F.
      </p>

      <h4 class="title is-4">Weather woes</h4>

      <p>
        The 1989 Cold Snap began in mid-January when high pressure air extended
        from Russia into Interior Alaska before being amplified by record
        breaking cold air that moved south from the high Arctic toward the North
        Slope and eventually to Southcentral Alaska. A dramatic change in the
        weather pattern at the end of January resulted in record breaking high
        pressure that kept the cold air anchored over Southeast Alaska into
        early February.
      </p>

      <h4 class="title is-4">Disaster declared</h4>

      <ul>
        <li>
          January 28th: Governor Cowper declared a State of Alaska disaster
          emergency
        </li>
        <li>
          February 27th, March 2nd, April 20th: Governor Cowper declared
          <a
            href="https://www.akleg.gov/pdf/billfiles/Committee%20Bill%20Files/Standing%20Committees/Committee%20Fiche-06264.pdf"
            >disaster for Sand Point, Ahkiok, and Galena</a
          >
          to repair water, sewer, and electrical power generating systems
        </li>
        <li>
          May 10th: A
          <a href="https://www.fema.gov/disaster/826"
            >federal disaster declared to aid in repair of electric and
            sanitation systems across Alaska, especially in the Northwest Arctic
            Borough</a
          >
        </li>
      </ul>

      <h4 class="title is-4">Record breaking cold</h4>

      <p>
        The 1989 Cold Snap rivals other cold spells in the 20th century,and
        remains the most severe on record for much of western Alaska. For
        central and eastern Alaska, cold snaps in 1947, 1961, 1971, and 1975
        were similar in duration with even lower temperatures. Across Southeast
        Alaska, cold snaps during several winters in the 1940s and in 1968,
        1971, and 1975 brought colder weather for longer. The temperatures
        listed in blue on the map below represent record setting temperatures
        that occurred during the 1989 Cold Snap: they are the lowest
        temperatures ever recorded at these locations as of 2023.
      </p>

      <figure class="image">
        <img
          src="assets/images/ColdSnap1989/record-cold-map.png"
          alt="Map of temperatures in Alaskan communities during 1989 cold snap with record cold labels in blue: Nome, Unalakleet, Galena, Tanana, Manley Hot Springs, McGrath, Palmer, Dillingham, King Salmon, Kodiak"
        />
      </figure>
      <p>
        Record breaking low temperatures around Alaska (blue) during the 1989
        Cold Snap. Created by Rick Thoman (ACCAP). Data Source: NOAA NCEI,
        Environment &amp; Climate Change Canada
      </p>

      <h4 class="title is-4">Community specific impacts and extremes</h4>

      <div v-if="isLoading" class="notification is-info is-light">
        Loading ERA5-WRF temperature data for Alaska communities…
      </div>

      <h4 class="title is-4">Community Impacts</h4>

      <p>
        <strong>Nome</strong>: Pipes froze at the elementary school and St
        Joseph Catholic Church. Nome Joint Utilities diluted #2 diesel fuel with
        #1 fuel gallon for better flow in the extreme cold.
      </p>
      <Era5WrfColdSnapCommunityChart
        v-if="getSeries('nome')"
        :community-name="getCommunity('nome')!.name"
        :t2-min="getSeries('nome')!.t2Min"
        :t2-max="getSeries('nome')!.t2Max"
        :lat="getCommunity('nome')!.latitude"
        :lng="getCommunity('nome')!.longitude"
        :annotations="getCommunity('nome')!.annotations"
        chart-id="cold-snap-nome"
        class="mb-5"
      />

      <p>
        <strong>Buckland</strong>: Lost electricity at
        <strong>-50&deg;F</strong>, the power plant broke down, the telephone
        system stopped working, airplanes ceased flying and fuel ran low for
        some residents.
      </p>
      <Era5WrfColdSnapCommunityChart
        v-if="getSeries('buckland')"
        :community-name="getCommunity('buckland')!.name"
        :t2-min="getSeries('buckland')!.t2Min"
        :t2-max="getSeries('buckland')!.t2Max"
        :lat="getCommunity('buckland')!.latitude"
        :lng="getCommunity('buckland')!.longitude"
        :annotations="getCommunity('buckland')!.annotations"
        chart-id="cold-snap-buckland"
        class="mb-5"
      />

      <p>
        <strong>Fairbanks</strong>: Extreme cold and ice fog caused low
        visibility (less than 1/8 mile), the school system closed on January
        30th and 31st for the first time since the 1970s because it was unsafe
        for buses to operate.
      </p>
      <Era5WrfColdSnapCommunityChart
        v-if="getSeries('fairbanks')"
        :community-name="getCommunity('fairbanks')!.name"
        :t2-min="getSeries('fairbanks')!.t2Min"
        :t2-max="getSeries('fairbanks')!.t2Max"
        :lat="getCommunity('fairbanks')!.latitude"
        :lng="getCommunity('fairbanks')!.longitude"
        chart-id="cold-snap-fairbanks"
        class="mb-5"
      />

      <p>
        <strong>Ft. Wainright</strong>: Brim Frost &rsquo;89, a military
        training exercise, was held during the snap and a C-130 plane crashed.
        Eight participating Canadian military personnel died.
      </p>
      <Era5WrfColdSnapCommunityChart
        v-if="getSeries('ft-wainright')"
        :community-name="getCommunity('ft-wainright')!.name"
        :t2-min="getSeries('ft-wainright')!.t2Min"
        :t2-max="getSeries('ft-wainright')!.t2Max"
        :lat="getCommunity('ft-wainright')!.latitude"
        :lng="getCommunity('ft-wainright')!.longitude"
        chart-id="cold-snap-ft-wainright"
        class="mb-5"
      />

      <p>
        <strong>Northway</strong>: A barometric pressure of 31.85 inches was
        recorded, marking a record in the United States and the third highest
        barometric pressure reading in the world at the time.
      </p>
      <Era5WrfColdSnapCommunityChart
        v-if="getSeries('northway')"
        :community-name="getCommunity('northway')!.name"
        :t2-min="getSeries('northway')!.t2Min"
        :t2-max="getSeries('northway')!.t2Max"
        :lat="getCommunity('northway')!.latitude"
        :lng="getCommunity('northway')!.longitude"
        chart-id="cold-snap-northway"
        class="mb-5"
      />

      <p>
        <strong>Galena</strong>: Schools closed. Widespread freezing of water
        and sewer systems occurred, and people wrapped fuel lines to prevent
        freezing.
      </p>
      <Era5WrfColdSnapCommunityChart
        v-if="getSeries('galena')"
        :community-name="getCommunity('galena')!.name"
        :t2-min="getSeries('galena')!.t2Min"
        :t2-max="getSeries('galena')!.t2Max"
        :lat="getCommunity('galena')!.latitude"
        :lng="getCommunity('galena')!.longitude"
        :annotations="getCommunity('galena')!.annotations"
        chart-id="cold-snap-galena"
        class="mb-5"
      />

      <h4 class="title is-4">Community Extremes</h4>

      <p>
        <strong>Tanana</strong> reported the lowest official temperature of
        <strong>-76&deg;F</strong> on January 27th. There were
        <strong>17 straight days</strong> of daytime high temperatures in Tanana
        of <strong>-40&deg;F</strong> or lower.
      </p>
      <Era5WrfColdSnapCommunityChart
        v-if="getSeries('tanana')"
        :community-name="getCommunity('tanana')!.name"
        :t2-min="getSeries('tanana')!.t2Min"
        :t2-max="getSeries('tanana')!.t2Max"
        :lat="getCommunity('tanana')!.latitude"
        :lng="getCommunity('tanana')!.longitude"
        :annotations="getCommunity('tanana')!.annotations"
        chart-id="cold-snap-tanana"
        class="mb-5"
      />

      <p>
        <strong>Anchorage</strong> recorded the lowest daytime high temperature
        on record of <strong>-19 &deg;F</strong> on January 28th. Police
        reported car batteries dying and pipes freezing. Firefighters responded
        to furnace fires and fires started in attempts to thaw pipes. Numerous
        flights were delayed at the airport.
      </p>
      <Era5WrfColdSnapCommunityChart
        v-if="getSeries('anchorage')"
        :community-name="getCommunity('anchorage')!.name"
        :t2-min="getSeries('anchorage')!.t2Min"
        :t2-max="getSeries('anchorage')!.t2Max"
        :lat="getCommunity('anchorage')!.latitude"
        :lng="getCommunity('anchorage')!.longitude"
        :annotations="getCommunity('anchorage')!.annotations"
        chart-id="cold-snap-anchorage"
        class="mb-5"
      />

      <p>
        <strong>Valdez</strong> experienced high winds (93 mph) that closed the
        Port of Valdez on January 30th. A reduction of oil in the Trans-Alaska
        Pipeline System resulted in $3 million per day in lost oil taxes and
        revenues.
      </p>
      <Era5WrfColdSnapCommunityChart
        v-if="getSeries('valdez')"
        :community-name="getCommunity('valdez')!.name"
        :t2-min="getSeries('valdez')!.t2Min"
        :t2-max="getSeries('valdez')!.t2Max"
        :lat="getCommunity('valdez')!.latitude"
        :lng="getCommunity('valdez')!.longitude"
        chart-id="cold-snap-valdez"
        class="mb-5"
      />

      <p>
        <strong>Cantwell</strong> experienced wind chills of
        <strong>-85&deg;F</strong> on January 27th with sustained winds of 37
        mph.
      </p>
      <Era5WrfColdSnapCommunityChart
        v-if="getSeries('cantwell')"
        :community-name="getCommunity('cantwell')!.name"
        :t2-min="getSeries('cantwell')!.t2Min"
        :t2-max="getSeries('cantwell')!.t2Max"
        :lat="getCommunity('cantwell')!.latitude"
        :lng="getCommunity('cantwell')!.longitude"
        chart-id="cold-snap-cantwell"
        class="mb-5"
      />

      <p>
        <strong>Deadhorse</strong> experienced wind chills of
        <strong>-93&deg;F</strong> on January 28th with sustained winds of 23
        mph.
      </p>
      <Era5WrfColdSnapCommunityChart
        v-if="getSeries('deadhorse')"
        :community-name="getCommunity('deadhorse')!.name"
        :t2-min="getSeries('deadhorse')!.t2Min"
        :t2-max="getSeries('deadhorse')!.t2Max"
        :lat="getCommunity('deadhorse')!.latitude"
        :lng="getCommunity('deadhorse')!.longitude"
        chart-id="cold-snap-deadhorse"
        class="mb-5"
      />

      <p>
        <strong>Ambler</strong> recorded a daytime high temperature of
        <strong>-66&deg;F</strong> on January 26th.
      </p>
      <Era5WrfColdSnapCommunityChart
        v-if="getSeries('ambler')"
        :community-name="getCommunity('ambler')!.name"
        :t2-min="getSeries('ambler')!.t2Min"
        :t2-max="getSeries('ambler')!.t2Max"
        :lat="getCommunity('ambler')!.latitude"
        :lng="getCommunity('ambler')!.longitude"
        :annotations="getCommunity('ambler')!.annotations"
        chart-id="cold-snap-ambler"
        class="mb-5"
      />

      <h4 class="title is-4">Downscaled Reanalysis vs. Observed</h4>

      <p>
        How well does the ERA5-WRF 4km product capture extreme temperature
        minima? You&rsquo;ll notice in these charts that there are differences
        between the observed temperatures and those found in the reanalysis.
        This result should be expected because of spatial resolution, etc.
      </p>

      <table class="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th>Community</th>
            <th>Metric</th>
            <th>Observed Temperature</th>
            <th>ERA5-WRF Temperature</th>
            <th>ERA5-WRF Temperature Date</th>
            <th>Difference</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Nome</td>
            <td>record low</td>
            <td>-54&deg;F</td>
            <td>-49.9&deg;F</td>
            <td>1989-01-27</td>
            <td>-4.1&deg;F</td>
          </tr>
          <tr>
            <td>Galena</td>
            <td>record low</td>
            <td>-70&deg;F</td>
            <td>-72.9&deg;F</td>
            <td>1989-01-27</td>
            <td>2.9&deg;F</td>
          </tr>
          <tr>
            <td>Unalakleet</td>
            <td>record low</td>
            <td>-59&deg;F</td>
            <td>-50.6&deg;F</td>
            <td>1989-01-27</td>
            <td>-8.4&deg;F</td>
          </tr>
          <tr>
            <td>Tanana</td>
            <td>record low</td>
            <td>-76&deg;F</td>
            <td>-64.8&deg;F</td>
            <td>1989-01-27</td>
            <td>-11.2&deg;F</td>
          </tr>
          <tr>
            <td>Manley Hot Springs</td>
            <td>record low</td>
            <td>-73&deg;F</td>
            <td>-59.6&deg;F</td>
            <td>1989-01-27</td>
            <td>-13.4&deg;F</td>
          </tr>
          <tr>
            <td>McGrath</td>
            <td>record low</td>
            <td>-75&deg;F</td>
            <td>-79.8&deg;F</td>
            <td>1989-01-27</td>
            <td>4.8&deg;F</td>
          </tr>
          <tr>
            <td>Dillingham</td>
            <td>record low</td>
            <td>-53&deg;F</td>
            <td>-59.3&deg;F</td>
            <td>1989-01-28</td>
            <td>6.3&deg;F</td>
          </tr>
          <tr>
            <td>King Salmon</td>
            <td>record low</td>
            <td>-48&deg;F</td>
            <td>-46.8&deg;F</td>
            <td>1989-01-28</td>
            <td>-1.2&deg;F</td>
          </tr>
          <tr>
            <td>Palmer</td>
            <td>record low</td>
            <td>-40&deg;F</td>
            <td>-49.7&deg;F</td>
            <td>1989-01-28</td>
            <td>9.7&deg;F</td>
          </tr>
          <tr>
            <td>Kodiak</td>
            <td>record low</td>
            <td>-16&deg;F</td>
            <td>-20.0&deg;F</td>
            <td>1989-01-29</td>
            <td>4.0&deg;F</td>
          </tr>
          <tr>
            <td>Anchorage</td>
            <td>record low daily max</td>
            <td>-19&deg;F</td>
            <td>-26.7&deg;F</td>
            <td>1989-01-28</td>
            <td>7.7&deg;F</td>
          </tr>
          <tr>
            <td>Ambler</td>
            <td>record low daily max</td>
            <td>-66&deg;F</td>
            <td>-59.3&deg;F</td>
            <td>1989-01-25</td>
            <td>-6.7&deg;F</td>
          </tr>
        </tbody>
      </table>

      <p>
        The type of analysis illustrated here can lead to other questions about
        gridded climate products like reanalysis, and
        <a
          href="https://arcticdatascience.org/item/temperature-cmip6-downscaled"
          >the downscaled climate projections that build on them</a
        >, may or may not represent extreme values. This preliminary analysis,
        based on a limited number of communities, indicates that the
        observational temperature extrema and those extracted from the ERA5-WRF
        reanalysis agree within about 1 &deg;F on average (the reanalysis being
        slightly warmer), although the spread (standard deviation) is
        substantial: &plusmn;8 &deg;F across the different communities. A more
        rigorous comparison would likely include more communities, involve a
        more detailed examination of the residuals, as well as an analysis of
        how the more &ldquo;normal&rdquo; temperature regimes (e.g., January
        1990) may influence the differences between the observations and
        reanalysis. Is the reanalysis equally skilled at reconstructing cold
        snaps and more climatically normal winter conditions? Or do the biases
        shift in magnitude and direction?
      </p>

      <p>
        However, the reanalysis does offer a &ldquo;wall to wall&rdquo;
        reconstruction of the weather history: maps without gaps. With the
        downscaled reanalysis data we can analyze more granular data, and not
        just for locations where observations were made. We know that most of
        the extreme cold temperatures occurred in a cluster around January 27
        and January 28. With downscaled reanalysis, we can ask the questions:
        what is the minimum daily minimum temperature across the entire data
        domain for these two dates? We know from the historical observed record
        that it was tremendously cold in many communities, but were even colder
        temperatures likely to have occurred in a location where no humans or
        instruments were present to record an observation?
      </p>

      <p>
        The answer to this question is derived with
        <a
          href="https://colab.research.google.com/drive/1IRonKg1p3bX_jAoBjmKWYRkxR06SuH50?usp=sharing"
          >the following</a
        >
        steps:
      </p>

      <ul>
        <li>
          Request a single-day slice of the ERA5-WRF dynamically downscaled
          reanalysis daily minimum 2 m temperature from the
          <a
            href="https://arcticdatascience.org/item/story-arctic-climate-data-node#rasdaman"
            >SNAP Rasdaman array database</a
          >
          for January 27 and 28, 1989.
        </li>
        <li>
          Analyze the resulting data slice (delivered as a NetCDF file) by
          ranking the grid cell values and reporting the minimum (i.e. coldest)
          values.
        </li>
        <li>
          For each of those coldest grid cells, record the grid coordinates and
          convert them to latitude and longitude so the cold spots can be
          located on a map and compared with station reports.
        </li>
        <li>
          The ultimate output is the most extreme low temperature, the location
          in which it occurred, for each of those two days:
        </li>
      </ul>

      <p>
        January 27, 1989 coldest temperature:
        <strong>-85.7 &deg;F at 62.9588, -154.6568</strong>
      </p>

      <p>
        January 28, 1989 coldest temperature:
        <strong>-84.2 &deg;F at 60.9892, -154.2449</strong>
      </p>

      <p>
        Each of these temperatures would shatter Alaska&rsquo;s all time
        observed cold record of -80 &deg;F (<a
          href="https://www.gi.alaska.edu/alaska-science-forum/alaskas-all-time-cold-record-turns-50"
          >recorded at Prospect Creek Camp, January 21, 1971</a
        >) -- but could it really have been that cold in 1989? Remember, these
        are reanalysis values and not observations.
      </p>

      <p>
        The location of the absolute coldest reanalysis temperature on January
        27 (<strong>-85.7 &deg;F)</strong> is about 30 miles east of McGrath,
        which has a recorded low temperature of <strong>-75 &deg;F</strong> on
        the same date (Table 1). If one were to apply the delta for McGrath from
        Table 1 (<strong>4.8F)</strong> to the
        <strong>-85.7 &deg;F</strong> value found in the reanalysis, the cold is
        still record breaking, but only just (-<strong>80.9 &deg;F).</strong>
      </p>

      <p>
        The absolute coldest reanalysis temperature for January 28
        <strong>(-84.4&deg;F)</strong> is perhaps more intriguing because the
        location of its occurrence is near Telaquana Lake, about 45 miles
        southeast of Lime Village. The geography is interesting because of the
        proximity to the mountains and glaciers of Lake Clark National Park - is
        it possible that the 9 km spatial resolution of the downscaled
        reanalysis grid cell is encapsulating the influence of higher elevation
        terrain and conditions? However, the extreme cold temperatures at
        Dillingham and King Salmon (Table 1) about 150 miles southward suggest
        that a locus of extreme cold, though perhaps not truly record breaking,
        is plausible.
      </p>

      <p>
        The southward migration of the cold is
        <a
          href="https://drive.google.com/file/d/1pY4bGxOIIWZmAbAjyhG6r3fjNnAISca-/view?usp=drive_link"
          >illustrated in the downscaled reanalysis data</a
        >.
      </p>
      <p>
        Another candidate: the raw hourly data for a week around the cold snap:
        <a
          href="https://drive.google.com/file/d/1TUMdI47-8u3bvpbowlC7adbNgX2Ki81N/view?usp=drive_link"
          >https://drive.google.com/file/d/1TUMdI47-8u3bvpbowlC7adbNgX2Ki81N/view?usp=drive_link</a
        >
      </p>
      <p>These data are not reprojected yet, which is why AK looks so weird.</p>

      <MapBlock :mapId="mapId" class="mb-6">
        <template v-slot:layers>
          <MapLayer :mapId="mapId" :layer="coldSnapLayers[0]" default>
            <template v-slot:title>{{ coldSnapLayers[0].title }}</template>
          </MapLayer>
          <MapLayer :mapId="mapId" :layer="coldSnapLayers[1]">
            <template v-slot:title>{{ coldSnapLayers[1].title }}</template>
          </MapLayer>
        </template>
      </MapBlock>

      <h4 class="title is-4">Conclusion + Outro</h4>

      <p>
        Future research directions might include the estimation of cold-weather
        risk and impacts in Alaska where weather observations are sparse, but
        infrastructure development may occur in the near future. The 1989 Cold
        Snap is a historic extreme that also presents a natural &ldquo;stress
        test&rdquo; for the usage of gridded climate data in locations where
        observations are sparse and future infrastructure decisions are
        consequential: a condition that describes most of Alaska. And because
        downscaled climate model projections use this same baseline data,
        analysis can extend from &ldquo;where was it cold in 1989&rdquo; to
        &ldquo;where might infrastructure cold weather risk persist into the
        future, even as the Alaska climate warms?&rdquo; There is a research
        pathway for remote areas to link historical events to future risk
        assessment via historical climate reconstructions and downscaled climate
        model projections.
      </p>

      <h4 class="title is-4">Offramps, Get + Use</h4>

      <ul>
        <li>
          <a href="https://uaf-accap.org/projects/extreme-events-library/"
            >ACCAP Extreme Event Library</a
          >
        </li>
        <li>
          <NuxtLink to="/item/era5-wrf-xray">ERA5-WRF Xray</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/item/temperature-cmip6-downscaled"
            >CMIP6 Downscaled Temp X-ray</NuxtLink
          >
        </li>
      </ul>

      <GetAndUseData :api-url="`${runtimeConfig.public.apiUrl}/era5wrf/`">
        <template #preamble>
          <p>
            Access ERA5-WRF data with an API that provides daily values for
            selected variables.
          </p>
        </template>
      </GetAndUseData>

      <Bios :people="['Rick Thoman']" />
    </div>
  </section>
</template>
