import React from 'react';
import { motion } from 'framer-motion';

/* ================================================================
   SECTION 08: EVIDENCE — FROM DETECTION TO EVIDENCE (WHITE THEME)
   ================================================================ */

const PIPELINE_NODES = [
  { step: '01', label: 'Satellite',      desc: 'Raw SAR radar feed ingestion' },
  { step: '02', label: 'Detection',      desc: 'Candidate surface pattern extraction' },
  { step: '03', label: 'Validation',     desc: 'Meteorological look-alike mitigation' },
  { step: '04', label: 'Origin',         desc: 'Backward Lagrangian drift reconstruction' },
  { step: '05', label: 'AIS',            desc: 'Spatiotemporal vessel trajectory cross-check' },
  { step: '06', label: 'Counterfactual', desc: 'Forward simulation consistency test' },
  { step: '07', label: 'Evidence',       desc: 'Cryptographically auditable evidence compilation' },
  { step: '08', label: 'Human Review',   desc: 'Qualified maritime authority evaluation' },
];

export const SectionEvidence: React.FC = () => {
  return (
    <section
      id="evidence"
      style={{
        padding: '120px 24px',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div style={{ maxWidth: '82rem', margin: '0 auto' }}>
        <div style={{ maxWidth: '640px', marginBottom: '56px' }}>
          <div className="editorial-eyebrow" style={{ marginBottom: '12px' }}>
            08 / SYNTHESIS · EVIDENTIARY PIPELINE
          </div>
          <h2 className="editorial-h2" style={{ marginBottom: '16px', color: '#0F172A' }}>
            FROM DETECTION TO EVIDENCE
          </h2>
          <p className="editorial-body-lg" style={{ color: '#334155' }}>
            A cohesive evidentiary chain where every analytical step is auditable, physically grounded,
            and prepared for human verification.
          </p>
        </div>

        {/* Linear Minimalist Chain */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
          }}
        >
          {PIPELINE_NODES.map((node) => (
            <div
              key={node.step}
              style={{
                padding: '24px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.90)',
                border: '1px solid rgba(226, 232, 240, 0.90)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                }}
              >
                <span className="editorial-meta" style={{ color: '#0D9488', fontWeight: 600 }}>{node.step}</span>
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#10B981',
                  }}
                />
              </div>

              <h3 className="editorial-h3" style={{ fontSize: '18px', marginBottom: '6px', color: '#0F172A' }}>
                {node.label}
              </h3>
              <p className="editorial-body" style={{ fontSize: '13px', lineHeight: 1.5, color: '#475569' }}>
                {node.desc}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SectionEvidence;
