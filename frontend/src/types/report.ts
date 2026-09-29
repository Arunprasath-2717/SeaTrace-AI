export type ReportStatus = 'draft' | 'final' | 'archived';

export interface Report {
  id: string;
  incidentId: string;
  status: ReportStatus;
  createdAt: string;
  version: string;
  summary?: string;
  attributionSubject?: string;
  exportedFormats?: ('pdf' | 'json' | 'docx')[];
}
