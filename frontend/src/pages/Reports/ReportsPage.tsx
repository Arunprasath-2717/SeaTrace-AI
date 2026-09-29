import React, { useState } from 'react';
import { ReportSummary } from '../../components/reports/ReportSummary';
import { ReportActions } from '../../components/reports/ReportActions';
import { FileText, Download, Shield, CheckCircle2, ChevronRight, Calendar, Clock } from 'lucide-react';

const BG   = '#f8fafc';
const CARD = { background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' } as React.CSSProperties;
const CHIP = (c: string) => ({ background: c, borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 800, color: '#fff', letterSpacing: '.04em' });

const REPORTS = [
  { id: 'RPT-2046-A', title: 'IOPC Incident Report', status: 'Final', date: 'Sep 28, 2026', type: 'Legal', typeColor: '#ef4444' },
  { id: 'RPT-2046-B', title: 'SAR Evidence Compendium', status: 'Draft', date: 'Sep 27, 2026', type: 'Technical', typeColor: '#4f46e5' },
  { id: 'RPT-2046-C', title: 'Attribution Intelligence Brief', status: 'Review', date: 'Sep 26, 2026', type: 'Intelligence', typeColor: '#ea580c' },
  { id: 'RPT-2046-D', title: 'Coast Guard Dispatch Summary', status: 'Final', date: 'Sep 25, 2026', type: 'Operational', typeColor: '#0284c7' },
];

const STATUS_COLOR: Record<string, string> = { Final: '#059669', Draft: '#ea580c', Review: '#4f46e5' };

const STATS = [
  { label: 'Total Reports', value: '4', color: '#4f46e5', icon: FileText },
  { label: 'Finalised', value: '2', color: '#059669', icon: CheckCircle2 },
  { label: 'Attribution Score', value: '94/100', color: '#ef4444', icon: Shield },
  { label: 'Next Submission', value: '3 days', color: '#ea580c', icon: Calendar },
];

export const ReportsPage: React.FC = () => {
  const [selected, setSelected] = useState('RPT-2046-A');
  const [downloading, setDownloading] = useState<string | null>(null);

  const downloadReportFile = async (type: 'pdf' | 'excel' | 'csv') => {
    setDownloading(type);
    try {
      const res = await fetch(`/api/export/${type}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const ext = type === 'excel' ? 'xlsx' : type;
      let filename = `SeaTrace_ST2046_EvidenceReport.${ext}`;
      const disposition = res.headers.get('Content-Disposition');
      if (disposition && disposition.includes('filename=')) {
        filename = disposition.split('filename=')[1].replace(/"/g, '').trim();
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Download error:', e);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: BG, padding: 16, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 1480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: 0 }}>Attribution Forensic Reports</h1>
            <p style={{ fontSize: 13, color: '#334155', fontWeight: 600, marginTop: 4 }}>
              Certified investigative reports compiled for maritime authorities and environmental regulators · Powered by pandas
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={() => downloadReportFile('pdf')}
              disabled={downloading !== null}
              title="Download certified PDF legal evidence dossier"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: '#059669', color: '#fff', border: 'none',
                borderRadius: 8, padding: '7px 12px', fontSize: 11, fontWeight: 800,
                cursor: 'pointer', boxShadow: '0 2px 8px rgba(5,150,105,0.25)',
              }}
            >
              <FileText style={{ width: 14, height: 14 }} />
              {downloading === 'pdf' ? 'Generating...' : 'PDF Dossier'}
            </button>
            <button
              onClick={() => downloadReportFile('excel')}
              disabled={downloading !== null}
              title="Download multi-tab Excel workbook generated with pandas & openpyxl"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: '#0d9488', color: '#fff', border: 'none',
                borderRadius: 8, padding: '7px 12px', fontSize: 11, fontWeight: 800,
                cursor: 'pointer', boxShadow: '0 2px 8px rgba(13,148,136,0.25)',
              }}
            >
              <Download style={{ width: 14, height: 14 }} />
              {downloading === 'excel' ? 'Generating...' : 'Excel (.xlsx)'}
            </button>
            <button
              onClick={() => downloadReportFile('csv')}
              disabled={downloading !== null}
              title="Download structured multi-section CSV generated with pandas"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: '#4f46e5', color: '#fff', border: 'none',
                borderRadius: 8, padding: '7px 12px', fontSize: 11, fontWeight: 800,
                cursor: 'pointer', boxShadow: '0 2px 8px rgba(79,70,229,0.25)',
              }}
            >
              <Download style={{ width: 14, height: 14 }} />
              {downloading === 'csv' ? 'Generating...' : 'CSV (.csv)'}
            </button>
          </div>
        </div>

        {/* Stats (Bigger & Darker) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} style={{ ...CARD, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: s.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon style={{ width: 22, height: 22, color: s.color }} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#334155', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.03em' }}>{s.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', lineHeight: 1.1, marginTop: 2 }}>{s.value}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Report logs + Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

          {/* Report list */}
          <div style={{ ...CARD, padding: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Dossier Archive
              <button style={{ fontSize: 11, color: '#6366f1', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}>
                See All <ChevronRight style={{ width: 13, height: 13 }} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {REPORTS.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setSelected(r.id)}
                  style={{
                    padding: '12px 16px', borderRadius: 16, cursor: 'pointer', transition: 'all 0.15s',
                    border: selected === r.id ? '1.5px solid #6366f1' : '1px solid #f1f5f9',
                    background: selected === r.id ? '#6366f108' : '#f8fafc80',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: r.typeColor + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <FileText style={{ width: 15, height: 15, color: r.typeColor }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>{r.title}</div>
                      <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                        <Clock style={{ width: 11, height: 11 }} />{r.date}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ ...CHIP(r.typeColor), fontSize: 9 }}>{r.type}</span>
                    <span style={{ background: STATUS_COLOR[r.status] + '20', color: STATUS_COLOR[r.status], borderRadius: 999, padding: '2px 8px', fontSize: 9, fontWeight: 700 }}>
                      {r.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Report summary */}
          <div style={{ ...CARD, padding: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 14 }}>Report Preview</div>
            <ReportSummary />
          </div>
        </div>

        {/* Export Actions */}
        <div style={{ ...CARD, padding: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Download style={{ width: 15, height: 15, color: '#6366f1' }} />
            Distribution & Export
          </div>
          <ReportActions />
        </div>

        {/* Legal core banner */}
        <div style={{
          borderRadius: 24, padding: '20px 28px',
          background: 'linear-gradient(135deg, #ef4444 0%, #f97316 55%, #f59e0b 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
          boxShadow: '0 8px 32px rgba(239,68,68,0.2)',
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 4 }}>IOPC Legal Attribution Core</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>
              Case: ST-2046 · Suspect: MT OCEAN TITAN · Status: Attribution Pending Port-State Inspection
            </div>
          </div>
          <button style={{
            padding: '10px 22px', borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: 'pointer',
            background: 'rgba(255,255,255,0.25)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)',
            backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            Submit to IOPC <ChevronRight style={{ width: 14, height: 14 }} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReportsPage;
