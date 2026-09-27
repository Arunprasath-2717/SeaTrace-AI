import React, { useState } from 'react';
import { useSentinel } from '../../context/SentinelContext';
import type { Vessel } from '../../types/oceanSentinel';
import {
  Ship,
  Search,
  Download,
  Filter,
  ArrowUpDown,
  Radio,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Compass,
} from 'lucide-react';

export const VesselIntelligencePage: React.FC = () => {
  const { vessels, setSelectedVessel, showToast, setActivePage } = useSentinel();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'distance' | 'speed' | 'attribution'>('attribution');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 6;

  // Filter & Sort
  const filtered = vessels
    .filter((v) => {
      const matchSearch =
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.mmsi.includes(searchTerm) ||
        v.imo.includes(searchTerm);
      const matchType = typeFilter === 'All' || v.type === typeFilter;
      const matchStatus = statusFilter === 'All' || v.investigationStatus === statusFilter;
      return matchSearch && matchType && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'distance') return a.distanceFromSpillKm - b.distanceFromSpillKm;
      if (sortBy === 'speed') return b.speedKts - a.speedKts;
      return b.attributionScore - a.attributionScore;
    });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Name', 'MMSI', 'IMO', 'Flag', 'Type', 'SpeedKts', 'Heading', 'Status', 'AttributionScore', 'DistanceSpillKm'];
    const rows = filtered.map((v) => [
      `"${v.name}"`,
      v.mmsi,
      v.imo,
      `"${v.flag}"`,
      `"${v.type}"`,
      v.speedKts,
      v.headingDeg,
      `"${v.investigationStatus}"`,
      v.attributionScore,
      v.distanceFromSpillKm,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Vessel_Intelligence_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${filtered.length} vessel records as CSV.`, 'success');
  };

  return (
    <div className="flex-1 flex flex-col gap-5 p-6 overflow-y-auto select-none bg-[#07111F] text-slate-100 scrollbar-thin">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Ship className="w-5 h-5 text-[#00C2FF]" />
            <h1 className="text-xl font-black tracking-tight text-white uppercase font-mono">
              Vessel Intelligence Registry
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              AIS CORRELATION MATRIX
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time automatic identification system (AIS) telemetry, transponder gap detection, and vessel behavior analysis.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0D1B2A] hover:bg-[#13283F] border border-[#23364B] text-xs font-semibold text-slate-200 transition-all shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-teal-400" />
          <span>Export Filtered Vessels (CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl border border-[#23364B] bg-[#0D1B2A] flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex items-center flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search vessel name or MMSI..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#07111F] border border-[#23364B] text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-[#00C2FF]"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#07111F] border border-[#23364B] rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none"
          >
            <option value="All">All Types</option>
            <option value="VLCC Tanker">VLCC Tanker</option>
            <option value="Suezmax Tanker">Suezmax Tanker</option>
            <option value="Chemical Tanker">Chemical Tanker</option>
            <option value="Container Ship">Container Ship</option>
            <option value="Bulk Carrier">Bulk Carrier</option>
            <option value="Patrol Vessel">Patrol Vessel</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#07111F] border border-[#23364B] rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Prime Suspect">Prime Suspect</option>
            <option value="Person of Interest">Person of Interest</option>
            <option value="Cleared">Cleared</option>
          </select>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>Sort By:</span>
          <button
            onClick={() => setSortBy('attribution')}
            className={`px-2.5 py-1 rounded-lg border ${
              sortBy === 'attribution'
                ? 'bg-[#00C2FF]/20 border-[#00C2FF] text-[#00C2FF] font-bold'
                : 'border-[#23364B] text-slate-400 hover:text-white'
            }`}
          >
            Attribution Score
          </button>
          <button
            onClick={() => setSortBy('distance')}
            className={`px-2.5 py-1 rounded-lg border ${
              sortBy === 'distance'
                ? 'bg-[#00C2FF]/20 border-[#00C2FF] text-[#00C2FF] font-bold'
                : 'border-[#23364B] text-slate-400 hover:text-white'
            }`}
          >
            Distance
          </button>
          <button
            onClick={() => setSortBy('speed')}
            className={`px-2.5 py-1 rounded-lg border ${
              sortBy === 'speed'
                ? 'bg-[#00C2FF]/20 border-[#00C2FF] text-[#00C2FF] font-bold'
                : 'border-[#23364B] text-slate-400 hover:text-white'
            }`}
          >
            Speed
          </button>
        </div>
      </div>

      {/* Main Vessel Table */}
      <div className="rounded-2xl border border-[#23364B] bg-[#0D1B2A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#07111F] text-slate-400 font-mono text-[10px] uppercase border-b border-[#23364B]">
              <tr>
                <th className="py-3 px-4">Vessel Name</th>
                <th className="py-3 px-3">MMSI / IMO</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Telemetry</th>
                <th className="py-3 px-3">Spill Distance</th>
                <th className="py-3 px-3">AIS Status</th>
                <th className="py-3 px-3">Attribution Score</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#23364B]/60">
              {paginated.map((vessel) => {
                const isPrime = vessel.investigationStatus === 'Prime Suspect';
                const isPOI = vessel.investigationStatus === 'Person of Interest';

                return (
                  <tr
                    key={vessel.id}
                    onClick={() => setSelectedVessel(vessel)}
                    className="hover:bg-[#13283F] cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <span>{vessel.flag}</span>
                        <span className="group-hover:text-[#00C2FF] transition-colors">{vessel.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">
                      {vessel.mmsi} <span className="text-slate-500">/ {vessel.imo}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-300">{vessel.type}</td>
                    <td className="py-3 px-3 font-mono text-slate-300">
                      {vessel.speedKts} kts <span className="text-slate-500">@ {vessel.headingDeg}°</span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-200">
                      {vessel.distanceFromSpillKm} km
                    </td>
                    <td className="py-3 px-3">
                      {vessel.isDarkVessel ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                          <Radio className="w-3 h-3 text-rose-400" /> Gap Detected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium text-slate-400">
                          <Radio className="w-3 h-3 text-emerald-400" /> Active
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-[#07111F] overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isPrime
                                ? 'bg-rose-500'
                                : isPOI
                                ? 'bg-amber-500'
                                : 'bg-teal-500'
                            }`}
                            style={{ width: `${vessel.attributionScore}%` }}
                          />
                        </div>
                        <span
                          className={`font-mono font-bold text-xs ${
                            isPrime
                              ? 'text-rose-400'
                              : isPOI
                              ? 'text-amber-400'
                              : 'text-slate-400'
                          }`}
                        >
                          {vessel.attributionScore}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVessel(vessel);
                          setActivePage('spill-attribution');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#00C2FF]/15 hover:bg-[#00C2FF]/25 text-[#00C2FF] font-semibold text-[11px] border border-[#00C2FF]/30 transition-all"
                      >
                        Correlate
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="p-3 bg-[#07111F] border-t border-[#23364B] flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} vessels
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded bg-[#0D1B2A] border border-[#23364B] disabled:opacity-40"
            >
              Prev
            </button>
            <span className="px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded bg-[#0D1B2A] border border-[#23364B] disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
