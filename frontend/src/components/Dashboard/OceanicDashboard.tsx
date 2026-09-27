import React, { useState } from 'react';
import { CurvedSidebar, type SidebarTab } from './CurvedSidebar';
import { TopNavbar, type TopTab } from './TopNavbar';
import { WelcomeHero } from './WelcomeHero';
import { NotificationsCard } from './NotificationsCard';
import { TodayTasksCard } from './TodayTasksCard';
import { AssignmentsCard } from './AssignmentsCard';
import { GoPremiumCard } from './GoPremiumCard';
import { CalendarWidget } from './CalendarWidget';
import { MetricsRadialGauges } from './MetricsRadialGauges';
import { BoardMeetingCard } from './BoardMeetingCard';
import { NewAssignmentModal } from './NewAssignmentModal';
import { ExportModal } from './ExportModal';
import { LiveMaritimeMapPage } from '../pages/LiveMaritimeMapPage';
import { SpillDetectionPage } from '../pages/SpillDetectionPage';
import { VesselIntelligencePage } from '../pages/VesselIntelligencePage';
import { SpillAttributionPage } from '../pages/SpillAttributionPage';
import { DriftPredictionPage } from '../pages/DriftPredictionPage';
import { AnalyticsReportsPage } from '../pages/AnalyticsReportsPage';
import {
  ArrowLeft,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Globe,
  Sun,
  Moon,
  Satellite,
  Radio,
  FileText,
  Folder,
  Waves,
  ShieldCheck,
} from 'lucide-react';

interface OceanicDashboardProps {
  onToggleToGlobe?: () => void;
}

