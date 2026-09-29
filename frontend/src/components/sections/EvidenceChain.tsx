import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, ChevronDown } from 'lucide-react';

/* ================================================================
   EVIDENCE CHAIN — Immutable Forensic Provenance Chain
   Glass strong outer panel. Horizontal step navigator.
   Expandable detail per step.
   ================================================================ */

const STEPS = [
  {
    step: '01', label: 'Satellite',  badge: 'VERIFIED',
    title:   'Satellite Observation',
    source:  'Copernicus Sentinel-1A C-Band SAR',
    ts:      '14:22:10 UTC',
    model:   'IW Mode, Level-1 GRD, 10 m resolution',
    result:  '14.8 km² surface capillary dampening delineated.',
    unc:     'Wind speed 6.4 m/s; resolution ±10 m.',
    status:  'complete' as const,
  },
  {
    step: '02', label: 'AI',         badge: 'VERIFIED',
    title:   'AI Detection & Segmentation',
    source:  'DeepSlick-SAR Neural Network',
    ts:      '14:25:30 UTC',
    model:   'ResNet50-UNet++ with dual-polarization input',
    result:  'Mineral oil probability score: 0.94.',
    unc:     'Model FP estimate <3.2% in coastal waters.',
    status:  'complete' as const,
  },
  {
    step: '03', label: 'Validation', badge: 'VERIFIED',
    title:   'Look-Alike Validation',
    source:  'ECMWF ERA5 & Sentinel-2 Optical Proxy',
    ts:      '14:30:15 UTC',
    model:   'Metocean Consistency Screening Protocol',
    result:  'Algae, biogenic film, and wind calm excluded.',
    unc:     'Confidence 0.92; no optical occlusion.',
    status:  'complete' as const,
  },
  {
    step: '04', label: 'Origin',     badge: 'VERIFIED',
    title:   'Origin Reconstruction',
    source:  'HYCOM 1/12° + OpenDrift/OpenOil',
    ts:      '14:38:00 UTC',
    model:   'Lagrangian backward drift, 500 particles, 72 h',
    result:  'Probable origin: 28.46°N, 90.23°W. Window: 13:45–14:30 UTC.',
    unc:     'Origin uncertainty radius: 2.8 km (±12.5% ensemble variance).',
    status:  'complete' as const,
  },
  {
    step: '05', label: 'AIS',        badge: 'ACTIVE',
    title:   'AIS Kinematic Correlation',
    source:  'Spire Global Terrestrial + Satellite AIS',
    ts:      '14:45:00 UTC',
    model:   'Spatiotemporal Trajectory Intersection Index',
    result:  'Candidate vessel intersected origin corridor at 14:15 UTC.',
    unc:     'AIS signal integrity verified; max gap 12 min.',
    status:  'active' as const,
  },
  {
    step: '06', label: 'Simulation', badge: 'ACTIVE',
    title:   'Counterfactual Forward Simulation',
    source:  'OpenOil Hydrodynamic Forward Engine',
    ts:      '14:52:00 UTC',
    model:   'Forward Lagrangian from candidate position',
    result:  'IoU match score: 84.2% against SAR observation.',
    unc:     'Centroid displacement: 0.65 km from observed center.',
    status:  'active' as const,
  },
  {
    step: '07', label: 'Synthesis',  badge: 'PENDING',
    title:   'Weight-of-Evidence Synthesis',
    source:  'Forensic Bayesian Evidence Engine',
    ts:      '15:00:00 UTC',
    model:   'Multi-criteria evidential synthesis',
    result:  'High compatibility: trajectory supports hypothesis.',
    unc:     'Alternative vessels: 2 ruled out (temporal mismatch).',
    status:  'pending' as const,
  },
  {
    step: '08', label: 'Review',     badge: 'PENDING',
    title:   'Human Review & Legal Attestation',
    source:  'Investigator Workbench + SHA-256 Custody Ledger',
    ts:      '15:15:00 UTC',
    model:   'MARPOL Annex I certified dossier generation',
    result:  'Cryptographic hash generated. Awaiting sign-off.',
    unc:     'Requires human investigator formal attestation.',
    status:  'pending' as const,
  },
];

const STATUS = {
  complete: { dot: '#0D9488', badge: '#0D9488', bg: 'rgba(13,148,136,0.10)', label: 'rgba(13,148,136,0.90)', glow: 'rgba(13,148,136,0.45)' },
  active:   { dot: '#0891B2', badge: '#0891B2', bg: 'rgba(8,145,178,0.10)',  label: 'rgba(8,145,178,0.90)',  glow: 'rgba(8,145,178,0.45)' },
  pending:  { dot: 'rgba(12,40,90,0.28)', badge: 'rgba(12,40,90,0.40)', bg: 'rgba(255,255,255,0.35)', label: 'rgba(12,40,90,0.45)', glow: 'none' },
};

