import React, { useState } from "react";
import { Marker, Popup } from "@vis.gl/react-maplibre";
import type { Report } from "../hooks/useUserReports";
import { PinIcon } from "lucide-react";

interface ReportPinProps {
  report: Report;
}

const ReportPin: React.FC<ReportPinProps> = ({ report }) => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <Marker
        longitude={report.lng}
        latitude={report.lat}
        anchor="bottom"
        onMouseEnter={() => setShowPopup(true)}
        onMouseLeave={() => setShowPopup(false)}
      >
        <PinIcon className="w-6 h-6 text-red-600 drop-shadow-md" />
      </Marker>

      {showPopup && (
        <Popup
          longitude={report.lng}
          latitude={report.lat}
          closeButton={false}
          closeOnClick={false}
          anchor="top"
        >
          <div className="text-sm max-w-xs space-y-1">
            <p className="font-bold text-base">📍 Report</p>
            <p><b>Date:</b> {new Date(report.timestamp || "").toLocaleString()}</p>
            {report.satisfaction !== undefined && (
              <p><b>Satisfaction:</b> {report.satisfaction}</p>
            )}
            {report.safety !== undefined && (
              <p><b>Safety:</b> {report.safety}</p>
            )}
            {report.width !== undefined && (
              <p><b>Width:</b> {report.width}</p>
            )}
            {report.usability !== undefined && (
              <p><b>Usability:</b> {report.usability}</p>
            )}
            {report.accessibility !== undefined && (
              <p><b>Accessibility:</b> {report.accessibility}</p>
            )}
            {report.modernization !== undefined && (
              <p><b>Modernization:</b> {report.modernization}</p>
            )}
            <div className="text-xs text-gray-500">
              <p><b>Issues:</b> {report.tags?.length ? report.tags.join(", ") : "None"}</p>
            </div>
          </div>
        </Popup>
      )}
    </>
  );
};

export default ReportPin;
