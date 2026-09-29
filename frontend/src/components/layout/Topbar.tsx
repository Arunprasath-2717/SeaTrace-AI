import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, Clock, Radio, LogOut, ExternalLink } from 'lucide-react';
import { StatusIndicator } from '../common/StatusIndicator';
import { Badge } from '../common/Badge';

interface TopbarProps {
  onToggleSidebar?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar }) => {
  const location = useLocation();
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {

  
      const now = new Date();
      setUtcTime(
        now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute breadcrumb title based on pathname
  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/app':
        return 'Investigation Console';
      case '/app/incidents':
        return 'Incident Queue & Triage';
      case '/app/detection':
        return 'Satellite Slick Detection';
      case '/app/validation':
        return 'Look-Alike & Weather Validation';
      case '/app/origin':
        return 'Origin Drift Reconstruction';
      case '/app/vessels':
        return 'Vessel Intelligence & Trajectories';
      case '/app/counterfactual':
        return 'Counterfactual Forward Simulation';
      case '/app/evidence':
        return 'Evidence Package & Provenance';
      case '/app/reports':
        return 'Forensic Attribution Reports';
      case '/app/data-sources':
        return 'Sensors & Hydrodynamic Ingestion';
      case '/app/system-status':
        return 'System & Compute Status';
      default:
        return 'Investigation';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-seatrace-bg-secondary/80 backdrop-blur border-b border-seatrace-border-subtle">
      {/* Left: Mobile Toggle & Page Context */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded text-seatrace-text-secondary hover:text-seatrace-text-primary hover:bg-seatrace-bg-surface lg:hidden"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-seatrace-teal hidden sm:inline">
            SEATRACE
          </span>
          <span className="text-xs text-seatrace-text-muted hidden sm:inline">/</span>
          <h1 className="text-sm md:text-base font-semibold text-seatrace-text-primary truncate">
            {getPageTitle(location.pathname)}
          </h1>
        </div>
      </div>

      {/* Right: Operational Telemetry & Actions */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* UTC Maritime Clock */}
        <div className="hidden md:flex items-center gap-1.5 text-xs font-mono text-seatrace-text-secondary bg-seatrace-bg-surface/60 px-2.5 py-1 rounded border border-seatrace-border-subtle">
          <Clock className="w-3.5 h-3.5 text-seatrace-teal" />
          <span>{utcTime || '00:00:00 UTC'}</span>
        </div>

        {/* Telemetry Pipeline Status */}
        <div className="hidden lg:flex items-center gap-2 bg-seatrace-bg-surface/40 px-2.5 py-1 rounded border border-seatrace-border-subtle">
          <Radio className="w-3.5 h-3.5 text-seatrace-mint animate-pulse" />
          <span className="text-xs font-mono text-seatrace-text-secondary">
            SAR Feed:
          </span>
          <StatusIndicator status="online" label="NOMINAL" />
        </div>

        <Badge variant="mint" size="sm" className="hidden sm:inline-flex">
          DEMO MODE
        </Badge>

        {/* Navigation & Logout actions */}
        <div className="flex items-center gap-1 border-l border-seatrace-border-subtle pl-2">
          <Link
            to="/"
            title="Public Landing"
            className="p-2 text-seatrace-text-secondary hover:text-seatrace-mint transition-colors rounded hover:bg-seatrace-bg-surface"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
          <Link
            to="/"
            title="Return to Landing"
            className="p-2 text-seatrace-text-secondary hover:text-seatrace-status-danger transition-colors rounded hover:bg-seatrace-bg-surface"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
