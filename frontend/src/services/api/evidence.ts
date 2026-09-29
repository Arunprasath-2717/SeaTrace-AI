import apiClient from './client';
import { Evidence } from '../../types/evidence';

export const evidenceService = {
  async getEvidencePackage(incidentId: string): Promise<Evidence[]> {
    return apiClient.get<Evidence[]>(`/api/v1/evidence/${incidentId}`);
  },

  async verifyEvidenceItem(evidenceId: string): Promise<Evidence> {
    return apiClient.post<Evidence>(`/api/v1/evidence/${evidenceId}/verify`);
  },
};

export default evidenceService;
