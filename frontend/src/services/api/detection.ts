import apiClient from './client';
import { Detection } from '../../types/detection';

export interface TriggerDetectionPayload {
  sceneId: string;
  modelIdentifier?: string;
  confidenceThreshold?: number;
}

export const detectionService = {
  async getDetectionByScene(sceneId: string): Promise<Detection> {
    return apiClient.get<Detection>(`/api/v1/detection/${sceneId}`);
  },

  async runInference(payload: TriggerDetectionPayload): Promise<Detection> {
    return apiClient.post<Detection>('/api/v1/detection/run', payload);
  },
};

export default detectionService;
