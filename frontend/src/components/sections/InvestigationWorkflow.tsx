import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, ShieldCheck, Compass, Ship, GitCompare, FileCheck, Activity } from 'lucide-react';

/* ================================================================
   INVESTIGATION WORKFLOW — 6-Stage Analytical Pipeline
   Translucent liquid glass pipeline with interactive stage selector
   and dynamic Lagrangian reverse-drift time scrubber.
   ================================================================ */

interface PipelineStep {
  num:         string;
  stage:       string;
  icon:        React.ElementType;
  title:       string;
  summary:     string;
  inputSource: string;
  mathFormula: string;
  threshold:   string;
  accent:      string;
}

const STEPS: PipelineStep[] = [
  {
    num:         '01',
    stage:       'DETECT',
    icon:        Scan,
    title:       'Satellite SAR Acquisition',
    summary:     'Dual-polarization C-Band radar detects surface capillary wave dampening caused by monomolecular oil films.',
    inputSource: 'Copernicus Sentinel-1 IW GRD Level-1 · 10m spatial resolution',
    mathFormula: 'Capillary backscatter reduction: Δσ₀ = σ₀_slick - σ₀_sea < -3.8 dB',
    threshold:   'Signal-to-Clutter Ratio (SCR) ≥ 4.2 dB',
    accent:      '#0284C7',
  },
  {
    num:         '02',
    stage:       'VALIDATE',
    icon:        ShieldCheck,
    title:       'Look-Alike Discrimination',
    summary:     'Multi-sensor screening eliminates low-wind calms, biogenic algal slicks, internal waves, and natural seeps.',
    inputSource: 'ECMWF ERA5 10m Wind Fields (7.2 m/s) + Sentinel-2 MSI Multi-spectral',
    mathFormula: 'Chlorophyll-a & NDVI optical cross-correlation index',
    threshold:   'False-Positive Look-Alike Rejection Confidence > 98.4%',
    accent:      '#0D9488',
  },
  {
    num:         '03',
    stage:       'RECONSTRUCT',
    icon:        Compass,
    title:       'Lagrangian Backward Drift',
    summary:     'Reverse ocean-drift ensembles model the probable discharge origin corridor and temporal release envelope.',
    inputSource: 'OpenDrift/OpenOil Engine + HYCOM 1/12° Global Hydrodynamic Reanalysis',
    mathFormula: 'd𝐱/dt = -[ 𝐮_curr(t,𝐱) + 0.03 𝐰_wind(t,𝐱) + 𝐮_stokes ] + 𝛈(K_h)',
    threshold:   '500 Particles · 72h Backward Integration · σ_ellipse < 4.2 nm',
    accent:      '#0284C7',
  },
  {
    num:         '04',
    stage:       'CORRELATE',
    icon:        Ship,
    title:       'AIS Kinematic Intersection',
    summary:     'Historical vessel trajectories are queried against the reconstructed 4D spatiotemporal release corridor.',
    inputSource: 'Spire Global Satellite & Terrestrial Class-A/B AIS Stream',
    mathFormula: 'Spatiotemporal distance metric: d_ST = ||𝐱_vessel(t) - 𝐱_drift(t)||',
    threshold:   'Trajectory Intersect Gate (Δt ≤ 2.0h, Δs ≤ 1.8 nm)',
    accent:      '#0D9488',
  },
  {
    num:         '05',
    stage:       'TEST',
    icon:        GitCompare,
    title:       'Forward Simulation Test',
    summary:     'The candidate discharge hypothesis is simulated forward to verify geometric overlap against the observed slick.',
    inputSource: 'Forward Lagrangian oil weathering: evaporation, emulsification, spreading',
    mathFormula: 'Spatial Intersection-over-Union: IoU = Area(S_sim ∩ S_obs) / Area(S_sim ∪ S_obs)',
    threshold:   'Morphological Consistency Score IoU ≥ 0.78',
    accent:      '#0284C7',
  },
  {
    num:         '06',
    stage:       'ATTEST',
    icon:        FileCheck,
    title:       'Evidence Dossier Assembly',
    summary:     'Every computational stage, raw telemetry feed, and uncertainty boundary is cryptographically compiled.',
    inputSource: 'MARPOL 73/78 Annex I Compliance · ISO/IEC 27037 Digital Custody Standard',
    mathFormula: 'Cryptographic SHA-256 Merkle Genesis Hash across all pipeline artifacts',
    threshold:   'Court-defensible evidentiary dossier with full audit trail',
    accent:      '#0D9488',
  },
];

