import { Simulation } from '../../types/simulation';

/**
 * SEEDED COUNTERFACTUAL FORWARD SIMULATION DATA
 * Testing hypothesis: "If candidate vessel discharged oil, would it evolve into the observed satellite slick?"
 */
export const demoSimulation: Simulation = {
  id: 'SIM-ST-2026-0042-01',
  candidateId: 'VESSEL-CANDIDATE-01',
  releaseHypothesis: {
    rateM3PerHour: 15.0,
    durationHours: 1.5,
    oilType: 'Medium Crude (API 31.2, Arab Light surrogate)',
    releaseStartTime: '2026-09-24T14:00:00Z',
    totalVolumeM3: 22.5,
  },
  predictedSlick: {
    coordinates: [
      [-90.248, 28.423],
      [-90.222, 28.479],
      [-90.183, 28.448],
      [-90.212, 28.398],
      [-90.248, 28.423],
    ],
    areaKm2: 14.2,
    dispersionScore: 0.88,
  },
  comparison: {
    iouScore: 0.84,
    centroidDistanceKm: 0.65,
    matchConfidence: 0.88,
  },
  status: 'completed',
};

export default demoSimulation;
