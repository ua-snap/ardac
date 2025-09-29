/**
 * Shared constants for ERA5-WRF chart components
 */

export const ERA5_WRF_CONFIG = {
  endpoint: 'era5wrf',
  requestParams: '?vars=t2_max,rh2_min',
  defaultYear: '2004',
  defaultClimatologyPeriod: '1990-2019',
  seasonDates: {
    start: '03-15',
    end: '10-15',
  },
  availableYears: {
    start: 1960,
    end: 2024,
  },
} as const

export const CLIMATOLOGY_PERIODS = {
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

export const CHART_COLORS = {
  temperature: '#d62728',
  humidity: '#1f77b4',
  extremeHighlight: '#ff4444',
  temperatureBand: 'rgba(214,39,40,0.1)',
  humidityBand: 'rgba(31,119,180,0.1)',
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
      y: -0.25,
      xanchor: 'left' as const,
      yanchor: 'top' as const,
      orientation: 'h' as const,
    },
  },
} as const

/**
 * Generate available years array from config
 */
export const getAvailableYears = () => {
  const { start, end } = ERA5_WRF_CONFIG.availableYears
  return Array.from({ length: end - start }, (_, i) => start + i)
}
