import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Anchor, CheckCircle, ExternalLink } from 'lucide-react';

/* ================================================================
   STRATEGIC CARD 2: FORENSIC ATTRIBUTION DOSSIER CARD
   Exact 30% opacity transparent glass with water refraction border
   and interactive vessel trajectory correlation matrix.
   Typography: H2 32-40px, H3 24px, Dark Gradient + Pure Black #000000
   ================================================================ */

interface CandidateVessel {
  id: string;
  name: string;
  mmsi: string;
  flag: string;
  type: string;
  compatibilityScore: number;
  timeDelta: string;
  distanceDelta: string;
  speedDrop: string;
  status: 'Primary Candidate' | 'Secondary Candidate' | 'Excluded';
  riskRating: 'High' | 'Medium' | 'Low';
  notes: string;
}

const CANDIDATES: CandidateVessel[] = [
  {
    id: 'v1',
    name: 'MT Poseidon Trader',
    mmsi: '244830000',
    flag: 'Liberia (LR)',
    type: 'Crude Oil Tanker (274m)',
    compatibilityScore: 96.8,
    timeDelta: '+12 minutes within window',
    distanceDelta: '320 meters from origin core',
    speedDrop: '14.2 kn → 5.8 kn (Slowing)',
    status: 'Primary Candidate',
    riskRating: 'High',
    notes: 'Significant course deviation and throttle reduction coincident with estimated discharge timestamp. No distress call broadcast.',
  },
  {
    id: 'v2',
    name: 'Pacific Mariner',
    mmsi: '352001840',
    flag: 'Panama (PA)',
    type: 'Bulk Carrier (225m)',
    compatibilityScore: 42.1,
    timeDelta: '-3.2 hours prior to slick',
    distanceDelta: '8.4 km from origin boundary',
    speedDrop: '11.8 kn constant (Transit)',
    status: 'Secondary Candidate',
    riskRating: 'Medium',
    notes: 'Maintained steady commercial lane speed. Peripheral trajectory intersection does not match backward drift propagation.',
  },
  {
    id: 'v3',
    name: 'Ocean Voyager',
    mmsi: '211284920',
    flag: 'Germany (DE)',
    type: 'Container Ship (300m)',
    compatibilityScore: 11.4,
    timeDelta: '+8.5 hours post-discharge',
    distanceDelta: '22.1 km outside zone',
    speedDrop: '18.4 kn constant (Transit)',
    status: 'Excluded',
    riskRating: 'Low',
    notes: 'Temporal window mismatch rules out involvement. Transponder remained continuously active with nominal engine parameters.',
  },
];

