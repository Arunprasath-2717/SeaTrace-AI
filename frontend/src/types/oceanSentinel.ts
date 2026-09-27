export type PageId =
  | 'command-center'
  | 'maritime-map'
  | 'spill-detection'
  | 'vessel-intelligence'
  | 'spill-attribution'
  | 'drift-prediction'
  | 'satellite-imagery'
  | 'incident-management'
  | 'analytics-reports'
  | 'data-sources'
  | 'settings';

export type IncidentSeverity = 'Critical' | 'High' | 'Medium' | 'Low';

export type IncidentStatus =
  | 'New'
  | 'Under Review'
  | 'Investigating'
  | 'Escalated'
  | 'Resolved'
  | 'Archived';

export interface SpillIncident {
  id: string;
  code: string;
  name: string;
  region: 'Arabian Sea' | 'Bay of Bengal' | 'Gulf of Mannar' | 'Six Degree Channel' | 'Mumbai High';
  lat: number;
  lng: number;
  estimatedAreaKm2: number;
  detectionTime: string;
  sensor: 'Sentinel-1 C-SAR' | 'RADARSAT-2' | 'Sentinel-2 MSI' | 'ALOS-2 PALSAR';
  confidencePct: number;
  severity: IncidentSeverity;
  status: IncidentStatus;
  oilType: string;
  estimatedVolumeBarrels: number;
  closestLandmark: string;
  coastalDistanceKm: number;
  assignedInvestigator: string;
  lastUpdated: string;
  description: string;
  polygon: [number, number][]; // [lat, lng]
  driftDirectionDeg: number;
  driftSpeedKts: number;
  suspectVesselId?: string;
  notes?: string[];
}

export type VesselType = 'VLCC Tanker' | 'Suezmax Tanker' | 'Chemical Tanker' | 'Container Ship' | 'Bulk Carrier' | 'Patrol Vessel';

export interface AISTrackPoint {
  lat: number;
  lng: number;
  timestamp: string;
  speedKts: number;
  headingDeg: number;
  status: 'Normal' | 'Signal Gap' | 'Speed Anomaly' | 'Course Change';
}

export interface Vessel {
  id: string;
  name: string;
  mmsi: string;
  imo: string;
  flag: string;
  country: string;
  type: VesselType;
  dwt: number;
  lengthM: number;
  beamM: number;
  speedKts: number;
  headingDeg: number;
  currentLat: number;
  currentLng: number;
  destination: string;
  eta: string;
  lastUpdate: string;
  distanceFromSpillKm: number;
  isDarkVessel: boolean;
  investigationStatus: 'Prime Suspect' | 'Person of Interest' | 'Cleared' | 'Unclassified';
  attributionScore: number;
  track: AISTrackPoint[];
  behaviorNotes?: string;
}

export interface CandidateAttribution {
  vesselId: string;
  vesselName: string;
  mmsi: string;
  totalScore: number; // 0 - 100
  spatialScore: number; // 0 - 100
  temporalScore: number; // 0 - 100
  driftCompatibilityScore: number; // 0 - 100
  behavioralAnomalyScore: number; // 0 - 100
  dataCompletenessScore: number; // 0 - 100
  keyFindings: string[];
}

export interface SatelliteScene {
  id: string;
  name: string;
  sensor: 'Sentinel-1 SAR' | 'Sentinel-2 Optical' | 'RADARSAT-2' | 'Landsat 9';
  acquisitionDate: string;
  region: string;
  cloudCoverPct: number;
  resolutionM: number;
  polarization?: string;
  bands?: string;
  thumbnailUrl: string;
  hasDetectedSlick: boolean;
  slickIncidentId?: string;
  fileSizeBytes: string;
}

export interface DataSourceStatus {
  id: string;
  name: string;
  type: 'Satellite SAR' | 'Satellite Optical' | 'AIS Transponders' | 'Weather & Currents' | 'Bathymetry' | 'Incidents DB';
  provider: string;
  status: 'Online' | 'Degraded' | 'Offline' | 'Simulated';
  lastSync: string;
  recordsCount: string;
  latencyMs: number;
  description: string;
}
