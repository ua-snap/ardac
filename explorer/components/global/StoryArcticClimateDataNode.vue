<script lang="ts" setup>
const placesStore = usePlacesStore()
const mapStore = useMapStore()
const dataStore = useDataStore()
const runtimeConfig = useRuntimeConfig()

const apiData = computed<Record<string, any>>(() => dataStore.apiData)
const latLng = computed<LatLngValue>(() => placesStore.latLng)

const layers: MapLayer[] = [
  {
    id: 'indicator_su_historical_era',
    title: '1980–2009, TaiESM1',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_indicators',
    style: 'ardac_indicator_su_historical_era',
    legend: 'summer_days',
    rasdamanConfiguration: { dim_model: 11, dim_scenario: 0 },
    coastline: true,
  },
  {
    id: 'indicator_su_midcentury_era',
    title: '2040–2069, TaiESM1, SSP5-8.5',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_indicators',
    style: 'ardac_indicator_su_midcentury_era',
    legend: 'summer_days',
    rasdamanConfiguration: { dim_model: 11, dim_scenario: 4 },
    coastline: true,
  },
  {
    id: 'indicator_su_latecentury_era',
    title: '2070–2099, TaiESM1, SSP5-8.5',
    source: 'rasdaman',
    wmsLayerName: 'cmip6_indicators',
    style: 'ardac_indicator_su_latecentury_era',
    legend: 'summer_days',
    rasdamanConfiguration: { dim_model: 11, dim_scenario: 4 },
    coastline: true,
  },
]

const legend: Record<string, LegendItem[]> = {
  summer_days: [
    { color: '#f4d4b4', label: '&ge;0 days, &lt;5 days' },
    { color: '#f4bc8f', label: '&ge;5 days, &lt;10 days' },
    { color: '#f5a570', label: '&ge;10 days, &lt;20 days' },
    { color: '#e58057', label: '&ge;20 days, &lt;40 days' },
    { color: '#b8694d', label: '&ge;40 days' },
  ],
}

let activeTab = ref('variables')

const changeTab = (tab: string) => {
  activeTab.value = tab
}

const mapId = 'summer_days'
mapStore.setLegendItems(mapId, legend)

onMounted(() => {
  const community = {
    id: 'AK124',
    name: 'Fairbanks',
    alt_name: '',
    region: 'Alaska',
    country: 'US',
    latitude: 64.8378,
    longitude: -147.716,
    type: 'community',
  }
  // Set the latitude and longitude for Fairbanks
  placesStore.latLng = { lat: community.latitude, lng: community.longitude }

  // Fetch the data for the chart
  dataStore.fetchData('indicatorsCmip6')
})
</script>