export const OceanicDashboard: React.FC<OceanicDashboardProps> = ({
  onToggleToGlobe,
}) => {
  // Navigation & Tabs State
  const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTab>('dashboard');
  const [activeTopTab, setActiveTopTab] = useState<TopTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentBoard, setCurrentBoard] = useState('ST-2046 Arabian Sea');

  // Theme State: isDarkMode strictly controls the curved sidebar gradient (Ocean Blue vs Midnight Navy),
  // while the main application canvas and all operational pages remain permanently in tactical dark mode.
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Modals
  const [isNewAssignmentOpen, setIsNewAssignmentOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [proToast, setProToast] = useState(false);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  const showStatus = (msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => setStatusNotification(null), 3500);
  };

  return (
    <div className="relative flex w-screen h-screen overflow-hidden select-none bg-[#07111F] text-slate-100">
      {/* 1. Left Organic Curved Sidebar */}
      <CurvedSidebar
        activeTab={activeSidebarTab}
        isDarkMode={isDarkMode}
        onSelectTab={(tab) => {
          setActiveSidebarTab(tab);
          if (tab === 'radar') {
            showStatus('SAR Satellite Studio: Sentinel-1B & RADARSAT-2 Feeds Active');
          } else if (tab === 'incidents') {
            showStatus('Active Slicks: ST-2046, ST-2047, ST-2048, ST-2049');
          } else if (tab === 'evidence') {
            showStatus('Attribution Dossiers: MT OCEAN TITAN (Prime Suspect 94/100)');
          } else if (tab === 'calendar') {
            showStatus('MetOcean Hydrodynamic Drift: Eulerian trajectory loaded');
          } else if (tab === 'reports') {
            showStatus('Legal Attribution Intelligence: Exporting IOPC Evidence Dossiers');
          } else if (tab === 'profile') {
            showStatus('AIS Fleet Surveillance: 25 Vessels Tracked (1 Dark Vessel Alert)');
          } else if (tab !== 'dashboard') {
            showStatus(`Navigated to ${tab.charAt(0).toUpperCase() + tab.slice(1)}`);
          }
        }}
        unreadCount={3}
        syncActive={true}
      />

      {/* 2. Main Application Body */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative bg-[#07111F]">
        {/* Conditional Top Header: Render TopNavbar ONLY on Dashboard */}
        {activeSidebarTab === 'dashboard' ? (
          <TopNavbar
            activeTab={activeTopTab}
            onSelectTab={(tab) => setActiveTopTab(tab)}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onExportClick={() => setIsExportOpen(true)}
            onAddBoardClick={() => showStatus('Tasking Sentinel-1B SAR Satellite swath scan...')}
            currentBoard={currentBoard}
            onSelectBoard={setCurrentBoard}
          />
        ) : (
          /* Dedicated Tactical Command Header for Subpages (replaces irrelevant dashboard top icons) */
          <header className="h-14 px-6 bg-[#09152b]/95 border-b border-[#1E2E48] text-white flex items-center justify-between text-xs shrink-0 select-none z-20">
            {/* Left: Quick Return to Dashboard & Tactical Breadcrumb */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveSidebarTab('dashboard')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0E1B33] hover:bg-indigo-600/30 text-cyan-400 hover:text-cyan-300 border border-[#1E2E48] hover:border-cyan-400/50 font-semibold transition-all shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Dashboard</span>
              </button>

              <div className="w-px h-5 bg-[#1E2E48]" />

              <div className="flex items-center gap-2 font-mono text-[12px] text-slate-300">
                <span className="text-slate-500">SeaTrace /</span>
                <span className="font-semibold text-white">
                  {activeSidebarTab === 'radar' && 'Live Maritime AIS & SAR Telemetry'}
                  {activeSidebarTab === 'incidents' && 'Spill Detection & Segmentation AI'}
                  {activeSidebarTab === 'evidence' && 'Spill Forensic Attribution & Suspect Tankers'}
                  {activeSidebarTab === 'calendar' && 'MetOcean Hydrodynamic Drift Forecasting'}
                  {activeSidebarTab === 'reports' && 'Forensic Intelligence & Legal Dossiers'}
                  {activeSidebarTab === 'profile' && 'AIS Fleet Surveillance & Dark Fleet Detection'}
                  {activeSidebarTab === 'comms' && 'Naval Communications & Coast Guard Dispatch'}
                </span>
              </div>
            </div>

            {/* Center: Live Operational Sector */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#0c1a36] border border-blue-900/50 text-[11px] font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400">Active Incident:</span>
              <span className="font-semibold text-cyan-300">ST-2046 Arabian Sea (48.6 km²)</span>
            </div>

            {/* Right: Theme Toggle for Side Rail & SeaTrace Logo */}
            <div className="flex items-center gap-2.5">
              {/* Sidebar Theme Pill */}
              <div
                title="Toggle Sidebar Theme"
                className="flex items-center p-0.5 rounded-full border border-[#1E2E48] bg-[#0c1a36] text-xs"
              >
                <button
                  onClick={() => isDarkMode && setIsDarkMode(false)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium transition-all ${
                    !isDarkMode
                      ? 'bg-blue-600 text-white shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Light</span>
                </button>
                <button
                  onClick={() => !isDarkMode && setIsDarkMode(true)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium transition-all ${
                    isDarkMode
                      ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark</span>
                </button>
              </div>

              {/* SeaTrace Brand Pill */}
              <div
                title="SeaTrace AI"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 shadow-md shadow-indigo-500/25 border border-indigo-400/40 cursor-pointer hover:scale-105 transition-all select-none"
              >
                <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-cyan-300 text-[10px] font-black">
                  🌊
                </div>
                <span className="tracking-wide font-extrabold text-xs">SeaTrace</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
              </div>
            </div>
          </header>
        )}

        {/* Dynamic Content: Template Dashboard by Default or Sub-Pages */}
        {activeSidebarTab === 'radar' ? (
          <div className="flex-1 overflow-hidden relative">
            <LiveMaritimeMapPage />
          </div>
        ) : activeSidebarTab === 'incidents' ? (
          <div className="flex-1 overflow-hidden relative">
            <SpillDetectionPage />
          </div>
        ) : activeSidebarTab === 'evidence' ? (
          <div className="flex-1 overflow-hidden relative">
            <SpillAttributionPage />
          </div>
        ) : activeSidebarTab === 'calendar' ? (
          <div className="flex-1 overflow-hidden relative">
            <DriftPredictionPage />
          </div>
        ) : activeSidebarTab === 'reports' ? (
          <div className="flex-1 overflow-hidden relative">
            <AnalyticsReportsPage />
          </div>
        ) : activeSidebarTab === 'profile' ? (
          <div className="flex-1 overflow-hidden relative">
            <VesselIntelligencePage />
          </div>
        ) : (
          /* Main SeaTrace Command Center Dashboard (Always Permanent Dark Tactical Theme) */
          <main className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin bg-[#07111F]">
            <div className="max-w-[1600px] mx-auto flex flex-col gap-6 pb-20">
              {/* Top Welcome Greeting & Mission Action Hero */}
              <WelcomeHero
                userName="CDR Rodriguez"
                isDarkMode={isDarkMode}
                onQuickAdd={() => setIsNewAssignmentOpen(true)}
                onStayOrganizedClick={() => {
                  setActiveSidebarTab('incidents');
                  showStatus('Filtering 4 Active Oil Spill Incidents (ST-2046)');
                }}
                onSyncNotesClick={() => {
                  setActiveSidebarTab('calendar');
                  showStatus('MetOcean Hydrodynamic Drift Loaded');
                }}
                onCollaborateClick={() => {
                  showStatus('Dispatched alert to ICGS Samudra Prahari Pollution Response Team');
                }}
              />

              {/* 3-Column Core SeaTrace Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Column 1: Notifications & Tasks (~4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-5">
                  <NotificationsCard
                    isDarkMode={isDarkMode}
                    onClearAll={() => showStatus('All incident alerts acknowledged')}
                  />
                  <TodayTasksCard
                    isDarkMode={isDarkMode}
                    onAddTask={() => setIsNewAssignmentOpen(true)}
                  />
                </div>

                {/* Column 2: Assignments & Go Premium (~4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-5">
                  <AssignmentsCard
                    isDarkMode={isDarkMode}
                    onAddNewAssignment={() => setIsNewAssignmentOpen(true)}
                  />
                  <GoPremiumCard
                    isDarkMode={isDarkMode}
                    onFindOutMore={() => {
                      setProToast(true);
                      setTimeout(() => setProToast(false), 4500);
                    }}
                  />
                </div>

                {/* Column 3: Calendar, Gauges & Board Meeting (~4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-5">
                  <CalendarWidget isDarkMode={isDarkMode} />
                  <MetricsRadialGauges isDarkMode={isDarkMode} />
                  <BoardMeetingCard isDarkMode={isDarkMode} />
                </div>
              </div>
            </div>
          </main>
        )}

        {/* Bottom Floating Status & 3D Globe PIP Badges */}
        <div className="absolute bottom-5 inset-x-0 pointer-events-none flex items-center justify-center z-20 px-8">
          {/* Center Pill: Live Telemetry */}
          <div className="pointer-events-auto flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium border border-blue-900/40 bg-[#0B1528]/90 text-slate-300 shadow-xl shadow-black/40 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SeaTrace Live Telemetry: 25 Vessels Tracked | 4 Slicks</span>
          </div>

          {/* Bottom Right Floating Badge: "PIP: Shift to 3D Earth Globe ↗" */}
          <div className="absolute right-8 pointer-events-auto">
            <button
              onClick={() => {
                if (onToggleToGlobe) {
                  onToggleToGlobe();
                } else {
                  showStatus('Switching to 3D Geospatial Earth Globe...');
                }
              }}
              title="Shift to 3D Earth Globe Command Center"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-slate-950/95 text-white hover:bg-slate-900 border border-slate-700/60 hover:border-emerald-400 shadow-xl backdrop-blur-md transition-all duration-300 transform hover:scale-105 active:scale-95 group"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
              <span>PIP: Shift to 3D Earth Globe</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Transient Toast Notification */}
        {statusNotification && (
          <div className="absolute top-20 right-8 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-2xl border border-teal-500/30 animate-in slide-in-from-top-4 duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{statusNotification}</span>
          </div>
        )}

        {/* Sentinel Pro Activated Toast */}
        {proToast && (
          <div className="absolute top-20 right-8 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-500 text-white text-xs font-bold shadow-2xl animate-in slide-in-from-top-4 duration-300">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <div>
              <p className="font-extrabold">SeaTrace Sentinel Pro Active</p>
              <p className="text-[11px] font-normal text-blue-100">
                Sub-meter SAR Tasking and 72-Hour MetOcean Drift unlocked.
              </p>
            </div>
          </div>
        )}

        {/* Modals */}
        <NewAssignmentModal
          isOpen={isNewAssignmentOpen}
          onClose={() => setIsNewAssignmentOpen(false)}
          onSave={(data) => {
            showStatus(`Forensic assignment "${data.title}" deployed!`);
          }}
          isDarkMode={isDarkMode}
        />

        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
};
