import React from 'react';
import { Card } from '../common/Card';
import { Lock, CheckCircle2 } from 'lucide-react';

export const ProvenancePanel: React.FC<{ className?: string }> = ({ className = '' }) => {
  const steps = [
    {
      title: 'Satellite Telemetry Signed Ingestion',
      system: 'ESA Copernicus Open Access Hub API',
      timestamp: '2026-09-24 14:23:05 UTC',
      hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    },
    {
      title: 'AIS Kinematic Snapshot Locked',
      system: 'Spire Maritime Micro-satellite Constellation',
      timestamp: '2026-09-24 14:25:12 UTC',
      hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    },
    {
      title: 'Hydrodynamic Forcing State Sealed',
      system: 'HYCOM Global / ECMWF ERA5 Analysis',
      timestamp: '2026-09-24 14:30:00 UTC',
      hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    },
    {
      title: 'Attribution Dossier Compiled & Timestamped',
      system: 'SEATRACE Ledger Seal v2.4',
      timestamp: '2026-09-24 15:00:00 UTC',
      hash: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    },
  ];

  return (
    <Card
      title="CHAIN OF CUSTODY & PROVENANCE"
      subtitle="Immutable audit trail of evidence collection and computational pipeline"
      headerAction={
        <div className="flex items-center gap-1.5 text-xs text-seatrace-mint font-mono">
          <Lock className="w-3.5 h-3.5" />
          CRYPTOGRAPHICALLY SEALED
        </div>
      }
      className={className}
    >
      <div className="space-y-3">
        {steps.map((s, idx) => (
          <div
            key={idx}
            className="p-3 rounded bg-seatrace-bg-surface/50 border border-seatrace-border-subtle relative"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-seatrace-mint flex-shrink-0" />
                <span className="text-xs font-semibold text-seatrace-text-primary">
                  {s.title}
                </span>
              </div>
              <span className="text-[10px] font-mono text-seatrace-text-muted">
                {s.timestamp}
              </span>
            </div>
            <div className="text-[11px] font-mono text-seatrace-text-secondary pl-6">
              Source: {s.system}
            </div>
            <div className="text-[10px] font-mono text-seatrace-teal pl-6 truncate mt-1">
              Hash: {s.hash}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ProvenancePanel;
