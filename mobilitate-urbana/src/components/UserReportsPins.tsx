import React, { useState } from 'react';
import { Marker, Popup } from '@vis.gl/react-maplibre';
import { Report } from '../components/IReport';
import '../components/UserReportsPins.css';

interface Props {
  reports: Report[];
  loading: boolean;
}

const getColorForSatisfaction = (satisfaction?: number): string => {
  if (satisfaction == null) return 'gray';
  const percent = (satisfaction - 1) / 4;
  const hue = 0 + percent * 120;
  return `hsl(${hue}, 80%, 50%)`;
};

const renderRatingRow = (label: string, value?: number) => (
  <div className="report-rating-row" key={label}>
    <span><strong>{label}</strong></span>
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i}>{i <= (value ?? 0) ? "★" : "☆"}</span>
      ))}
    </div>
  </div>
);

const UserReportPins: React.FC<Props> = ({ reports, loading }) => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  if (loading) return null;
  console.log(reports);
  return (
    <>
      {reports.map((report, index) => {
        if (!report.location) return null;

        const isSelected = selectedReport?.id === report.id;
        const color = getColorForSatisfaction(report.ratings.satisfaction);

        return (
          <Marker
            key={report.id ?? `marker-${index}`} // <- fallback to index if no ID
            longitude={report.location[1]}
            latitude={report.location[0]}
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

      {selectedReport && selectedReport.location && (
        <Popup
          longitude={selectedReport.location[1]}
          latitude={selectedReport.location[0]}
          onClose={() => setSelectedReport(null)}
          closeButton
        >
          <div style={{ maxWidth: 260 }}>
            <h4 className="font-semibold mb-1">📍 Detalii raport</h4>
            <p><strong>Data:</strong> {new Date(selectedReport.timestamp || "").toLocaleString()}</p>

            {[
              ["Satisfacție:", selectedReport.ratings.satisfaction],
              ["Siguranță:", selectedReport.ratings.safety],
              ["Lățime:", selectedReport.ratings.width],
              ["Utilizabilitate:", selectedReport.ratings.usability],
              ["Accesibilitate:", selectedReport.ratings.accessibility],
              ["Modernizare:", selectedReport.ratings.modernization]
            ].map(([label, value]) => renderRatingRow(label as string, value as number))}

            {Array.isArray(selectedReport.tags) && selectedReport.tags.length > 0 && (
              <div className="mt-1 text-sm text-gray-600">
                <p><strong>Probleme:</strong> {selectedReport.tags.join(', ')}</p>
              </div>
            )}
          </div>
        </Popup>
      )}
    </>
  );
};

export default UserReportPins;
