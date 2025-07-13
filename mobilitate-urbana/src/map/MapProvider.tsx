import { ReactNode } from "react";
import maplibregl from "maplibre-gl";
import { MapContext } from "./MapContext";

type MapProviderProps = {
  children: ReactNode;
};

export const MapProvider = ({ children }: MapProviderProps) => {
  return (
    <MapContext.Provider value={{ maplibregl }}>
      {children}
    </MapContext.Provider>
  );
};