interface Item {
  slug: Slug
  title: string
  blurb: string
  tags: Tag[]
  image?: string
  imageAlt?: string
  priority?: number
}

interface Bio {
  person: Person
  image: string
  blurb: string
}
type BioValue = Bio | undefined

interface Community {
  id: string
  name: string
  alt_name?: string
  region: string
  country: string
  latitude: number
  longitude: number
  type: string
  is_coastal?: number
  ocean_lat1?: number
  ocean_lon1?: number
}

type CommunityValue = Community | undefined

interface MapLayer {
  id: string
  title: string
  subtext?: string
  source?: 'rasdaman' | undefined
  wmsLayerName: string
  style: string
  default?: boolean
  legend: string
  rasdamanConfiguration?: any
  coastline?: boolean
  bbox?: number[]
}

interface MapLayerInstance {
  mapId: string
  layer: MapLayer
}

interface LegendItem {
  color: string
  label: string
}

interface LatLng {
  lat: number
  lng: number
}

interface HydrologyChartLabels {
  models: Record<string, string>
  scenarios: Record<string, string>
  months: Record<string, string>
}

interface HydrologyChartInputs {
  model: string
  scenario: string
  month: string
}

interface PermafrostChartLabels {
  scenarios: Record<string, string>
}

interface PermafrostChartInputs {
  scenario: string
}

interface IndicatorsCmip6ChartLabels {
  models: Record<string, string>
  scenarios: Record<string, string>
}

interface IndicatorsCmip6ChartInputs {
  model: string
  scenario: string
}

interface Cmip6MonthlyChartLabels {
  models: Record<string, string>
  scenarios: Record<string, string>
  months: Record<string, string>
}

interface Cmip6MonthlyChartInputs {
  model: string
  scenario: string
  month: string
}

interface Cmip6DownscaledChartLabels {
  models: Record<string, string>
  scenarios: Record<string, string>
  baselineYears: Record<string, string>
  projectedYears: Record<string, string>
}

interface Cmip6DownscaledChartInputs {
  model: string
  scenario: string
  baselineYear: string
  projectedYear: string
}

interface CuspObservation {
  cusp_obs_id: string | null
  source: string | null
  site_id: string | null
  observation_date: string | null
  obs_month: number | null
  method: string | null
  method_label: string | null
  pf_observed: number | null
  pf_observed_label: string | null
  thaw_depth_cm: number | null
  pf_depth_cm: number | null
  obs_limit_cm: number | null
  has_thaw_depth: boolean | null
  has_pf_depth: boolean | null
  has_obs_limit: boolean | null
  quality_flags: string | null
}

interface CuspObservationFeature {
  type: 'Feature'
  id: string
  geometry: {
    type: 'Point'
    coordinates: [number, number]
  }
  geometry_name: 'geom'
  properties: CuspObservation
}

interface CuspObservationFeatureCollection {
  type: 'FeatureCollection'
  features: CuspObservationFeature[]
  totalFeatures: number
  numberMatched: number
  numberReturned: number
  timeStamp: string
}

type LatLngValue = LatLng | undefined

type PlaceType = 'community' | 'latLng' | undefined

type HydrologyChartLabelsObj = HydrologyChartLabels | undefined
type HydrologyChartInputsObj = HydrologyChartInputs | undefined

type PermafrostChartLabelsObj = PermafrostChartLabels | undefined
type PermafrostChartInputsObj = PermafrostChartInputs | undefined

type IndicatorsCmip6ChartLabelsObj = IndicatorsCmip6ChartLabels | undefined
type IndicatorsCmip6ChartInputsObj = IndicatorsCmip6ChartInputs | undefined

type Cmip6MonthlyChartLabelsObj = Cmip6MonthlyChartLabels | undefined
type Cmip6MonthlyChartInputsObj = Cmip6MonthlyChartInputs | undefined

type Cmip6DownscaledChartLabelsObj = Cmip6DownscaledChartLabels | undefined
type Cmip6DownscaledChartInputsObj = Cmip6DownscaledChartInputs | undefined
