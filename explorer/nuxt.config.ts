const noscriptHtml = `
<style>
  section {
    width: 600px;
    margin: 50px auto;
    font-size: 110%;
    font-family: sans-serif;
    line-height: 1.3;
  }
  li {
    margin-bottom: 0.25rem;
  }
</style>
<section>
  <h1>Arctic Data Collaborative</h1>

  <p>
    The Arctic Data Collaborative (ARDAC) provides highly-curated, relevant
    <b>Arctic datasets</b>, streamlined <b>data access</b>, processing
    <code>code examples</code> and <b>visualizations</b> to support research in
    the North.
  </p>
  <p>
    ⚠️ We&rsquo;re sorry, but this web tool requires JavaScript to be enabled to
    run. <strong>Please email us at uaf-snap-data-tools@alaska.edu</strong> if
    you would like assistance to access content on this site.
  </p>

  <h3>Content available on this site</h3>
  <p>
    This tool has a wide range of best-available climate science datasets and
    supporting content. Datasets include:
  </p>
  <ul>
    <li>
      Temperature and precipitation, from both CMIP5 and CMIP6 climate models,
      at 2km resolution over Alaska and western Canada
    </li>
    <li>
      Derived climate indicators, such as &lsquo;wet days per year&rsquo; and &lsquo;deep winter
      days&rsquo;, provide additional meaning and context for changing climate
      conditions
    </li>
    <li>Hydrology, including evapotranspiration and soil moisture content</li>
    <li>
      Flammability and vegetation from the ALFRESCO fire model, driven by CMIP5
      climate models
    </li>
    <li>
      Sea ice concentration across the entire Arctic, as well as landfast sea
      ice on the Alaska coast
    </li>
  </ul>
  <p>
    For every variable in each dataset, you can see an interactive map. If you
    pick a specific place by name or latitude/longitude, you can see interactive
    charts as well as get a download of the timeseries of data for that point.
  </p>
  <p>
    This site also has interactive stories which draw upon the datasets
    available here. Written by several different researchers with the University
    of Alaska Fairbanks and other institutions, these stories help explain and
    explore the context and implications of various aspects of these datasets.
  </p>
  <p>
    Finally, we also include guides on how to write programs that use the
    <a href="https://earthmaps.io">Data API</a> that drives this application.
    Interactive online computational notebooks can be run in the browser, and
    edited to help you get started with interacting with climate data via
    Python.
  </p>
</section>
`

import { metas } from './utils/metas'
import items from './assets/items'
import _ from 'lodash'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false, // required or 3rd party libs break the app
  nitro: {
    prerender: {
      routes: [
        '/item/indicator-su',
        '/item/indicator-dw',
        '/item/indicator-hd',
        '/item/indicator-cd',
        '/item/indicator-wsdi',
        '/item/indicator-csdi',
        '/item/wet-days-per-year',
        '/item/dd-below-65',
        '/item/dd-below-0',
        '/item/thawing-index',
        '/item/freezing-index',
        '/item/story-arctic-climate-data-node',
        '/item/notebook-corporation-hdd',
        '/item/notebook-raster-database',
        '/item/notebook-frost-depth',
        '/item/notebook-design-freezing-index',
        '/item/notebook-design-thawing-index',
        '/item/climate-beetle-protection',
        '/item/landfast-sea-ice',
        '/item/sea-ice-concentration',
        '/item/notebook-sea-ice-traffic',
        '/item/places-and-polygons',
        '/item/hydrology-evap',
        '/item/hydrology-glacier-melt',
        '/item/hydrology-iswe',
        '/item/hydrology-runoff',
        '/item/hydrology-sm',
        '/item/hydrology-snow-melt',
        '/item/lightning-climatology',
        '/item/permafrost-magt',
        '/item/permafrost-base-top',
        '/item/permafrost-talik',
        '/item/map-permafrost',
        '/item/notebook-perm-obs-temp',
        '/item/indicator-r10mm',
        '/item/indicator-cwd',
        '/item/indicator-cdd',
        '/item/precipitation-2km-cmip5',
        '/item/precipitation-frequency',
        '/item/indicator-rx1day',
        '/item/indicator-rx5day',
        '/item/notebook-design-discharge',
        '/item/notebook-precip-poly',
        '/item/temperature-cmip5',
        '/item/temperature-cmip6',
        '/item/notebook-era5-cds-api',
        '/item/elevation',
        '/item/notebook-fmz-flammability',
        '/item/alfresco-flammability',
        '/item/alfresco-vegetation',
        '/item/wildfire-combined',
        '/item/wind-cmip6',
        '/item/oceanography-cmip6',
        '/item/precipitation-cmip6',
        '/item/evaporation-cmip6',
        '/item/solar-radiation-cloud-cover-cmip6',
        '/item/sea-ice-cmip6',
        '/item/snow-cmip6',
        '/item/indicator-ftc-cmip6',
        '/item/indicator-su-cmip6',
        '/item/indicator-dw-cmip6',
        '/item/indicator-rx1day-cmip6',
        '/item/story-climate-stripes-1',
        '/item/story-climate-stripes-2',
        '/item/story-beetle-climate-protection',
        '/item/summary-landfast-sea-ice',
        '/item/story-climate-indicators',
        '/tag/Climate',
        '/tag/Programming',
        '/tag/Terrestrial',
        '/tag/Cryosphere',
        '/tag/GIS',
        '/tag/Hydrology',
        '/tag/Lightning',
        '/tag/Wildfire',
        '/tag/Permafrost',
        '/tag/Precipitation',
        '/tag/Temperature',
        '/tag/CMIP6',
        '/tag/Wind',
        '/tag/Oceanography',
        '/tag/Sea Ice',
        '/tag/Solar Radiation',
        '/tag/Snow',
        '/tag/Story',
      ],
    },
  },
  devtools: { enabled: true },
  css: ['assets/styles/main.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "~/assets/styles/_variables.scss" as *;
            @import "~/node_modules/bulma/sass/utilities/mixins.sass";
          `,
        },
      },
    },
  },
  modules: ['@pinia/nuxt'],
  typescript: {
    typeCheck: true,
  },
  runtimeConfig: {
    public: {
      geoserverUrl:
        process.env.GEOSERVER_URL || 'https://gs.earthmaps.io/geoserver/wms',
      apiUrl: process.env.SNAP_API_URL || 'https://earthmaps.io',
      rasdamanUrl:
        process.env.RASDAMAN_URL || 'https://maps.earthmaps.io/rasdaman/ows',
    },
  },
  app: {
    head: {
      noscript: [
        {
          children: noscriptHtml,
        },
      ],
      title: 'Arctic Data Collaborative: ARDAC',
      script: [
        {
          src: 'https://umami.snap.uaf.edu/script.js',
          'data-website-id': '29d337b9-9cf3-4962-a319-f4944161b550',
          'data-do-not-track': 'true',
          'data-domains': 'arcticdatascience.org',
          async: 'true',
          defer: 'true',
        },
        {
          type: 'text/javascript',
          src: '//script.crazyegg.com/pages/scripts/0126/7664.js',
          async: true,
        },
      ],
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
      meta: [
        { name: 'description', content: metas.description },
        { name: 'og:title', content: metas.title },
        { name: 'og:image', content: metas.image },
        { name: 'og:description', content: metas.description },
        { name: 'twitterCard', content: 'summary_large_image' },
      ],
    },
  },
})
