import React from 'react';
import { motion } from 'framer-motion';
import { Target, Waves, RotateCcw, MapPin } from 'lucide-react';

/* ================================================================
   SECTION: RECONSTRUCT THE ORIGIN
   Card-less precision physics grid alignment system.
   Typography: H2 32-40px, H3 24px, Dark Gradient, #000000 Secondary Text.
   Zero cards, zero container boxes.
   ================================================================ */

const ORIGIN_FACTORS = [
  {
    step: '01',
    title: 'Observed Slick Footprint',
    copy: 'High-resolution SAR polygon geometry captures the current surface dispersion shape, centroid coordinates, and tail elongation.',
    icon: Target,
    secondary: 'Spatial coordinates, area extent & surface perimeter ratio',
  },
  {
    step: '02',
    title: 'Hydrodynamic Forcing Fields',
    copy: 'Oceanic current velocity vectors, Stokes drift from surface waves, and ECMWF 10m wind drag are sampled along the temporal path.',
    icon: Waves,
    secondary: 'Copernicus CMEMS 1/12° reanalysis + ECMWF ERA5 wind shear',
  },
  {
    step: '03',
    title: 'Backward Lagrangian Drift',
    copy: 'Thousands of virtual tracer particles are integrated backwards through time to calculate spatiotemporal dispersion probabilities.',
    icon: RotateCcw,
    secondary: 'Runge-Kutta 4th order backward trajectory solver',
  },
  {
    step: '04',
    title: 'Probable Origin Zone',
    copy: 'A 95% confidence origin contour defines the geographic coordinates and time window when the discharge event initially occurred.',
    icon: MapPin,
    secondary: 'Defines the spatiotemporal bounding box for AIS query',
  },
];

export const ReconstructOrigin: React.FC = () => {
  return (
    <section
      id="origin-reconstruction"
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
            <span>Backward Trajectory Physics</span>
            <span>·</span>
            <span>Hydrodynamic Drift</span>
          </div>

          <h2 className="h2-section" style={{ marginBottom: '16px' }}>
            <span className="text-dark-gradient">Reconstruct the Origin</span>
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
            Where could the discharge have started? Backward Lagrangian modeling traces slick trajectories against verified oceanic currents.
          </p>
        </div>

        {/* ── CARD-LESS 4-COLUMN PHYSICS GRID ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '40px',
          }}
        >
          {ORIGIN_FACTORS.map((factor, idx) => {
            const Icon = factor.icon;
            return (
              <motion.div
                key={factor.step}
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
                    STAGE {factor.step}
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
                  <span className="text-dark-gradient">{factor.title}</span>
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
                  {factor.copy}
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
                  {factor.secondary}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ReconstructOrigin;
