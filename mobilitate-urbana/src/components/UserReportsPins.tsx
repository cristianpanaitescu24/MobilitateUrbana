import { Marker } from '@vis.gl/react-maplibre';
import { Report } from '../components/IReport';
import '../components/UserReportsPins.css';
import SidewalkFormModal from './SidewalkFormModal';

interface Props {
  reports: Report[];
  loading: boolean;
  onDeleteReport: (id: string) => void;
  selectedReport: Report | null;
  setSelectedReport: (r: Report | null) => void;
  updateReport: (updated: Report) => void; // new prop
}

const getColorForSatisfaction = (satisfaction?: number): string => {
  if (satisfaction == null) return 'gray';
  const percent = (satisfaction - 1) / 4;
  const hue = 0 + percent * 120;
  return `hsl(${hue}, 80%, 50%)`;
};

const UserReportPins: React.FC<Props> = ({
  reports,
  loading,
  onDeleteReport,
  selectedReport,
  setSelectedReport,
  updateReport
}) => {
  if (loading) return null;

  return (
    <>
      {reports.map((report) => {
        if (!report.location) return null;
        const isSelected = selectedReport?.id === report.id;
        const color = getColorForSatisfaction(report.ratings.satisfaction);

        return (
          <Marker
            key={report.id ?? `marker-${report.location[0]}-${report.location[1]}`}
            longitude={report.location[0]}
            latitude={report.location[1]}
            anchor="center"
            onClick={(e: maplibregl.MapLayerMouseEvent) => {
              e.originalEvent.stopPropagation();
              setSelectedReport(report);
            }}
          >
            <div
              className={`marker-dot${isSelected ? ' selected' : ''}`}
              style={{ backgroundColor: color }}
              title={`Satisfacție: ${report.ratings.satisfaction ?? 'N/A'}`}
            />
          </Marker>
        );
      })}

      {/* {selectedReport && selectedReport.location && (
        <div
          className="floating-sidewalk-form"
          style={{
            position: 'absolute',
            top: 50,
            left: 0,
            right: 0,
            margin: 'auto',
            zIndex: 1000,
            maxWidth: 400
          }}
        >
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
              onDeleteReport(selectedReport.id);
              setSelectedReport(null);
            }}
          />
        </div>
      )} */}
    </>
  );
};

export default UserReportPins;
