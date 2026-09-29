import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Moon, Sun, ChevronRight, Globe, ShieldAlert, Anchor,
  Satellite, CheckCircle2, Ship, MapPin, Activity, Clock, Wind,
  ArrowLeft, X, Sparkles, RefreshCw, Download
} from 'lucide-react';

import { DetectionPage }      from '../../pages/Detection/DetectionPage';
import { InvestigationsPage }  from '../../pages/Investigations/InvestigationsPage';
import { VesselsPage }        from '../../pages/Vessels/VesselsPage';
import { EvidencePage }       from '../../pages/Evidence/EvidencePage';
import { OriginPage }         from '../../pages/Origin/OriginPage';
import { ReportsPage }        from '../../pages/Reports/ReportsPage';
import { CommsPage }          from '../../pages/Comms/CommsPage';
import { ValidationPage }     from '../../pages/Validation/ValidationPage';

import {
  SeaCard, SeaCardHeader, SeaCardTitle, SeaCardContent,
  SeaBadge, SeaButton, SeaStatCard, SeaGradientBanner,
} from '../ui/index';
import { MaritimeMap }        from '../ui/MaritimeMap';
import { ParticleBackground } from '../ui/ParticleBackground';

/* Modals */
import { ExportModal }         from './ExportModal';
import { SarIngestModal }      from './modals/SarIngestModal';
import { DriftModelModal }     from './modals/DriftModelModal';
import { DeployResponseModal } from './modals/DeployResponseModal';
import { GlobeModal }          from './modals/GlobeModal';
import { OfficerProfileModal } from './modals/OfficerProfileModal';
import { VesselDetailModal, type VesselData } from './modals/VesselDetailModal';
import { LogDetailModal, type LogData }       from './modals/LogDetailModal';
import { CapacityModal }       from './modals/CapacityModal';

/* Dock-Animated Sidebar */
import { DockSidebar, type SidebarTab } from './DockSidebar';

interface OceanicDashboardProps { onToggleToGlobe?: () => void; }

/* ─── KPI Data (Bigger & Darker) ─────────────────────────────────── */
const STATS = [
  { label: 'SAR Pass Interval', value: '6.2 hrs', sub: 'Status: Nominal', color: '#4f46e5', icon: Satellite, tab: 'radar' as SidebarTab  },
  { label: 'Detection Conf.',   value: '96.4%',   sub: 'Status: Optimal', color: '#ea580c', icon: ShieldAlert, tab: 'evidence' as SidebarTab },
  { label: 'Spill Coverage',    value: '48.6 km²',sub: 'Status: Active',  color: '#0284c7', icon: Activity, tab: 'incidents' as SidebarTab    },
  { label: 'Drift Forecast',    value: '72 hrs',  sub: 'Status: Stable',  color: '#059669', icon: Wind, tab: 'calendar' as SidebarTab        },
];

/* ─── Bar chart ──────────────────────────────────────────────────── */
const BAR_DATA = [
  { month:'Apr', a:42, b:58 }, { month:'May', a:71, b:88 },
  { month:'Jun', a:55, b:62 }, { month:'Jul', a:38, b:45 },
  { month:'Aug', a:60, b:72 }, { month:'Sep', a:83, b:95 },
];

/* ─── Donut ──────────────────────────────────────────────────────── */
const DONUT = [
  { label:'Active Slicks',   pct:35, color:'#4f46e5' },
  { label:'Suspect Vessels', pct:28, color:'#ea580c' },
  { label:'Drift Modelled',  pct:22, color:'#0284c7' },
  { label:'AI Processing',   pct:15, color:'#059669' },
];

/* ─── Logs ───────────────────────────────────────────────────────── */
const LOGS: LogData[] = [
  { label:'SAR Sentinel-1B Pass Ingested',  tag:'Satellite', tc:'#4f46e5', date:'Sep 28, 2026', Icon: Satellite },
  { label:'MT OCEAN TITAN AIS Gap Alert',   tag:'AIS Alert', tc:'#0f172a', date:'Sep 27, 2026', Icon: Ship      },
  { label:'Spill ST-2046 Attribution Lock', tag:'Evidence',  tc:'#ea580c', date:'Sep 26, 2026', Icon: Activity  },
  { label:'Coast Guard QRF Dispatched',     tag:'Response',  tc:'#0284c7', date:'Sep 25, 2026', Icon: Anchor    },
];

