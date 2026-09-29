import React from 'react';
import { CandidateVessel } from '../../types/vessel';
import { Badge } from '../common/Badge';
import { Ship } from 'lucide-react';

export interface VesselTableProps {
  vessels: CandidateVessel[];
  selectedVesselId?: string;
  onSelectVessel?: (vesselId: string) => void;
  className?: string;
}

export const VesselTable: React.FC<VesselTableProps> = ({
  vessels,
  selectedVesselId,
  onSelectVessel,
  className = '',
}) => {
  const getQualityBadge = (quality: CandidateVessel['aisQuality']) => {
    switch (quality) {
      case 'high':
        return <Badge variant="mint" size="sm">AIS HIGH</Badge>;
      case 'medium':
        return <Badge variant="teal" size="sm">AIS MEDIUM</Badge>;
      case 'gap_detected':
        return <Badge variant="warning" size="sm">OBSERVATION GAP</Badge>;
      case 'spoofed':
        return <Badge variant="danger" size="sm">ANOMALOUS</Badge>;
      default:
        return <Badge variant="neutral" size="sm">UNKNOWN</Badge>;
    }
  };

  const getEvidenceStatusBadge = (status: CandidateVessel['evidenceStatus']) => {
    switch (status) {
      case 'Verified':
        return <Badge variant="mint" size="sm">VERIFIED</Badge>;
      case 'Needs Review':
        return <Badge variant="warning" size="sm">NEEDS REVIEW</Badge>;
      case 'Insufficient Evidence':
      default:
        return <Badge variant="neutral" size="sm">INSUFFICIENT</Badge>;
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Search Criteria & Window Header */}
      <div className="p-3 rounded-lg bg-slate-50 border border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
        <div>
          <span className="text-[10px] uppercase text-slate-700 font-bold block">Investigation Time Window</span>
          <span className="text-slate-900 font-bold">2026-09-24 04:00 to 18:00 UTC (14-Hour Correlated Window)</span>
        </div>
        <div>
          <span className="text-[10px] uppercase text-slate-700 font-bold block">Candidate Generation Criteria</span>
          <span className="text-teal-800 font-bold">Spatial overlap with 95th-percentile envelope (±4 hours)</span>
        </div>
      </div>

      {/* Candidate Vessels Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-300 bg-white">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-100 border-b border-slate-300 text-[10px] uppercase text-slate-900 font-black">
            <tr>
              <th className="px-4 py-3">Candidate Vessel</th>
              <th className="px-4 py-3 text-center">Temporal Compatibility</th>
              <th className="px-4 py-3 text-center">Spatial Compatibility</th>
              <th className="px-4 py-3 text-center">Drift Compatibility</th>
              <th className="px-4 py-3">AIS Quality</th>
              <th className="px-4 py-3 text-center">Evidence Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {vessels.map((v) => {
              const isSelected = v.id === selectedVesselId;
              return (
                <tr
                  key={v.id}
                  onClick={() => onSelectVessel?.(v.id)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-indigo-50/80 border-l-4 border-indigo-600'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Candidate Identity */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded bg-slate-100 border border-slate-300 flex items-center justify-center text-indigo-700 flex-shrink-0">
                        <Ship className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-black text-slate-900 font-sans text-xs">
                          {v.identity.name}
                        </div>
                        <div className="text-[10px] text-slate-700 font-medium">
                          IMO: {v.identity.imo} • MMSI: {v.identity.mmsi} • {v.identity.vesselType}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Temporal Compatibility */}
                  <td className="px-4 py-3 text-center">
                    <span className="font-bold text-teal-800">
                      {(v.temporalCompatibility * 100).toFixed(0)}%
                    </span>
                  </td>

                  {/* Spatial Compatibility */}
                  <td className="px-4 py-3 text-center">
                    <span className="font-bold text-indigo-700">
                      {(v.spatialCompatibility * 100).toFixed(0)}%
                    </span>
                  </td>

                  {/* Drift Compatibility */}
                  <td className="px-4 py-3 text-center">
                    <span className="font-bold text-emerald-800">
                      {(v.driftCompatibility * 100).toFixed(0)}%
                    </span>
                  </td>

                  {/* AIS Quality */}
                  <td className="px-4 py-3">
                    {getQualityBadge(v.aisQuality)}
                  </td>

                  {/* Evidence Status */}
                  <td className="px-4 py-3 text-center">
                    {getEvidenceStatusBadge(v.evidenceStatus)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VesselTable;
