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
  latitude: number
  longitude: number
  annotations?: ColdSnapAnnotation[]
}

export const COLD_SNAP_START_DATE = '1989-01-01'
export const COLD_SNAP_END_DATE = '1989-04-01'

export const COLD_SNAP_COMMUNITIES: ColdSnapCommunity[] = [
  {
    id: 'nome',
    name: 'Nome',
    latitude: 64.5107,
    longitude: -165.4447,
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
    latitude: 65.9797,
    longitude: -161.123,
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
    latitude: 64.8378,
    longitude: -147.716,
  },
  {
    id: 'ft-wainright',
    name: 'Ft. Wainright',
    latitude: 64.8278,
    longitude: -147.6429,
  },
  {
    id: 'northway',
    name: 'Northway',
    latitude: 62.9616,
    longitude: -141.937,
  },
  {
    id: 'galena',
    name: 'Galena',
    latitude: 64.7333,
    longitude: -156.927,
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
    latitude: 65.1719,
    longitude: -152.079,
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
    latitude: 61.1817,
    longitude: -149.993,
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
    latitude: 61.1369,
    longitude: -146.3471,
  },
  {
    id: 'cantwell',
    name: 'Cantwell',
    latitude: 63.3917,
    longitude: -148.951,
  },
  {
    id: 'deadhorse',
    name: 'Deadhorse',
    latitude: 70.2097,
    longitude: -148.418,
  },
  {
    id: 'ambler',
    name: 'Ambler',
    latitude: 67.0861,
    longitude: -157.851,
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
