import { useEffect, useState } from 'react';
import { Map, Marker, MapMouseEvent } from '@vis.gl/react-maplibre';
import { middleOfBucharest } from '../constants/constants';
import { useUserReports } from '../hooks/useUserReports';

import UserReportPins from './UserReportsPins';
import YouAreHere from './you-are-here';
import SidewalkFormModal from './SidewalkFormModal';
import { Report } from '../hooks/useUserReports';
// import FABToolbar from '../components/FABToolbar';

const MapView = () => {
  const { initialReports, loading } = useUserReports();

  // State to hold all visible reports
  const [reports, setReports] = useState<Report[]>([]);
  const [clickLocation, setClickLocation] = useState<[number, number] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Once initialReports are loaded, set them locally
  useEffect(() => {
    if (!loading && initialReports.length > 0) {
      setReports(initialReports);
    }
  }, [initialReports, loading]);

  // Add new report to state
  const addReport = (newReport: Report) => {
    setReports((prev) => [...prev, newReport]);
  };

  // Map click: open modal
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
        mapStyle="/styles/dark.json"
        onClick={handleMapClick}
      >
        <YouAreHere />
        <UserReportPins reports={reports} loading={loading} />

        {clickLocation && modalOpen && (
          <Marker
            longitude={clickLocation[0]}
            latitude={clickLocation[1]}
            color="orange"
          />
        )}

        {/* <FABToolbar/> */}
      </Map>

      {modalOpen && clickLocation && (
        <SidewalkFormModal
          location={clickLocation}
          onClose={() => setModalOpen(false)}
          onSubmitSuccess={(success) => {
            // addReport();
          }}
        />
      )}

    </>
  );
};

export default MapView;