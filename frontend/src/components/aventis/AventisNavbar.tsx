import React, { useState, useEffect } from 'react';
import { Search, Menu, X, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenBooking: () => void;
}

export const AventisNavbar: React.FC<NavbarProps> = ({ onOpenSearch, onOpenBooking }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        id="main-header"
        style={{
          width: '100%',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: scrolled ? '14px 48px' : '22px 48px',
          background: scrolled
            ? 'rgba(7, 15, 23, 0.88)'
            : 'linear-gradient(to bottom, rgba(7, 15, 23, 0.65), rgba(7, 15, 23, 0))',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled
            ? '1px solid rgba(197, 155, 95, 0.2)'
            : '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: scrolled ? '0 10px 30px rgba(0, 0, 0, 0.35)' : 'none',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Branding Logo */}
        <a href="#hero-runway" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img
            src="/images/logo.svg"
            alt="Aventis Yacht Charters"
            style={{ height: '42px', width: 'auto', display: 'block' }}
          />
        </a>

        {/* Desktop Navigation Links */}
        <nav
          className="desktop-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '36px',
          }}
        >
          {[
            { label: 'Home', href: '#hero-runway' },
            { label: 'About', href: '#about' },
            { label: 'Fleet', href: '#fleet' },
            { label: 'Experiences', href: '#experiences' },
            { label: 'Destinations', href: '#destinations' },
            { label: 'Testimonials', href: '#testimonials' },
            { label: 'Contact', href: '#contact' },
          ].map((item) => (
            <a key={item.label} href={item.href} className="aventis-nav-link">
              {item.label}
            </a>
          ))}
        </nav>

        {/* Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Search Trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search yachts"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-gold)';
              e.currentTarget.style.color = 'var(--color-gold)';
              e.currentTarget.style.background = 'rgba(197, 155, 95, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            }}
          >
            <Search size={18} />
          </button>

          {/* Book CTA Button */}
          <button
            type="button"
            onClick={onOpenBooking}
            className="btn-gold desktop-cta"
            style={{ height: '44px', padding: '0 24px' }}
          >
            <span>Book a Yacht</span>
            <ArrowRight size={15} />
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="mobile-hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
            style={{
              background: 'none',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              padding: '6px',
            }}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            backgroundColor: 'rgba(7, 15, 23, 0.98)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '24px',
            padding: '40px',
          }}
        >
          {[
            { label: 'Home', href: '#hero-runway' },
            { label: 'About', href: '#about' },
            { label: 'Fleet', href: '#fleet' },
            { label: 'Experiences', href: '#experiences' },
            { label: 'Destinations', href: '#destinations' },
            { label: 'Testimonials', href: '#testimonials' },
            { label: 'Contact', href: '#contact' },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontFamily: "var(--font-serif), 'Cormorant Garamond', Georgia, serif",
                fontSize: '28px',
                color: '#FFFFFF',
                textDecoration: 'none',
                letterSpacing: '1px',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#FFFFFF')}
            >
              {item.label}
            </a>
          ))}

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenBooking();
            }}
            className="btn-gold"
            style={{ marginTop: '20px', width: '220px', height: '48px' }}
          >
            <span>Book a Yacht</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 992px) {
          .desktop-nav, .desktop-cta {
            display: none !important;
          }
          .mobile-hamburger {
            display: block !important;
          }
          #main-header {
            padding: 16px 24px !important;
          }
        }
        @media (min-width: 993px) {
          .mobile-hamburger {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};
