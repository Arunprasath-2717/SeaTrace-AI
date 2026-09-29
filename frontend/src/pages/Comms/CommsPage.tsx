import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Radio, Send, Volume2, VolumeX,
  CheckCircle2, Signal, RefreshCw, Anchor
} from 'lucide-react';
import { SeaBadge } from '../../components/ui/index';

interface Transmission {
  id: string;
  sender: string;
  role: string;
  channel: string;
  time: string;
  content: string;
  urgency: 'CRITICAL' | 'ALERT' | 'ROUTINE';
  verified: boolean;
}

const CHANNELS = [
  { id: 'ch16', name: 'VHF Ch 16 (156.800 MHz)', sub: 'International Distress & Safety', status: 'MONITORING', color: '#ef4444' },
  { id: 'ch70', name: 'DSC Ch 70 (156.525 MHz)', sub: 'Digital Selective Calling', status: 'ACTIVE', color: '#6366f1' },
  { id: 'icg',  name: 'ICG OpNet (8.291 MHz USB)', sub: 'Coast Guard Command Mumbai', status: 'SECURE', color: '#10b981' },
  { id: 'sat',  name: 'INMARSAT-C Navarea VIII', sub: 'Satellite Pollution Alert Net', status: 'LINKED', color: '#38bdf8' },
];

const INITIAL_TRANSMISSIONS: Transmission[] = [
  {
    id: 'TX-901',
    sender: 'ICGS SAMUDRA PRAHARI',
    role: 'Pollution Control Vessel (CG)',
    channel: 'ICG OpNet (8.291 MHz USB)',
    time: '10:42:15 UTC',
    content: 'Steaming towards Sector 4B. Visual confirmation of surface slick sheen trailing south-southwest. Preparing oil containment boom deployment.',
    urgency: 'ALERT',
    verified: true,
  },
  {
    id: 'TX-902',
    sender: 'MARITIME RESCUE COORD MUMBAI',
    role: 'MRCC HQ',
    channel: 'INMARSAT-C Navarea VIII',
    time: '10:38:00 UTC',
    content: 'NAVTEX WARNING ISSUED: All vessels transiting 21.45°N 68.32°E maintain caution. Marine environmental containment operations underway.',
    urgency: 'CRITICAL',
    verified: true,
  },
  {
    id: 'TX-903',
    sender: 'DORNIER 228 (CG-754)',
    role: 'Coast Guard Maritime Surveillance Air',
    channel: 'VHF Ch 16 (156.800 MHz)',
    time: '10:29:40 UTC',
    content: 'FLIR thermal imaging confirmed thick emulsion core at 21°27\'N, 68°19\'E. Target tanker MT OCEAN TITAN sighted stationary at 6.8 NM.',
    urgency: 'CRITICAL',
    verified: true,
  },
  {
    id: 'TX-904',
    sender: 'MV ADRIATIC STAR',
    role: 'Commercial Bulk Carrier',
    channel: 'VHF Ch 16 (156.800 MHz)',
    time: '10:15:10 UTC',
    content: 'Acknowledged Navtex alert. Altering course 15 degrees eastward to maintain safe clearance from containment zone.',
    urgency: 'ROUTINE',
    verified: true,
  },
];

