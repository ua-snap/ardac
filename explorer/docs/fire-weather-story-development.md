# Fire-weather story development record

Checked 2026-09-17. This record documents the evidence and decisions behind
`story-fire-prone-conditions`.

## Existing ARDAC patterns examined

- `components/global/StoryFireProneConditions.vue`: the previous story used
  ERA5-WRF temperature, humidity, and precipitation with a custom hot/dry
  heuristic. It established the slug and preview asset but did not use the
  required `/fire_weather/` endpoint.
- `components/global/StoryColdSnap1989.vue`: representative long-form story
  with explanatory text, reusable charts, citations, and contributor bios.
- `components/global/StoryClimateIndicators.vue`: story-level control and
  chart composition.
- `components/global/StoryCmip6Downscaled.vue`: model-comparison narrative and
  ARDAC map conventions.
- `components/Gimme.vue`: canonical community/coordinate selection pattern.
- `components/GetAndUseData.vue`: canonical API and source-data access block.
- `stores/data.ts`: shared point-query state, error handling, and runtime API
  base URL.
- `plugins/plotly.client.ts` and existing chart components: Plotly lifecycle
  and responsive chart configuration.
- `assets/items.ts`, `types/slugs.d.ts`, and `nuxt.config.ts`: registry,
  slug, preview, and prerender requirements. The existing slug was retained.
- `tests/test-suite.spec.js`: route-through-tag Playwright pattern.

## Authoritative API investigation

Authoritative entry point:
`https://earthmaps.io/fire_weather/`.

Routes exercised:

- `/fire_weather/point/{lat}/{lon}/{start}/{end}?op=summer_fire_danger_rating_days`
- `/fire_weather/point/{lat}/{lon}/{start}/{end}?op=7_day_rolling_average&vars={variable}`
- `/fire_weather/area/{place_id}/{start}/{end}` was documented and its server
  implementation inspected, but the story uses point queries.
- CSV output is available with `format=csv`.

Response structures:

- Danger-day responses are keyed by year range, variable, model, and danger
  class. Values are mean June-August days per year, rounded separately to whole
  days.
- Rolling responses are keyed by year range, variable, model, month-day, and
  `min`/`mean`/`max`. These summarize centered rolling values across the
  selected years.

Variables are unitless Canadian Forest Fire Weather Index System codes and
indices:

- Fine Fuel Moisture Code (`ffmc`)
- Duff Moisture Code (`dmc`)
- Drought Code (`dc`)
- Initial Spread Index (`isi`)
- Buildup Index (`bui`)
- Fire Weather Index (`fwi`)

Coverage metadata was inspected directly from the Rasdaman `cmip6_fwi`
coverage:

- CRS: WGS 84 / EPSG:4326.
- Grid spacing: 0.25 degrees.
- Domain: North American boreal ecoregion within an outer grid envelope of
  -177.125 to -34.875 longitude and 34.875 to 79.375 latitude. Grid extent is
  not equivalent to valid-data coverage.
- Dates: 1980-04-01 through 2099-10-31, April through October only, no-leap
  calendar.
- Models: CNRM-CM6-1-HR, EC-Earth3-Veg, MPI-ESM1-2-HR, MRI-ESM2-0, and ERA5.
- Climate model scenarios: historical followed by SSP5-8.5. ERA5 supplies the
  historical reanalysis baseline through 2020.
- The source is a static USGS release; no update frequency is published.

Important discrepancies and edge cases:

- The API landing page says coverage extends through 2100, while the live
  coverage ends in 2099. A request ending in 2100 returned HTTP 503. The story
  therefore ends comparisons in 2099.
- The API page and coverage metadata cite USGS DOI `10.5066/P1AAMRUF`.
  DataCite marks that record as superseded by `10.5066/P1DEMGYZ`,
  “Calculation of CFFDRS Fire Weather Indices in Boreal North America Using
  Bias-Corrected CMIP6” (2026). The story links the current DOI.
- A point outside the valid boreal mask returned HTTP 404 even when it was
  inside the outer grid envelope. The UI explains this and offers another
  selection.
- The server computes rolling windows over the stored seasonal sequence. To
  ensure every displayed seven-day window is contained within one
  April-October season, April 1-3 and October 29-31 are omitted.
- Danger classes are rounded independently, so their stacked total can differ
  slightly from 92 summer days.

## Candidate story concepts

