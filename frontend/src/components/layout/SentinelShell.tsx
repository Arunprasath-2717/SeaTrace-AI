import React, { useState } from 'react';
import { useSentinel } from '../../context/SentinelContext';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { InvestigationDrawer } from '../common/InvestigationDrawer';
import { CommandCenterPage } from '../pages/CommandCenterPage';
import { LiveMaritimeMapPage } from '../pages/LiveMaritimeMapPage';
import { SpillDetectionPage } from '../pages/SpillDetectionPage';
import { VesselIntelligencePage } from '../pages/VesselIntelligencePage';
import { SpillAttributionPage } from '../pages/SpillAttributionPage';
import { DriftPredictionPage } from '../pages/DriftPredictionPage';
import { SatelliteImageryPage } from '../pages/SatelliteImageryPage';
import { IncidentManagementPage } from '../pages/IncidentManagementPage';
import { AnalyticsReportsPage } from '../pages/AnalyticsReportsPage';
import { DataSourcesPage } from '../pages/DataSourcesPage';
import { SettingsPage } from '../pages/SettingsPage';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export const SentinelShell: React.FC = () => {
  const { activePage, toasts, dismissToast } = useSentinel();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const renderActivePage = () => {
    switch (activePage) {
      case 'command-center':
        return <CommandCenterPage />;
      case 'maritime-map':
        return <LiveMaritimeMapPage />;
      case 'spill-detection':
        return <SpillDetectionPage />;
      case 'vessel-intelligence':
        return <VesselIntelligencePage />;
      case 'spill-attribution':
        return <SpillAttributionPage />;
      case 'drift-prediction':
        return <DriftPredictionPage />;
      case 'satellite-imagery':
        return <SatelliteImageryPage />;
      case 'incident-management':
        return <IncidentManagementPage />;
      case 'analytics-reports':
        return <AnalyticsReportsPage />;
      case 'data-sources':
        return <DataSourcesPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <CommandCenterPage />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#07111F] text-slate-100 font-sans select-none antialiased">
      {/* 1. Left Collapsible Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* 2. Main Content Column */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        {/* Persistent Top Navigation Bar */}
        <TopNavbar />

        {/* Mandatory Prominent Government Demo Environment Banner */}
        <div className="px-4 py-1.5 bg-[#0D1B2A] border-b border-[#23364B] flex items-center justify-between text-[11px] font-mono text-amber-400 shrink-0">
          <div className="flex items-center gap-2 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping shrink-0" />
            <span className="font-bold">DEMO ENVIRONMENT</span>
            <span className="text-slate-400 hidden sm:inline truncate">
              — All incident, vessel, and analytical records shown are simulated for Smart India Hackathon 2026 Problem Statement 26143.
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono hidden md:inline shrink-0">
            NTRO // MOES // ICG JOINT ARCHITECTURE
          </span>
        </div>

        {/* Active Page View Component */}
        <main className="flex-1 overflow-hidden relative flex flex-col">
          {renderActivePage()}
        </main>

        {/* Global Slide-Over Investigation Drawer */}
        <InvestigationDrawer />

        {/* Toast Notifications Container */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-semibold backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200 ${
                toast.type === 'success'
                  ? 'bg-[#0D1B2A]/95 text-emerald-300 border-emerald-500/40'
                  : toast.type === 'warning'
                  ? 'bg-[#0D1B2A]/95 text-amber-300 border-amber-500/40'
                  : toast.type === 'alert'
                  ? 'bg-[#0D1B2A]/95 text-rose-300 border-rose-500/40'
                  : 'bg-[#0D1B2A]/95 text-[#00C2FF] border-[#00C2FF]/40'
              }`}
            >
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
              {toast.type === 'alert' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-[#00C2FF] shrink-0" />}
              <span>{toast.message}</span>
              <button
                onClick={() => dismissToast(toast.id)}
                className="ml-2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
