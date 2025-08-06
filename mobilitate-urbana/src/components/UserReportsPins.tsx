import { Marker } from '@vis.gl/react-maplibre';
import { Report } from '../components/IReport';
import '../components/UserReportsPins.css';

interface Props {
  reports: Report[];
  loading: boolean;
  selectedReport: Report | null;
  setSelectedReport: (r: Report | null) => void;
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
  selectedReport,
  setSelectedReport,
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
    </>
  );
};

export default UserReportPins;
