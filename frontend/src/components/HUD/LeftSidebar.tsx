import React from 'react';
import {
  Globe,
  Radio,
  Satellite,
  Ship,
  GitCommit,
  Wind,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';


export type ActiveWorkspace =
  | 'command'
  | 'monitoring'
  | 'detection'
  | 'vessels'
  | 'attribution'
  | 'drift'
  | 'reports';

interface LeftSidebarProps {
  activeWorkspace: ActiveWorkspace;
  onSelectWorkspace: (workspace: ActiveWorkspace) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeIncidentCount: number;
  suspectVesselCount: number;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  activeWorkspace,
  onSelectWorkspace,
  isCollapsed,
  onToggleCollapse,
  activeIncidentCount,
  suspectVesselCount,
}) => {
  const MENU_ITEMS: { id: ActiveWorkspace; label: string; icon: React.ReactNode; badge?: string; badgeColor?: string }[] = [
    {
      id: 'command',
      label: '3D Command Center',
      icon: <Globe className="w-4 h-4" />,
    },
    {
      id: 'monitoring',
      label: 'Global Monitoring',
      icon: <Radio className="w-4 h-4" />,
      badge: `${activeIncidentCount} ALERTS`,
      badgeColor: 'bg-[#ff4d4d]/20 text-[#ff4d4d] border-[#ff4d4d]/40',
    },
    {
      id: 'detection',
      label: 'Spill Detection (SAR)',
      icon: <Satellite className="w-4 h-4" />,
    },
    {
      id: 'vessels',
      label: 'Vessel Intelligence',
      icon: <Ship className="w-4 h-4" />,
      badge: `${suspectVesselCount} DARK`,
      badgeColor: 'bg-[#fbbf24]/20 text-[#fbbf24] border-[#fbbf24]/40',
    },
    {
      id: 'attribution',
      label: 'Spill Attribution',
      icon: <GitCommit className="w-4 h-4" />,
    },
    {
      id: 'drift',
      label: 'Drift Prediction',
      icon: <Wind className="w-4 h-4" />,
    },
    {
      id: 'reports',
      label: 'Incident Reports',
      icon: <FileText className="w-4 h-4" />,
    },
  ];

  return (
    <aside
      className={`absolute top-20 left-6 z-20 transition-all duration-300 pointer-events-auto ${
        isCollapsed ? 'w-14' : 'w-60'
      }`}
    >
      <div className="hud-panel p-2 rounded-xl border border-[#1e293b] shadow-2xl backdrop-blur-xl">
        {/* Toggle Collapse Button */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1e293b]/80 px-1">
          {!isCollapsed && (
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] font-bold">
              Operations Menu
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expand Menu' : 'Collapse Menu'}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-[#00d4ff] hover:bg-[#1e293b]/60 transition-colors ml-auto"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="space-y-1">
          {MENU_ITEMS.map((item) => {
            const isActive = activeWorkspace === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectWorkspace(item.id)}
                className={`w-full flex items-center rounded-lg px-2.5 py-2 text-xs font-mono transition-all text-left group relative ${
                  isActive
                    ? 'bg-[#00d4ff]/15 text-[#00d4ff] border border-[#00d4ff]/40 shadow-[0_0_12px_rgba(0,212,255,0.2)]'
                    : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1e293b]/50 border border-transparent'
                }`}
              >
                <span className={`shrink-0 ${isActive ? 'text-[#00d4ff]' : 'text-[#94a3b8] group-hover:text-[#00d4ff]'}`}>
                  {item.icon}
                </span>

                {!isCollapsed && (
                  <span className="ml-2.5 truncate font-medium flex-1">
                    {item.label}
                  </span>
                )}

                {!isCollapsed && item.badge && (
                  <span
                    className={`ml-1 text-[9px] px-1.5 py-0.5 rounded border font-mono font-bold uppercase ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Collapsed Tooltip */}
                {isCollapsed && (
                  <div className="hidden group-hover:block absolute left-full ml-2 px-2.5 py-1 rounded bg-[#0b1220] border border-[#00d4ff]/40 text-xs font-mono text-[#f8fafc] whitespace-nowrap shadow-xl z-50">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* System Intelligence Status summary at bottom */}
        {!isCollapsed && (
          <div className="mt-3 pt-2.5 border-t border-[#1e293b]/80 px-2 text-[10px] font-mono text-[#64748b]">
            <div className="flex justify-between items-center mb-1">
              <span>DEFENCE GRID:</span>
              <span className="text-[#10b981]">ONLINE</span>
            </div>
            <div className="flex justify-between items-center">
              <span>SAR REVISIT:</span>
              <span className="text-[#00d4ff]">42 MIN</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
