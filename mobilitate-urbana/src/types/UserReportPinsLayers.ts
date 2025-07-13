import type { Layer } from 'maplibre-gl';

export const clusterLayer: Layer = {
  id: 'clusters',
  type: 'circle',
  source: 'reports',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': '#f28cb1',
    'circle-radius': [
      'step',
      ['get', 'point_count'],
      15,
      10,
      20,
      25,
      30,
    ],
  },
};

export const clusterCountLayer: Layer = {
  id: 'cluster-count',
  type: 'symbol',
  source: 'reports',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-size': 12,
  },
};

export const unclusteredLayer: Layer = {
  id: 'unclustered-point',
  type: 'circle',
  source: 'reports',
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-color': '#11b4da',
    'circle-radius': 6,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff',
  },
};
