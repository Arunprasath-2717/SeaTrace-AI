import React, { useState } from 'react';
import { demoIncidents } from '../../data/demo/incidents';
import { Satellite, Clock, ArrowRight, Filter, Compass, AlertTriangle, MapPin, CheckCircle, Search } from 'lucide-react';

const BG   = '#f8fafc';
const CARD = { background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' } as React.CSSProperties;
const CHIP = (c: string) => ({ background: c, borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 800, color: '#fff', letterSpacing: '.04em' });

const STATUS_COLOR: Record<string, string> = {
  confirmed: '#ef4444',
  investigating: '#ea580c',
  resolved: '#059669',
};
const STATUS_BG: Record<string, string> = {
  confirmed: '#fef2f2',
  investigating: '#fff7ed',
  resolved: '#f0fdf4',
};

const SUMMARY = [
  { label: 'Total Incidents', value: '12', color: '#4f46e5', icon: AlertTriangle },
  { label: 'Investigating', value: '7', color: '#ea580c', icon: Search },
  { label: 'Confirmed', value: '3', color: '#ef4444', icon: MapPin },
  { label: 'Resolved', value: '2', color: '#059669', icon: CheckCircle },
];

export const InvestigationsPage: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = demoIncidents.filter((inc) => {
    const matchStatus = filter === 'all' || inc.status === filter;
    const matchSearch = search === '' || inc.id.toLowerCase().includes(search.toLowerCase()) || inc.location.regionName.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div style={{ minHeight: '100vh', background: BG, padding: 16, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 1480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: 0 }}>Incidents & Active Investigations</h1>
            <p style={{ fontSize: 13, color: '#334155', fontWeight: 600, marginTop: 4 }}>Triaged satellite SAR slicks requiring forensic origin reconstruction</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={CHIP('#4f46e5')}>{demoIncidents.length} TOTAL INCIDENTS</span>
            <span style={CHIP('#059669')}>VERIFIED SATELLITE DATA</span>
          </div>
        </div>

        {/* Summary stat row (Bigger & Darker) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {SUMMARY.map((s) => {
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

        {/* Filter + Search bar */}
        <div style={{ ...CARD, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <Filter style={{ width: 15, height: 15, color: '#4f46e5', flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '.05em' }}>Status:</span>
          {['all', 'investigating', 'confirmed', 'resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer',
                background: filter === st ? '#4f46e5' : '#f1f5f9',
                color: filter === st ? '#fff' : '#1e293b',
                textTransform: 'capitalize', transition: 'all 0.15s',
              }}
            >
              {st}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: '6px 14px' }}>
            <Search style={{ width: 14, height: 14, color: '#64748b' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search incident ID or region…"
              style={{ fontSize: 12, fontWeight: 600, border: 'none', background: 'transparent', outline: 'none', color: '#0f172a', width: 220 }}
            />
          </div>
        </div>

        {/* Incidents grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
          {filtered.map((inc) => (
            <div key={inc.id} style={{ ...CARD, padding: 18, transition: 'transform 0.15s, box-shadow 0.15s', cursor: 'pointer' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 18px rgba(0,0,0,0.08)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; }}
            >
              {/* Card header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: '#0f172a' }}>{inc.id}</div>
                  <div style={{ fontSize: 12, color: '#334155', fontWeight: 600, marginTop: 2 }}>{inc.location.regionName}</div>
                </div>
                <span style={{
                  ...CHIP(STATUS_COLOR[inc.status] ?? '#64748b'),
                  background: STATUS_BG[inc.status] ?? '#f8fafc',
                  color: STATUS_COLOR[inc.status] ?? '#64748b',
                  border: `1px solid ${STATUS_COLOR[inc.status] ?? '#64748b'}50`,
                }}>
                  {inc.status.toUpperCase()}
                </span>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: '#e2e8f0', marginBottom: 10 }} />

              {/* Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, fontSize: 12, color: '#334155', fontWeight: 600, fontFamily: 'monospace' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Compass style={{ width: 14, height: 14, color: '#4f46e5', flexShrink: 0 }} />
                  {inc.location.latitude.toFixed(3)}°N, {Math.abs(inc.location.longitude).toFixed(3)}°E
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Satellite style={{ width: 14, height: 14, color: '#0284c7', flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inc.satelliteScene}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Clock style={{ width: 13, height: 13, color: '#059669', flexShrink: 0 }} />
                  {new Date(inc.acquisitionTime).toUTCString().replace('GMT', 'UTC')}
                </div>
              </div>

              {/* Footer */}
              <div style={{ height: 1, background: '#e2e8f0', margin: '10px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 900, color: '#4f46e5', fontFamily: 'monospace' }}>
                  {inc.estimatedAreaKm2} km²
                </span>
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px', borderRadius: 8,
                  fontSize: 12, fontWeight: 800, background: '#4f46e510', color: '#4f46e5',
                  border: '1px solid #4f46e540', cursor: 'pointer', transition: 'all 0.15s',
                }}>
                  Enter Case <ArrowRight style={{ width: 13, height: 13 }} />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default InvestigationsPage;
