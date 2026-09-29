import { ScatterplotLayer } from '@deck.gl/layers';

export interface OriginZoneData {
  id: string;
  coordinates: [number, number]; // [lng, lat]
  radiusMeters: number;
  uncertaintyPercent?: number;
}

export interface OriginLayerProps {
  id?: string;
  visible?: boolean;
  data?: OriginZoneData[];
}

/**
 * OriginLayer: Renders estimated discharge origin point and uncertainty radius
 */
export function createOriginLayer(props: OriginLayerProps = {}) {
  const {
    id = 'origin-layer',
    visible = true,
    data = [],
  } = props;

  return new ScatterplotLayer<OriginZoneData>({
    id,
    data,
    visible,
    pickable: true,
    opacity: 0.8,
    stroked: true,
    filled: true,
    radiusScale: 1,
    radiusMinPixels: 15,
    lineWidthMinPixels: 2,
    getPosition: (d: OriginZoneData) => d.coordinates,
    getRadius: (d: OriginZoneData) => d.radiusMeters || 3000,
    getFillColor: () => [245, 158, 11, 40], // Amber warning alpha for origin uncertainty
    getLineColor: () => [245, 158, 11, 230], // Amber perimeter
    getLineWidth: 2,
  });
}

export default createOriginLayer;
