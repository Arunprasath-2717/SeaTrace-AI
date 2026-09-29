import React, { useState } from 'react';
import { SarAnalysisViewer } from '../../components/detection/SarAnalysisViewer';
import { ModelMetrics } from '../../components/detection/ModelMetrics';
import { LookAlikeAssessmentPanel } from '../../components/detection/LookAlikeAssessmentPanel';
import { demoDetection } from '../../data/demo/detection';
import { Activity, ShieldCheck, Layers, TrendingUp, ChevronRight } from 'lucide-react';

/* ── Crisp, High-contrast, Low 10% Morphism ───────────────────────── */
const BG   = '#f8fafc';
const CARD = { background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' } as React.CSSProperties;
const CHIP = (color: string) => ({ background: color, borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 800, color: '#fff', letterSpacing: '.04em' });

const STATS = [
  { label: 'Confidence Score', value: '96.4%', sub: 'Status: Optimal', color: '#4f46e5', icon: ShieldCheck },
  { label: 'Slick Area', value: '48.6 km²', sub: 'Status: Active', color: '#ea580c', icon: Activity },
  { label: 'Model Precision', value: '99.1%', sub: 'Status: Nominal', color: '#0284c7', icon: TrendingUp },
];

export const DetectionPage: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState('overlay');
  const layers = ['original', 'processed', 'mask', 'overlay'];

  return (
    <div style={{ minHeight: '100vh', background: BG, padding: 16, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 1480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* ── Header row ──────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>
              Satellite SAR Slick Detection
            </h1>
            <p style={{ fontSize: 13, color: '#334155', fontWeight: 600, marginTop: 4 }}>
              Dual-stage neural segmentation of synthetic aperture radar (SAR) amplitude imagery
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={CHIP('#4f46e5')}>SCENE: {demoDetection.sceneId.substring(0, 18)}…</span>
            <span style={CHIP('#059669')}>SEEDED SAR BENCHMARK</span>
          </div>
        </div>

        {/* ── Stat cards (Bigger & Darker) ────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} style={{ ...CARD, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: s.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon style={{ width: 24, height: 24, color: s.color }} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#334155', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.03em' }}>{s.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', lineHeight: 1.1, marginTop: 2 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginTop: 2 }}>{s.sub}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Layer selector ──────────────────────────────────── */}
        <div style={{ ...CARD, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Layers style={{ width: 16, height: 16, color: '#4f46e5', flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '.05em', marginRight: 4 }}>SAR Layer:</span>
          {layers.map((l) => (
            <button
              key={l}
              onClick={() => setActiveLayer(l)}
              style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer',
                background: activeLayer === l ? '#4f46e5' : '#f1f5f9',
                color: activeLayer === l ? '#fff' : '#1e293b',
                transition: 'all 0.15s',
                textTransform: 'capitalize',
              }}
            >
              {l}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: 11, color: '#059669', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#059669', display: 'inline-block' }} />
            LIVE FEED ACTIVE
          </span>
        </div>

        {/* ── SAR Viewer ──────────────────────────────────────── */}
        <div style={{ ...CARD, padding: 18 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>SAR Analysis Viewer — {activeLayer.charAt(0).toUpperCase() + activeLayer.slice(1)} Layer</span>
            <span style={{ fontSize: 11, color: '#475569', fontWeight: 600 }}>Sentinel-1B · IW Mode · VV Polarisation</span>
          </div>
          <SarAnalysisViewer />
        </div>

        {/* ── Model Metrics + Look-Alike ───────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ ...CARD, padding: 18 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>Model Performance Metrics</div>
            <ModelMetrics />
          </div>
          <div style={{ ...CARD, padding: 18 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginBottom: 12, display: 'flex', justifyContent: 'space-between' }}>
              <span>Look-Alike Assessment</span>
              <button style={{ fontSize: 12, color: '#4f46e5', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}>
                See All <ChevronRight style={{ width: 14, height: 14 }} />
              </button>
            </div>
            <LookAlikeAssessmentPanel />
          </div>
        </div>

      </div>
    </div>
  );
};

export default DetectionPage;
