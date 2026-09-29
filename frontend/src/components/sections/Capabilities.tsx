import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, GitCompare, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ================================================================
   CAPABILITIES — Detection vs Attribution & Counterfactual Testing
   Translucent liquid glass comparison matrix and physical
   counterfactual simulation verification panel.
   ================================================================ */

const COMPARISON = [
  {
    capability: 'Sensor Acquisition',
    standard:   'Basic optical / RGB satellite imagery',
    seatrace:   'Dual-Polarization C-Band SAR (VV/VH, 10m spatial resolution)',
  },
  {
    capability: 'Look-Alike Filtering',
    standard:   'Simple visual thresholding or manual operator review',
    seatrace:   'Metocean-calibrated ML with ERA5 wind & multi-spectral verification',
  },
  {
    capability: 'Temporal Drift Tracking',
    standard:   'Static assumption (slick assumed discharged at current site)',
    seatrace:   '72h Lagrangian reverse advection-diffusion ensemble (500+ particles)',
  },
  {
    capability: 'Vessel Identification',
    standard:   'Nearest vessel at detection time (high false-positive risk)',
    seatrace:   'Spatiotemporal kinematic corridor intersection against 4D origin envelope',
  },
  {
    capability: 'Physical Verification',
    standard:   'None — purely correlative heuristic',
    seatrace:   'Forward dispersion counterfactual simulation with quantitative IoU scoring',
  },
  {
    capability: 'Evidentiary Standard',
    standard:   'Uncertified PDF screenshot',
    seatrace:   'MARPOL Annex I compliant cryptographic dossier with SHA-256 custody chain',
  },
];

