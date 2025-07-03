import { createContext } from "react";
import maplibregl from "maplibre-gl";

export type MapContextType = {
  maplibregl: typeof maplibregl;
};

export const MapContext = createContext<MapContextType | undefined>(undefined);