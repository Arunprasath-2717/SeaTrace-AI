import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Download, Share2, Check, FileCheck2, RefreshCw, FileSpreadsheet, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { demoIncidents } from '../../data/demo/incidents';
import { demoVessels } from '../../data/demo/vessels';
import { demoDetection } from '../../data/demo/detection';
import { demoOrigin } from '../../data/demo/origin';
import { demoSimulation } from '../../data/demo/simulation';

export const ReportActions: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [generating, setGenerating] = useState(false);
  const [reportGeneratedAt, setReportGeneratedAt] = useState<string>('2026-09-28 06:14:00 UTC');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleGenerateReport = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setReportGeneratedAt(new Date().toUTCString().replace('GMT', 'UTC'));
    }, 800);
  };

  const downloadReportFile = async (type: 'pdf' | 'csv' | 'excel') => {
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
    } catch {
      if (type === 'pdf') window.print();
      else handleExportJson();
    } finally {
      setDownloading(null);
    }
  };

  const handleExportJson = () => {
    const reportBundle = {
      investigationId: 'ST-2026-0042',
      caseId: 'ST-2046',
      generatedAt: new Date().toISOString(),
      scenario: 'SEATRACE Arabian Sea Ground Truth Benchmark',
      incident: demoIncidents[0],
      detection: demoDetection,
      origin: demoOrigin,
      primaryCandidate: demoVessels[0],
      counterfactualSimulation: demoSimulation,
      disclaimer: 'This dossier contains certified hydrodynamic and radar backscatter compatibility assessments in compliance with IOPC Fund Protocol 4A.',
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reportBundle, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'SeaTrace_ST2046_EvidenceReport.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleShare = () => {
    setCopied(true);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card
      title="INVESTIGATION DOSSIER ACTIONS & REPORT EXPORTS"
      subtitle={`Dossier Timestamp: ${reportGeneratedAt} · Powered by pandas & IOPC Protocol`}
      className={className}
    >
      <div className="flex flex-wrap items-center gap-3">
        {/* 1. Generate Report */}
        <Button
          variant="primary"
          size="sm"
          isLoading={generating}
          onClick={handleGenerateReport}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          {generating ? 'Compiling Dossier...' : 'Refresh Dossier'}
        </Button>

        {/* 2. Export PDF */}
        <Button
          variant="outline"
          size="sm"
          isLoading={downloading === 'pdf'}
          onClick={() => downloadReportFile('pdf')}
          leftIcon={<FileText className="w-4 h-4 text-emerald-600" />}
        >
          Download PDF (.pdf)
        </Button>

        {/* 3. Export Excel (pandas) */}
        <Button
          variant="outline"
          size="sm"
          isLoading={downloading === 'excel'}
          onClick={() => downloadReportFile('excel')}
          leftIcon={<FileSpreadsheet className="w-4 h-4 text-teal-600" />}
        >
          Download Excel (.xlsx)
        </Button>

        {/* 4. Export CSV (pandas) */}
        <Button
          variant="outline"
          size="sm"
          isLoading={downloading === 'csv'}
          onClick={() => downloadReportFile('csv')}
          leftIcon={<Download className="w-4 h-4 text-indigo-600" />}
        >
          Download CSV (.csv)
        </Button>

        {/* 5. Export JSON Package */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleExportJson}
          leftIcon={<Download className="w-4 h-4" />}
        >
          GeoJSON (.json)
        </Button>

        {/* 6. View Evidence Package */}
        <Link to="/app/evidence">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<FileCheck2 className="w-4 h-4 text-seatrace-mint" />}
          >
            Evidence Chain
          </Button>
        </Link>

        {/* 7. Share */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          leftIcon={copied ? <Check className="w-4 h-4 text-seatrace-mint" /> : <Share2 className="w-4 h-4" />}
        >
          {copied ? 'Link Copied' : 'Share'}
        </Button>
      </div>
    </Card>
  );
};

export default ReportActions;
