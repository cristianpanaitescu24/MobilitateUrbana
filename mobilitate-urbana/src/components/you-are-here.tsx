import { useEffect } from "react";
import {  middleOfBucharest } from "../constants/constants";
import { useMap } from "@vis.gl/react-maplibre";
import { getLocation } from "../lib/api";

export default function YouAreHere() {
  const { current: map } = useMap();

  useEffect(() => {
    if (!map) return;
    (async () => {
      const location = await getLocation();
      if (
        Array.isArray(location) &&
        location.length === 2 &&
        typeof location[0] === "number" &&
        typeof location[1] === "number" &&
        (location[0] !== middleOfBucharest[0] || location[1] !== middleOfBucharest[1])
      ) {
        map.flyTo({ center: location, zoom: 12 });
      }
    })();
  }, [map]);

  if (!map) return null;

  return;
}