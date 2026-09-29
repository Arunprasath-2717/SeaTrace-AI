import React from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, AlertCircle, Wind, CheckCircle2 } from 'lucide-react';

/* ================================================================
   SECTION 04: VALIDATE — VERIFICATION & VALIDATION (WHITE THEME)
   Headline: DON'T TRUST THE DARK PATCH.
   ================================================================ */

const VERIFICATION_CHECKS = [
  {
    id: 'quality',
    title: 'Image Quality',
    icon: SlidersHorizontal,
    metric: 'Spatial Resolution & Noise Floor',
    criteria: [
      'Radar backscatter incidence angle (20° – 45° optimum)',
      'Signal-to-noise ratio threshold validation',
      'Speckle filter convergence & azimuth resolution check',
    ],
    status: 'Calibrated',
  },
  {
    id: 'lookalike',
    title: 'Look-Alike Mitigation',
    icon: AlertCircle,
    metric: 'Biogenic vs. Mineral Discrimination',
    criteria: [
      'Algal bloom chlorophyll & temperature signature exclusion',
      'Wind shadow & bathymetric calm water differentiation',
      'Internal wave damping & grease ice rejection',
    ],
    status: 'Discriminated',
  },
  {
    id: 'environment',
    title: 'Environmental Envelope',
    icon: Wind,
    metric: 'Meteoceanic Boundary Conditions',
    criteria: [
      'Surface wind speed within 3.0 – 12.0 m/s diagnostic band',
      'Copernicus marine surface current vector alignment',
      'Upper-layer boundary shear & thermal stratification',
    ],
    status: 'Conforming',
  },
];

export const SectionValidate: React.FC = () => {
  return (
    <section
      id="validation"
      style={{
        padding: '120px 24px',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div style={{ maxWidth: '82rem', margin: '0 auto' }}>
        <div style={{ maxWidth: '680px', marginBottom: '48px' }}>
          <div className="editorial-eyebrow" style={{ marginBottom: '12px' }}>
            04 / METHOD · VERIFICATION & VALIDATION
          </div>
          <h2 className="editorial-h2" style={{ marginBottom: '16px', color: '#0F172A' }}>
            DON'T TRUST THE DARK PATCH.
          </h2>
          <p className="editorial-body-lg" style={{ color: '#334155' }}>
            A low-backscatter radar anomaly is not proof of oil. Before attributing responsibility,
            candidate slicks must survive rigorous multi-spectral verification to eliminate false positives
            from natural surfactants, calm water shadows, and sensor artifacts.
          </p>
        </div>

        {/* 3 Visual Verification Checks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          {VERIFICATION_CHECKS.map((check) => {
            const Icon = check.icon;
            return (
              <div
                key={check.id}
                style={{
                  padding: '32px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.90)',
                  border: '1px solid rgba(226, 232, 240, 0.90)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Icon style={{ width: 18, height: 18, color: '#0D9488' }} />
                      <span className="editorial-meta" style={{ color: '#64748B' }}>{check.metric}</span>
                    </div>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        color: '#059669',
                        background: 'rgba(5, 150, 105, 0.08)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        border: '1px solid rgba(5, 150, 105, 0.20)',
                      }}
                    >
                      <CheckCircle2 style={{ width: 12, height: 12 }} />
                      {check.status}
                    </span>
                  </div>

                  <h3 className="editorial-h3" style={{ marginBottom: '14px', color: '#0F172A' }}>
                    {check.title}
                  </h3>

                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {check.criteria.map((item, idx) => (
                      <li
                        key={idx}
                        style={{
                          fontSize: '13.5px',
                          lineHeight: 1.5,
                          color: '#475569',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                        }}
                      >
                        <span
                          style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            background: '#0D9488',
                            marginTop: '7px',
                            flexShrink: 0,
                          }}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default SectionValidate;
