import * as Cesium from 'cesium';

export interface OriginZoneOptions {
  centerLng: number;
  centerLat: number;
  radiusMeters: number;
  slickCenterLng: number;
  slickCenterLat: number;
}

export const defaultOriginOptions: OriginZoneOptions = {
  centerLng: -90.23,
  centerLat: 28.46,
  radiusMeters: 2800,
  slickCenterLng: -90.215,
  slickCenterLat: 28.435,
};

export function addOriginZone(
  viewer: Cesium.Viewer,
  options: OriginZoneOptions = defaultOriginOptions
): { originEntity: Cesium.Entity; driftEntities: Cesium.Entity[] } {
  // 1. Probable Origin Zone Circle / Ellipse
  const originEntity = viewer.entities.add({
    name: 'Probable Origin Zone',
    position: Cesium.Cartesian3.fromDegrees(options.centerLng, options.centerLat, 5),
    ellipse: {
      semiMinorAxis: options.radiusMeters,
      semiMajorAxis: options.radiusMeters * 1.25,
      rotation: Cesium.Math.toRadians(45),
      material: Cesium.Color.fromCssColorString('#f59e0b').withAlpha(0.25),
      outline: true,
      outlineColor: Cesium.Color.fromCssColorString('#f59e0b').withAlpha(0.85),
      outlineWidth: 2,
    },
    point: {
      pixelSize: 8,
      color: Cesium.Color.fromCssColorString('#f59e0b'),
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: 1.5,
    },
    description: `Estimated release zone (Radius: ${(options.radiusMeters / 1000).toFixed(1)} km)`,
  });

  // 2. Backward Drift Ensemble Trajectory Streams (5 particle lines)
  const driftEntities: Cesium.Entity[] = [];
  const runs = 5;

  for (let i = 0; i < runs; i++) {
    const jitterLng = (Math.random() - 0.5) * 0.015;
    const jitterLat = (Math.random() - 0.5) * 0.015;

    const midLng = (options.slickCenterLng + options.centerLng) / 2 + (i - 2) * 0.006;
    const midLat = (options.slickCenterLat + options.centerLat) / 2 + (i - 2) * 0.004;

    const streamLine = viewer.entities.add({
      name: `Drift Trajectory Run #${i + 1}`,
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArray([
          options.slickCenterLng,
          options.slickCenterLat,
          midLng,
          midLat,
          options.centerLng + jitterLng,
          options.centerLat + jitterLat,
        ]),
        width: 1.8,
        material: new Cesium.PolylineDashMaterialProperty({
          color: Cesium.Color.fromCssColorString('#21aba5').withAlpha(0.7),
          dashLength: 12,
        }),
      },
    });

    driftEntities.push(streamLine);
  }

  return { originEntity, driftEntities };
}
