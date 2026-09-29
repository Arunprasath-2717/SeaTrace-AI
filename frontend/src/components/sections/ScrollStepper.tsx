import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, ScanLine, RotateCcw, Link2, FileCheck, CheckCircle2, ChevronRight } from 'lucide-react';

/* ================================================================
   STRATEGIC CARD 1: SCROLL-DRIVEN WORKFLOW STEPPER
   Exact 30% opacity transparent glass with water-like refraction,
   caustic light rim, smooth progress indication, and snap-to-step behavior.
   Typography: H2 32-40px, H3 24px, Dark Gradient + Pure Black #000000
   ================================================================ */

interface StepData {
  step: string;
  code: string;
  title: string;
  subtitle: string;
  desc: string;
  icon: React.ComponentType<{ style?: React.CSSProperties; className?: string }>;
  telemetry: { label: string; value: string }[];
  highlight: string;
}

const WORKFLOW_STEPS: StepData[] = [
  {
    step: '01',
    code: 'OBS-SAR',
    title: 'Satellite Radar Observation',
    subtitle: 'High-aperture SAR acquisition over maritime corridors',
    desc: 'Automated satellite scheduling downloads Sentinel-1 C-band radar and Radarsat Constellation imagery, capturing ocean-surface roughness unaffected by clouds or nighttime darkness.',
    icon: Eye,
    telemetry: [
      { label: 'Sensor Mode', value: 'Interferometric Wide (IW)' },
      { label: 'Polarization', value: 'VV + VH Cross-Pol' },
      { label: 'Pixel Spacing', value: '10m × 10m' },
      { label: 'Swath Width', value: '250 km' },
    ],
    highlight: 'Captures specular reflection dampening where surface oil dampens capillary waves.',
  },
  {
    step: '02',
    code: 'DET-SEGM',
    title: 'Candidate Slick Segmentation',
    subtitle: 'Deep neural segmentation of low-backscatter formations',
    desc: 'Convolutional neural networks segment anomalous dark formations, isolating true hydrocarbon sheens from natural biogenic slicks, grease ice, and low-wind shadows.',
    icon: ScanLine,
    telemetry: [
      { label: 'Model Confidence', value: '98.4% (Hydrocarbon)' },
      { label: 'Min Wind Speed', value: '3.2 m/s (Valid)' },
      { label: 'Area Extent', value: '14.82 km²' },
      { label: 'Perimeter Shape', value: 'High Elongation Ratio' },
    ],
    highlight: 'Filters out 94% of false positives caused by calm sea surfaces or algal blooms.',
  },
  {
    step: '03',
    code: 'REV-DRIFT',
    title: 'Oceanic Origin Reconstruction',
    subtitle: 'Backward Lagrangian drift modeling through hydrodynamic currents',
    desc: 'Reverses time through CMEMS oceanic reanalysis currents and ECMWF 10m surface winds, calculating the spatiotemporal probability distribution of where the discharge first occurred.',
    icon: RotateCcw,
    telemetry: [
      { label: 'Currents Model', value: 'Copernicus CMEMS 1/12°' },
      { label: 'Atmospheric Wind', value: 'ECMWF ERA5 High-Res' },
      { label: 'Temporal Horizon', value: '-36.4 Hours' },
      { label: 'Origin Radius', value: '3.8 km (95% CI)' },
    ],
    highlight: 'Pinpoints the exact historical coordinates where the discharge entered the water column.',
  },
  {
    step: '04',
    code: 'AIS-CORR',
    title: 'AIS Trajectory Spatiotemporal Match',
    subtitle: 'Correlating historical transponder tracks with the origin zone',
    desc: 'Cross-examines terrestrial and satellite AIS logs to determine which vessels traversed the origin window at the exact estimated discharge timestamp, analyzing speed deviations and loitering.',
    icon: Link2,
    telemetry: [
      { label: 'Vessels Evaluated', value: '148 in AOI' },
      { label: 'Temporal Window', value: '±90 Minutes' },
      { label: 'Course Alterations', value: '2 Notable Deviations' },
      { label: 'Candidate Rank', value: '1 Primary Target' },
    ],
    highlight: 'Identifies vessel MMSI, flag state, and velocity changes consistent with deliberate bilge release.',
  },
  {
    step: '05',
    code: 'EVID-PACK',
    title: 'Evidentiary Dossier Assembly',
    subtitle: 'Court-admissible forensic documentation and chain of custody',
    desc: 'Generates an immutable evidentiary package combining radar imagery, forward simulation cross-checks, and AIS telemetry ready for port authorities and international maritime tribunals.',
    icon: FileCheck,
    telemetry: [
      { label: 'Dossier Format', value: 'UNCLOS Compliant' },
      { label: 'Simulation Match', value: 'R² = 0.942' },
      { label: 'Audit Hash', value: 'SHA-256 Verified' },
      { label: 'Export Ready', value: 'PDF + GeoJSON + NetCDF' },
    ],
    highlight: 'Delivers transparent, peer-reviewed attribution evidence without speculation.',
  },
];