export const Capabilities: React.FC = () => {
  const [selectedCandidate, setSelectedCandidate] = useState<'A' | 'B'>('A');

  return (
    <section
      id="capabilities-section"
      style={{ position: 'relative', zIndex: 1, padding: '40px 24px 80px' }}
    >
      <div style={{ maxWidth: '74rem', margin: '0 auto' }}>

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 32 }}
        >
          <div
            style={{
              display:        'inline-flex',
              alignItems:     'center',
              gap:            7,
              padding:        '4px 14px',
              borderRadius:   9999,
              background:     'rgba(2, 132, 199, 0.12)',
              border:         '1px solid rgba(2, 132, 199, 0.35)',
              marginBottom:   16,
            }}
          >
            <GitCompare style={{ width: 13, height: 13, color: '#0284C7' }} />
            <span
              style={{
                fontFamily:    '"JetBrains Mono", monospace',
                fontSize:      9,
                fontWeight:    700,
                letterSpacing: '0.20em',
                textTransform: 'uppercase',
                color:         '#0369A1',
              }}
            >
              Systemic Differentiation
            </span>
          </div>

          <h2
            style={{
              fontFamily:    '"Palatino Linotype", Palatino, "Book Antiqua", "EB Garamond", Georgia, serif',
              fontSize:      'clamp(28px, 3.4vw, 44px)',
              fontWeight:    800,
              letterSpacing: '-0.025em',
              lineHeight:    1.12,
              color:         'var(--text-primary)',
              marginBottom:  14,
            }}
          >
            Detection alerts.{' '}
            <span style={{ color: '#0D9488' }}>SeaTrace attributes.</span>
          </h2>

          <p
            style={{
              fontFamily:  '"Palatino Linotype", Palatino, "EB Garamond", Georgia, serif',
              fontSize:    'clamp(14px, 1.3vw, 16px)',
              lineHeight:  1.68,
              color:       'var(--text-secondary)',
              maxWidth:    680,
            }}
          >
            Commercial satellite services stop at pointing out surface anomalies. SeaTrace executes the entire hydrodynamic and kinematic proof chain required for enforcement.
          </p>
        </motion.div>

        {/* ── Comparison Table (Liquid Glass) ── */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="liquid-glass-strong glass-shimmer"
          style={{ padding: '24px 28px', marginBottom: 28, overflowX: 'auto' }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid rgba(200, 225, 245, 0.60)' }}>
                <th
                  style={{
                    padding:        '12px 16px',
                    fontFamily:     '"JetBrains Mono", monospace',
                    fontSize:       10,
                    fontWeight:     700,
                    letterSpacing:  '0.14em',
                    textTransform:  'uppercase',
                    color:          'var(--text-muted)',
                    width:          '25%',
                  }}
                >
                  Capability Vector
                </th>
                <th
                  style={{
                    padding:        '12px 16px',
                    fontFamily:     '"JetBrains Mono", monospace',
                    fontSize:       10,
                    fontWeight:     700,
                    letterSpacing:  '0.14em',
                    textTransform:  'uppercase',
                    color:          'var(--text-dim)',
                    width:          '35%',
                  }}
                >
                  Conventional Detection Tools
                </th>
                <th
                  style={{
                    padding:        '12px 16px',
                    fontFamily:     '"JetBrains Mono", monospace',
                    fontSize:       10,
                    fontWeight:     700,
                    letterSpacing:  '0.14em',
                    textTransform:  'uppercase',
                    color:          '#0D9488',
                    width:          '40%',
                  }}
                >
                  SeaTrace Maritime Intelligence
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: '1px solid rgba(220, 235, 250, 0.45)',
                    transition:   'background 0.2s ease',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(255, 255, 255, 0.50)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}
                >
                  <td
                    style={{
                      padding:     '16px',
                      fontFamily:  '"Palatino Linotype", Palatino, serif',
                      fontSize:    13.5,
                      fontWeight:  700,
                      color:       'var(--text-primary)',
                    }}
                  >
                    {row.capability}
                  </td>
                  <td
                    style={{
                      padding:     '16px',
                      fontFamily:  '"Palatino Linotype", Palatino, serif',
                      fontSize:    13,
                      color:       'var(--text-dim)',
                      lineHeight:  1.5,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <X style={{ width: 14, height: 14, color: '#DC2626', flexShrink: 0 }} />
                      <span>{row.standard}</span>
                    </div>
                  </td>
                  <td
                    style={{
                      padding:     '16px',
                      fontFamily:  '"Palatino Linotype", Palatino, serif',
                      fontSize:    13,
                      color:       'var(--text-primary)',
                      lineHeight:  1.5,
                      fontWeight:  600,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Check style={{ width: 15, height: 15, color: '#059669', flexShrink: 0 }} />
                      <span style={{ color: '#0F766E' }}>{row.seatrace}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* ── Interactive Counterfactual Testing Widget ── */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="liquid-glass-strong glass-shimmer"
          style={{ padding: '28px 32px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div
                style={{
                  fontFamily:    '"JetBrains Mono", monospace',
                  fontSize:      9.5,
                  fontWeight:    700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color:         '#0284C7',
                }}
              >
                Scientific Falsifiability Test
              </div>
              <h3
                style={{
                  fontFamily: '"Palatino Linotype", Palatino, serif',
                  fontSize:   18,
                  fontWeight: 700,
                  color:      'var(--text-primary)',
                }}
              >
                Counterfactual Hypothesis Simulation (IoU Verification)
              </h3>
            </div>

            {/* Candidate Selector */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setSelectedCandidate('A')}
                style={{
                  padding:      '6px 14px',
                  borderRadius: 8,
                  fontFamily:   '"JetBrains Mono", monospace',
                  fontSize:     11,
                  fontWeight:   700,
                  background:   selectedCandidate === 'A' ? '#0D9488' : 'rgba(255, 255, 255, 0.70)',
                  color:        selectedCandidate === 'A' ? '#FFFFFF' : 'var(--text-secondary)',
                  border:       '1px solid rgba(255, 255, 255, 0.90)',
                  cursor:       'pointer',
                  transition:   'all 0.2s ease',
                }}
              >
                Candidate A: MT PACIFIC PROMISE
              </button>
              <button
                onClick={() => setSelectedCandidate('B')}
                style={{
                  padding:      '6px 14px',
                  borderRadius: 8,
                  fontFamily:   '"JetBrains Mono", monospace',
                  fontSize:     11,
                  fontWeight:   700,
                  background:   selectedCandidate === 'B' ? '#DC2626' : 'rgba(255, 255, 255, 0.70)',
                  color:        selectedCandidate === 'B' ? '#FFFFFF' : 'var(--text-secondary)',
                  border:       '1px solid rgba(255, 255, 255, 0.90)',
                  cursor:       'pointer',
                  transition:   'all 0.2s ease',
                }}
              >
                Candidate B: MT OCEAN TITAN
              </button>
            </div>
          </div>

          {/* Test results grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4" style={{ marginBottom: 20 }}>
            <div style={{ background: 'rgba(255,255,255,0.70)', padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.90)' }}>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Observed SAR Footprint
              </span>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>
                18.42 km²
              </div>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: 'var(--text-dim)' }}>
                Sentinel-1 C-Band Level-1
              </span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.70)', padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.90)' }}>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Forward Model Dispersion
              </span>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>
                {selectedCandidate === 'A' ? '17.85 km²' : '4.18 km²'}
              </div>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: 'var(--text-dim)' }}>
                OpenOil Lagrangian Physics
              </span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.70)', padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.90)' }}>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Intersection-over-Union (IoU)
              </span>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 16, fontWeight: 700, color: selectedCandidate === 'A' ? '#059669' : '#DC2626', marginTop: 4 }}>
                {selectedCandidate === 'A' ? '0.84 (High)' : '0.11 (Falsified)'}
              </div>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: 'var(--text-dim)' }}>
                Threshold: IoU ≥ 0.70
              </span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.70)', padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.90)' }}>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Attribution Decision
              </span>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 14, fontWeight: 700, color: selectedCandidate === 'A' ? '#059669' : '#DC2626', marginTop: 5 }}>
                {selectedCandidate === 'A' ? '✓ ATTRIBUTED' : '✕ DISPROVEN'}
              </div>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: 'var(--text-dim)' }}>
                Confidence: {selectedCandidate === 'A' ? '94.2%' : '< 2.1%'}
              </span>
            </div>
          </div>

          {/* Forensic summary comment */}
          <div
            style={{
              padding:        '12px 18px',
              borderRadius:   10,
              background:     selectedCandidate === 'A' ? 'rgba(5, 150, 105, 0.08)' : 'rgba(220, 38, 38, 0.08)',
              border:         `1px solid ${selectedCandidate === 'A' ? 'rgba(5, 150, 105, 0.25)' : 'rgba(220, 38, 38, 0.25)'}`,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'space-between',
              flexWrap:       'wrap',
              gap:            8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldCheck style={{ width: 16, height: 16, color: selectedCandidate === 'A' ? '#059669' : '#DC2626' }} />
              <span
                style={{
                  fontFamily: '"Palatino Linotype", Palatino, serif',
                  fontSize:   13,
                  color:      'var(--text-primary)',
                  fontWeight: 600,
                }}
              >
                {selectedCandidate === 'A'
                  ? 'Forward simulation confirms MT PACIFIC PROMISE discharge trajectory reproduces the observed SAR boundary within 95% Bayesian credible interval.'
                  : 'Counterfactual hypothesis disproven: simulated discharge from MT OCEAN TITAN is carried eastward by the Loop Current and fails to match observed footprint.'}
              </span>
            </div>

            <Link to="/app" style={{ textDecoration: 'none' }}>
              <span
                style={{
                  fontFamily:    '"JetBrains Mono", monospace',
                  fontSize:      10,
                  fontWeight:    700,
                  color:         '#0D9488',
                  display:       'flex',
                  alignItems:    'center',
                  gap:           4,
                }}
              >
                Inspect in Workbench <ArrowRight style={{ width: 12, height: 12 }} />
              </span>
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Capabilities;
