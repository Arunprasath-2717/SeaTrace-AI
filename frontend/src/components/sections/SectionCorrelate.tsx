import React from 'react';
import { motion } from 'framer-motion';
import { Navigation2, ArrowRight } from 'lucide-react';

/* ================================================================
   SECTION 06: CORRELATE — VESSEL TRAJECTORIES (WHITE THEME)
   Visual: origin zone + time window → AIS tracks → candidate vessels
   ================================================================ */

export const SectionCorrelate: React.FC = () => {
  return (
    <section
      id="vessels"
      style={{
        padding: '120px 24px',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div style={{ maxWidth: '82rem', margin: '0 auto' }}>
        <div style={{ maxWidth: '640px', marginBottom: '48px' }}>
          <div className="editorial-eyebrow" style={{ marginBottom: '12px' }}>
            06 / METHOD · VESSEL TRAJECTORIES
          </div>
          <h2 className="editorial-h2" style={{ marginBottom: '16px', color: '#0F172A' }}>
            CORRELATE
          </h2>
          <p className="editorial-body-lg" style={{ color: '#334155' }}>
            Historical Automatic Identification System (AIS) transponder data is cross-referenced
            against the reconstructed origin window to identify candidate traffic intersecting the zone.
          </p>
        </div>

        {/* Conceptual Visual: origin zone + time window → AIS tracks → candidate vessels */}
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
              Spatial Window
            </div>
            <h3 className="editorial-h3" style={{ marginBottom: '8px', color: '#0F172A' }}>
              Origin Zone + Time
            </h3>
            <p className="editorial-body" style={{ fontSize: '14px', color: '#475569' }}>
              Spatial bounding envelope and temporal release window derived from backward drift physics.
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
              <Navigation2 style={{ width: 16, height: 16, color: '#0D9488' }} />
              <span className="editorial-meta" style={{ color: '#64748B' }}>Telemetry</span>
            </div>
            <h3 className="editorial-h3" style={{ marginBottom: '8px', color: '#0F172A' }}>
              AIS Tracks
            </h3>
            <p className="editorial-body" style={{ fontSize: '14px', color: '#475569' }}>
              Transponder broadcasts filtered by timestamp, speed changes, and course alterations.
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
              Attribution Candidate
            </div>
            <h3 className="editorial-h3" style={{ marginBottom: '8px', color: '#0F172A' }}>
              Candidate Vessels
            </h3>
            <p className="editorial-body" style={{ fontSize: '14px', color: '#475569' }}>
              Ranked list of vessels with spatiotemporal intersection compatibility and behavioral context.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SectionCorrelate;