export const CommsPage: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState('ch16');
  const [transmissions, setTransmissions] = useState<Transmission[]>(INITIAL_TRANSMISSIONS);
  const [isMuted, setIsMuted] = useState(false);
  const [message, setMessage] = useState('');
  const [urgency, setUrgency] = useState<'CRITICAL' | 'ALERT' | 'ROUTINE'>('ALERT');
  const [target, setTarget] = useState('ALL_SECTOR');
  const [sentToast, setSentToast] = useState<string | null>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newTx: Transmission = {
      id: `TX-${Math.floor(Math.random() * 900) + 100}`,
      sender: 'SEATRACE COMMAND HQ',
      role: 'Command Duty Officer (CDO)',
      channel: CHANNELS.find(c => c.id === selectedChannel)?.name || 'VHF Ch 16',
      time: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' UTC',
      content: message,
      urgency,
      verified: true,
    };

    setTransmissions([newTx, ...transmissions]);
    setMessage('');
    setSentToast(`Transmission dispatched to ${target === 'ALL_SECTOR' ? 'Sector Fleet' : 'ICGS SAMUDRA PRAHARI'}`);
    setTimeout(() => setSentToast(null), 3500);
  };

  const applyTemplate = (tpl: string) => {
    setMessage(tpl);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: 16, fontFamily: 'Inter, system-ui, sans-serif' }} className="select-none">
      <div style={{ maxWidth: 1480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                <Radio className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Naval Comms & Incident Dispatch
              </h1>
            </div>
            <p className="text-xs font-semibold text-slate-600 mt-1">
              Real-time VHF Marine Band, DSC & INMARSAT-C Satellite Dispatch Console · Navarea VIII (Indian Ocean)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 shadow-sm cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-600" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-600" />}
              <span>{isMuted ? 'Muted' : 'Radio Audio Live'}</span>
            </button>
            <SeaBadge variant="emerald" pulse>QRF LINK SECURE</SeaBadge>
          </div>
        </div>

        {/* Channel Frequency Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CHANNELS.map((ch) => {
            const isSelected = selectedChannel === ch.id;
            return (
              <motion.div
                key={ch.id}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedChannel(ch.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white shadow-md ring-2 ring-indigo-600 border-indigo-300'
                    : 'bg-white hover:bg-slate-50 border-slate-300 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: ch.color }} />
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                    {ch.status}
                  </span>
                </div>
                <div className="text-xs font-black text-slate-900">{ch.name}</div>
                <div className="text-[10px] font-medium text-slate-600 mt-0.5">{ch.sub}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Main Grid: Live Transmissions Feed + Broadcast Composer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">

          {/* Live Transmissions Feed (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="p-4 rounded-2xl bg-white border border-slate-300 shadow-sm flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                <div className="flex items-center gap-2">
                  <Signal className="w-4 h-4 text-indigo-700" />
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Encrypted Tactical Intercepts</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-600">Auto-Decrypting</span>
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                {transmissions.map((tx) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white transition-all flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900">{tx.sender}</span>
                        <span className="text-[10px] font-semibold text-slate-600">({tx.role})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-slate-600">{tx.time}</span>
                        <span
                          className={`text-[9px] font-black px-2 py-0.5 rounded text-white ${
                            tx.urgency === 'CRITICAL' ? 'bg-rose-600' : tx.urgency === 'ALERT' ? 'bg-amber-600' : 'bg-slate-700'
                          }`}
                        >
                          {tx.urgency}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-800 font-medium leading-relaxed">{tx.content}</p>
                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-200 text-[10px] text-slate-600 font-semibold">
                      <span>Channel: <strong className="text-slate-900">{tx.channel}</strong></span>
                      {tx.verified && (
                        <span className="flex items-center gap-1 text-emerald-700 font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Signed & Verified
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Transmission Composer & Quick Dispatch (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">

            {/* Quick Dispatch / QRF Action */}
            <div
              className="rounded-2xl p-4 shadow-sm text-white relative overflow-hidden border border-slate-800"
              style={{ background: '#0f172a' }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Anchor className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
                    Indian Coast Guard QRF
                  </span>
                </div>
                <SeaBadge variant="emerald" pulse>ON STANDBY</SeaBadge>
              </div>
              <h3 className="text-sm font-black mb-1 text-white">ICGS SAMUDRA PRAHARI</h3>
              <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                Specialized Marine Pollution Control Vessel stationed 18 NM west of Mumbai High. Equipped with 300m containment boom and skimmers.
              </p>
              <button
                onClick={() => {
                  setSentToast('Direct QRF Tasking Sent to ICGS SAMUDRA PRAHARI!');
                  setTimeout(() => setSentToast(null), 3500);
                }}
                className="w-full py-2 px-3 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Send className="w-3.5 h-3.5" /> Direct QRF Intercept Tasking
              </button>
            </div>

            {/* Message Broadcast Composer */}
            <div className="p-4 rounded-2xl bg-white border border-slate-300 shadow-sm">
              <div className="flex items-center gap-2 pb-2.5 border-b border-slate-200 mb-3">
                <Send className="w-4 h-4 text-indigo-700" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Broadcast Tactical Dispatch</h3>
              </div>
              <div>
                <form onSubmit={handleSend} className="flex flex-col gap-2.5">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-700 block mb-1">
                      Recipient / Target Net
                    </label>
                    <select
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 border border-slate-300 outline-none text-slate-900"
                    >
                      <option value="ALL_SECTOR">ALL SECTOR (Navarea VIII Navtex Warning)</option>
                      <option value="ICGS">ICGS SAMUDRA PRAHARI (QRF Lead)</option>
                      <option value="AIR_WING">Coast Guard Dornier 228 (Air Enclave)</option>
                      <option value="SUSPECT">MT OCEAN TITAN (Prime Suspect Direct Hail)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-700 block mb-1">
                        Urgency Level
                      </label>
                      <select
                        value={urgency}
                        onChange={(e) => setUrgency(e.target.value as any)}
                        className="w-full px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 border border-slate-300 outline-none text-slate-900"
                      >
                        <option value="CRITICAL">CRITICAL (Securite / Pollution)</option>
                        <option value="ALERT">ALERT (Operational Advisory)</option>
                        <option value="ROUTINE">ROUTINE (Standard Check-in)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-700 block mb-1">
                        Selected Net
                      </label>
                      <div className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 border border-slate-300 text-slate-900 font-mono font-bold truncate">
                        {CHANNELS.find(c => c.id === selectedChannel)?.name.split(' ')[0]}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-700 block mb-1">
                      Dispatch Payload
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type tactical message or select a template below…"
                      className="w-full p-2.5 rounded-lg text-xs font-medium bg-slate-50 border border-slate-300 outline-none text-slate-900 placeholder:text-slate-500 resize-none focus:ring-1 focus:ring-indigo-600"
                    />
                  </div>

                  {/* Quick Templates */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                      Quick Tactical Templates:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => applyTemplate('Order MT OCEAN TITAN to halt engines and await Indian Coast Guard boarding inspection.')}
                        className="px-2.5 py-1 rounded text-[10px] font-bold bg-rose-50 text-rose-800 hover:bg-rose-100 transition-all border border-rose-300"
                      >
                        Boarding Order
                      </button>
                      <button
                        type="button"
                        onClick={() => applyTemplate('Deploy oil skimmers and 300m containment boom immediately around slick coordinates ST-2046.')}
                        className="px-2.5 py-1 rounded text-[10px] font-bold bg-indigo-50 text-indigo-800 hover:bg-indigo-100 transition-all border border-indigo-300"
                      >
                        Deploy Boom
                      </button>
                      <button
                        type="button"
                        onClick={() => applyTemplate('Request immediate AIS transmission reactivation. Explain 4-hour telemetry blackout.')}
                        className="px-2.5 py-1 rounded text-[10px] font-bold bg-amber-50 text-amber-800 hover:bg-amber-100 transition-all border border-amber-300"
                      >
                        Demand AIS
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-1 w-full py-2 px-3 rounded-lg text-xs font-bold text-white bg-indigo-700 hover:bg-indigo-600 shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Send className="w-3.5 h-3.5" /> Broadcast Transmission
                  </button>
                </form>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Dispatched Notification Toast */}
      {sentToast && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-semibold bg-slate-900 text-white shadow-2xl border border-emerald-400/40"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{sentToast}</span>
        </motion.div>
      )}
    </div>
  );
};

export default CommsPage;
