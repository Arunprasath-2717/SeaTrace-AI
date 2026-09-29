export interface ProbableZone {
  latitude: number;
  longitude: number;
  radiusKm: number;
  description?: string;
}

export interface ReleaseWindow {
  start: string; // ISO 8601
  end: string;   // ISO 8601
  estimatedDurationMinutes?: number;
}

export interface DriftEnsemble {
  runs: number;
  model: string;
  methodDescription?: string;
  convergenceRate: number; // 0.0 to 1.0
  oceanCurrentSource: string;
  windForcingSource: string;
  waveDataSource?: string;
  stokesDriftApplied?: boolean;
}

export interface Origin {
  probableZone: ProbableZone;
  releaseWindow: ReleaseWindow;
  uncertaintyDescription: string;
  uncertaintyKm: number; // 95th-percentile envelope radius
  ensemble: DriftEnsemble;
}
