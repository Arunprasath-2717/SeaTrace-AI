import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import GradientText from '../ui/GradientText';

/* ================================================================
   FINAL CTA — Transparent over 3D scene
   - Zero solid background — dark sea canvas shows through fully
   - Frosted glass pill for the CTA content block
   - White text, sky-blue accents
   ================================================================ */

export const SectionFinalCTA: React.FC = () => (
  <section
    id="access"
    style={{
      position: 'relative',
      zIndex: 2,
      background: 'transparent',
      padding: '140px 24px 160px',
      textAlign: 'center',
    }}
  >
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        position: 'relative',
        /* Frosted glass pill around the CTA block */
        background: 'rgba(7, 12, 20, 0.50)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: '24px',
        padding: '60px 48px',
      }}
    >
      {/* Top eyebrow */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '24px',
        }}
      >
        <div style={{ width: '20px', height: '1px', background: '#38BDF8' }} />
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#38BDF8',
          }}
        >
          Access · Verified Investigation
        </span>
        <div style={{ width: '20px', height: '1px', background: '#38BDF8' }} />
      </div>

      {/* Headline with GradientText */}
      <div style={{ marginBottom: '20px' }}>
        <GradientText
          colors={[
            '#38BDF8',
            '#0EA5E9',
            '#2563EB',
            '#06B6D4',
            '#14B8A6',
            '#10B981',
            '#4ADE80',
            '#22C55E',
            '#0D9488',
            '#0284C7',
            '#38BDF8',
          ]}
          animationSpeed={6}
          pauseOnHover={false}
          showBorder={false}
          className="cta-gradient-title"
        >
          Begin your investigation.
        </GradientText>
      </div>

      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '15px',
          lineHeight: 1.65,
          color: 'rgba(148,163,184,0.80)',
          marginBottom: '36px',
        }}
      >
        Access active maritime observation scenes, origin trajectory reconstructions,
        and candidate vessel attribution dossiers in the analyst console.
      </p>

      {/* CTA Button */}
      <Link
        to="/app"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          height: '52px',
          padding: '0 32px',
          borderRadius: '10px',
          background: '#0EA5E9',
          color: '#FFFFFF',
          fontFamily: 'Inter, sans-serif',
          fontSize: '15px',
          fontWeight: 600,
          textDecoration: 'none',
          transition: 'background 0.15s ease, transform 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#38BDF8';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#0EA5E9';
          e.currentTarget.style.transform = 'none';
        }}
      >
        <span>Enter Investigation</span>
        <ArrowRight style={{ width: 17, height: 17 }} />
      </Link>

      {/* Trust signals */}
      <div
        style={{
          marginTop: '36px',
          display: 'flex',
          gap: '28px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        {['UNCLOS Compliant', 'SAR Verified', 'Court-Ready Dossiers'].map((label) => (
          <div
            key={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'rgba(148,163,184,0.40)',
            }}
          >
            <div
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: 'rgba(148,163,184,0.30)',
              }}
            />
            {label}
          </div>
        ))}
      </div>
    </motion.div>
  </section>
);

export default SectionFinalCTA;
