import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { CheckCircle2, Clock, ShieldCheck, FileCheck, Layers, Wind, History } from 'lucide-react';

export type ValidationStatus = 'Verified' | 'Needs Review' | 'Insufficient Evidence';

export interface ValidationChecklistItem {
  id: string;
  name: string;
  question: string;
  status: ValidationStatus;
  finding: string;
  evidenceBasis: string;
  uncertaintyOrLimits: string;
  icon: React.ElementType;
}

const validationChecklistItems: ValidationChecklistItem[] = [
  {
    id: 'val-1',
    name: '1. AI Detection Segmentation',
    question: 'Did independent segmentation models confirm a coherent backscatter depression?',
    status: 'Verified',
    finding: 'U-Net and SegFormer extract contiguous 14.8 km² polygon with sharp boundary.',
    evidenceBasis: 'Backscatter attenuation of -7.2 dB relative to ambient water in VV channel.',
    uncertaintyOrLimits: 'Model IoU benchmark: 0.89; awaiting in-situ marine ground truth confirmation.',
    icon: ShieldCheck,
  },
  {
    id: 'val-2',
    name: '2. SAR Radiometric Quality',
    question: 'Is radar scene free of RF interference, scalloping, and platform artifacts?',
    status: 'Verified',
    finding: 'Sentinel-1A IW GRDH product exhibits nominal stability across 250 km swath.',
    evidenceBasis: 'ESA Quality Assessment: Zero dropped packets, nominal Doppler centroid.',
    uncertaintyOrLimits: '20m pixel resolution limit precludes sheen layers below 0.1 µm thickness.',
    icon: FileCheck,
  },
  {
    id: 'val-3',
    name: '3. Look-alike Phenomenon Screening',
    question: 'Have natural biogenic films, grease ice, and internal solitary waves been excluded?',
    status: 'Needs Review',
    finding: 'Biogenic surfactants and solitary waves ruled out; upwelling gradient is low.',
    evidenceBasis: 'Copernicus OLCI optical telemetry confirms chlorophyll-a < 0.11 mg/m³.',
    uncertaintyOrLimits: 'Nearshore organic films cannot be 100% ruled out without sea-surface sampling.',
    icon: Layers,
  },
  {
    id: 'val-4',
    name: '4. Environmental Regime Consistency',
    question: 'Was ambient wind within the 3.0 to 12.0 m/s physical radar visibility window?',
    status: 'Verified',
    finding: 'Coincident ECMWF ERA5 10m wind speed measured at 6.4 m/s (moderate breeze).',
    evidenceBasis: 'Sustained Bragg capillary wave resonance active while below dispersion limit.',
    uncertaintyOrLimits: 'ERA5 reanalysis is hourly; microscale convective squalls may introduce shifts.',
    icon: Wind,
  },
  {
    id: 'val-5',
    name: '5. Weathering & Temporal Consistency',
    question: 'Is the spatial extent consistent with expected oceanic spreading rates?',
    status: 'Needs Review',
    finding: 'Fay spreading formulation indicates 14.8 km² slick fits 45–90 min discharge window.',
    evidenceBasis: 'Backward OpenDrift trajectory matches candidate vessel transit corridor timing.',
    uncertaintyOrLimits: 'Secondary satellite pass at T+12h required to confirm natural dispersion rate.',
    icon: History,
  },
];

export const ValidationChecklist: React.FC<{ className?: string }> = ({ className = '' }) => {
  const getStatusBadge = (status: ValidationStatus) => {
    switch (status) {
      case 'Verified':
        return <Badge variant="mint" size="sm">VERIFIED</Badge>;
      case 'Needs Review':
        return <Badge variant="warning" size="sm">NEEDS REVIEW</Badge>;
      case 'Insufficient Evidence':
      default:
        return <Badge variant="danger" size="sm">INSUFFICIENT EVIDENCE</Badge>;
    }
  };

  const getStatusIcon = (status: ValidationStatus) => {
    switch (status) {
      case 'Verified':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />;
      case 'Needs Review':
        return <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />;
      case 'Insufficient Evidence':
      default:
        return <Clock className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />;
    }
  };

  return (
    <Card
      title="SYSTEMATIC VALIDATION CHECKLIST"
      subtitle="Exclusion of false-positive radar damping phenomena"
      headerAction={
        <div className="flex items-center gap-1.5">
          <Badge variant="mint" size="sm">3 VERIFIED</Badge>
          <Badge variant="warning" size="sm">2 REVIEW</Badge>
        </div>
      }
      className={`${className} h-full flex flex-col`}
    >
      <div className="space-y-3 flex-1 flex flex-col justify-between font-sans">
        {/* Row 0: Top Protocol Banner (Aligned with right column banner) */}
        <div className="min-h-[58px] p-3 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-xs font-sans text-slate-900 dark:text-slate-100 flex items-center shadow-2xs">
          <div>
            <span className="font-black text-indigo-950 dark:text-indigo-300 uppercase tracking-wide mr-1.5">
              Disambiguation Protocol:
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 leading-snug">
              Automated classification requires physical verification against 5 metocean and backscatter criteria prior to legal origin reconstruction.
            </span>
          </div>
        </div>

        {/* Rows 1–5: Criteria Items */}
        <div className="space-y-2.5">
          {validationChecklistItems.map((item) => {
            const ItemIcon = item.icon;
            return (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-50/90 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800 transition-all hover:border-slate-400 shadow-2xs"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-start gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                      <ItemIcon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-black text-slate-950 dark:text-white font-sans tracking-tight">
                          {item.name}
                        </h4>
                        {getStatusIcon(item.status)}
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold mt-0.5 leading-snug truncate">
                        {item.question}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0">{getStatusBadge(item.status)}</div>
                </div>

                {/* 3-line structured box */}
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                    <span className="font-black text-slate-950 dark:text-slate-100 shrink-0 min-w-[96px]">Finding:</span>
                    <span className="text-slate-900 dark:text-slate-200 font-semibold leading-relaxed truncate">{item.finding}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                    <span className="font-black text-slate-950 dark:text-slate-100 shrink-0 min-w-[96px]">Evidence Basis:</span>
                    <span className="text-indigo-950 dark:text-cyan-300 font-bold leading-relaxed truncate">{item.evidenceBasis}</span>
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-1.5 text-[11px] flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                    <span className="font-black text-amber-900 dark:text-amber-400 shrink-0 min-w-[96px] uppercase tracking-wide">Limitation:</span>
                    <span className="text-amber-950 dark:text-amber-300 font-semibold leading-relaxed truncate">{item.uncertaintyOrLimits}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Row 6: Card footer info banner (Aligned with right column footer) */}
        <div className="min-h-[46px] p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 flex items-center justify-between text-xs text-slate-900 dark:text-slate-200 shadow-2xs">
          <span className="font-black text-slate-950 dark:text-white uppercase tracking-wider text-[11px]">
            Protocol Status: Stage 03 Gate Approved
          </span>
          <span className="font-bold text-indigo-700 dark:text-indigo-400 text-xs">
            Overall Confidence Score: 98.2%
          </span>
        </div>
      </div>
    </Card>
  );
};

export default ValidationChecklist;
