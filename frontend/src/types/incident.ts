export type IncidentStatus = 'investigating' | 'confirmed' | 'dismissed' | 'resolved';

export interface GeoLocation {
  latitude: number;
  longitude: number;
  regionName: string;
}

export interface Incident {
  id: string;
  title?: string;
  location: GeoLocation;
  status: IncidentStatus;
  statusLabel?: string;
  acquisitionTime: string;
  satelliteScene: string;
  satelliteSensor?: string;
  createdAt: string;
  estimatedAreaKm2?: number;
  imageQuality?: string;
  detectionStatus?: string;
  isSeededScenario?: boolean;
}
