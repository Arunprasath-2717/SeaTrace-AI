import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Play, RotateCcw, Droplet } from 'lucide-react';
import { demoSimulation } from '../../data/demo/simulation';

export const SimulationWorkflow: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [rate, setRate] = useState(demoSimulation.releaseHypothesis.rateM3PerHour);
  const [duration, setDuration] = useState(demoSimulation.releaseHypothesis.durationHours);
  const [oilType, setOilType] = useState(demoSimulation.releaseHypothesis.oilType);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
    }, 1200);
  };

  return (
    <Card
      title="FORWARD COUNTERFACTUAL PARAMETERS"
      subtitle="Hypothetical discharge simulation configuration"
      headerAction={
        <Badge variant="mint" size="sm">
          OPENOIL ENGINE
        </Badge>
      }
      className={className}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase text-slate-700 dark:text-slate-400 mb-1">
              Discharge Rate (m³/h)
            </label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full px-3 py-1.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-950 dark:text-white font-mono text-xs font-bold focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold uppercase text-slate-700 dark:text-slate-400 mb-1">
              Duration (Hours)
            </label>
            <input
              type="number"
              step="0.5"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-3 py-1.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-950 dark:text-white font-mono text-xs font-bold focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold uppercase text-slate-700 dark:text-slate-400 mb-1">
              Oil Viscosity / Type
            </label>
            <select
              value={oilType}
              onChange={(e) => setOilType(e.target.value)}
              className="w-full px-3 py-1.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-950 dark:text-white font-mono text-xs font-bold focus:outline-none focus:border-indigo-600"
            >
              <option value="Medium Crude (API 31.2)">Medium Crude (API 31.2)</option>
              <option value="Heavy Fuel Oil (HFO 380)">Heavy Fuel Oil (HFO 380)</option>
              <option value="Marine Diesel Oil (MDO)">Marine Diesel Oil (MDO)</option>
              <option value="Light Condensate">Light Condensate</option>
            </select>
          </div>
        </div>

        <div className="p-3 rounded bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <Droplet className="w-4 h-4 text-teal-700 dark:text-teal-400" />
            <span className="text-slate-700 dark:text-slate-300 font-bold">Simulated Volume:</span>
          </div>
          <span className="text-teal-900 dark:text-emerald-400 font-black">
            {(rate * duration).toFixed(1)} m³ (~{((rate * duration) * 6.29).toFixed(0)} bbls)
          </span>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <Button
            variant="primary"
            size="sm"
            onClick={handleRun}
            isLoading={isRunning}
            leftIcon={<Play className="w-3.5 h-3.5" />}
          >
            Execute Forward Simulation
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setRate(demoSimulation.releaseHypothesis.rateM3PerHour);
              setDuration(demoSimulation.releaseHypothesis.durationHours);
            }}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset Default
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SimulationWorkflow;
