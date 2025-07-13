import React, { useMemo } from "react";
import { Marker } from "@vis.gl/react-maplibre";
import Report from "./MapView"; 

interface UserReportPinsProps {
  reports: Report[];
  loading: boolean;
}

const UserReportPins: React.FC<UserReportPinsProps> = ({ reports, loading }) => {
  // Early return if loading or no reports
  if (loading) return null;
  if (!reports || reports.length === 0) return null;

  // Convert reports to GeoJSON features or markers
  // Assuming location is a string like "POINT(lng lat)" or "lng,lat"
  // Adjust parsing accordingly
  const markers = useMemo(() => {
    return reports.map((report) => {
      let lng = 0,
        lat = 0;

      // Example: parse if location is "lng,lat" string
      if (typeof report.location === "string") {
        const parts = report.location.split(",");
        if (parts.length === 2) {
          lng = parseFloat(parts[0]);
          lat = parseFloat(parts[1]);
        } else {
          // handle WKT or other format like "POINT(lng lat)"
          const match = report.location.match(/POINT\(([-\d\.]+) ([-\d\.]+)\)/);
          if (match) {
            lng = parseFloat(match[1]);
            lat = parseFloat(match[2]);
          }
        }
      }

      return (
        <Marker
          key={report.id}
          longitude={lng}
          latitude={lat}
          anchor="bottom"
        >
          {/* Simple marker UI, customize as needed */}
          <div
            style={{
              backgroundColor: "#ff5722",
              borderRadius: "50%",
              width: 12,
              height: 12,
              border: "2px solid white",
            }}
            title={`Report ID: ${report.id}`}
          />
        </Marker>
      );
    });
  }, [reports]);

  return <>{markers}</>;
};

export default UserReportPins;
