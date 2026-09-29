import { ScatterplotLayer } from '@deck.gl/layers';

export interface VesselMarkerData {
  id: string;
  name: string;
  mmsi: string;
  coordinates: [number, number]; // [lng, lat]
  attributionScore?: number;
  isPrimaryCandidate?: boolean;
}

export interface VesselLayerProps {
  id?: string;
  visible?: boolean;
  data?: VesselMarkerData[];
  onHover?: (info: unknown) => void;
  onClick?: (info: unknown) => void;
}

/**
 * VesselLayer: Renders candidate vessels extracted from AIS telemetry
 */
export function createVesselLayer(props: VesselLayerProps = {}) {
  const {
    id = 'vessel-layer',
    visible = true,
    data = [],
    onHover,
    onClick,
  } = props;

  return new ScatterplotLayer<VesselMarkerData>({
    id,
    data,
    visible,
    pickable: true,
    opacity: 0.9,
    stroked: true,
    filled: true,
    radiusScale: 1,
    radiusMinPixels: 6,
    radiusMaxPixels: 14,
    lineWidthMinPixels: 2,
    getPosition: (d: VesselMarkerData) => d.coordinates,
    getRadius: (d: VesselMarkerData) => (d.isPrimaryCandidate ? 12 : 8),
    getFillColor: (d: VesselMarkerData) =>
      d.isPrimaryCandidate
        ? [69, 235, 165, 230] // SeaTrace Mint for top candidate
        : [22, 58, 95, 200],   // SeaTrace Navy
    getLineColor: (d: VesselMarkerData) =>
      d.isPrimaryCandidate
        ? [255, 255, 255, 255]
        : [33, 171, 165, 255], // SeaTrace Teal
    getLineWidth: 2,
    onHover,
    onClick,
  });
}

export default createVesselLayer;
