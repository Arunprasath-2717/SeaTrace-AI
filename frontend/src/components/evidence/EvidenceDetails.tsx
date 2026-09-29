import React from 'react';
import { Card } from '../common/Card';
import { Evidence } from '../../types/evidence';
import { Badge } from '../common/Badge';
import { UserCheck, Hash, Calendar, Layers, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';

export const EvidenceDetails: React.FC<{ evidence: Evidence | null; className?: string }> = ({
  evidence,
  className = '',
}) => {
  if (!evidence) {
    return (
      <Card title="EVIDENCE DOSSIER" className={className}>
        <p className="text-xs text-seatrace-text-muted">Select an evidence item to inspect audit metadata.</p>
      </Card>
    );
  }

  return (
    <Card
      title={evidence.title}
      subtitle={`${evidence.stepLabel} • ID: ${evidence.id}`}
      headerAction={
        <Badge variant={evidence.status === 'verified' ? 'mint' : 'warning'} size="sm">
          {evidence.status.replace('_', ' ').toUpperCase()}
        </Badge>
      }
      className={className}
    >
      <div className="space-y-4 text-xs font-mono">
        {/* Description */}
        <p className="font-sans text-xs text-slate-800 font-medium leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-300">
          {evidence.description}
        </p>

        {/* Source & Timestamp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-300">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-700 font-bold uppercase mb-1">
              <UserCheck className="w-3.5 h-3.5 text-indigo-700" />
              Source & Provider
            </div>
            <div className="text-slate-900 font-black truncate" title={evidence.source}>
              {evidence.source}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-300">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-700 font-bold uppercase mb-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-700" />
              Observation / Record Timestamp
            </div>
            <div className="text-slate-900 font-black">
              {new Date(evidence.timestamp).toISOString().replace('T', ' ').substring(0, 19)} UTC
            </div>
          </div>
        </div>

        {/* Processing Step & Model / Method */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-300 space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-700 font-bold uppercase">
            <Layers className="w-3.5 h-3.5 text-indigo-700" />
            Processing Step
          </div>
          <p className="text-slate-900 font-black font-sans leading-relaxed">
            {evidence.processingStep}
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-700 font-bold uppercase pt-2">
            <Activity className="w-3.5 h-3.5 text-indigo-700" />
            Algorithm / Physical Model
          </div>
          <p className="text-indigo-900 font-black font-sans">
            {evidence.modelMethod}
          </p>
        </div>

        {/* Result & Uncertainty */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-300">
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-900 font-bold uppercase mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              Quantitative Result
            </div>
            <p className="text-slate-900 font-black font-sans leading-relaxed">
              {evidence.result}
            </p>
          </div>

          <div className="p-2.5 rounded-lg border border-amber-300 bg-amber-50">
            <div className="flex items-center gap-1.5 text-[10px] text-amber-900 font-bold uppercase mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              Quantified Uncertainty
            </div>
            <p className="text-amber-950 font-medium font-sans leading-relaxed">
              {evidence.uncertainty}
            </p>
          </div>
        </div>

        {/* Provenance & Checksum */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-300 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-slate-700 font-bold uppercase">
            <span className="flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-indigo-700" />
              Pipeline Provenance & Audit Hash
            </span>
            <span>Version: {evidence.provenance.pipelineVersion}</span>
          </div>
          <div className="text-[11px] text-slate-900 font-black break-all select-all font-mono bg-white p-2 rounded border border-slate-300">
            {evidence.provenance.checksum}
          </div>
          <div className="text-[10px] text-slate-700 font-medium flex justify-between">
            <span>Collector: {evidence.provenance.collector}</span>
            <span>Audit ID: {evidence.provenance.auditLogId || 'AUD-DEFAULT'}</span>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-300 text-[10px] text-slate-700 font-medium leading-relaxed font-sans">
          <strong>Evidentiary Notice:</strong> Cryptographic checksums and pipeline records confirm data provenance and internal processing integrity. They do not constitute automatic statutory proof of legal responsibility, which remains subject to judicial and administrative evaluation.
        </div>
      </div>
    </Card>
  );
};

export default EvidenceDetails;
