// types/maplibre-gl.d.ts
declare module 'maplibre-gl' {
  export interface Layer {
    id: string;
    type: string;
    source?: string;
    filter?: any[];
    paint?: { [key: string]: any };
    layout?: { [key: string]: any };
  }
}