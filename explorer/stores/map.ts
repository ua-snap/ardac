import { defineStore } from 'pinia'
const { $L } = useNuxtApp()
const config = useRuntimeConfig()

// Leaflet map objects, keys equal to ID of Leaflet map
const maps: { [index: string]: any } = {}

// Active layer Leaflet objects, keyed like `maps` var above
var layerObjects: { [index: string]: any } = {}

// Leaflet control (legend) objects, keyed like `maps` var above
var legendControls: { [index: string]: any } = {}

// Legend items for each map, keyed like `maps` var above.
var legendItems: { [index: string]: any } = {}

import {
  tileLayer,
  latLng,
  latLngBounds,
  type TileLayer,
  type MapOptions,
} from 'leaflet'

var coastlineLayer: TileLayer.WMS
var circumpolarPlaces: L.GeoJSON
var mask: TileLayer.WMS
var baseLayer: TileLayer | null
var southWest: LatLng
var northEast: LatLng
var viscosity = 0.0

function getBaseMapAndLayers(crs: string): MapOptions {
  let proj: any
  let resolutions: number[]
  let center: LatLng
  let zoom: number
  if (crs == 'EPSG:3572') {
    resolutions = [12000, 6000, 3000, 1500]
    zoom = 0
    center = latLng(90, 0)
    proj = new $L.Proj.CRS(
      'EPSG:3572',
      '+proj=laea +lat_0=90 +lon_0=-150 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
      {
        // Lower-left corner of GeoServer's gridset bounds for EPSG:3572
        origin: [-4889334.802954878, -4889334.802954878],
        resolutions: resolutions,
      }
    )

    baseLayer = null

    // EPSG:3572 has strange bounds. These values were determined by using
    // getBounds() on Leaflet's map object after loading a map in EPSG:3572,
    // then tweaking the latitude values until the maxBounds behaved as
    // expected. The maxBounds behavior isn't perfect, but maybe as good as it
    // gets for the EPSG:3572 projection.
    southWest = latLng(20, -15)
    northEast = latLng(20, 165)

    // Set viscosity to maximum because the map produces (harmless) JavaScript
    // errors if you drag too far outside the maxBounds. This prevents errors
    // vertically but not horizontally, but might be as good as it gets for
    // the EPSG:3572 projection.
    viscosity = 1.0
  } else {
    resolutions = [4096, 2048, 1024, 512, 256, 128, 64]
    zoom = 1
    center = latLng(64.7, -155)
    proj = new $L.Proj.CRS(
      'EPSG:3338',
      '+proj=aea +lat_1=55 +lat_2=65 +lat_0=50 +lon_0=-154 +x_0=0 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=m +no_defs',
      {
        // Lower-left corner of GeoServer's gridset bounds for EPSG:3338
        origin: [-4648005.934316417, 444809.882955059],
        resolutions: resolutions,
      }
    )
    baseLayer = tileLayer.wms(config.public.geoserverUrl, {
      transparent: true,
      crs: proj,
      format: 'image/png',
      version: '1.3.0',
      layers: 'atlas_mapproxy:alaska_osm_retina',
    })
    southWest = latLng(50.5, 155)
    northEast = latLng(64, -131)
  }

  const bounds = latLngBounds(southWest, northEast)

  // Map base configuration
  let layerConfig: MapOptions = {
    zoom: zoom,
    zoomSnap: 0.1,
    minZoom: 0,
    maxZoom: resolutions.length - 1,
    center: center,
    scrollWheelZoom: false,
    crs: proj,
    zoomControl: false,
    doubleClickZoom: false,
    attributionControl: false,
    maxBounds: bounds,
    maxBoundsViscosity: viscosity,
  }

  if (baseLayer) {
    layerConfig.layers = [baseLayer]
  }

  return layerConfig
}

