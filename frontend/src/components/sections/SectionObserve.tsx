import React from 'react';
import { motion } from 'framer-motion';
import { Satellite, ArrowRight } from 'lucide-react';

/* ================================================================
   SECTION 02: OBSERVE — SATELLITE OBSERVATION (WHITE THEME)
   Visual: satellite image → candidate surface pattern
   ================================================================ */

export const SectionObserve: React.FC = () => {
  return (
    <section
      id="method"
      style={{
        padding: '120px 24px',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div style={{ maxWidth: '82rem', margin: '0 auto' }}>
        <div style={{ maxWidth: '640px', marginBottom: '48px' }}>
          <div className="editorial-eyebrow" style={{ marginBottom: '12px' }}>
            02 / METHOD · SATELLITE OBSERVATION
          </div>
          <h2 className="editorial-h2" style={{ marginBottom: '16px', color: '#0F172A' }}>
            OBSERVE
          </h2>
          <p className="editorial-body-lg" style={{ color: '#334155' }}>
            Synthetic Aperture Radar (SAR) sensors penetrate darkness and cloud cover to measure
            ocean surface roughness, capturing dampening patterns characteristic of surface oil films.
          </p>
        </div>

        {/* Conceptual Visual: satellite image → candidate surface pattern */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              padding: '32px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.90)',
              border: '1px solid rgba(226, 232, 240, 0.90)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Satellite style={{ width: 18, height: 18, color: '#0D9488' }} />
              <span className="editorial-meta" style={{ color: '#64748B' }}>Orbital Acquisition</span>
            </div>
            <h3 className="editorial-h3" style={{ marginBottom: '8px', color: '#0F172A' }}>
              Radar Backscatter
            </h3>
            <p className="editorial-body" style={{ color: '#475569' }}>
              Wide-swath orbital radar captures ocean specular reflection variations across coastal shipping corridors.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ArrowRight style={{ width: 24, height: 24, color: '#94A3B8' }} />
          </div>

          <div
            style={{
              padding: '32px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.90)',
              border: '1px solid rgba(226, 232, 240, 0.90)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
            }}
          >
            <div className="editorial-meta" style={{ marginBottom: '16px', color: '#64748B' }}>
              Surface Verification
            </div>
            <h3 className="editorial-h3" style={{ marginBottom: '8px', color: '#0F172A' }}>
              Candidate Surface Pattern
            </h3>
            <p className="editorial-body" style={{ color: '#475569' }}>
              Anomalous low-backscatter geometries are isolated from baseline maritime roughness for detailed analysis.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SectionObserve;
