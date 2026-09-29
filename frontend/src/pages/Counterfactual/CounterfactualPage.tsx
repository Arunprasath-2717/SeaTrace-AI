import React from 'react';
import { SimulationWorkflow } from '../../components/simulation/SimulationWorkflow';
import { ObservedSimulationComparison } from '../../components/simulation/ObservedSimulationComparison';
import { SimulationMetrics } from '../../components/simulation/SimulationMetrics';
import { Badge } from '../../components/common/Badge';
import { demoVessels } from '../../data/demo/vessels';
import { Ship, ArrowRight, Droplet, Waves, Sparkles, Scan, HelpCircle } from 'lucide-react';

export const CounterfactualPage: React.FC = () => {
  const candidate = demoVessels[0];

  return (
    <div className="space-y-6">
      {/* Header with Requirement 12 phrasing */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-teal-800 dark:text-teal-400 font-black mb-1">
            HYPOTHESIS PLAUSIBILITY ENGINE
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white tracking-wide">
            WHAT IF A RELEASE HAD OCCURRED NEAR THIS CANDIDATE?
          </h2>
          <p className="text-xs text-slate-800 dark:text-slate-300 font-semibold mt-1">
            Evaluating hydrodynamic consistency: If candidate vessel {candidate.identity.name} discharged oil, would it evolve into the observed satellite slick?
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="teal" size="md">
            OPENOIL ENGINE v1.8
          </Badge>
          <Badge variant="mint" size="md">
            CONVERGENCE EVALUATED
          </Badge>
        </div>
      </div>

      {/* Visual Investigation Reasoning Pipeline Banner */}
      <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 overflow-x-auto">
        <div className="flex items-center justify-between gap-2 min-w-max text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-950 dark:text-slate-100 font-bold">
            <Ship className="w-4 h-4 text-teal-700 dark:text-teal-400" />
            <span>Candidate Vessel ({candidate.identity.name})</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 flex-shrink-0" />

          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-950 dark:text-slate-100 font-bold">
            <Droplet className="w-4 h-4 text-teal-700 dark:text-teal-400" />
            <span>Hypothetical Release (15 m³/h)</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 flex-shrink-0" />

          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-950 dark:text-slate-100 font-bold">
            <Waves className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>Ocean Drift Model (OpenDrift)</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 flex-shrink-0" />

          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-950 dark:text-slate-100 font-bold">
            <Sparkles className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span>Simulated Slick (14.2 km²)</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 flex-shrink-0" />

          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-950 dark:text-slate-100 font-bold">
            <Scan className="w-4 h-4 text-teal-700 dark:text-teal-400" />
            <span>Observed Slick (14.8 km²)</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 flex-shrink-0" />

          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-300 dark:border-indigo-700 text-indigo-950 dark:text-indigo-200 font-black">
            <HelpCircle className="w-4 h-4 text-indigo-700 dark:text-indigo-400" />
            <span>Compatibility Analysis (IoU 84%)</span>
          </div>
        </div>
      </div>

      {/* Grid: Workflow Configuration & Split-screen Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <SimulationWorkflow />
        </div>
        <div className="lg:col-span-7">
          <ObservedSimulationComparison />
        </div>
      </div>

      {/* Convergence Scorecard */}
      <SimulationMetrics />
    </div>
  );
};

export default CounterfactualPage;