export const ForensicDossierCard: React.FC = () => {
  const [selectedVessel, setSelectedVessel] = useState<CandidateVessel>(CANDIDATES[0]);

  return (
    <section
      id="forensic-dossier"
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
        <div style={{ marginBottom: '48px', maxWidth: '720px' }}>
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
            <span>Strategic Forensic Matrix</span>
            <span>·</span>
            <span>Evidentiary Attribution</span>
          </div>

          <h2 className="h2-section" style={{ marginBottom: '16px' }}>
            <span className="text-dark-gradient">Vessel Trajectory Compatibility Matrix</span>
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
            Objective spatiotemporal correlation cross-referencing satellite reverse drift models with historical AIS transponder telemetry.
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════
            STRATEGIC CARD 2: 30% Translucent Refractive Glass
            Realistic water-like refraction, caustic rim, interactive dossier
            ═════════════════════════════════════════════════════ */}
        <div
          className="glass-card-30"
          style={{
            padding: '36px 40px',
            boxShadow: '0 24px 60px -15px rgba(13, 148, 136, 0.20), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
          }}
        >
          {/* Card Top Metadata Bar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              paddingBottom: '24px',
              borderBottom: '1px solid rgba(13, 148, 136, 0.20)',
              marginBottom: '32px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #0D9488, #2DD4BF)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                }}
              >
                <ShieldCheck style={{ width: 22, height: 22 }} />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    color: '#0F766E',
                    textTransform: 'uppercase',
                  }}
                >
                  INCIDENT REF: ST-2026-GOM-048
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '17px',
                    fontWeight: 800,
                  }}
                  className="text-dark-gradient"
                >
                  Northern Gulf Deepwater Horizon Corridor
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  background: 'rgba(255, 255, 255, 0.50)',
                  border: '1px solid rgba(45, 212, 191, 0.40)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#091E2F',
                }}
              >
                SHA-256: 7f8c9b...a4e1
              </div>
              <div
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, rgba(0, 168, 232, 0.15), rgba(45, 212, 191, 0.25))',
                  border: '1px solid rgba(45, 212, 191, 0.60)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#0D9488',
                }}
              >
                UNCLOS Art. 217 Compliant
              </div>
            </div>
          </div>

          {/* Interactive Vessel Comparison Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: '32px',
            }}
          >
            {/* Left Vessel Selector List */}
            <div style={{ gridColumn: 'span 12' }} className="lg:!col-span-5">
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.10em',
                  color: '#0F766E',
                  textTransform: 'uppercase',
                  marginBottom: '14px',
                }}
              >
                Evaluated Traffic Candidates ({CANDIDATES.length})
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {CANDIDATES.map(v => {
                  const isSelected = v.id === selectedVessel.id;
                  const isPrimary = v.status === 'Primary Candidate';

                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVessel(v)}
                      style={{
                        background: isSelected
                          ? 'rgba(255, 255, 255, 0.70)'
                          : 'rgba(255, 255, 255, 0.18)',
                        border: isSelected
                          ? '1.5px solid rgba(45, 212, 191, 0.90)'
                          : '1px solid rgba(13, 148, 136, 0.20)',
                        borderRadius: '12px',
                        padding: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
                        textAlign: 'left',
                        boxShadow: isSelected
                          ? '0 8px 24px rgba(13, 148, 136, 0.16)'
                          : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            background: isPrimary
                              ? 'linear-gradient(135deg, #0D9488, #2DD4BF)'
                              : 'rgba(9, 30, 47, 0.08)',
                            color: isPrimary ? '#FFFFFF' : '#0F2F4A',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Anchor style={{ width: 18, height: 18 }} />
                        </div>
                        <div>
                          <div
                            style={{
                              fontFamily: 'var(--font-sans)',
                              fontSize: '14.5px',
                              fontWeight: 700,
                              color: '#091E2F',
                            }}
                          >
                            {v.name}
                          </div>
                          <div
                            className="text-secondary-section"
                            style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              opacity: 0.8,
                            }}
                          >
                            MMSI {v.mmsi} · {v.flag}
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '16px',
                            fontWeight: 800,
                            color: isPrimary ? '#0D9488' : '#007EA7',
                          }}
                        >
                          {v.compatibilityScore}%
                        </div>
                        <div
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                            color: isPrimary ? '#0D9488' : '#0F766E',
                          }}
                        >
                          Match Prob.
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Detailed Evidence Inspector */}
            <div style={{ gridColumn: 'span 12' }} className="lg:!col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedVessel.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.3, ease: [0.1, 0.9, 0.2, 1] }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.40)',
                    border: '1px solid rgba(45, 212, 191, 0.45)',
                    borderRadius: '16px',
                    padding: '24px 28px',
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.65)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '20px',
                      paddingBottom: '12px',
                      borderBottom: '1px solid rgba(13, 148, 136, 0.18)',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          fontWeight: 700,
                          letterSpacing: '0.10em',
                          color: '#0F766E',
                          textTransform: 'uppercase',
                        }}
                      >
                        FORENSIC VERIFICATION PROFILE
                      </div>
                      <h3
                        className="h3-feature"
                        style={{
                          margin: '2px 0 0',
                        }}
                      >
                        <span className="text-dark-gradient">{selectedVessel.name}</span>
                      </h3>
                    </div>

                    <div
                      style={{
                        padding: '6px 14px',
                        borderRadius: '9999px',
                        background:
                          selectedVessel.status === 'Primary Candidate'
                            ? 'rgba(13, 148, 136, 0.18)'
                            : 'rgba(9, 30, 47, 0.08)',
                        border:
                          selectedVessel.status === 'Primary Candidate'
                            ? '1px solid #0D9488'
                            : '1px solid rgba(9, 30, 47, 0.20)',
                        fontSize: '12px',
                        fontWeight: 700,
                        color:
                          selectedVessel.status === 'Primary Candidate' ? '#0D9488' : '#091E2F',
                      }}
                    >
                      {selectedVessel.status}
                    </div>
                  </div>

                  {/* Telemetry Matrix Grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '18px',
                      marginBottom: '20px',
                    }}
                  >
                    <div>
                      <div className="text-secondary-section" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                        Temporal Discrepancy
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, color: '#091E2F' }}>
                        {selectedVessel.timeDelta}
                      </div>
                    </div>

                    <div>
                      <div className="text-secondary-section" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                        Origin Proximity Delta
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, color: '#091E2F' }}>
                        {selectedVessel.distanceDelta}
                      </div>
                    </div>

                    <div>
                      <div className="text-secondary-section" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                        Speed Profile Anomaly
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, color: '#091E2F' }}>
                        {selectedVessel.speedDrop}
                      </div>
                    </div>

                    <div>
                      <div className="text-secondary-section" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                        Vessel Specifications
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, color: '#091E2F' }}>
                        {selectedVessel.type}
                      </div>
                    </div>
                  </div>

                  {/* Investigative Narrative Assessment */}
                  <div
                    style={{
                      padding: '14px 18px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.50)',
                      border: '1px solid rgba(45, 212, 191, 0.35)',
                      marginBottom: '20px',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#0D9488',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        marginBottom: '6px',
                      }}
                    >
                      Scientific Analyst Conclusion
                    </div>
                    <p
                      className="text-secondary-section"
                      style={{
                        fontSize: '13.5px',
                        lineHeight: 1.55,
                        fontWeight: 600,
                        margin: 0,
                      }}
                    >
                      {selectedVessel.notes}
                    </p>
                  </div>

                  {/* Forensic Action Bar */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '16px',
                      borderTop: '1px solid rgba(13, 148, 136, 0.18)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle style={{ width: 16, height: 16, color: '#0D9488' }} />
                      <span className="text-secondary-section" style={{ fontSize: '12px', fontWeight: 600 }}>
                        Peer-reviewed Hydrodynamic Drift Check Passed
                      </span>
                    </div>

                    <a
                      href="/workbench"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        color: '#007EA7',
                        textDecoration: 'none',
                        letterSpacing: '0.04em',
                      }}
                    >
                      <span>Open in Workbench</span>
                      <ExternalLink style={{ width: 14, height: 14 }} />
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForensicDossierCard;
