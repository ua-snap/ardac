export default [
  {
    slug: 'indicator-su',
    title: 'Summer Days',
    blurb: 'Annual count when daily max temperature (threshold) >25°C',
    tags: ['Climate'],
  },
  {
    slug: 'indicator-dw',
    title: 'Deep Winter Days',
    blurb: 'Annual count when daily min temperature (threshold) <-30°C',
    tags: ['Climate'],
  },
  {
    slug: 'indicator-hd',
    title: 'Hot Day Threshold',
    blurb:
      'The highest observed daily maximum 2 m air temperature such that there are 5 other observations equal to or greater than this value.',
    tags: ['Climate'],
  },
  {
    slug: 'indicator-cd',
    title: 'Cold Day Threshold',
    blurb:
      'The lowest observed daily minimum 2 m air temperature such that there are 5 other observations equal to or less than this value.',
    tags: ['Climate'],
  },
  {
    slug: 'indicator-wsdi',
    title: 'Warm Spell Duration Index',
    blurb:
      'Annual count of occurrences of at least 5 consecutive days with daily mean 2 m air temperature above 90th percentile of historical values for the date',
    tags: ['Climate'],
  },
  {
    slug: 'indicator-csdi',
    title: 'Cold Spell Duration Index',
    blurb:
      'Annual count of occurrences of at least 5 consecutive days with daily mean 2 m air temperature below 10th percentile of historical values for the date',
    tags: ['Climate'],
  },
  {
    slug: 'wet-days-per-year',
    title: 'Wet Days Per Year',
    blurb:
      'Number of days per calendar year where the total precipitation amount is ≥ 1.0 mm',
    tags: ['Climate'],
  },

  {
    slug: 'dd-below-65',
    title: 'Degree Days Below 65°F',
    blurb: 'Total annual cumulative degree days below 65°F',
    tags: ['Climate'],
  },
  {
    slug: 'dd-below-0',
    title: 'Degree Days Below 0°F',
    blurb: 'Total annual cumulative degree days below 0°F',
    tags: ['Climate'],
  },
  {
    slug: 'thawing-index',
    title: 'Thawing Index',
    blurb: 'Total annual cumulative degree days above 32°F',
    tags: ['Climate'],
  },
  {
    slug: 'freezing-index',
    title: 'Freezing Index',
    blurb: 'Total annual cumulative degree days below 32°F',
    tags: ['Climate'],
  },
  {
    slug: 'story-arctic-climate-data-node',
    title: 'Introducing the Arctic Climate Data Node',
    blurb:
      'New CMIP6 climate data for Alaska and the Arctic, providing local access to cutting-edge global climate model data',
    tags: ['Climate'],
    image: 'arctic2100_drew-beamer-unsplash.jpg',
    imageAlt:
      'Person holding a crystal ball up to an Arctic sunset.  Photo by Drew Beamer on Unsplash.',
  },
  {
    slug: 'notebook-corporation-hdd',
    title: 'Heating Degree Days by Alaska Native Corporation',
    blurb:
      'Demonstration of how to query Alaska Native Corporation polygons, Alaska communities, and modeled heating degree days',
    tags: ['Climate', 'Programming'],
  },
  {
    slug: 'notebook-raster-database',
    title: "Fetch data from SNAP's raster database",
    blurb:
      "Learn how to fetch and plot subsets of data from SNAP's raster database",
    tags: ['Climate', 'Programming'],
  },
  {
    slug: 'notebook-frost-depth',
    title: 'Modified Berggren Frost Depth',
    blurb: 'Learn how to calculate compute the ModBerg frost depth',
    tags: ['Climate', 'Programming'],
  },
  {
    slug: 'notebook-design-freezing-index',
    title: 'Design Freezing Index',
    blurb:
      'Learn how to calculate design freezing index by averaging the three coldest years from a given range of years',
    tags: ['Climate', 'Programming'],
  },
  {
    slug: 'notebook-design-thawing-index',
    title: 'Design Thawing Index',
    blurb:
      'Learn how to calculate design thawing index by averaging the three warmest years from a given range of years',
    tags: ['Climate', 'Programming'],
  },
  {
    slug: 'climate-beetle-protection',
    title: 'Climate Protection from Spruce Beetles',
    blurb: 'Level to which climate protects against spruce beetle outbreaks',
    tags: ['Climate', 'Terrestrial'],
  },
  {
    slug: 'landfast-sea-ice',
    title: 'Landfast Sea Ice Extent',
    blurb:
      'Historical daily landfast ice extent information for the Alaska coastline',
    tags: ['Cryosphere', 'Sea Ice'],
  },
  {
    slug: 'sea-ice-concentration',
    title: 'Sea Ice Concentration',
    blurb:
      'Monthly pan-Arctic sea ice concentration data at a resolution of approximately 17.1km for years 1850–2021',
    tags: ['Cryosphere', 'Sea Ice'],
  },
  {
    slug: 'notebook-sea-ice-traffic',
    title: 'Marine Vessel Traffic and Sea Ice Concentration',
    blurb:
      'Learn how to combine Arctic marine vessel traffic with historical sea ice concentration data',
    tags: ['Cryosphere', 'Programming', 'Sea Ice'],
  },
  {
    slug: 'places-and-polygons',
    title: 'Places & Polygons: Geographic Lenses for Arctic Data',
    blurb:
      'Explore how ARDAC uses geographic vector data to provide data extractions for communities, parks, wildlife refuges, fire management zones, and more.',
    tags: ['GIS'],
    image: 'places-polygons.jpg',
    imageAlt: 'Map showing vector data.',
  },
  {
    slug: 'hydrology-evap',
    title: 'Evapotranspiration',
    blurb: 'Monthly sum of daily evapotranspiration',
    tags: ['Hydrology'],
  },
  {
    slug: 'hydrology-glacier-melt',
    title: 'Glacier Melt',
    blurb: 'Monthly sum of daily glacier ice melt',
    tags: ['Hydrology'],
    image: 'glacier-melt_mick-kirchman-unsplash.jpg',
    imageAlt:
      'Photo of a melting tidewater glacier.  Image by Mick Kirchman at Unsplash.',
  },
  {
    slug: 'hydrology-iswe',
    title: 'Ice/Snow Water Equivalent',
    blurb: 'Monthly maximum daily ice and snow water equivalent',
    tags: ['Hydrology'],
  },
  {
    slug: 'hydrology-runoff',
    title: 'Runoff',
    blurb: 'Monthly sum of daily surface runoff',
    tags: ['Hydrology'],
  },
  {
    slug: 'hydrology-sm',
    title: 'Soil Moisture',
    blurb: 'Monthly mean of daily soil moisture in layers 1-3',
    tags: ['Hydrology'],
  },
  {
    slug: 'hydrology-snow-melt',
    title: 'Snow Melt',
    blurb: 'Monthly sum of daily snowmelt',
    tags: ['Hydrology'],
  },
  {
    slug: 'lightning-climatology',
    title: 'Lightning climatology',
    blurb: 'Daily number of lightning strikes in 20km grid boxes',
    tags: ['Lightning', 'Terrestrial', 'Wildfire'],
  },
  {
    slug: 'permafrost-magt',
    title: 'Ground Temperature',
    blurb: 'Mean annual ground temperature value, surface - 5m',
    tags: ['Permafrost'],
    image: 'projected-permafrost-and-magt.png',
    imageAlt:
      'Example map of data showing projected ground temperature at 1m depth',
  },
  {
    slug: 'permafrost-base-top',
    title: 'Permafrost Depth: Base & Top',
    blurb: '',
    tags: ['Permafrost'],
    image: 'permafrost-soil-pit_skip-walker_USPA.jpg',
    imageAlt: 'Image of visible permafrost in a soil pit by Skip Walker, USPA',
  },
  {
    slug: 'permafrost-talik',
    title: 'Talik Thickness',
    blurb: 'Thickness of permafrost talik layer',
    tags: ['Permafrost'],
  },
  {
    slug: 'map-permafrost',
    title: 'Maps of Permafrost Research',
    blurb:
      'Statewide maps from prior research efforts to locate and classify permafrost in Alaska',
    tags: ['Permafrost'],
  },
  {
    slug: 'notebook-perm-obs-temp',
    title: 'Combining Permafrost Observations with Climate Data',
    blurb:
      'Code example of how to combine sampled permafrost and modeled historical monthly temperature data',
    tags: ['Permafrost', 'Climate', 'Programming'],
  },
  {
    slug: 'indicator-r10mm',
    title: 'Heavy Precipitation Days',
    blurb: 'Number of days with ≥ 10mm precipitation',
    tags: ['Precipitation'],
  },
  {
    slug: 'indicator-cwd',
    title: 'Consecutive wet days',
    blurb: 'Number of the most consecutive days with precipitation > 1 mm',
    tags: ['Precipitation'],
  },
  {
    slug: 'indicator-cdd',
    title: 'Consecutive dry days',
    blurb: 'Number of the most consecutive days with precipitation < 1 mm',
    tags: ['Precipitation'],
  },
  {
    slug: 'precipitation-2km-cmip5',
    title: 'Precipitation, 2km',
    blurb: 'Annual means, decadal means up to monthly temporal resolution',
    tags: ['Precipitation'],
  },
  {
    slug: 'precipitation-frequency',
    title: 'Precipitation Frequency',
    blurb:
      'Precipitation frequency for various return intervals and durations across different models and eras',
    tags: ['Precipitation'],
    image: 'precip_ben-wicks-unsplash.jpg',
    imageAlt: 'Image of water splashing by Ben Wicks on Unsplash',
  },
  {
    slug: 'indicator-rx1day',
    title: 'Maximum 1-day Precipitation',
    blurb: 'Maximum precipitation in a single calendar year.',
    tags: ['Precipitation', 'Climate'],
  },
  {
    slug: 'indicator-rx5day',
    title: 'Maximum 5–day precipitation',
    blurb: 'Maximum precipitation total for any 5-day period',
    tags: ['Precipitation', 'Climate'],
  },
  {
    slug: 'notebook-design-discharge',
    title: 'Design Discharge',
    blurb:
      'Learn how to calculate a design discharge value via the Rational Method',
    tags: ['Precipitation', 'Climate', 'Programming'],
  },
  {
    slug: 'notebook-precip-poly',
    title: 'Daily Precipitation Summary, By Polygon',
    blurb:
      "Demonstration of fetching a polygon of interest and then using this polygon's bounding box to subset Daymet daily precipitation data",
    tags: ['Precipitation', 'Programming'],
  },
  {
    slug: 'temperature-cmip5',
    title: 'Temperature, CMIP5',
    blurb:
      'Historical and projected temperatures at various temporal and spatial resolutions',
    tags: ['Temperature'],
  },
  {
    slug: 'temperature-cmip6',
    title: 'Temperature, CMIP6',
    blurb:
      'Monthly model outputs for min/mean/max near-surface air temperature',
    tags: ['Temperature', 'CMIP6'],
  },
  {
    slug: 'notebook-era5-cds-api',
    title: 'ERA5 access via the CDS API',
    blurb: 'Learn to download ERA5 data via Python programming',
    tags: ['Temperature', 'Programming'],
  },
  {
    slug: 'elevation',
    title: 'Elevation',
    blurb: 'ASTER GDEM elevation data for Alaska and Western Canada',
    tags: ['Terrestrial'],
  },
  {
    slug: 'notebook-fmz-flammability',
    title: 'Modeled Flammability by Fire Management Zone',
    blurb:
      'Demonstration of how to query fire management zone polygons and modeled flammability within those polygons',
    tags: ['Terrestrial', 'Programming'],
  },
  {
    slug: 'alfresco-flammability',
    title: 'Flammability',
    blurb: 'Modeled flammability derived from ALFRESCO simulations',
    tags: ['Wildfire', 'Terrestrial'],
  },
  {
    slug: 'alfresco-vegetation',
    title: 'Vegetation Type',
    blurb: 'Modeled vegetation type derived from ALFRESCO simulations',
    tags: ['Wildfire', 'Terrestrial'],
  },
  {
    slug: 'wildfire-combined',
    title: 'Wildfire',
    blurb:
      'Access to near-real-time, historical, and model output relevant to Alaska wildfires',
    tags: ['Wildfire', 'Terrestrial'],
  },
  {
    slug: 'wind-cmip6',
    title: 'Wind, CMIP6',
    blurb:
      'Monthly model outputs for mean near-surface wind speed, near-surface eastward wind speed, and near-surface northward wind speed',
    tags: ['Wind', 'CMIP6'],
  },
  {
    slug: 'oceanography-cmip6',
    title: 'Oceanography, CMIP6',
    blurb:
      'Monthly model outputs for mean sea level pressure and surface temperature',
    tags: ['Oceanography', 'CMIP6'],
  },
  {
    slug: 'precipitation-cmip6',
    title: 'Precipitation, CMIP6',
    blurb: 'Monthly model outputs for total precipitation',
    tags: ['Precipitation', 'CMIP6'],
  },
  {
    slug: 'evaporation-cmip6',
    title: 'Evaporation, CMIP6',
    blurb:
      'Monthly model outputs for total evaporation, including sublimation and transpiration',
    tags: ['Climate', 'CMIP6'],
  },
  {
    slug: 'solar-radiation-cloud-cover-cmip6',
    title: 'Solar Radiation & Cloud Cover, CMIP6',
    blurb:
      'Monthly model outputs for mean downwelling shortwave and longwave fluxes, surface upward sensible and latent heat fluxes, and cloud area fraction',
    tags: ['Solar Radiation', 'CMIP6'],
  },
  {
    slug: 'sea-ice-cmip6',
    title: 'Sea Ice Concentration, CMIP6',
    blurb: 'Sea ice fraction',
    tags: ['Sea Ice', 'CMIP6', 'Cryosphere'],
  },
  {
    slug: 'snow-cmip6',
    title: 'Snow, CMIP6',
    blurb: 'Snow amount, snowfall flux and surface snow thickness',
    tags: ['Cryosphere', 'Snow', 'CMIP6'],
  },
  {
    slug: 'indicator-ftc-cmip6',
    title: 'Freeze/Thaw Cycle, CMIP6',
    blurb:
      'Annual count of days with low temperature below freezing and high temps above freezing',
    tags: ['Climate', 'CMIP6'],
    image: 'freeze-thaw_ilona-frey-unsplash.jpg',
    imageAlt:
      'Photo of icicles demonstrating a freeze/thaw cycle.  Photo by Ilona Frey on Unsplash.',
  },
  {
    slug: 'indicator-su-cmip6',
    title: 'Summer Days, CMIP6',
    blurb: 'Annual count when daily max temperature (threshold) >25°C',
    tags: ['Climate', 'CMIP6'],
  },
  {
    slug: 'indicator-dw-cmip6',
    title: 'Deep Winter Days, CMIP6',
    blurb: 'Annual count when daily min temperature (threshold) <-30°C',
    tags: ['Climate', 'CMIP6'],
  },
  {
    slug: 'indicator-rx1day-cmip6',
    title: 'Maximum 1-day Precipitation, CMIP6',
    blurb: 'Maximum precipitation in a single calendar year.',
    tags: ['Precipitation', 'Climate', 'CMIP6'],
  },
  {
    slug: 'story-climate-stripes-1',
    title: 'Climate Stripes: Understanding Variability and Scale',
    blurb:
      'Climate stripes are a powerful climate data visualization both for understanding your local environment, and understanding how scale impacts climate variability.',
    tags: ['Climate', 'Terrestrial', 'Temperature'],
    image: 'ClimateStripes_Arctic_2022.jpg',
  },
  {
    slug: 'story-climate-stripes-2',
    title: 'Climate Stripes: What Might the Future Hold?',
    blurb:
      'Combining historical data with climate model projections to visualize possible futures using climate stripes.',
    tags: ['Climate', 'Terrestrial', 'Temperature'],
    image: 'climate-stripes-generator.png',
  },
  {
    slug: 'story-beetle-climate-protection',
    title: 'Beetle Risk Data Story',
    blurb:
      'Learn about the lifecycle of spruce beetles and how the climate protects against outbreaks.',
    tags: ['Climate', 'Terrestrial'],
  },
  {
    slug: 'summary-landfast-sea-ice',
    title: 'Summarized Landfast Sea Ice',
    image: 'ARC18_Landfast_Fig2.jpg',
    blurb:
      'A summary and interactive map for exploring the seaward landfast ice edge (SLIE) for the Beaufort Sea region.',
    tags: ['Sea Ice', 'Cryosphere'],
  },
  {
    slug: 'story-climate-indicators',
    title: 'Climate Indicators: Making More Meaning from Data',
    blurb:
      'Climate indicators summarize complex climate data and create connections between climate data and the human experience.',
    tags: ['Climate', 'Temperature'],
  },
] satisfies Item[]
