import React, { useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import {
  LayoutGrid, User, Radar, AlertTriangle, Calendar,
  Folder, FileText, MessageSquare, ChevronLeft, PanelLeft,
  ArrowLeft, Waves, ShieldCheck
} from 'lucide-react';

export type SidebarTab =
  | 'dashboard'
  | 'profile'
  | 'radar'
  | 'validation'
  | 'incidents'
  | 'calendar'
  | 'evidence'
  | 'reports'
  | 'comms';

interface DockSidebarItemData {
  id: SidebarTab;
  icon: React.ElementType;
  label: string;
  sub: string;
  badge?: string;
  dot?: 'green' | 'red';
}

const NAV_ITEMS: DockSidebarItemData[] = [
  { id: 'profile',    icon: User,          label: 'Vessel Fleet',       sub: '25 Active Ships', badge: '25' },
  { id: 'radar',      icon: Radar,         label: 'SAR Telemetry',      sub: 'Sentinel-1B IW',  dot: 'green' },
  { id: 'validation', icon: ShieldCheck,   label: 'Slick Validation',   sub: '5/5 Physical Tests', badge: '5/5' },
  { id: 'incidents',  icon: AlertTriangle, label: 'Active Slicks',      sub: '4 Investigations', dot: 'red', badge: '4' },
  { id: 'calendar',   icon: Calendar,      label: 'Drift Forecast',     sub: '72-hr MetOcean' },
  { id: 'evidence',   icon: Folder,        label: 'Evidence Dossiers',  sub: 'Attribution 94/100', badge: '94%' },
  { id: 'reports',    icon: FileText,      label: 'Legal Reports',      sub: 'IOPC Rule 4A' },
  { id: 'comms',      icon: MessageSquare, label: 'Naval Comms',        sub: 'VHF Ch 16 & QRF', dot: 'green' },
];

interface DockSidebarProps {
  activeTab: SidebarTab;
  onSelectTab: (tab: SidebarTab) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onExitToLanding: () => void;
  onOpenOfficerModal: () => void;
}

interface DockNavItemProps {
  id: SidebarTab;
  icon: React.ElementType;
  label: string;
  sub: string;
  badge?: string;
  dot?: 'green' | 'red';
  isActive: boolean;
  isExpanded: boolean;
  mouseY: any;
  onClick: () => void;
}

const DockNavItem: React.FC<DockNavItemProps> = ({
  icon: Icon,
  label,
  sub,
  badge,
  dot,
  isActive,
  isExpanded,
  mouseY,
  onClick,
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHoveredLocal, setIsHoveredLocal] = useState(false);

  // Vertical Dock Proximity Physics
  const mouseDistance = useTransform(mouseY, (val: number) => {
    const rect = ref.current?.getBoundingClientRect() ?? { y: 0, height: 48 };
    return val - (rect.y + rect.height / 2);
  });

  const targetScale = useTransform(mouseDistance, [-80, 0, 80], [1, 1.14, 1]);
  const scale = useSpring(targetScale, { mass: 0.1, stiffness: 180, damping: 14 });

  const targetTranslateX = useTransform(mouseDistance, [-80, 0, 80], [0, 4, 0]);
  const translateX = useSpring(targetTranslateX, { mass: 0.1, stiffness: 180, damping: 14 });

  return (
    <motion.button
      ref={ref}
      style={{
        scale,
        x: translateX,
      }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      onMouseEnter={() => setIsHoveredLocal(true)}
      onMouseLeave={() => setIsHoveredLocal(false)}
      className={`relative flex items-center transition-colors duration-150 cursor-pointer rounded-xl select-none ${
        isExpanded ? 'w-full px-3.5 py-2.5 gap-3' : 'w-11 h-11 justify-center mx-auto'
      } ${
        isActive
          ? 'bg-indigo-600 text-white shadow-md font-bold'
          : 'text-slate-300 hover:text-white hover:bg-slate-800/80 font-semibold'
      }`}
    >
      <div className="relative shrink-0 flex items-center justify-center">
        <Icon style={{ width: 20, height: 20 }} className={isActive ? 'text-white' : 'text-slate-300'} />
        {!isExpanded && dot === 'green' && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900">
            <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
          </span>
        )}
        {!isExpanded && dot === 'red' && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-slate-900" />
        )}
      </div>

      {isExpanded ? (
        <div className="flex-1 text-left min-w-0 flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-sm font-extrabold text-white truncate tracking-tight">{label}</div>
            <div className="text-xs text-slate-300 truncate font-medium">{sub}</div>
          </div>
          <div className="flex items-center gap-1.5 ml-2 shrink-0">
            {dot === 'green' && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
            {badge && (
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                  dot === 'red'
                    ? 'bg-rose-500 text-white'
                    : isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-indigo-500/30 text-indigo-200'
                }`}
              >
                {badge}
              </span>
            )}
          </div>
        </div>
      ) : (
        /* Collapsed Tooltip */
        <AnimatePresence>
          {isHoveredLocal && (
            <motion.div
              initial={{ opacity: 0, x: -8, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute left-[54px] z-50 px-3 py-1.5 rounded-lg bg-slate-950 text-white text-xs font-bold whitespace-nowrap shadow-xl border border-slate-700 pointer-events-none"
            >
              {label}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.button>
  );
};

export const DockSidebar: React.FC<DockSidebarProps> = ({
  activeTab,
  onSelectTab,
  isExpanded,
  onToggleExpand,
  onExitToLanding,
  onOpenOfficerModal,
}) => {
  const mouseY = useMotionValue(Infinity);

  return (
    <motion.aside
      animate={{ width: isExpanded ? 280 : 76 }}
      transition={{ type: 'spring', mass: 0.15, stiffness: 220, damping: 22 }}
      className="relative flex flex-col justify-between h-screen sticky top-0 shrink-0 z-30 py-3.5 px-2 select-none overflow-visible bg-slate-950 border-r border-slate-800 shadow-xl"
    >
      {/* Top Header & Logo */}
      <div className="flex flex-col gap-3">
        <div className={`flex items-center ${isExpanded ? 'justify-between px-2' : 'justify-center'}`}>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectTab('dashboard')}
            title="SeaTrace Command Home"
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-md cursor-pointer shrink-0 bg-indigo-600 hover:bg-indigo-500"
          >
            <Waves style={{ width: 22, height: 22 }} />
          </motion.button>

          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between flex-1 ml-3 overflow-hidden"
            >
              <div>
                <div className="text-base font-black text-white tracking-wide">SeaTrace</div>
                <div className="text-xs text-indigo-400 font-bold uppercase tracking-widest">Maritime Command</div>
              </div>
              <button
                onClick={onToggleExpand}
                title="Collapse Sidebar"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </div>

        {/* Expand Toggle when collapsed */}
        {!isExpanded && (
          <div className="flex justify-center">
            <button
              onClick={onToggleExpand}
              title="Expand Sidebar (Show Names)"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              <PanelLeft className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Navigation Items with Vertical Dock Magnification */}
        <div
          onMouseMove={(e) => mouseY.set(e.clientY)}
          onMouseLeave={() => mouseY.set(Infinity)}
          className="flex flex-col gap-1.5 mt-1"
        >
          {/* Main Dashboard Tab */}
          <DockNavItem
            id="dashboard"
            icon={LayoutGrid}
            label="Command Center"
            sub="Surveillance Overview"
            isActive={activeTab === 'dashboard'}
            isExpanded={isExpanded}
            mouseY={mouseY}
            onClick={() => onSelectTab('dashboard')}
          />

          {/* Subpage Nav Items */}
          {NAV_ITEMS.map((item) => (
            <DockNavItem
              key={item.id}
              {...item}
              isActive={activeTab === item.id}
              isExpanded={isExpanded}
              mouseY={mouseY}
              onClick={() => onSelectTab(item.id)}
            />
          ))}
        </div>
      </div>

      {/* Sidebar Bottom: Exit to Landing & Officer Profile */}
      <div className="flex flex-col gap-2 pt-3 border-t border-slate-800">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onExitToLanding}
          title="Return to Landing Page"
          className={`flex items-center text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-all cursor-pointer ${
            isExpanded ? 'w-full px-3 py-2.5 gap-3' : 'w-11 h-11 justify-center mx-auto'
          }`}
        >
          <ArrowLeft style={{ width: 18, height: 18 }} className="shrink-0" />
          {isExpanded && (
            <span className="text-sm font-bold text-slate-300">Exit to Landing</span>
          )}
        </motion.button>

        {/* Duty Officer Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={onOpenOfficerModal}
          title="Command Duty Officer Profile"
          className={`flex items-center rounded-xl cursor-pointer p-1.5 transition-all ${
            isExpanded ? 'bg-slate-900 hover:bg-slate-800 gap-3 px-3 py-2 border border-slate-800' : 'justify-center mx-auto'
          }`}
        >
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-indigo-500 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&auto=format&fit=crop&q=80"
                alt="CDR Rodriguez"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
          </div>

          {isExpanded && (
            <div className="min-w-0 text-left">
              <div className="text-sm font-black text-white truncate">CDR J. Rodriguez</div>
              <div className="text-xs text-emerald-400 font-bold">Duty Officer (Active)</div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.aside>
  );
};
