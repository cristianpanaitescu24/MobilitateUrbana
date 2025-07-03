import React from 'react';
import { AuthProvider } from './auth/AuthProvider';
import { MapProvider } from './map/MapProvider';
import MapView from './components/MapView';

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