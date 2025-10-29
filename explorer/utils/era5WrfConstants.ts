/**
 * Shared constants for ERA5-WRF
 */

export const ERA5_WRF_CONFIG = {
  endpoint: 'era5wrf',
  fireEndpoint: 'era5wrf-fire',
  defaultYear: '2004',
  defaultClimatologyPeriod: '1960-1989',
  availableYears: {
    start: 1960,
    end: 2023,
  },
} as const

export const ERA5_CLIMATOLOGY_PERIODS = {
  '1960-1989': {
    label: '1960-1989',
    start: 1960,
    end: 1989,
  },
  '1990-2019': {
    label: '1990-2019',
    start: 1990,
    end: 2019,
  },
} as const

export const ERA5_SEASONS = {
  fireSeasonDates: {
    start: '03-15', //earliest official start of fire season for AK
    end: '10-15',
  },
} as const

export const CHART_CONFIG = {
  plotlyOptions: {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: [
      'zoom2d',
      'pan2d',
      'select2d',
      'lasso2d',
      'zoomIn2d',
      'zoomOut2d',
      'autoScale2d',
      'resetScale2d',
    ] as any[],
  },
  layout: {
    margin: { t: 80, b: 120 },
    legend: {
      x: 0,
      y: -0.35,
      xanchor: 'left' as const,
      yanchor: 'top' as const,
      orientation: 'h' as const,
    },
  },
} as const

// Alias for backward compatibility
export const ERA5_WRF_CHART_CONFIG = CHART_CONFIG

/**
 * Generate available years array from config
 */
export const getAvailableYears = () => {
  const { start, end } = ERA5_WRF_CONFIG.availableYears
  return Array.from({ length: end - start }, (_, i) => start + i)
}

export const ERA5_WRF_VARIABLES = [
  {
    key: 't2_max',
    label: 'Daily Max 2 m Temperature',
    unit: '°C',
    category: 'Temperature',
    description: 'Daily maximum 2-meter air temperature.',
    color: '#d62728',
    climatologyBand: 'rgba(214,39,40,0.1)',
    chartType: 'line',
  },
  {
    key: 't2_mean',
    label: 'Daily Mean 2 m Temperature',
    unit: '°C',
    category: 'Temperature',
    description: 'Daily mean 2-meter air temperature.',
    color: '#ff7f0e',
    climatologyBand: 'rgba(255,127,14,0.1)',
    chartType: 'line',
  },
  {
    key: 't2_min',
    label: 'Daily Min 2 m Temperature',
    unit: '°C',
    category: 'Temperature',
    description: 'Daily minimum 2-meter air temperature.',
    color: '#9467bd',
    climatologyBand: 'rgba(148,103,189,0.1)',
    chartType: 'line',
  },
  {
    key: 'rh2_max',
    label: 'Daily Max 2 m Relative Humidity',
    unit: '%',
    category: 'Humidity',
    description: 'Daily maximum 2-meter relative humidity.',
    color: '#1f77b4',
    climatologyBand: 'rgba(31,119,180,0.1)',
    chartType: 'line',
  },
  {
    key: 'rh2_mean',
    label: 'Daily Mean 2 m Relative Humidity',
    unit: '%',
    category: 'Humidity',
    description: 'Daily mean 2-meter relative humidity.',
    color: '#17becf',
    climatologyBand: 'rgba(17,190,207,0.1)',
    chartType: 'line',
  },
  {
    key: 'rh2_min',
    label: 'Daily Min 2 m Relative Humidity',
    unit: '%',
    category: 'Humidity',
    description: 'Daily minimum 2-meter relative humidity.',
    color: '#2ca02c',
    climatologyBand: 'rgba(44,160,44,0.1)',
    chartType: 'line',
  },
  {
    key: 'rainnc_sum',
    label: 'Daily Total Precipitation',
    unit: 'mm',
    category: 'Precipitation',
    description: 'Daily total precipitation (liquid and solid).',
    color: '#8c564b',
    climatologyBand: 'rgba(140,86,75,0.1)',
    chartType: 'bar',
  },
  {
    key: 'wspd10_max',
    label: 'Daily Max 10 m Wind Speed',
    unit: 'm s^-1',
    category: 'Wind',
    description: 'Daily maximum 10-meter wind speed.',
    color: '#bcbd22',
    climatologyBand: 'rgba(188,189,34,0.1)',
    chartType: 'line',
  },
  {
    key: 'wspd10_mean',
    label: 'Daily Mean 10 m Wind Speed',
    unit: 'm s^-1',
    category: 'Wind',
    description: 'Daily mean 10-meter wind speed.',
    color: '#7f7f7f',
    climatologyBand: 'rgba(127,127,127,0.1)',
    chartType: 'line',
  },
  {
    key: 'wdir10_mean',
    label: 'Daily Mean 10 m Wind Direction',
    unit: 'degrees',
    category: 'Wind',
    description: 'Daily mean 10-meter wind direction.',
    color: '#e377c2',
    climatologyBand: 'rgba(227,119,194,0.1)',
    chartType: 'line',
  },
  {
    key: 'seaice_max',
    label: 'Daily Max Sea Ice Concentration',
    unit: 'fraction',
    category: 'Sea Ice',
    description: 'Daily maximum sea ice concentration.',
    color: '#17becf',
    climatologyBand: 'rgba(23,190,207,0.1)',
    chartType: 'line',
  },
] as const

// Chart colors derived from ERA5_WRF_VARIABLES
export const ERA5_WRF_CHART_COLORS = {
  temperature: ERA5_WRF_VARIABLES.find(v => v.key === 't2_max')!.color,
  humidity: ERA5_WRF_VARIABLES.find(v => v.key === 'rh2_min')!.color,
  temperatureBand: ERA5_WRF_VARIABLES.find(v => v.key === 't2_max')!
    .climatologyBand,
  humidityBand: ERA5_WRF_VARIABLES.find(v => v.key === 'rh2_min')!
    .climatologyBand,
} as const

export type Era5WrfVariableKey = (typeof ERA5_WRF_VARIABLES)[number]['key']
