import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { demoDetection } from '../../data/demo/detection';
import { Sliders, Compass, ShieldCheck } from 'lucide-react';

export type SarViewMode = 'original' | 'processed' | 'mask' | 'overlay';

export const SarAnalysisViewer: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [viewMode, setViewMode] = useState<SarViewMode>('overlay');
  const [polarization, setPolarization] = useState<'VV' | 'VH'>('VV');
  const [threshold, setThreshold] = useState<number>(0.5);

  return (
    <Card
      title="SATELLITE SAR ANALYSIS VIEWER"
      subtitle={`Sentinel-1A SAR Level-1 GRD • ${demoDetection.sceneId}`}
      headerAction={
        <div className="flex items-center gap-2">
          <Badge variant="teal" size="sm">
            {demoDetection.mode} ({demoDetection.polarization})
          </Badge>
          <Badge variant="mint" size="sm">
            {demoDetection.resolutionMeters}m RESOLUTION
          </Badge>
        </div>
      }
      className={className}
    >
      <div className="space-y-4">
        {/* Layer Mode Selector Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-seatrace-border-subtle pb-3">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded border border-slate-200 text-xs font-mono">
            {[
              { id: 'original', label: '1. Original SAR' },
              { id: 'processed', label: '2. Processed SAR' },
              { id: 'mask', label: '3. AI Segmentation Mask' },
              { id: 'overlay', label: '4. Detection Overlay' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id as SarViewMode)}
                className={`px-2.5 py-1 rounded transition-colors uppercase ${
                  viewMode === tab.id
                    ? 'bg-seatrace-teal text-white font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-seatrace-text-muted text-[10px] uppercase">Polarization:</span>
            {(['VV', 'VH'] as const).map((pol) => (
              <button
                key={pol}
                onClick={() => setPolarization(pol)}
                className={`px-2 py-0.5 rounded text-[11px] ${
                  polarization === pol
                    ? 'bg-teal-100 text-teal-800 font-bold border border-teal-300'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {pol}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Simulated Radar / Mask Canvas Viewport */}
        <div className="relative aspect-video w-full rounded-lg bg-[#040D18] border border-seatrace-border-subtle overflow-hidden flex items-center justify-center p-4 select-none">
          {/* Gridded coordinates overlay */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #21ABA5 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          {/* SVG Representation of Radar Backscatter and Slick Delineation */}
          <svg className="w-full h-full max-w-xl max-h-72" viewBox="0 0 500 300">
            <defs>
              <radialGradient id="oceanBg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0B1A2C" />
                <stop offset="100%" stopColor="#05101E" />
              </radialGradient>
              <linearGradient id="slickGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#45EBA5" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#21ABA5" stopOpacity="0.15" />
              </linearGradient>
            </defs>

            {/* Ocean backscatter base */}
            <rect width="500" height="300" fill="url(#oceanBg)" />

            {/* Processed Noise / Speckle Texture (if original or processed) */}
            {(viewMode === 'original' || viewMode === 'processed') && (
              <g opacity={viewMode === 'original' ? 0.35 : 0.15}>
                {[...Array(30)].map((_, i) => (
                  <circle
                    key={i}
                    cx={(i * 37) % 500}
                    cy={(i * 23) % 300}
                    r={(i % 3) + 1}
                    fill="#21ABA5"
                  />
                ))}
              </g>
            )}

            {/* Damped Slick Anomaly (Capillary Wave Suppression Zone) */}
            <path
              d="M 120,90 Q 210,130 290,120 T 410,170 Q 340,210 240,190 T 110,130 Z"
              fill={
                viewMode === 'original'
                  ? '#02070E'
                  : viewMode === 'processed'
                  ? '#01050A'
                  : viewMode === 'mask'
                  ? '#45EBA5'
                  : 'url(#slickGradient)'
              }
              stroke={viewMode === 'mask' || viewMode === 'overlay' ? '#45EBA5' : '#1D566E'}
              strokeWidth={viewMode === 'overlay' ? '2.5' : '1.5'}
              strokeDasharray={viewMode === 'overlay' ? 'none' : '4 2'}
              className="transition-all duration-300"
            />

            {/* Slick Boundary Contour Label */}
            {viewMode === 'overlay' && (
              <>
                <circle cx="260" cy="155" r="4" fill="#45EBA5" />
                <text x="272" y="159" fill="#F1F5F9" fontSize="11" fontFamily="monospace">
                  Delineated Slick ({demoDetection.area} km²)
                </text>
                <text x="272" y="174" fill="#94A3B8" fontSize="9" fontFamily="monospace">
                  Backscatter Damping: -7.2 dB
                </text>
              </>
            )}

            {/* Mask Mode Probability Labels */}
            {viewMode === 'mask' && (
              <text x="210" y="160" fill="#040D18" fontSize="12" fontWeight="bold" fontFamily="monospace">
                PIXEL CLASS: OIL SLICK
              </text>
            )}
          </svg>

          {/* View Mode Watermark Tag */}
          <div className="absolute top-3 left-3 bg-white/95 border border-slate-200 shadow-sm px-2.5 py-1 rounded text-[10px] font-mono text-slate-800">
            MODE: <span className="text-teal-700 font-bold uppercase">{viewMode.replace('_', ' ')}</span>
          </div>

          <div className="absolute bottom-3 left-3 flex items-center gap-2 text-[10px] font-mono text-slate-700 bg-white/95 px-2.5 py-1 rounded border border-slate-200 shadow-sm">
            <Compass className="w-3 h-3 text-seatrace-teal" />
            Center: 28.452°N, 90.218°W
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-slate-100 rounded-lg border border-slate-300 text-xs font-mono">
          <div className="flex items-center gap-3">
            <Sliders className="w-4 h-4 text-indigo-700" />
            <span className="text-slate-800 text-[11px] font-semibold">
              Segmentation Probability Cutoff: <strong className="text-indigo-900 font-black">{(threshold * 100).toFixed(0)}%</strong>
            </span>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-28 accent-indigo-600 cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-700 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            Lee Speckle Filter (7x7) • Radiometrically Calibrated
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SarAnalysisViewer;
