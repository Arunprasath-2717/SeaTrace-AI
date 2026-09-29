import React from 'react';
import { motion } from 'framer-motion';
import { Eye, ScanLine, RotateCcw, Navigation2, FlaskConical, FileCheck } from 'lucide-react';

/* ================================================================
   SECTION: FROM DETECTION TO EVIDENCE
   Card-less sequential evidence chain grid alignment system.
   Typography: H2 32-40px, H3 24px, Dark Gradient, #000000 Secondary Text.
   Zero cards, zero container boxes.
   ================================================================ */

const EVIDENCE_CHAIN = [
  {
    step: '01',
    title: 'Detection',
    copy: 'Candidate slick identified from satellite radar imagery with backscatter thresholding.',
    icon: Eye,
    secondary: 'Automated SAR pipeline alert',
  },
  {
    step: '02',
    title: 'Assessment',
    copy: 'Surface formation evaluated against meteorological filters to eliminate natural look-alikes.',
    icon: ScanLine,
    secondary: 'Wind field & wave height validation',
  },
  {
    step: '03',
    title: 'Origin Trace',
    copy: 'Backward Lagrangian drift reconstruction maps the spatiotemporal release window.',
    icon: RotateCcw,
    secondary: 'Hydrodynamic particle backtracking',
  },
  {
    step: '04',
    title: 'Vessel Match',
    copy: 'AIS transponder logs queried to identify ships intersecting the origin coordinates.',
    icon: Navigation2,
    secondary: 'Kinematic trajectory correlation',
  },
  {
    step: '05',
    title: 'Scenario Test',
    copy: 'Forward dispersion simulation tests physical consistency with observed slick geometry.',
    icon: FlaskConical,
    secondary: 'Hydrodynamic plausibility verification',
  },
  {
    step: '06',
    title: 'Evidence Pack',
    copy: 'Immutable investigation package compiled with cryptographic audit hash for maritime authorities.',
    icon: FileCheck,
    secondary: 'UNCLOS evidentiary standard compliance',
  },
];

export const FromDetectionToEvidence: React.FC = () => {
  return (
    <section
      id="evidence-chain"
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
            <span>Evidentiary Pipeline</span>
            <span>·</span>
            <span>Chain of Custody</span>
          </div>

          <h2 className="h2-section" style={{ marginBottom: '16px' }}>
            <span className="text-dark-gradient">From Detection to Evidence</span>
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
            A continuous, auditable evidentiary journey from the first radar ping to a legally defensible attribution dossier.
          </p>
        </div>

        {/* ── CARD-LESS 6-STAGE SEQUENTIAL GRID ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '32px',
          }}
        >
          {EVIDENCE_CHAIN.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.08,
                  ease: [0.1, 0.9, 0.2, 1],
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  paddingTop: '20px',
                  borderTop: '2px solid rgba(45, 212, 191, 0.40)',
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
                    PHASE {item.step}
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
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '20px',
                    fontWeight: 700,
                    lineHeight: 1.3,
                    marginBottom: '10px',
                  }}
                >
                  <span className="text-dark-gradient">{item.title}</span>
                </h3>

                <p
                  className="text-dark-gradient"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '14px',
                    lineHeight: 1.55,
                    fontWeight: 500,
                    marginBottom: '16px',
                    flexGrow: 1,
                  }}
                >
                  {item.copy}
                </p>

                {/* Pure Black (#000000) Secondary Section Text */}
                <div
                  className="text-secondary-section"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 700,
                    lineHeight: 1.45,
                    opacity: 0.85,
                    paddingTop: '10px',
                    borderTop: '1px dashed rgba(9, 30, 47, 0.15)',
                  }}
                >
                  {item.secondary}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FromDetectionToEvidence;
