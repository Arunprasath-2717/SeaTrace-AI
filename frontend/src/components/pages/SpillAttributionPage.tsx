import React, { useState } from 'react';
import { useSentinel } from '../../context/SentinelContext';
import { INITIAL_CANDIDATE_ATTRIBUTIONS } from '../../data/sentinelData';
import {
  Target,
  Clock,
  MapPin,
  Ship,
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  Download,
  Info,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const SpillAttributionPage: React.FC = () => {
  const { incidents, selectedIncident, setSelectedIncident, addIncidentNote, showToast, setActivePage } = useSentinel();

  const [timeWindowHours, setTimeWindowHours] = useState<number>(12);
  const [newNote, setNewNote] = useState<string>('');

  const currentInc = selectedIncident || incidents[0];
  const candidates = INITIAL_CANDIDATE_ATTRIBUTIONS[currentInc.id] || INITIAL_CANDIDATE_ATTRIBUTIONS['inc-st-2046'];

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote) return;
    addIncidentNote(currentInc.id, newNote);
    setNewNote('');
  };

  const handleExportEvidence = () => {
    const content = `NTRO OCEAN SENTINEL AI — VESSEL ATTRIBUTION EVIDENCE DOSSIER
Incident Code: ${currentInc.code} (${currentInc.name})
Spill Location: ${currentInc.lat}°N, ${currentInc.lng}°E
Detection Time: ${currentInc.detectionTime}
Time Window: ±${timeWindowHours} hours

RANKED CANDIDATE POLLUTERS:
${candidates
  .map(
    (c, idx) => `
Rank #${idx + 1}: ${c.vesselName} (MMSI: ${c.mmsi})
Total Attribution Score: ${c.totalScore}/100
- Spatial Proximity Score: ${c.spatialScore}/100
- Temporal Consistency Score: ${c.temporalScore}/100
- Drift Path Compatibility: ${c.driftCompatibilityScore}/100
- Behavioral Anomaly Score: ${c.behavioralAnomalyScore}/100
- AIS Completeness Score: ${c.dataCompletenessScore}/100
Key Findings:
${c.keyFindings.map((f) => `  * ${f}`).join('\n')}
`
  )
  .join('\n----------------------------------------\n')}

DISCLAIMER:
All scores represent simulated geospatial-temporal correlation metrics. High scores denote investigative priority and do not constitute legal proof of liability.`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Attribution_Dossier_${currentInc.code}.txt`;
    link.click();
    showToast(`Attribution evidence dossier exported for ${currentInc.code}.`, 'success');
  };

  return (
    <div className="flex-1 flex flex-col gap-5 p-6 overflow-y-auto select-none bg-[#07111F] text-slate-100 scrollbar-thin">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#00C2FF]" />
            <h1 className="text-xl font-black tracking-tight text-white uppercase font-mono">
              Spill Attribution Engine
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40">
              CORRELATION MATRIX
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Rank potential polluting vessels using back-calculated hydrodynamic drift, AIS historical trajectories, and behavioural anomalies.
          </p>
        </div>

        <button
          onClick={handleExportEvidence}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00C2FF] to-[#14B8A6] text-slate-950 font-bold text-xs shadow-md hover:opacity-95 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Attribution Dossier</span>
        </button>
      </div>

      {/* Mandatory Investigative Legal Disclaimer */}
      <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-300/90 leading-relaxed">
          <strong>LEGAL NOTICE:</strong> A high candidate score is an investigative lead based on spatial-temporal correlation and AIS telemetry anomalies. It does not constitute verified proof of pollution or legal liability until physical oil fingerprinting samples are gathered by the Indian Coast Guard.
        </p>
      </div>

      {/* Investigation Controls Bar */}
      <div className="p-4 rounded-2xl border border-[#23364B] bg-[#0D1B2A] flex flex-wrap items-center justify-between gap-4">
        {/* Incident Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300">Investigating Spill:</span>
          <select
            value={currentInc.id}
            onChange={(e) => {
              const match = incidents.find((i) => i.id === e.target.value);
              if (match) setSelectedIncident(match);
            }}
            className="bg-[#07111F] border border-[#23364B] rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-[#00C2FF]"
          >
            {incidents.map((i) => (
              <option key={i.id} value={i.id}>
                {i.code} — {i.name} ({i.estimatedAreaKm2} km²)
              </option>
            ))}
          </select>
        </div>

        {/* Time Window Selector */}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-300">Correlation Window:</span>
          <div className="flex items-center gap-1 font-mono text-xs">
            {[6, 12, 24, 48].map((h) => (
              <button
                key={h}
                onClick={() => setTimeWindowHours(h)}
                className={`px-2.5 py-1 rounded-lg border ${
                  timeWindowHours === h
                    ? 'bg-[#00C2FF]/20 border-[#00C2FF] text-[#00C2FF] font-bold'
                    : 'border-[#23364B] text-slate-400 hover:text-white'
                }`}
              >
                ±{h}h
              </button>
            ))}
          </div>
        </div>

        {/* Origin Coordinates Display */}
        <div className="text-xs font-mono text-slate-300">
          Estimated Release Point: <strong className="text-emerald-400">{currentInc.lat}°N, {currentInc.lng}°E</strong>
        </div>
      </div>

      {/* Ranked Candidate Vessel Cards */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
          Ranked Candidate Polluters ({candidates.length} Correlated)
        </h2>

        {candidates.map((c, idx) => {
          const isTopRank = idx === 0;

          return (
            <div
              key={c.vesselId}
              className={`p-5 rounded-2xl border transition-all ${
                isTopRank
                  ? 'bg-[#11243B] border-rose-500/60 shadow-xl shadow-rose-950/20'
                  : 'bg-[#0D1B2A] border-[#23364B]'
              }`}
            >
              {/* Candidate Card Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#23364B]">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-sm ${
                      isTopRank
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white font-mono">
                        {c.vesselName}
                      </h3>
                      <span className="font-mono text-[11px] text-slate-400">
                        (MMSI: {c.mmsi})
                      </span>
                      {isTopRank && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                          PRIME SUSPECT
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Liberian Flag VLCC Crude Oil Carrier (318,000 DWT)
                    </span>
                  </div>
                </div>

                {/* Score Dial */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">
                      Attribution Match Score
                    </span>
                    <span
                      className={`text-2xl font-black font-mono ${
                        isTopRank ? 'text-rose-400' : 'text-amber-400'
                      }`}
                    >
                      {c.totalScore} / 100
                    </span>
                  </div>
                </div>
              </div>

              {/* 5 Evidence Factor Breakdown Bars */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                <div>
                  <div className="flex justify-between text-[11px] font-mono mb-1">
                    <span className="text-slate-400">Spatial Proximity</span>
                    <span className="text-slate-200 font-bold">{c.spatialScore}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#07111F] overflow-hidden">
                    <div className="h-full rounded-full bg-[#00C2FF]" style={{ width: `${c.spatialScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-mono mb-1">
                    <span className="text-slate-400">Temporal Match</span>
                    <span className="text-slate-200 font-bold">{c.temporalScore}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#07111F] overflow-hidden">
                    <div className="h-full rounded-full bg-[#14B8A6]" style={{ width: `${c.temporalScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-mono mb-1">
                    <span className="text-slate-400">Drift Compatibility</span>
                    <span className="text-slate-200 font-bold">{c.driftCompatibilityScore}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#07111F] overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-400" style={{ width: `${c.driftCompatibilityScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-mono mb-1">
                    <span className="text-slate-400">Behavioral Anomaly</span>
                    <span className="text-rose-400 font-bold">{c.behavioralAnomalyScore}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#07111F] overflow-hidden">
                    <div className="h-full rounded-full bg-rose-500" style={{ width: `${c.behavioralAnomalyScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-mono mb-1">
                    <span className="text-slate-400">AIS Data Quality</span>
                    <span className="text-slate-200 font-bold">{c.dataCompletenessScore}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#07111F] overflow-hidden">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${c.dataCompletenessScore}%` }} />
                  </div>
                </div>
              </div>

              {/* Key Forensic Evidence Findings */}
              <div className="p-3 rounded-xl bg-[#07111F] border border-[#23364B] flex flex-col gap-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Key Correlated Forensic Evidence
                </span>
                <ul className="flex flex-col gap-1 text-xs text-slate-300">
                  {c.keyFindings.map((finding, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <span className="text-[#00C2FF] font-bold">›</span>
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Investigation Notes & Case Documentation Section */}
      <div className="p-5 rounded-2xl border border-[#23364B] bg-[#0D1B2A] flex flex-col gap-3">
        <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
          Investigator Audit Notes & Case File
        </h3>

        <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
          {currentInc.notes?.map((n, idx) => (
            <div key={idx} className="p-2 rounded-xl bg-[#07111F] border border-[#23364B] text-xs text-slate-300 font-mono">
              {n}
            </div>
          ))}
        </div>

        <form onSubmit={handleAddNote} className="flex gap-2 mt-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Append case note (e.g. Requested satellite cross-pol re-verification)..."
            className="flex-1 bg-[#07111F] border border-[#23364B] rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-[#00C2FF]"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#00C2FF]/20 hover:bg-[#00C2FF]/30 text-[#00C2FF] border border-[#00C2FF]/40 text-xs font-bold"
          >
            Add Note
          </button>
        </form>
      </div>
    </div>
  );
};
