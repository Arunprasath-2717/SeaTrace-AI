import apiClient from './client';
import { Simulation, ReleaseHypothesis } from '../../types/simulation';

export interface RunSimulationPayload {
  candidateId: string;
  incidentId: string;
  hypothesis: ReleaseHypothesis;
}

export const simulationService = {
  async getSimulationById(id: string): Promise<Simulation> {
    return apiClient.get<Simulation>(`/api/v1/simulations/${id}`);
  },

  async runForwardSimulation(payload: RunSimulationPayload): Promise<Simulation> {
    return apiClient.post<Simulation>('/api/v1/simulations/run', payload);
  },
};

export default simulationService;
