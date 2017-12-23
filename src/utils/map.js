const Colors = {
  GOLD: '#fbe067',
  STRAW: '#faedb5',
  WHITE: '#ffffff',
  DARK_GREY: '#2b2a29',
}

const addClusters = (map) => {
  const _addLayer = (id, paint) => {
    map.addLayer({
      id,
      type: 'circle',
      source: 'users',
      filter: ['has', 'point_count'],
      paint,
    })
  }

  _addLayer('clusters', {
    'circle-color': {
      property: 'point_count',
      type: 'interval',
      stops: [
        [0, Colors.GOLD],
        [10, Colors.STRAW],
        [25, Colors.WHITE],
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
  })

  _addLayer('clusters-halo', {
    'circle-blur': 2,
    'circle-color': Colors.WHITE,
    'circle-radius': {
      property: 'point_count',
      type: 'interval',
      stops: [
        [0, 30],
        [10, 40],
        [25, 50],
      ],
    },
    'circle-stroke-width': 5,
    'circle-stroke-color': Colors.STRAW,
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
    paint: {
      'text-color': Colors.DARK_GREY,
    },
  })
}

const addLocationLabels = (map) => {
  map.addLayer({
    id: 'clusters-label',
    type: 'symbol',
    source: 'users',
    layout: {
      'text-field': '{location}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-offset': [0, 2],
      'text-size': 10,
    },
    paint: {
      'text-color': Colors.WHITE,
      'text-halo-color': Colors.DARK_GREY,
      'text-halo-width': 2,
    },
  })
}

const addUnclusteredPoints = (map) => {
  const _addLayer = (id, paint) => {
    map.addLayer({
      id,
      type: 'circle',
      source: 'users',
      filter: ['!has', 'point_count'],
      paint,
    })
  }

  _addLayer('unclustered-point-halo', {
    'circle-color': Colors.WHITE,
    'circle-radius': 8,
    'circle-stroke-width': 2,
    'circle-stroke-color': Colors.STRAW,
    'circle-blur': 1,
  })

  _addLayer('unclustered-point', {
    'circle-color': Colors.WHITE,
    'circle-radius': 4,
  })
}

export const addMapLayers = (map) => {
  addClusters(map)
  addClustersCount(map)
  addLocationLabels(map)
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
