import { useEffect, useState } from "react";
import {  middleOfBucharest } from "../lib/constants";
import { Popup, useMap } from "@vis.gl/react-maplibre";
import { getLocation } from "../lib/api";

export default function YouAreHere() {
  const [popupLocation, setPopupLocation] = useState(middleOfBucharest);
  const { current: map } = useMap();

  useEffect(() => {
    if (!map) return;
    (async () => {
      const location = await getLocation();
      if (location !== middleOfBucharest) {
        setPopupLocation(location);
        map.flyTo({ center: location, zoom: 8 });
      }
    })();
  }, [map]);

  if (!map) return null;

  return (
    <Popup
      longitude={popupLocation[0]}
      latitude={popupLocation[1]}>
      <h3>You are approximately here!</h3>
    </Popup>
  );
}