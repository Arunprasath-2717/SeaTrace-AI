import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Satellite,
  ScanLine,
  SlidersHorizontal,
  RotateCcw,
  Navigation2,
  FlaskConical,
  FileCheck2,
  Eye,
  Activity,
  Layers,
  Radio,
  CheckCircle2,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Separator } from '../ui/Separator';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

/* ================================================================
   INVESTIGATION PIPELINE — Powered by shadcn UI Components
   ────────────────────────────────────────────────────────
   - Pure shadcn UI Card, CardHeader, CardTitle, CardDescription, CardContent
   - shadcn UI Badge with color-coded telemetry variants
   - shadcn UI Separator & Button
   - Interactive pipeline filter via shadcn UI Tabs
   - High-contrast Palatino Linotype typography with increased font sizes
   ================================================================ */

interface PipelineCard {
  badge: string;
  title: string;
  desc: string;
  metric: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

interface PipelineStep {
  id: string;
  phase: string;
  tag: string;
  title: string;
  summary: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  accent: string;
  badgeVariant: 'ocean' | 'teal' | 'purple' | 'amber' | 'success' | 'pink' | 'neutral';
  cards: PipelineCard[];
}

const STEPS: PipelineStep[] = [
  {
    id: 'step-observe',
    phase: '01',
    tag: 'Orbital Acquisition',
    title: 'Satellite Radar Surveillance',
    summary:
      'SAR constellations scan maritime corridors through clouds and night, measuring ocean capillary wave dampening to detect surface anomalies.',
    icon: Satellite,
    accent: '#38BDF8',
    badgeVariant: 'ocean',
    cards: [
      {
        badge: 'Wide-Swath SAR',
        title: 'C-Band & X-Band Capture',
        desc: 'Wide-area backscatter capture across global shipping lanes at 10m spatial resolution.',
        metric: '10m / 250km Swath',
        icon: Satellite,
      },
      {
        badge: 'Surface Analysis',
        title: 'Backscatter Attenuation',
        desc: 'Detects regions where dielectric surface tension suppresses capillary ripple reflections.',
        metric: 'SNR +18.4 dB',
        icon: Eye,
      },
    ],
  },
  {
    id: 'step-detect',
    phase: '02',
    tag: 'Pattern Recognition',
    title: 'Candidate Slick Extraction',
    summary:
      'Multi-scale segmentation models identify low-backscatter geometries and delineate candidate slick polygon boundaries from raw SAR imagery.',
    icon: ScanLine,
    accent: '#2DD4BF',
    badgeVariant: 'teal',
    cards: [
      {
        badge: 'Segmentation',
        title: 'Feature Extraction',
        desc: 'Multi-scale convolutional analysis filters natural oceanic noise from concentrated discharge.',
        metric: 'Confidence: 94.8%',
        icon: ScanLine,
      },
      {
        badge: 'Vector Boundary',
        title: 'Delineated Polygon',
        desc: 'Geometric polygon footprint with perimeter metrics, area quantification, and timestamps.',
        metric: 'Area: 4.82 km²',
        icon: Layers,
      },
    ],
  },
  {
    id: 'step-validate',
    phase: '03',
    tag: 'Verification & Validation',
    title: 'False Positive Elimination',
    summary:
      'A dark radar patch is never assumed to be oil. Validated against sensor parameters, look-alikes, and meteoceanic thresholds.',
    icon: SlidersHorizontal,
    accent: '#A78BFA',
    badgeVariant: 'purple',
    cards: [
      {
        badge: 'Sensor Geometry',
        title: 'Image Quality Check',
        desc: 'Radar incidence angle (20°–45°), sensor noise floor, and speckle filter convergence.',
        metric: 'Incidence: 34.2°',
        icon: SlidersHorizontal,
      },
      {
        badge: 'Discrimination',
        title: 'Look-Alike Mitigation',
        desc: 'Exclusion of algal blooms, low-wind calm water shadows, and biogenic false positives.',
        metric: 'Biogenic: Rejected',
        icon: Activity,
      },
      {
        badge: 'Meteoceanic',
        title: 'Environmental Envelope',
        desc: 'Surface wind within 3–12 m/s with verified Copernicus current alignment.',
        metric: 'Wind: 6.8 m/s OK',
        icon: Radio,
      },
    ],
  },
  {
    id: 'step-reconstruct',
    phase: '04',
    tag: 'Drift Physics',
    title: 'Origin Reconstruction',
    summary:
      'Hydrodynamic Lagrangian drift models integrate surface currents, atmospheric wind forcing, and Stokes drift backward to locate the release origin.',
    icon: RotateCcw,
    accent: '#FBBF24',
    badgeVariant: 'amber',
    cards: [
      {
        badge: 'Observed Footprint',
        title: 'Target Slick Footprint',
        desc: 'Calibrated radar polygon boundary captured at verified satellite timestamp T₀.',
        metric: 'Capture: 06:14 UTC',
        icon: Layers,
      },
      {
        badge: 'Backtracking',
        title: 'Reverse Drift Physics',
        desc: 'Ensemble backward advection accounting for ocean shear, tide, and windage.',
        metric: 'ΔT: -7.5 Hours',
        icon: RotateCcw,
      },
      {
        badge: 'Output Envelope',
        title: 'Probable Origin Zone',
        desc: 'High-probability spatiotemporal envelope defining release window and coordinates.',
        metric: 'p(Origin) > 0.92',
        icon: CheckCircle2,
      },
    ],
  },
  {
    id: 'step-correlate',
    phase: '05',
    tag: 'AIS Telemetry',
    title: 'Vessel Trajectory Correlation',
    summary:
      'Historical AIS vessel transponder positions cross-referenced against the probable release zone and time window to identify compatible traffic.',
    icon: Navigation2,
    accent: '#34D399',
    badgeVariant: 'success',
    cards: [
      {
        badge: 'Spatiotemporal Filter',
        title: 'Origin Window Search',
        desc: 'Query envelope from backward drift physics targeting candidate transit paths.',
        metric: '±12 nm corridor',
        icon: Radio,
      },
      {
        badge: 'AIS Telemetry',
        title: 'Vessel Trajectories',
        desc: 'Transponder broadcasts filtered by speed, course changes, draught, and maneuvers.',
        metric: '42 Vessels Audited',
        icon: Navigation2,
      },
      {
        badge: 'Ranked Candidates',
        title: 'Compatible Attribution',
        desc: 'Ranked candidates showing exact closest point of approach (CPA) and time overlap.',
        metric: 'CPA: 0.18 nm',
        icon: ShieldCheck,
      },
    ],
  },
  {
    id: 'step-test',
    phase: '06',
    tag: 'Forward Simulation',
    title: 'Counterfactual Verification',
    summary:
      'Forward simulation verifies the hypothesis: if this vessel discharged at this time and position, would it produce the observed satellite slick?',
    icon: FlaskConical,
    accent: '#F472B6',
    badgeVariant: 'pink',
    cards: [
      {
        badge: 'Hypothesis Release',
        title: 'Candidate Discharge',
        desc: 'Simulated release from candidate vessel trajectory using standard discharge volume parameters.',
        metric: 'Release: 02:45 UTC',
        icon: FlaskConical,
      },
      {
        badge: 'Forward Physics',
        title: 'Forward Drift Modeling',
        desc: 'Advection under actual meteoceanic wind and surface current velocity fields.',
        metric: 'Velocity: +3.5 kts',
        icon: Activity,
      },
      {
        badge: 'Observed Match',
        title: 'Geometric Verification',
        desc: 'Spatial IoU overlap score comparing simulated forward slick with satellite observation.',
        metric: 'IoU Score: 0.88',
        icon: CheckCircle2,
      },
    ],
  },
  {
    id: 'step-evidence',
    phase: '07',
    tag: 'Auditable Dossier',
    title: 'Evidentiary Package',
    summary:
      'Every observation, physical drift calculation, and AIS track synthesized into an immutable, court-ready maritime investigation dossier.',
    icon: FileCheck2,
    accent: '#38BDF8',
    badgeVariant: 'ocean',
    cards: [
      {
        badge: 'Evidentiary Chain',
        title: 'Immutable Audit Trail',
        desc: 'Cryptographically hashed timeline from raw SAR backscatter to hydrodynamic verification.',
        metric: 'SHA-256 Hashed',
        icon: ShieldCheck,
      },
      {
        badge: 'Legal Dossier',
        title: 'Enforcement Package',
        desc: 'Court-admissible PDF dossier compiled under UNCLOS Article 217 forensic standards.',
        metric: 'Status: Court-Ready',
        icon: FileCheck2,
      },
    ],
  },
];

export const WorkflowTimeline: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Filter steps based on selected pipeline stage tab
  const filteredSteps = STEPS.filter((step) => {
    if (activeFilter === 'detection') return step.phase === '01' || step.phase === '02';
    if (activeFilter === 'physics') return step.phase === '03' || step.phase === '04';
    if (activeFilter === 'attribution') return step.phase === '05' || step.phase === '06' || step.phase === '07';
    return true;
  });

