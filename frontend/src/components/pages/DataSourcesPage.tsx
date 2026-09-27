import React, { useState } from 'react';
import { useSentinel } from '../../context/SentinelContext';
import { DATA_SOURCES } from '../../data/sentinelData';
import {
  Database,
  Radio,
  Satellite,
  Waves,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Play,
  AlertCircle,
} from 'lucide-react';

export const DataSourcesPage: React.FC = () => {
  const { showToast } = useSentinel();
  const [sources, setSources] = useState(DATA_SOURCES);
  const [testingId, setTestingId] = useState<string | null>(null);

  const handleTestConnection = (id: string, name: string) => {
    setTestingId(id);
    setTimeout(() => {
      setTestingId(null);
      showToast(`Connection to ${name} verified: 200 OK (Latency: 42ms)`, 'success');
    }, 800);
  };

  return (
    <div className="flex-1 flex flex-col gap-5 p-6 overflow-y-auto select-none bg-[#07111F] text-slate-100 scrollbar-thin">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-[#00C2FF]" />
          <h1 className="text-xl font-black tracking-tight text-white uppercase font-mono">
            Data Sources & Ingestion Streams
          </h1>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            TELEMETRY FEEDS
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Live satellite constellation downlinks, terrestrial/spaceborne AIS transponder streams, and hydrodynamic MetOcean models.
        </p>
      </div>

      {/* Connection Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sources.map((src) => {
          const isTesting = testingId === src.id;

          return (
            <div
              key={src.id}
              className="p-5 rounded-2xl border border-[#23364B] bg-[#0D1B2A] flex flex-col justify-between transition-all hover:border-slate-500"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#00C2FF]">
                    {src.type}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {src.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white font-mono leading-tight mb-1">
                  {src.name}
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                  {src.description}
                </p>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono p-2.5 rounded-xl bg-[#07111F] border border-[#23364B] mb-4">
                  <div>
                    <span className="text-slate-500 block">Provider</span>
                    <span className="text-slate-300 font-semibold truncate block">
                      {src.provider}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Latency</span>
                    <span className="text-emerald-400 font-semibold block">
                      {src.latencyMs} ms
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Last Sync</span>
                    <span className="text-slate-300 block">{src.lastSync}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Records Cached</span>
                    <span className="text-[#00C2FF] truncate block">
                      {src.recordsCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#23364B]/60">
                <button
                  onClick={() => handleTestConnection(src.id, src.name)}
                  disabled={isTesting}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-[#07111F] hover:bg-[#13283F] border border-[#23364B] text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  {isTesting ? (
                    <>
                      <span className="w-3 h-3 border-2 border-[#00C2FF] border-t-transparent rounded-full animate-spin" />
                      <span>Pinging...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3 h-3 text-[#00C2FF]" />
                      <span>Test Connection</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
