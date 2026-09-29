import apiClient from './client';
import { Validation } from '../../types/validation';

export interface AssessLookAlikePayload {
  sceneId: string;
  slickCoordinates: [number, number][];
}

export const validationService = {
  async getValidationStatus(sceneId: string): Promise<Validation> {
    return apiClient.get<Validation>(`/api/v1/validation/${sceneId}`);
  },

  async assessLookAlike(payload: AssessLookAlikePayload): Promise<Validation> {
    return apiClient.post<Validation>('/api/v1/validation/assess', payload);
  },
};

export default validationService;
