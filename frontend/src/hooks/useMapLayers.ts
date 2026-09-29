import { useState, useCallback } from 'react';
import { LayerState } from '../components/maps/LayerControl';

export function useMapLayers(initialLayers?: Partial<LayerState>) {
  const [layers, setLayers] = useState<LayerState>({
    satellite: true,
    slick: true,
    vessels: true,
    tracks: true,
    origin: true,
    simulation: true,
    ...initialLayers,
  });

  const toggleLayer = useCallback((layerKey: keyof LayerState) => {
    setLayers((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }));
  }, []);

  const setLayerVisibility = useCallback((layerKey: keyof LayerState, visible: boolean) => {
    setLayers((prev) => ({
      ...prev,
      [layerKey]: visible,
    }));
  }, []);

  const resetLayers = useCallback(() => {
    setLayers({
      satellite: true,
      slick: true,
      vessels: true,
      tracks: true,
      origin: true,
      simulation: true,
    });
  }, []);

  return {
    layers,
    toggleLayer,
    setLayerVisibility,
    resetLayers,
  };
}

export default useMapLayers;
