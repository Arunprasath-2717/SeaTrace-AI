import { ENV } from '../../config/environment';

export interface MapViewConfig {
  center: [number, number]; // [lng, lat]
  zoom: number;
  minZoom: number;
  maxZoom: number;
  pitch: number;
  bearing: number;
}

export interface MapConfig {
  styleUrl: string;
  defaultView: MapViewConfig;
  attribution: string;
}

export const defaultMapConfig: MapConfig = {
  // Uses configured style URL from environment with open-source fallback
  styleUrl: ENV.MAP_STYLE_URL,
  defaultView: {
    center: [-90.218, 28.452], // Gulf of Mexico default observation
    zoom: 7.5,
    minZoom: 2,
    maxZoom: 18,
    pitch: 0,
    bearing: 0,
  },
  attribution: '© MapLibre | SEATRACE Maritime Cartography',
};

export default defaultMapConfig;
