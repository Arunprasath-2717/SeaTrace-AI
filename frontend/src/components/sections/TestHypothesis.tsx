import React from 'react';
import { motion } from 'framer-motion';
import { Wind, RotateCcw, CheckCircle2 } from 'lucide-react';

/* ================================================================
   SECTION: TEST THE HYPOTHESIS
   Card-less forward simulation grid alignment system.
   Typography: H2 32-40px, H3 24px, Dark Gradient, #000000 Secondary Text.
   Zero cards, zero container boxes.
   ================================================================ */

const SIMULATION_CHECKS = [
  {
    index: '01',
    title: 'Forward Drift Simulation',
    copy: 'Simulates hypothetical discharge release from the candidate vessel coordinates forward in time, projecting subsequent oceanic propagation.',
    icon: Wind,
    secondary: 'Forward Eulerian-Lagrangian particle dispersion modeling',
  },
  {
    index: '02',
    title: 'Morphological Pattern Alignment',
    copy: 'Compares the simulated forward slick footprint with the actual satellite radar observed geometry, assessing shape overlap and elongation congruency.',
    icon: RotateCcw,
    secondary: 'Intersection-over-Union (IoU) & Hausdorff distance metric',
  },
  {
    index: '03',
    title: 'Evidentiary Consistency Check',
    copy: 'Calculates whether the vessel discharge hypothesis is physically plausible and supported by current vector continuity, eliminating coincidental proximity.',
    icon: CheckCircle2,
    secondary: 'Statistical significance threshold: p < 0.01 physical validity',
  },
];

export const TestHypothesis: React.FC = () => {
  return (
    <section
      id="hypothesis-testing"
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
            <span>Scenario Simulation</span>
            <span>·</span>
            <span>Hypothesis Testing</span>
          </div>

          <h2 className="h2-section" style={{ marginBottom: '16px' }}>
            <span className="text-dark-gradient">Test the Scenario</span>
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
            Does this explanation hold up? We don't assume attribution; we test the scenario forward through physical simulation to verify consistency.
          </p>
        </div>

        {/* ── CARD-LESS 3-COLUMN SIMULATION GRID ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '48px',
          }}
        >
          {SIMULATION_CHECKS.map((check, idx) => {
            const Icon = check.icon;
            return (
              <motion.div
                key={check.index}
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
                    TEST {check.index}
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
                  <span className="text-dark-gradient">{check.title}</span>
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
                  {check.copy}
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
                  {check.secondary}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TestHypothesis;
