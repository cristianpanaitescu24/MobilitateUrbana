import React, { useState } from 'react';
import { Marker, Popup } from '@vis.gl/react-maplibre';
import { Report } from '../hooks/useUserReports';
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
  <div className="report-rating-row">
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

  return (
    <>
      {reports.map((report) => {
        if (report.lat == null || report.lng == null) return null;

        const isSelected = selectedReport?.id === report.id;
        const color = getColorForSatisfaction(report.satisfaction);

        return (
          <Marker
            key={report.id}
            longitude={report.lng}
            latitude={report.lat}
            anchor="center"
            onClick={(e: maplibregl.MapLayerMouseEvent) => {
              e.originalEvent.stopPropagation();
              setSelectedReport(report);
            }}
          >
            <div
              className={`marker-dot${isSelected ? ' selected' : ''}`}
              style={{ backgroundColor: color }}
              title={`Satisfacție: ${report.satisfaction ?? 'N/A'}`}
            />
          </Marker>
        );
      })}

      {selectedReport && selectedReport.lat != null && selectedReport.lng != null && (
        <Popup
          longitude={selectedReport.lng}
          latitude={selectedReport.lat}
          onClose={() => setSelectedReport(null)}
          closeButton
        >
          <div style={{ maxWidth: 260 }}>
            <h4 className="font-semibold mb-1">📍 Detalii raport</h4>
            <p><strong>Data:</strong> {new Date(selectedReport.timestamp || "").toLocaleString()}</p>

            <>
            {renderRatingRow("Satisfacție:", selectedReport.satisfaction)}
            {renderRatingRow("Siguranță:", selectedReport.safety)}
            {renderRatingRow("Lățime:", selectedReport.width)}
            {renderRatingRow("Utilizabilitate:", selectedReport.usability)}
            {renderRatingRow("Accesibilitate:", selectedReport.accessibility)}
            {renderRatingRow("Modernizare:", selectedReport.modernization)}
            </>

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
