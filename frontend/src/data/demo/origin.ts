import { Origin } from '../../types/origin';

/**
 * SEEDED ORIGIN RECONSTRUCTION DATA — Hydrodynamic backward drift ensemble.
 */
export const demoOrigin: Origin = {
  probableZone: {
    latitude: 28.46,
    longitude: -90.23,
    radiusKm: 2.8,
    description: '95th-Percentile Particle Envelope (Estimated Spill Origin)',
  },
  releaseWindow: {
    start: '2026-09-24T13:45:00Z',
    end: '2026-09-24T14:30:00Z',
    estimatedDurationMinutes: 45,
  },
  uncertaintyDescription: '95th-percentile particle dispersion envelope with ±4.2 km spatial boundary',
  uncertaintyKm: 4.2,
  ensemble: {
    runs: 50,
    model: 'OpenDrift / OpenOil Lagrangian Particle Tracking (v1.8)',
    methodDescription: 'Reverse-time hydrodynamic advection with 50-member stochastic wind & current perturbation',
    convergenceRate: 0.91,
    oceanCurrentSource: 'HYCOM Global 1/12° Analysis (3-hourly)',
    windForcingSource: 'ECMWF ERA5 10m Wind Fields (hourly)',
    waveDataSource: 'NOAA WaveWatch III (Significant Wave Height 1.2m)',
    stokesDriftApplied: true,
  },
};

export default demoOrigin;