export const useMapStore = defineStore('map', () => {
  // The active layer on each map
  const activeLayers: Ref<Record<string, MapLayer>> = ref({})

  // Create the Leaflet map object.
  // mapID = string corresponding to element ID.
  function create(mapId: string, crs: string) {
    maps[mapId] = $L.map(mapId, getBaseMapAndLayers(crs))
    new $L.Control.Zoom({ position: 'topright' }).addTo(maps[mapId])
  }

  function destroy(mapId: string) {
    if (maps[mapId]) {
      maps[mapId].remove()
    }
  }

  // `legends` is an object with keys corresponding to the name of the
  // legend to use for the layer, and values which is an array of legend items.
  function setLegendItems(
    mapId: string,
    legends: Record<string, LegendItem[]>
  ) {
    legendItems[mapId] = legends
  }

  // legendKey = the `legend` property in the definition of a MapLayer.
  function addLegend(mapId: string, legendKey: string) {
    // Legends must be provided by the component rendering
    // the map via the `setLegends` method.
    if (!legendItems[mapId]) {
      throw `Legend items not set for map ID '${mapId}' in mapStore`
    }

    // Remove the active map legend, if present
    if (legendControls[mapId]) {
      legendControls[mapId].remove()
    }

    legendControls[mapId] = new $L.Control({ position: 'topleft' })
    legendControls[mapId].onAdd = (map: L.Map) => {
      var div = $L.DomUtil.create('div', 'info legend')
      div.innerHTML = ''
      legendItems[mapId][legendKey].forEach((legendItem: LegendItem) => {
        div.innerHTML +=
          '<div class="legend-item"><div class="legend-swatch" style="background-color: ' +
          legendItem['color'] +
          ';"></div> ' +
          legendItem['label'] +
          '</div>'
      })
      return div
    }
    legendControls[mapId].addTo(maps[mapId])
  }

  function toggleLayer(layerObj: MapLayerInstance) {
    // Remove existing active layer, coastline, and mask from map
    if (layerObjects[layerObj.mapId]) {
      maps[layerObj.mapId].removeLayer(layerObjects[layerObj.mapId])
      if (
        circumpolarPlaces &&
        maps[layerObj.mapId]?.hasLayer(circumpolarPlaces)
      ) {
        maps[layerObj.mapId].removeLayer(circumpolarPlaces)
      }
      if (mask && maps[layerObj.mapId]?.hasLayer(mask)) {
        maps[layerObj.mapId].removeLayer(mask)
      }
      if (
        coastlineLayer != undefined &&
        maps[layerObj.mapId].hasLayer(coastlineLayer)
      ) {
        maps[layerObj.mapId].removeLayer(coastlineLayer)
      }
    }

    let layer = layerObj.layer
    let crs = maps[layerObj.mapId].options.crs.code

    // Add EPSG:3572 mask layer first to hide map artifacts before they load
    if (crs == 'EPSG:3572') {
      mask = tileLayer.wms(config.public.geoserverUrl, {
        transparent: true,
        format: 'image/png',
        layers: 'ardac:cmip6_mask',
        styles: 'ardac:cmip6_mask',
        zIndex: 20,
      })
      maps[layerObj.mapId]?.addLayer(mask)
    }

    let layerConfiguration = {
      transparent: true,
      format: 'image/png',
      version: '1.3.0',
      layers: layer.wmsLayerName,
      id: layer.id,
      styles: layer.style,
      ...layer.rasdamanConfiguration,
    }

    let wmsUrl =
      layer.source == 'rasdaman'
        ? config.public.rasdamanUrl
        : config.public.geoserverUrl

    layerObjects[layerObj.mapId] = tileLayer.wms(wmsUrl, layerConfiguration)
    maps[layerObj.mapId]?.addLayer(layerObjects[layerObj.mapId])

    if (crs == 'EPSG:3572') {
      addCircumpolarPlaces(layerObj.mapId)
    }

    if (layerObj.layer.bbox) {
      const bounds = latLngBounds(
        latLng(layerObj.layer.bbox[1], layerObj.layer.bbox[0]),
        latLng(layerObj.layer.bbox[3], layerObj.layer.bbox[2])
      )
      maps[layerObj.mapId]?.fitBounds(bounds)
    }

    if (layerObj.layer.coastline) {
      coastlineLayer = tileLayer.wms(config.public.geoserverUrl, {
        transparent: true,
        format: 'image/png',
        version: '1.3.0',
        layers: 'natural_earth:ne_10m_coastline',
      })
      maps[layerObj.mapId]?.addLayer(coastlineLayer)
    }

    activeLayers.value[layerObj.mapId] = layer

    addLegend(layerObj.mapId, layer.legend)
  }

  return {
    toggleLayer,
    activeLayers,
    create,
    setLegendItems,
    destroy,
    addLegend,
  }
})

const addCircumpolarPlaces = (mapId: string) => {
  const communities = {
    Helsinki: {
      lat: 60.1695,
      lon: 24.9355,
    },
    Iqaluit: {
      lat: 63.75,
      lon: -68.5167,
    },
    Juneau: {
      lat: 58.3019,
      lon: -134.42,
    },
    Москва: {
      lat: 55.6256,
      lon: 37.6064,
    },
    Nuuk: {
      lat: 64.1814,
      lon: -51.6942,
    },
    Oslo: {
      lat: 59.9127,
      lon: 10.7461,
    },
    Reykjavík: {
      lat: 64.1333,
      lon: -21.9,
    },
    Tórshavn: {
      lat: 62.012,
      lon: -6.768,
    },
    Whitehorse: {
      lat: 60.727,
      lon: -135.074,
    },
    Yellowknife: {
      lat: 62.4536,
      lon: -114.37,
    },
  }

  let data: {
    type: 'FeatureCollection'
    features: {
      type: string
      properties: { name: string }
      geometry: { type: string; coordinates: number[] }
    }[]
  } = {
    type: 'FeatureCollection',
    features: [],
  }

  for (const [key, value] of Object.entries(communities)) {
    data.features.push({
      type: 'Feature',
      properties: {
        name: key,
      },
      geometry: {
        type: 'Point',
        coordinates: [value.lon, value.lat],
      },
    })
  }

  circumpolarPlaces = $L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return $L.circleMarker(latlng, {
        radius: 3,
        fillColor: 'black',
        color: 'black',
        weight: 1,
        opacity: 0.5,
        fillOpacity: 0.8,
        interactive: false,
      })
    },
    onEachFeature: function (feature, layer) {
      const label = $L.divIcon({
        className: 'label',
        html: `<div style="white-space: nowrap; margin-left: 15px; margin-top: -4px; font-size: 13px;">${feature.properties.name}</div>`,
      })
      $L.marker((layer as L.Marker).getLatLng(), { icon: label }).addTo(
        maps[mapId]
      )
    },
  })
  circumpolarPlaces.addTo(maps[mapId])
}
