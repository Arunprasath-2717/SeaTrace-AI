import React, { useState } from 'react';
import { Layers, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';

export interface LayerState {
  satellite: boolean;
  slick: boolean;
  vessels: boolean;
  tracks: boolean;
  origin: boolean;
  simulation: boolean;
}

export interface LayerControlProps {
  layers: LayerState;
  onToggleLayer: (layerKey: keyof LayerState) => void;
  className?: string;
}

export const LayerControl: React.FC<LayerControlProps> = ({
  layers,
  onToggleLayer,
  className = '',
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const layerItems: { key: keyof LayerState; label: string; color: string }[] = [
    { key: 'satellite', label: 'SAR Telemetry', color: 'bg-seatrace-deepTeal' },
    { key: 'slick', label: 'Oil Spill Slick', color: 'bg-seatrace-teal' },
    { key: 'vessels', label: 'Candidate Vessels', color: 'bg-seatrace-mint' },
    { key: 'tracks', label: 'Voyage Tracks', color: 'bg-emerald-400' },
    { key: 'origin', label: 'Origin Zone', color: 'bg-amber-400' },
    { key: 'simulation', label: 'Simulation Contour', color: 'bg-sky-400' },
  ];

  return (
    <div
      className={`bg-seatrace-bg-surface/90 backdrop-blur rounded border border-seatrace-border-subtle shadow-panel overflow-hidden w-56 ${className}`}
    >
      <div
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-between px-3 py-2 bg-seatrace-bg-secondary/70 border-b border-seatrace-border-subtle cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-seatrace-teal" />
          <span className="text-xs font-semibold uppercase font-mono tracking-wider text-seatrace-text-primary">
            Map Layers
          </span>
        </div>
        {collapsed ? (
          <ChevronDown className="w-3.5 h-3.5 text-seatrace-text-muted" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5 text-seatrace-text-muted" />
        )}
      </div>

      {!collapsed && (
        <div className="p-2 space-y-1">
          {layerItems.map((item) => {
            const isVisible = layers[item.key];
            return (
              <button
                key={item.key}
                onClick={() => onToggleLayer(item.key)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors ${
                  isVisible
                    ? 'text-seatrace-text-primary bg-seatrace-bg-card/60'
                    : 'text-seatrace-text-muted hover:text-seatrace-text-secondary hover:bg-seatrace-bg-surface'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-2 h-2 rounded-full ${item.color} flex-shrink-0`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {isVisible ? (
                  <Eye className="w-3.5 h-3.5 text-seatrace-mint flex-shrink-0" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 text-seatrace-text-dim flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LayerControl;
