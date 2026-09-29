import React from 'react';
import { Link } from 'react-router-dom';
import { SeaTraceLogo } from '../../assets/logos/SeaTraceLogo';
import { navigationConfig } from '../navigation/navigationConfig';
import { NavigationItem } from '../navigation/NavigationItem';
import { StatusIndicator } from '../common/StatusIndicator';
import { UserCheck, ShieldAlert, X } from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 flex flex-col bg-white border-r border-slate-200 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header & Brand */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 bg-white">
          <Link to="/app" className="flex items-center">
            <SeaTraceLogo size="sm" />
          </Link>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-500 hover:text-slate-800 lg:hidden"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navigationConfig.map((section) => (
            <div key={section.id} className="space-y-1">
              <h3 className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                {section.title}
              </h3>
              <div className="space-y-0.5 mt-1">
                {section.items.map((item) => (
                  <NavigationItem
                    key={item.id}
                    item={item}
                    onNavigate={() => {
                      if (onClose && window.innerWidth < 1024) {
                        onClose();
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Tactical Banner / Status */}
        <div className="p-3 mx-3 mb-2 rounded bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-mono text-slate-600">
              Active Scene
            </span>
            <span className="flex items-center gap-1 text-[10px] font-mono text-teal-700 font-semibold">
              <ShieldAlert className="w-3 h-3 text-teal-600" /> LIVE
            </span>
          </div>
          <p className="text-xs font-mono text-slate-900 font-semibold truncate">
            INC-2026-0881
          </p>
        </div>

        {/* Bottom Investigator Profile */}
        <div className="border-t border-slate-200 p-3 bg-slate-50/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 flex-shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-800 truncate">
                  Investigator
                </span>
                <StatusIndicator status="online" label="Online" pulse />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
