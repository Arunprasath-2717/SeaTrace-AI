import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { demoOrigin } from '../../data/demo/origin';
import { MapPin, Clock, AlertTriangle, Layers } from 'lucide-react';

export const OriginSummary: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <Card
      title="PROBABLE ORIGIN RECONSTRUCTION"
      subtitle="Estimated spill release spatiotemporal bounding box"
      headerAction={
        <Badge variant="warning" size="sm">
          ±{demoOrigin.uncertaintyKm} KM ENVELOPE
        </Badge>
      }
      className={className}
    >
      <div className="space-y-3 text-xs font-mono">
        {/* Method & Physical Formulation */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-300 space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] uppercase text-indigo-700 font-bold">
            <Layers className="w-3.5 h-3.5" />
            Methodology
          </div>
          <div className="text-xs font-black text-slate-900 font-sans">
            Lagrangian Reverse Trajectory Integration
          </div>
          <p className="text-[11px] text-slate-700 font-medium font-sans leading-relaxed">
            {demoOrigin.ensemble.methodDescription}
          </p>
        </div>

        {/* Probable Origin Zone (Centroid & 95th Percentile Envelope) */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-300">
          <div className="flex items-center gap-1.5 text-[10px] uppercase text-slate-700 font-bold mb-1">
            <MapPin className="w-3.5 h-3.5 text-indigo-700" />
            Probable Origin Zone Centroid
          </div>
          <div className="text-sm font-black text-slate-900">
            {demoOrigin.probableZone.latitude.toFixed(4)}°N, {Math.abs(demoOrigin.probableZone.longitude).toFixed(4)}°W
          </div>
          <div className="text-indigo-900 font-black mt-0.5">
            {demoOrigin.probableZone.description}
          </div>
        </div>

        {/* Estimated Release Window */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-300">
          <div className="flex items-center gap-1.5 text-[10px] uppercase text-slate-700 font-bold mb-1">
            <Clock className="w-3.5 h-3.5 text-indigo-700" />
            Estimated Release Window
          </div>
          <div className="text-xs font-black text-slate-900">
            {new Date(demoOrigin.releaseWindow.start).toISOString().replace('T', ' ').substring(0, 16)} UTC
            {' '}to{' '}
            {new Date(demoOrigin.releaseWindow.end).toISOString().replace('T', ' ').substring(0, 16)} UTC
          </div>
          <div className="text-[11px] text-slate-700 font-medium mt-0.5">
            Estimated discharge duration: ~{demoOrigin.releaseWindow.estimatedDurationMinutes} minutes prior to observation
          </div>
        </div>

        {/* Origin Uncertainty */}
        <div className="p-3 rounded-lg border border-amber-300 bg-amber-50 text-amber-950">
          <div className="flex items-center gap-1.5 text-[10px] uppercase text-amber-900 font-bold mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
            Origin Uncertainty & Dispersion Boundary
          </div>
          <p className="text-[11px] font-sans leading-relaxed text-amber-950 font-medium">
            {demoOrigin.uncertaintyDescription}. Current sheer and turbulent sub-grid diffusivity prevent point-source localization beyond the 95th-percentile envelope.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default OriginSummary;
