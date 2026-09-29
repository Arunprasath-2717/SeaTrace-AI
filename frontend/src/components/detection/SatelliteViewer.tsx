import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Satellite, Sliders } from 'lucide-react';
import { demoDetection } from '../../data/demo/detection';

export interface SatelliteViewerProps {
  sceneId?: string;
  className?: string;
}

export const SatelliteViewer: React.FC<SatelliteViewerProps> = ({
  sceneId = demoDetection.sceneId,
  className = '',
}) => {
  const [band, setBand] = useState<'VV' | 'VH' | 'RATIO'>('VV');
  const [contrast, setContrast] = useState(65);

  return (
    <Card
      title="SATELLITE SAR VIEWER"
      subtitle={`SAR Telemetry Feed • ${sceneId}`}
      headerAction={
        <div className="flex items-center gap-2">
          <Badge variant="teal" size="sm">
            {demoDetection.sensor}
          </Badge>
          <Badge variant="mint" size="sm">
            {demoDetection.resolutionMeters}m Resolution
          </Badge>
        </div>
      }
      className={className}
    >
      <div className="space-y-4">
        {/* SAR Canvas Placeholder Area */}
        <div className="relative aspect-video w-full rounded bg-seatrace-bg-primary border border-seatrace-border-subtle flex flex-col items-center justify-center overflow-hidden">
          {/* Subtle radar scan grid styling */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-seatrace-deepTeal/20 via-transparent to-transparent" />
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'radial-gradient(circle, #21ABA5 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative z-10 flex flex-col items-center text-center p-6 max-w-md">
            <div className="w-12 h-12 rounded-full bg-seatrace-bg-surface border border-seatrace-teal/40 flex items-center justify-center text-seatrace-mint mb-3 animate-pulse">
              <Satellite className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-seatrace-text-primary tracking-wide">
              Satellite Viewer Ready
            </h4>
            <p className="text-xs text-seatrace-text-secondary mt-1">
              Synthetic Aperture Radar (SAR) ortho-rectified imagery pipeline will stream georeferenced tiles here.
            </p>
            <div className="mt-3 font-mono text-[11px] text-seatrace-teal bg-seatrace-bg-surface/80 px-2.5 py-1 rounded border border-seatrace-border-subtle">
              Band: {band} | Normalized Backscatter: σ°
            </div>
          </div>
        </div>

        {/* Viewer Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-seatrace-bg-surface/50 rounded border border-seatrace-border-subtle text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono text-seatrace-text-secondary uppercase text-[10px]">
              Polarization Band:
            </span>
            <div className="flex gap-1">
              {(['VV', 'VH', 'RATIO'] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => setBand(b)}
                  className={`px-2 py-1 rounded font-mono text-xs font-semibold transition-colors ${
                    band === b
                      ? 'bg-seatrace-teal text-seatrace-text-inverse'
                      : 'bg-seatrace-bg-card text-seatrace-text-secondary hover:text-seatrace-text-primary'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Sliders className="w-3.5 h-3.5 text-seatrace-teal" />
            <span className="font-mono text-[10px] text-seatrace-text-secondary uppercase">
              Contrast: {contrast}%
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="w-24 accent-seatrace-mint cursor-pointer"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SatelliteViewer;
