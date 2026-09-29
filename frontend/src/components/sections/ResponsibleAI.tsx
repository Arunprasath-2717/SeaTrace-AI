import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Eye, ChevronRight } from 'lucide-react';

/* ================================================================
   RESPONSIBLE AI — Scientific Integrity
   Editorial sticky column + three glass pillar cards.
   ================================================================ */

const PILLARS = [
  {
    icon:    Shield,
    title:   'Scientific Transparency',
    summary: 'Every analytical output carries uncertainty bounds, model specifications, and input data provenance. No black-box results.',
    detail:  'Ocean drift models are identified by name and version. ERA5 and HYCOM reanalysis parameters are recorded at run-time. Ensemble variance is reported, not hidden.',
    accent:  '#0891B2',
  },
  {
    icon:    AlertTriangle,
    title:   'Hard Limitations Declared',
    summary: 'Physical compatibility between modeled and observed slick shapes is not sufficient to establish legal causation or intent.',
    detail:  'A positive IoU match confirms that a release from the candidate vessel is physically consistent with observation — not that the release occurred.',
    accent:  '#B45309',
  },
  {
    icon:    Eye,
    title:   'Human-in-the-Loop Final Decision',
    summary: 'SEATRACE produces structured evidence for maritime investigators. No automated determination of responsibility is issued.',
    detail:  'All dossier outputs require formal investigator review and attestation. The AI role is to reduce analyst search space, not to replace judgment.',
    accent:  '#0D9488',
  },
];

export const ResponsibleAI: React.FC = () => (
  <section
    id="validation-section"
    style={{ position: 'relative', zIndex: 1, padding: '0 24px' }}
  >
    <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

        {/* ── Sticky editorial column ── */}
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 lg:sticky lg:top-28"
        >
          {/* Overline pill */}
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
            <Shield style={{ width: 11, height: 11, color: '#2DD4BF' }} />
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
              Scientific Integrity
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
              marginBottom:  18,
            }}
          >
            The limits of{' '}
            <span style={{ color: '#0D9488' }}>what we claim.</span>
          </h2>

          <p
            style={{
              fontFamily:  '"Palatino Linotype", Palatino, serif',
              fontSize:    'clamp(13px, 1.2vw, 15px)',
              lineHeight:  1.70,
              color:       'var(--text-secondary)',
              marginBottom: 24,
            }}
          >
            SEATRACE does not claim to prove guilt. It evaluates whether the physical evidence is <em>consistent</em> with a candidate vessel's presence and trajectory.
          </p>

          {/* Commitment glass card */}
          <div
            className="liquid-glass glass-shimmer"
            style={{ padding: '20px 22px' }}
          >
            <div
              style={{
                fontFamily:    '"JetBrains Mono", monospace',
                fontSize:      9,
                fontWeight:    700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color:         '#0D9488',
                marginBottom:  14,
              }}
            >
              SEATRACE Commitment
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'All models explicitly identified and versioned',
                'Uncertainty quantified and reported, not suppressed',
                'Human investigator sign-off required for all outputs',
                'Physical compatibility ≠ legal proof of causation',
                'No automated determination of responsibility',
              ].map(item => (
                <li
                  key={item}
                  style={{
                    display:    'flex',
                    alignItems: 'flex-start',
                    gap:        8,
                    fontFamily: '"Palatino Linotype", Palatino, serif',
                    fontSize:   12,
                    lineHeight: 1.55,
                    color:      'rgba(12,35,75,0.78)',
                  }}
                >
                  <ChevronRight
                    style={{ width: 13, height: 13, color: '#0D9488', flexShrink: 0, marginTop: 1 }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* ── Three pillar cards ── */}
        <div className="lg:col-span-7 space-y-4">
          {PILLARS.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 28, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.10, ease: [0.16, 1, 0.3, 1] }}
                className="liquid-glass"
                style={{
                  padding:    '22px 24px',
                  cursor:     'default',
                  transition: 'transform 0.22s ease, box-shadow 0.22s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    `0 16px 56px rgba(10,40,100,0.16), inset 0 1.5px 0 rgba(255,255,255,0.85)`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'none';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div
                    style={{
                      width:          44,
                      height:         44,
                      borderRadius:   14,
                      background:     `${pillar.accent}10`,
                      border:         `1px solid ${pillar.accent}28`,
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      flexShrink:     0,
                      color:          pillar.accent,
                    }}
                  >
                    <Icon style={{ width: 18, height: 18 }} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        fontFamily:    '"Palatino Linotype", Palatino, serif',
                        fontSize:      15,
                        fontWeight:    700,
                        letterSpacing: '-0.01em',
                        color:         'rgba(8,20,50,0.90)',
                        marginBottom:  7,
                      }}
                    >
                      {pillar.title}
                    </h3>
                    <p
                      style={{
                        fontFamily:  '"Palatino Linotype", Palatino, serif',
                        fontSize:    13,
                        lineHeight:  1.65,
                        color:       'rgba(12,35,75,0.75)',
                        marginBottom: 10,
                      }}
                    >
                      {pillar.summary}
                    </p>
                    <p
                      style={{
                        fontFamily: '"Palatino Linotype", Palatino, serif',
                        fontSize:   12,
                        lineHeight: 1.60,
                        color:      'rgba(12,35,75,0.55)',
                      }}
                    >
                      {pillar.detail}
                    </p>
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

export default ResponsibleAI;