  return (
    <section
      id="workflow"
      className="relative z-10 py-28 px-6 bg-transparent"
      style={{
        fontFamily: '"Palatino Linotype", "Book Antiqua", Palatino, Georgia, serif',
      }}
    >
      {/* Subtle top divider line matching landing page design */}
      <div
        aria-hidden
        className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-white/10"
      />

      <div className="max-w-6xl mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 text-center md:text-left flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <Badge variant="ocean" className="px-3.5 py-1 text-xs">
                <Compass className="w-3.5 h-3.5 mr-1 text-sky-400" />
                Investigation Pipeline
              </Badge>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 max-w-2xl leading-tight">
              How Maritime Attribution Works
            </h2>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed">
              A rigorous, physically-grounded forensic pipeline — from orbital radar backscatter to verified,
              court-ready maritime vessel attribution.
            </p>
          </div>

          {/* Interactive shadcn Tabs Filter */}
          <div className="flex justify-center md:justify-end">
            <Tabs value={activeFilter} onValueChange={setActiveFilter}>
              <TabsList className="bg-slate-950/70 border border-white/15 backdrop-blur-xl p-1 shadow-lg">
                <TabsTrigger value="all" className="text-xs font-semibold px-3 py-1.5">
                  All 7 Phases
                </TabsTrigger>
                <TabsTrigger value="detection" className="text-xs font-semibold px-3 py-1.5">
                  Detection (01–02)
                </TabsTrigger>
                <TabsTrigger value="physics" className="text-xs font-semibold px-3 py-1.5">
                  Physics (03–04)
                </TabsTrigger>
                <TabsTrigger value="attribution" className="text-xs font-semibold px-3 py-1.5">
                  Attribution (05–07)
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </motion.div>

        <Separator className="mb-16 bg-white/10" />

        {/* ── Connected Timeline Structure ── */}
        <div className="relative pl-10 md:pl-16">
          {/* Continuous Vertical Spine */}
          <div
            aria-hidden
            className="absolute top-4 bottom-10 left-3 md:left-5 w-[2px] bg-gradient-to-b from-sky-400 via-teal-400 to-indigo-400 rounded-full opacity-80"
          />

          <div className="flex flex-col gap-20">
            {filteredSteps.map((step) => {
              const StepIcon = step.icon;
              return (
                <div key={step.id} id={step.id} className="relative">
                  {/* Timeline Stage Node */}
                  <div
                    className="absolute -left-10 md:-left-16 top-1 w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-950/90 border-2 flex items-center justify-center z-10 shadow-lg backdrop-blur-md"
                    style={{
                      borderColor: step.accent,
                      boxShadow: `0 0 16px ${step.accent}55, 0 0 0 4px rgba(10, 25, 53, 0.85)`,
                    }}
                  >
                    <StepIcon className="w-4 h-4 md:w-5 md:h-5" style={{ color: step.accent }} />
                  </div>

                  {/* Step Header */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-7"
                  >
                    <div className="flex items-center gap-3 mb-2.5">
                      <Badge variant={step.badgeVariant} className="px-3 py-0.5 text-xs font-bold">
                        Phase {step.phase}
                      </Badge>
                      <Separator orientation="vertical" className="h-3.5 bg-white/20" />
                      <span className="text-xs font-mono font-medium tracking-wider text-slate-400 uppercase">
                        {step.tag}
                      </span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold text-white leading-snug mb-3">
                      {step.title}
                    </h3>
                    <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">
                      {step.summary}
                    </p>
                  </motion.div>

                  {/* Cards Grid — Structured with shadcn UI Card */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {step.cards.map((card, ci) => {
                      const CardIcon = card.icon;
                      return (
                        <motion.div
                          key={card.title}
                          initial={{ opacity: 0, y: 16 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: '-40px' }}
                          transition={{
                            duration: 0.45,
                            delay: ci * 0.08,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        >
                          <Card
                            hover
                            className="h-full bg-slate-950/65 border border-white/10 hover:border-white/20 shadow-xl backdrop-blur-2xl rounded-2xl flex flex-col justify-between"
                          >
                            <CardHeader className="p-5 pb-3">
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <Badge variant="neutral" className="text-[11px] font-mono text-slate-300 bg-white/10 border-white/15">
                                  {card.badge}
                                </Badge>
                                {card.metric && (
                                  <Badge
                                    variant="outline"
                                    className="text-[11px] font-mono font-bold border-white/20 text-sky-300 bg-white/5"
                                  >
                                    {card.metric}
                                  </Badge>
                                )}
                              </div>

                              <div className="flex items-center gap-3 pt-1">
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border"
                                  style={{
                                    backgroundColor: `${step.accent}20`,
                                    borderColor: `${step.accent}40`,
                                  }}
                                >
                                  <CardIcon className="w-4 h-4" style={{ color: step.accent }} />
                                </div>
                                <CardTitle className="text-lg font-bold text-white">
                                  {card.title}
                                </CardTitle>
                              </div>
                            </CardHeader>

                            <CardContent className="p-5 pt-1">
                              <CardDescription className="text-[15.5px] leading-relaxed text-slate-300/90">
                                {card.desc}
                              </CardDescription>

                              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
                                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                                </span>
                                <span>Phase {step.phase} Telemetry</span>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowTimeline;
