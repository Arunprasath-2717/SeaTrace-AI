import React, { useState } from 'react';
import { useSentinel } from '../../context/SentinelContext';
import type { SpillIncident, IncidentStatus, IncidentSeverity } from '../../types/oceanSentinel';
import {
  AlertOctagon,
  Plus,
  Search,
  Filter,
  Download,
  Edit2,
  Trash2,
  CheckCircle2,
  ChevronRight,
  Shield,
  X,
  FileCheck,
} from 'lucide-react';

export const IncidentManagementPage: React.FC = () => {
  const {
    incidents,
    selectedIncident,
    setSelectedIncident,
    updateIncidentStatus,
    updateIncidentInvestigator,
    createIncident,
    showToast,
  } = useSentinel();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // New incident form state
  const [formCode, setFormCode] = useState<string>('ST-2054');
  const [formName, setFormName] = useState<string>('');
  const [formRegion, setFormRegion] = useState<'Arabian Sea' | 'Bay of Bengal' | 'Gulf of Mannar' | 'Six Degree Channel'>('Arabian Sea');
  const [formLat, setFormLat] = useState<number>(18.5);
  const [formLng, setFormLng] = useState<number>(71.8);
  const [formArea, setFormArea] = useState<number>(25.0);
  const [formSeverity, setFormSeverity] = useState<IncidentSeverity>('High');
  const [formInvestigator, setFormInvestigator] = useState<string>('CDR James Rodriguez');

  const filtered = incidents.filter((inc) => {
    const matchSearch =
      inc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.assignedInvestigator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || inc.status === statusFilter;
    const matchSeverity = severityFilter === 'All' || inc.severity === severityFilter;
    return matchSearch && matchStatus && matchSeverity;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) return;

    createIncident({
      code: formCode,
      name: formName,
      region: formRegion,
      lat: formLat,
      lng: formLng,
      estimatedAreaKm2: formArea,
      detectionTime: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
      sensor: 'Sentinel-1 C-SAR',
      confidencePct: 92.5,
      severity: formSeverity,
      status: 'New',
      oilType: 'Crude Hydrocarbon Slick',
      estimatedVolumeBarrels: Math.round(formArea * 50),
      closestLandmark: 'Indian Exclusive Economic Zone',
      coastalDistanceKm: 120,
      assignedInvestigator: formInvestigator,
      description: `Manual registry entry logged by ${formInvestigator}.`,
      polygon: [
        [formLat + 0.04, formLng - 0.04],
        [formLat + 0.05, formLng + 0.03],
        [formLat - 0.03, formLng + 0.04],
        [formLat - 0.04, formLng - 0.02],
      ],
      driftDirectionDeg: 75,
      driftSpeedKts: 1.2,
      notes: [`${new Date().toISOString().substring(11, 16)} UTC: Incident created in NTRO registry.`],
    });

    setIsCreateModalOpen(false);
    setFormName('');
  };

  const handleExportCSV = () => {
    const headers = ['IncidentID', 'Name', 'Region', 'Lat', 'Lng', 'AreaKm2', 'Severity', 'Status', 'Confidence', 'Investigator'];
    const rows = filtered.map((i) => [
      i.code,
      `"${i.name}"`,
      `"${i.region}"`,
      i.lat,
      i.lng,
      i.estimatedAreaKm2,
      i.severity,
      i.status,
      i.confidencePct,
      `"${i.assignedInvestigator}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Incident_Registry_${Date.now()}.csv`;
    link.click();
    showToast(`Exported ${filtered.length} incidents to CSV.`, 'success');
  };

  return (
    <div className="flex-1 flex flex-col gap-5 p-6 overflow-y-auto select-none bg-[#07111F] text-slate-100 scrollbar-thin">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-500" />
            <h1 className="text-xl font-black tracking-tight text-white uppercase font-mono">
              Incident Management System
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              AUDIT PERSISTENT
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Full life-cycle management: classify severities, assign senior investigators, track status changes, and maintain legal audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0D1B2A] hover:bg-[#13283F] border border-[#23364B] text-xs font-semibold text-slate-200 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00C2FF] to-[#14B8A6] text-slate-950 font-bold text-xs shadow-md hover:opacity-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Incident</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl border border-[#23364B] bg-[#0D1B2A] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex items-center w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search code, title, investigator..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#07111F] border border-[#23364B] text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-[#00C2FF]"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#07111F] border border-[#23364B] rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Under Review">Under Review</option>
            <option value="Investigating">Investigating</option>
            <option value="Escalated">Escalated</option>
            <option value="Resolved">Resolved</option>
            <option value="Archived">Archived</option>
          </select>

          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-[#07111F] border border-[#23364B] rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <span className="text-xs font-mono text-slate-400">
          Total: {filtered.length} incidents
        </span>
      </div>

      {/* Main Incidents Table */}
      <div className="rounded-2xl border border-[#23364B] bg-[#0D1B2A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#07111F] text-slate-400 font-mono text-[10px] uppercase border-b border-[#23364B]">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-3">Incident Title & Region</th>
                <th className="py-3 px-3">Area & Confidence</th>
                <th className="py-3 px-3">Severity</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Assigned Investigator</th>
                <th className="py-3 px-3 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#23364B]/60">
              {filtered.map((inc) => (
                <tr
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className="hover:bg-[#13283F] cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-[#00C2FF]">
                    {inc.code}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-white block leading-tight">
                      {inc.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {inc.region} | {inc.detectionTime.substring(0, 16)}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <span className="text-slate-200 font-bold block">
                      {inc.estimatedAreaKm2} km²
                    </span>
                    <span className="text-[10px] text-teal-400">
                      {inc.confidencePct}% Conf
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        inc.severity === 'Critical'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : inc.severity === 'High'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-teal-500/20 text-teal-400 border border-teal-500/40'
                      }`}
                    >
                      {inc.severity}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono text-xs font-semibold text-slate-300">
                      {inc.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300 text-xs">
                    {inc.assignedInvestigator}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <select
                      value={inc.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateIncidentStatus(inc.id, e.target.value as IncidentStatus)}
                      className="bg-[#07111F] text-slate-200 border border-[#23364B] rounded-lg px-2 py-1 text-[11px] font-mono outline-none"
                    >
                      <option value="New">New</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Investigating">Investigating</option>
                      <option value="Escalated">Escalated</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Incident Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-[#0D1B2A] border border-[#23364B] shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#23364B]">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-500" />
                <h3 className="text-sm font-bold text-white font-mono uppercase">
                  Register Maritime Spill Incident
                </h3>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="flex flex-col gap-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Incident Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full bg-[#07111F] border border-[#23364B] rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Maritime Region
                  </label>
                  <select
                    value={formRegion}
                    onChange={(e) => setFormRegion(e.target.value as any)}
                    className="w-full bg-[#07111F] border border-[#23364B] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="Arabian Sea">Arabian Sea</option>
                    <option value="Bay of Bengal">Bay of Bengal</option>
                    <option value="Gulf of Mannar">Gulf of Mannar</option>
                    <option value="Six Degree Channel">Six Degree Channel</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Incident Title / Location Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mumbai Offshore Deepwater Discharge"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-[#07111F] border border-[#23364B] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#00C2FF]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formLat}
                    onChange={(e) => setFormLat(parseFloat(e.target.value))}
                    className="w-full bg-[#07111F] border border-[#23364B] rounded-xl px-2.5 py-1.5 text-xs font-mono text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formLng}
                    onChange={(e) => setFormLng(parseFloat(e.target.value))}
                    className="w-full bg-[#07111F] border border-[#23364B] rounded-xl px-2.5 py-1.5 text-xs font-mono text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">Area (km²)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formArea}
                    onChange={(e) => setFormArea(parseFloat(e.target.value))}
                    className="w-full bg-[#07111F] border border-[#23364B] rounded-xl px-2.5 py-1.5 text-xs font-mono text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Severity</label>
                  <select
                    value={formSeverity}
                    onChange={(e) => setFormSeverity(e.target.value as any)}
                    className="w-full bg-[#07111F] border border-[#23364B] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Assigned Officer</label>
                  <input
                    type="text"
                    value={formInvestigator}
                    onChange={(e) => setFormInvestigator(e.target.value)}
                    className="w-full bg-[#07111F] border border-[#23364B] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-[#23364B]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#00C2FF] to-[#14B8A6] text-slate-950 font-bold text-xs shadow-md hover:opacity-95"
                >
                  Confirm & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
