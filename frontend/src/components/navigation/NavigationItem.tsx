import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  AlertTriangle,
  Scan,
  ShieldCheck,
  Compass,
  Ship,
  GitCompare,
  FileCheck,
  FileText,
  Database,
  Activity,
  LucideIcon,
} from 'lucide-react';
import { NavItemConfig } from './navigationConfig';

const iconMap: Record<NavItemConfig['iconName'], LucideIcon> = {
  LayoutDashboard,
  AlertTriangle,
  Scan,
  ShieldCheck,
  Compass,
  Ship,
  GitCompare,
  FileCheck,
  FileText,
  Database,
  Activity,
};

interface NavigationItemProps {
  item: NavItemConfig;
  onNavigate?: () => void;
}

export const NavigationItem: React.FC<NavigationItemProps> = ({ item, onNavigate }) => {
  const IconComponent = iconMap[item.iconName] || LayoutDashboard;

  return (
    <NavLink
      to={item.path}
      end={item.path === '/app'}
      onClick={onNavigate}
      className={({ isActive }) =>
        `group relative flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-all duration-150 ${
          isActive
            ? 'bg-cyan-50/80 text-seatrace-mint border-l-2 border-seatrace-mint font-semibold'
            : 'text-seatrace-text-secondary hover:text-seatrace-text-primary hover:bg-slate-50'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className="flex items-center gap-2.5 min-w-0">
            <IconComponent
              className={`w-4 h-4 flex-shrink-0 transition-colors ${
                isActive
                  ? 'text-seatrace-mint'
                  : 'text-slate-400 group-hover:text-seatrace-mint'
              }`}
            />
            <span className="truncate tracking-wide">{item.label}</span>
          </div>
          {item.badge && (
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded tracking-tight ${
                isActive
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
};

export default NavigationItem;
