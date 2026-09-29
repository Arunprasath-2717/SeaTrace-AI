export type ImageQuality = 'optimal' | 'moderate' | 'degraded';

export interface ModelBenchmarkMetrics {
  iou?: number | string;
  dice?: number | string;
  precision?: number | string;
  recall?: number | string;
  f1?: number | string;
  inferenceTimeMs?: number | string;
  evaluationStatus: 'Evaluated' | 'Pending evaluation' | 'Not evaluated';
}

export interface ModelVariantInfo {
  id: 'unet' | 'segformer';
  name: string;
  architecture: string;
  backbone: string;
  parameters: string;
  metrics: ModelBenchmarkMetrics;
  notes: string;
}

export interface LookAlikeItem {
  type: string;
  description: string;
  assessment: 'Ruled out' | 'Low probability' | 'Needs field verification';
  physicalBasis: string;
}

export interface Detection {
  sceneId: string;
  sensor: string;
  mode: string;
  polarization: string;
  passType: 'Ascending' | 'Descending';
  acquisitionTime: string;
  resolutionMeters: number;
  area: number; // square kilometers
  mask: string;
  imageQuality: ImageQuality;
  imageQualityDescription: string;
  detectionStatus: string;
  lookAlikeAssessment: LookAlikeItem[];
  models: {
    unet: ModelVariantInfo;
    segformer: ModelVariantInfo;
  };
}
