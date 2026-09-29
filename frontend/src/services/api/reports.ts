import apiClient from './client';
import { Report } from '../../types/report';

export interface GenerateReportPayload {
  incidentId: string;
  candidateId?: string;
  format: 'pdf' | 'json';
}

export const reportService = {
  async getReportByIncident(incidentId: string): Promise<Report> {
    return apiClient.get<Report>(`/api/v1/reports/${incidentId}`);
  },

  async generateReport(payload: GenerateReportPayload): Promise<Report> {
    return apiClient.post<Report>('/api/v1/reports/generate', payload);
  },
};

export default reportService;