export const InvestigationWorkflow: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(2); // Default to Lagrangian Reconstruct
  const [backtrackHours, setBacktrackHours] = useState<number>(36);

  const currentStep = STEPS[activeStage];
  const StepIcon = currentStep.icon;

  return (
    <section
      id="workflow-section"
      style={{ position: 'relative', zIndex: 1, padding: '40px 24px 80px' }}
    >
      <div style={{ maxWidth: '74rem', margin: '0 auto' }}>

        {/* ── Section Header (Translucent Glass Pill & Typography) ── */}
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 32 }}
        >
          <div
            style={{
              display:        'inline-flex',
              alignItems:     'center',
              gap:            7,
              padding:        '4px 14px',
              borderRadius:   9999,
              background:     'rgba(2, 132, 199, 0.12)',
              border:         '1px solid rgba(2, 132, 199, 0.30)',
              marginBottom:   16,
            }}
          >
            <span
              style={{
                width:        6,
                height:       6,
                borderRadius: '50%',
                background:   '#0284C7',
                boxShadow:    '0 0 8px rgba(2, 132, 199, 0.6)',
              }}
            />
            <span
              style={{
                fontFamily:    '"JetBrains Mono", monospace',
                fontSize:      9,
                fontWeight:    700,
                letterSpacing: '0.20em',
                textTransform: 'uppercase',
                color:         '#0369A1',
              }}
            >
              The Analytical Chain
            </span>
          </div>

          <h2
            style={{
              fontFamily:    '"Palatino Linotype", Palatino, "Book Antiqua", "EB Garamond", Georgia, serif',
              fontSize:      'clamp(28px, 3.4vw, 44px)',
              fontWeight:    800,
              letterSpacing: '-0.025em',
              lineHeight:    1.12,
              color:         'var(--text-primary)',
              marginBottom:  14,
            }}
          >
            From raw satellite observation{' '}
            <span style={{ color: '#0D9488' }}>to legal attribution.</span>
          </h2>

          <p
            style={{
              fontFamily:  '"Palatino Linotype", Palatino, "EB Garamond", Georgia, serif',
              fontSize:    'clamp(14px, 1.3vw, 16px)',
              lineHeight:  1.68,
              color:       'var(--text-secondary)',
              maxWidth:    680,
            }}
          >
            A mathematically rigorous, uncertainty-aware reasoning chain that moves from synthetic aperture radar detection to an attested forensic dossier — with zero black-box extrapolation.
          </p>
        </motion.div>

        {/* ── Main Liquid Glass Container ── */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="liquid-glass-strong glass-shimmer"
          style={{ padding: 'clamp(20px, 3vw, 36px)', overflow: 'hidden' }}
        >
          {/* Top Stage Buttons (Horizontal Glass Strip) */}
          <div
            style={{
              display:             'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap:                 8,
              marginBottom:        28,
            }}
          >
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isSelected = activeStage === idx;
              return (
                <button
                  key={step.num}
                  onClick={() => setActiveStage(idx)}
                  style={{
                    display:        'flex',
                    flexDirection:  'column',
                    alignItems:     'flex-start',
                    padding:        '12px 14px',
                    borderRadius:   12,
                    background:     isSelected
                      ? 'rgba(255, 255, 255, 0.95)'
                      : 'rgba(255, 255, 255, 0.45)',
                    border:         isSelected
                      ? `1.5px solid ${step.accent}`
                      : '1px solid rgba(255, 255, 255, 0.75)',
                    boxShadow:      isSelected
                      ? `0 6px 20px -4px ${step.accent}30, inset 0 1px 0 #FFFFFF`
                      : '0 2px 6px rgba(10,36,68,0.04)',
                    cursor:         'pointer',
                    transition:     'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                    textAlign:      'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 6 }}>
                    <span
                      style={{
                        fontFamily:    '"JetBrains Mono", monospace',
                        fontSize:      11,
                        fontWeight:    700,
                        color:         isSelected ? step.accent : 'var(--text-dim)',
                      }}
                    >
                      {step.num}
                    </span>
                    <Icon style={{ width: 14, height: 14, color: isSelected ? step.accent : 'var(--text-muted)' }} />
                  </div>
                  <div
                    style={{
                      fontFamily:    '"JetBrains Mono", monospace',
                      fontSize:      9,
                      fontWeight:    700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color:         isSelected ? 'var(--text-primary)' : 'var(--text-muted)',
                    }}
                  >
                    {step.stage}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Stage Technical Detail Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.num}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              style={{
                background:     'rgba(255, 255, 255, 0.70)',
                border:         '1px solid rgba(255, 255, 255, 0.90)',
                borderRadius:   18,
                padding:        '28px',
                backdropFilter: 'blur(16px)',
                boxShadow:      '0 4px 20px rgba(10,36,68,0.06)',
                marginBottom:   24,
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left overview */}
                <div className="lg:col-span-6">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div
                      style={{
                        width:          36,
                        height:         36,
                        borderRadius:   10,
                        background:     `${currentStep.accent}15`,
                        border:         `1px solid ${currentStep.accent}35`,
                        display:        'flex',
                        alignItems:     'center',
                        justifyContent: 'center',
                        color:          currentStep.accent,
                      }}
                    >
                      <StepIcon style={{ width: 18, height: 18 }} />
                    </div>
                    <div>
                      <span
                        style={{
                          fontFamily:    '"JetBrains Mono", monospace',
                          fontSize:      9.5,
                          fontWeight:    700,
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          color:         currentStep.accent,
                        }}
                      >
                        STAGE {currentStep.num} · {currentStep.stage}
                      </span>
                      <h3
                        style={{
                          fontFamily:    '"Palatino Linotype", Palatino, serif',
                          fontSize:      20,
                          fontWeight:    700,
                          color:         'var(--text-primary)',
                          lineHeight:    1.25,
                        }}
                      >
                        {currentStep.title}
                      </h3>
                    </div>
                  </div>

                  <p
                    style={{
                      fontFamily: '"Palatino Linotype", Palatino, serif',
                      fontSize:   14,
                      lineHeight: 1.68,
                      color:      'var(--text-secondary)',
                      marginBottom: 18,
                    }}
                  >
                    {currentStep.summary}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <span
                        style={{
                          fontFamily:    '"JetBrains Mono", monospace',
                          fontSize:      9,
                          fontWeight:    700,
                          color:         'var(--text-muted)',
                          textTransform: 'uppercase',
                          minWidth:      90,
                          paddingTop:    2,
                        }}
                      >
                        Telemetry Feed:
                      </span>
                      <span
                        style={{
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize:   11,
                          color:      'var(--text-primary)',
                          fontWeight: 500,
                        }}
                      >
                        {currentStep.inputSource}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <span
                        style={{
                          fontFamily:    '"JetBrains Mono", monospace',
                          fontSize:      9,
                          fontWeight:    700,
                          color:         'var(--text-muted)',
                          textTransform: 'uppercase',
                          minWidth:      90,
                          paddingTop:    2,
                        }}
                      >
                        Tolerance Gate:
                      </span>
                      <span
                        style={{
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize:   11,
                          color:      '#059669',
                          fontWeight: 600,
                        }}
                      >
                        {currentStep.threshold}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Mathematical formulation & parameters */}
                <div className="lg:col-span-6">
                  <div
                    style={{
                      background:     'rgba(240, 248, 255, 0.65)',
                      border:         '1px solid rgba(180, 210, 240, 0.50)',
                      borderRadius:   14,
                      padding:        '20px',
                    }}
                  >
                    <div
                      style={{
                        fontFamily:    '"JetBrains Mono", monospace',
                        fontSize:      9,
                        fontWeight:    700,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color:         'var(--text-muted)',
                        marginBottom:  8,
                      }}
                    >
                      Analytical Formulation
                    </div>

                    <div
                      style={{
                        fontFamily:    '"JetBrains Mono", monospace',
                        fontSize:      12.5,
                        color:         currentStep.accent,
                        fontWeight:    600,
                        padding:       '12px 14px',
                        background:    'rgba(255, 255, 255, 0.85)',
                        borderRadius:  10,
                        border:        '1px solid rgba(255, 255, 255, 0.95)',
                        marginBottom:  12,
                        overflowX:     'auto',
                      }}
                    >
                      {currentStep.mathFormula}
                    </div>

                    <div
                      style={{
                        display:        'flex',
                        alignItems:     'center',
                        justifyContent: 'space-between',
                        paddingTop:     8,
                        borderTop:      '1px solid rgba(180, 210, 240, 0.40)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Activity style={{ width: 14, height: 14, color: '#059669' }} />
                        <span
                          style={{
                            fontFamily: '"JetBrains Mono", monospace',
                            fontSize:   10,
                            color:      'var(--text-secondary)',
                            fontWeight: 600,
                          }}
                        >
                          Empirically Calibrated (NOAA / ESA)
                        </span>
                      </div>
                      <span
                        style={{
                          fontFamily:    '"JetBrains Mono", monospace',
                          fontSize:      9,
                          fontWeight:    700,
                          color:         '#059669',
                          textTransform: 'uppercase',
                        }}
                      >
                        ✓ AUDITED
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ── Interactive Lagrangian Reverse-Drift Time Scrubber ── */}
          <div
            style={{
              background:     'rgba(255, 255, 255, 0.60)',
              border:         '1px solid rgba(255, 255, 255, 0.85)',
              borderRadius:   16,
              padding:        '20px 24px',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
              <div>
                <span
                  style={{
                    fontFamily:    '"JetBrains Mono", monospace',
                    fontSize:      9.5,
                    fontWeight:    700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color:         '#0D9488',
                  }}
                >
                  Interactive Simulation Controller
                </span>
                <h4
                  style={{
                    fontFamily: '"Palatino Linotype", Palatino, serif',
                    fontSize:   15,
                    fontWeight: 700,
                    color:      'var(--text-primary)',
                  }}
                >
                  Lagrangian Backtracking Time-Horizon
                </h4>
              </div>

              <div
                style={{
                  display:      'flex',
                  alignItems:   'center',
                  gap:          12,
                  background:   'rgba(255, 255, 255, 0.80)',
                  padding:      '6px 14px',
                  borderRadius: 8,
                  border:       '1px solid rgba(255, 255, 255, 0.95)',
                }}
              >
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: 'var(--text-muted)' }}>
                  REVERSE OFFSET:
                </span>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 13, fontWeight: 700, color: '#0F766E' }}>
                  T - {backtrackHours}h 00m
                </span>
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="0"
              max="72"
              step="1"
              value={backtrackHours}
              onChange={(e) => setBacktrackHours(Number(e.target.value))}
              style={{
                width:        '100%',
                accentColor:  '#0D9488',
                cursor:       'pointer',
                marginBottom: 10,
              }}
            />

            {/* Scale markers */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: 'var(--text-dim)' }}>
              <span>T₀ (Satellite Detection)</span>
              <span>T - 24h</span>
              <span>T - 48h (Candidate Crossing)</span>
              <span>T - 72h (Max Metocean Limit)</span>
            </div>

            {/* Live readout strip based on backtrack hours */}
            <div
              style={{
                display:             'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap:                 12,
                marginTop:           16,
                paddingTop:          14,
                borderTop:           '1px solid rgba(200, 225, 240, 0.45)',
              }}
            >
              <div>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 8.5, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Origin Coordinate
                </span>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {(28.2412 - backtrackHours * 0.0084).toFixed(4)}°N, {(89.4125 - backtrackHours * 0.0112).toFixed(4)}°W
                </div>
              </div>

              <div>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 8.5, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Ensemble Envelope
                </span>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {(3.2 + backtrackHours * 0.55).toFixed(1)} km² dispersion radius
                </div>
              </div>

              <div>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 8.5, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  AIS Intersect Probability
                </span>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, fontWeight: 700, color: backtrackHours >= 30 && backtrackHours <= 42 ? '#059669' : '#0284C7' }}>
                  {backtrackHours >= 30 && backtrackHours <= 42 ? '94.2% (High Confidence)' : '18.4% (Dispersed)'}
                </div>
              </div>
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
};

export default InvestigationWorkflow;
