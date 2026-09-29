import apiClient from './client';
import { Origin } from '../../types/origin';

export interface OriginReconstructionParams {
  incidentId: string;
  ensembleRuns?: number;
  backtrackHours?: number;
}

export const originService = {
  async getOriginReconstruction(incidentId: string): Promise<Origin> {
    return apiClient.get<Origin>(`/api/v1/origin/${incidentId}`);
  },

  async runBackwardDrift(params: OriginReconstructionParams): Promise<Origin> {
    return apiClient.post<Origin>('/api/v1/origin/reconstruct', params);
  },
};

export default originService;
