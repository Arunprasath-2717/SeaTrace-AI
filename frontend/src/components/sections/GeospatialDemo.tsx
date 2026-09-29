import React from 'react';
import { motion } from 'framer-motion';
import { CesiumInvestigation } from '../globe/CesiumInvestigation';
import { Radar, Navigation, Radio } from 'lucide-react';

/* ================================================================
   GEOSPATIAL DEMO — 4D Space-Time Reconstruction
   Translucent liquid glass framing around the 4D geospatial
   investigation canvas with live radar & AIS telemetry.
   ================================================================ */

const STEPS = [
  {
    num:   '01',
    label: 'Satellite SAR Pass',
    desc:  'Sentinel-1A SAR observes capillary wave suppression at T₀. High-confidence polygonal boundary delineated.',
    spec:  '5.405 GHz C-Band · 10m Resolution',
    color: '#0284C7',
    icon:  Radar,
  },
  {
    num:   '02',
    label: 'Lagrangian Backtrack',
    desc:  'HYCOM current analysis and Stokes wind drift calculate the reverse trajectory envelope to find release origin.',
    spec:  '500 Particles · 72h Hydrodynamic Model',
    color: '#0D9488',
    icon:  Radio,
  },
  {
    num:   '03',
    label: 'AIS Trajectory Fusion',
    desc:  'Historical vessel voyage corridor intersects origin window. Forward dispersion confirms observed geometry.',
    spec:  'Spire AIS Class-A · Kinematic Intersect',
    color: '#0284C7',
    icon:  Navigation,
  },
];

export const GeospatialDemo: React.FC = () => (
  <section
    id="geospatial-section"
    style={{ position: 'relative', zIndex: 1, padding: '40px 24px 80px' }}
  >
    <div style={{ maxWidth: '74rem', margin: '0 auto' }}>

      {/* ── Section Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 35, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: 28 }}
      >
        <div
          style={{
            display:        'inline-flex',
            alignItems:     'center',
            gap:            7,
            padding:        '4px 14px',
            borderRadius:   9999,
            background:     'rgba(13, 148, 136, 0.12)',
            border:         '1px solid rgba(13, 148, 136, 0.35)',
            marginBottom:   16,
          }}
        >
          <span
            style={{
              width:        6,
              height:       6,
              borderRadius: '50%',
              background:   '#0D9488',
              boxShadow:    '0 0 8px rgba(13, 148, 136, 0.6)',
              animation:    'pulse-dot 2s infinite',
            }}
          />
          <span
            style={{
              fontFamily:    '"JetBrains Mono", monospace',
              fontSize:      9,
              fontWeight:    700,
              letterSpacing: '0.20em',
              textTransform: 'uppercase',
              color:         '#0F766E',
            }}
          >
            Geospatial Intelligence
          </span>
        </div>

        <h2
          style={{
            fontFamily:    '"Palatino Linotype", Palatino, "Book Antiqua", "EB Garamond", Georgia, serif',
            fontSize:      'clamp(28px, 3.4vw, 44px)',
            fontWeight:    800,
            letterSpacing: '-0.025em',
            lineHeight:    1.12,
            color:         'var(--text-primary)',
            marginBottom:  14,
          }}
        >
          The incident scene,{' '}
          <span style={{ color: '#0D9488' }}>reconstructed in 4D.</span>
        </h2>

        <p
          style={{
            fontFamily:  '"Palatino Linotype", Palatino, "EB Garamond", Georgia, serif',
            fontSize:    'clamp(14px, 1.3vw, 16px)',
            lineHeight:  1.68,
            color:       'var(--text-secondary)',
            maxWidth:    680,
          }}
        >
          SAR imagery, reverse drift vectors, historical AIS waypoints, and forward particle dispersion fused into a unified coordinate system and forensic timeline.
        </p>
      </motion.div>

      {/* ── Cesium Map Container (Framed in Liquid Glass) ── */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="liquid-glass-strong glass-shimmer"
        style={{ padding: 10, overflow: 'hidden', marginBottom: 16 }}
      >
        {/* Tactical HUD Header */}
        <div
          style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            padding:        '10px 16px 12px',
            borderBottom:   '1px solid rgba(255, 255, 255, 0.60)',
            marginBottom:   8,
            flexWrap:       'wrap',
            gap:            8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                width:        8,
                height:       8,
                borderRadius: '50%',
                background:   '#059669',
                boxShadow:    '0 0 8px rgba(5, 150, 105, 0.6)',
              }}
            />
            <span
              style={{
                fontFamily:    '"JetBrains Mono", monospace',
                fontSize:      10,
                fontWeight:    700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color:         'var(--text-primary)',
              }}
            >
              INVESTIGATION SCENE: GULF OF MEXICO · BLOCK MC-20
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize:   9.5,
                color:      'var(--text-muted)',
              }}
            >
              GRID: <strong style={{ color: 'var(--text-primary)' }}>28°14'22"N, 89°24'11"W</strong>
            </span>
            <span
              style={{
                background:    'rgba(5, 150, 105, 0.12)',
                border:        '1px solid rgba(5, 150, 105, 0.35)',
                padding:       '2px 8px',
                borderRadius:  6,
                fontFamily:    '"JetBrains Mono", monospace',
                fontSize:      9,
                fontWeight:    700,
                color:         '#059669',
              }}
            >
              CORRELATED: 94.2% CONFIDENCE
            </span>
          </div>
        </div>

        {/* Cesium canvas viewport */}
        <div
          style={{
            borderRadius: 16,
            overflow:     'hidden',
            border:       '1px solid rgba(255, 255, 255, 0.80)',
            boxShadow:    'inset 0 0 20px rgba(0, 0, 0, 0.05)',
          }}
        >
          <CesiumInvestigation />
        </div>
      </motion.div>

      {/* ── 3 Supporting Step Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.50, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="liquid-glass glass-shimmer"
              style={{
                padding:    '20px 22px',
                transition: 'transform 0.24s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span
                  style={{
                    fontFamily:    '"JetBrains Mono", monospace',
                    fontSize:      10,
                    fontWeight:    700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color:         s.color,
                  }}
                >
                  {s.num} · {s.label}
                </span>
                <Icon style={{ width: 15, height: 15, color: s.color }} />
              </div>

              <p
                style={{
                  fontFamily:   '"Palatino Linotype", Palatino, serif',
                  fontSize:     13,
                  lineHeight:   1.62,
                  color:        'var(--text-secondary)',
                  marginBottom: 12,
                }}
              >
                {s.desc}
              </p>

              <div
                style={{
                  fontFamily:    '"JetBrains Mono", monospace',
                  fontSize:      9.5,
                  fontWeight:    600,
                  color:         'var(--text-dim)',
                  letterSpacing: '0.04em',
                }}
              >
                {s.spec}
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  </section>
);

export default GeospatialDemo;
