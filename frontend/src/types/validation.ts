import { ImageQuality } from './detection';

export type ValidationStatus = 'pending' | 'valid' | 'invalid' | 'inconclusive';
export type LookAlikeRisk = 'low' | 'medium' | 'high';
export type ConsistencyLevel = 'high' | 'medium' | 'low' | 'inconsistent';

export interface Validation {
  status: ValidationStatus;
  lookAlikeRisk: LookAlikeRisk;
  imageQuality: ImageQuality;
  environmentalConsistency: ConsistencyLevel;
  temporalConsistency: ConsistencyLevel;
  windSpeedKnots?: number;
  waveHeightMeters?: number;
  algaeBloomProbability?: number;
  biogenicSheenRisk?: number;
}
