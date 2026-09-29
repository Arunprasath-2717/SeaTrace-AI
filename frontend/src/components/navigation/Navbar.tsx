import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

/* ================================================================
   FLOATING PILL NAVBAR — Dark maritime theme
   - Clean pill floated from top
   - No mobile drawer (links collapse gracefully)
   - Analyst Portal CTA button right-aligned
   ================================================================ */

const NAV_LINKS = [
  { label: 'Method',      href: '#workflow' },
  { label: 'Detection',   href: '#step-detect' },
  { label: 'Attribution', href: '#step-correlate' },
  { label: 'Evidence',    href: '#step-evidence' },
];

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      aria-label="Main Navigation"
      style={{
        position: 'fixed',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        width: 'calc(100% - 32px)',
        maxWidth: '840px',
        height: '50px',
        borderRadius: '9999px',
        background: scrolled
          ? 'rgba(7, 12, 20, 0.92)'
          : 'rgba(7, 12, 20, 0.65)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: scrolled
          ? '0 4px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)'
          : '0 2px 16px rgba(0,0,0,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 6px 0 14px',
        transition: 'background 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      {/* ── Brand ── */}
      <Link
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '9px',
          textDecoration: 'none',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(14,165,233,0.12)',
            border: '1px solid rgba(14,165,233,0.28)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="4" r="1.5" stroke="#38BDF8" strokeWidth="1.4"/>
            <path d="M8 6v8M4 10l4 4 4-4" stroke="#38BDF8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 7.5C3 7.5 3 12 8 12s5-4.5 5-4.5" stroke="#38BDF8" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </div>
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.10em',
            color: '#F8FAFC',
            textTransform: 'uppercase',
          }}
        >
          SeaTrace
        </span>
      </Link>

      {/* ── Center Links (desktop only) ── */}
      <div
        className="hidden md:flex"
        style={{ alignItems: 'center', gap: '2px' }}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              fontWeight: 500,
              color: 'rgba(248,250,252,0.55)',
              textDecoration: 'none',
              padding: '5px 12px',
              borderRadius: '9999px',
              transition: 'color 0.15s ease, background 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#F8FAFC';
              e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(248,250,252,0.55)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* ── Right: CTA ── */}
      <Link
        to="/app"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          height: '36px',
          padding: '0 16px',
          borderRadius: '9999px',
          background: '#0EA5E9',
          color: '#FFFFFF',
          fontFamily: 'Inter, sans-serif',
          fontSize: '13px',
          fontWeight: 600,
          textDecoration: 'none',
          flexShrink: 0,
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
        <span>Analyst Portal</span>
        <ArrowUpRight style={{ width: 13, height: 13 }} />
      </Link>
    </nav>
  );
};

export default Navbar;
