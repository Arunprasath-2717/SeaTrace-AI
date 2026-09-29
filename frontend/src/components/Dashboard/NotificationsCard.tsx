import React from 'react';
import {
  Clock,
  Compass,
  MoreHorizontal,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'incident' | 'anomaly';
  title: string;
  timeTag?: string;
  dateTag?: string;
  author?: string;
  snippet?: string;
  badge?: string;
}

interface NotificationsCardProps {
  isDarkMode?: boolean;
  onClearAll?: () => void;
}

export const NotificationsCard: React.FC<NotificationsCardProps> = ({
  onClearAll,
}) => {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([
    {
      id: 'notif-upcoming',
      type: 'incident',
      title: 'Sentinel-1B Swath Ingestion (Pass: 45 min)',
      dateTag: 'Today, 10:15 UTC',
      timeTag: 'ESA Copernicus Feed',
      badge: 'SAR Sentinel-1B Swath Pass (Time: 45 min)',
    },
    {
      id: 'notif-message',
      type: 'anomaly',
      title: 'Incident Attribution Forensics (ST-2046)',
      author: 'Intelligence Advisory from CDR Rodriguez',
      snippet: 'Attribution completed for ST-2046 in Mumbai High sector. MT OCEAN TITAN flagged as prime suspect (94% confidence).',
    },
    {
      id: 'notif-drift',
      type: 'incident',
      title: 'Coastal Threat: Murud-Janjira Estuary',
      dateTag: 'Landfall: 57 Hours',
      timeTag: 'MetOcean Simulation',
      badge: 'MetOcean Trajectory Warning: Estuary Impact',
    },
  ]);

  const handleClear = () => {
    setNotifications([]);
    if (onClearAll) onClearAll();
  };

  return (
    <div className="flex flex-col p-5 rounded-3xl border border-[#1E2E48] bg-[#0B1528]/95 shadow-xl shadow-black/20 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <h2 className="text-sm font-bold tracking-tight text-white">
            Incident Notifications
          </h2>
          {notifications.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </div>
        {notifications.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-cyan-300 transition-colors"
          >
            <span>Acknowledge All</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="flex flex-col gap-3">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No active incident alerts
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl border border-[#1E2E48] bg-[#0E1B33]/80 hover:border-cyan-400/50 hover:bg-[#112344] transition-all duration-200 group"
            >
              {item.type === 'incident' ? (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 shadow-sm animate-pulse" />
                      <span className="text-[11px] font-bold text-rose-400">
                        {item.badge}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 group-hover:text-slate-200">
                      <button className="p-1 hover:bg-slate-700/50 rounded">
                        <ExternalLink className="w-3 h-3" />
                      </button>
                      <button className="p-1 hover:bg-slate-700/50 rounded">
                        <MoreHorizontal className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs font-bold leading-snug mb-2.5 text-slate-100">
                    {item.title}
                  </p>

                  <div className="flex items-center flex-wrap gap-2">
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium bg-[#0a1526] text-cyan-300 border border-blue-900/40">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>{item.dateTag}</span>
                    </div>
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium bg-[#0a1526] text-slate-300 border border-blue-900/40">
                      <Compass className="w-3 h-3 text-teal-400" />
                      <span>{item.timeTag}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-cyan-400">
                      {item.title}
                    </span>
                    <button className="p-1 text-slate-400 hover:text-slate-200">
                      <MoreHorizontal className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-xs font-semibold mb-1 text-slate-200">
                    {item.author}
                  </p>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {item.snippet}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
