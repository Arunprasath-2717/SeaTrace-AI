/**
 * Application Constants
 */
export const APP_NAME = 'SEATRACE';
export const APP_TAGLINE = 'Satellite-Enabled Attribution and Tracking of Oil Spills';
export const APP_SUBTITLE = 'MARITIME POLLUTION FORENSIC PLATFORM';
export const APP_POSITIONING = 'FROM DETECTION TO EVIDENCE.';

export const PIPELINE_STAGES = [
  { id: 'SATELLITE', label: 'Satellite', description: 'Sentinel-1 SAR acquisition' },
  { id: 'DETECT', label: 'Detection', description: 'Dual-stage deep segmentation' },
  { id: 'VALIDATE', label: 'Validation', description: 'Look-alike screening & wind regime' },
  { id: 'RECONSTRUCT', label: 'Origin', description: 'Lagrangian reverse drift ensemble' },
  { id: 'CORRELATE', label: 'AIS', description: 'Vessel trajectory spatiotemporal intersection' },
  { id: 'COUNTERFACTUAL', label: 'Counterfactual', description: 'Forward simulation compatibility test' },
  { id: 'HUMAN_REVIEW', label: 'Human Review', description: 'Forensic evaluation & audit sign-off' },
] as const;

export type PipelineStageId = typeof PIPELINE_STAGES[number]['id'];
export type PipelineStageStatus = 'completed' | 'processing' | 'pending' | 'needs_review' | 'failed';

export const SEEDED_INVESTIGATION_ID = 'ST-2026-0042';

export const DEFAULT_MAP_VIEW = {
  longitude: -90.218,
  latitude: 28.452,
  zoom: 8.5,
  minZoom: 2,
  maxZoom: 18,
  pitch: 0,
  bearing: 0,
};
