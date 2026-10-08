<script lang="ts" setup>
import {
  AIRPORT_WINDS_DATA_PATH,
  DEFAULT_AIRPORT,
  type AirportStation,
  type AirportWindsData,
  type PetalCount,
  type WindSpeedUnits,
} from '~/utils/airportWinds'

const dataStore = useDataStore()
const mapStore = useMapStore()

const stationsKey = 'airportWindsStations'
const windsKey = 'airportWinds'
const mapId = 'airport-winds-map'

const selectedSid = ref<string>(DEFAULT_AIRPORT)
const units = ref<WindSpeedUnits>('kts')
const petalCount = ref<PetalCount>('16')

const stations = computed<AirportStation[] | null>(
  () => dataStore.apiData[stationsKey] ?? null
)
const winds = computed<AirportWindsData | null>(
  () => dataStore.apiData[windsKey] ?? null
)
const dataError = computed<boolean>(
  () => dataStore.dataErrors[stationsKey] || dataStore.dataErrors[windsKey]
)

// Look up the station from the loaded wind data, rather than the selector,
// so charts never show one station's name with another station's data.
const station = computed<AirportStation | undefined>(() =>
  stations.value?.find(station => station.sid === winds.value?.sid)
)

const fetchWinds = () => {
  dataStore.fetchStaticData(
    AIRPORT_WINDS_DATA_PATH + selectedSid.value + '.json',
    windsKey
  )
}

watch(stations, newStations => {
  if (!newStations) return
  const points: MapPoint[] = newStations.map(station => ({
    id: station.sid,
    label: station.label,
    lat: station.lat,
    lng: station.lng,
  }))
  mapStore.addPoints(mapId, points, sid => {
    selectedSid.value = sid
  })
  mapStore.selectPoint(mapId, selectedSid.value)
})

watch(selectedSid, () => {
  mapStore.selectPoint(mapId, selectedSid.value)
  fetchWinds()
})

onMounted(() => {
  dataStore.fetchStaticData(
    AIRPORT_WINDS_DATA_PATH + 'stations.json',
    stationsKey
  )
  fetchWinds()
})

onUnmounted(() => {
  ;[stationsKey, windsKey].forEach(key => {
    dataStore.apiData[key] = null
    dataStore.dataErrors[key] = false
  })
})
</script>

