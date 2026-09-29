export type EvidenceType =
  | 'satellite_observation'
  | 'ai_detection'
  | 'lookalike_validation'
  | 'origin_reconstruction'
  | 'ais_correlation'
  | 'counterfactual_test'
  | 'uncertainty_assessment'
  | 'human_review';

export type EvidenceStatus = 'verified' | 'under_review' | 'needs_attention';

export interface ProvenanceRecord {
  collector: string;
  checksum: string;
  pipelineVersion: string;
  timestamp: string;
  auditLogId?: string;
}

export interface Evidence {
  id: string;
  stepNumber: number;
  stepLabel: string;
  type: EvidenceType;
  title: string;
  status: EvidenceStatus;
  source: string;
  timestamp: string;
  processingStep: string;
  modelMethod: string;
  result: string;
  uncertainty: string;
  description: string;
  provenance: ProvenanceRecord;
}
