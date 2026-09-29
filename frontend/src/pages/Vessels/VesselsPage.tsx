import React, { useState } from 'react';
import { VesselTable } from '../../components/vessels/VesselTable';
import { VesselDetails } from '../../components/vessels/VesselDetails';
import { VesselTrack } from '../../components/vessels/VesselTrack';
import { CompatibilityIndicators } from '../../components/vessels/CompatibilityIndicators';
import { demoVessels } from '../../data/demo/vessels';
import { Ship, AlertCircle, CheckCircle, Eye, ChevronRight } from 'lucide-react';

const BG   = '#f8fafc';
const CARD = { background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' } as React.CSSProperties;
const CHIP = (c: string) => ({ background: c, borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 800, color: '#fff', letterSpacing: '.04em' });

const STATS = [
  { label: 'Candidates Audited', value: String(demoVessels.length), color: '#4f46e5', icon: Ship },
  { label: 'Prime Suspects', value: '1', color: '#ef4444', icon: AlertCircle },
  { label: 'Monitoring', value: '4', color: '#ea580c', icon: Eye },
  { label: 'Cleared', value: String(demoVessels.length - 5), color: '#059669', icon: CheckCircle },
];

export const VesselsPage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(demoVessels[0].id);
  const selectedVessel = demoVessels.find((v) => v.id === selectedId) || demoVessels[0];

  return (
    <div style={{ minHeight: '100vh', background: BG, padding: 16, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 1480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: 0 }}>
              Vessel Intelligence & Trajectory Correlation
            </h1>
            <p style={{ fontSize: 13, color: '#334155', fontWeight: 600, marginTop: 4 }}>
              Automated spatiotemporal intersection with terrestrial and satellite AIS vessel paths
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={CHIP('#4f46e5')}>{demoVessels.length} CANDIDATES AUDITED</span>
            <span style={CHIP('#059669')}>REAL-TIME AIS STREAM</span>
          </div>
        </div>

        {/* Stats row (Bigger & Darker) */}
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
                </div>
              </div>
            );
          })}
        </div>

        {/* Intelligence Core banner */}
        <div style={{
          borderRadius: 24, padding: '20px 28px',
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 55%, #ec4899 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
          boxShadow: '0 8px 32px rgba(99,102,241,0.25)',
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 4 }}>AIS Vessel Surveillance Core</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Real-time trajectory correlation • Dark vessel detection • MMSI cross-reference</div>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {[['25', 'Tracked'], ['1', 'Dark Alert'], ['94%', 'Accuracy']].map(([v, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{v}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Vessel Table */}
        <div style={{ ...CARD, padding: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Candidate Vessel Roster
            <button style={{ fontSize: 11, color: '#6366f1', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}>
              Export AIS <ChevronRight style={{ width: 13, height: 13 }} />
            </button>
          </div>
          <VesselTable vessels={demoVessels} selectedVesselId={selectedId} onSelectVessel={setSelectedId} />
        </div>

        {/* Vessel breakdown grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div style={{ ...CARD, padding: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 14 }}>Vessel Profile</div>
            <VesselDetails vessel={selectedVessel} />
          </div>
          <div style={{ ...CARD, padding: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 14 }}>Compatibility Indicators</div>
            <CompatibilityIndicators vessel={selectedVessel} />
          </div>
          <div style={{ ...CARD, padding: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 14 }}>AIS Track Reconstruction</div>
            <VesselTrack vessel={selectedVessel} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default VesselsPage;