<template>
  <section class="section">
    <div class="content clamp">
      <h2 class="title is-2">
        Introducing the <span>Arctic Climate Data Node</span>
      </h2>
      <h3 class="subtitle is-3">
        Unlocking research potential for CMIP6 climate model data
      </h3>

      <p class="is-size-4">
        Access to large distributed data volumes has been a limiting factor for
        researchers in Alaska, which puts them at a disadvantage. Establishing
        the Arctic Climate Data Node (ACDN) at UAF provides never&ndash;before
        realized local access to cutting-edge global climate model data.
      </p>

      <p class="is-size-4">
        <NuxtLink to="/tag/CMIP6"
          >&#x2192; browse available CMIP6 ACDN data on this site</NuxtLink
        >
      </p>

      <div class="is-size-5">
        <p>
          Through support from the Department of Energy&rsquo;s
          <a href="https://science.osti.gov/ber/Research/eessd/Data-Management">
            Earth and Environmental Systems Sciences Division Data Management
            program,
          </a>
          the University of Alaska Fairbanks (UAF) has established the Arctic
          Climate Data Node. The ACDN provides local access to
          <a href="https://pcmdi.llnl.gov/CMIP6/"
            >Coupled Model Intercomparison Project Phase 6</a
          >
          (CMIP6) data and includes associated computational resources required
          to facilitate data transfer, analysis, and evaluation as well as aid
          in the development of new derived data products.
        </p>
        <p>
          The ACDN will facilitate the development of new research themes,
          process&ndash;based modeling, mechanistic modeling, and regional
          synthesis at UAF and within the broader Arctic science community. The
          node establishes research computing infrastructure to support local
          storage and access to key datasets. This will provide significant
          capacity&ndash;building to Alaska's research community members and
          rightsholders as they address the ongoing challenges of a changing
          climate.
        </p>
      </div>
    </div>

    <div class="content clamp">
      <h3 class="title is-3">What does ACDN offer researchers?</h3>
      <h4 class="subtitle is-4 mt-4 mb-1">Data ready for use in research</h4>
      <div class="is-size-5">
        <ul>
          <li>
            A curated suite of
            <strong>
              <span class="bling">CMIP6</span> models and scenarios that perform
              best in Alaska and the pan&ndash;Arctic: </strong
            >These include 12 global climate models, 4 emissions scenarios, and
            18 variables. Compared to prior CMIP5 data housed at UAF, the CMIP6
            data available through the ACDN offers more models and more
            variables, while representing the current state-of-the-art climate
            model outputs.
          </li>
          <li>
            <strong>Preprocessed data on a common grid:</strong> This allows
            researchers to focus on applying the data and solving significant
            geospatial data problems.
          </li>
          <li>
            Derived products: These include standardized
            <strong>climate indicators</strong>&mdash;such as how many days per
            year exceed 25&deg;C, or how many days per year have temperatures
            above and below freezing&mdash;making baseline temperature and
            precipitation more useful.
          </li>
          <li>
            <a href="#available-data">&#x2192; see available data</a>
          </li>
        </ul>
      </div>

      <h3 class="subtitle is-4 mb-1">Multiple data access pathways</h3>
      <div class="is-size-5">
        <ul>
          <li>
            <strong>Local data access:</strong> The ACDN is a workspace for
            University of Alaska affiliated researchers with a repository of
            CMIP6 data attached directly to the
            <a href="https://uaf-rcs.gitbook.io/uaf-rcs-hpc-docs/hpc"
              >Chinook compute cluster</a
            >. This allows for fast access and scratch space for working with
            data.
            <a href="#beegeefs">&#x2192; read more about ACDN storage</a>
          </li>
          <li>
            <strong
              ><a href="https://earthmaps.io">A simple data API:</a></strong
            >
            The SNAP Application Program Interface (API) provides programmatic
            access to CMIP6 data, allowing users to query and download data
            directly from the command line or within their own applications. The
            API supports a wide range of query parameters, including model,
            scenario, variable, and geographic region, enabling users to extract
            specific subsets of data or perform complex analyses directly within
            the API.
            <br />
            Example:
            <a href="https://earthmaps.io/indicators/cmip6/point/61.5/-147"
              ><code
                >https://earthmaps.io/indicators/cmip6/point/61.5/-147</code
              >
            </a>
          </li>

          <li>
            Rasdaman: The ACDN provides a
            <strong>multidimensional raster datacube</strong> for data analysis
            and mapping. Users can access CMIP6 data from rasdaman using the
            standards-based OGC formats for web mapping and coverage requests:
            WMS, and WCS/WCPS. This can be integrated into GIS platforms or used
            to extract data for local analysis.
            <a href="#rasdaman">&#x2192; read more about rasdaman</a>
          </li>

          <li>
            <strong>Remote data access</strong> via Globus: Users equipped with
            a Globus account can seamlessly navigate the ACDN file storage
            system to retrieve data, transferring it to any system where they
            hold a Globus account.
            <a href="#globus">&#x2192; read more about Globus</a>
          </li>
        </ul>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="clamp">
      <h3 class="title is-3">CMIP6 Climate Indicator In Action: Summer Days</h3>
      <div class="content is-size-5">
        <p>
          Summer days are the number of days per year that are above 25&deg;C
          &lpar;77&deg;F&rpar;. The map below shows the 30-year mean of summer
          days using CMIP6 temperature data for three eras. The historical era
          (1980&ndash;2009) uses model baseline data from the TaiESM1 dataset.
          The mid-century era (2040&ndash;2069) and late-century era
          (2070&ndash;2099) use TaiESM1 data under the climate scenario SSP5-8.5
          scenario.
        </p>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="block mt-5">
      <MapBlock :mapId="mapId" crs="EPSG:3572">
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

      <IndicatorsCmip6ChartControls />
      <IndicatorsCmip6Chart label="Summer days" dataKey="su" />
    </div>
  </section>

  <section class="section">
    <div class="clamp">
      <h3 id="available-data" class="title is-3">
        Overview of CMIP6 data in the ACDN
      </h3>
      <div class="content is-size-5">
        <p>
          Some data listed below are not fully integrated into the web site, but
          work is in progress to add all data assets.
          <NuxtLink to="/tag/CMIP6"
            >&#x2192; browse available CMIP6 ACDN data on this site</NuxtLink
          >
        </p>
      </div>
      <div class="tabs is-large">
        <ul>
          <li :class="{ 'is-active': activeTab === 'variables' }">
            <a @click="changeTab('variables')">Variables</a>
          </li>
          <li :class="{ 'is-active': activeTab === 'models' }">
            <a @click="changeTab('models')">Models</a>
          </li>
          <li :class="{ 'is-active': activeTab === 'scenarios' }">
            <a @click="changeTab('scenarios')">Scenarios</a>
          </li>
        </ul>
      </div>

      <div v-if="activeTab === 'models'">
        <div class="content is-size-5">
          <table>
            <thead>
              <tr>
                <th scope="col" class="model">Climate Model</th>
                <th>Institutions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>E3SM 1.1 and E3SM 2.0</td>
                <td>
                  United States Department Of Energy
                </td>
              </tr>
              <tr>
                <td>CESM2</td>
                <td>
                  National Center for Atmospheric Research, Climate and Global
                  Dynamics Laboratory
                </td>
              </tr>
              <tr>
                <td>CNRM-CM6-1-HR</td>
                <td>
                  Centre National de Recherches Meteorologiques, Centre Europeen
                  de Recherche et de Formation Avancee en Calcul Scientifique
                </td>
              </tr>
              <tr>
                <td>EC-Earth3-Veg</td>
                <td>
                  EC-Earth, Rossby Center, Swedish Meteorological and
                  Hydrological Institute
                </td>
              </tr>
              <tr>
                <td>GFDL-ESM4</td>
                <td>
                  National Oceanic and Atmospheric Administration, Geophysical
                  Fluid Dynamics Laboratory
                </td>
              </tr>
              <tr>
                <td>HadGEM3-GC31-LL</td>
                <td>
                  Met Office Hadley Centre for Climate Science and Services
                </td>
              </tr>
              <tr>
                <td>HadGEM3-GC31-MM</td>
                <td>
                  Met Office Hadley Centre for Climate Science and Services
                </td>
              </tr>
              <tr>
                <td>KACE-1-0-G</td>
                <td>
                  National Institute of Meteorological Sciences/Korea
                  Meteorological Administration, Climate Research Division
                </td>
              </tr>
              <tr>
                <td>MIROC6</td>
                <td>
                  Japan Agency for Marine-Earth Science and Technology;
                  Atmosphere and Ocean Research Institute, The University of
                  Tokyo; National Institute for Environmental Studies; RIKEN
                  Center for Computational Science
                </td>
              </tr>
              <tr>
                <td>MPI-ESM1-2-HR</td>
                <td>Max Planck Institute for Meteorology</td>
              </tr>
              <tr>
                <td>MRI-ESM2-0</td>
                <td>Meteorological Research Institute</td>
              </tr>
              <tr>
                <td>NorESM2-MM</td>
                <td>NorESM Climate Modeling Consortium</td>
              </tr>
              <tr>
                <td>TaiESM1</td>
                <td>
                  Research Center for Environmental Changes, Academia Sinica
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-if="activeTab === 'scenarios'">
        <div class="content is-size-5">
          <table>
            <tr>
              <th>SSP</th>
              <th>Description</th>
            </tr>
            <tr></tr>
            <tr>
              <td>SSP126</td>
              <td>
                This pathway represents a sustainable world where global
                population peaks around 2050 and declines thereafter, leading to
                rapid improvements in education, health, and economic
                development. It emphasizes low material consumption, reduced
                greenhouse gas emissions, and efficient resource use. Policies
                prioritize environmental sustainability, social equity, and
                international cooperation. Renewable energy sources dominate the
                energy mix, and technologies for carbon dioxide removal are
                widely deployed to achieve net-negative emissions by the end of
                the century.
              </td>
            </tr>
            <tr>
              <td>SSP245</td>
              <td>
                SSP245 depicts a future where the world follows a moderate path
                of development with uneven progress across regions. Population
                growth continues, albeit at a slower pace, and income inequality
                persists. Economic growth is driven by a combination of fossil
                fuels and renewable energy sources, resulting in moderate
                increases in greenhouse gas emissions. Technological progress is
                moderate, and adaptation measures are implemented to address
                climate change impacts. International cooperation varies, with
                some efforts to mitigate emissions but limited success in
                achieving ambitious climate targets.
              </td>
            </tr>
            <tr>
              <td>SSP370</td>
              <td>
                In this scenario, the world experiences a fragmented and
                regionalized future characterized by high population growth,
                slow economic development in some regions, and geopolitical
                tensions. Fossil fuels remain the dominant energy source,
                leading to substantial greenhouse gas emissions and
                environmental degradation. Efforts to address climate change are
                hindered by geopolitical conflicts, limited international
                cooperation, and inadequate mitigation policies. Adaptation
                measures are primarily reactive and insufficient to prevent
                significant climate impacts, resulting in widespread
                vulnerabilities and disruptions.
              </td>
            </tr>
            <tr>
              <td>SSP585</td>
              <td>
                SSP585 represents a future where the world pursues a pathway of
                high fossil fuel use and rapid economic growth, leading to
                continued population growth and increasing demand for energy and
                resources. Despite technological advancements, efforts to
                mitigate greenhouse gas emissions are limited, resulting in a
                high-forcing scenario with extensive climate change impacts.
                Environmental degradation, biodiversity loss, and social
                inequalities escalate, exacerbating global challenges.
                Adaptation measures are reactive and often inadequate, leading
                to significant disruptions and irreversible damage to ecosystems
                and societies.
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div v-if="activeTab === 'variables'">
        <div class="content is-size-5">
          <table>
            <tr>
              <th scope="col">Variable</th>
              <th scope="col">Short name</th>
              <th scope="col" style="min-width: 15rem">Temporal frequency</th>
            </tr>
            <tr>
              <td>Near surface air temperature</td>
              <td><code>tas</code></td>
              <td>Monthly</td>
            </tr>
            <tr>
              <td>Precipitation</td>
              <td><code>pr</code></td>
              <td>Monthly</td>
            </tr>
            <tr>
              <td>Maximum near surface air temperature</td>
              <td><code>tasmax</code></td>
              <td>Monthly</td>
            </tr>
            <tr>
              <td>Minimum near surface air temperature</td>
              <td><code>tasmin</code></td>
              <td>Monthly</td>
            </tr>
            <tr>
              <td>Surface air temperature</td>
              <td><code>ts</code></td>
              <td>Monthly</td>
            </tr>
            <tr>
              <td>Near-surface eastward wind</td>
              <td><code>uas</code></td>
              <td>Monthly</td>
            </tr>
            <tr>
              <td>Near-surface northward wind</td>
              <td><code>vas</code></td>
              <td>Monthly</td>
            </tr>
            <tr>
              <td>Cloud area fraction</td>
              <td><code>clt</code></td>
              <td>Monthly</td>
            </tr>
            <tr>
              <td>Evaporation, including sublimation and transpiration</td>
              <td><code>evspsbl</code></td>
              <td>Monthly</td>
            </tr>
            <tr>
              <td>Surface upward latent heat flux</td>
              <td><code>hfls</code></td>
              <td>Monthly</td>
            </tr>
            <tr>
              <td>Surface upward sensible heat flux</td>
              <td><code>hfss</code></td>
              <td>Monthly</td>
            </tr>
            <tr>
              <td>Sea level pressure</td>
              <td><code>psl</code></td>
              <td>Monthly</td>
            </tr>
            <tr>
              <td>Surface downwelling longwave radiation</td>
              <td><code>rlds</code></td>
              <td>Monthly</td>
            </tr>
            <tr>
              <td>Surface downwelling shortwavewave radiation</td>
              <td><code>rsds</code></td>
              <td>Monthly</td>
            </tr>
            <tr>
              <td>Surface wind</td>
              <td><code>sfcWind</code></td>
              <td>Monthly</td>
            </tr>
            <tr>
              <td>Precipitation as snow</td>
              <td><code>prsn</code></td>
              <td>Monthly</td>
            </tr>
            <tr>
              <td>Snow water equivalent</td>
              <td><code>snw</code></td>
              <td>Monthly</td>
            </tr>
            <tr>
              <td>Sea ice concentration</td>
              <td><code>siconc</code></td>
              <td>Monthly</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="block clamp content is-size-5">
      <h3 id="technical-information" class="title is-3">
        Technical information
      </h3>

      <div id="acdn" class="block">
        <h4 class="title is-4">Arctic Climate Data Node (ACDN)</h4>

        <p>
          The ACDN operates as a robust storage infrastructure employing BeeGFS,
          a distributed file system technology. This setup ensures swift access
          to object storage servers via a blazing-fast 100 Gb/s network.
          Leveraging the ample storage capacity of this system, SNAP can
          efficiently store, regrid, and bias-correct data pertinent to the
          state of Alaska. Future opportunities include
          <a
            href="https://www.sciencedirect.com/science/article/pii/S1364815217305662"
            >downscaling the model data to higher resolutions</a
          >
          across Alaska's expanse and crafting additional climate indicators,
          beyond the current offerings of summer days, winter days, maximum
          1-day precipitation, and freeze/thaw cycles.
        </p>
      </div>

      <div id="rasdaman" class="block">
        <h4 class="title is-4">Rasdaman, an array database</h4>

        <p>
          Rasdaman is an open&ndash;source software for managing massive arrays
          of multi&ndash;dimensional data, primarily used in scientific and
          geospatial applications. It&rsquo;s designed to efficiently store,
          retrieve, and analyze large&ndash;scale raster data, such as satellite
          imagery, climate data, and simulations.
        </p>
        <p>
          One of Rasdaman&rsquo;s key features is its ability to handle
          multi&ndash;dimensional data sets, enabling users to store and query
          data along multiple axes, such as time, space, and spectral
          dimensions. It supports a wide range of data formats and provides
          powerful query capabilities for extracting specific subsets of data or
          performing complex analyses directly within the database.
        </p>
        <p>
          Learn more at: <a href="https://rasdaman.org">https://rasdaman.org</a>
        </p>

        <p>
          Users can quickly access CMIP6 data using SNAP&rsquo;s Rasdaman server
          and WCS, WCPS, or WMS queries. For example, the WCS query below
          returns a subset of the multidimensional CMIP6 data in NetCDF format
          that can be processed in various environments:
        </p>

        <p>
          Data can be analyzed and visualized directly from the WCS response,
          e.g.:
        </p>
        <figure class="image">
          <img
            src="/assets/images/mean_june_air_temperature.png"
            alt="Mean June Air Temperature"
          />
        </figure>
        <p>
          Many of SNAP&rsquo;s datasets are available as Rasdaman coverages. See
          <a href="#replacethis">this notebook</a> for a tutorial on how to use
          these services in your own work.
        </p>
      </div>

      <div id="globus" class="block">
        <h4 class="title is-4">Globus</h4>

        <p>
          Globus is a secure, reliable, and scalable data management platform
          that enables researchers to easily move, share, and analyze large
          volumes of data. It provides a user-friendly interface for
          transferring data between storage systems, sharing data with
          collaborators, and automating data workflows. Globus&rsquo; powerful
          data management capabilities make it an ideal solution for researchers
          working with large datasets, such as CMIP6 climate model data.
        </p>
        <p>
          Users equipped with a Globus account can seamlessly navigate the ACDN
          file storage system to retrieve data, transferring it to any system
          where they hold a Globus account. This encompasses an array of major
          national laboratories with supercomputing capabilities.
        </p>
        <p>
          Learn more at:
          <a href="https://www.globus.org">https://www.globus.org</a>
        </p>
      </div>
    </div>

    <Bios :people="['Scott Rupp', 'Bruce Crevensten']" />
  </section>
</template>

<style scoped lang="scss">
table {
  th[scope='col'] {
    &.model,
    &.variable {
      width: 20rem;
    }
  }
}
figure {
  figcaption {
    float: left;
  }
}
</style>
