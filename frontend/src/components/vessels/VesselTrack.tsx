import React from 'react';
import { Card } from '../common/Card';
import { CandidateVessel } from '../../types/vessel';
import { Navigation } from 'lucide-react';

export const VesselTrack: React.FC<{ vessel: CandidateVessel | null; className?: string }> = ({
  vessel,
  className = '',
}) => {
  if (!vessel) {
    return null;
  }

  return (
    <Card
      title="TRACK CHRONOLOGY & WAYPOINTS"
      subtitle={`Chronological positions along voyage corridor (${vessel.track.points.length} waypoints)`}
      className={className}
    >
      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {vessel.track.points.map((pt, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono"
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-600 font-bold">#{idx + 1}</span>
              <Navigation className="w-3.5 h-3.5 text-indigo-700" />
              <span className="text-slate-900 font-bold">
                {pt.latitude.toFixed(3)}°N, {Math.abs(pt.longitude).toFixed(3)}°W
              </span>
            </div>

            <div className="flex items-center gap-3 text-right">
              {pt.speedKnots && (
                <span className="text-teal-800 font-bold">{pt.speedKnots} kts</span>
              )}
              <span className="text-slate-700 font-medium text-[11px]">
                {new Date(pt.timestamp).toISOString().substring(11, 19)}Z
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default VesselTrack;
