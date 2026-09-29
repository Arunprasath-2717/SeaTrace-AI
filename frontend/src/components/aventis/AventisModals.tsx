import React, { useEffect, useState } from 'react';
import { X, Search, Calendar, Users, Compass, Anchor, Send } from 'lucide-react';

interface ModalsProps {
  searchOpen: boolean;
  bookingOpen: boolean;
  onCloseSearch: () => void;
  onCloseBooking: () => void;
  initialYacht?: string;
}

export const AventisModals: React.FC<ModalsProps> = ({
  searchOpen,
  bookingOpen,
  onCloseSearch,
  onCloseBooking,
  initialYacht = 'The Meridian',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYacht, setSelectedYacht] = useState(initialYacht);
  const [destination, setDestination] = useState('Newport & New England');
  const [guests, setGuests] = useState('8');
  const [dates, setDates] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (initialYacht) setSelectedYacht(initialYacht);
  }, [initialYacht]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseSearch();
        onCloseBooking();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCloseSearch, onCloseBooking]);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onCloseBooking();
    }, 2200);
  };

  return (
    <>
      {/* ════════════════ SEARCH MODAL ════════════════ */}
      {searchOpen && (
        <div
          id="search-modal"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            backgroundColor: 'rgba(7, 15, 23, 0.96)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={onCloseSearch}
        >
          <button
            onClick={onCloseSearch}
            aria-label="Close search"
            style={{
              position: 'absolute',
              top: '36px',
              right: '48px',
              background: 'none',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              opacity: 0.75,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.75')}
          >
            <X size={32} />
          </button>

          <div
            style={{ width: '100%', maxWidth: '720px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                borderBottom: '2px solid var(--color-gold)',
                paddingBottom: '16px',
                marginBottom: '28px',
              }}
            >
              <Search size={32} color="var(--color-gold)" />
              <input
                type="text"
                autoFocus
                placeholder="Search yachts, destinations, itineraries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: '#FFFFFF',
                  fontFamily: "var(--font-serif), 'Cormorant Garamond', Georgia, serif",
                  fontSize: 'clamp(24px, 4vw, 36px)',
                  fontWeight: 500,
                }}
              />
            </div>

            {/* Quick Filter Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginRight: '8px' }}>
                Popular:
              </span>
              {[
                'Bahamas',
                '50m+ Motor Yachts',
                'Summer in Greece',
                'Catamarans',
                'Amalfi Coast',
                'Newport Classic',
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setSearchQuery(chip)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '9999px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(197, 155, 95, 0.3)',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--color-gold)';
                    e.currentTarget.style.color = '#070F17';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════ CHARTER BOOKING MODAL ════════════════ */}
      {bookingOpen && (
        <div
          id="booking-modal"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            backgroundColor: 'rgba(7, 15, 23, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            overflowY: 'auto',
          }}
          onClick={onCloseBooking}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '640px',
              backgroundColor: 'var(--color-navy-card)',
              border: '1px solid rgba(197, 155, 95, 0.3)',
              borderRadius: '20px',
              padding: 'clamp(32px, 5vw, 48px)',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
              margin: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onCloseBooking}
              aria-label="Close dialog"
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                background: 'none',
                border: 'none',
                color: '#FFFFFF',
                cursor: 'pointer',
                opacity: 0.7,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
            >
              <X size={24} />
            </button>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(197, 155, 95, 0.15)',
                    border: '1px solid var(--color-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    color: 'var(--color-gold)',
                  }}
                >
                  <Anchor size={32} />
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-serif), 'Cormorant Garamond', Georgia, serif",
                    fontSize: '32px',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    marginBottom: '12px',
                  }}
                >
                  Inquiry Received
                </h3>
                <p style={{ color: 'var(--color-text-dim)', fontSize: '15px', lineHeight: 1.6 }}>
                  An Aventis senior charter broker will contact you discreetly within four hours with custom yacht options.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit}>
                <div style={{ marginBottom: '24px' }}>
                  <span className="aventis-eyebrow" style={{ marginBottom: '8px' }}>
                    Private Consultation
                  </span>
                  <h3
                    style={{
                      fontFamily: "var(--font-serif), 'Cormorant Garamond', Georgia, serif",
                      fontSize: 'clamp(28px, 4vw, 36px)',
                      fontWeight: 600,
                      color: '#FFFFFF',
                      lineHeight: 1.15,
                    }}
                  >
                    Curate Your Voyage
                  </h3>
                  <p style={{ color: 'var(--color-text-dim)', fontSize: '14.5px', marginTop: '6px' }}>
                    Discreet, personalized itinerary planning with our world-class yacht brokerage team.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-gold)', marginBottom: '8px' }}>
                      <Compass size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                      Destination
                    </label>
                    <select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#FFFFFF',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    >
                      <option value="Newport & New England">Newport & New England</option>
                      <option value="The Bahamas & Exumas">The Bahamas & Exumas</option>
                      <option value="French Riviera & Monaco">French Riviera & Monaco</option>
                      <option value="Amalfi Coast & Capri">Amalfi Coast & Capri</option>
                      <option value="Greek Cyclades">Greek Cyclades</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-gold)', marginBottom: '8px' }}>
                      <Anchor size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                      Yacht Preference
                    </label>
                    <select
                      value={selectedYacht}
                      onChange={(e) => setSelectedYacht(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#FFFFFF',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    >
                      <option value="The Meridian">The Meridian (164ft Motor Yacht)</option>
                      <option value="Ocean Breeze">Ocean Breeze (120ft Sailing Yacht)</option>
                      <option value="Aqua Vida">Aqua Vida (82ft Luxury Catamaran)</option>
                      <option value="Custom Search">Broker Recommended</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-gold)', marginBottom: '8px' }}>
                      <Calendar size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                      Charter Dates
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. July 12 - July 22, 2026"
                      value={dates}
                      onChange={(e) => setDates(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#FFFFFF',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-gold)', marginBottom: '8px' }}>
                      <Users size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                      Guests
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#FFFFFF',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-gold)', marginBottom: '8px' }}>
                    Special Requests or Itinerary Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your culinary preferences, celebratory occasions, or water toy requirements..."
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      outline: 'none',
                      resize: 'none',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-gold"
                  style={{ width: '100%', height: '50px', fontSize: '15px' }}
                >
                  <span>Submit Bespoke Inquiry</span>
                  <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
