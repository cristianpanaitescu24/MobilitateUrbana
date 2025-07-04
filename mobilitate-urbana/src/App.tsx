import React from 'react';
import { AuthProvider } from './auth/AuthProvider';
import { MapProvider } from './map/MapProvider';
import MapView from './map/MapView';

function App() {
  return (
    <AuthProvider>
      <MapProvider>
        <MapView />
      </MapProvider>
    </AuthProvider>
  );
}

export default App;