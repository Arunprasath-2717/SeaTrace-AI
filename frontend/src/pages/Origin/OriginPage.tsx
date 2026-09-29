import React from 'react';
import { OriginMap } from '../../components/origin/OriginMap';
import { DriftEnsemble } from '../../components/origin/DriftEnsemble';
import { OriginSummary } from '../../components/origin/OriginSummary';
import { Navigation, Clock, Activity, ChevronRight, MapPin } from 'lucide-react';

const BG   = '#f8fafc';
const CARD = { background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' } as React.CSSProperties;
const CHIP = (c: string) => ({ background: c, borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 800, color: '#fff', letterSpacing: '.04em' });

const STATS = [
  { label: 'Drift Horizon', value: '72 hrs', sub: 'Status: Stable', color: '#4f46e5', icon: Clock },
  { label: 'Origin Cluster', value: '8.4 km', sub: 'Spatial spread', color: '#ea580c', icon: MapPin },
  { label: 'Ensemble Runs', value: '500', sub: 'Lagrangian particles', color: '#0284c7', icon: Activity },
  { label: 'Confidence', value: '87%', sub: 'Reconstruction accuracy', color: '#059669', icon: Navigation },
];

export const OriginPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: BG, padding: 16, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 1480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: 0 }}>Origin Reconstruction</h1>
            <p style={{ fontSize: 13, color: '#334155', fontWeight: 600, marginTop: 4 }}>
              Lagrangian backward hydrodynamic drift modeling for discharge spatiotemporal localization
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={CHIP('#4f46e5')}>OPENDRIFT ENGINE</span>
            <span style={CHIP('#059669')}>72-HR ENSEMBLE</span>
          </div>
        </div>

        {/* Stats (Bigger & Darker) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} style={{ ...CARD, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: s.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon style={{ width: 22, height: 22, color: s.color }} />
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

        {/* Map card */}
        <div style={{ ...CARD, padding: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Hydrodynamic Drift Trajectory Map
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ ...CHIP('#6366f1'), fontSize: 9 }}>ST-2046</span>
              <span style={{ ...CHIP('#f97316'), fontSize: 9 }}>BACKWARD DRIFT</span>
            </div>
          </div>
          <OriginMap />
        </div>

        {/* Ensemble + Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ ...CARD, padding: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Drift Ensemble Specifications
              <button style={{ fontSize: 11, color: '#6366f1', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}>
                Details <ChevronRight style={{ width: 13, height: 13 }} />
              </button>
            </div>
            <DriftEnsemble />
          </div>
          <div style={{ ...CARD, padding: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Origin Point Summary
              <button style={{ fontSize: 11, color: '#6366f1', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}>
                Export <ChevronRight style={{ width: 13, height: 13 }} />
              </button>
            </div>
            <OriginSummary />
          </div>
        </div>

        {/* MetOcean core banner */}
        <div style={{
          borderRadius: 24, padding: '20px 28px',
          background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 55%, #7c3aed 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
          boxShadow: '0 8px 32px rgba(14,165,233,0.25)',
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 4 }}>MetOcean Hydrodynamic Core</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
              CMEMS ocean current + ERA5 wind forcing • 6-hourly resolution • Indian Ocean domain
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {[['500', 'Particles'], ['72h', 'Backward'], ['87%', 'Confidence']].map(([v, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{v}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default OriginPage;
