import * as Cesium from 'cesium';

export interface Waypoint {
  longitude: number;
  latitude: number;
  timestamp: string;
  speedKnots: number;
}

export const defaultVesselTrackData: Waypoint[] = [
  { longitude: -90.95, latitude: 28.12, timestamp: '08:00 UTC', speedKnots: 12.4 },
  { longitude: -90.52, latitude: 28.31, timestamp: '11:30 UTC', speedKnots: 11.8 },
  { longitude: -90.22, latitude: 28.46, timestamp: '14:15 UTC', speedKnots: 12.1 }, // Origin corridor intersection
  { longitude: -89.88, latitude: 28.62, timestamp: '17:00 UTC', speedKnots: 12.5 },
];

export function addVesselTrack(
  viewer: Cesium.Viewer,
  waypoints: Waypoint[] = defaultVesselTrackData
): { trackEntity: Cesium.Entity; vesselPointEntity: Cesium.Entity; counterfactualEntity: Cesium.Entity } {
  const positions: number[] = [];
  waypoints.forEach((wp) => {
    positions.push(wp.longitude, wp.latitude);
  });

  // 1. AIS Historical Trajectory Polyline
  const trackEntity = viewer.entities.add({
    name: 'Candidate Vessel Track (OCEAN VALIANT)',
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray(positions),
      width: 2.5,
      material: Cesium.Color.fromCssColorString('#45eba5').withAlpha(0.9),
    },
  });

  // 2. Candidate Vessel Point at Crossing
  const crossingWp = waypoints[2];
  const vesselPointEntity = viewer.entities.add({
    name: 'Candidate Vessel (Crossing Position)',
    position: Cesium.Cartesian3.fromDegrees(crossingWp.longitude, crossingWp.latitude, 20),
    point: {
      pixelSize: 10,
      color: Cesium.Color.fromCssColorString('#45eba5'),
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
    },
    label: {
      text: 'M/T OCEAN VALIANT (14:15Z)',
      font: '10px monospace',
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      fillColor: Cesium.Color.WHITE,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -12),
    },
  });

  // 3. Counterfactual Forward Simulation Slick Contour
  const counterfactualEntity = viewer.entities.add({
    name: 'Counterfactual Forward Simulation Contour',
    polygon: {
      hierarchy: Cesium.Cartesian3.fromDegreesArray([
        -90.248, 28.423,
        -90.222, 28.479,
        -90.183, 28.448,
        -90.212, 28.398,
        -90.248, 28.423,
      ]),
      material: Cesium.Color.fromCssColorString('#1d566e').withAlpha(0.4),
      outline: true,
      outlineColor: Cesium.Color.fromCssColorString('#21aba5'),
      outlineWidth: 2,
      height: 15,
    },
  });

  return { trackEntity, vesselPointEntity, counterfactualEntity };
}
