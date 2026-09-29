import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';

/* ================================================================
   HERO — Floating Content over 3D Maritime Scene with Vessel
   ─────────────────────────────────────────────────────────────
   - 3D vessel & ocean scene preserved with sticky scroll rotation
   - Redesigned text colors: High-contrast pure white (#FFFFFF) & sky blue (#38BDF8)
   - Zero washed-out gradients: Razor-sharp legibility over 3D water & ship
   - Single "Enter Investigation" CTA button in hero section
   ================================================================ */

interface HeroProps {
  onScrollProgress?: (progress: number) => void;
}

export const HeroContent: React.FC<HeroProps> = ({ onScrollProgress }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;
      const progress =
        scrollableDistance > 0 ? Math.max(0, Math.min(1, -rect.top / scrollableDistance)) : 0;
      onScrollProgress?.(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onScrollProgress]);

  return (
    <div
      ref={containerRef}
      style={{ height: '220vh', position: 'relative' }}
    >
      {/* Sticky viewport — completely transparent, 3D ocean & vessel visible */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100svh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '0 24px',
          background: 'transparent',
        }}
      >
        {/* Hero Content — Centered, floating with strong contrast */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: '880px',
            width: '100%',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '0 auto',
          }}
        >
          {/* Status line — Clean floating glass pill */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginBottom: '24px' }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '7px 18px',
                borderRadius: '9999px',
                background: 'rgba(10, 25, 53, 0.65)',
                border: '1px solid rgba(56, 189, 248, 0.32)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: '0 2px 16px rgba(0, 0, 0, 0.35)',
              }}
            >
              <span
                style={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '8px',
                  height: '8px',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: '#10B981',
                    animation: 'ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite',
                    opacity: 0.75,
                  }}
                />
                <span
                  style={{
                    position: 'relative',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#10B981',
                  }}
                />
              </span>
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  color: '#7DD3FC',
                  textTransform: 'uppercase',
                }}
              >
                Maritime Intelligence Platform
              </span>
            </div>
          </motion.div>

          {/* ── Redesigned Headline: Crisp solid typography with high-contrast text-shadows ── */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: '"Palatino Linotype", "Book Antiqua", Palatino, Georgia, serif',
              fontSize: 'clamp(44px, 6.5vw, 84px)',
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: '-0.025em',
              marginBottom: '24px',
              textAlign: 'center',
            }}
          >
            <span
              style={{
                color: '#FFFFFF',
                textShadow: '0 4px 30px rgba(0, 0, 0, 0.9), 0 2px 8px rgba(0, 0, 0, 0.95)',
                display: 'inline-block',
              }}
            >
              From Detection
            </span>
            <br />
            <span
              style={{
                color: '#38BDF8',
                textShadow: '0 4px 30px rgba(14, 165, 233, 0.6), 0 2px 10px rgba(0, 0, 0, 0.9)',
                display: 'inline-block',
              }}
            >
              to Evidence.
            </span>
          </motion.h1>

          {/* ── Subtitle — Crisp Light Slate with contrast shadow ── */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{
              maxWidth: '600px',
              marginBottom: '38px',
              lineHeight: 1.65,
              color: '#F1F5F9',
              fontSize: '18px',
              fontFamily: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
              fontWeight: 400,
              textShadow: '0 2px 14px rgba(0, 0, 0, 0.85), 0 1px 4px rgba(0, 0, 0, 0.95)',
            }}
          >
            Detect oil slicks from space, reconstruct their origin, and
            attribute them to the responsible vessel — with court-ready evidence.
          </motion.p>

          {/* ── Call To Action Buttons ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '14px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Link
              to="/app"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '9px',
                height: '50px',
                padding: '0 30px',
                borderRadius: '12px',
                background: '#0EA5E9',
                color: '#FFFFFF',
                fontFamily: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(14, 165, 233, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#38BDF8';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 28px rgba(56, 189, 248, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#0EA5E9';
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(14, 165, 233, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.25)';
              }}
            >
              <span>Enter Investigation</span>
              <ArrowRight style={{ width: 17, height: 17 }} />
            </Link>

            <a
              href="#workflow"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                height: '50px',
                padding: '0 26px',
                borderRadius: '12px',
                background: 'rgba(10, 25, 53, 0.60)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#FFFFFF',
                fontFamily: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
                fontSize: '15px',
                fontWeight: 500,
                textDecoration: 'none',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                boxShadow: '0 2px 14px rgba(0, 0, 0, 0.35)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.50)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(10, 25, 53, 0.60)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <span>See how it works</span>
              <ChevronDown style={{ width: 16, height: 16, opacity: 0.8 }} />
            </a>
          </motion.div>

          {/* ── Metrics Strip ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              marginTop: '56px',
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {[
              { value: '10m', label: 'SAR Resolution' },
              { value: '94.8%', label: 'Detection Accuracy' },
              { value: '< 1hr', label: 'Attribution Time' },
            ].map((stat, idx) => (
              <div
                key={stat.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    textAlign: 'center',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    background: 'rgba(10, 25, 53, 0.70)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.35)',
                  }}
                >
                  <div
                    style={{
                      fontFamily: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
                      fontSize: '24px',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      lineHeight: 1,
                      marginBottom: '6px',
                      textShadow: '0 2px 10px rgba(0, 0, 0, 0.6)',
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      color: '#94A3B8',
                      textTransform: 'uppercase',
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
                {idx < 2 && (
                  <span
                    style={{
                      display: 'inline-block',
                      width: '1px',
                      height: '28px',
                      background: 'rgba(255, 255, 255, 0.15)',
                    }}
                  />
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroContent;
