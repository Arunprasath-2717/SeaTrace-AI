import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, ArrowRight } from 'lucide-react';

/* ================================================================
   SECTION 05: RECONSTRUCT — PROBABLE ORIGIN (WHITE THEME)
   Visual: slick → ocean movement → probable origin zone
   ================================================================ */

export const SectionReconstruct: React.FC = () => {
  return (
    <section
      id="origin"
      style={{
        padding: '120px 24px',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div style={{ maxWidth: '82rem', margin: '0 auto' }}>
        <div style={{ maxWidth: '640px', marginBottom: '48px' }}>
          <div className="editorial-eyebrow" style={{ marginBottom: '12px' }}>
            05 / METHOD · ORIGIN RECONSTRUCTION
          </div>
          <h2 className="editorial-h2" style={{ marginBottom: '16px', color: '#0F172A' }}>
            RECONSTRUCT
          </h2>
          <p className="editorial-body-lg" style={{ color: '#334155' }}>
            Hydrodynamic drift physics integrate oceanic currents, surface winds and Stokes drift
            backwards through time to identify where the release originally entered the water.
          </p>
        </div>

        {/* Conceptual Visual: slick → ocean movement → probable origin zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              padding: '28px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.90)',
              border: '1px solid rgba(226, 232, 240, 0.90)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
            }}
          >
            <div className="editorial-meta" style={{ marginBottom: '14px', color: '#64748B' }}>
              Input
            </div>
            <h3 className="editorial-h3" style={{ marginBottom: '8px', color: '#0F172A' }}>
              Observed Slick
            </h3>
            <p className="editorial-body" style={{ fontSize: '14px', color: '#475569' }}>
              Observed polygon footprint at the exact satellite capture timestamp.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ArrowRight style={{ width: 20, height: 20, color: '#94A3B8' }} />
          </div>

          <div
            style={{
              padding: '28px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.90)',
              border: '1px solid rgba(226, 232, 240, 0.90)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <RotateCcw style={{ width: 16, height: 16, color: '#0D9488' }} />
              <span className="editorial-meta" style={{ color: '#64748B' }}>Backtracking</span>
            </div>
            <h3 className="editorial-h3" style={{ marginBottom: '8px', color: '#0F172A' }}>
              Ocean Movement
            </h3>
            <p className="editorial-body" style={{ fontSize: '14px', color: '#475569' }}>
              Assimilation of surface currents and atmospheric forcing across the temporal window.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ArrowRight style={{ width: 20, height: 20, color: '#94A3B8' }} />
          </div>

          <div
            style={{
              padding: '28px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.90)',
              border: '1px solid rgba(226, 232, 240, 0.90)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
            }}
          >
            <div className="editorial-meta" style={{ marginBottom: '14px', color: '#64748B' }}>
              Output
            </div>
            <h3 className="editorial-h3" style={{ marginBottom: '8px', color: '#0F172A' }}>
              Probable Origin Zone
            </h3>
            <p className="editorial-body" style={{ fontSize: '14px', color: '#475569' }}>
              Spatiotemporal probability distribution defining the estimated release window.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SectionReconstruct;
