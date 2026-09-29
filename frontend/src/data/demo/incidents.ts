import { Incident } from '../../types/incident';

/**
 * SEEDED INVESTIGATION SCENARIOS — For algorithmic verification & prototype evaluation.
 * Clearly marked as synthetic / benchmark scenarios; does not represent verified real-world legal incidents.
 */
export const demoIncidents: Incident[] = [
  {
    id: 'ST-2026-0042',
    title: 'Maritime Pollution Investigation',
    location: {
      latitude: 28.452,
      longitude: -90.218,
      regionName: 'Northern Gulf of Mexico (Offshore Continental Shelf)',
    },
    status: 'investigating',
    statusLabel: 'Investigation in progress',
    acquisitionTime: '2026-09-24T14:22:10Z',
    satelliteScene: 'SENTINEL-1A_IW_GRDH_1SDV_20260924T142210',
    satelliteSensor: 'C-Band Synthetic Aperture Radar (SAR)',
    createdAt: '2026-09-24T15:05:00Z',
    estimatedAreaKm2: 14.8,
    imageQuality: 'Nominal — 20m spatial resolution, IW mode, VV/VH polarization',
    detectionStatus: 'Candidate Slick Delineated — Look-alike screening passed',
    isSeededScenario: true,
  },
  {
    id: 'ST-2026-0039',
    title: 'Offshore Discharge Evaluation',
    location: {
      latitude: 53.812,
      longitude: 3.125,
      regionName: 'North Sea (Dogger Bank Sector)',
    },
    status: 'confirmed',
    statusLabel: 'Screening complete — Ready for analyst review',
    acquisitionTime: '2026-09-23T06:14:32Z',
    satelliteScene: 'SENTINEL-1B_IW_GRDH_20260923T061432',
    satelliteSensor: 'C-Band SAR',
    createdAt: '2026-09-23T07:00:15Z',
    estimatedAreaKm2: 8.3,
    imageQuality: 'Moderate speckle noise in near-range',
    detectionStatus: 'Confirmed Anomalous Damping',
    isSeededScenario: true,
  },
  {
    id: 'ST-2026-0031',
    title: 'Traffic Lane Surveillance Alert',
    location: {
      latitude: 1.221,
      longitude: 103.882,
      regionName: 'Singapore Strait (Traffic Separation Scheme)',
    },
    status: 'resolved',
    statusLabel: 'Investigation closed by investigator',
    acquisitionTime: '2026-09-21T18:40:02Z',
    satelliteScene: 'SENTINEL-1A_IW_GRDH_20260921T184002',
    satelliteSensor: 'C-Band SAR',
    createdAt: '2026-09-21T19:15:00Z',
    estimatedAreaKm2: 3.1,
    imageQuality: 'High vessel density interference',
    detectionStatus: 'Archived with human sign-off',
    isSeededScenario: true,
  },
];

export default demoIncidents;
