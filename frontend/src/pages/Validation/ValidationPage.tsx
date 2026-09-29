import React from 'react';
import { ValidationChecklist } from '../../components/validation/ValidationChecklist';
import { LookAlikeAssessment } from '../../components/validation/LookAlikeAssessment';
import { ShieldCheck, CheckCircle2, Filter, Activity, ArrowRight, ShieldAlert } from 'lucide-react';

const STATS = [
  { label: 'Screening Status', value: '98.2%', sub: 'Optimal Confidence', color: '#4f46e5', icon: ShieldCheck },
  { label: 'Physical Criteria', value: '5 / 5', sub: 'Exclusion Protocol Met', color: '#059669', icon: CheckCircle2 },
  { label: 'Look-Alikes Disproven', value: '4 Types', sub: 'Biogenic / Wind / Seep', color: '#ea580c', icon: Filter },
  { label: 'ERA5 Wind Speed', value: '6.4 m/s', sub: 'Within 3.0–12.0 Window', color: '#0284c7', icon: Activity },
];

export const ValidationPage: React.FC = () => {
  return (
    <div className="w-full bg-[#f8fafc] p-4 sm:p-5 font-sans text-slate-900 select-none">
      <div className="max-w-[1480px] mx-auto flex flex-col gap-4">

        {/* ── Page Header ────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-black uppercase tracking-wider bg-indigo-100 text-indigo-900 border border-indigo-200">
                Stage 03 Protocol
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-200">
                Anthropogenic Confirmed
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Slick Validation & Metocean Screening
            </h1>
            <p className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
              Systematic exclusion of non-pollution radar backscatter damping mechanisms & false-positive look-alikes
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-indigo-600 text-white shadow-xs">
              ESA COPERNICUS VERIFIED
            </span>
            <span className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-emerald-600 text-white shadow-xs">
              IOPC RULE 4A COMPLIANT
            </span>
          </div>
        </div>

        {/* ── KPI Stat Cards ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="bg-white border border-slate-300 rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 shadow-xs transition-all hover:shadow-md"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${s.color}18` }}
                >
                  <Icon className="w-6 h-6" style={{ color: s.color }} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black uppercase tracking-wider text-slate-900 truncate">
                    {s.label}
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-0.5">
                    {s.value}
                  </div>
                  <div className="text-xs font-bold text-slate-700 mt-0.5 truncate">
                    {s.sub}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Core Assessment Grid: Perfectly Aligned Columns ────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          <div className="h-full flex flex-col">
            <ValidationChecklist className="h-full" />
          </div>
          <div className="h-full flex flex-col">
            <LookAlikeAssessment className="h-full" />
          </div>
        </div>

        {/* ── Forensic Certification Banner ──────────────────────── */}
        <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-indigo-700 via-blue-700 to-teal-700 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-300" />
              <h3 className="text-base font-black tracking-tight text-white">
                Metocean Forensic Screening Certification
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-100 font-medium max-w-3xl leading-relaxed">
              All 5 physical look-alike damping exclusions verified against coincident ECMWF ERA5 10m wind fields (6.4 m/s) and Copernicus Sentinel-3 OLCI chlorophyll-a products (&lt; 0.15 mg/m³). Radar signature is hydrodynamic and SAR-attenuation consistent with mineral oil.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button className="px-4 py-2 rounded-xl text-xs font-black bg-white text-indigo-900 shadow-sm hover:bg-slate-100 transition-all flex items-center gap-1.5 cursor-pointer">
              <span>View IOPC Dossier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ValidationPage;
