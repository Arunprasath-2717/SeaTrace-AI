import React, { useState } from 'react';
import {
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Ship,
  Wind,
  FileText,
  Crosshair,
} from 'lucide-react';
import type { OilSpillIncident } from '../../types/intelligence';


interface RightIncidentPanelProps {
  incidents: OilSpillIncident[];
  selectedIncident: OilSpillIncident | null;
  onSelectIncident: (inc: OilSpillIncident | null) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onStartOriginReconstruction: () => void;
  onOpenAttributionWorkspace: () => void;
  onOpenDriftWorkspace: () => void;
  onGenerateReport: () => void;
  trackedVesselsCount: number;
}

export const RightIncidentPanel: React.FC<RightIncidentPanelProps> = ({
  incidents,
  selectedIncident,
  onSelectIncident,
  isCollapsed,
  onToggleCollapse,
  onStartOriginReconstruction,
  onOpenAttributionWorkspace,
  onOpenDriftWorkspace,
  onGenerateReport,
  trackedVesselsCount,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filteredIncidents = incidents.filter((inc) => {
    if (filterSeverity === 'ALL') return true;
    return inc.severity.toUpperCase() === filterSeverity.toUpperCase();
  });

  const criticalCount = incidents.filter((i) => i.severity === 'Critical').length;
  const activeAlertCount = incidents.filter((i) => i.status === 'Active Alert' || i.status === 'Under Investigation').length;

  return (
    <aside
      className={`absolute top-20 right-6 z-20 transition-all duration-300 pointer-events-auto ${
        isCollapsed ? 'translate-x-[calc(100%+24px)]' : 'w-96'
      }`}
    >
      {/* Floating expand button when collapsed */}
      {isCollapsed && (
        <button
          onClick={onToggleCollapse}
          className="fixed top-20 right-6 hud-panel px-3 py-2.5 rounded-lg border border-[#ff4d4d]/60 text-[#ff4d4d] flex items-center space-x-2 shadow-2xl hover:bg-[#ff4d4d]/10 transition-all font-mono text-xs"
        >
          <AlertTriangle className="w-4 h-4 animate-pulse" />
          <span>INCIDENTS ({activeAlertCount})</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {!isCollapsed && (
        <div className="hud-panel rounded-xl border border-[#1e293b] shadow-2xl backdrop-blur-xl flex flex-col max-h-[calc(100vh-180px)] overflow-hidden">
          {/* Header */}
          <div className="p-3.5 border-b border-[#1e293b] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff4d4d] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ff4d4d]"></span>
              </span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#f8fafc] font-mono">
                Incident Operations Panel
              </h2>
            </div>
            <button
              onClick={onToggleCollapse}
              className="text-[#94a3b8] hover:text-[#00d4ff] p-1 rounded hover:bg-[#1e293b]/50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Operational Metrics Summary */}
          <div className="grid grid-cols-3 gap-1.5 p-3 border-b border-[#1e293b] bg-[#030712]/50 text-center font-mono">
            <div className="p-2 rounded bg-[#0b1220] border border-[#1e293b]">
              <div className="text-[10px] text-[#94a3b8] uppercase">Active Alerts</div>
              <div className="text-base font-bold text-[#ff4d4d]">{activeAlertCount}</div>
            </div>
            <div className="p-2 rounded bg-[#0b1220] border border-[#1e293b]">
              <div className="text-[10px] text-[#94a3b8] uppercase">Critical Tier</div>
              <div className="text-base font-bold text-[#fb923c]">{criticalCount}</div>
            </div>
            <div className="p-2 rounded bg-[#0b1220] border border-[#1e293b]">
              <div className="text-[10px] text-[#94a3b8] uppercase">AIS Targets</div>
              <div className="text-base font-bold text-[#00d4ff]">{trackedVesselsCount}</div>
            </div>
          </div>

          {/* Selected Incident Forensics Card (If one is selected) */}
          {selectedIncident ? (
            <div className="p-3.5 border-b border-[#1e293b] bg-[#00d4ff]/5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-[#ff4d4d]/20 text-[#ff4d4d] border border-[#ff4d4d]/40">
                  {selectedIncident.code}
                </span>
                <span className="text-[11px] font-mono text-[#00d4ff] font-semibold">
                  {selectedIncident.confidencePct}% AI CONFIDENCE
                </span>
              </div>

              <h3 className="text-sm font-bold text-[#f8fafc] mb-1 font-mono leading-tight">
                {selectedIncident.name}
              </h3>
              <p className="text-[11px] text-[#94a3b8] mb-3 leading-snug">
                {selectedIncident.region}
              </p>

              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mb-3">
                <div className="bg-[#0b1220] p-2 rounded border border-[#1e293b]">
                  <span className="text-[#64748b] block text-[10px]">ESTIMATED SLICK AREA</span>
                  <span className="text-[#f8fafc] font-bold text-sm">
                    {selectedIncident.estimatedAreaKm2} km²
                  </span>
                </div>
                <div className="bg-[#0b1220] p-2 rounded border border-[#1e293b]">
                  <span className="text-[#64748b] block text-[10px]">DISCHARGE VOLUME</span>
                  <span className="text-[#f8fafc] font-bold text-sm">
                    {selectedIncident.estimatedVolumeBarrels} BBL
                  </span>
                </div>
                <div className="bg-[#0b1220] p-2 rounded border border-[#1e293b]">
                  <span className="text-[#64748b] block text-[10px]">SENSOR / BAND</span>
                  <span className="text-[#00d4ff] truncate block">
                    {selectedIncident.satelliteSensor}
                  </span>
                </div>
                <div className="bg-[#0b1220] p-2 rounded border border-[#1e293b]">
                  <span className="text-[#64748b] block text-[10px]">COASTAL PROXIMITY</span>
                  <span className="text-[#fb923c] font-bold">
                    {selectedIncident.coastalThreatDistanceKm} KM
                  </span>
                </div>
              </div>

              {/* Quick Investigation Action Buttons */}
              <div className="grid grid-cols-2 gap-1.5 pt-1 font-mono text-xs">
                <button
                  onClick={onStartOriginReconstruction}
                  className="px-2.5 py-1.5 rounded-lg bg-[#fbbf24]/15 border border-[#fbbf24]/50 text-[#fbbf24] hover:bg-[#fbbf24]/25 transition-all flex items-center justify-center space-x-1 font-semibold"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>Trace Origin</span>
                </button>
                <button
                  onClick={onOpenAttributionWorkspace}
                  className="px-2.5 py-1.5 rounded-lg bg-[#00d4ff]/15 border border-[#00d4ff]/50 text-[#00d4ff] hover:bg-[#00d4ff]/25 transition-all flex items-center justify-center space-x-1 font-semibold"
                >
                  <Ship className="w-3.5 h-3.5" />
                  <span>Correlate AIS</span>
                </button>
                <button
                  onClick={onOpenDriftWorkspace}
                  className="px-2.5 py-1.5 rounded-lg bg-[#14b8a6]/15 border border-[#14b8a6]/50 text-[#14b8a6] hover:bg-[#14b8a6]/25 transition-all flex items-center justify-center space-x-1 font-semibold"
                >
                  <Wind className="w-3.5 h-3.5" />
                  <span>Predict Drift</span>
                </button>
                <button
                  onClick={onGenerateReport}
                  className="px-2.5 py-1.5 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-[#f8fafc] transition-all flex items-center justify-center space-x-1 font-semibold border border-[#334155]"
                >
                  <FileText className="w-3.5 h-3.5 text-[#00d4ff]" />
                  <span>Dossier</span>
                </button>
              </div>

              <button
                onClick={() => onSelectIncident(null)}
                className="w-full mt-2 text-[10px] font-mono text-[#94a3b8] hover:text-[#f8fafc] text-center"
              >
                ← Back to Incident Queue
              </button>
            </div>
          ) : null}

          {/* Incident List Filters */}
          <div className="p-2.5 border-b border-[#1e293b] flex items-center justify-between text-xs font-mono">
            <span className="text-[11px] text-[#94a3b8]">Queue Filter:</span>
            <div className="flex space-x-1">
              {['ALL', 'CRITICAL', 'HIGH'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                    filterSeverity === sev
                      ? 'bg-[#00d4ff] text-[#030712] font-bold'
                      : 'text-[#94a3b8] hover:text-[#f8fafc]'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Incidents List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {filteredIncidents.map((inc) => {
              const isSelected = selectedIncident?.id === inc.id;
              const severityColor =
                inc.severity === 'Critical'
                  ? 'border-l-4 border-l-[#ff4d4d]'
                  : inc.severity === 'High'
                  ? 'border-l-4 border-l-[#fb923c]'
                  : 'border-l-4 border-l-[#38bdf8]';

              return (
                <div
                  key={inc.id}
                  onClick={() => onSelectIncident(inc)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all ${severityColor} ${
                    isSelected
                      ? 'bg-[#00d4ff]/15 border-[#00d4ff] shadow-[0_0_15px_rgba(0,212,255,0.2)]'
                      : 'bg-[#0b1220]/70 border-[#1e293b] hover:border-[#00d4ff]/40 hover:bg-[#0b1220]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 font-mono">
                    <span className="text-xs font-bold text-[#ff4d4d]">{inc.code}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold ${
                        inc.status === 'Active Alert'
                          ? 'bg-[#ff4d4d]/20 text-[#ff4d4d]'
                          : inc.status === 'Attribution Confirmed'
                          ? 'bg-[#10b981]/20 text-[#10b981]'
                          : 'bg-[#fbbf24]/20 text-[#fbbf24]'
                      }`}
                    >
                      {inc.status}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-[#f8fafc] truncate mb-1">
                    {inc.name}
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-[#94a3b8]">
                    <span>{inc.estimatedAreaKm2} km²</span>
                    <span>{inc.detectionTime.substring(11, 16)} UTC</span>
                    <span className="text-[#00d4ff] font-semibold">{inc.confidencePct}% Conf</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
};
