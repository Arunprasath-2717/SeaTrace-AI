import React from 'react';
import { Plus, Minus, Compass, Maximize2 } from 'lucide-react';

export interface MapControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetBearing?: () => void;
  onFitBounds?: () => void;
  coordinates?: { lng: number; lat: number; zoom: number };
  className?: string;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onResetBearing,
  onFitBounds,
  coordinates,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Zoom / Orientation Toolbar */}
      <div className="flex flex-col bg-seatrace-bg-surface/90 backdrop-blur rounded border border-seatrace-border-subtle shadow-panel overflow-hidden">
        <button
          onClick={onZoomIn}
          title="Zoom in"
          className="p-2 text-seatrace-text-secondary hover:text-seatrace-mint hover:bg-seatrace-bg-card transition-colors border-b border-seatrace-border-subtle"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={onZoomOut}
          title="Zoom out"
          className="p-2 text-seatrace-text-secondary hover:text-seatrace-mint hover:bg-seatrace-bg-card transition-colors border-b border-seatrace-border-subtle"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={onResetBearing}
          title="Reset bearing to North"
          className="p-2 text-seatrace-text-secondary hover:text-seatrace-teal hover:bg-seatrace-bg-card transition-colors border-b border-seatrace-border-subtle"
        >
          <Compass className="w-4 h-4" />
        </button>
        {onFitBounds && (
          <button
            onClick={onFitBounds}
            title="Fit scene bounds"
            className="p-2 text-seatrace-text-secondary hover:text-seatrace-mint hover:bg-seatrace-bg-card transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Coordinate & Zoom Readout */}
      {coordinates && (
        <div className="bg-seatrace-bg-primary/90 backdrop-blur px-2.5 py-1.5 rounded border border-seatrace-border-subtle text-[11px] font-mono text-seatrace-text-secondary flex flex-col gap-0.5">
          <div className="flex justify-between gap-2">
            <span className="text-seatrace-teal">LAT:</span>
            <span>{coordinates.lat.toFixed(4)}°N</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-seatrace-teal">LNG:</span>
            <span>{coordinates.lng.toFixed(4)}°W</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-seatrace-text-dim">ZOOM:</span>
            <span>{coordinates.zoom.toFixed(1)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapControls;
