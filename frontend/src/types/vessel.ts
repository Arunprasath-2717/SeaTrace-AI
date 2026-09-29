export type AisQuality = 'high' | 'medium' | 'gap_detected' | 'spoofed';

export type CandidateEvidenceStatus = 'Verified' | 'Needs Review' | 'Insufficient Evidence';

export interface VesselIdentity {
  name: string;
  mmsi: string;
  imo?: string;
  callsign?: string;
  flag?: string;
  vesselType?: string;
  destination?: string;
  draughtMeters?: number;
}

export interface VesselTrackPoint {
  latitude: number;
  longitude: number;
  timestamp: string;
  speedKnots?: number;
  headingDegrees?: number;
}

export interface VesselTrack {
  points: VesselTrackPoint[];
  coverageHours: number;
  gapMinutesMax?: number;
}

export interface CandidateVessel {
  id: string;
  identity: VesselIdentity;
  track: VesselTrack;
  temporalCompatibility: number; // 0.0 - 1.0 (relative index)
  spatialCompatibility: number;  // 0.0 - 1.0 (relative index)
  driftCompatibility: number;    // 0.0 - 1.0 (relative index)
  aisQuality: AisQuality;
  evidenceStatus: CandidateEvidenceStatus;
  evidenceCompatibilityScore?: number; // 0 - 100 relative compatibility index
  attributionScore?: number;           // Backwards compatibility alias
  supportingEvidence: string[];
  conflictingEvidence: string[];
  uncertaintyNotes: string[];
  investigationWindow: string;
  generationCriteria: string;
}
