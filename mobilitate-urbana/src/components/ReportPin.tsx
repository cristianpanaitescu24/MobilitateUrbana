import React, { useState } from "react";
import { Marker, Popup } from "@vis.gl/react-maplibre";
import type { Report } from "../hooks/useUserReports";
import { PinIcon } from "lucide-react"; // optional: use your own icon or a maplibre symbol

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
            <p><b>Satisfaction:</b> {report.satisfaction ?? "N/A"}</p>
            <p><b>Safety:</b> {report.safety ?? "N/A"}</p>
            <p><b>Width:</b> {report.width ?? "N/A"}</p>
            <p><b>Notes:</b> {report.notes || "None"}</p>
            <div className="text-xs text-gray-500">
              <p>Issues: {[
                report.cars && "🚗 Cars",
                report.pavement && "🧱 Pavement",
                report.stairs && "🪜 Stairs",
                report.signs && "🚧 Signs",
                report.nature && "🌿 Nature",
              ].filter(Boolean).join(", ") || "None"}</p>
            </div>
          </div>
        </Popup>
      )}
    </>
  );
};

export default ReportPin;
