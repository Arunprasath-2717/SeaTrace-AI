import * as Cesium from 'cesium';

export interface SlickCoordinates {
  coordinates: number[][]; // [lng, lat]
  areaKm2: number;
}

export const defaultSlickData: SlickCoordinates = {
  areaKm2: 14.8,
  coordinates: [
    [-90.25, 28.42],
    [-90.22, 28.48],
    [-90.18, 28.45],
    [-90.21, 28.40],
    [-90.25, 28.42],
  ],
};

export function addSlickOverlay(
  viewer: Cesium.Viewer,
  data: SlickCoordinates = defaultSlickData
): Cesium.Entity {
  const degreesArray: number[] = [];
  data.coordinates.forEach(([lng, lat]) => {
    degreesArray.push(lng, lat);
  });

  return viewer.entities.add({
    name: 'Observed Oil Slick',
    polygon: {
      hierarchy: Cesium.Cartesian3.fromDegreesArray(degreesArray),
      material: Cesium.Color.fromCssColorString('#21aba5').withAlpha(0.55),
      outline: true,
      outlineColor: Cesium.Color.fromCssColorString('#45eba5'),
      outlineWidth: 3,
      height: 10,
    },
    description: `Observed satellite SAR slick delineation (Area: ${data.areaKm2} km²)`,
  });
}
