import React from 'react';
import { motion } from 'framer-motion';
import { Satellite, ScanLine, Cpu, Target, ShieldCheck } from 'lucide-react';

/* ================================================================
   SECTION: HOW DETECTION BEGINS
   Card-less sequential timeline alignment system.
   Typography: H2 32-40px, H3 24px, Dark Gradient, #000000 Secondary Text.
   Zero cards, zero container boxes.
   ================================================================ */

const DETECTION_STAGES = [
  {
    step: '01',
    title: 'Radar Feed Ingestion',
    copy: 'SAR satellites broadcast raw synthetic aperture radar scenes over surveillance corridors.',
    icon: Satellite,
    secondary: 'Sentinel-1 C-band & Radarsat Constellation · 10m Ground Resolution',
  },
  {
    step: '02',
    title: 'Surface Backscatter Scan',
    copy: 'Algorithms measure normalized radar cross-section, identifying specular reflectance anomalies.',
    icon: ScanLine,
    secondary: 'Wind speed thresholding: 3–12 m/s operational window',
  },
  {
    step: '03',
    title: 'Neural Feature Extraction',
    copy: 'Multi-scale segmentation models distinguish mineral oil slicks from biogenic look-alikes.',
    icon: Cpu,
    secondary: 'Trained on 14,000+ verified maritime discharge scenes',
  },
  {
    step: '04',
    title: 'Candidate Slick Extraction',
    copy: 'Polygon geometries, centroid coordinates, and estimated volume are indexed into the catalog.',
    icon: Target,
    secondary: 'Perimeter curvature, elongation ratio & area quantification',
  },
  {
    step: '05',
    title: 'Scientific Quality Gate',
    copy: 'False-positive mitigation confirms meteorological suitability before backward drift execution.',
    icon: ShieldCheck,
    secondary: 'Human-in-the-loop analyst sign-off and confidence rating',
  },
];

export const HowDetectionBegins: React.FC = () => {
  return (
    <section
      id="features"
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
            <span>Candidate Slick Detection</span>
            <span>·</span>
            <span>From Raw Orbit to Geometry</span>
          </div>

          <h2 className="h2-section" style={{ marginBottom: '16px' }}>
            <span className="text-dark-gradient">How Detection Begins</span>
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
            From high-aperture radar scenes to validated candidate slick polygons, every step is rigorously verified.
          </p>
        </div>

        {/* ── CARD-LESS 5-STAGE PROCESS GRID ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '32px',
            position: 'relative',
          }}
        >
          {DETECTION_STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <motion.div
                key={stage.step}
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
                {/* Step indicator */}
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
                    STAGE {stage.step}
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

                {/* H3 Heading: 24px equivalent */}
                <h3
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '20px',
                    fontWeight: 700,
                    lineHeight: 1.3,
                    marginBottom: '10px',
                  }}
                >
                  <span className="text-dark-gradient">{stage.title}</span>
                </h3>

                {/* Body Copy */}
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
                  {stage.copy}
                </p>

                {/* Pure Black (#000000) Secondary Section Text per spec */}
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
                  {stage.secondary}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowDetectionBegins;
