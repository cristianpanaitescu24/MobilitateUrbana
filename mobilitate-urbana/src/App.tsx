import React from 'react';
import { AuthProvider } from './auth/AuthProvider';
import { MapProvider } from './map/MapProvider';
import MapView from './components/MapView';
import TopBar from './components/TopBar';

function App() {
  return (
    <>
      <AuthProvider>
      <TopBar/>
      <MapProvider>
        <MapView />
      </MapProvider>
    </AuthProvider>
    </>
    
  );
}

export default App;