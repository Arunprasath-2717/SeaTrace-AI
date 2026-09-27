// Types for SeaTrace AI - 3D Maritime Intelligence Platform

export type VesselType = 'Tanker' | 'Cargo' | 'Fishing' | 'Offshore' | 'Patrol' | 'Other';

export interface AISWaypoint {
  lat: number;
  lng: number;
  timestamp: string; // ISO string
  speedKts: number;
  headingDeg: number;
  aisStatus: 'Normal' | 'Signal Gap' | 'Speed Anomaly' | 'Course Change';
}

export interface Vessel {
  id: string;
  mmsi: string;
  name: string;
  flag: string;
  countryCode: string;
  type: VesselType;
  subType?: string;
  dwt?: number; // Deadweight tonnage
  lengthM: number;
  beamM: number;
  speedKts: number;
  headingDeg: number;
  currentLat: number;
  currentLng: number;
  destination: string;
  eta: string;
  cargoType?: string;
  aisTrajectory: AISWaypoint[];
  isDarkVessel?: boolean;
  anomalyScore?: number; // 0 - 100
}

export interface SpillIntensityZone {
  level: 'core' | 'high' | 'medium' | 'low';
  color: string;
  description: string;
}

export interface DriftStep {
  hoursOffset: number;
  timestamp: string;
  centerLat: number;
  centerLng: number;
  areaKm2: number;
  slickPolygon: [number, number][]; // [lng, lat] GeoJSON format
  windSpeedKts: number;
  windDirDeg: number;
  currentSpeedKts: number;
  currentDirDeg: number;
}

export interface CandidateVesselAttribution {
  vesselId: string;
  vesselName: string;
  mmsi: string;
  vesselType: VesselType;
  rank: number;
  evidenceScore: number; // 0 - 100
  distanceAtOriginKm: number;
  timeDifferenceHours: number;
  trajectoryConsistencyPct: number;
  driftCompatibilityPct: number;
  aisIntegrityStatus: string;
  speedAnomalyDescription: string;
  notes: string;
  historicalTrackDuringIncident: [number, number][]; // [lng, lat]
}

export interface OilSpillIncident {
  id: string;
  code: string; // e.g. "ST-2046"
  name: string;
  region: string;
  lat: number;
  lng: number;
  estimatedAreaKm2: number;
  detectionTime: string; // ISO
  satelliteSensor: string; // e.g. "Sentinel-1 SAR C-Band"
  sensorBand: string;
  resolutionM: number;
  confidencePct: number;
  severity: 'Critical' | 'High' | 'Moderate' | 'Low';
  status: 'Active Alert' | 'Under Investigation' | 'Attribution Confirmed' | 'Contained';
  slickPolygon: [number, number][]; // [lng, lat] coordinates forming the irregular boundary
  internalHeatmapRings?: [number, number][][]; // Concentric high-intensity cores
  probableOrigin: {
    lat: number;
    lng: number;
    estimatedTime: string;
    uncertaintyRadiusKm: number;
  };
  backwardDriftTrajectory: [number, number][]; // [lng, lat] backtracked path to origin
  forwardDriftForecast: DriftStep[];
  metOcean: {
    windSpeedKts: number;
    windDirectionDeg: number;
    currentSpeedKts: number;
    currentDirectionDeg: number;
    seaSurfaceTempC: number;
    waveHeightM: number;
  };
  candidates: CandidateVesselAttribution[];
  oilType: string;
  estimatedVolumeBarrels: number;
  coastalThreatDistanceKm: number;
  closestLandmark: string;
  description: string;
}

export interface LayerVisibilityState {
  satelliteImagery: boolean;
  spillPolygons: boolean;
  spillIntensityHeatmap: boolean;
  vesselPositions: boolean;
  historicalAISTracks: boolean;
  candidateVesselTracks: boolean;
  backwardDriftPaths: boolean;
  driftForecastPath: boolean;
  oceanCurrentVectors: boolean;
  maritimeBoundaries: boolean;
  atmosphereGlow: boolean;
  nightLights: boolean;
}

export type GlobeTheme = 'satellite' | 'dark' | 'night' | 'bathymetric';

export interface CameraPosition {
  lat: number;
  lng: number;
  altitude: number;
}
