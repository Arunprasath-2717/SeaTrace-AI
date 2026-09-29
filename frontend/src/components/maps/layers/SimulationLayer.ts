import { PolygonLayer } from '@deck.gl/layers';

export interface SimulationSlickData {
  id: string;
  contour: [number, number][]; // [[lng, lat], ...]
  isCounterfactual?: boolean;
}

export interface SimulationLayerProps {
  id?: string;
  visible?: boolean;
  data?: SimulationSlickData[];
}

/**
 * SimulationLayer: Renders counterfactual forward open-oil dispersion simulations
 */
export function createSimulationLayer(props: SimulationLayerProps = {}) {
  const {
    id = 'simulation-layer',
    visible = true,
    data = [],
  } = props;

  return new PolygonLayer<SimulationSlickData>({
    id,
    data,
    visible,
    pickable: true,
    stroked: true,
    filled: true,
    wireframe: true,
    lineWidthMinPixels: 2,
    getPolygon: (d: SimulationSlickData) => d.contour,
    getFillColor: () => [29, 86, 110, 140], // SeaTrace Deep Teal fill
    getLineColor: () => [69, 235, 165, 200], // SeaTrace Mint dashed/contour
    getLineWidth: 2,
  });
}

export default createSimulationLayer;
