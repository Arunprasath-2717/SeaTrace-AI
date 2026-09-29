import React from 'react';
import { Link } from 'react-router-dom';

const FOOTER_LINKS = [
  { label: 'Analyst Console', to: '/app' },
  { label: 'Method',          href: '#workflow' },
  { label: 'Integrity',       href: '#responsible-use' },
];

export const Footer: React.FC = () => (
  <footer
    style={{
      position: 'relative',
      zIndex: 2,
      background: 'rgba(7, 12, 20, 0.60)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255,255,255,0.07)',
      padding: '48px 24px 40px',
    }}
  >
    <div
      style={{
        maxWidth: '1080px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
      }}
    >
      {/* Top row */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '24px',
        }}
      >
        {/* Brand */}
        <div>
          <div
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.10em',
              color: '#F8FAFC',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}
          >
            SeaTrace
          </div>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              lineHeight: 1.6,
              color: '#334155',
              maxWidth: '320px',
            }}
          >
            Satellite-enabled attribution and spatiotemporal reconstruction
            of maritime oil discharge events.
          </p>
        </div>

        {/* Links */}
        <nav style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
          {FOOTER_LINKS.map((link) =>
            'to' in link ? (
              <Link
                key={link.label}
                to={link.to!}
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#334155',
                  textDecoration: 'none',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#94A3B8')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#334155')}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#334155',
                  textDecoration: 'none',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#94A3B8')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#334155')}
              >
                {link.label}
              </a>
            )
          )}
        </nav>
      </div>

      {/* Bottom row */}
      <div
        style={{
          paddingTop: '20px',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '10px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#1E3A5F',
          }}
        >
          © {new Date().getFullYear()} SeaTrace — Maritime Investigation Platform
        </span>
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '10px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#1E3A5F',
          }}
        >
          UNCLOS · SAR · Hydrodynamic Attribution
        </span>
      </div>
    </div>
  </footer>
);

export default Footer;
