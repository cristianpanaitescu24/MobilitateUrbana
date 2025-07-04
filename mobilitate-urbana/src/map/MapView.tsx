import React, { useState } from 'react';
import { Map, Marker } from '@vis.gl/react-maplibre';
import { middleOfBucharest } from '../lib/constants';
import SidewalkFormModal from '../components/SidewalkFormModal';
import YouAreHere from '../components/you-are-here';
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

        {clickLocation && (
          <Marker
            longitude={clickLocation[0]}
            latitude={clickLocation[1]}
          >
          </Marker>
        )}
      </Map>
      
      {modalOpen && clickLocation && (
        <SidewalkFormModal
          location={clickLocation}
          onClose={() => setClickLocation(null)}
        />
      )}
    </>
  );
};

export default MapView;