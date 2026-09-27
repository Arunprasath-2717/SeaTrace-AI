import React from 'react';
import { FileText, X, Printer } from 'lucide-react';
import type { OilSpillIncident } from '../../types/intelligence';


interface ReportDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: OilSpillIncident | null;
}

export const ReportDossierModal: React.FC<ReportDossierModalProps> = ({
  isOpen,
  onClose,
  incident,
}) => {
  if (!isOpen || !incident) return null;

  const primeCandidate = incident.candidates[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#030712]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="hud-panel w-full max-w-4xl rounded-2xl border border-[#1e293b] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#1e293b] flex items-center justify-between bg-[#0b1220]/90">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-[#00d4ff]/15 border border-[#00d4ff]/50 text-[#00d4ff]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-mono text-[#f8fafc] uppercase tracking-wider">
                Official Maritime Intelligence Dossier
              </h2>
              <p className="text-xs text-[#94a3b8] font-mono">
                MARPOL 73/78 Annex I Pollution Forensics & Vessel Attribution File
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-xs font-mono text-[#f8fafc] flex items-center space-x-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-[#00d4ff]" />
              <span>Print File</span>
            </button>
            <button
              onClick={onClose}
              className="text-[#94a3b8] hover:text-[#f8fafc] p-1.5 rounded-lg hover:bg-[#1e293b] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className="flex-1 overflow-y-auto p-6 font-mono text-xs text-[#cbd5e1] space-y-5 bg-[#030712]/90">
          {/* Government Formal Header */}
          <div className="border-b-2 border-[#1e293b] pb-4 text-center">
            <div className="text-[11px] uppercase tracking-widest text-[#94a3b8] font-bold">
              GOVERNMENT OF INDIA • MINISTRY OF DEFENCE • INDIAN COAST GUARD
            </div>
            <h1 className="text-base font-extrabold text-[#f8fafc] mt-1 tracking-wider">
              MARITIME POLLUTION SURVEILLANCE & VESSEL ATTRIBUTION DOSSIER
            </h1>
            <div className="text-[10px] text-[#00d4ff] mt-1">
              FILE NO: ICG/MRCC/SEATRACE-2026/{incident.code} • CLASSIFICATION: CONFIDENTIAL / OFFICIAL USE
            </div>
          </div>

          {/* Section 1: Incident Synopsis */}
          <div>
            <h3 className="text-xs uppercase font-bold text-[#00d4ff] mb-2 border-b border-[#1e293b] pb-1">
              1. Incident Identification & Sensor Telemetry
            </h3>
            <div className="grid grid-cols-2 gap-3 bg-[#0b1220] p-3 rounded-lg border border-[#1e293b]">
              <div>
                <span className="text-[#94a3b8]">Incident Code: </span>
                <span className="text-[#ff4d4d] font-bold">{incident.code}</span>
              </div>
              <div>
                <span className="text-[#94a3b8]">Detection Time: </span>
                <span className="text-[#f8fafc]">{incident.detectionTime.replace('T', ' ')}</span>
              </div>
              <div>
                <span className="text-[#94a3b8]">Coordinates: </span>
                <span className="text-[#f8fafc]">
                  {incident.lat.toFixed(4)}°N, {incident.lng.toFixed(4)}°E ({incident.region})
                </span>
              </div>
              <div>
                <span className="text-[#94a3b8]">Sensor Platform: </span>
                <span className="text-[#00d4ff]">{incident.satelliteSensor} ({incident.sensorBand})</span>
              </div>
              <div>
                <span className="text-[#94a3b8]">Verified Slick Area: </span>
                <span className="text-[#f8fafc] font-bold">{incident.estimatedAreaKm2} km²</span>
              </div>
              <div>
                <span className="text-[#94a3b8]">Estimated Volume: </span>
                <span className="text-[#fbbf24] font-bold">{incident.estimatedVolumeBarrels} Barrels</span>
              </div>
              <div>
                <span className="text-[#94a3b8]">Hydrocarbon Type: </span>
                <span className="text-[#f8fafc]">{incident.oilType}</span>
              </div>
              <div>
                <span className="text-[#94a3b8]">Neural Confidence: </span>
                <span className="text-[#10b981] font-bold">{incident.confidencePct}%</span>
              </div>
            </div>
          </div>

          {/* Section 2: Attribution Forensics */}
          {primeCandidate && (
            <div>
              <h3 className="text-xs uppercase font-bold text-[#00d4ff] mb-2 border-b border-[#1e293b] pb-1">
                2. Forensic Vessel Attribution (Primary Suspect)
              </h3>
              <div className="bg-[#0b1220] p-3 rounded-lg border border-[#ff4d4d]/40 space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-[#1e293b]">
                  <div>
                    <span className="text-sm font-bold text-[#f8fafc]">{primeCandidate.vesselName}</span>
                    <span className="text-[11px] text-[#94a3b8] ml-2">MMSI: {primeCandidate.mmsi}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#ff4d4d]/20 text-[#ff4d4d] border border-[#ff4d4d]/40 font-bold">
                    ATTRIBUTION SCORE: {primeCandidate.evidenceScore}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[#94a3b8]">Back-Tracked Origin Match: </span>
                    <span className="text-[#fbbf24] font-bold">{primeCandidate.distanceAtOriginKm} KM offset</span>
                  </div>
                  <div>
                    <span className="text-[#94a3b8]">Time Delta at Origin: </span>
                    <span className="text-[#00d4ff] font-bold">{primeCandidate.timeDifferenceHours} hours</span>
                  </div>
                  <div>
                    <span className="text-[#94a3b8]">Trajectory Alignment: </span>
                    <span className="text-[#10b981] font-bold">{primeCandidate.trajectoryConsistencyPct}%</span>
                  </div>
                  <div>
                    <span className="text-[#94a3b8]">Drift Compatibility: </span>
                    <span className="text-[#10b981] font-bold">{primeCandidate.driftCompatibilityPct}%</span>
                  </div>
                </div>

                <div className="p-2 rounded bg-[#ff4d4d]/10 border border-[#ff4d4d]/20 text-[11px] text-[#f8fafc]">
                  <span className="font-bold text-[#ff4d4d]">Flagged Anomalies: </span>
                  {primeCandidate.aisIntegrityStatus}. {primeCandidate.speedAnomalyDescription}
                </div>

                <p className="text-[11px] text-[#94a3b8] leading-relaxed pt-1">
                  {primeCandidate.notes}
                </p>
              </div>
            </div>
          )}

          {/* Section 3: Legal Recommendations */}
          <div>
            <h3 className="text-xs uppercase font-bold text-[#00d4ff] mb-2 border-b border-[#1e293b] pb-1">
              3. Recommended Legal Actions (MARPOL Annex I)
            </h3>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-[#cbd5e1]">
              <li>Issue notice to Port State Control at next port of call to inspect Oil Record Book (Part II).</li>
              <li>Dispatch Indian Coast Guard Pollution Control Vessel (PCV) for chemical dispersant and physical sampling.</li>
              <li>Preserve AIS transponder gap timestamp telemetry for Maritime Tribunal proceedings.</li>
              <li>Subpoena engine room automation logs and bilge separator discharge monitor records.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