/* ─── Sparkline ──────────────────────────────────────────────────── */
const SP = [400,800,600,1100,900,1200,1000,1300];
const spMax = Math.max(...SP);
const spW = 240, spH = 68;
const spPts = SP.map((v,i)=>`${(i/(SP.length-1))*spW},${spH-(v/spMax)*spH}`).join(' ');

/* ─── Quick Actions (High Contrast) ──────────────────────────────── */
const ACTIONS = [
  { id: 'sar',    label:'Ingest SAR Pass',  sub:'Sentinel-1B ready',  icon: Satellite, grad:'linear-gradient(135deg,#4f46e5,#3b82f6)' },
  { id: 'drift',  label:'Run Drift Model',  sub:'MetOcean 72-hr',     icon: Wind,      grad:'linear-gradient(135deg,#0d9488,#0284c7)' },
  { id: 'export', label:'Export Dossier',   sub:'IOPC evidence pack', icon: Activity,  grad:'linear-gradient(135deg,#ea580c,#d97706)' },
  { id: 'deploy', label:'Deploy Response',  sub:'Coast Guard QRF',    icon: Anchor,    grad:'linear-gradient(135deg,#e11d48,#db2777)' },
];

/* ─── Vessels ────────────────────────────────────────────────────── */
const VESSELS: VesselData[] = [
  { name:'MT OCEAN TITAN',   imo:'9876543', mmsi:'525001234', lat:'21.45°N', lon:'68.32°E', sc:'bg-rose-600',    st:'PRIME SUSPECT', spd:'0.0 kn (Dark)'  },
  { name:'MV ADRIATIC STAR', imo:'9234567', mmsi:'477001234', lat:'19.22°N', lon:'72.11°E', sc:'bg-amber-600',   st:'MONITORING',    spd:'12.4 kn'         },
  { name:'MT PACIFIC GLORY', imo:'9345678', mmsi:'566001234', lat:'22.10°N', lon:'65.80°E', sc:'bg-emerald-600', st:'CLEAR',         spd:'14.1 kn'         },
];

/* ─── Subpages ───────────────────────────────────────────────────── */
const SUBPAGES: Partial<Record<SidebarTab, React.ReactNode>> = {
  radar:      <DetectionPage />,
  validation: <ValidationPage />,
  incidents:  <InvestigationsPage />,
  evidence:   <EvidencePage />,
  calendar:   <OriginPage />,
  reports:    <ReportsPage />,
  profile:    <VesselsPage />,
  comms:      <CommsPage />,
};

const SUBPAGE_TITLE: Partial<Record<SidebarTab,string>> = {
  radar:      'Live SAR Telemetry',
  validation: 'Slick Validation & Metocean Screening',
  incidents:  'Incident Detection & Slicks',
  evidence:   'Evidence Dossiers & Attribution',
  calendar:   'Drift Forecasting & Reconstruction',
  reports:    'Legal Attribution Reports',
  profile:    'Vessel Fleet Surveillance',
  comms:      'Naval Comms & Tactical Dispatch',
};

