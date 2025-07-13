import React, { useState } from 'react';
import { Marker, Popup } from '@vis.gl/react-maplibre';
import { Report } from '../hooks/useUserReports';
import { criteria, criteriaLabels, issueLabels } from '../constants/formLabels';

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
              style={{
                width: isSelected ? 20 : 12,
                height: isSelected ? 20 : 12,
                borderRadius: '50%',
                backgroundColor: color,
                border: isSelected ? '2px solid white' : '1px solid white',
                boxShadow: isSelected
                  ? '0 0 10px 4px rgba(255, 255, 255, 0.6)'
                  : '0 0 4px rgba(0, 0, 0, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
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
          <div style={{ maxWidth: 240 }}>
            <h4>Detalii raport</h4>

            {/* Ratings */}
            <ul style={{ padding: 0, listStyle: 'none', marginBottom: 10 }}>
              {criteria.map((key) => (
                <li key={key}>
                  <strong>{criteriaLabels[key]}:</strong>{" "}
                  {selectedReport[key] ?? '—'}
                </li>
              ))}
            </ul>

            {/* Issues */}
            <p><strong>Probleme observate:</strong></p>
            <ul style={{ paddingLeft: 20 }}>
              {Object.entries(issueLabels).map(([key, label]) =>
                selectedReport[key as keyof typeof issueLabels] ? (
                  <li key={key}>{label}</li>
                ) : null
              )}
            </ul>

            {/* Notes */}
            {selectedReport.notes && (
              <p><strong>Observații:</strong> {selectedReport.notes}</p>
            )}
          </div>
        </Popup>
      )}
    </>
  );
};

export default UserReportPins;
