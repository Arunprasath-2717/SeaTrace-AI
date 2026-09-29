import React from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, ArrowRight } from 'lucide-react';

/* ================================================================
   SECTION 07: TEST — COUNTERFACTUAL ANALYSIS (WHITE THEME)
   Visual: candidate vessel → hypothetical release → simulated movement → observed comparison
   ================================================================ */

export const SectionTest: React.FC = () => {
  return (
    <section
      id="counterfactual"
      style={{
        padding: '120px 24px',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div style={{ maxWidth: '82rem', margin: '0 auto' }}>
        <div style={{ maxWidth: '640px', marginBottom: '48px' }}>
          <div className="editorial-eyebrow" style={{ marginBottom: '12px' }}>
            07 / METHOD · COUNTERFACTUAL ANALYSIS
          </div>
          <h2 className="editorial-h2" style={{ marginBottom: '16px', color: '#0F172A' }}>
            TEST
          </h2>
          <p className="editorial-body-lg" style={{ color: '#334155' }}>
            Forward simulation tests whether a hypothetical discharge from a candidate vessel could
            have physically evolved into the observed satellite radar footprint.
          </p>
        </div>

        {/* Conceptual Visual: candidate vessel → hypothetical release → simulated movement → observed comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '18px',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              padding: '24px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.90)',
              border: '1px solid rgba(226, 232, 240, 0.90)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
            }}
          >
            <div className="editorial-meta" style={{ marginBottom: '12px', color: '#64748B' }}>
              Phase 01
            </div>
            <h3 className="editorial-h3" style={{ fontSize: '18px', marginBottom: '6px', color: '#0F172A' }}>
              Candidate Vessel
            </h3>
            <p className="editorial-body" style={{ fontSize: '13.5px', color: '#475569' }}>
              Target coordinates and trajectory velocity.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ArrowRight style={{ width: 18, height: 18, color: '#94A3B8' }} />
          </div>

          <div
            style={{
              padding: '24px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.90)',
              border: '1px solid rgba(226, 232, 240, 0.90)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
            }}
          >
            <div className="editorial-meta" style={{ marginBottom: '12px', color: '#64748B' }}>
              Phase 02
            </div>
            <h3 className="editorial-h3" style={{ fontSize: '18px', marginBottom: '6px', color: '#0F172A' }}>
              Hypothetical Release
            </h3>
            <p className="editorial-body" style={{ fontSize: '13.5px', color: '#475569' }}>
              Simulated discharge parameters and volume model.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ArrowRight style={{ width: 18, height: 18, color: '#94A3B8' }} />
          </div>

          <div
            style={{
              padding: '24px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.90)',
              border: '1px solid rgba(226, 232, 240, 0.90)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <FlaskConical style={{ width: 15, height: 15, color: '#0D9488' }} />
              <span className="editorial-meta" style={{ color: '#64748B' }}>Simulation</span>
            </div>
            <h3 className="editorial-h3" style={{ fontSize: '18px', marginBottom: '6px', color: '#0F172A' }}>
              Forward Movement
            </h3>
            <p className="editorial-body" style={{ fontSize: '13.5px', color: '#475569' }}>
              Forward advection under actual wind and current fields.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ArrowRight style={{ width: 18, height: 18, color: '#94A3B8' }} />
          </div>

          <div
            style={{
              padding: '24px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.90)',
              border: '1px solid rgba(226, 232, 240, 0.90)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
            }}
          >
            <div className="editorial-meta" style={{ marginBottom: '12px', color: '#64748B' }}>
              Verification
            </div>
            <h3 className="editorial-h3" style={{ fontSize: '18px', marginBottom: '6px', color: '#0F172A' }}>
              Observed Match
            </h3>
            <p className="editorial-body" style={{ fontSize: '13.5px', color: '#475569' }}>
              Geometric overlap evaluation against satellite record.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SectionTest;
