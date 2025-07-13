import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient'; // adjust path
import { Map } from '@vis.gl/react-maplibre';
import { middleOfBucharest } from '../lib/constants';
import UserReportPins from './UserReportsPins';
import YouAreHere from './you-are-here';
import SidewalkFormModal from './SidewalkFormModal';
import type { MapMouseEvent } from '@vis.gl/react-maplibre';

interface Report {
  id: string;
  user_id: string;
  location: string; // or whatever type your location is
  timestamp?: string;
  satisfaction?: number;
  safety?: number;
  // add other fields as needed
}

const MapView = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [clickLocation, setClickLocation] = useState<[number, number] | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);

  // Assuming you have user info from somewhere
  const user = supabase.auth.getUser ? supabase.auth.getUser() : null;

  useEffect(() => {
    if (!user) return;

    const fetchReports = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from<'reports', Report>('reports')
        .select('id, location, user_id, timestamp, satisfaction, safety')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching reports:', error);
        setReports([]);
      } else {
        setReports(data ?? []);
      }
      setLoading(false);
    };

    fetchReports();
  }, [user]);

  const handleMapClick = (e: MapMouseEvent) => {
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
        <UserReportPins reports={reports} loading={loading} />
      </Map>

      {modalOpen && clickLocation && (
        <SidewalkFormModal location={clickLocation} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
};

export default MapView;