import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Clock, Ship, Waves, CheckCircle2 } from 'lucide-react';

/* ================================================================
   VALUE PROPOSITION — "The Four Forensic Questions"
   Translucent liquid glass section floating over coastal waters.
   Crisp deep maritime typography, hydrodynamic physics notation,
   and interactive forensic question cards.
   ================================================================ */

const QUESTIONS = [
  {
    icon:      Compass,
    num:       '01',
    tag:       'SPATIAL ORIGIN',
    title:     'Where did the discharge originate?',
    detail:    'Surface slicks drift continuously under ocean currents and Stokes wind drift. The detected position in a satellite scene is almost never where the oil was discharged.',
    parameter: 'HYCOM 1/12° Reanalysis · Stokes Drift U_s',
    accent:    '#0284C7',
  },
  {
    icon:      Clock,
    num:       '02',
    tag:       'TEMPORAL WINDOW',
    title:     'When could the release have occurred?',
    detail:    'Attribution demands calculating the release time window by backtracking the slick through time-varying metocean reanalysis fields and weathering kinetics.',
    parameter: 'Ensemble Backward Drift · 72h Horizon',
    accent:    '#0D9488',
  },
  {
    icon:      Ship,
    num:       '03',
    tag:       'KINEMATIC INTERSECTION',
    title:     'Which vessel trajectories intersect the origin corridor?',
    detail:    'Candidate vessels must be audited against both spatial proximity and temporal passage corridor — calculating geometric confidence without guesswork.',
    parameter: 'Spire Class-A AIS · Spatiotemporal Gate (t ± 3.5h)',
    accent:    '#0284C7',
  },
  {
    icon:      Waves,
    num:       '04',
    tag:       'PHYSICAL VALIDATION',
    title:     'Does forward simulation verify that hypothesis?',
    detail:    'A plausible candidate must be tested forward: would a discharge from this vessel at that exact time reproduce the observed satellite footprint?',
    parameter: 'Forward OpenOil Dispersion · IoU ≥ 0.78',
    accent:    '#0D9488',
  },
];

