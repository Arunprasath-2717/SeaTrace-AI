import React from 'react';
import type { PageId } from '../../types/oceanSentinel';
import { useSentinel } from '../../context/SentinelContext';
import {
  LayoutDashboard,
  Map,
  Radar,
  Ship,
  Target,
  Wind,
  Satellite,
  AlertOctagon,
  BarChart3,
  Database,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  const { activePage, setActivePage, incidents } = useSentinel();

  const activeIncidentsCount = incidents.filter(
    (i) => i.status === 'Investigating' || i.status === 'Escalated'
  ).length;

  const navItems: { id: PageId; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'command-center', label: 'Command Center', icon: LayoutDashboard },
    { id: 'maritime-map', label: 'Live Maritime Map', icon: Map },
    { id: 'spill-detection', label: 'Oil Spill Detection', icon: Radar, badge: 'SAR' },
    { id: 'vessel-intelligence', label: 'Vessel Intelligence', icon: Ship },
    { id: 'spill-attribution', label: 'Spill Attribution', icon: Target, badge: 'AI' },
    { id: 'drift-prediction', label: 'Drift Prediction', icon: Wind },
    { id: 'satellite-imagery', label: 'Satellite Imagery', icon: Satellite },
    {
      id: 'incident-management',
      label: 'Incident Management',
      icon: AlertOctagon,
      badge: activeIncidentsCount > 0 ? `${activeIncidentsCount}` : undefined,
    },
    { id: 'analytics-reports', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'data-sources', label: 'Data Sources', icon: Database },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`h-full select-none flex flex-col justify-between border-r border-[#23364B] bg-[#07111F] transition-all duration-300 z-30 shrink-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="flex items-center justify-between px-4 h-16 border-b border-[#23364B]">
          {!isCollapsed && (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00C2FF] via-[#14B8A6] to-[#10B981] flex items-center justify-center text-slate-950 font-black shadow-md shadow-[#00C2FF]/20 shrink-0">
                <Shield className="w-5 h-5 fill-current" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xs font-black tracking-wider uppercase text-white truncate">
                  OCEAN SENTINEL AI
                </h1>
                <p className="text-[10px] font-mono text-[#00C2FF] truncate">
                  NTRO — PS 26143
                </p>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="mx-auto w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00C2FF] to-[#14B8A6] flex items-center justify-center text-slate-950 font-black shadow-md">
              <Shield className="w-5 h-5 fill-current" />
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#0D1B2A] transition-all ${
              isCollapsed ? 'hidden' : 'block'
            }`}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items List */}
        <nav className="p-3 flex flex-col gap-1.5 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#00C2FF]/20 via-[#14B8A6]/15 to-transparent text-[#00C2FF] border border-[#00C2FF]/40 shadow-sm shadow-[#00C2FF]/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#0D1B2A] border border-transparent'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-[#00C2FF]' : 'text-slate-400'
                  }`}
                />

                {!isCollapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}

                {!isCollapsed && item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                      item.badge === 'SAR' || item.badge === 'AI'
                        ? 'bg-[#00C2FF]/20 text-[#00C2FF] border border-[#00C2FF]/40'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Left active marker indicator */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-[#00C2FF]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Collapse Toggle & System Status */}
      <div className="p-3 border-t border-[#23364B]">
        {isCollapsed ? (
          <button
            onClick={onToggleCollapse}
            className="w-full py-2 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-[#0D1B2A] transition-all"
            title="Expand Sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-2 py-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>NTRO SECURE</span>
            </span>
            <span className="text-[10px] text-slate-500">v2.6-SIH</span>
          </div>
        )}
      </div>
    </aside>
  );
};
