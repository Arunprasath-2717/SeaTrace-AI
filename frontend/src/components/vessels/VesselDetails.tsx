import React from 'react';
import { Card } from '../common/Card';
import { CandidateVessel } from '../../types/vessel';


export const VesselDetails: React.FC<{ vessel: CandidateVessel | null; className?: string }> = ({
  vessel,
  className = '',
}) => {
  if (!vessel) {
    return (
      <Card title="VESSEL DOSSIER" className={className}>
        <p className="text-xs text-seatrace-text-muted">Select a vessel to inspect registry details.</p>
      </Card>
    );
  }

  const latestPoint = vessel.track.points[vessel.track.points.length - 1];

  return (
    <Card
      title={vessel.identity.name}
      subtitle={`Registry & Kinematic Specifications • MMSI ${vessel.identity.mmsi}`}
      className={className}
    >
      <div className="grid grid-cols-2 gap-3 text-xs font-mono">
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-300">
          <div className="text-[10px] text-slate-700 font-bold uppercase">IMO Number</div>
          <div className="text-slate-900 font-black">{vessel.identity.imo || 'N/A'}</div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-300">
          <div className="text-[10px] text-slate-700 font-bold uppercase">Callsign</div>
          <div className="text-slate-900 font-black">{vessel.identity.callsign || 'N/A'}</div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-300">
          <div className="text-[10px] text-slate-700 font-bold uppercase">Flag State</div>
          <div className="text-slate-900 font-black">{vessel.identity.flag}</div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-300">
          <div className="text-[10px] text-slate-700 font-bold uppercase">Draught</div>
          <div className="text-slate-900 font-black">{vessel.identity.draughtMeters} m</div>
        </div>

        <div className="col-span-2 p-2.5 rounded-lg bg-slate-50 border border-slate-300">
          <div className="text-[10px] text-slate-700 font-bold uppercase">Reported Destination</div>
          <div className="text-indigo-900 font-black">{vessel.identity.destination}</div>
        </div>

        {latestPoint && (
          <div className="col-span-2 p-2.5 rounded-lg bg-slate-50 border border-slate-300 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-700 font-bold uppercase">Speed & Heading</div>
              <div className="text-slate-900 font-black">
                {latestPoint.speedKnots} kts @ {latestPoint.headingDegrees}°
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-700 font-bold uppercase">AIS Coverage</div>
              <div className="text-teal-800 font-black">{vessel.track.coverageHours}h log</div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default VesselDetails;
