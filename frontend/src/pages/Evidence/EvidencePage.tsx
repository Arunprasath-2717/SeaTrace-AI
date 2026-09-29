import React, { useState } from 'react';
import { EvidenceChain } from '../../components/evidence/EvidenceChain';
import { EvidenceDetails } from '../../components/evidence/EvidenceDetails';
import { demoEvidenceChain } from '../../data/demo/evidence';
import { Shield, Link2, FileSearch, CheckCircle2, ChevronRight, AlertTriangle } from 'lucide-react';

const BG   = '#f8fafc';
const CARD = { background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' } as React.CSSProperties;
const CHIP = (c: string) => ({ background: c, borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 800, color: '#fff', letterSpacing: '.04em' });

const STATS = [
  { label: 'Evidence Artifacts', value: String(demoEvidenceChain.length), color: '#4f46e5', icon: FileSearch },
  { label: 'Chain Steps', value: '8', color: '#ea580c', icon: Link2 },
  { label: 'Attribution Score', value: '94/100', color: '#ef4444', icon: Shield },
  { label: 'Verified Links', value: '6', color: '#059669', icon: CheckCircle2 },
];

export const EvidencePage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(demoEvidenceChain[0].id);
  const selectedEvidence = demoEvidenceChain.find((e) => e.id === selectedId) || demoEvidenceChain[0];

  return (
    <div style={{ minHeight: '100vh', background: BG, padding: 16, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 1480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: 0 }}>
              Evidence Package & Investigation Chain
            </h1>
            <p style={{ fontSize: 13, color: '#334155', fontWeight: 600, marginTop: 4 }}>
              Structured forensic audit trail linking orbital observation to candidate vessel trajectory
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={CHIP('#4f46e5')}>8-STEP EVIDENCE CHAIN</span>
            <span style={CHIP('#059669')}>CERTIFIED AUDIT TRAIL</span>
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
                </div>
              </div>
            );
          })}
        </div>

        {/* Methodological notice */}
        <div style={{
          ...CARD, padding: '14px 20px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <AlertTriangle style={{ width: 16, height: 16, color: '#f97316', flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 11, color: '#334155', fontWeight: 600, margin: 0, lineHeight: 1.6 }}>
            <span style={{ fontWeight: 800, color: '#0f172a' }}>Methodological Note: </span>
            SEATRACE structures multi-modal evidence for human review. Internal hashes provide pipeline traceability;
            final legal attribution requires human forensic review, bunker fuel sampling, and port-state inspection.
          </p>
        </div>

        {/* Main Evidence Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

          {/* Chain panel */}
          <div style={{ ...CARD, padding: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>
                Investigation Chain Stages (01–08)
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#6366f1', background: '#6366f108', padding: '3px 10px', borderRadius: 999, border: '1px solid #6366f120' }}>
                {demoEvidenceChain.length} Artifacts
              </span>
            </div>
            <EvidenceChain items={demoEvidenceChain} selectedId={selectedId} onSelectItem={setSelectedId} />
          </div>

          {/* Details panel */}
          <div style={{ ...CARD, padding: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Evidence Inspector
              <button style={{ fontSize: 11, color: '#6366f1', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}>
                Export <ChevronRight style={{ width: 13, height: 13 }} />
              </button>
            </div>
            <EvidenceDetails evidence={selectedEvidence} />
          </div>
        </div>

        {/* Attribution core card */}
        <div style={{
          borderRadius: 24, padding: '22px 28px',
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 55%, #ec4899 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 8px 32px rgba(99,102,241,0.25)',
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Attribution Intelligence Core</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
              MT OCEAN TITAN — IMO 9876543 — Confidence 94/100 — Arabian Sea EEZ
            </div>
          </div>
          <button style={{
            padding: '10px 22px', borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: 'pointer',
            background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.35)',
            backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            Generate Dossier <ChevronRight style={{ width: 14, height: 14 }} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default EvidencePage;
