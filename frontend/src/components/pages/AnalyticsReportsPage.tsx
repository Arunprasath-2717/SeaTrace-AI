import React, { useState } from 'react';
import { useSentinel } from '../../context/SentinelContext';
import {
  BarChart3,
  Download,
  Printer,
  FileText,
  Calendar,
  Shield,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const AnalyticsReportsPage: React.FC = () => {
  const { incidents, selectedIncident, showToast } = useSentinel();

  const currentInc = selectedIncident || incidents[0];
  const [reportFormat, setReportFormat] = useState<'preview' | 'code'>('preview');

  // Trend Data
  const monthlyTrends = [
    { month: 'Apr', incidents: 3, areaKm2: 42, resolved: 2 },
    { month: 'May', incidents: 5, areaKm2: 88, resolved: 4 },
    { month: 'Jun', incidents: 8, areaKm2: 145, resolved: 6 },
    { month: 'Jul', incidents: 6, areaKm2: 95, resolved: 5 },
    { month: 'Aug', incidents: 7, areaKm2: 120, resolved: 6 },
    { month: 'Sep', incidents: 8, areaKm2: 214, resolved: 4 },
  ];

  const severityPie = [
    { name: 'Critical', value: 2, color: '#EF4444' },
    { name: 'High', value: 3, color: '#F59E0B' },
    { name: 'Medium', value: 2, color: '#14B8A6' },
    { name: 'Low', value: 1, color: '#00C2FF' },
  ];

  const handlePrintReport = () => {
    window.print();
  };

  const handleDownloadReport = () => {
    const reportText = `================================================================================
NATIONAL TECHNICAL RESEARCH ORGANISATION (NTRO)
MARITIME INTELLIGENCE & VESSEL ATTRIBUTION DIVISION
OFFICIAL FORENSIC INCIDENT REPORT — PS 26143
================================================================================

1. REPORT IDENTIFICATION:
   Report Reference: NTRO/MAR-INT/${currentInc.code}/2026
   Classification: SECRET // RESTRICTED DISASTER FORENSICS
   Issued Date: ${new Date().toUTCString()}
   Operational Sector: ${currentInc.region}

2. INCIDENT SUMMARY:
   Incident Code: ${currentInc.code}
   Designation: ${currentInc.name}
   Primary Detection Sensor: ${currentInc.sensor}
   Detection Timestamp: ${currentInc.detectionTime}
   Current Operational Status: ${currentInc.status}

3. SATELLITE RADAR METADATA:
   Sensor Platform: Synthetic Aperture Radar (SAR C-Band VV)
   Spatial Ground Resolution: 10.0 meters per pixel
   Equivalent Sigma-Zero Contrast: -26.4 dB damping ratio

4. SPILL COORDINATES & GEOMETRY:
   Central Geographic Coordinates: ${currentInc.lat}°N, ${currentInc.lng}°E
   Calculated Slick Surface Area: ${currentInc.estimatedAreaKm2} km²
   Estimated Crude Hydrocarbon Volume: ${currentInc.estimatedVolumeBarrels} Barrels
   Detection Confidence Index: ${currentInc.confidencePct}%

5. AIS CORRELATION & VESSEL ATTRIBUTION:
   Prime Suspect Polluter: MT OCEAN TITAN
   MMSI Number: 636019448 (Flag: Liberia)
   Vessel Type: VLCC Crude Oil Tanker (318,000 DWT)
   Calculated Attribution Score: 94 / 100
   Telemetry Corroboration: AIS transponder intentionally silenced for 2h 48m 
   during passage across estimated release coordinate. Speed reduced to 4.8 kts.

6. HYDRODYNAMIC DRIFT PREDICTION:
   Coupled MetOcean Wind: 18.5 kts @ 245° WSW
   Surface Ocean Current: 1.2 kts @ 065° ENE
   Projected Time to Shoreline Landfall: ~28 hours
   Threatened Coastal Landmark: Murud-Janjira Marine Sanctuary (185 km)

7. INVESTIGATIVE RECOMMENDATIONS:
   * Immediate dispatch of Indian Coast Guard pollution response vessel ICGS Samudra Prahari.
   * Chemical oil fingerprinting sample acquisition under Merchant Shipping Act.
   * Formal flag-state notification issued to Liberian Maritime Authority.

================================================================================
DISCLAIMER: Simulated demonstration environment generated for SIH 2026 PS 26143.
================================================================================`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NTRO_Report_${currentInc.code}.txt`;
    link.click();
    showToast(`Downloaded official report for ${currentInc.code}.`, 'success');
  };

  return (
    <div className="flex-1 flex flex-col gap-5 p-6 overflow-y-auto select-none bg-[#07111F] text-slate-100 scrollbar-thin">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#00C2FF]" />
            <h1 className="text-xl font-black tracking-tight text-white uppercase font-mono">
              Analytics & Structured Reports
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#14B8A6]/20 text-[#14B8A6] border border-[#14B8A6]/30">
              GOVERNMENT COMPLIANT
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Regional spill trend analytics, detection metrics, and multi-agency legal incident dossier generator.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintReport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0D1B2A] hover:bg-[#13283F] border border-[#23364B] text-xs font-semibold text-slate-200 transition-all shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-[#00C2FF]" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00C2FF] to-[#14B8A6] text-slate-950 font-bold text-xs shadow-md hover:opacity-95 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Certified Dossier</span>
          </button>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Chart 1: Monthly Trends */}
        <div className="md:col-span-2 p-5 rounded-2xl border border-[#23364B] bg-[#0D1B2A] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold font-mono text-white uppercase">
              Monthly Spill Area & Incident Volume Trends
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Past 6 Months</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrends}>
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#07111F',
                    border: '1px solid #23364B',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Line type="monotone" dataKey="areaKm2" stroke="#00C2FF" strokeWidth={2.5} name="Total Area (km²)" />
                <Line type="monotone" dataKey="incidents" stroke="#F59E0B" strokeWidth={2} name="Spill Incidents" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Severity Distribution */}
        <div className="p-5 rounded-2xl border border-[#23364B] bg-[#0D1B2A] flex flex-col justify-between">
          <h3 className="text-xs font-bold font-mono text-white mb-2 uppercase">
            Spill Severity Distribution
          </h3>
          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityPie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={4}
                >
                  {severityPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#07111F',
                    border: '1px solid #23364B',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-3 text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Critical</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> High</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-400" /> Medium</span>
          </div>
        </div>
      </div>

      {/* Structured Legal Report Preview Document */}
      <div className="p-6 rounded-2xl border border-[#23364B] bg-[#0D1B2A] flex flex-col gap-4 font-mono text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#23364B]">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#00C2FF]" />
            <span className="font-bold text-white uppercase tracking-wider">
              Legal Forensic Report Preview (NTRO/MAR-INT/{currentInc.code})
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
            IMO COMPLIANCE COMPATIBLE
          </span>
        </div>

        {/* 12 Standard Report Sections Styled Cleanly */}
        <div className="p-5 rounded-xl bg-[#07111F] border border-[#23364B] text-slate-300 leading-relaxed flex flex-col gap-3 font-sans text-xs">
          <div>
            <h4 className="font-mono font-bold text-[#00C2FF] text-xs uppercase mb-1">
              1. Incident Identification & Verification
            </h4>
            <p className="text-slate-400">
              Incident Code: <strong>{currentInc.code}</strong> | Designation: <strong>{currentInc.name}</strong> | Status: <strong>{currentInc.status}</strong> | Sector: <strong>{currentInc.region}</strong>
            </p>
          </div>

          <div>
            <h4 className="font-mono font-bold text-[#00C2FF] text-xs uppercase mb-1">
              2. Satellite Remote Sensing Observations
            </h4>
            <p className="text-slate-400">
              Acquired via {currentInc.sensor} at {currentInc.detectionTime}. Detected surface slick covers approximately <strong>{currentInc.estimatedAreaKm2} km²</strong> with an estimated volume of <strong>{currentInc.estimatedVolumeBarrels} Barrels</strong> ({currentInc.oilType}). Detection confidence index: <strong>{currentInc.confidencePct}%</strong>.
            </p>
          </div>

          <div>
            <h4 className="font-mono font-bold text-[#00C2FF] text-xs uppercase mb-1">
              3. AIS Trajectory Correlation & Vessel Attribution
            </h4>
            <p className="text-slate-400">
              Hydrodynamic reverse drift back-calculated release coordinate to <strong>18.72°N, 71.55°E</strong>. Historical AIS telemetry identified suspect vessel <strong>MT OCEAN TITAN (MMSI: 636019448, IMO: 9312456, VLCC Tanker)</strong> with a composite attribution score of <strong>94 / 100</strong>. Suspect exhibited deliberate 2.8-hour AIS silence and deceleration matching tank wash discharge.
            </p>
          </div>

          <div>
            <h4 className="font-mono font-bold text-[#00C2FF] text-xs uppercase mb-1">
              4. Hydrodynamic Drift Threat & Coastal Risk
            </h4>
            <p className="text-slate-400">
              Coupled surface wind (18.5 kts @ 245°) and ocean currents (1.2 kts @ 065°) project forward drift toward the Konkan / Murud-Janjira shoreline with estimated landfall in <strong>~28 hours</strong>.
            </p>
          </div>

          <div>
            <h4 className="font-mono font-bold text-[#00C2FF] text-xs uppercase mb-1">
              5. Actionable Directive & Recommendations
            </h4>
            <p className="text-slate-400">
              Dispatch ICGS Samudra Prahari with ocean booms. Secure physical oily water separator logs upon vessel berthing under Section 356 of Merchant Shipping Act.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
