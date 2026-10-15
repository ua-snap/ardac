export default [
  {
    slug: 'indicator-su',
    title: 'Summer Days',
    blurb:
      'Summer days are those that top 77°F (25°C). Maps and charts compare how often they came in 1980–2009 with mid- and late-century projections from two models and two emissions scenarios.',
    tags: ['Temperature'],
  },
  {
    slug: 'indicator-dw',
    title: 'Deep Winter Days',
    blurb:
      'Deep winter days are those that fall below −22°F (−30°C). Maps and charts compare how often they came in 1980–2009 with mid- and late-century projections from two models and two emissions scenarios.',
    tags: ['Temperature'],
  },
  {
    slug: 'indicator-hd',
    title: 'Hot Day Threshold',
    blurb:
      'The hot day threshold is the temperature that only five days a year exceed. Maps show how it may shift from the historical baseline to the end of the century.',
    tags: ['Temperature'],
  },
  {
    slug: 'indicator-cd',
    title: 'Cold Day Threshold',
    blurb:
      'The cold day threshold is the temperature that only five days a year fall below. Maps show how it may shift from the historical baseline to the end of the century.',
    tags: ['Temperature'],
  },
  {
    slug: 'indicator-wsdi',
    title: 'Warm Spell Duration Index',
    blurb:
      'The warm spell duration index counts runs of five or more days when the mean temperature stays above the 90th percentile for the date. Maps compare historical and projected values.',
    tags: ['Temperature'],
  },
  {
    slug: 'indicator-csdi',
    title: 'Cold Spell Duration Index',
    blurb:
      'The cold spell duration index counts runs of five or more days when the mean temperature stays below the 10th percentile for the date. Maps compare historical and projected values.',
    tags: ['Temperature'],
  },
  {
    slug: 'wet-days-per-year',
    title: 'Wet Days Per Year',
    blurb:
      'A "wet day" brings at least 1 mm of precipitation. Maps show the yearly count for 1980–2009 and for two future eras, downscaled for Alaska.',
    tags: ['Precipitation'],
  },

  {
    slug: 'dd-below-65',
    title: 'Degree Days Below 65°F',
    blurb:
      'Degree days below 65°F, also called heating degree days, estimate the energy needed to heat a building. Maps compare the historical norm with two future eras.',
    tags: ['Temperature'],
  },
  {
    slug: 'dd-below-0',
    title: 'Degree Days Below 0°F',
    blurb:
      'Degree days below 0°F measure the depth and duration of severe cold. Maps compare the historical norm with mid- and late-century projections.',
    tags: ['Temperature'],
  },
  {
    slug: 'thawing-index',
    title: 'Thawing Index',
    blurb:
      "The thawing index sums each year's degree days above freezing, a key figure in permafrost and foundation design. Use it to compute the design thawing index.",
    tags: ['Temperature'],
  },
  {
    slug: 'freezing-index',
    title: 'Freezing Index',
    blurb:
      "The freezing index sums each year's degree days below freezing, a measure engineers use to gauge frost penetration. Use it to compute frost depth and the design freezing index.",
    tags: ['Temperature'],
  },
  {
    slug: 'story-arctic-climate-data-node',
    title: 'Introducing the Arctic Climate Data Node',
    blurb:
      'The Arctic Climate Data Node at the University of Alaska Fairbanks gives researchers local access to CMIP6 global climate model data and the computing power to use it. Read how the node serves Arctic science, then browse the CMIP6 data it supplies.',
    tags: ['Story'],
    image: 'arctic2100_drew-beamer-unsplash.jpg',
    imageAlt:
      'Person holding a crystal ball up to an Arctic sunset.  Photo by Drew Beamer on Unsplash.',
    people: ['Scott Rupp', 'Bruce Crevensten'],
  },
  {
    slug: 'climate-beetle-protection',
    title: 'Climate Protection from Spruce Beetles',
    blurb:
      "Cold winters and cool summers hold spruce beetle outbreaks in check. This dataset rates how well the climate protects Alaska's spruce forests, today and through 2099, across models, emissions scenarios, and snowpack levels.",
    tags: ['Temperature', 'Snow'],
    people: ['Nancy Fresco', 'Kyle Redilla'],
  },
  {
    slug: 'landfast-sea-ice',
    title: 'Landfast Sea Ice Extent',
    blurb:
      'Landfast ice is sea ice anchored to the shore, vital to coastal ecosystems, travel, and hunting. Daily records trace its extent along the Beaufort and Chukchi coasts.',
    tags: ['Sea Ice', 'Observation'],
    people: ['Andy Mahoney', 'Hajo Eicken'],
  },
  {
    slug: 'sea-ice-concentration',
    title: 'Sea Ice Concentration',
    blurb:
      'Monthly sea ice concentration for the whole Arctic, reconstructed from historical records back to 1850 on a grid of about 17 km. Explore it further in the Historical Sea Ice Atlas.',
    tags: ['Sea Ice', 'Observation'],
    people: ['John Walsh'],
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
    blurb:
      'Evapotranspiration is the water returned to the air from soil, open water, and plants. This dataset sums it by month, from the historical period to late century.',
    tags: ['Hydrology'],
  },
  {
    slug: 'hydrology-glacier-melt',
    title: 'Glacier Melt',
    blurb:
      'This dataset sums glacier ice melt by month, from the historical period to late century.',
    tags: ['Hydrology'],
    image: 'glacier-melt_mick-kirchman-unsplash.jpg',
    imageAlt:
      'Photo of a melting tidewater glacier.  Image by Mick Kirchman at Unsplash.',
  },
  {
    slug: 'hydrology-iswe',
    title: 'Ice/Snow Water Equivalent',
    blurb:
      "Ice and snow water equivalent measure how much water glacier ice and snowpack would yield if melted. This dataset reports each month's maximum.",
    tags: ['Hydrology', 'Snow'],
  },
  {
    slug: 'hydrology-runoff',
    title: 'Runoff',
    blurb:
      'Surface runoff is the water that flows over land instead of soaking in. This dataset sums it by month, from the historical period to late century.',
    tags: ['Hydrology'],
  },
  {
    slug: 'hydrology-sm',
    title: 'Soil Moisture',
    blurb:
      'Modeled soil moisture for three soil layers, averaged by month from the historical period to late century.',
    tags: ['Hydrology'],
  },
  {
    slug: 'hydrology-snow-melt',
    title: 'Snow Melt',
    blurb:
      'Snowmelt marks when and how fast the snowpack gives up its water. This dataset sums it by month, from the historical period to late century.',
    tags: ['Hydrology', 'Snow'],
  },
  {
    slug: 'permafrost-magt',
    title: 'Ground Temperature',
    blurb:
      'Mean annual ground temperature, from the surface to 5 m deep, shows where permafrost holds and where it nears thaw. Maps cover three eras, with projections from two models.',
    tags: ['Permafrost'],
    image: 'projected-permafrost-and-magt.png',
    imageAlt:
      'Example map of data showing projected ground temperature at 1m depth',
  },
  {
    slug: 'permafrost-base-top',
    title: 'Permafrost Depth: Base & Top',
    blurb:
      'Permafrost lies between a top and a base, and both move as the ground warms. Maps show the depth of each across three eras, with projections from two models.',
    tags: ['Permafrost'],
  },
  {
    slug: 'permafrost-talik',
    title: 'Talik Thickness',
    blurb:
      'A talik is a layer of unfrozen ground within or above permafrost; as it thickens, thaw advances. Maps show modeled talik thickness across three eras, with projections from two models.',
    tags: ['Permafrost'],
  },
  {
    slug: 'indicator-r10mm',
    title: 'Heavy Precipitation Days',
    blurb:
      'Heavy precipitation days bring 10 mm or more of rain or melted snow. Maps compare how often they came in 1980–2009 with projections for mid- and late century.',
    tags: ['Precipitation'],
  },
  {
    slug: 'indicator-cwd',
    title: 'Consecutive wet days',
    blurb:
      "Consecutive wet days is the year's longest run of days with at least 1 mm of precipitation. Maps compare historical and projected values.",
    tags: ['Precipitation'],
  },
  {
    slug: 'indicator-cdd',
    title: 'Consecutive dry days',
    blurb:
      "Consecutive dry days is the year's longest run of days with less than 1 mm of precipitation. Maps compare historical and projected values.",
    tags: ['Precipitation'],
  },
  {
    slug: 'precipitation-frequency',
    title: 'Precipitation Frequency',
    blurb:
      'How much rain might a 100-year storm bring? These estimates give precipitation depths for durations of an hour to 60 days and return intervals of 2 to 1,000 years, projected for three future eras.',
    tags: ['Precipitation'],
    image: 'precip_ben-wicks-unsplash.jpg',
    imageAlt: 'Image of water splashing by Ben Wicks on Unsplash',
  },
  {
    slug: 'indicator-rx1day',
    title: 'Maximum 1-day Precipitation',
    blurb:
      "The precipitation total of the year's wettest day. Maps compare historical and projected values.",
    tags: ['Precipitation'],
  },
  {
    slug: 'indicator-rx5day',
    title: 'Maximum 5–day precipitation',
    blurb:
      "The precipitation total of the year's wettest five-day stretch. Maps compare historical and projected values.",
    tags: ['Precipitation'],
  },
  {
    slug: 'temperature-cmip6-downscaled',
    title: 'Temperature, CMIP6 Downscaled',
    blurb:
      'Daily minimum and maximum air temperature from CMIP6 models, downscaled to 4 km for Alaska. Maps contrast 2000 with 2100, and charts compare daily values for any two years.',
    tags: ['Temperature'],
    people: ['Jeremy Littell', 'Craig Stephenson'],
  },
  {
    slug: 'precipitation-cmip6-downscaled',
    title: 'Precipitation, CMIP6 Downscaled',
    blurb:
      'Daily precipitation from CMIP6 models, downscaled to 4 km for Alaska. Maps contrast 2000 with 2100, and charts compare daily values for any two years.',
    tags: ['Precipitation'],
    people: ['Jeremy Littell', 'Craig Stephenson'],
  },
  {
    slug: 'temperature-cmip6',
    title: 'Temperature, CMIP6',
    blurb:
      'Monthly minimum, mean, and maximum air temperature from CMIP6 global climate models. Maps contrast 2000 with 2100.',
    tags: ['Temperature'],
  },
  {
    slug: 'elevation',
    title: 'Elevation',
    blurb:
      "Minimum, mean, and maximum elevation on a 1 km grid for Alaska and western Canada, drawn from NASA's ASTER global elevation model.",
    tags: ['GIS'],
  },
  {
    slug: 'alfresco-flammability',
    title: 'Flammability',
    blurb:
      'ALFRESCO, a wildfire and vegetation model, estimates how often each place burns across many simulations. Maps show flammability change over time.',
    tags: ['Wildfire'],
    people: ['Scott Rupp', 'Nancy Fresco'],
  },
  {
    slug: 'alfresco-vegetation',
    title: 'Vegetation Type',
    blurb:
      'ALFRESCO simulations project which vegetation, from tundra to spruce and deciduous forest, will dominate as climate and fire change. Maps show vegetation change over time.',
    tags: ['Wildfire'],
    people: ['Scott Rupp', 'Nancy Fresco'],
  },
  {
    slug: 'wind-cmip6',
    title: 'Wind, CMIP6',
    blurb:
      'Monthly near-surface wind speed, with its eastward and northward components, from CMIP6 global climate models. Maps contrast August 2000 with 2100.',
    tags: ['Wind'],
  },
  {
    slug: 'oceanography-cmip6',
    title: 'Oceanography, CMIP6',
    blurb:
      'Monthly sea level pressure and surface temperature from CMIP6 global climate models. Maps contrast August 2000 with 2100.',
    tags: ['Oceanography'],
  },
  {
    slug: 'precipitation-cmip6',
    title: 'Precipitation, CMIP6',
    blurb:
      'Monthly total precipitation from CMIP6 global climate models, mapped at 25-year intervals from 1950 to 2100.',
    tags: ['Precipitation'],
  },
  {
    slug: 'evaporation-cmip6',
    title: 'Evaporation, CMIP6',
    blurb:
      'Monthly total evaporation from CMIP6 global climate models, counting sublimation from snow and ice and transpiration from plants. Maps step from 1950 to 2100.',
    tags: ['Hydrology'],
  },
  {
    slug: 'solar-radiation-cloud-cover-cmip6',
    title: 'Solar Radiation & Cloud Cover, CMIP6',
    blurb:
      'Monthly incoming sunlight and longwave radiation, surface heat fluxes, and cloud cover from CMIP6 global climate models; together they trace the surface energy budget.',
    tags: ['Solar Radiation'],
  },
  {
    slug: 'sea-ice-cmip6',
    title: 'Sea Ice Concentration, CMIP6',
    blurb:
      'The share of the ocean covered by sea ice, by month, from CMIP6 global climate models. Maps step from 1950 to 2100.',
    tags: ['Sea Ice'],
  },
  {
    slug: 'snow-cmip6',
    title: 'Snow, CMIP6',
    blurb:
      'Monthly snowfall, snow water equivalent, and snow depth from CMIP6 global climate models. Maps step from 1950 to 2100.',
    tags: ['Snow', 'Precipitation'],
  },
  {
    slug: 'indicator-ftc-cmip6',
    title: 'Freeze/Thaw Cycle, CMIP6',
    blurb:
      'Freeze/thaw days climb above freezing by day and drop to it or below by night, a swing that is hard on roads and buildings. CMIP6 projections cover ten models and four emissions scenarios.',
    tags: ['Temperature'],
    image: 'freeze-thaw_ilona-frey-unsplash.jpg',
    imageAlt:
      'Photo of icicles demonstrating a freeze/thaw cycle.  Photo by Ilona Frey on Unsplash.',
  },
  {
    slug: 'indicator-su-cmip6',
    title: 'Summer Days, CMIP6',
    blurb:
      'Summer days are those that top 77°F (25°C). CMIP6 climate model output projects summer days by decade across ten models and four emissions scenarios.',
    tags: ['Temperature'],
  },
  {
    slug: 'indicator-dw-cmip6',
    title: 'Deep Winter Days, CMIP6',
    blurb:
      'Deep winter days are those that fall below −22°F (−30°C). CMIP6 climate model output projects deep winter days by decade across ten models and four emissions scenarios.',
    tags: ['Temperature'],
  },
  {
    slug: 'indicator-rx1day-cmip6',
    title: 'Maximum 1-day Precipitation, CMIP6',
    blurb:
      "The precipitation total of the year's wettest day, projected by decade across ten CMIP6 models and four emissions scenarios.",
    tags: ['Precipitation'],
  },
  {
    slug: 'story-climate-stripes-1',
    title: 'Climate Stripes: Understanding Variability and Scale',
    blurb:
      'Climate stripes turn a run of yearly temperatures into bands of color, one stripe per year. This story looks closely at the graphic to show what it reveals about local variability and the effect of scale. Read on, then make your own in part two.',
    tags: ['Temperature', 'Story'],
    image: 'ClimateStripes_Arctic_2022.jpg',
    people: ['Mike DeLue'],
  },
  {
    slug: 'story-climate-stripes-2',
    title: 'Climate Stripes: What Might the Future Hold?',
    blurb:
      'Climate stripes can look forward as well as back. This story joins historical data with model projections to picture several possible futures. Enter a community or coordinates north of 50.5° latitude to make stripes of your own.',
    tags: ['Temperature', 'Story'],
    image: 'climate-stripes-generator.png',
  },
  {
    slug: 'story-beetle-climate-protection',
    title: 'Beetle Risk Data Story',
    blurb:
      "Spruce beetle outbreaks have swept Alaska's forests in recent decades, and climate impacts the beetles' life cycle. This story explains how warm summers speed their growth and cold winters check it. Read it, then learn about climate protection ratings for your area.",
    tags: ['Temperature', 'Snow', 'Story'],
    people: ['Nancy Fresco'],
  },
  {
    slug: 'summary-landfast-sea-ice',
    title: 'Summarized Landfast Sea Ice',
    image: 'ARC18_Landfast_Fig2.jpg',
    blurb:
      'An interactive map summarizes the seaward edge of landfast ice in the Beaufort Sea, month by month, over three nine-year periods since 1996. Pick a month and period to see how far the ice reached and how that reach has changed.',
    tags: ['Sea Ice', 'Observation'],
    people: ['Hajo Eicken', 'Andy Mahoney'],
  },
  {
    slug: 'story-climate-indicators',
    title: 'Climate Indicators: Making More Meaning from Data',
    blurb:
      'Climate indicators distill vast climate data into more tangible metrics, such as the number of days a year below freezing. This story explains how indicators are built and why they matter. Read it, then explore the climate indicators for your region.',
    tags: ['Temperature', 'Precipitation', 'Story'],
    image: 'climate-indicators_jean-carlo-emer-unsplash.jpg',
    imageAlt:
      'Black-and-white photo of a weather station with domes and antennas on a snowy mountain ridge, by Jean Carlo Emer on Unsplash',
  },
  {
    slug: 'era5-wrf-xray',
    title: 'ERA5-WRF: High Resolution Dynamically Downscaled Reanalysis',
    blurb:
      'Daily temperature, humidity, precipitation, and wind from 1960 to 2023, reconstructed on a 4 km grid for Alaska and adjacent Canada. An API supports automated access for many locations.',
    tags: ['Temperature', 'Precipitation', 'Humidity', 'Wind'],
    people: ['Chris Waigl', 'Charlie Parr', 'Peter Bieniek'],
  },
  {
    slug: 'story-cmip6-downscaled',
    title: 'CMIP6: Increasing Resolution Through Downscaling',
    blurb:
      'Global climate models see Alaska in coarse 100 km blocks. This story explains how statistical and dynamical downscaling sharpen the picture to 4 km, and what the finer grid can show. Read on, then explore the downscaled temperature and precipitation data.',
    tags: ['Temperature', 'Story'],
    image: 'story-cmip6-downscaled.png',
    people: ['Jeremy Littell', 'Craig Stephenson', 'Josh Paul'],
  },
  {
    slug: 'story-fire-prone-conditions',
    title: 'Fire-Prone Conditions in Alaska',
    blurb:
      "Hot, dry, rainless days prime Alaska's forests to burn. This story traces those conditions through 2004, the state's largest fire season on record, using high-resolution reanalysis. Choose a place and any year from 1960 to 2023 to see how it compares.",
    tags: ['Wildfire', 'Temperature', 'Humidity', 'Precipitation', 'Story'],
    image: 'story-fire-prone-conditions.png',
    people: ['Chris Waigl', 'Charlie Parr'],
  },
  {
    slug: 'story-cold-snap-1989',
    title: '1989 Alaska Cold Snap',
    blurb:
      'In late January 1989, Interior Alaska fell to −50°F and below, jelling heating oil and grounding planes. This story recounts the cold snap and shows how high-resolution reanalysis data raise new questions about extreme weather. Read it, then compare how communities fared.',
    tags: ['Temperature', 'Wind', 'Story'],
    image: 'story-cold-snap-1989.png',
    imageAlt: 'Preview image for the 1989 Alaska Cold Snap data story',
    people: ['Anjali Shah', 'Rick Thoman', 'Charlie Parr'],
  },
  {
    slug: 'cusp-permafrost-observations',
    title: 'CUSP: CommUnity near-Surface Permafrost Observations',
    blurb:
      'CUSP gathers observations of near-surface permafrost, active-layer depth, and thaw into one documented table with source citations. Download observations near a selected area, or download the full dataset.',
    tags: ['Permafrost', 'Observation'],
    image: 'permafrost-soil-pit_skip-walker_USPA.jpg',
    imageAlt: 'Preview image for CUSP',
    people: ['Jon Schwenk', 'Bruce Crevensten', 'Charlie Parr', 'Josh Paul'],
  },
] satisfies Item[]
