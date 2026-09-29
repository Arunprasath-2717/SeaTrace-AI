import React from 'react';
import {
  LayoutGrid,
  User,
  Clock,
  Bell,
  Calendar,
  Folder,
  FileText,
  MessageSquare,
} from 'lucide-react';

export type SidebarTab =
  | 'dashboard'
  | 'profile'
  | 'radar'
  | 'incidents'
  | 'calendar'
  | 'evidence'
  | 'reports'
  | 'comms';

interface CurvedSidebarProps {
  activeTab: SidebarTab;
  onSelectTab: (tab: SidebarTab) => void;
  unreadCount?: number;
  syncActive?: boolean;
  isDarkMode?: boolean;
}

export const CurvedSidebar: React.FC<CurvedSidebarProps> = ({
  activeTab,
  onSelectTab,
  unreadCount = 3,
  syncActive = true,
  isDarkMode = false,
}) => {
  const navItems = [
    {
      id: 'profile' as SidebarTab,
      icon: User,
      label: 'Maritime Command Profile',
    },
    {
      id: 'radar' as SidebarTab,
      icon: Clock,
      label: 'Live Real-time Telemetry',
      badge: syncActive ? 'active' : undefined,
    },
    {
      id: 'incidents' as SidebarTab,
      icon: Bell,
      label: 'Incident Notifications (4 Active)',
      badge: unreadCount > 0 ? `${unreadCount}` : undefined,
    },
    {
      id: 'calendar' as SidebarTab,
      icon: Calendar,
      label: 'Operations Calendar & Drift Forecast',
    },
    {
      id: 'evidence' as SidebarTab,
      icon: Folder,
      label: 'Forensic Dossiers & Evidence',
    },
    {
      id: 'reports' as SidebarTab,
      icon: FileText,
      label: 'Attribution Legal Reports',
    },
    {
      id: 'comms' as SidebarTab,
      icon: MessageSquare,
      label: 'Naval Comms & Dispatch',
    },
  ];

  return (
    <aside className="relative flex flex-col items-center justify-between w-[84px] h-full shrink-0 z-30 select-none py-6">
      {/* Background shape with organic curved right edge using SVG */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-visible">
        <svg
          className="w-[106px] h-full drop-shadow-xl"
          viewBox="0 0 106 900"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="oceanicSidebarGrad" x1="0" y1="0" x2="1" y2="1">
              {isDarkMode ? (
                <>
                  <stop offset="0%" stopColor="#08101e" />
                  <stop offset="35%" stopColor="#0f1f3d" />
                  <stop offset="70%" stopColor="#15274d" />
                  <stop offset="100%" stopColor="#0a1426" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#3730a3" />
                  <stop offset="30%" stopColor="#4338ca" />
                  <stop offset="65%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#2563eb" />
                </>
              )}
            </linearGradient>
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* Organic flowing curved path matching reference layout */}
          <path
            d="M 0 0 
               L 82 0 
               C 82 80, 66 140, 66 220 
               C 66 300, 88 360, 88 440 
               C 88 520, 66 580, 66 660 
               C 66 740, 82 820, 82 900 
               L 0 900 
               Z"
            fill="url(#oceanicSidebarGrad)"
          />
        </svg>
      </div>

      {/* Top Main App / Dashboard Squircle Button matching template */}
      <div className="flex flex-col items-center gap-5 w-full pt-1">
        <button
          onClick={() => onSelectTab('dashboard')}
          title="Dashboard"
          className={`relative group flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
            activeTab === 'dashboard'
              ? 'bg-white/30 text-white shadow-lg backdrop-blur-md ring-2 ring-white/60'
              : 'bg-white/15 hover:bg-white/25 text-white/90 shadow-md'
          }`}
        >
          <LayoutGrid className="w-5 h-5 text-white" />
          <span className="sr-only">Dashboard</span>
        </button>

        {/* Navigation Items List */}
        <nav className="flex flex-col items-center gap-2.5 w-full px-2 mt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                title={item.label}
                className={`relative group flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'bg-white/25 text-white shadow-md shadow-black/20 backdrop-blur-md scale-105 ring-2 ring-emerald-300/60'
                    : 'text-white/75 hover:text-white hover:bg-white/15 hover:scale-105'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-mint' : ''
                  }`}
                  style={{
                    color: isActive ? '#a7f3d0' : undefined,
                  }}
                />

                {/* Status Badges */}
                {item.id === 'radar' && (
                  <span className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 ring-2 ring-blue-700"></span>
                  </span>
                )}

                {item.id === 'incidents' && unreadCount > 0 && (
                  <span className="absolute top-2 right-2.5 flex h-2.5 w-2.5">
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-400 ring-2 ring-blue-700"></span>
                  </span>
                )}

                {/* Tooltip on Hover */}
                <div className="absolute left-[62px] px-2.5 py-1 rounded-lg bg-slate-900/90 text-white text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-xl border border-white/10 z-50">
                  {item.label}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile: Command Duty Officer */}
      <div className="flex flex-col items-center gap-2 pb-2">
        <div className="relative group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-200 p-[2px] shadow-lg cursor-pointer transform hover:scale-105 transition-all">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="CDR James Rodriguez"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-blue-700"></span>
          <div className="absolute left-[62px] bottom-0 px-2.5 py-1 rounded-lg bg-slate-900/90 text-white text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-xl border border-white/10 z-50">
            CDR James Rodriguez (Duty Officer)
          </div>
        </div>
      </div>
    </aside>
  );
};
