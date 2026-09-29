import React from 'react';
import { motion } from 'framer-motion';
import { Navigation2, Clock, Anchor, CheckCircle } from 'lucide-react';

/* ================================================================
   SECTION: CONNECT THE VESSEL
   Card-less vessel correlation grid alignment system.
   Typography: H2 32-40px, H3 24px, Dark Gradient, #000000 Secondary Text.
   Zero cards, zero container boxes.
   ================================================================ */

const VESSEL_PILLARS = [
  {
    index: '01',
    title: 'AIS Trajectory Query',
    copy: 'Vessel position broadcasts from global transponder networks are filtered through spatiotemporal envelopes centered on the reconstructed origin.',
    icon: Navigation2,
    secondary: 'S-AIS & T-AIS message ingestion · MMSI identity resolution',
  },
  {
    index: '02',
    title: 'Temporal Window Alignment',
    copy: 'Verifies whether candidate vessels traversed the designated origin coordinates during the precise discharge timestamp interval.',
    icon: Clock,
    secondary: '±90 minute tolerance window matching drift dispersion bounds',
  },
  {
    index: '03',
    title: 'Behavioral Anomaly Analysis',
    copy: 'Detects suspicious navigational maneuvers: unexpected speed drops, sudden course alterations, or looping patterns typical of operational discharge.',
    icon: Anchor,
    secondary: 'Kinematic rate-of-turn & engine load anomaly indices',
  },
  {
    index: '04',
    title: 'Compatibility Scoring',
    copy: 'A Bayesian likelihood score synthesized from spatial proximity, temporal alignment, and hydrodynamics — objective evidentiary scoring, not subjective conjecture.',
    icon: CheckCircle,
    secondary: 'Weighted attribution index (0–100%) with peer-reviewed audit trail',
  },
];

export const ConnectVessel: React.FC = () => {
  return (
    <section
      id="use-cases"
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
            <span>Vessel Attribution</span>
            <span>·</span>
            <span>Kinematic Correlation</span>
          </div>

          <h2 className="h2-section" style={{ marginBottom: '16px' }}>
            <span className="text-dark-gradient">Connect the Vessel</span>
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
            Cross-referencing reconstructed origin zones with historical AIS broadcasts to identify candidate vessels with physical rigor.
          </p>
        </div>

        {/* ── CARD-LESS 4-COLUMN VESSEL GRID ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '40px',
          }}
        >
          {VESSEL_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.index}
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
                    PILLAR {pillar.index}
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
                  }}
                >
                  <span className="text-dark-gradient">{pillar.title}</span>
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
                  {pillar.copy}
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
                  {pillar.secondary}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ConnectVessel;
