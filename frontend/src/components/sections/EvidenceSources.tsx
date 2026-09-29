import React from 'react';
import { motion } from 'framer-motion';
import { Satellite, Waves, Navigation2, MapPin } from 'lucide-react';

/* ================================================================
   SECTION: WHERE THE EVIDENCE COMES FROM
   Card-less enterprise grid alignment system.
   Typography: H2 32-40px, H3 24px, Dark Gradient, #000000 Secondary Text.
   Zero cards, zero container boxes.
   ================================================================ */

const SOURCES = [
  {
    index: '01',
    category: 'Satellite Radar',
    title: 'Synthetic Aperture Radar',
    copy: 'High-frequency radar beams detect subtle surface roughness changes. Hydrocarbon films dampen capillary waves, presenting characteristic dark signatures irrespective of cloud cover.',
    icon: Satellite,
    telemetry: 'Sentinel-1 & Radarsat-2 Constellation feeds',
  },
  {
    index: '02',
    category: 'Ocean Dynamics',
    title: 'Hydrodynamic Forcing',
    copy: 'Continuous assimilation of surface currents, wave drift, and wind shear from Copernicus CMEMS and ECMWF reanalysis to model multi-day water transport.',
    icon: Waves,
    telemetry: '0.083° global ocean physics reanalysis',
  },
  {
    index: '03',
    category: 'Maritime Traffic',
    title: 'AIS Trajectory Ingestion',
    copy: 'Global Automatic Identification System transponder records cross-correlated in space and time against backward drift trajectories.',
    icon: Navigation2,
    telemetry: 'Terrestrial & satellite S-AIS stream ingestion',
  },
  {
    index: '04',
    category: 'Jurisdiction',
    title: 'Geospatial Boundaries',
    copy: 'Exclusive Economic Zones (EEZ), marine protected areas, and international shipping lanes contextualize legal jurisdiction and compliance protocols.',
    icon: MapPin,
    telemetry: 'UNCLOS 200nm baseline boundaries',
  },
];

export const EvidenceSources: React.FC = () => {
  return (
    <section
      id="technology"
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
            <span>Foundational Inputs</span>
            <span>·</span>
            <span>Multi-Source Ingestion</span>
          </div>

          <h2 className="h2-section" style={{ marginBottom: '16px' }}>
            <span className="text-dark-gradient">Where the Evidence Comes From</span>
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
            A cohesive evidentiary chain requires multi-modal sensor inputs to isolate true maritime discharge events from natural surface anomalies.
          </p>
        </div>

        {/* ── CARD-LESS 4-COLUMN PRECISION GRID ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '40px',
          }}
        >
          {SOURCES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.category}
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
                {/* Header row: Index & Category */}
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
                      fontSize: '13px',
                      fontWeight: 800,
                      color: '#0D9488',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {item.index}
                  </span>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#0F766E',
                    }}
                  >
                    <Icon style={{ width: 17, height: 17 }} />
                    <span
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.10em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* H3 Heading: 24px */}
                <h3
                  className="h3-feature"
                  style={{
                    marginBottom: '12px',
                  }}
                >
                  <span className="text-dark-gradient">{item.title}</span>
                </h3>

                {/* Body Copy: Dark gradient depth */}
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
                  {item.copy}
                </p>

                {/* Pure Black (#000000) Secondary Section Text per spec */}
                <div
                  className="text-secondary-section"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                    opacity: 0.85,
                    paddingTop: '12px',
                    borderTop: '1px dashed rgba(9, 30, 47, 0.15)',
                  }}
                >
                  {item.telemetry}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EvidenceSources;
