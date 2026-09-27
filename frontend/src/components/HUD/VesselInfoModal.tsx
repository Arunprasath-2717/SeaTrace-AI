import React from 'react';
import { Ship, X, Navigation, AlertOctagon } from 'lucide-react';
import type { Vessel, OilSpillIncident } from '../../types/intelligence';


interface VesselInfoModalProps {
  vessel: Vessel | null;
  onClose: () => void;
  selectedIncident: OilSpillIncident | null;
  onFocusVesselTrajectory: (vessel: Vessel) => void;
}

export const VesselInfoModal: React.FC<VesselInfoModalProps> = ({
  vessel,
  onClose,
  selectedIncident,
  onFocusVesselTrajectory,
}) => {
  if (!vessel) return null;

  const isSuspect = vessel.isDarkVessel || (vessel.anomalyScore && vessel.anomalyScore > 70);

  // Calculate distance from selected incident if any
  let distanceToIncidentKm: number | null = null;
  if (selectedIncident) {
    const dLat = (vessel.currentLat - selectedIncident.lat) * 111;
    const dLng = (vessel.currentLng - selectedIncident.lng) * 111 * Math.cos((selectedIncident.lat * Math.PI) / 180);
    distanceToIncidentKm = Number(Math.sqrt(dLat * dLat + dLng * dLng).toFixed(1));
  }

  return (
    <div className="fixed bottom-24 right-6 z-40 w-96 animate-in slide-in-from-bottom-3 duration-200">
      <div className={`hud-panel p-4 rounded-xl border shadow-2xl backdrop-blur-xl ${
        isSuspect ? 'border-[#ff4d4d]/80 bg-[#0b1220]/95' : 'border-[#00d4ff]/60 bg-[#0b1220]/95'
      }`}>
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#1e293b]">
          <div className="flex items-center space-x-2.5">
            <div className={`p-2 rounded-lg border ${
              isSuspect ? 'bg-[#ff4d4d]/15 border-[#ff4d4d] text-[#ff4d4d]' : 'bg-[#00d4ff]/15 border-[#00d4ff] text-[#00d4ff]'
            }`}>
              <Ship className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-[#f8fafc] font-mono tracking-wide">
                  {vessel.name}
                </h3>
                <span className="text-xs">{vessel.flag}</span>
              </div>
              <div className="text-[11px] font-mono text-[#94a3b8]">
                MMSI: <span className="text-[#00d4ff] font-semibold">{vessel.mmsi}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#94a3b8] hover:text-[#f8fafc] p-1 rounded hover:bg-[#1e293b]/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Anomaly Alert Banner if high score */}
        {isSuspect && (
          <div className="my-2.5 p-2 rounded-lg bg-[#ff4d4d]/15 border border-[#ff4d4d]/40 flex items-center space-x-2 text-xs font-mono text-[#ff4d4d]">
            <AlertOctagon className="w-4 h-4 shrink-0" />
            <span className="font-bold">
              DARK VESSEL ANOMALY INDEX: {vessel.anomalyScore}/100
            </span>
          </div>
        )}

        {/* Vessel Specifications Grid */}
        <div className="grid grid-cols-2 gap-2 my-3 text-xs font-mono">
          <div className="bg-[#030712]/60 p-2 rounded border border-[#1e293b]">
            <span className="text-[10px] text-[#94a3b8] block">TYPE & CLASS</span>
            <span className="text-[#f8fafc] font-semibold">{vessel.type}</span>
            <span className="text-[10px] text-[#64748b] block truncate">{vessel.subType}</span>
          </div>
          <div className="bg-[#030712]/60 p-2 rounded border border-[#1e293b]">
            <span className="text-[10px] text-[#94a3b8] block">CURRENT SPEED / HDG</span>
            <span className="text-[#00d4ff] font-bold">{vessel.speedKts} kts</span>
            <span className="text-[#94a3b8] text-[10px] ml-1">@ {vessel.headingDeg}°</span>
          </div>
          <div className="bg-[#030712]/60 p-2 rounded border border-[#1e293b]">
            <span className="text-[10px] text-[#94a3b8] block">DESTINATION</span>
            <span className="text-[#f8fafc] font-semibold truncate block">{vessel.destination}</span>
            <span className="text-[10px] text-[#64748b] block">ETA: {vessel.eta.substring(11, 16)}</span>
          </div>
          <div className="bg-[#030712]/60 p-2 rounded border border-[#1e293b]">
            <span className="text-[10px] text-[#94a3b8] block">DIMENSIONS / DWT</span>
            <span className="text-[#f8fafc] font-semibold">{vessel.lengthM}m × {vessel.beamM}m</span>
            {vessel.dwt && <span className="text-[10px] text-[#64748b] block">{vessel.dwt.toLocaleString()} DWT</span>}
          </div>
        </div>

        {/* Distance to Selected Spill */}
        {distanceToIncidentKm !== null && selectedIncident && (
          <div className="p-2.5 rounded-lg bg-[#030712] border border-[#1e293b] mb-3 text-xs font-mono">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-[#94a3b8]">Range to {selectedIncident.code}:</span>
              <span className="font-bold text-[#fbbf24]">{distanceToIncidentKm} km</span>
            </div>
            <div className="text-[10px] text-[#64748b] mt-0.5">
              Traversed sector within spatiotemporal incident window
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => onFocusVesselTrajectory(vessel)}
          className="w-full py-2 rounded-lg bg-[#00d4ff]/15 border border-[#00d4ff]/60 hover:bg-[#00d4ff]/25 text-[#00d4ff] font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Track Historical AIS Trajectory</span>
        </button>
      </div>
    </div>
  );
};
