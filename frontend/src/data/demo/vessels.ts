import { CandidateVessel } from '../../types/vessel';

/**
 * SEEDED CANDIDATE VESSEL DATA — For algorithmic verification & prototype evaluation.
 * Note: These records represent hypothetical candidates identified through spatial-temporal
 * proximity to the reverse drift zone. They do NOT imply culpability or verified discharge.
 */
export const demoVessels: CandidateVessel[] = [
  {
    id: 'VESSEL-CANDIDATE-01',
    identity: {
      name: 'OCEAN VALIANT',
      mmsi: '211832000',
      imo: '9348123',
      callsign: 'DGX88',
      flag: 'Panama (PA)',
      vesselType: 'Crude Oil Tanker',
      destination: 'PORT ARTHUR, TX',
      draughtMeters: 14.2,
    },
    track: {
      coverageHours: 48,
      gapMinutesMax: 14,
      points: [
        { latitude: 28.12, longitude: -90.95, timestamp: '2026-09-24T08:00:00Z', speedKnots: 12.4, headingDegrees: 84 },
        { latitude: 28.31, longitude: -90.52, timestamp: '2026-09-24T11:30:00Z', speedKnots: 11.8, headingDegrees: 82 },
        { latitude: 28.46, longitude: -90.22, timestamp: '2026-09-24T14:15:00Z', speedKnots: 12.1, headingDegrees: 85 },
        { latitude: 28.62, longitude: -89.88, timestamp: '2026-09-24T17:00:00Z', speedKnots: 12.5, headingDegrees: 83 },
      ],
    },
    temporalCompatibility: 0.92,
    spatialCompatibility: 0.88,
    driftCompatibility: 0.85,
    aisQuality: 'high',
    evidenceStatus: 'Needs Review',
    evidenceCompatibilityScore: 88,
    attributionScore: 88,
    supportingEvidence: [
      'AIS trajectory intersects 95th-percentile reverse drift envelope at 14:15 UTC.',
      'Vessel speed maintained steady 12.1 kn, consistent with standard transit.',
      'Draft (14.2m) confirms vessel was operating laden at time of passage.',
      'Forward OpenOil simulation from crossing point reproduces observed slick elongation.',
    ],
    conflictingEvidence: [
      'Zero anomalous speed drops or course deviations recorded during transit.',
      'No concurrent optical satellite confirmation during cloud-free daylight hours.',
    ],
    uncertaintyNotes: [
      'Lagrangian particle dispersion envelope has a ±4.2 km spatial boundary.',
      'Short 14-minute terrestrial AIS gap occurred 30 km west of the incident zone.',
    ],
    investigationWindow: '2026-09-24 08:00 to 17:00 UTC (9-hour corridor)',
    generationCriteria: 'Spatial overlap with 95th-percentile reverse drift envelope within ±4 hours',
  },
  {
    id: 'VESSEL-CANDIDATE-02',
    identity: {
      name: 'NORDIC TRADER',
      mmsi: '257041000',
      imo: '9482914',
      callsign: 'LNZX',
      flag: 'Norway (NO)',
      vesselType: 'Bulk Carrier',
      destination: 'NEW ORLEANS, LA',
      draughtMeters: 10.8,
    },
    track: {
      coverageHours: 48,
      gapMinutesMax: 45,
      points: [
        { latitude: 27.95, longitude: -90.80, timestamp: '2026-09-24T06:00:00Z', speedKnots: 14.1, headingDegrees: 62 },
        { latitude: 28.25, longitude: -90.15, timestamp: '2026-09-24T10:45:00Z', speedKnots: 13.9, headingDegrees: 65 },
        { latitude: 28.58, longitude: -89.50, timestamp: '2026-09-24T15:30:00Z', speedKnots: 14.0, headingDegrees: 63 },
      ],
    },
    temporalCompatibility: 0.62,
    spatialCompatibility: 0.58,
    driftCompatibility: 0.44,
    aisQuality: 'medium',
    evidenceStatus: 'Insufficient Evidence',
    evidenceCompatibilityScore: 54,
    attributionScore: 54,
    supportingEvidence: [
      'Passed within 8.5 km of origin zone peripheral boundary during morning transit.',
    ],
    conflictingEvidence: [
      'Reverse drift model places release 3.5 hours later than vessel closest point of approach.',
      'Forward simulation from track generates slick displaced 11 km southeast of observed feature.',
    ],
    uncertaintyNotes: [
      '45-minute satellite AIS dropout between 10:45 and 11:30 UTC.',
    ],
    investigationWindow: '2026-09-24 06:00 to 15:30 UTC',
    generationCriteria: 'Regional corridor filter: 20 km search buffer',
  },
  {
    id: 'VESSEL-CANDIDATE-03',
    identity: {
      name: 'PACIFIC HORIZON',
      mmsi: '354921000',
      imo: '9182334',
      callsign: 'HP82',
      flag: 'Liberia (LR)',
      vesselType: 'Chemical Tanker',
      destination: 'HOUSTON, TX',
      draughtMeters: 9.5,
    },
    track: {
      coverageHours: 48,
      gapMinutesMax: 180,
      points: [
        { latitude: 28.02, longitude: -91.10, timestamp: '2026-09-24T04:00:00Z', speedKnots: 10.2, headingDegrees: 95 },
        { latitude: 28.40, longitude: -90.10, timestamp: '2026-09-24T12:00:00Z', speedKnots: 10.5, headingDegrees: 92 },
      ],
    },
    temporalCompatibility: 0.45,
    spatialCompatibility: 0.48,
    driftCompatibility: 0.38,
    aisQuality: 'gap_detected',
    evidenceStatus: 'Insufficient Evidence',
    evidenceCompatibilityScore: 42,
    attributionScore: 42,
    supportingEvidence: [
      'Track heading intersected regional fairway 6 hours prior to SAR observation.',
    ],
    conflictingEvidence: [
      'Substantial temporal offset (+6.2 hours prior to estimated release window).',
      'Ocean current trajectory carries hypothetical release outside observed observation box.',
    ],
    uncertaintyNotes: [
      'Prolonged AIS observation gap: 180 minutes without positional report.',
      'Dead-reckoned trajectory carries high lateral positional uncertainty.',
    ],
    investigationWindow: '2026-09-24 04:00 to 12:00 UTC',
    generationCriteria: 'Regional corridor filter: 20 km search buffer',
  },
];

export default demoVessels;
