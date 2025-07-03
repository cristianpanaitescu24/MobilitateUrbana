import React, { useState } from 'react';
import { Map } from '@vis.gl/react-maplibre';
import { middleOfBucharest } from '../lib/constants';
import SidewalkFormModal from './SidewalkFormModal';
import YouAreHere from './you-are-here';
import type { MapLayerMouseEvent } from 'maplibre-gl';


const MapView = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [clickLocation, setClickLocation] = useState<[number, number] | null>(null);

  const handleMapClick = (e: MapLayerMouseEvent) => {
    setClickLocation([e.lngLat.lng, e.lngLat.lat]);
    setModalOpen(true);
  };

  return (
    <>
      <Map
        initialViewState={{
          longitude: middleOfBucharest[0],
          latitude: middleOfBucharest[1],
          zoom: 13,
        }}
        mapStyle="/styles/style_americana.json"
        onClick={handleMapClick}
      >
        <YouAreHere />
      </Map>
      
      {modalOpen && (
        <SidewalkFormModal location={clickLocation as [number, number]} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
};

export default MapView;