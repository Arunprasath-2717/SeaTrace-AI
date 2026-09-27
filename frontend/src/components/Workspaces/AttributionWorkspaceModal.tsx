import React, { useState } from 'react';
import {
  GitCommit,
  X,
  AlertTriangle,
  FileText,
  Crosshair,
} from 'lucide-react';
import type { OilSpillIncident, Vessel } from '../../types/intelligence';


interface AttributionWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: OilSpillIncident | null;
  onSelectCandidateOnGlobe: (vesselId: string) => void;
  onOpenReportModal: () => void;
  allVessels: Vessel[];
}

export const AttributionWorkspaceModal: React.FC<AttributionWorkspaceModalProps> = ({
  isOpen,
  onClose,
  incident,
  onSelectCandidateOnGlobe,
  onOpenReportModal,
  allVessels,
}) => {
  if (!isOpen || !incident) return null;

  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(
    incident.candidates.length > 0 ? incident.candidates[0].vesselId : ''
  );

  const selectedCandidate = incident.candidates.find((c) => c.vesselId === selectedCandidateId) || incident.candidates[0];
  const fullVesselObj = allVessels.find((v) => v.id === selectedCandidate?.vesselId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#030712]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="hud-panel w-full max-w-5xl rounded-2xl border border-[#1e293b] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#1e293b] flex items-center justify-between bg-[#0b1220]/90">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-[#00d4ff]/15 border border-[#00d4ff]/50 text-[#00d4ff]">
              <GitCommit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold font-mono text-[#f8fafc] uppercase tracking-wider">
                  Vessel Attribution & Forensic Origin Matrix
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ff4d4d]/15 text-[#ff4d4d] border border-[#ff4d4d]/30 font-bold">
                  INCIDENT {incident.code}
                </span>
              </div>
              <p className="text-xs text-[#94a3b8] font-mono">
                Spatio-Temporal Back-Trajectory Intersection with Historical AIS Fairways
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#94a3b8] hover:text-[#f8fafc] p-1.5 rounded-lg hover:bg-[#1e293b] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 lg:grid-cols-3 gap-5 font-mono">
          {/* Left Column: Ranked Candidates List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase text-[#94a3b8] font-bold">
                AIS Candidate Ranking ({incident.candidates.length})
              </span>
              <span className="text-[10px] text-[#00d4ff]">±6h Spatial Window</span>
            </div>

            <div className="space-y-2">
              {incident.candidates.map((cand) => {
                const isSelected = cand.vesselId === selectedCandidateId;
                const isRankOne = cand.rank === 1;

                return (
                  <div
                    key={cand.vesselId}
                    onClick={() => setSelectedCandidateId(cand.vesselId)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#00d4ff] bg-[#00d4ff]/15 shadow-[0_0_15px_rgba(0,212,255,0.2)]'
                        : 'border-[#1e293b] bg-[#0b1220]/60 hover:border-[#334155]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        isRankOne ? 'bg-[#ff4d4d]/20 text-[#ff4d4d] border border-[#ff4d4d]/40' : 'bg-[#1e293b] text-[#94a3b8]'
                      }`}>
                        {isRankOne ? '★ PRIME SUSPECT (#1)' : `CANDIDATE #${cand.rank}`}
                      </span>
                      <span className={`text-xs font-bold ${cand.evidenceScore > 80 ? 'text-[#ff4d4d]' : 'text-[#94a3b8]'}`}>
                        SCORE: {cand.evidenceScore}%
                      </span>
                    </div>

                    <div className="text-xs font-bold text-[#f8fafc] truncate mb-1">
                      {cand.vesselName}
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-[10px] text-[#94a3b8]">
                      <div>Offset: <span className="text-[#f8fafc]">{cand.distanceAtOriginKm} km</span></div>
                      <div>Time Δ: <span className="text-[#f8fafc]">{cand.timeDifferenceHours}h</span></div>
                      <div>Trajectory: <span className="text-[#00d4ff]">{cand.trajectoryConsistencyPct}%</span></div>
                      <div>Drift Match: <span className="text-[#10b981]">{cand.driftCompatibilityPct}%</span></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Disclaimer Banner */}
            <div className="p-2.5 rounded-lg bg-[#0b1220] border border-[#1e293b] text-[10px] text-[#64748b] leading-relaxed">
              ⚠️ Government Notice: Attribution outputs represent forensic investigative leads calculated via hydrodynamics and AIS transponder kinematics. Physical oil sampling is required for legal prosecution under MARPOL Annex I.
            </div>
          </div>

          {/* Right Two Columns: Forensic Dossier Breakdown */}
          {selectedCandidate && (
            <div className="lg:col-span-2 space-y-4">
              {/* Suspect Profile Card */}
              <div className="hud-panel p-4 rounded-xl border border-[#1e293b] bg-[#0b1220]/80">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1e293b]">
                  <div>
                    <h3 className="text-base font-bold text-[#f8fafc]">{selectedCandidate.vesselName}</h3>
                    <div className="text-xs text-[#94a3b8]">
                      MMSI: <span className="text-[#00d4ff] font-semibold">{selectedCandidate.mmsi}</span> •{' '}
                      Type: <span className="text-[#f8fafc]">{selectedCandidate.vesselType}</span> • Flag: {fullVesselObj?.flag}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-[#94a3b8]">OVERALL ATTRIBUTION SCORE</div>
                    <div className="text-2xl font-black text-[#ff4d4d]">
                      {selectedCandidate.evidenceScore}<span className="text-sm font-normal text-[#94a3b8]">/100</span>
                    </div>
                  </div>
                </div>

                {/* AIS Anomaly Banner */}
                <div className="p-3 rounded-lg bg-[#ff4d4d]/10 border border-[#ff4d4d]/30 mb-3">
                  <div className="flex items-center space-x-2 text-xs font-bold text-[#ff4d4d] mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>AIS TRANSPONDER STATUS & NAVIGATION AUDIT</span>
                  </div>
                  <div className="text-xs text-[#f8fafc]">{selectedCandidate.aisIntegrityStatus}</div>
                  <div className="text-[11px] text-[#94a3b8] mt-1">{selectedCandidate.speedAnomalyDescription}</div>
                </div>

                {/* Score Indicators Matrix */}
                <div className="grid grid-cols-3 gap-2.5 text-xs mb-3">
                  <div className="bg-[#030712] p-2.5 rounded-lg border border-[#1e293b]">
                    <span className="text-[10px] text-[#94a3b8] block">SPATIAL SEPARATION</span>
                    <span className="text-sm font-bold text-[#fbbf24]">{selectedCandidate.distanceAtOriginKm} KM</span>
                    <span className="text-[10px] text-[#64748b] block">from back-tracked origin</span>
                  </div>
                  <div className="bg-[#030712] p-2.5 rounded-lg border border-[#1e293b]">
                    <span className="text-[10px] text-[#94a3b8] block">TIME COINCIDENCE</span>
                    <span className="text-sm font-bold text-[#00d4ff]">{selectedCandidate.timeDifferenceHours} HOURS</span>
                    <span className="text-[10px] text-[#64748b] block">offset from spill release</span>
                  </div>
                  <div className="bg-[#030712] p-2.5 rounded-lg border border-[#1e293b]">
                    <span className="text-[10px] text-[#94a3b8] block">DRIFT VECTOR MATCH</span>
                    <span className="text-sm font-bold text-[#10b981]">{selectedCandidate.driftCompatibilityPct}%</span>
                    <span className="text-[10px] text-[#64748b] block">hydrodynamic alignment</span>
                  </div>
                </div>

                {/* Forensic Notes */}
                <div className="bg-[#030712] p-3 rounded-lg border border-[#1e293b] text-xs">
                  <span className="text-[10px] uppercase text-[#94a3b8] font-bold block mb-1">
                    Forensic Investigator Summary
                  </span>
                  <p className="text-[#cbd5e1] leading-relaxed">{selectedCandidate.notes}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    onSelectCandidateOnGlobe(selectedCandidate.vesselId);
                    onClose();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#00d4ff]/15 border border-[#00d4ff]/60 hover:bg-[#00d4ff]/25 text-[#00d4ff] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
                >
                  <Crosshair className="w-4 h-4" />
                  <span>Highlight Trajectory on 3D Globe</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onOpenReportModal();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#14b8a6] text-[#030712] font-bold text-xs uppercase tracking-wider hover:opacity-90 shadow-[0_0_15px_rgba(0,212,255,0.4)] flex items-center space-x-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>Generate Coast Guard Dossier</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
