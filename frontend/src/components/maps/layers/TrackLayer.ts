import { PathLayer } from '@deck.gl/layers';

export interface VesselTrackPath {
  vesselId: string;
  path: [number, number][]; // [[lng, lat], ...]
  isCandidateTrack?: boolean;
  isSuspectTrack?: boolean;
}

export interface TrackLayerProps {
  id?: string;
  visible?: boolean;
  data?: VesselTrackPath[];
  opacity?: number;
}

/**
 * TrackLayer: Renders AIS historical navigation trajectories and heading tracks
 */
export function createTrackLayer(props: TrackLayerProps = {}) {
  const {
    id = 'track-layer',
    visible = true,
    data = [],
    opacity = 0.85,
  } = props;

  return new PathLayer<VesselTrackPath>({
    id,
    data,
    visible,
    opacity,
    pickable: true,
    widthScale: 1,
    widthMinPixels: 2,
    getPath: (d: VesselTrackPath) => d.path,
    getColor: (d: VesselTrackPath) =>
      d.isCandidateTrack || d.isSuspectTrack
        ? [69, 235, 165, 230] // Mint
        : [33, 171, 165, 140], // Teal
    getWidth: (d: VesselTrackPath) => (d.isCandidateTrack || d.isSuspectTrack ? 3 : 1.5),
  });
}

export default createTrackLayer;
