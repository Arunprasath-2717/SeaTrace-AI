import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Search, RotateCcw, Link2, FlaskConical, FileCheck, ArrowDown } from 'lucide-react';

/* ================================================================
   SECTION 2: WHAT SEATRACE DOES
   Lumen Design System: ui-sans-serif, #0A0A0A, #404040, #FF945E
   Text floats directly over foreground ocean.
   Selectively kept step rows styled with 50% transparency.
   ================================================================ */

const FLOW_STEPS = [
  { step: '01', title: 'Observe',      desc: 'Satellite SAR and optical feeds',          icon: Eye },
  { step: '02', title: 'Detect',       desc: 'Surface pattern segmentation',             icon: Search },
  { step: '03', title: 'Reconstruct',  desc: 'Oceanic backward drift physics',           icon: RotateCcw },
  { step: '04', title: 'Correlate',    desc: 'AIS trajectory spatiotemporal match',       icon: Link2 },
  { step: '05', title: 'Test',         desc: 'Forward scenario simulation',              icon: FlaskConical },
  { step: '06', title: 'Evidence',     desc: 'Structured investigation dossier',          icon: FileCheck },
];

export const WhatSeatraceDoes: React.FC = () => {
  return (
    <section
      id="workflow-section"
      style={{
        minHeight:      '85vh',
        display:        'flex',
        flexDirection:  'column',
        justifyContent: 'center',
        alignItems:     'center',
        padding:        `var(--space-19) var(--space-9)`,
        position:       'relative',
        zIndex:         1,
      }}
    >
      <div style={{ maxWidth: '64rem', width: '100%', margin: '0 auto', textAlign: 'center' }}>
        
        {/* Floating Foreground Overline */}
        <span
          style={{
            fontFamily:    'var(--font-primary)',
            fontSize:      'var(--text-xs)',
            fontWeight:    'var(--weight-500)',
            letterSpacing: '0.14em',
            color:         'var(--color-3)',
            textTransform: 'uppercase',
            display:       'inline-block',
            marginBottom:  'var(--space-3)',
          }}
        >
          Core workflow
        </span>

        {/* Floating Foreground Heading */}
        <h2
          style={{
            fontFamily:    'var(--font-primary)',
            fontSize:      `clamp(28px, 4vw, var(--text-3xl))`,
            fontWeight:    'var(--weight-500)',
            letterSpacing: '-0.02em',
            color:         'var(--accent-foreground)',
            marginBottom:  'var(--space-10)',
            lineHeight:    'var(--lh-10)',
            textShadow:    '0 1px 12px rgba(255, 255, 255, 0.85)',
          }}
        >
          What Seatrace does
        </h2>

        {/* Selective 50% Transparent Flow Cards */}
        <div
          style={{
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            gap:            'var(--space-3)',
            maxWidth:       540,
            margin:         `0 auto var(--space-10)`,
          }}
        >
          {FLOW_STEPS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <React.Fragment key={item.title}>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: idx * 0.06 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  style={{
                    width:                '100%',
                    padding:              `var(--space-4) var(--space-7)`,
                    borderRadius:         'var(--radius-lg)',
                    background:           'var(--glass)',
                    backdropFilter:       'var(--glass-blur)',
                    WebkitBackdropFilter: 'blur(20px) saturate(1.7)',
                    border:               '1px solid var(--border)',
                    boxShadow:            'var(--shadow-sm), var(--shadow-inner)',
                    display:              'flex',
                    alignItems:           'center',
                    justifyContent:       'space-between',
                    transition:           'all 0.25s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
                    <div
                      style={{
                        width:          38,
                        height:         38,
                        borderRadius:   'var(--radius-md)',
                        background:     'var(--accent-subtle)',
                        border:         '1px solid var(--accent-border)',
                        display:        'flex',
                        alignItems:     'center',
                        justifyContent: 'center',
                        color:          'var(--color-3)',
                      }}
                    >
                      <Icon style={{ width: 18, height: 18 }} />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div
                        style={{
                          fontFamily:    'var(--font-primary)',
                          fontSize:      'var(--text-base)',
                          fontWeight:    'var(--weight-500)',
                          letterSpacing: '0.01em',
                          color:         'var(--accent-foreground)',
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          fontFamily:    'var(--font-primary)',
                          fontSize:      'var(--text-xs)',
                          color:         'var(--color-2)',
                          fontWeight:    'var(--weight-400)',
                          marginTop:     'var(--space-1)',
                          lineHeight:    'var(--lh-3)',
                        }}
                      >
                        {item.desc}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontFamily:    'var(--font-primary)',
                      fontSize:      'var(--text-xs)',
                      fontWeight:    'var(--weight-500)',
                      color:         'var(--color-3)',
                      background:    'var(--glass-light)',
                      border:        '1px solid var(--accent-border)',
                      padding:       `var(--space-1) var(--space-4)`,
                      borderRadius:  'var(--radius-sm)',
                    }}
                  >
                    {item.step}
                  </span>
                </motion.div>

                {idx < FLOW_STEPS.length - 1 && (
                  <div
                    style={{
                      color:          'var(--color-3)',
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      opacity:        0.75,
                    }}
                  >
                    <ArrowDown style={{ width: 16, height: 16 }} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Foreground narrative statement */}
        <p
          style={{
            fontFamily:    'var(--font-primary)',
            fontSize:      'var(--text-lg)',
            lineHeight:    'var(--lh-6)',
            fontWeight:    'var(--weight-400)',
            color:         'var(--color-2)',
            maxWidth:      680,
            margin:        '0 auto',
            textShadow:    '0 1px 10px rgba(255, 255, 255, 0.90)',
          }}
        >
          Seatrace connects satellite observations, ocean movement and vessel trajectories into a structured investigation workflow.
        </p>

      </div>
    </section>
  );
};

export default WhatSeatraceDoes;
