import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Compass, ShieldCheck } from 'lucide-react';

/* ================================================================
   SECTION: FINAL CALL TO ACTION
   Spacious open typographic CTA floating over ocean horizon.
   Typography: H1/H2 48-64px, Dark Gradient, #000000 Secondary Text.
   Zero cards, zero container boxes.
   ================================================================ */

export const FinalCTA: React.FC = () => {
  return (
    <section
      id="investigation-cta"
      style={{
        minHeight: '75vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
        padding: '120px 36px 140px',
        textAlign: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.75, ease: [0.1, 0.9, 0.2, 1] }}
        style={{
          maxWidth: '820px',
          width: '100%',
          margin: '0 auto',
        }}
      >
        {/* Status Pill */}
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
            marginBottom: '20px',
          }}
        >
          <Compass style={{ width: 16, height: 16 }} />
          <span>Operational Ready · Production Intelligence</span>
        </div>

        {/* Big Impact Heading: 48-64px with dark gradient */}
        <h2
          className="h1-hero"
          style={{
            marginBottom: '24px',
          }}
        >
          <span className="text-dark-gradient" style={{ display: 'block' }}>
            See the Investigation
          </span>
          <span className="text-cyan-gradient" style={{ display: 'block', marginTop: '6px' }}>
            In Full Resolution
          </span>
        </h2>

        {/* Primary Subtitle */}
        <p
          className="text-dark-gradient"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(17px, 1.35vw, 20px)',
            lineHeight: 1.6,
            fontWeight: 500,
            maxWidth: '640px',
            margin: '0 auto 16px',
          }}
        >
          Follow real-world maritime spill incidents from initial satellite radar observation to an immutable evidentiary attribution dossier.
        </p>

        {/* Pure Black (#000000) Secondary Section Text */}
        <p
          className="text-secondary-section"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '14px',
            lineHeight: 1.5,
            fontWeight: 600,
            letterSpacing: '0.02em',
            maxWidth: '540px',
            margin: '0 auto 40px',
            opacity: 0.85,
          }}
        >
          Zero installation required · Pre-configured Sentinel-1 & AIS demo datasets available in sandbox
        </p>

        {/* Action Button: Reference Image Cyan Pill Button */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Link
            to="/workbench"
            className="btn-pill-explore"
            style={{
              height: '52px',
              padding: '0 36px',
              fontSize: '14.5px',
            }}
          >
            <span>LAUNCH WORKBENCH</span>
            <ArrowUpRight style={{ width: 18, height: 18 }} />
          </Link>

          <a
            href="#technology"
            className="btn-ghost-maritime"
            style={{
              height: '52px',
              padding: '0 28px',
              fontSize: '14px',
            }}
          >
            <span>EXPLORE METHODOLOGY</span>
          </a>
        </div>

        {/* Trust Badges */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '28px',
            marginTop: '56px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(45, 212, 191, 0.25)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck style={{ width: 16, height: 16, color: '#0D9488' }} />
            <span className="text-secondary-section" style={{ fontSize: '12.5px', fontWeight: 600 }}>
              UNCLOS Maritime Protocol Compliant
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2DD4BF' }} />
            <span className="text-secondary-section" style={{ fontSize: '12.5px', fontWeight: 600 }}>
              Copernicus CMEMS & ESA Sentinel Verified
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default FinalCTA;
