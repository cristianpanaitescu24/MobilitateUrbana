import { useEffect, useState } from 'react';
import { Map, Marker, MapMouseEvent} from '@vis.gl/react-maplibre';
import { middleOfBucharest } from '../constants/constants';
import { useUserReports } from '../hooks/useUserReports';
import { deleteReport } from '../lib/deleteReport';

import UserReportPins from './UserReportsPins';
import YouAreHere from './you-are-here';
import SidewalkFormModal from './SidewalkFormModal';
import { Report } from '../components/IReport';
// import FABToolbar from '../components/FABToolbar';

const MapView = () => {
  const { initialReports, loading } = useUserReports();

  // State to hold all visible reports
  const [reports, setReports] = useState<Report[]>([]);
  const [clickLocation, setClickLocation] = useState<[number, number] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Once initialReports are loaded, set them locally
  useEffect(() => {
    if (!loading && initialReports.length > 0) {
      setReports(initialReports);
    }
  }, [initialReports, loading]);

  // Add new report to state
  const addReport = (newReport: Report) => {
    setReports((prev) => [...prev, { ...newReport }]);
  };

  const handleDeleteReport = async (id: string) => {
    const confirmed = window.confirm('Sigur vrei să ștergi acest raport?');
    if (!confirmed) return;

    const success = await deleteReport(id);
    console.log(id);
    if (success) {
      setReports((prev) => prev.filter((r) => r.id !== id));
      setSelectedReport(null);
    } else {
      alert('A apărut o eroare la ștergere.');
    }
  };

    const updateReport = (updated: Report) => {
      setReports((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r))
      );
    };

  // Map click: open modal
  const handleMapClick = (e: MapMouseEvent) => {
    setClickLocation([e.lngLat.lng, e.lngLat.lat]);
    setModalOpen(true);
    setSelectedReport(null);
      
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
        <UserReportPins
          reports={reports}
          loading={loading}
          selectedReport={selectedReport}
          setSelectedReport={setSelectedReport}
        />

        {clickLocation && modalOpen && (
          <Marker
            longitude={clickLocation[0]}
            latitude={clickLocation[1]}
            color="orange"
          />
        )}

        {/* <FABToolbar/> */}
      </Map>

      {selectedReport && selectedReport.location && (
        <SidewalkFormModal
          location={[selectedReport.location[0], selectedReport.location[1]]}
          existingReport={selectedReport}
          isEditMode={true}
          onClose={() => setSelectedReport(null)}
          onSubmitSuccess={(updatedReport) => {
            if (updatedReport) updateReport(updatedReport);
            setSelectedReport(null);
          }}
          onDelete={() => {
            deleteReport(selectedReport.id);
            setSelectedReport(null);
          }}
        />
      )}

      {!selectedReport && modalOpen && clickLocation && (
        <SidewalkFormModal
          location={clickLocation}
          onClose={() => setModalOpen(false)}
          onDelete={() => setModalOpen(false)}
          onSubmitSuccess={(newReport) => {
            if (newReport) {
              addReport(newReport);
            }
          }}
        />
      )}

    </>
  );
};

export default MapView;