/* ════════════════════════════════════════════════════════════════════ */
export const OceanicDashboard: React.FC<OceanicDashboardProps> = ({ onToggleToGlobe }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation & View States
  const [activeTab, setActiveTab]             = useState<SidebarTab>('dashboard');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(false);
  const [isDark, setIsDark]                   = useState<boolean>(false);
  const [searchQ, setSearchQ]                 = useState<string>('');
  const [statusMsg, setStatusMsg]             = useState<string|null>(null);
  const [selectedMonth, setSelectedMonth]     = useState<string>('Sep');
  const [aiScoring, setAiScoring]             = useState<boolean>(false);

  // Sync tab with URL
  useEffect(() => {
    const rawPath = location.pathname.replace(/^\/app\/?/, '').split('/')[0];
    const validTabs: SidebarTab[] = ['dashboard', 'radar', 'validation', 'incidents', 'evidence', 'calendar', 'reports', 'profile', 'comms'];
    if (rawPath && validTabs.includes(rawPath as SidebarTab)) {
      setActiveTab(rawPath as SidebarTab);
    } else if (!rawPath) {
      setActiveTab('dashboard');
    }
  }, [location.pathname]);

  // Modal States (Clean, no Upgrade modal)
  const [isSarModalOpen, setIsSarModalOpen]         = useState(false);
  const [isDriftModalOpen, setIsDriftModalOpen]     = useState(false);
  const [isExportModalOpen, setIsExportModalOpen]   = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen]   = useState(false);
  const [isGlobeModalOpen, setIsGlobeModalOpen]     = useState(false);
  const [isOfficerModalOpen, setIsOfficerModalOpen] = useState(false);
  const [isCapacityModalOpen, setIsCapacityModalOpen] = useState(false);
  const [selectedVessel, setSelectedVessel]         = useState<VesselData | null>(null);
  const [selectedLog, setSelectedLog]               = useState<LogData | null>(null);

  const flash = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(null), 3500);
  };

  const handleNav = (tab: SidebarTab) => {
    setActiveTab(tab);
    navigate(tab === 'dashboard' ? '/app' : `/app/${tab}`);
    const msgs: Partial<Record<SidebarTab,string>> = {
      radar:      'SAR Sentinel-1B & RADARSAT-2 Feeds Active',
      validation: 'Metocean Screening: 5/5 Physical Criteria Verified',
      incidents:  'Active Slicks: ST-2046 · ST-2047 · ST-2048',
      evidence:   'Attribution Dossiers — MT OCEAN TITAN 94/100',
      calendar:   'MetOcean Drift Trajectory Loaded',
      reports:    'IOPC Evidence Dossiers Ready',
      profile:    'AIS Fleet: 25 Vessels Tracked',
      comms:      'Naval Comms Net: VHF Ch 16 Monitoring Live',
    };
    if (msgs[tab]) flash(msgs[tab]!);
  };

  const handleQuickAction = (id: string) => {
    if (id === 'sar') setIsSarModalOpen(true);
    else if (id === 'drift') setIsDriftModalOpen(true);
    else if (id === 'export') setIsExportModalOpen(true);
    else if (id === 'deploy') setIsDeployModalOpen(true);
  };

  const handleAiRescore = () => {
    setAiScoring(true);
    setTimeout(() => {
      setAiScoring(false);
      flash('AI Neural Rescore Complete: 96.4% confidence locked on MT OCEAN TITAN.');
    }, 1100);
  };

  const isSubpage = activeTab !== 'dashboard';

  /* Donut arcs */
  const r = 46, cx = 58, cy = 58, circ = 2 * Math.PI * r;
  let arcOffset = 0;
  const arcs = DONUT.map(seg => {
    const dash = (seg.pct / 100) * circ;
    const a = { ...seg, dasharray: `${dash} ${circ - dash}`, dashoffset: -arcOffset };
    arcOffset += dash;
    return a;
  });

  /* Filtered items */
  const filteredVessels = VESSELS.filter(v =>
    searchQ === '' ||
    v.name.toLowerCase().includes(searchQ.toLowerCase()) ||
    v.imo.includes(searchQ) ||
    v.st.toLowerCase().includes(searchQ.toLowerCase())
  );

  const filteredLogs = LOGS.filter(l =>
    searchQ === '' ||
    l.label.toLowerCase().includes(searchQ.toLowerCase()) ||
    l.tag.toLowerCase().includes(searchQ.toLowerCase())
  );

  return (
    <div
      className={`relative flex w-full h-screen overflow-hidden select-none ${isDark ? 'dark text-white' : 'text-slate-900'}`}
      style={{
        background: isDark ? '#080d1a' : '#f8fafc',
      }}
    >
      {/* Subtle particle background for dark mode only to keep light mode clean and off-white */}
      {isDark && <ParticleBackground />}

      {/* ── DOCK-ANIMATED SIDEPANEL (Direct vertical mouse proximity magnification) ── */}
      <DockSidebar
        activeTab={activeTab}
        onSelectTab={handleNav}
        isExpanded={isSidebarExpanded}
        onToggleExpand={() => setIsSidebarExpanded(!isSidebarExpanded)}
        onExitToLanding={() => {
          flash('Returning to Landing…');
          setTimeout(() => navigate('/'), 300);
        }}
        onOpenOfficerModal={() => setIsOfficerModalOpen(true)}
      />

      {/* ── MAIN CONTENT AREA (Shrinks smoothly as sidebar expands) ─────── */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden relative z-10 transition-all duration-300">

        {/* TOP NAVBAR (Clean, tight, no upgrade clutter) */}
        <motion.header
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-between px-5 h-14 shrink-0 z-20 bg-white dark:bg-slate-900 border-b border-slate-300 dark:border-slate-800 shadow-xs"
        >
          {/* Header Title with Subpage Back Arrow */}
          <div className="flex items-center gap-3 min-w-0">
            {isSubpage ? (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  title="Back to Dashboard"
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center transition-all cursor-pointer"
                >
                  <ArrowLeft style={{ width: 16, height: 16 }} className="text-slate-900 dark:text-slate-200" />
                </button>
                <div>
                  <h1 className="text-base font-black text-slate-950 dark:text-white tracking-tight truncate">
                    {SUBPAGE_TITLE[activeTab]}
                  </h1>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <h1 className="text-base font-black text-slate-950 dark:text-white tracking-tight whitespace-nowrap">
                  SeaTrace Command Center
                </h1>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-md text-xs font-black bg-slate-100 text-slate-900 dark:bg-indigo-950 dark:text-indigo-200 border border-slate-300 dark:border-indigo-800">
                  Arabian Sea · Navarea VIII
                </span>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-sm mx-4 hidden md:block">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs">
              <Search style={{ width: 15, height: 15 }} className="text-slate-700 dark:text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                placeholder="Search vessel, slick ID, IMO, or coordinates…"
                className="flex-1 text-xs font-bold text-slate-950 dark:text-white bg-transparent outline-none placeholder:text-slate-500"
              />
              {searchQ && (
                <button onClick={() => setSearchQ('')} className="p-0.5 rounded-md text-slate-600 hover:text-slate-900 cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Header Action Buttons (Only essential controls) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Dark / Light Toggle */}
            <SeaButton
              variant="secondary"
              size="sm"
              onClick={() => {
                setIsDark(!isDark);
                flash(`Switched to ${!isDark ? 'Dark Oceanic Mode' : 'Light Morning Mode'}`);
              }}
              title="Toggle Dark / Light Theme"
            >
              {isDark ? <Sun style={{ width: 15, height: 15 }} className="text-amber-400" /> : <Moon style={{ width: 15, height: 15 }} className="text-indigo-600" />}
            </SeaButton>

            {/* 3D Globe View Button */}
            <SeaButton
              variant="secondary"
              size="sm"
              onClick={() => {
                if (onToggleToGlobe) onToggleToGlobe();
                else setIsGlobeModalOpen(true);
              }}
              title="Open 3D Earth Orbital Globe"
            >
              <Globe style={{ width: 15, height: 15 }} className="text-indigo-600 dark:text-indigo-400" />
              <span>3D Globe</span>
            </SeaButton>

            {/* Export Report (CSV, Excel, PDF) */}
            <SeaButton
              variant="primary"
              size="sm"
              onClick={() => setIsExportModalOpen(true)}
              title="Export Incident Report (CSV, Excel, PDF)"
              className="gap-1.5 font-bold cursor-pointer"
            >
              <Download style={{ width: 14, height: 14 }} />
              <span className="hidden sm:inline">Export Report</span>
            </SeaButton>

            {/* Duty Officer Profile */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={() => setIsOfficerModalOpen(true)}
              title="Duty Officer Profile"
              className="w-8 h-8 rounded-lg overflow-hidden ring-2 ring-indigo-500 cursor-pointer shadow-xs ml-1"
            >
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&auto=format&fit=crop&q=80"
                alt="CDR"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </motion.header>

        {/* ── TAB CONTENT (Tight Spacing, 10% Low Morphism, Bigger & Darker Text) ── */}
        <AnimatePresence mode="wait">
          {isSubpage ? (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 overflow-auto"
            >
              {SUBPAGES[activeTab]}
            </motion.div>
          ) : (
            <motion.main
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-y-auto p-3.5 sm:p-4"
            >
              <div className="max-w-[1560px] mx-auto flex flex-col gap-3.5">

                {/* ROW 1: Key Metrics Stat Cards (Bigger Values & Labels) */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5">
                  {STATS.map((s, i) => (
                    <SeaStatCard
                      key={s.label}
                      {...s}
                      delay={i * 0.05}
                      onClick={() => handleNav(s.tab)}
                    />
                  ))}
                </div>

                {/* ROW 2: Maritime Map + Detection Trends Chart */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-3.5">

                  {/* Leaflet OSM Map — 7 cols */}
                  <div className="xl:col-span-7">
                    <SeaCard delay={0.1} className="p-0 overflow-visible">
                      <SeaCardHeader className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <Activity className="w-5 h-5 text-indigo-600" />
                          <SeaCardTitle>India Maritime Surveillance Area</SeaCardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          <SeaBadge variant="emerald" pulse>SATELLITE LIVE</SeaBadge>
                          <SeaBadge variant="sky">EEZ 200NM</SeaBadge>
                          <SeaBadge variant="rose">3 SLICKS</SeaBadge>
                        </div>
                      </SeaCardHeader>
                      <SeaCardContent className="px-4 pb-4">
                        <MaritimeMap
                          onSelectVessel={(name) => {
                            const v = VESSELS.find(item => item.name === name);
                            if (v) setSelectedVessel(v);
                          }}
                          onSelectSlick={(id) => {
                            flash(`Selected Oil Slick ${id} — Surface area 48.6 km²`);
                          }}
                        />
                      </SeaCardContent>
                    </SeaCard>
                  </div>

                  {/* Charts & AI Intelligence Core — 5 cols */}
                  <div className="xl:col-span-5 flex flex-col gap-3.5">
                    <SeaCard delay={0.15}>
                      <SeaCardHeader className="py-2.5 px-4">
                        <SeaCardTitle>Incident Detection Trends</SeaCardTitle>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1.5 text-xs font-black text-slate-900 dark:text-slate-100">
                            <span className="w-3 h-3 rounded-xs bg-indigo-600 inline-block" /> Oil Slicks
                          </span>
                          <span className="flex items-center gap-1.5 text-xs font-black text-slate-900 dark:text-slate-100">
                            <span className="w-3 h-3 rounded-xs bg-orange-500 inline-block" /> Vessel Activity
                          </span>
                        </div>
                      </SeaCardHeader>
                      <SeaCardContent className="px-4 pb-4">
                        <div className="flex items-center justify-between text-xs font-black text-slate-900 dark:text-slate-200 mb-2">
                          <span>Monthly Comparison · 2026</span>
                          <span className="text-indigo-800 dark:text-indigo-400 font-black">Click bar to inspect</span>
                        </div>
                        <div className="flex items-end gap-2" style={{ height: 120 }}>
                          {BAR_DATA.map((d, i) => (
                            <div
                              key={d.month}
                              onClick={() => {
                                setSelectedMonth(d.month);
                                flash(`Selected ${d.month} 2026: Slicks ${d.a} · Vessel Intercepts ${d.b}`);
                              }}
                              className="flex-1 flex flex-col items-center gap-1 cursor-pointer group"
                            >
                              <div className="w-full flex gap-0.5 items-end h-full">
                                <motion.div
                                  className="flex-1 rounded-t-md group-hover:brightness-110"
                                  initial={{ height: 0 }}
                                  animate={{ height: `${(d.a / 100) * 120}px` }}
                                  transition={{ delay: 0.2 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                  style={{
                                    background: 'linear-gradient(180deg,#6366f1,#4f46e5)',
                                    opacity: selectedMonth === d.month ? 1 : 0.6,
                                  }}
                                />
                                <motion.div
                                  className="flex-1 rounded-t-md group-hover:brightness-110"
                                  initial={{ height: 0 }}
                                  animate={{ height: `${(d.b / 100) * 120}px` }}
                                  transition={{ delay: 0.25 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                  style={{
                                    background: 'linear-gradient(180deg,#f97316,#ea580c)',
                                    opacity: selectedMonth === d.month ? 1 : 0.6,
                                  }}
                                />
                              </div>
                              <span
                                className={`text-xs font-black ${
                                  selectedMonth === d.month ? 'text-indigo-800 dark:text-indigo-400' : 'text-slate-900 dark:text-slate-200'
                                }`}
                              >
                                {d.month}
                              </span>
                            </div>
                          ))}
                        </div>
                      </SeaCardContent>
                    </SeaCard>

                    {/* Sparkline Intelligence Core */}
                    <div
                      className="rounded-2xl p-4 relative overflow-hidden flex-1 shadow-sm text-white"
                      style={{
                        background: 'linear-gradient(135deg,#3730a3 0%,#4338ca 55%,#6d28d9 100%)',
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-base font-black text-white">AI Intelligence Core</div>
                        <button
                          onClick={handleAiRescore}
                          disabled={aiScoring}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-extrabold bg-white/20 hover:bg-white/30 text-white cursor-pointer transition-all disabled:opacity-50"
                        >
                          {aiScoring ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                          {aiScoring ? 'Inference…' : 'Re-score AI'}
                        </button>
                      </div>
                      <div className="text-xs font-medium text-white/80 mb-2">Spill attribution neural scoring · real-time SAR</div>
                      <svg width="100%" viewBox={`0 0 ${spW} ${spH}`} style={{ height: spH }} preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                          </linearGradient>
                        </defs>
                        <polygon points={`0,${spH} ${spPts} ${spW},${spH}`} fill="url(#sg)" />
                        <polyline
                          points={spPts}
                          fill="none"
                          stroke="rgba(255,255,255,0.95)"
                          strokeWidth="2.5"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                        />
                        <circle cx={spW} cy={spH - (SP[SP.length - 1] / spMax) * spH} r="4" fill="white" />
                      </svg>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs text-white font-bold">25 Vessels · 4 Slicks · Sentinel-1B Live</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ROW 3: Donut Metrics + Operation Logs + Attribution Banner */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-3.5">

                  {/* Donut — 4 cols */}
                  <SeaCard delay={0.2} className="xl:col-span-4">
                    <SeaCardHeader className="py-2.5 px-4">
                      <SeaCardTitle>Intelligence Metrics</SeaCardTitle>
                      <SeaButton
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsCapacityModalOpen(true)}
                        title="Inspect GPU & Compute Capacity"
                      >
                        Capacity <ChevronRight style={{ width: 14, height: 14 }} />
                      </SeaButton>
                    </SeaCardHeader>
                    <SeaCardContent className="px-4 pb-4">
                      <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                          <svg width="108" height="108" viewBox="0 0 116 116">
                            <circle cx={cx} cy={cy} r={r} fill="none" stroke={isDark ? '#1e293b' : '#e2e8f0'} strokeWidth="14" />
                            {arcs.map((a, i) => (
                              <circle
                                key={i}
                                cx={cx}
                                cy={cy}
                                r={r}
                                fill="none"
                                stroke={a.color}
                                strokeWidth="14"
                                strokeDasharray={a.dasharray}
                                strokeDashoffset={a.dashoffset}
                                transform={`rotate(-90 ${cx} ${cy})`}
                              />
                            ))}
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="text-2xl font-black text-slate-950 dark:text-white leading-none">94%</div>
                            <div className="text-xs font-black text-slate-900 dark:text-slate-200">Attribution</div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 flex-1">
                          {DONUT.map(seg => (
                            <div
                              key={seg.label}
                              onClick={() => flash(`Intelligence Category: ${seg.label} (${seg.pct}%)`)}
                              className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity"
                            >
                              <span className="flex items-center gap-1.5 text-xs font-black text-slate-900 dark:text-slate-100">
                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: seg.color }} />
                                {seg.label}
                              </span>
                              <span className="text-xs font-black text-slate-950 dark:text-white">{seg.pct}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </SeaCardContent>
                  </SeaCard>

                  {/* Operation Logs — 5 cols */}
                  <SeaCard delay={0.25} className="xl:col-span-5">
                    <SeaCardHeader className="py-2.5 px-4">
                      <SeaCardTitle>Operation Logs</SeaCardTitle>
                      <SeaButton
                        variant="ghost"
                        size="sm"
                        onClick={() => handleNav('reports')}
                        title="View All Legal Reports"
                      >
                        See All <ChevronRight style={{ width: 14, height: 14 }} />
                      </SeaButton>
                    </SeaCardHeader>
                    <SeaCardContent className="px-4 pb-4 flex flex-col gap-2">
                      {filteredLogs.map((log, i) => {
                        const Icon = log.Icon;
                        return (
                          <div
                            key={i}
                            onClick={() => setSelectedLog(log)}
                            className="flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center shrink-0">
                                <Icon style={{ width: 16, height: 16, color: '#4f46e5' }} />
                              </div>
                              <div>
                                <div className="text-xs font-black text-slate-950 dark:text-slate-100">{log.label}</div>
                                <div className="text-[11px] font-bold text-slate-800 dark:text-slate-300 mt-0.5">{log.date}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className="px-2.5 py-0.5 rounded-md text-[10px] font-black text-white"
                                style={{ background: log.tc }}
                              >
                                {log.tag}
                              </span>
                              <ChevronRight style={{ width: 14, height: 14 }} className="text-slate-600 dark:text-slate-400" />
                            </div>
                          </div>
                        );
                      })}
                    </SeaCardContent>
                  </SeaCard>

                  {/* Attribution Banner — 3 cols */}
                  <div className="xl:col-span-3">
                    <SeaGradientBanner
                      delay={0.3}
                      title="Attribution Core"
                      sub="MT OCEAN TITAN — 94/100"
                      grad="linear-gradient(135deg,#3730a3,#4f46e5,#7c3aed)"
                      stats={[{ v: '25', l: 'Vessels' }, { v: '4', l: 'Slicks' }, { v: '94%', l: 'Conf.' }]}
                      action={
                        <SeaButton
                          variant="secondary"
                          size="sm"
                          onClick={() => handleNav('evidence')}
                          className="bg-white text-indigo-950 hover:bg-slate-100 font-extrabold"
                        >
                          View <ChevronRight style={{ width: 14, height: 14 }} />
                        </SeaButton>
                      }
                    />
                  </div>
                </div>

                {/* ROW 4: Unified Live Vessel Surveillance (8 cols) + Operational Quick Actions (4 cols) */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-3.5 items-stretch">

                  {/* Live Vessel Surveillance Cards — 8 cols */}
                  <div className="xl:col-span-8 flex flex-col">
                    <SeaCard delay={0.3} className="h-full flex flex-col">
                      <SeaCardHeader className="py-2.5 px-4 shrink-0">
                        <div className="flex items-center gap-2">
                          <Ship style={{ width: 18, height: 18, color: '#4f46e5' }} />
                          <SeaCardTitle>Live Vessel Surveillance</SeaCardTitle>
                          <SeaBadge variant="emerald" pulse>25 Active</SeaBadge>
                        </div>
                        <SeaButton
                          variant="ghost"
                          size="sm"
                          onClick={() => handleNav('profile')}
                          title="View all 25 vessels in Fleet Surveillance"
                        >
                          View All <ChevronRight style={{ width: 14, height: 14 }} />
                        </SeaButton>
                      </SeaCardHeader>
                      <SeaCardContent className="px-4 pb-4 flex-1 flex flex-col justify-center">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                          {filteredVessels.map((v) => (
                            <div
                              key={v.name}
                              onClick={() => setSelectedVessel(v)}
                              className="p-3 rounded-xl cursor-pointer transition-all border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-indigo-500"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <Ship style={{ width: 15, height: 15, color: '#475569' }} className="shrink-0" />
                                  <span className="text-xs font-black text-slate-950 dark:text-white truncate">{v.name}</span>
                                </div>
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-black text-white shrink-0 ml-1 ${v.sc}`}>
                                  {v.st}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-x-1.5 gap-y-0.5 text-[11px] font-black text-slate-900 dark:text-slate-200 font-mono">
                                <span>IMO: {v.imo}</span>
                                <span>MMSI: {v.mmsi}</span>
                                <span className="flex items-center gap-1 truncate">
                                  <MapPin style={{ width: 11, height: 11 }} className="shrink-0" />
                                  {v.lat}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock style={{ width: 11, height: 11 }} className="shrink-0" />
                                  {v.spd}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </SeaCardContent>
                    </SeaCard>
                  </div>

                  {/* Operational Quick Actions — 4 cols */}
                  <div className="xl:col-span-4 flex flex-col">
                    <SeaCard delay={0.35} className="h-full flex flex-col">
                      <SeaCardHeader className="py-2.5 px-4 shrink-0">
                        <div className="flex items-center gap-2">
                          <Activity style={{ width: 18, height: 18, color: '#4f46e5' }} />
                          <SeaCardTitle>Quick Dispatch Actions</SeaCardTitle>
                        </div>
                        <span className="text-[10px] font-black text-slate-700 dark:text-slate-300">Instant Execution</span>
                      </SeaCardHeader>
                      <SeaCardContent className="px-4 pb-4 flex-1">
                        <div className="grid grid-cols-2 gap-2 h-full">
                          {ACTIONS.map((a) => {
                            const Icon = a.icon;
                            return (
                              <button
                                key={a.id}
                                onClick={() => handleQuickAction(a.id)}
                                className="rounded-xl p-2.5 flex flex-col items-start justify-between text-left cursor-pointer transition-all border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-indigo-500 hover:shadow-xs group"
                              >
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform"
                                  style={{ background: a.grad }}
                                >
                                  <Icon style={{ width: 16, height: 16, color: '#fff' }} />
                                </div>
                                <div className="mt-1.5">
                                  <div className="text-xs font-black text-slate-950 dark:text-white leading-tight">{a.label}</div>
                                  <div className="text-[10px] font-extrabold text-slate-800 dark:text-slate-300 mt-0.5 line-clamp-1">{a.sub}</div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </SeaCardContent>
                    </SeaCard>
                  </div>

                </div>

              </div>
            </motion.main>
          )}
        </AnimatePresence>
      </div>

      {/* ── ALL FUNCTIONAL INTERACTIVE MODALS (No Upgrade Modal) ─────────── */}

      {/* 1. SAR Ingestion Modal */}
      <SarIngestModal
        isOpen={isSarModalOpen}
        onClose={() => setIsSarModalOpen(false)}
        isDarkMode={isDark}
        onSuccess={flash}
      />

      {/* 2. MetOcean Drift Model Simulation Modal */}
      <DriftModelModal
        isOpen={isDriftModalOpen}
        onClose={() => setIsDriftModalOpen(false)}
        isDarkMode={isDark}
        onSuccess={flash}
      />

      {/* 3. Export Dossier Modal (real file download) */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        isDarkMode={isDark}
        onExportSuccess={flash}
      />

      {/* 4. Deploy Response / QRF Modal */}
      <DeployResponseModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        isDarkMode={isDark}
        onSuccess={flash}
      />

      {/* 5. 3D Earth Globe Modal */}
      <GlobeModal
        isOpen={isGlobeModalOpen}
        onClose={() => setIsGlobeModalOpen(false)}
        isDarkMode={isDark}
      />

      {/* 6. Duty Officer Profile Modal */}
      <OfficerProfileModal
        isOpen={isOfficerModalOpen}
        onClose={() => setIsOfficerModalOpen(false)}
        isDarkMode={isDark}
        onSuccess={flash}
      />

      {/* 7. Vessel Detail & Telemetry Modal */}
      <VesselDetailModal
        vessel={selectedVessel}
        onClose={() => setSelectedVessel(null)}
        isDarkMode={isDark}
        onSuccess={flash}
      />

      {/* 8. Operation Log Record Modal */}
      <LogDetailModal
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
        isDarkMode={isDark}
        onSuccess={flash}
      />

      {/* 9. AI Inference GPU Capacity Modal */}
      <CapacityModal
        isOpen={isCapacityModalOpen}
        onClose={() => setIsCapacityModalOpen(false)}
        isDarkMode={isDark}
        onSuccess={flash}
      />

      {/* ── TOAST NOTIFICATION ────────────────────────────────────────── */}
      <AnimatePresence>
        {statusMsg && (
          <motion.div
            initial={{ y: -20, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-16 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shadow-xl border bg-slate-950 text-white border-slate-700"
          >
            <CheckCircle2 style={{ width: 16, height: 16, color: '#34d399' }} />
            <span>{statusMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OceanicDashboard;
