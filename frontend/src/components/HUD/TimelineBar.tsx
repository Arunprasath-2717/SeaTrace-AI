import React, { useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Clock,
} from 'lucide-react';

interface TimelineBarProps {
  timelineHoursOffset: number; // e.g. -24 to +24 hours
  onChangeHoursOffset: (hours: number | ((prev: number) => number)) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  playbackSpeed: number; // 1, 2, 5, 10
  onChangeSpeed: (speed: number) => void;
}


export const TimelineBar: React.FC<TimelineBarProps> = ({
  timelineHoursOffset,
  onChangeHoursOffset,
  isPlaying,
  onTogglePlay,
  playbackSpeed,
  onChangeSpeed,
}) => {
  const BASE_TIME = new Date('2026-09-26T06:42:00Z'); // Detection baseline

  // Calculate current simulated time
  const simulatedTime = new Date(BASE_TIME.getTime() + timelineHoursOffset * 3600 * 1000);

  // Playback timer loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      onChangeHoursOffset((prev) => {
        const next = prev + 0.5 * (playbackSpeed / 2);
        if (next > 24) return -24; // loop around
        return Number(next.toFixed(1));
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, onChangeHoursOffset]);

  const SPEEDS = [1, 2, 5, 10];

  return (
    <div className="absolute bottom-4 left-6 right-6 z-20 pointer-events-auto">
      <div className="hud-panel px-4 py-2 rounded-xl border border-[#1e293b] shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-2.5">
        {/* Playback Controls & Speed Selector */}
        <div className="flex items-center space-x-2">
          {/* Skip to Beginning (T - 24h) */}
          <button
            onClick={() => onChangeHoursOffset(-24)}
            title="Jump to T - 24h (Historical AIS Analysis)"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-[#00d4ff] hover:bg-[#1e293b]/60 transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Play / Pause Toggle */}
          <button
            onClick={onTogglePlay}
            className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold transition-all ${
              isPlaying
                ? 'bg-[#ff4d4d] text-[#030712] shadow-[0_0_12px_rgba(255,77,77,0.5)]'
                : 'bg-[#00d4ff] text-[#030712] hover:opacity-90 shadow-[0_0_12px_rgba(0,212,255,0.4)]'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          {/* Skip to Real-Time (T + 0h) */}
          <button
            onClick={() => onChangeHoursOffset(0)}
            title="Reset to Detection Timestamp (T + 0h)"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-[#00d4ff] hover:bg-[#1e293b]/60 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Jump to End (T + 24h) */}
          <button
            onClick={() => onChangeHoursOffset(24)}
            title="Jump to T + 24h (Maximum Drift Forecast)"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-[#00d4ff] hover:bg-[#1e293b]/60 transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-[#1e293b] mx-1" />

          {/* Speed Selector */}
          <div className="flex items-center space-x-1 font-mono text-xs">
            {SPEEDS.map((spd) => (
              <button
                key={spd}
                onClick={() => onChangeSpeed(spd)}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition-colors ${
                  playbackSpeed === spd
                    ? 'bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/40'
                    : 'text-[#94a3b8] hover:text-[#f8fafc]'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Center: Scrubber Slider with Timeline Labels */}
        <div className="flex-1 w-full flex flex-col px-2 max-w-2xl">
          <div className="flex justify-between items-center text-[10px] font-mono text-[#94a3b8] mb-1">
            <span className="text-[#38bdf8]">T - 24h (Historical Passage)</span>
            <span className="text-[#f59e0b] font-bold">T - 5.5h (Estimated Release)</span>
            <span className="text-[#ff4d4d] font-bold">T0 (SAR Detection)</span>
            <span className="text-[#10b981]">+12h Forecast</span>
            <span className="text-[#fbbf24]">+24h Drift Landfall</span>
          </div>

          <div className="relative flex items-center">
            <input
              type="range"
              min="-24"
              max="24"
              step="0.5"
              value={timelineHoursOffset}
              onChange={(e) => onChangeHoursOffset(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#1e293b] rounded-lg appearance-none cursor-pointer accent-[#00d4ff]"
            />
          </div>
        </div>

        {/* Right: Simulated Timestamp & Offset Indicator */}
        <div className="flex items-center space-x-3 font-mono text-xs shrink-0">
          <div className="bg-[#030712] px-3 py-1 rounded-lg border border-[#1e293b] text-right">
            <div className="flex items-center space-x-1 text-[#00d4ff] font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {timelineHoursOffset > 0 ? `+${timelineHoursOffset}h` : `${timelineHoursOffset}h`}
              </span>
              <span className="text-[10px] text-[#94a3b8] ml-1">
                {timelineHoursOffset < 0
                  ? '(BACKWARD FORENSICS)'
                  : timelineHoursOffset === 0
                  ? '(INCIDENT ACQUISITION)'
                  : '(HYDRODYNAMIC DRIFT)'}
              </span>
            </div>
            <div className="text-[10px] text-[#94a3b8]">
              SIM: {simulatedTime.toISOString().substring(0, 10)}{' '}
              {simulatedTime.toISOString().substring(11, 16)} UTC
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
