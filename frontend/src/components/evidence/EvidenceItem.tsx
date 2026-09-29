import React from 'react';
import { Evidence } from '../../types/evidence';
import { Badge } from '../common/Badge';
import {
  Satellite,
  Scan,
  ShieldCheck,
  Compass,
  Ship,
  GitCompare,
  AlertTriangle,
  UserCheck,
  FileCheck2,
} from 'lucide-react';

export interface EvidenceItemProps {
  evidence: Evidence;
  isSelected?: boolean;
  onSelect?: () => void;
  className?: string;
}

export const EvidenceItem: React.FC<EvidenceItemProps> = ({
  evidence,
  isSelected = false,
  onSelect,
  className = '',
}) => {
  const getTypeIcon = (type: Evidence['type']) => {
    switch (type) {
      case 'satellite_observation':
        return <Satellite className="w-4 h-4 text-indigo-700" />;
      case 'ai_detection':
        return <Scan className="w-4 h-4 text-teal-700" />;
      case 'lookalike_validation':
        return <ShieldCheck className="w-4 h-4 text-emerald-700" />;
      case 'origin_reconstruction':
        return <Compass className="w-4 h-4 text-sky-700" />;
      case 'ais_correlation':
        return <Ship className="w-4 h-4 text-indigo-800" />;
      case 'counterfactual_test':
        return <GitCompare className="w-4 h-4 text-purple-700" />;
      case 'uncertainty_assessment':
        return <AlertTriangle className="w-4 h-4 text-amber-700" />;
      case 'human_review':
        return <UserCheck className="w-4 h-4 text-emerald-700" />;
      default:
        return <FileCheck2 className="w-4 h-4 text-slate-700" />;
    }
  };

  const getStatusBadge = (status: Evidence['status']) => {
    switch (status) {
      case 'verified':
        return <Badge variant="mint" size="sm">VERIFIED</Badge>;
      case 'needs_attention':
        return <Badge variant="danger" size="sm">NEEDS ATTENTION</Badge>;
      case 'under_review':
      default:
        return <Badge variant="warning" size="sm">UNDER REVIEW</Badge>;
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
        isSelected
          ? 'bg-indigo-50/90 border-indigo-600 shadow-md ring-1 ring-indigo-500'
          : 'bg-white hover:bg-slate-50 border-slate-300 shadow-sm'
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 border border-slate-200">
            {getTypeIcon(evidence.type)}
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-mono uppercase tracking-wider text-indigo-800 font-bold">
              {evidence.stepLabel}
            </div>
            <h4 className="text-xs font-black text-slate-900 truncate">
              {evidence.title}
            </h4>
          </div>
        </div>
        {getStatusBadge(evidence.status)}
      </div>

      <p className="text-[11px] text-slate-700 font-medium line-clamp-2 leading-relaxed mb-2.5">
        {evidence.description}
      </p>

      <div className="flex items-center justify-between text-[10px] font-mono text-slate-600 font-semibold border-t border-slate-200 pt-2">
        <span className="truncate max-w-[200px]">{evidence.source}</span>
        {evidence.provenance.checksum && (
          <span className="text-slate-900 font-bold flex-shrink-0 ml-2">
            ID: {evidence.provenance.checksum.substring(0, 10)}...
          </span>
        )}
      </div>
    </div>
  );
};

export default EvidenceItem;
