import React, { useState } from 'react';
import { useSentinel } from '../../context/SentinelContext';
import { LeafletMaritimeMap } from '../common/LeafletMaritimeMap';
import {
  Filter,
  Search,
  RotateCcw,
  SlidersHorizontal,
  Compass,
  Ship,
  AlertTriangle,
  Layers,
  MapPin,
} from 'lucide-react';

export const LiveMaritimeMapPage: React.FC = () => {
  const {
    incidents,
    vessels,
    selectedIncident,
    setSelectedIncident,
    selectedVessel,
    setSelectedVessel,
    showToast,
  } = useSentinel();

  // Filters
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [vesselTypeFilter, setVesselTypeFilter] = useState<string>('All');
  const [coordSearch, setCoordSearch] = useState<string>('');
  const [focusedCoords, setFocusedCoords] = useState<{ lat: number; lng: number; zoom?: number } | null>(null);

  // Filtered datasets
  const filteredIncidents = incidents.filter((inc) => {
    if (severityFilter !== 'All' && inc.severity !== severityFilter) return false;
    return true;
  });

  const filteredVessels = vessels.filter((v) => {
    if (vesselTypeFilter !== 'All' && v.type !== vesselTypeFilter) return false;
    return true;
  });

  const handleCoordinateSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coordSearch) return;

    // Parse lat, lng
    const parts = coordSearch.split(',').map((p) => parseFloat(p.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      setFocusedCoords({ lat: parts[0], lng: parts[1], zoom: 9 });
      showToast(`Navigated to coordinates: ${parts[0]}°N, ${parts[1]}°E`, 'info');
    } else {
      showToast('Please enter coordinates in format: 18.52, 71.85', 'warning');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden select-none bg-[#07111F] text-slate-100 relative">
      {/* Top Filter & Tactical Search Header */}
      <div className="h-14 px-6 bg-[#0D1B2A] border-b border-[#23364B] flex items-center justify-between gap-4 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white font-mono uppercase">
            <Compass className="w-4 h-4 text-[#00C2FF]" />
            <span>Live Maritime Geospatial Grid</span>
          </div>

          <div className="h-4 w-px bg-[#23364B]" />

          {/* Severity Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] font-mono text-slate-400">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-[#07111F] text-slate-200 border border-[#23364B] rounded-lg px-2 py-1 text-xs outline-none"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Vessel Type Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] font-mono text-slate-400">Vessel Type:</span>
            <select
              value={vesselTypeFilter}
              onChange={(e) => setVesselTypeFilter(e.target.value)}
              className="bg-[#07111F] text-slate-200 border border-[#23364B] rounded-lg px-2 py-1 text-xs outline-none"
            >
              <option value="All">All Types</option>
              <option value="VLCC Tanker">VLCC Tanker</option>
              <option value="Suezmax Tanker">Suezmax Tanker</option>
              <option value="Chemical Tanker">Chemical Tanker</option>
              <option value="Container Ship">Container Ship</option>
              <option value="Bulk Carrier">Bulk Carrier</option>
              <option value="Patrol Vessel">Patrol Vessel</option>
            </select>
          </div>
        </div>

        {/* Coordinate Jump Form */}
        <form onSubmit={handleCoordinateSearch} className="flex items-center gap-2">
          <div className="relative flex items-center">
            <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            <input
              type="text"
              value={coordSearch}
              onChange={(e) => setCoordSearch(e.target.value)}
              placeholder="Jump Lat, Lng (e.g. 18.52, 71.85)"
              className="w-56 pl-8 pr-3 py-1 rounded-xl text-xs bg-[#07111F] border border-[#23364B] text-slate-200 placeholder:text-slate-500 outline-none focus:border-[#00C2FF]"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1 rounded-xl bg-[#00C2FF]/20 hover:bg-[#00C2FF]/30 text-[#00C2FF] border border-[#00C2FF]/40 text-xs font-semibold"
          >
            Locate
          </button>
        </form>
      </div>

      {/* Full Screen Map Surface */}
      <div className="flex-1 w-full h-full relative">
        <LeafletMaritimeMap
          incidents={filteredIncidents}
          vessels={filteredVessels}
          selectedIncident={selectedIncident}
          onSelectIncident={(inc) => setSelectedIncident(inc)}
          selectedVessel={selectedVessel}
          onSelectVessel={(v) => setSelectedVessel(v)}
          focusedCoordinates={focusedCoords}
          className="w-full h-full rounded-none border-none"
        />
      </div>
    </div>
  );
};
