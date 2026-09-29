import apiClient from './client';
import { Incident } from '../../types/incident';

export interface GetIncidentsParams {
  status?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export const incidentService = {
  async getIncidents(params?: GetIncidentsParams): Promise<Incident[]> {
    return apiClient.get<Incident[]>('/api/v1/incidents', { params: params as Record<string, string | number | boolean> });
  },

  async getIncidentById(id: string): Promise<Incident> {
    return apiClient.get<Incident>(`/api/v1/incidents/${id}`);
  },

  async updateIncidentStatus(id: string, status: Incident['status']): Promise<Incident> {
    return apiClient.put<Incident>(`/api/v1/incidents/${id}/status`, { status });
  },
};

export default incidentService;
