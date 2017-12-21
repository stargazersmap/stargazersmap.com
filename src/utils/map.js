const colors = {
  blue: '#0275d8',
  gold: '#f0ad4e',
  green: '#449d44',
  red: '#c9302c',
  straw: '#f0da99',
  white: '#ffffff',
}

const addClusters = (map) => {
  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'users',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': {
        property: 'point_count',
        type: 'interval',
        stops: [
          [0, colors.gold],
          [10, colors.straw],
          [25, colors.white],
        ],
      },
      'circle-radius': {
        property: 'point_count',
        type: 'interval',
        stops: [
          [0, 15],
          [10, 20],
          [25, 25],
        ],
      },
    },
  })
}

const addClustersCount = (map) => {
  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'users',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12,
    },
  })
}

const addClustersLabels = (map) => {
  map.addLayer({
    id: 'clusters-label',
    type: 'symbol',
    source: 'users',
    layout: {
      'text-field': '{location}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 10,
      'text-offset': [0, 2],
    },
  })
}

const addUnclusteredPoints = (map) => {
  map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'users',
    filter: ['!has', 'point_count'],
    paint: {
      'circle-color': colors.white,
      'circle-radius': 8,
      'circle-stroke-width': 1,
      'circle-stroke-color': colors.straw,
    },
  })
}

export const addMapLayers = (map) => {
  addClusters(map)
  addClustersCount(map)
  addClustersLabels(map)
  addUnclusteredPoints(map)
}

export const addMapSources = (map, data) => {
  map.addSource('users', {
    type: 'geojson',
    cluster: true,
    clusterMaxZoom: 7,
    // Radius of each cluster when clustering points (defaults to 50)
    clusterRadius: 40,
    data,
  })
}

export const makeUserFeature = (user) => ({
  type: 'Feature',
  geometry: {
    coordinates: [user.lng, user.lat],
  },
  properties: {
    location: user.location,
    username: user.username,
  },
})
