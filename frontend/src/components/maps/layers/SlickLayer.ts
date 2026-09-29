import { PolygonLayer } from '@deck.gl/layers';

export interface SlickPolygon {
  contour: [number, number][]; // [[lng, lat], ...]
  id: string;
  confidence?: number;
  thicknessMm?: number;
}

export interface SlickLayerProps {
  id?: string;
  visible?: boolean;
  data?: SlickPolygon[];
  opacity?: number;
  onHover?: (info: unknown) => void;
  onClick?: (info: unknown) => void;
}

/**
 * SlickLayer: Renders oil spill delineations and segmented contours
 */
export function createSlickLayer(props: SlickLayerProps = {}) {
  const {
    id = 'slick-layer',
    visible = true,
    data = [],
    opacity = 0.75,
    onHover,
    onClick,
  } = props;

  return new PolygonLayer<SlickPolygon>({
    id,
    data,
    visible,
    opacity,
    pickable: true,
    stroked: true,
    filled: true,
    wireframe: true,
    lineWidthMinPixels: 2,
    getPolygon: (d: SlickPolygon) => d.contour,
    getFillColor: () => [33, 171, 165, 160], // SeaTrace Teal with alpha
    getLineColor: () => [69, 235, 165, 255], // SeaTrace Mint border
    getLineWidth: 2,
    onHover,
    onClick,
  });
}

export default createSlickLayer;
