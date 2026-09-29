export interface ReleaseHypothesis {
  rateM3PerHour: number;
  durationHours: number;
  oilType: string;
  releaseStartTime: string;
  totalVolumeM3?: number;
}

export interface PredictedSlick {
  coordinates: [number, number][]; // [longitude, latitude]
  areaKm2: number;
  dispersionScore?: number;
}

export interface SimulationComparison {
  iouScore: number;            // Intersection over Union (0.0 - 1.0)
  centroidDistanceKm: number;  // Distance between predicted & observed centroid
  matchConfidence: number;     // 0.0 - 1.0
}

export interface Simulation {
  id: string;
  candidateId: string;
  releaseHypothesis: ReleaseHypothesis;
  predictedSlick: PredictedSlick;
  comparison: SimulationComparison;
  status?: 'queued' | 'running' | 'completed' | 'failed';
}
