import { Detection } from '../../types/detection';

/**
 * SEEDED SATELLITE DETECTION DATA
 * Evaluation metrics explicitly set to 'Pending evaluation' to adhere to non-fabrication principles.
 */
export const demoDetection: Detection = {
  sceneId: 'SENTINEL-1A_IW_GRDH_1SDV_20260924T142210',
  sensor: 'C-Band Synthetic Aperture Radar (SAR)',
  mode: 'Interferometric Wide (IW)',
  polarization: 'Dual Polarization (VV + VH)',
  passType: 'Descending',
  acquisitionTime: '2026-09-24T14:22:10Z',
  resolutionMeters: 20,
  area: 14.8,
  mask: 'POLYGON((-90.25 28.42, -90.22 28.48, -90.18 28.45, -90.21 28.40, -90.25 28.42))',
  imageQuality: 'optimal',
  imageQualityDescription: 'Nominal radiometry, no severe radio-frequency interference (RFI) or scalloping',
  detectionStatus: 'Segmented Candidate Slick Feature',
  lookAlikeAssessment: [
    {
      type: 'Natural Biogenic Surfactant Films',
      description: 'Organic sea-surface slicks produced by plankton or fish schools',
      assessment: 'Ruled out',
      physicalBasis: 'Chlorophyll-a proxy shows negligible algal concentration; slick edges are sharp and elongated along transit route rather than following spiral eddy swirls.',
    },
    {
      type: 'Low-Wind Calm Areas (< 3 m/s)',
      description: 'Wind shadows where lack of capillary waves mimics radar backscatter damping',
      assessment: 'Ruled out',
      physicalBasis: 'Coincident ERA5 10m wind speed is 6.4 m/s (well above the 3.0 m/s threshold required for capillary backscatter).',
    },
    {
      type: 'Internal Solitary Waves',
      description: 'Subsurface oceanic waves creating alternating bright and dark radar bands',
      assessment: 'Ruled out',
      physicalBasis: 'No parallel banded fringe patterns observed in nearby 50 km sub-aperture analysis.',
    },
    {
      type: 'Upwelling Zones & Thermal Fronts',
      description: 'Cold water divergence suppressing capillary ripples',
      assessment: 'Low probability',
      physicalBasis: 'SST gradient across feature is < 0.3°C (no sharp thermal front).',
    },
  ],
  models: {
    unet: {
      id: 'unet',
      name: 'ResNet50-UNet Baseline',
      architecture: 'U-Net with ResNet50 Encoder',
      backbone: 'ResNet50 (ImageNet pre-trained)',
      parameters: '32.5M',
      metrics: {
        iou: 'Pending evaluation',
        dice: 'Pending evaluation',
        precision: 'Pending evaluation',
        recall: 'Pending evaluation',
        f1: 'Pending evaluation',
        inferenceTimeMs: 'Pending evaluation',
        evaluationStatus: 'Pending evaluation',
      },
      notes: 'Standard dual-polarization SAR segmentation baseline trained on historical maritime scenes.',
    },
    segformer: {
      id: 'segformer',
      name: 'SegFormer-B2 Transformer',
      architecture: 'Hierarchical Transformer Encoder + MLP Decoder',
      backbone: 'MiT-B2',
      parameters: '24.7M',
      metrics: {
        iou: 'Pending evaluation',
        dice: 'Pending evaluation',
        precision: 'Pending evaluation',
        recall: 'Pending evaluation',
        f1: 'Pending evaluation',
        inferenceTimeMs: 'Pending evaluation',
        evaluationStatus: 'Pending evaluation',
      },
      notes: 'Attention-based architecture designed for multiscale context in marine radar imagery.',
    },
  },
};

export default demoDetection;