1. **Reconstruct the 2004 Taylor Complex with weather observations.** Engaging
   and locally relevant, but the required API exposes multi-year summaries
   rather than daily values for one observed year. Connecting the indices to
   fire growth would also require an authoritative fire-history dataset outside
   this task. Rejected.
2. **Show a single statewide late-century FWI increase.** Visually simple, but
   sampled data did not support a uniform increase and the point/area API does
   not expose a ready statewide surface. Rejected as scientifically misleading.
3. **Compare baseline and future danger-day counts at a selected place.**
   Supported directly by operational Alaska thresholds and the API. Useful, but
   annual counts alone hide seasonal timing. Retained as the first interactive
   view.
4. **Compare seasonal evolution of all six components.** Supported by rolling
   summaries and useful for seeing when model climatologies separate. Retained
   as the second interactive view.
5. **Make model disagreement the narrative rather than hiding it.** Supported
   by all sampled locations and compatible with ARDAC location selection and
   Plotly charts. Selected as the organizing concept.

## Evidence for the selected concept

Exploratory point queries compared 1980-2010 with 2070-2099. The implemented
story uses equal 30-year periods, 1981-2010 and 2070-2099.

High + very high + extreme FWI days per summer:

| Location   | ERA5 baseline | Four historical GCMs | Four late-century GCMs |
| ---------- | ------------: | -------------------- | ---------------------- |
| Fairbanks  |            27 | 29, 25, 26, 25       | 31, 24, 26, 11         |
| Tok        |            13 | 15, 12, 16, 12       | 18, 15, 13, 2          |
| McGrath    |             8 | 11, 8, 11, 9         | 17, 7, 13, 1           |
| Fort Yukon |            43 | 43, 41, 42, 42       | 53, 36, 43, 17         |

The same SSP5-8.5 pathway produces increases and decreases depending on model
and location. Component choice also matters. At Fairbanks, for example,
late-century FFMC high-or-worse counts ranged from 39 to 52 days while FWI
counts ranged from 11 to 31. This evidence motivated a story about conditional
projections, component meaning, baseline diagnostics, and model spread rather
than a predetermined claim of statewide increase.

## Design and implementation decisions

- Retained the existing slug and preview asset, but replaced the earlier
  ERA5-WRF heuristic with the authoritative CFFDRS data.
- Used the established `Gimme` community/coordinate selector,
  `GetAndUseData`, contributor bios, runtime API URL, Pinia data store, and
  Plotly plugin.
- Added the `fireWeather` endpoint mapping to the existing data store instead
  of creating a parallel client. Added keyed loading state so four concurrent
  requests can be represented correctly.
- Fixed `Gimme`'s error watcher to use the watched Boolean value. The prior
  code tested the computed-ref object itself and could report a failure after a
  successful request.
- Defaulted to FWI and 2070-2099, with controls for every supplied component and
  a 2040-2069 comparison.
- Used stacked danger-day bars so all five operational classes remain visible,
  rather than mapping raw counts as a choropleth.
- Used fixed, colorblind-distinguishable category colors and blue/orange
  historical/future envelopes. Missing data are handled as an explicit error,
  not a zero category.
- Seasonal envelopes show the minimum and maximum among four model
  climatologies, not confidence intervals. Text labels them as model ranges.
- Added preview alt text and a Playwright route/interaction test.
- Added no CSS or new styling rules.

## Questions for human scientific review

1. Confirm that the four future model series should continue to be described as
   SSP5-8.5 in public copy. This is explicit in live coverage metadata but not
   on the API landing page.
2. Confirm that the successor DOI `10.5066/P1DEMGYZ` should replace the
   superseded DOI on the API documentation.
3. Decide whether the API documentation should be corrected from 2100 to 2099,
   or whether a 2100 data ingest is planned.
4. Review the use of Alaska Fire Danger Operating Plan thresholds across the
   full Alaska boreal domain. The plan states that thresholds were developed
   primarily for Interior Alaska but can be applied statewide.
5. Confirm whether the existing preview photograph has a required credit or
   license statement; none is recorded in the repository.
6. Consider adding independent station or fire-history validation in a future
   story revision. This implementation intentionally does not infer fire
   occurrence or burned area from weather indices alone.

## Reproducibility and rollback

- API retrieval date: 2026-09-17.
- No source data were modified or checked into this repository.
- Reverting the story component, two fire-weather chart components, utility,
  endpoint mapping, metadata changes, test, and this record restores the prior
  ERA5-WRF story.
