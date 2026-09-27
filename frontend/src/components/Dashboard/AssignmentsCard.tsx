import React, { useState } from 'react';
import {
  Edit2,
  Plus,
  Tag,
  ShieldAlert,
  Flame,
  Waves,
} from 'lucide-react';

export interface AssignmentItem {
  id: string;
  category: 'forensics' | 'attribution' | 'drift';
  title: string;
  tag: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  assigneeName: string;
  assigneeAvatar: string;
  dueDate?: string;
}

interface AssignmentsCardProps {
  isDarkMode?: boolean;
  onAddNewAssignment?: () => void;
}

export const AssignmentsCard: React.FC<AssignmentsCardProps> = ({
  onAddNewAssignment,
}) => {
  const [activeCategory, setActiveCategory] = useState<'forensics' | 'attribution' | 'drift'>('forensics');

  const [assignments] = useState<AssignmentItem[]>([
    {
      id: 'assign-1',
      category: 'forensics',
      title: 'Attribution Forensic Investigation: ST-2046 Bunker C Slick',
      tag: 'Mumbai High Sector',
      priority: 'Critical',
      assigneeName: 'Dr. Rachel Thorne (SAR Lead)',
      assigneeAvatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      dueDate: 'Due 14:00 UTC',
    },
    {
      id: 'assign-2',
      category: 'attribution',
      title: 'Correlate MT OCEAN TITAN AIS Transponder Gap (2h 48m)',
      tag: 'IMO 9324567 • VLCC',
      priority: 'High',
      assigneeName: 'Lt. Alex Vance (Attribution)',
      assigneeAvatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      dueDate: 'Due Immediate',
    },
    {
      id: 'assign-3',
      category: 'drift',
      title: 'Murud-Janjira Coastal Sanctuary Vulnerability Assessment',
      tag: 'Landfall Threat: 57 hrs',
      priority: 'High',
      assigneeName: 'Sarah Jenkins (ICG MetOcean)',
      assigneeAvatar:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
      dueDate: 'Forecast +6h',
    },
  ]);

  const filteredAssignments = assignments.filter((a) => a.category === activeCategory);

  return (
    <div className="flex flex-col p-5 rounded-3xl border border-[#1E2E48] bg-[#0B1528]/95 shadow-xl shadow-black/20 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold tracking-tight text-white">
            Forensic Assignments
          </h2>
        </div>
        <button
          title="Edit assignments"
          className="p-1 text-slate-400 hover:text-cyan-300 transition-all"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Category Tabs: Spill Attribution & Drift Forensics */}
      <div className="flex items-center gap-1.5 mb-4">
        <button
          onClick={() => setActiveCategory('forensics')}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            activeCategory === 'forensics'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white bg-[#0e1e38]/70 hover:bg-[#13274a]'
          }`}
        >
          Spill Attribution
        </button>
        <button
          onClick={() => setActiveCategory('attribution')}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            activeCategory === 'attribution'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white bg-[#0e1e38]/70 hover:bg-[#13274a]'
          }`}
        >
          Dark Fleet Radar
        </button>
        <button
          onClick={() => setActiveCategory('drift')}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            activeCategory === 'drift'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white bg-[#0e1e38]/70 hover:bg-[#13274a]'
          }`}
        >
          Drift Forensics
        </button>
      </div>

      {/* Assignments list */}
      <div className="flex flex-col gap-3">
        {filteredAssignments.map((assignment) => (
          <div
            key={assignment.id}
            className="p-4 rounded-2xl border border-[#1E2E48] bg-[#0E1B33]/80 hover:border-cyan-400/50 hover:bg-[#112344] transition-all duration-200 group"
          >
            {/* Title and High Priority Badge */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="text-xs font-bold leading-snug text-white">
                {assignment.title}
              </h3>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                  assignment.priority === 'Critical'
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}
              >
                {assignment.priority}
              </span>
            </div>

            {/* Tag and Assignee Info */}
            <div className="flex items-center justify-between pt-1">
              {/* Tag pill */}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                <Tag className="w-3 h-3 text-emerald-400" />
                <span>{assignment.tag}</span>
              </span>

              {/* Assignee Avatar + Name */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-300">
                  {assignment.assigneeName}
                </span>
                <img
                  src={assignment.assigneeAvatar}
                  alt={assignment.assigneeName}
                  className="w-6 h-6 rounded-full object-cover ring-2 ring-emerald-500/40 shadow-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add new assignment button */}
      <button
        onClick={onAddNewAssignment}
        className="mt-4 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl border-2 border-dashed border-indigo-700/60 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/10 text-xs font-semibold transition-all duration-200"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>+ Task New Forensic Assignment</span>
      </button>
    </div>
  );
};
