export type ColdSnapAnnotationType = 'min' | 'max'

export interface ColdSnapAnnotation {
  type: ColdSnapAnnotationType
  valueF: number
  date?: string
  label: string
}

export interface ColdSnapCommunity {
  id: string
  name: string
  searchName: string
  latitude: number
  longitude: number
  chartId: string
  annotations?: ColdSnapAnnotation[]
}

export const COLD_SNAP_START_DATE = '1989-01-01'
export const COLD_SNAP_END_DATE = '1989-04-01'

export const COLD_SNAP_COMMUNITIES: ColdSnapCommunity[] = [
  {
    id: 'nome',
    name: 'Nome',
    searchName: 'Nome',
    latitude: 64.5107,
    longitude: -165.4447,
    chartId: 'cold-snap-nome',
    annotations: [
      {
        type: 'min',
        valueF: -54,
        date: '1989-01-27',
        label: 'Observed record low: −54°F',
      },
    ],
  },
  {
    id: 'buckland',
    name: 'Buckland',
    searchName: 'Buckland',
    latitude: 65.9797,
    longitude: -161.123,
    chartId: 'cold-snap-buckland',
    annotations: [
      {
        type: 'min',
        valueF: -50,
        label: 'Observed: −50°F',
      },
    ],
  },
  {
    id: 'fairbanks',
    name: 'Fairbanks',
    searchName: 'Fairbanks',
    latitude: 64.8378,
    longitude: -147.716,
    chartId: 'cold-snap-fairbanks',
  },
  {
    id: 'ft-wainright',
    name: 'Ft. Wainright',
    searchName: 'Fort Wainwright',
    latitude: 64.8278,
    longitude: -147.6429,
    chartId: 'cold-snap-ft-wainright',
  },
  {
    id: 'northway',
    name: 'Northway',
    searchName: 'Northway',
    latitude: 62.9616,
    longitude: -141.937,
    chartId: 'cold-snap-northway',
  },
  {
    id: 'galena',
    name: 'Galena',
    searchName: 'Galena',
    latitude: 64.7333,
    longitude: -156.927,
    chartId: 'cold-snap-galena',
    annotations: [
      {
        type: 'min',
        valueF: -70,
        date: '1989-01-27',
        label: 'Observed record low: −70°F',
      },
    ],
  },
  {
    id: 'tanana',
    name: 'Tanana',
    searchName: 'Tanana',
    latitude: 65.1719,
    longitude: -152.079,
    chartId: 'cold-snap-tanana',
    annotations: [
      {
        type: 'min',
        valueF: -76,
        date: '1989-01-27',
        label: 'Observed record low: −76°F',
      },
      {
        type: 'max',
        valueF: -40,
        label: '17 days with high ≤ −40°F',
      },
    ],
  },
  {
    id: 'anchorage',
    name: 'Anchorage',
    searchName: 'Anchorage',
    latitude: 61.1817,
    longitude: -149.993,
    chartId: 'cold-snap-anchorage',
    annotations: [
      {
        type: 'max',
        valueF: -19,
        date: '1989-01-28',
        label: 'Observed record low daily max: −19°F',
      },
    ],
  },
  {
    id: 'valdez',
    name: 'Valdez',
    searchName: 'Valdez',
    latitude: 61.1369,
    longitude: -146.3471,
    chartId: 'cold-snap-valdez',
  },
  {
    id: 'cantwell',
    name: 'Cantwell',
    searchName: 'Cantwell',
    latitude: 63.3917,
    longitude: -148.951,
    chartId: 'cold-snap-cantwell',
  },
  {
    id: 'deadhorse',
    name: 'Deadhorse',
    searchName: 'Deadhorse',
    latitude: 70.2097,
    longitude: -148.418,
    chartId: 'cold-snap-deadhorse',
  },
  {
    id: 'ambler',
    name: 'Ambler',
    searchName: 'Ambler',
    latitude: 67.0861,
    longitude: -157.851,
    chartId: 'cold-snap-ambler',
    annotations: [
      {
        type: 'max',
        valueF: -66,
        date: '1989-01-25',
        label: 'Observed record low daily max: −66°F',
      },
    ],
  },
]

export const COLD_SNAP_CHART_IDS = COLD_SNAP_COMMUNITIES.map(
  community => community.chartId
)
