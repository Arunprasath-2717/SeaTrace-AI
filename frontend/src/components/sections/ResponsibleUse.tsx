import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RadioTower, HelpCircle, UserCheck } from 'lucide-react';

/* ================================================================
   SECTION: RESPONSIBLE USE
   Card-less scientific integrity grid alignment system.
   Typography: H2 32-40px, H3 24px, Dark Gradient, #000000 Secondary Text.
   Zero cards, zero container boxes.
   ================================================================ */

const INTEGRITY_PRINCIPLES = [
  {
    index: '01',
    title: 'SAR Patterns are Not Automatically Oil',
    copy: 'Natural look-alike phenomena — biogenic films, low-wind sea slicks, internal ocean waves, and grease ice — must be rigorously tested against meteorological criteria before classification.',
    icon: AlertTriangle,
    secondary: 'Strict multi-spectral thresholding & atmospheric wind gates',
  },
  {
    index: '02',
    title: 'AIS Gaps are Not Automatically Concealment',
    copy: 'Terrestrial receiver limitations, high-traffic packet collisions, and satellite antenna blind spots are factored in before attributing malicious transponder deactivation.',
    icon: RadioTower,
    secondary: 'Constellation orbital coverage modeling & terrestrial shadow analysis',
  },
  {
    index: '03',
    title: 'Hydrodynamic Drift Models Contain Uncertainty',
    copy: 'Atmospheric forcing and turbulent ocean eddies are non-linear; backward origins are modeled as probabilistic confidence zones, never false point-certitudes.',
    icon: HelpCircle,
    secondary: 'Ensemble dispersion forecasting with 95% spatial confidence bounds',
  },
  {
    index: '04',
    title: 'Attribution Demands Qualified Human Oversight',
    copy: 'SeaTrace provides objective evidentiary synthesis to empower maritime authorities and legal investigators — never automated, unverified accusations.',
    icon: UserCheck,
    secondary: 'Human-in-the-loop verification protocol prior to legal dossier export',
  },
];

export const ResponsibleUse: React.FC = () => {
  return (
    <section
      id="responsible-use"
      style={{
        padding: '100px 36px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div
        style={{
          maxWidth: '88rem',
          margin: '0 auto',
        }}
      >
        {/* Section Header: Card-less Grid Typography */}
        <div style={{ marginBottom: '56px', maxWidth: '720px' }}>
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
            <span>Scientific Integrity</span>
            <span>·</span>
            <span>Ethical Governance</span>
          </div>

          <h2 className="h2-section" style={{ marginBottom: '16px' }}>
            <span className="text-dark-gradient">Responsible Use</span>
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
            Evidence, not assumptions. Forensic attribution requires epistemic humility, clear probability boundaries, and human judgment.
          </p>
        </div>

        {/* ── CARD-LESS 4-COLUMN INTEGRITY GRID ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '40px',
          }}
        >
          {INTEGRITY_PRINCIPLES.map((principle, idx) => {
            const Icon = principle.icon;
            return (
              <motion.div
                key={principle.index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.55,
                  delay: idx * 0.1,
                  ease: [0.1, 0.9, 0.2, 1],
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  paddingTop: '20px',
                  borderTop: '2px solid rgba(13, 148, 136, 0.35)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '14px',
                      fontWeight: 800,
                      color: '#0D9488',
                    }}
                  >
                    TENET {principle.index}
                  </span>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(45, 212, 191, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0D9488',
                    }}
                  >
                    <Icon style={{ width: 17, height: 17 }} />
                  </div>
                </div>

                <h3
                  className="h3-feature"
                  style={{
                    marginBottom: '12px',
                    fontSize: '20px',
                  }}
                >
                  <span className="text-dark-gradient">{principle.title}</span>
                </h3>

                <p
                  className="text-dark-gradient"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '14.5px',
                    lineHeight: 1.6,
                    fontWeight: 500,
                    marginBottom: '20px',
                    flexGrow: 1,
                  }}
                >
                  {principle.copy}
                </p>

                {/* Pure Black (#000000) Secondary Section Text */}
                <div
                  className="text-secondary-section"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    lineHeight: 1.45,
                    opacity: 0.85,
                    paddingTop: '12px',
                    borderTop: '1px dashed rgba(9, 30, 47, 0.15)',
                  }}
                >
                  {principle.secondary}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ResponsibleUse;