export const ScrollStepper: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      setActiveStep(prev => Math.min(WORKFLOW_STEPS.length - 1, prev + 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      setActiveStep(prev => Math.max(0, prev - 1));
    }
  };

  const current = WORKFLOW_STEPS[activeStep];
  const Icon = current.icon;
  const progressPercent = ((activeStep + 1) / WORKFLOW_STEPS.length) * 100;

  return (
    <section
      id="workflow"
      ref={containerRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{
        padding: '100px 36px',
        position: 'relative',
        zIndex: 1,
        outline: 'none',
      }}
    >
      <div
        style={{
          maxWidth: '88rem',
          margin: '0 auto',
        }}
      >
        {/* Section Header: Card-less Grid Typography */}
        <div style={{ marginBottom: '48px', maxWidth: '720px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#0D9488',
              marginBottom: '12px',
            }}
          >
            <span>Functional Workflow Stepper</span>
            <span>·</span>
            <span>01 through 05</span>
          </div>

          <h2
            className="h2-section"
            style={{
              marginBottom: '16px',
            }}
          >
            <span className="text-dark-gradient">Precision Attribution Pipeline</span>
          </h2>

          <p
            className="text-secondary-section"
            style={{
              fontSize: '15px',
              lineHeight: 1.6,
              fontWeight: 600,
              opacity: 0.9,
            }}
          >
            An end-to-end scientific methodology transforming raw radar observations into verified forensic evidence.
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════
            STRATEGIC CARD 1: 30% Translucent Refractive Glass
            Realistic water-like refraction, caustic rim, interactive tabs
            ═════════════════════════════════════════════════════ */}
        <div
          className="glass-card-30"
          style={{
            padding: '36px 40px',
            boxShadow: '0 24px 60px -15px rgba(13, 148, 136, 0.20), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
          }}
        >
          {/* Top Progress Track */}
          <div style={{ marginBottom: '32px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#0F766E',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Progress: Stage {current.step} of 05 ({current.code})
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#007EA7',
                }}
              >
                {Math.round(progressPercent)}% Complete
              </span>
            </div>

            {/* Smooth Track with Mint Foam Indicator */}
            <div
              style={{
                height: '5px',
                width: '100%',
                borderRadius: '9999px',
                background: 'rgba(9, 30, 47, 0.10)',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <motion.div
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #0D9488 0%, #00A8E8 50%, #2DD4BF 100%)',
                  borderRadius: '9999px',
                  boxShadow: '0 0 12px rgba(45, 212, 191, 0.8)',
                }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              />
            </div>
          </div>

          {/* Stepper Tabs Bar: Snap-to-step selector */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '12px',
              marginBottom: '36px',
            }}
          >
            {WORKFLOW_STEPS.map((s, idx) => {
              const StepIcon = s.icon;
              const isActive = idx === activeStep;
              const isPast = idx < activeStep;

              return (
                <button
                  key={s.step}
                  onClick={() => setActiveStep(idx)}
                  style={{
                    background: isActive
                      ? 'rgba(255, 255, 255, 0.65)'
                      : 'rgba(255, 255, 255, 0.15)',
                    border: isActive
                      ? '1.5px solid rgba(45, 212, 191, 0.85)'
                      : '1px solid rgba(13, 148, 136, 0.20)',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
                    textAlign: 'left',
                    boxShadow: isActive
                      ? '0 6px 20px rgba(13, 148, 136, 0.18)'
                      : 'none',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: isActive
                        ? 'linear-gradient(135deg, #0D9488, #2DD4BF)'
                        : isPast
                        ? 'rgba(45, 212, 191, 0.20)'
                        : 'rgba(9, 30, 47, 0.06)',
                      color: isActive ? '#FFFFFF' : isPast ? '#0D9488' : '#0F2F4A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontWeight: 700,
                      fontSize: '13px',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {isPast ? <CheckCircle2 style={{ width: 16, height: 16 }} /> : <StepIcon style={{ width: 16, height: 16 }} />}
                  </div>

                  <div style={{ overflow: 'hidden' }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        color: isActive ? '#0D9488' : '#0F766E',
                        textTransform: 'uppercase',
                      }}
                    >
                      {s.code}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '13px',
                        fontWeight: isActive ? 700 : 600,
                        color: '#091E2F',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {s.title.split(' ')[0]}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Step Showcase: Staggered reveal & telemetry display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: [0.1, 0.9, 0.2, 1] }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gap: '36px',
                alignItems: 'center',
              }}
            >
              {/* Left Detail Description */}
              <div style={{ gridColumn: 'span 12' }} className="lg:!col-span-7">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '14px',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, rgba(0, 168, 232, 0.20), rgba(45, 212, 191, 0.35))',
                      border: '1px solid rgba(45, 212, 191, 0.50)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0D9488',
                    }}
                  >
                    <Icon style={{ width: 20, height: 20 }} />
                  </div>
                  <div>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        color: '#0F766E',
                        textTransform: 'uppercase',
                      }}
                    >
                      Stage {current.step} · Forensic Pipeline
                    </span>
                    <h3
                      className="h3-feature"
                      style={{
                        margin: 0,
                      }}
                    >
                      <span className="text-dark-gradient">{current.title}</span>
                    </h3>
                  </div>
                </div>

                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '14.5px',
                    fontWeight: 600,
                    color: '#007EA7',
                    marginBottom: '12px',
                  }}
                >
                  {current.subtitle}
                </p>

                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '15px',
                    lineHeight: 1.6,
                    color: '#091E2F',
                    marginBottom: '20px',
                  }}
                  className="text-dark-gradient"
                >
                  {current.desc}
                </p>

                {/* Highlight callout with caustic mint accent */}
                <div
                  style={{
                    padding: '14px 18px',
                    borderRadius: '10px',
                    background: 'rgba(45, 212, 191, 0.12)',
                    borderLeft: '3px solid #0D9488',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <span className="text-secondary-section" style={{ fontSize: '13px', fontWeight: 600 }}>
                    💡 {current.highlight}
                  </span>
                </div>
              </div>

              {/* Right Telemetry Matrix */}
              <div style={{ gridColumn: 'span 12' }} className="lg:!col-span-5">
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.40)',
                    border: '1px solid rgba(45, 212, 191, 0.40)',
                    borderRadius: '14px',
                    padding: '24px',
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.60)',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      color: '#0F766E',
                      textTransform: 'uppercase',
                      marginBottom: '16px',
                      borderBottom: '1px solid rgba(13, 148, 136, 0.18)',
                      paddingBottom: '8px',
                    }}
                  >
                    Telemetry & Diagnostic Metrics
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '16px',
                    }}
                  >
                    {current.telemetry.map((t, i) => (
                      <div key={i}>
                        <div
                          className="text-secondary-section"
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                            marginBottom: '4px',
                          }}
                        >
                          {t.label}
                        </div>
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '14px',
                            fontWeight: 700,
                            color: '#091E2F',
                          }}
                        >
                          {t.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Navigation controls */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '24px',
                      paddingTop: '16px',
                      borderTop: '1px solid rgba(13, 148, 136, 0.18)',
                    }}
                  >
                    <button
                      onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                      disabled={activeStep === 0}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '9999px',
                        background: 'transparent',
                        border: '1px solid rgba(9, 30, 47, 0.20)',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: activeStep === 0 ? 'not-allowed' : 'pointer',
                        opacity: activeStep === 0 ? 0.35 : 1,
                        color: '#091E2F',
                      }}
                    >
                      ← Previous
                    </button>

                    <button
                      onClick={() => setActiveStep(prev => Math.min(WORKFLOW_STEPS.length - 1, prev + 1))}
                      disabled={activeStep === WORKFLOW_STEPS.length - 1}
                      style={{
                        padding: '6px 16px',
                        borderRadius: '9999px',
                        background: 'linear-gradient(135deg, #0D9488, #00A8E8)',
                        border: 'none',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: activeStep === WORKFLOW_STEPS.length - 1 ? 'not-allowed' : 'pointer',
                        opacity: activeStep === WORKFLOW_STEPS.length - 1 ? 0.35 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>Next Stage</span>
                      <ChevronRight style={{ width: 14, height: 14 }} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ScrollStepper;
