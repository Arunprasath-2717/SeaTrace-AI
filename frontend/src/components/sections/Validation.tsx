import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, FlaskConical } from 'lucide-react';

const detectionMetrics = [
  { label: 'Intersection over Union (IoU)', status: 'IN PROGRESS', target: '> 0.85' },
  { label: 'Dice Similarity Coefficient', status: 'IN PROGRESS', target: '> 0.90' },
  { label: 'Precision (Slick Identification)', status: 'IN PROGRESS', target: '> 0.92' },
  { label: 'Recall (Thin Sheen Sensitivity)', status: 'IN PROGRESS', target: '> 0.88' },
  { label: 'F1 Score Benchmark', status: 'IN PROGRESS', target: '> 0.90' },
  { label: 'Coastal False-Positive Rate', status: 'IN PROGRESS', target: '< 4.0%' },
];

const attributionMetrics = [
  { label: 'Top-1 Candidate Recovery', status: 'NOT YET EVALUATED', target: 'Empirical verification' },
  { label: 'Top-3 Candidate Recovery', status: 'NOT YET EVALUATED', target: 'Controlled synthetic tests' },
  { label: 'Origin Zone Coverage', status: 'NOT YET EVALUATED', target: 'Ensemble convergence' },
  { label: 'Origin Localization Error (km)', status: 'NOT YET EVALUATED', target: '< 3.0 km standard' },
  { label: 'Robustness to AIS Reception Gaps', status: 'NOT YET EVALUATED', target: 'Interpolation audits' },
  { label: 'Robustness to Metocean Perturbation', status: 'NOT YET EVALUATED', target: 'Monte Carlo sensitivity' },
];

const impactPoints = [
  { title: 'Faster Investigation', desc: 'Reduces manual search across thousands of satellite scenes and vessel logs to minutes.' },
  { title: 'Evidence-Linked Reasoning', desc: 'Connects orbital imagery directly to physical vessel passage with full audit trails.' },
  { title: 'Physical Plausibility Testing', desc: 'Validates hypotheses with forward hydrodynamic Lagrangian dispersion engines.' },
  { title: 'Uncertainty-Aware Decisions', desc: 'Exposes variance, metocean errors, and AIS integrity flags directly to the investigator.' },
  { title: 'Reproducible Workflows', desc: 'Standardizes forensic reporting for international maritime regulatory compliance.' },
  { title: 'Geospatial Context', desc: 'Seamlessly fuses bathymetry, ocean currents, wind vectors, and radar backscatter.' },
];

export const Validation: React.FC = () => {
  return (
    <section id="validation-section" className="relative py-28 px-6 bg-seatrace-bg-primary text-seatrace-text-primary overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-0 w-[500px] h-[400px] bg-seatrace-teal-dim rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto space-y-28">
        {/* ── Benchmarking Section ── */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.65 }}
            className="max-w-2xl mb-14"
          >
            <span className="section-overline block mb-4">BENCHMARKING & RIGOR</span>
            <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold tracking-tight text-seatrace-text-primary leading-[1.12]">
              Built to be{' '}
              <span className="text-seatrace-teal">measured.</span>
            </h2>
            <p className="mt-5 text-sm text-seatrace-text-secondary leading-relaxed">
              Scientific integrity requires honesty about testing status. We report benchmark metrics transparently and evaluate models across both controlled synthetic environments and verified historical maritime spills.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Detection Benchmarks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl bg-white shadow-sm border border-seatrace-border-subtle overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-seatrace-border-subtle">
                <div>
                  <h3 className="text-sm font-bold text-seatrace-text-primary">Satellite Slick Detection</h3>
                  <span className="text-[10px] font-mono uppercase text-seatrace-text-muted tracking-wider">
                    SYNTHETIC CONTROLLED EVALUATION
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-50 border border-cyan-200">
                  <FlaskConical className="w-3 h-3 text-cyan-800" />
                  <span className="text-[10px] font-mono text-cyan-800 font-bold">BENCHMARKING</span>
                </div>
              </div>
              <div className="p-5 space-y-2">
                {detectionMetrics.map((m, i) => (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Clock className="w-3 h-3 text-seatrace-teal flex-shrink-0" />
                      <span className="text-xs font-mono text-seatrace-text-secondary truncate">{m.label}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] font-mono text-seatrace-text-muted">{m.target}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Attribution Benchmarks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl bg-white shadow-sm border border-seatrace-border-subtle overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-seatrace-border-subtle">
                <div>
                  <h3 className="text-sm font-bold text-seatrace-text-primary">Attribution & Drift Simulation</h3>
                  <span className="text-[10px] font-mono uppercase text-seatrace-text-muted tracking-wider">
                    REAL CASE HISTORICAL EVALUATION
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-700 font-bold">VALIDATION PHASE</span>
                </div>
              </div>
              <div className="p-5 space-y-2">
                {attributionMetrics.map((m, i) => (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-3 h-3 rounded-full border border-seatrace-text-muted flex-shrink-0" />
                      <span className="text-xs font-mono text-seatrace-text-secondary truncate">{m.label}</span>
                    </div>
                    <span className="text-[10px] font-mono text-seatrace-text-muted flex-shrink-0">{m.target}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Why It Matters ── */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.65 }}
            className="max-w-2xl mb-14"
          >
            <span className="section-overline block mb-4">OPERATIONAL IMPACT</span>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-seatrace-text-primary">
              Why structured attribution matters.
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {impactPoints.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.07 }}
                className="group p-5 rounded-xl bg-white shadow-sm border border-seatrace-border-subtle hover:border-slate-300 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-seatrace-mint flex-shrink-0" />
                  <h4 className="text-sm font-bold text-seatrace-text-primary">{item.title}</h4>
                </div>
                <p className="text-xs text-seatrace-text-secondary leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Validation;
