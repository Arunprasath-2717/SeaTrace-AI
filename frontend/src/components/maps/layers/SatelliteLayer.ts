import { BitmapLayer } from '@deck.gl/layers';

export interface SatelliteLayerProps {
  id?: string;
  visible?: boolean;
  bounds?: [number, number, number, number]; // [west, south, east, north]
  imageUrl?: string;
  opacity?: number;
}

/**
 * SatelliteLayer: Renders georeferenced satellite scenes (SAR / Multispectral).
 * Placeholder architecture ready for Cloud-Optimized GeoTIFF (COG) or tile integration.
 */
export function createSatelliteLayer(props: SatelliteLayerProps = {}) {
  const {
    id = 'satellite-layer',
    visible = true,
    bounds = [-90.45, 28.25, -89.95, 28.65],
    imageUrl,
    opacity = 0.8,
  } = props;

  if (!imageUrl) {
    return null;
  }

  return new BitmapLayer({
    id,
    bounds,
    image: imageUrl,
    opacity,
    visible,
    pickable: true,
  });
}

export default createSatelliteLayer;