<template>
  <section class="section">
    <div class="content clamp is-size-5">
      <h3 class="title is-3">Historical Winds at Alaska Airports</h3>
      <p class="is-size-4">
        Explore visualizations of historical wind data recorded at 166 Alaska
        airports. These data were developed by the Scenarios Network for Alaska
        and Arctic Planning (SNAP) in collaboration with the
        <a href="https://wrcc.dri.edu/">Western Regional Climate Center</a>.
      </p>
      <p>
        To see an airport&rsquo;s wind data, click a dot on the map or choose
        from the list. All charts will update with data from your chosen
        airport. Click the camera icon in the upper-right of each chart to
        download it.
      </p>

      <MapBlock :mapId="mapId">
        <template v-slot:layers>
          <div class="field">
            <label for="airport" class="label">Select an airport</label>
            <div class="control">
              <div class="select">
                <select id="airport" v-model="selectedSid">
                  <option
                    v-for="station in stations"
                    :key="station.sid"
                    :value="station.sid"
                  >
                    {{ station.label }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </template>
      </MapBlock>

      <div v-if="dataError" class="notification is-danger is-light">
        Sorry, wind data for this airport could not be loaded. Please try again
        later.
      </div>
      <progress v-else-if="!station || !winds" class="progress" />
      <div v-else>
        <h4 class="title is-4">Station Summary</h4>
        <p>
          This wind rose shows prevailing wind direction and speed for all
          routine hourly data recorded at the selected station.
        </p>
        <ul>
          <li>
            <strong>Spokes</strong> in the rose point in the compass direction
            from which the wind was blowing (i.e., a spoke pointing to the right
            denotes a wind from the east).
          </li>
          <li>
            <strong>Colors</strong> within each spoke denote wind speed, and
            segment length denotes occurrence frequency. Hover over a spoke to
            show the frequencies.
          </li>
          <li>
            <strong>Size</strong> of the center hole indicates the frequency of
            calm winds.
          </li>
        </ul>

        <AirportWindsControls
          v-model:units="units"
          v-model:petalCount="petalCount"
        />
        <AirportWindsRose
          :station="station"
          :winds="winds"
          :units="units"
          :petalCount="petalCount"
        />

        <p>
          These wind roses are similar to the one shown above, except data are
          separated by month. Compare the roses to see how wind direction and
          speed change throughout the year.
        </p>
        <AirportWindsMonthlyRoses
          :station="station"
          :winds="winds"
          :units="units"
          :petalCount="petalCount"
        />

        <h4 class="title is-4">Crosswind Component Calculation</h4>
        <p>
          Use this chart to explore how the allowable crosswind component
          exceedance changes with runway direction. The exceedance is the
          frequency with which hourly winds exceeded the allowable crosswind
          component threshold. Thresholds are derived from the FAA Runway Design
          Codes (RDC) described in the
          <a
            href="https://www.faa.gov/airports/resources/advisory_circulars/index.cfm/go/document.current/documentNumber/150_5300-13"
            >Advisory Circular 150/5300-13A</a
          >
          and correspond to different size classes of aircraft. Hover over lines
          to show aircraft classes. Existing runways are shown as shaded strips;
          hover over a strip&rsquo;s corners to see more detail.
        </p>
        <AirportWindsCrosswind
          :station="station"
          :winds="winds"
          :units="units"
        />

        <h4 class="title is-4">Wind Energy Potential</h4>
        <p>
          Use this box plot to explore the seasonal changes in wind energy
          potential. Each data point is the average wind energy potential for
          one month of one year, based on all hourly reports for that month.
        </p>
        <ul>
          <li>Boxes show the middle 50% of monthly averages.</li>
          <li>Horizontal lines within boxes show the median.</li>
          <li>
            Whiskers (vertical lines above and below boxes) represent the full
            ranges of typical variation of monthly averages for the different
            years, extended to the minimum and maximum points contained within
            1.5 of the interquartile range (IQR, which is the height of the box
            shown).
          </li>
          <li>
            Dots indicate outliers, or individual values outside the normal
            variation (1.5 IQR).
          </li>
        </ul>
        <AirportWindsWindEnergy :station="station" :winds="winds" />

        <h4 class="title is-4">Historical Winds Comparison</h4>
        <p>
          Wind roses show prevailing wind direction and speed for two historical
          decades: &ldquo;recent&rdquo; (2010&ndash;2019) and the oldest decade
          available.
        </p>
        <div v-if="winds.comparison">
          <AirportWindsDecadeRoses
            :station="station"
            :winds="winds"
            :units="units"
            :petalCount="petalCount"
          />

          <h4 class="title is-4">Change in Winds</h4>
          <p>
            The chart below displays differences in occurrence frequencies of
            the various wind classes between the historical decades summarized
            in the roses above. Use it to further explore the change in winds
            from then to now.
          </p>
          <AirportWindsChangeRose
            :station="station"
            :winds="winds"
            :units="units"
            :petalCount="petalCount"
          />
        </div>
        <div v-else class="notification is-warning is-light">
          {{ station.name }} does not have sufficient data for this comparison.
        </div>
      </div>

      <h4 class="title is-4">About Airport Wind Data</h4>
      <p>
        Wind speed/direction observations source:
        <a
          href="https://mesonet.agron.iastate.edu/request/download.phtml?network=AK_ASOS"
          >Iowa Environmental Mesonet</a
        >, run by Iowa State University. Houses data collected by the
        <a
          href="https://www.ncei.noaa.gov/products/land-based-station/automated-surface-weather-observing-systems"
          >Automated Surface Observing System and Automated Weather Observing
          System</a
        >
        networks.
      </p>
      <p>
        Measurement frequency: Winds were measured hourly in most cases; routine
        measurements were preferred (nearest to clock hour) in cases where
        measurements were more frequent.
      </p>
      <p>
        Observing site criteria: We used data from 166 airport weather stations
        located across Alaska, selected from a pool of 185 candidate stations in
        the database. For inclusion here, a station must have a reasonably
        complete record, and must have begun measurements before June 6, 2010.
      </p>

      <h5 class="title is-5">Data processing and quality control</h5>
      <p>
        Data were adjusted for homogeneity because some instrument heights (now
        10 m) and/or precise locations have changed since 1980.
      </p>
      <p>
        Wind speeds at 47 stations showed a change from one part of the record
        to the next. Therefore we adjusted the data prior to the change using
        quantile mapping, a typical method for correcting biased meteorological
        data.
      </p>
      <p>
        Five stations displayed two discontinuities. For these, we applied the
        quantile mapping adjustments to the later period.
      </p>
      <p>
        We also removed obviously wrong reports (e.g., sustained wind speeds
        exceeding 110 mph) and short-duration spikes and dips identified using a
        signal-processing technique for
        <a
          href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.find_peaks.html"
          >identifying outliers</a
        >.
      </p>

      <h5 class="title is-5">Data download</h5>
      <p>
        Data visualized here can be
        <a
          href="https://catalog.snap.uaf.edu/geonetwork/srv/eng/catalog.search#/metadata/00590305-fc2c-4b2c-8b22-7f8875b18037"
          >downloaded from the SNAP data catalog</a
        >.
      </p>

      <h5 class="title is-5">Similar tools</h5>
      <p>
        The
        <a href="https://windtool.accap.uaf.edu/">ACCAP Community Winds tool</a>
        takes a climatological approach with much of the same data, and includes
        model-based projections of future winds.
      </p>

      <Bios :people="['Kyle Redilla']" />
    </div>
  </section>
</template>

<style scoped></style>
