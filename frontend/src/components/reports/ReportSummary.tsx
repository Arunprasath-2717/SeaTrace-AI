import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { demoIncidents } from '../../data/demo/incidents';
import { demoVessels } from '../../data/demo/vessels';
import { demoSimulation } from '../../data/demo/simulation';
import {
  Satellite,
  ShieldCheck,
  Compass,
  Ship,
  GitCompare,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Hash,
  UserCheck,
  FileText,
} from 'lucide-react';

export const ReportSummary: React.FC<{ className?: string }> = ({ className = '' }) => {
  const incident = demoIncidents[0];
  const candidate = demoVessels[0];

  return (
    <Card
      title="INVESTIGATION DOSSIER & ATTRIBUTION SYNTHESIS"
      subtitle={`Structured Forensic Report • Incident ID: ${incident.id}`}
      headerAction={
        <div className="flex items-center gap-2">
          <Badge variant="teal" size="sm">
            REPORT v2.0 READY
          </Badge>
          <Badge variant="warning" size="sm">
            HUMAN REVIEW REQUIRED
          </Badge>
        </div>
      }
      className={className}
    >
      <div className="space-y-6 text-xs font-mono">
        {/* 1. INVESTIGATION SUMMARY */}
        <section className="space-y-2 border-b border-slate-200 pb-4">
          <h4 className="text-sm font-black text-slate-900 font-sans flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-700" /> 1. Investigation Summary
          </h4>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-300 leading-relaxed font-sans text-slate-800 font-medium">
            On 2026-09-24 at 14:22 UTC, Sentinel-1A SAR acquired a 14.8 km² slick anomaly in the Northern Gulf of Mexico. Hydrodynamic reverse modeling bounded the probable release between 13:45 and 14:30 UTC. AIS correlation identified crude carrier <strong className="text-slate-950 font-black">{candidate.identity.name}</strong> (MMSI: {candidate.identity.mmsi}) intersecting the release corridor. Forward counterfactual simulation demonstrates an 84% spatial IoU concordance with observed slick morphology.
          </div>
        </section>

        {/* 2 & 3. SATELLITE OBSERVATION & DETECTION */}
        <section className="space-y-2 border-b border-slate-200 pb-4">
          <h4 className="text-sm font-black text-slate-900 font-sans flex items-center gap-2">
            <Satellite className="w-4 h-4 text-indigo-700" /> 2 & 3. Satellite Observation & AI Detection
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-300">
              <span className="text-[10px] text-slate-700 font-bold uppercase block">Satellite / Sensor</span>
              <span className="text-slate-900 font-black">Sentinel-1A (C-Band SAR)</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-300">
              <span className="text-[10px] text-slate-700 font-bold uppercase block">Swath Mode / Pol</span>
              <span className="text-slate-900 font-black">IW Mode (VV + VH)</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-300">
              <span className="text-[10px] text-slate-700 font-bold uppercase block">Delineated Area</span>
              <span className="text-teal-900 font-black">{incident.estimatedAreaKm2} km²</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-300">
              <span className="text-[10px] text-slate-700 font-bold uppercase block">Model Evaluation</span>
              <span className="text-amber-800 font-bold">Pending Evaluation</span>
            </div>
          </div>
        </section>

        {/* 4. VALIDATION */}
        <section className="space-y-2 border-b border-slate-200 pb-4">
          <h4 className="text-sm font-black text-slate-900 font-sans flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" /> 4. Look-Alike Validation
          </h4>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-300 font-sans text-slate-800 font-medium leading-relaxed">
            Metocean validation confirmed 10m wind speed at 6.4 m/s (above the 3.0 m/s calm threshold). Biogenic algae bloom and solitary internal wave artifacts were systematically ruled out using optical Chlorophyll-a and SAR sub-aperture analysis.
          </div>
        </section>

        {/* 5. ORIGIN RECONSTRUCTION */}
        <section className="space-y-2 border-b border-slate-200 pb-4">
          <h4 className="text-sm font-black text-slate-900 font-sans flex items-center gap-2">
            <Compass className="w-4 h-4 text-sky-700" /> 5. Origin Reconstruction
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-300">
              <span className="text-[10px] text-slate-700 font-bold uppercase block">Drift Engine</span>
              <span className="text-slate-900 font-black">OpenDrift / OpenOil (50 runs)</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-300">
              <span className="text-[10px] text-slate-700 font-bold uppercase block">Origin Centroid</span>
              <span className="text-indigo-900 font-black">28.460°N, 90.230°W</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-300">
              <span className="text-[10px] text-slate-700 font-bold uppercase block">Estimated Window</span>
              <span className="text-teal-900 font-black">13:45 to 14:30 UTC</span>
            </div>
          </div>
        </section>

        {/* 6. CANDIDATE VESSELS */}
        <section className="space-y-2 border-b border-slate-200 pb-4">
          <h4 className="text-sm font-black text-slate-900 font-sans flex items-center gap-2">
            <Ship className="w-4 h-4 text-indigo-700" /> 6. Candidate Vessels
          </h4>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-300 space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-950 font-black">{candidate.identity.name} ({candidate.identity.vesselType})</span>
              <Badge variant="mint" size="sm">PRIMARY CANDIDATE</Badge>
            </div>
            <p className="text-[11px] text-slate-700 font-medium font-sans">
              IMO: {candidate.identity.imo} • MMSI: {candidate.identity.mmsi} • Flag: {candidate.identity.flag} • Draught: {candidate.identity.draughtMeters}m
            </p>
          </div>
        </section>

        {/* 7. COUNTERFACTUAL ANALYSIS */}
        <section className="space-y-2 border-b border-slate-200 pb-4">
          <h4 className="text-sm font-black text-slate-900 font-sans flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-purple-700" /> 7. Counterfactual Analysis
          </h4>
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-300">
              <span className="text-[10px] text-slate-700 font-bold uppercase block">Spatial Overlap (IoU)</span>
              <span className="text-teal-900 font-black text-sm">84.2%</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-300">
              <span className="text-[10px] text-slate-700 font-bold uppercase block">Centroid Displacement</span>
              <span className="text-indigo-900 font-black text-sm">0.65 km</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-300">
              <span className="text-[10px] text-slate-700 font-bold uppercase block">Simulated Volume</span>
              <span className="text-slate-900 font-black text-sm">{demoSimulation.releaseHypothesis.totalVolumeM3} m³</span>
            </div>
          </div>
        </section>

        {/* 8, 9, 10. SUPPORTING, CONFLICTING & UNCERTAINTY */}
        <section className="space-y-3 border-b border-slate-200 pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1.5">
              <span className="text-[10px] uppercase font-black text-emerald-900 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> 8. Supporting Evidence
              </span>
              <ul className="text-[10px] font-sans text-slate-800 font-medium list-disc pl-3 space-y-1">
                {candidate.supportingEvidence.slice(0, 3).map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 space-y-1.5">
              <span className="text-[10px] uppercase font-black text-rose-900 flex items-center gap-1 font-mono">
                <XCircle className="w-3.5 h-3.5 text-rose-700" /> 9. Conflicting Evidence
              </span>
              <ul className="text-[10px] font-sans text-slate-800 font-medium list-disc pl-3 space-y-1">
                {candidate.conflictingEvidence.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-lg border border-amber-300 bg-amber-50 text-amber-950 space-y-1.5">
              <span className="text-[10px] uppercase font-black text-amber-900 flex items-center gap-1 font-mono">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" /> 10. Uncertainty Bounds
              </span>
              <ul className="text-[10px] font-sans text-amber-950 font-medium list-disc pl-3 space-y-1">
                {candidate.uncertaintyNotes.map((u, i) => (
                  <li key={i}>{u}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 11 & 12. PROVENANCE & HUMAN REVIEW */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-300 space-y-1">
            <span className="text-[10px] uppercase font-black text-indigo-800 flex items-center gap-1 font-mono">
              <Hash className="w-3.5 h-3.5 text-indigo-700" /> 11. Pipeline Provenance Hashes
            </span>
            <div className="text-[10px] text-slate-900 font-bold break-all font-mono bg-white p-1.5 rounded border border-slate-200">
              SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
            </div>
            <p className="text-[10px] text-slate-700 font-medium font-sans">
              Chain entries: 8 verified stage checkpoints recorded in local audit store.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-300 space-y-1">
            <span className="text-[10px] uppercase font-black text-indigo-800 flex items-center gap-1 font-mono">
              <UserCheck className="w-3.5 h-3.5 text-indigo-700" /> 12. Human Review Sign-Off
            </span>
            <p className="text-[11px] font-sans text-slate-800 font-medium leading-relaxed">
              Investigation status: <strong className="text-slate-950 font-black">Open / Under Active Review</strong>. Report flagged for port-state inspection request. Final legal liability determination requires physical bunker fuel sampling and port tank log audits.
            </p>
          </div>
        </section>
      </div>
    </Card>
  );
};

export default ReportSummary;
