import React from 'react';
import { useSentinel } from '../../context/SentinelContext';
import { LeafletMaritimeMap } from '../common/LeafletMaritimeMap';
import {
  AlertTriangle,
  Flame,
  Ship,
  CheckCircle2,
  Percent,
  Satellite,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Compass,
  FileText,
  MapPin,
  ChevronRight,
  Radar,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

export const CommandCenterPage: React.FC = () => {
  const {
    incidents,
    vessels,
    selectedIncident,
    setSelectedIncident,
    setSelectedVessel,
    setActivePage,
    selectedRegion,
  } = useSentinel();

  // Filtered by selected operational region if not "All Regions"
  const filteredIncidents = incidents.filter((inc) =>
    selectedRegion === 'All Regions' ? true : inc.region === selectedRegion
  );

  // KPIs
  const totalIncidents = incidents.length;
  const highPriority = incidents.filter(
    (i) => i.severity === 'Critical' || i.severity === 'High'
  ).length;
  const underInvestigation = vessels.filter(
    (v) => v.investigationStatus === 'Prime Suspect' || v.investigationStatus === 'Person of Interest'
  ).length;
  const confirmedSpills = incidents.filter((i) => i.status !== 'Archived').length;
  const avgConfidence = (
    incidents.reduce((acc, i) => acc + i.confidencePct, 0) / incidents.length
  ).toFixed(1);

  // Chart Data: Severity Breakdown
  const severityData = [
    { name: 'Critical', count: incidents.filter((i) => i.severity === 'Critical').length, color: '#EF4444' },
    { name: 'High', count: incidents.filter((i) => i.severity === 'High').length, color: '#F59E0B' },
    { name: 'Medium', count: incidents.filter((i) => i.severity === 'Medium').length, color: '#14B8A6' },
    { name: 'Low', count: incidents.filter((i) => i.severity === 'Low').length, color: '#00C2FF' },
  ];

  // Chart Data: Regional Distribution
  const regionData = [
    { region: 'Arabian Sea', count: 4 },
    { region: 'Bay of Bengal', count: 2 },
    { region: 'Gulf of Mannar', count: 1 },
    { region: 'Six Degree Ch.', count: 1 },
  ];

  // Chart Data: Detection Confidence Trends
  const trendData = [
    { month: 'Apr', incidents: 3, avgConfidence: 89 },
    { month: 'May', incidents: 5, avgConfidence: 91 },
    { month: 'Jun', incidents: 8, avgConfidence: 94 },
    { month: 'Jul', incidents: 6, avgConfidence: 93 },
    { month: 'Aug', incidents: 7, avgConfidence: 95 },
    { month: 'Sep', incidents: 8, avgConfidence: 92 },
  ];

  return (
    <div className="flex-1 flex flex-col gap-5 p-6 overflow-y-auto select-none bg-[#07111F] text-slate-100 scrollbar-thin">
      {/* Page Title & Operational Status Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-xl font-black tracking-tight text-white uppercase font-mono">
              Command Center Overview
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00C2FF]/15 text-[#00C2FF] border border-[#00C2FF]/30">
              NATIONAL MARITIME DEFENSE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time geospatial intelligence, satellite SAR detections, and AIS correlation for Indian waters.
          </p>
        </div>

        {/* Quick Action Navigation Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => setActivePage('spill-detection')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#00C2FF] to-[#14B8A6] text-slate-950 font-bold text-xs shadow-md hover:opacity-95 transition-all"
          >
            <Radar className="w-3.5 h-3.5" />
            <span>Run Spill Detection</span>
          </button>
          <button
            onClick={() => setActivePage('maritime-map')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D1B2A] hover:bg-[#13283F] border border-[#23364B] text-slate-200 font-semibold text-xs transition-all"
          >
            <MapPin className="w-3.5 h-3.5 text-[#00C2FF]" />
            <span>Open Maritime Map</span>
          </button>
          <button
            onClick={() => setActivePage('spill-attribution')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D1B2A] hover:bg-[#13283F] border border-[#23364B] text-slate-200 font-semibold text-xs transition-all"
          >
            <Ship className="w-3.5 h-3.5 text-[#14B8A6]" />
            <span>Investigate Incident</span>
          </button>
          <button
            onClick={() => setActivePage('analytics-reports')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D1B2A] hover:bg-[#13283F] border border-[#23364B] text-slate-200 font-semibold text-xs transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* 6 Core KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {/* KPI 1 */}
        <div className="p-3.5 rounded-2xl bg-[#0D1B2A] border border-[#23364B] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono">Total Spills</span>
            <AlertTriangle className="w-4 h-4 text-[#00C2FF]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-white">{totalIncidents}</span>
            <span className="text-[10px] font-mono text-emerald-400">+2 this week</span>
          </div>
          <span className="text-[9px] font-mono text-slate-500 mt-1">SIMULATED DATA</span>
        </div>

        {/* KPI 2 */}
        <div className="p-3.5 rounded-2xl bg-[#0D1B2A] border border-[#23364B] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono">High Priority</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-rose-400">{highPriority}</span>
            <span className="text-[10px] font-mono text-rose-400">Critical Alerts</span>
          </div>
          <span className="text-[9px] font-mono text-slate-500 mt-1">SIMULATED DATA</span>
        </div>

        {/* KPI 3 */}
        <div className="p-3.5 rounded-2xl bg-[#0D1B2A] border border-[#23364B] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono">Suspect Vessels</span>
            <Ship className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-amber-400">{underInvestigation}</span>
            <span className="text-[10px] font-mono text-slate-400">1 Prime Suspect</span>
          </div>
          <span className="text-[9px] font-mono text-slate-500 mt-1">SIMULATED DATA</span>
        </div>

        {/* KPI 4 */}
        <div className="p-3.5 rounded-2xl bg-[#0D1B2A] border border-[#23364B] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono">Confirmed Slicks</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-emerald-400">{confirmedSpills}</span>
            <span className="text-[10px] font-mono text-slate-400">Under Tracking</span>
          </div>
          <span className="text-[9px] font-mono text-slate-500 mt-1">SIMULATED DATA</span>
        </div>

        {/* KPI 5 */}
        <div className="p-3.5 rounded-2xl bg-[#0D1B2A] border border-[#23364B] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono">Avg SAR Confidence</span>
            <Percent className="w-4 h-4 text-[#14B8A6]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-[#14B8A6]">{avgConfidence}%</span>
            <span className="text-[10px] font-mono text-emerald-400">High Precision</span>
          </div>
          <span className="text-[9px] font-mono text-slate-500 mt-1">SIMULATED DATA</span>
        </div>

        {/* KPI 6 */}
        <div className="p-3.5 rounded-2xl bg-[#0D1B2A] border border-[#23364B] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono">Satellite Passes</span>
            <Satellite className="w-4 h-4 text-[#00C2FF]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-white">4 / 24h</span>
            <span className="text-[10px] font-mono text-[#00C2FF]">Sentinel & Radarsat</span>
          </div>
          <span className="text-[9px] font-mono text-slate-500 mt-1">SIMULATED DATA</span>
        </div>
      </div>

      {/* Main Operational Section: Map (60%) + Active Incidents Panel (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[520px]">
        {/* A. Large Interactive Maritime Map (approx 65% on lg) */}
        <div className="lg:col-span-8 h-full flex flex-col rounded-2xl border border-[#23364B] overflow-hidden bg-[#0D1B2A]">
          <div className="p-3 px-4 bg-[#07111F] border-b border-[#23364B] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                Geospatial Surveillance Center
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                (Click markers or polygons to inspect)
              </span>
            </div>
            <button
              onClick={() => setActivePage('maritime-map')}
              className="flex items-center gap-1 text-[11px] font-semibold text-[#00C2FF] hover:underline"
            >
              <span>Full Screen Map</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex-1 w-full relative">
            <LeafletMaritimeMap
              incidents={filteredIncidents}
              vessels={vessels}
              selectedIncident={selectedIncident}
              onSelectIncident={(inc) => setSelectedIncident(inc)}
              onSelectVessel={(v) => setSelectedVessel(v)}
            />
          </div>
        </div>

        {/* B. Right-side Active Incidents Panel (approx 35% on lg) */}
        <div className="lg:col-span-4 h-full flex flex-col rounded-2xl border border-[#23364B] bg-[#0D1B2A] overflow-hidden">
          <div className="p-3.5 bg-[#07111F] border-b border-[#23364B] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                Active Incidents ({filteredIncidents.length})
              </h2>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Click to focus</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5 scrollbar-thin">
            {filteredIncidents.map((inc) => {
              const isSelected = selectedIncident?.id === inc.id;
              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#13283F] border-[#00C2FF] shadow-md shadow-[#00C2FF]/10'
                      : 'bg-[#07111F]/70 border-[#23364B] hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          inc.severity === 'Critical'
                            ? 'bg-rose-500 animate-pulse'
                            : inc.severity === 'High'
                            ? 'bg-amber-500'
                            : 'bg-teal-400'
                        }`}
                      />
                      <span className="font-mono font-bold text-xs text-white">
                        {inc.code}
                      </span>
                    </div>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        inc.severity === 'Critical'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : inc.severity === 'High'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                      }`}
                    >
                      {inc.severity}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-slate-200 truncate mb-1">
                    {inc.name}
                  </p>

                  <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-slate-400 mb-2">
                    <span>Area: <strong className="text-slate-200">{inc.estimatedAreaKm2} km²</strong></span>
                    <span>Conf: <strong className="text-teal-400">{inc.confidencePct}%</strong></span>
                    <span>Time: {inc.detectionTime.substring(11, 16)} UTC</span>
                    <span className="truncate">Status: {inc.status}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[#23364B]/60 text-[10px]">
                    <span className="text-[#00C2FF] font-mono">
                      {inc.sensor}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedIncident(inc);
                        setActivePage('spill-attribution');
                      }}
                      className="flex items-center gap-0.5 text-slate-300 hover:text-white font-semibold"
                    >
                      <span>Attribution</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* C. Activity Timeline & D. Analytical Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* C. Recent Activity Timeline (4 cols) */}
        <div className="lg:col-span-4 p-4 rounded-2xl border border-[#23364B] bg-[#0D1B2A] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#23364B] mb-3">
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Surveillance Activity Timeline
            </h3>
            <span className="w-2 h-2 rounded-full bg-[#00C2FF] animate-ping" />
          </div>

          <div className="flex flex-col gap-3">
            {[
              {
                time: '12m ago',
                title: 'SAR Satellite Imagery Ingested',
                desc: 'Sentinel-1B pass over Mumbai High sector processed.',
                color: 'text-[#00C2FF]',
              },
              {
                time: '28m ago',
                title: 'Potential Oil Spill Segmented',
                desc: 'ST-2046 boundary mapped (48.6 km²). Confidence: 96.4%.',
                color: 'text-rose-400',
              },
              {
                time: '45m ago',
                title: 'AIS Correlation Matrix Executed',
                desc: '25 vessels filtered; MT OCEAN TITAN ranked as suspect.',
                color: 'text-[#14B8A6]',
              },
              {
                time: '1h 10m',
                title: 'Drift Forecast Model Calibrated',
                desc: 'MetOcean coupled wind (18.5 kts) & current applied.',
                color: 'text-amber-400',
              },
              {
                time: '2h ago',
                title: 'Incident Forensic Dossier Exported',
                desc: 'Certified PDF package generated for Coast Guard HQ.',
                color: 'text-emerald-400',
              },
            ].map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs">
                <span className="font-mono text-[10px] text-slate-500 w-12 shrink-0 pt-0.5">
                  {step.time}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className={`font-bold leading-tight ${step.color}`}>
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-snug mt-0.5 truncate">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-[#23364B] flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Automated pipeline: Active</span>
            <span className="text-emerald-400">0 dropped packets</span>
          </div>
        </div>

        {/* D. Analytical Charts (8 cols) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Chart 1: Spill Incidents by Severity */}
          <div className="p-4 rounded-2xl border border-[#23364B] bg-[#0D1B2A] flex flex-col justify-between">
            <h4 className="text-xs font-bold font-mono text-white mb-2 uppercase">
              Incidents by Severity
            </h4>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={severityData}>
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#07111F',
                      border: '1px solid #23364B',
                      borderRadius: '8px',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <span className="text-[10px] font-mono text-slate-500 text-center">
              Active incident classification count
            </span>
          </div>

          {/* Chart 2: Regional Distribution */}
          <div className="p-4 rounded-2xl border border-[#23364B] bg-[#0D1B2A] flex flex-col justify-between">
            <h4 className="text-xs font-bold font-mono text-white mb-2 uppercase">
              Regional Incident Density
            </h4>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionData} layout="vertical">
                  <XAxis type="number" stroke="#64748B" fontSize={11} />
                  <YAxis dataKey="region" type="category" stroke="#64748B" fontSize={10} width={90} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#07111F',
                      border: '1px solid #23364B',
                      borderRadius: '8px',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="count" fill="#14B8A6" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <span className="text-[10px] font-mono text-slate-500 text-center">
              Density in Arabian Sea & Bay of Bengal corridors
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