export const ValueProposition: React.FC = () => (
  <section
    id="value-section"
    style={{ position: 'relative', zIndex: 1, padding: '40px 24px 80px' }}
  >
    <div style={{ maxWidth: '74rem', margin: '0 auto' }}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

        {/* ── Left Editorial Column (Floating Glass Card) ── */}
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 lg:sticky lg:top-24"
        >
          <div
            className="liquid-glass-strong glass-shimmer"
            style={{ padding: '36px 32px' }}
          >
            {/* Tag pill */}
            <div
              style={{
                display:        'inline-flex',
                alignItems:     'center',
                gap:            7,
                padding:        '4px 14px',
                borderRadius:   9999,
                background:     'rgba(13, 148, 136, 0.12)',
                border:         '1px solid rgba(13, 148, 136, 0.35)',
                marginBottom:   20,
              }}
            >
              <span
                style={{
                  width:        6,
                  height:       6,
                  borderRadius: '50%',
                  background:   '#0D9488',
                  boxShadow:    '0 0 8px rgba(13, 148, 136, 0.6)',
                }}
              />
              <span
                style={{
                  fontFamily:    '"JetBrains Mono", monospace',
                  fontSize:      9,
                  fontWeight:    700,
                  letterSpacing: '0.20em',
                  textTransform: 'uppercase',
                  color:         '#0F766E',
                }}
              >
                The Forensic Dilemma
              </span>
            </div>

            <h2
              style={{
                fontFamily:    '"Palatino Linotype", Palatino, "Book Antiqua", "EB Garamond", Georgia, serif',
                fontSize:      'clamp(28px, 3.4vw, 42px)',
                fontWeight:    800,
                letterSpacing: '-0.025em',
                lineHeight:    1.12,
                color:         'var(--text-primary)',
                marginBottom:  16,
              }}
            >
              An oil slick is only{' '}
              <span style={{ color: '#0D9488' }}>the beginning.</span>
            </h2>

            <p
              style={{
                fontFamily:  '"Palatino Linotype", Palatino, "EB Garamond", Georgia, serif',
                fontSize:    'clamp(14px, 1.3vw, 16px)',
                lineHeight:  1.70,
                color:       'var(--text-secondary)',
                marginBottom: 24,
              }}
            >
              Satellite radar imagery detects anomalous surface capillary wave dampening with high spatial fidelity. But raw imagery alone cannot prove legal responsibility in a maritime court.
            </p>

            {/* Lagrangian Advection Formula Box */}
            <div
              style={{
                background:     'rgba(255, 255, 255, 0.70)',
                border:         '1px solid rgba(255, 255, 255, 0.90)',
                borderRadius:   14,
                padding:        '16px 20px',
                marginBottom:   24,
                backdropFilter: 'blur(12px)',
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
                  marginBottom:  6,
                }}
              >
                Lagrangian Transport Equation
              </div>
              <div
                style={{
                  fontFamily:    '"JetBrains Mono", monospace',
                  fontSize:      13,
                  fontWeight:    600,
                  color:         '#0F766E',
                  letterSpacing: '0.02em',
                }}
              >
                d𝐱/dt = 𝐮_curr + 0.03 𝐰_wind + 𝐮_stokes + 𝛈(K_h)
              </div>
              <div
                style={{
                  fontFamily:  '"Palatino Linotype", Palatino, serif',
                  fontSize:    11.5,
                  color:       'var(--text-dim)',
                  marginTop:   4,
                }}
              >
                Coupled hydrodynamics accounting for turbulent horizontal diffusion (K_h = 10 m²/s)
              </div>
            </div>

            {/* Verification checklist item */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <CheckCircle2 style={{ width: 18, height: 18, color: '#059669', flexShrink: 0 }} />
              <span
                style={{
                  fontFamily: '"Palatino Linotype", Palatino, serif',
                  fontSize:   13,
                  color:      'var(--text-secondary)',
                  fontWeight: 600,
                }}
              >
                Audit-compliant with IMO Resolution MEPC.117(52)
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Right Column: The 4 Forensic Questions (Liquid Glass Cards) ── */}
        <div className="lg:col-span-7 space-y-4">
          {QUESTIONS.map((q, i) => {
            const Icon = q.icon;
            return (
              <motion.div
                key={q.num}
                initial={{ opacity: 0, y: 28, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="liquid-glass glass-shimmer group"
                style={{
                  padding:    '22px 26px',
                  cursor:     'default',
                  transition: 'all 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    '0 18px 48px -8px rgba(10,36,68,0.18), inset 0 1.5px 0 #FFFFFF';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'none';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
                  {/* Number & Icon Badge */}
                  <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <span
                      style={{
                        fontFamily:    '"JetBrains Mono", monospace',
                        fontSize:      11,
                        fontWeight:    700,
                        color:         'var(--text-dim)',
                      }}
                    >
                      {q.num}
                    </span>
                    <div
                      style={{
                        width:          42,
                        height:         42,
                        borderRadius:   12,
                        background:     `${q.accent}14`,
                        border:         `1px solid ${q.accent}30`,
                        display:        'flex',
                        alignItems:     'center',
                        justifyContent: 'center',
                        color:          q.accent,
                      }}
                    >
                      <Icon style={{ width: 20, height: 20 }} />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily:    '"JetBrains Mono", monospace',
                        fontSize:      9,
                        fontWeight:    700,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color:         q.accent,
                        marginBottom:  4,
                      }}
                    >
                      {q.tag}
                    </div>

                    <h3
                      style={{
                        fontFamily:    '"Palatino Linotype", Palatino, serif',
                        fontSize:      'clamp(15px, 1.4vw, 17px)',
                        fontWeight:    700,
                        letterSpacing: '-0.01em',
                        color:         'var(--text-primary)',
                        marginBottom:  8,
                        lineHeight:    1.35,
                      }}
                    >
                      {q.title}
                    </h3>

                    <p
                      style={{
                        fontFamily:   '"Palatino Linotype", Palatino, serif',
                        fontSize:     13.5,
                        lineHeight:   1.65,
                        color:        'var(--text-secondary)',
                        marginBottom: 10,
                      }}
                    >
                      {q.detail}
                    </p>

                    {/* Parameter Tag */}
                    <div
                      style={{
                        display:        'inline-flex',
                        alignItems:     'center',
                        gap:            6,
                        background:     'rgba(255, 255, 255, 0.65)',
                        border:         '1px solid rgba(255, 255, 255, 0.90)',
                        padding:        '3px 10px',
                        borderRadius:   6,
                        fontFamily:     '"JetBrains Mono", monospace',
                        fontSize:       10,
                        color:          'var(--text-muted)',
                        letterSpacing:  '0.04em',
                      }}
                    >
                      <span>Physics Spec:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{q.parameter}</strong>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  </section>
);

export default ValueProposition;
