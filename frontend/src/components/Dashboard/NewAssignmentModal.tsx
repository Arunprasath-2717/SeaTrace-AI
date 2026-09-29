import React, { useState } from 'react';
import { X, Check, ShieldAlert } from 'lucide-react';

interface NewAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    tag: string;
    priority: 'Critical' | 'High' | 'Medium' | 'Low';
    category: 'forensics' | 'attribution' | 'drift';
  }) => void;
  isDarkMode: boolean;
}

export const NewAssignmentModal: React.FC<NewAssignmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isDarkMode,
}) => {
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [priority, setPriority] = useState<'Critical' | 'High' | 'Medium' | 'Low'>('High');
  const [category, setCategory] = useState<'forensics' | 'attribution' | 'drift'>('forensics');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    onSave({ title, tag: tag || 'ST-2046 Forensics', priority, category });
    setTitle('');
    setTag('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl transition-all ${
          isDarkMode
            ? 'bg-[#0a1835] border-blue-900/50 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold">New Forensic Assignment</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-700/30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">
              Operation Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Trace back-calculated drift for MT OCEAN TITAN"
              className={`w-full px-3.5 py-2 rounded-xl text-xs border outline-none ${
                isDarkMode
                  ? 'bg-[#0f244a] border-blue-900/60 text-white focus:border-teal-400'
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-teal-500'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Domain
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                  isDarkMode
                    ? 'bg-[#0f244a] border-blue-900/60 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <option value="forensics">Spill Forensics</option>
                <option value="attribution">AIS Attribution</option>
                <option value="drift">Drift Modeling</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                  isDarkMode
                    ? 'bg-[#0f244a] border-blue-900/60 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">
              Sector / MMSI Tag
            </label>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="e.g. MMSI 636019448 or ST-2046"
              className={`w-full px-3.5 py-2 rounded-xl text-xs border outline-none ${
                isDarkMode
                  ? 'bg-[#0f244a] border-blue-900/60 text-white focus:border-teal-400'
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-teal-500'
              }`}
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-500 shadow-lg shadow-teal-500/20 hover:opacity-95"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Create Assignment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
