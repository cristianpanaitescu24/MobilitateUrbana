import React, { useState } from "react";
import { Marker, Popup } from "@vis.gl/react-maplibre";
import type { Report } from "../components/IReport";
import { PinIcon } from "lucide-react";

interface ReportPinProps {
  report: Report;
}

const ReportPin: React.FC<ReportPinProps> = ({ report }) => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <Marker
        longitude={report.location[0]}
        latitude={report.location[1]}
        anchor="bottom"
        onMouseEnter={() => setShowPopup(true)}
        onMouseLeave={() => setShowPopup(false)}
      >
        <PinIcon className="w-6 h-6 text-red-600 drop-shadow-md" />
      </Marker>

      {showPopup && (
        <Popup
          longitude={report.location[0]}
          latitude={report.location[1]}
          closeButton={false}
          closeOnClick={false}
          anchor="top"
        >
          <div className="text-sm max-w-xs space-y-1">
            <p className="font-bold text-base">📍 Report</p>
            <p><b>Date:</b> {new Date(report.timestamp || "").toLocaleString()}</p>
              <p><b>Satisfaction:</b>   {report.ratings?.satisfaction}</p>
              <p><b>Safety:</b>         {report.ratings?.safety}</p>
              <p><b>Width:</b>          {report.ratings?.width}</p>
              <p><b>Usability:</b>      {report.ratings?.usability}</p>
              <p><b>Accessibility:</b>  {report.ratings?.accessibility}</p>
              <p><b>Modernization:</b>  {report.ratings?.modernization}</p>
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
