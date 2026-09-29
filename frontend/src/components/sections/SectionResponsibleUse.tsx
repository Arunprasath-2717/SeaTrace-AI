import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle, Users } from 'lucide-react';

/* ================================================================
   RESPONSIBLE USE — Transparent over 3D scene
   - No solid background — dark sea canvas shows through
   - Frosted glass cards for content legibility
   - White text, clean contrast
   ================================================================ */

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: 'Probabilistic Confidence',
    desc: 'Every attribution carries explicit probability envelopes and uncertainty ranges — never binary verdicts.',
    color: '#38BDF8',
  },
  {
    icon: AlertTriangle,
    title: 'Blind-Spot Modeling',
    desc: 'AIS transponder coverage shadows, dark vessel periods, and sensor gaps are explicitly represented.',
    color: '#FBBF24',
  },
  {
    icon: Users,
    title: 'Human-in-the-Loop',
    desc: 'Automated analysis surfaces evidence. Final attribution decisions require qualified human sign-off.',
    color: '#34D399',
  },
];

export const SectionResponsibleUse: React.FC = () => (
  <section
    id="responsible-use"
    style={{
      position: 'relative',
      zIndex: 2,
      /* Fully transparent — 3D canvas shows through */
      background: 'transparent',
      padding: '100px 24px',
    }}
  >
    {/* Very subtle horizontal rule at top */}
    <div
      aria-hidden
      style={{
        position: 'absolute',
        top: 0,
        left: '10%',
        right: '10%',
        height: '1px',
        background: 'rgba(255,255,255,0.08)',
      }}
    />

    <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
      {/* Frosted glass content panel */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          borderRadius: '20px',
          background: 'rgba(7, 12, 20, 0.55)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.09)',
          padding: 'clamp(32px, 5vw, 60px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '48px',
          alignItems: 'start',
        }}
      >
        {/* Left: text */}
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px',
            }}
          >
            <div style={{ width: '20px', height: '1px', background: '#34D399' }} />
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#34D399',
              }}
            >
              Scientific Governance
            </span>
          </div>

          <h2
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(24px, 3vw, 38px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              color: '#F8FAFC',
              marginBottom: '16px',
            }}
          >
            Evidence,
            <br />not assumption.
          </h2>

          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px',
              lineHeight: 1.7,
              color: 'rgba(148,163,184,0.85)',
              marginBottom: '28px',
            }}
          >
            SeaTrace provides objective evidentiary synthesis. Attribution is never
            automated into unverified conclusions — hydrodynamic uncertainties, transponder
            coverage gaps, and meteorological limits are explicitly modeled to support
            rigorous human review.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['UNCLOS Art. 217', 'ISO 19156', 'IMO MARPOL'].map((label) => (
              <span
                key={label}
                style={{
                  padding: '4px 12px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '10.5px',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'rgba(148,163,184,0.70)',
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Right: principle cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {PRINCIPLES.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: 'flex',
                  gap: '14px',
                  padding: '16px 18px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(8px)',
                  transition: 'border-color 0.2s ease, background 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${p.color}30`;
                  e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                }}
              >
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '9px',
                    background: `${p.color}14`,
                    border: `1px solid ${p.color}25`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon style={{ width: 15, height: 15, color: p.color }} />
                </div>
                <div>
                  <h4
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#F8FAFC',
                      marginBottom: '4px',
                      lineHeight: 1.3,
                    }}
                  >
                    {p.title}
                  </h4>
                  <p
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '13px',
                      lineHeight: 1.55,
                      color: 'rgba(148,163,184,0.75)',
                    }}
                  >
                    {p.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  </section>
);

export default SectionResponsibleUse;
