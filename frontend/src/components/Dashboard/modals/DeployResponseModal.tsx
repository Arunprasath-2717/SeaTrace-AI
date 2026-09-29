import React, { useState } from 'react';
import { X, Anchor, ShieldCheck, Send } from 'lucide-react';

interface DeployResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onSuccess: (msg: string) => void;
}

export const DeployResponseModal: React.FC<DeployResponseModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  onSuccess,
}) => {
  const [unit, setUnit] = useState('ICGS_SAMUDRA_PRAHARI');
  const [equipment, setEquipment] = useState('BOOM_SKIMMER');
  const [dispatching, setDispatching] = useState(false);

  if (!isOpen) return null;

  const handleDispatch = () => {
    setDispatching(true);
    setTimeout(() => {
      setDispatching(false);
      onSuccess(`Dispatched QRF Unit ${unit.replace(/_/g, ' ')} with containment gear to Sector ST-2046! ETA: 45 min.`);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md select-none">
      <div
        className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl transition-all ${
          isDarkMode ? 'bg-[#0a1835] border-blue-900/50 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-rose-500/10 text-rose-500">
              <Anchor className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">Deploy Quick Response Force (QRF)</h2>
              <div className="text-[10px] text-slate-700 dark:text-slate-400 font-bold">Indian Coast Guard Marine Pollution Control</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4 text-xs">
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-300 block mb-1">
              Select Response Asset / Unit
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border outline-none bg-slate-50 dark:bg-[#0f244a] border-slate-300 dark:border-blue-900/60 text-slate-900 dark:text-white font-semibold"
            >
              <option value="ICGS_SAMUDRA_PRAHARI">ICGS SAMUDRA PRAHARI (Pollution Vessel - Standby Mumbai)</option>
              <option value="ICGS_SAMUDRA_PAHAVAR">ICGS SAMUDRA PAVAK (Dedicated Anti-Pollution Vessel)</option>
              <option value="DORNIER_228_CG754">Dornier 228 Maritime Air Patrol (FLIR + SLAR)</option>
              <option value="FAST_PATROL_C431">Fast Interceptor Boat C-431 (Rapid Boarding Team)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-300 block mb-1">
              Mission Payload & Gear
            </label>
            <select
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border outline-none bg-slate-50 dark:bg-[#0f244a] border-slate-300 dark:border-blue-900/60 text-slate-900 dark:text-white font-semibold"
            >
              <option value="BOOM_SKIMMER">300m Inflatable Oil Boom + Weir Skimmers</option>
              <option value="DISPERSANT_SPRAY">OMC-Approved Airborne Biodegradable Dispersant</option>
              <option value="BOARDING_SAMPLING">Armed Maritime Police Boarding Team + Hydrocarbon Sampling Kit</option>
            </select>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-rose-600" />
              <span className="text-xs font-black text-slate-900 dark:text-slate-200">Incident Target: Slick ST-2046</span>
            </div>
            <div className="text-[11px] text-slate-800 dark:text-slate-400 font-medium">
              Coordinated interception with suspect tanker <strong className="text-slate-950">MT OCEAN TITAN</strong> (stationary, AIS disabled).
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={dispatching}
              className="px-4 py-2 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-950 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDispatch}
              disabled={dispatching}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:opacity-90 shadow-lg shadow-rose-500/25 cursor-pointer transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" /> Authorize QRF Dispatch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
