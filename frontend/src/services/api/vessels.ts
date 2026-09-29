import apiClient from './client';
import { CandidateVessel } from '../../types/vessel';

export interface SearchVesselsParams {
  incidentId?: string;
  minCompatibility?: number;
  timeWindowHours?: number;
}

export const vesselService = {
  async getCandidateVessels(params?: SearchVesselsParams): Promise<CandidateVessel[]> {
    return apiClient.get<CandidateVessel[]>('/api/v1/vessels/candidates', {
      params: params as Record<string, string | number | boolean>,
    });
  },

  async getVesselById(id: string): Promise<CandidateVessel> {
    return apiClient.get<CandidateVessel>(`/api/v1/vessels/${id}`);
  },

  async getVesselTrack(id: string): Promise<CandidateVessel['track']> {
    return apiClient.get<CandidateVessel['track']>(`/api/v1/vessels/${id}/track`);
  },
};

export default vesselService;