export const EvidenceChain: React.FC = () => {
  const [expanded, setExpanded] = useState<number | null>(4);

  return (
    <section
      id="evidence-section"
      style={{ position: 'relative', zIndex: 1, padding: '0 24px' }}
    >
      <div style={{ maxWidth: '64rem', margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 32, textAlign: 'center' }}
        >
          <div
            style={{
              display:        'inline-flex',
              alignItems:     'center',
              gap:            6,
              padding:        '4px 14px',
              borderRadius:   9999,
              background:     'rgba(13,148,136,0.12)',
              border:         '1px solid rgba(13,148,136,0.30)',
              backdropFilter: 'blur(16px)',
              marginBottom:   18,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2DD4BF', animation: 'pulse-dot 2s infinite' }} />
            <span
              style={{
                fontFamily:    '"JetBrains Mono", monospace',
                fontSize:      9,
                fontWeight:    700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color:         '#0F766E',
              }}
            >
              Provenance & Auditability
            </span>
          </div>

          <h2
            style={{
              fontFamily:    '"Palatino Linotype", Palatino, "Book Antiqua", "EB Garamond", Georgia, serif',
              fontSize:      'clamp(26px, 3.2vw, 42px)',
              fontWeight:    800,
              letterSpacing: '-0.025em',
              lineHeight:    1.08,
              color:         'var(--text-primary)',
              marginBottom:  14,
            }}
          >
            Every conclusion{' '}
            <span style={{ color: '#0D9488' }}>has a trail.</span>
          </h2>
          <p
            style={{
              fontFamily:  '"Palatino Linotype", Palatino, serif',
              fontSize:    'clamp(13px, 1.2vw, 15px)',
              lineHeight:  1.65,
              color:       'var(--text-secondary)',
              maxWidth:    560,
              margin:      '0 auto',
            }}
          >
            Every step — inputs, model, uncertainty bounds — is recorded in an immutable forensic chain.
          </p>
        </motion.div>

        {/* Step navigator tabs — glass strip */}
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.60, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="liquid-glass"
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            padding:             6,
            gap:                 4,
            marginBottom:        12,
          }}
        >
          {STEPS.map((s, i) => {
            const st  = STATUS[s.status];
            const sel = expanded === i;
            return (
              <button
                key={s.step}
                onClick={() => setExpanded(sel ? null : i)}
                style={{
                  display:        'flex',
                  flexDirection:  'column',
                  alignItems:     'center',
                  gap:            5,
                  padding:        '10px 4px',
                  borderRadius:   12,
                  cursor:         'pointer',
                  border:         sel ? `1px solid ${st.badge}30` : '1px solid transparent',
                  background:     sel ? st.bg : 'transparent',
                  transition:     'all 0.20s ease',
                }}
              >
                <div
                  style={{
                    width:        8,
                    height:       8,
                    borderRadius: '50%',
                    background:   st.dot,
                    boxShadow:    s.status !== 'pending' ? `0 0 6px ${st.glow}` : 'none',
                  }}
                />
                <span
                  style={{
                    fontFamily:    '"JetBrains Mono", monospace',
                    fontSize:      8,
                    fontWeight:    700,
                    letterSpacing: '0.10em',
                    textTransform: 'uppercase',
                    color:         sel ? st.label : 'rgba(12,40,90,0.45)',
                    textAlign:     'center',
                    lineHeight:    1.2,
                  }}
                >
                  {s.label}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Expandable chain */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }}>
          {/* Spine */}
          <div
            style={{
              position:   'absolute',
              left:       20,
              top:        12,
              bottom:     12,
              width:      2,
              background: 'linear-gradient(180deg, rgba(13,148,136,0.40) 0%, rgba(8,145,178,0.20) 60%, rgba(255,255,255,0.08) 100%)',
              borderRadius: 1,
              zIndex:     0,
            }}
          />

          {STEPS.map((step, i) => {
            const isExp = expanded === i;
            const st    = STATUS[step.status];
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.38, delay: i * 0.04 }}
                style={{ position: 'relative', paddingLeft: 44, zIndex: 1 }}
              >
                {/* Spine dot */}
                <div
                  style={{
                    position:   'absolute',
                    left:       15,
                    top:        '50%',
                    transform:  'translateY(-50%)',
                    width:      10,
                    height:     10,
                    borderRadius: '50%',
                    background:   st.dot,
                    border:       '2px solid rgba(235,245,255,1)',
                    boxShadow:    step.status !== 'pending' ? `0 0 8px ${st.glow}` : 'none',
                    zIndex:       2,
                  }}
                />

                <div
                  className="liquid-glass"
                  style={{
                    overflow:   'hidden',
                    cursor:     'pointer',
                    border:     isExp ? `1px solid ${st.badge}28` : '1px solid rgba(255,255,255,0.58)',
                    boxShadow:  isExp
                      ? `0 8px 40px rgba(10,40,100,0.14), inset 0 1.5px 0 rgba(255,255,255,0.85)`
                      : '0 4px 20px rgba(10,40,100,0.09), inset 0 1px 0 rgba(255,255,255,0.65)',
                  }}
                  onClick={() => setExpanded(isExp ? null : i)}
                >
                  {/* Header row */}
                  <div
                    style={{
                      display:    'flex',
                      alignItems: 'center',
                      gap:        12,
                      padding:    '14px 18px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily:    '"JetBrains Mono", monospace',
                        fontSize:      12,
                        fontWeight:    700,
                        color:         'rgba(12,40,90,0.35)',
                        flexShrink:    0,
                        width:         24,
                      }}
                    >
                      {step.step}
                    </span>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <h3
                          style={{
                            fontFamily:    '"Palatino Linotype", Palatino, serif',
                            fontSize:      13,
                            fontWeight:    700,
                            color:         'rgba(8,20,50,0.88)',
                            letterSpacing: '-0.005em',
                          }}
                        >
                          {step.title}
                        </h3>
                        <span
                          style={{
                            fontFamily:    '"JetBrains Mono", monospace',
                            fontSize:      8,
                            fontWeight:    700,
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                            color:         st.label,
                            background:    st.bg,
                            border:        `1px solid ${st.badge}28`,
                            padding:       '2px 7px',
                            borderRadius:  9999,
                            flexShrink:    0,
                          }}
                        >
                          {step.badge}
                        </span>
                      </div>
                      <span
                        style={{
                          fontFamily:  '"JetBrains Mono", monospace',
                          fontSize:    10,
                          color:       'rgba(12,40,90,0.45)',
                          display:     'block',
                          marginTop:   2,
                        }}
                      >
                        {step.source}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <span
                        style={{
                          fontFamily:  '"JetBrains Mono", monospace',
                          fontSize:    10,
                          color:       'rgba(12,40,90,0.40)',
                        }}
                        className="hidden sm:inline"
                      >
                        {step.ts}
                      </span>
                      <ChevronDown
                        style={{
                          width:     14,
                          height:    14,
                          color:     'rgba(12,40,90,0.40)',
                          transform: isExp ? 'rotate(180deg)' : 'none',
                          transition:'transform 0.25s ease',
                        }}
                      />
                    </div>
                  </div>

                  {/* Expanded detail */}
                  <AnimatePresence>
                    {isExp && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ borderTop: '1px solid rgba(255,255,255,0.55)', overflow: 'hidden' }}
                      >
                        <div
                          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                          style={{ padding: '14px 18px' }}
                        >
                          {[
                            { label: 'Model / Method', value: step.model,  color: 'rgba(8,20,50,0.85)' },
                            { label: 'Result Finding', value: step.result, color: '#0D9488' },
                            { label: 'Uncertainty',    value: step.unc,    color: 'rgba(12,35,75,0.72)' },
                          ].map(cell => (
                            <div
                              key={cell.label}
                              style={{
                                padding:      12,
                                borderRadius: 10,
                                background:   'rgba(255,255,255,0.50)',
                                border:       '1px solid rgba(255,255,255,0.70)',
                              }}
                            >
                              <span
                                style={{
                                  fontFamily:    '"JetBrains Mono", monospace',
                                  fontSize:      8,
                                  fontWeight:    700,
                                  letterSpacing: '0.16em',
                                  textTransform: 'uppercase',
                                  color:         'rgba(12,40,90,0.40)',
                                  display:       'block',
                                  marginBottom:  5,
                                }}
                              >
                                {cell.label}
                              </span>
                              <span
                                style={{
                                  fontFamily:  '"JetBrains Mono", monospace',
                                  fontSize:    11,
                                  lineHeight:  1.55,
                                  color:       cell.color,
                                  fontWeight:  cell.color !== 'rgba(12,35,75,0.72)' ? 600 : 400,
                                }}
                              >
                                {cell.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Compliance badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginTop: 20 }}
        >
          {[
            { icon: Shield, text: 'ISO/IEC 27037 Digital Forensic Evidence' },
            { icon: Lock,   text: 'SHA-256 Cryptographic Custody Chain' },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="liquid-glass-light"
              style={{
                display:    'flex',
                alignItems: 'center',
                gap:        8,
                padding:    '9px 16px',
              }}
            >
              <Icon style={{ width: 13, height: 13, color: '#0D9488', flexShrink: 0 }} />
              <span
                style={{
                  fontFamily:    '"JetBrains Mono", monospace',
                  fontSize:      10,
                  color:         'rgba(12,35,75,0.72)',
                  letterSpacing: '0.06em',
                }}
              >
                {text}
              </span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default EvidenceChain;
