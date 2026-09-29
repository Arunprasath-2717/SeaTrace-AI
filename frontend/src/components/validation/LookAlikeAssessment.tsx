import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Droplet, Wind, Waves, Compass, Activity, CheckCircle2 } from 'lucide-react';

export const LookAlikeAssessment: React.FC<{ className?: string }> = ({ className = '' }) => {
  const lookAlikeCategories = [
    {
      id: 'look-1',
      category: '1. Anthropogenic Mineral Oil',
      classification: 'Primary Hypothesis',
      status: 'Consistent',
      badgeVariant: 'mint' as const,
      basis: 'Sharp linear edge contrast (Δσ° > 7.0 dB) along regional traffic separation route.',
      metric: 'Backscatter attenuation -7.2 dB relative to ambient open water in VV channel.',
      sensor: 'Sentinel-1A C-SAR IW Mode · Polarimetric ratio nominal for mineral crude film.',
      icon: Droplet,
      isTarget: true,
    },
    {
      id: 'look-2',
      category: '2. Low Wind Speed Calm (< 3 m/s)',
      classification: 'False-Positive Look-alike',
      status: 'Excluded',
      badgeVariant: 'teal' as const,
      basis: 'Coincident ERA5 wind field measures 6.4 m/s, sustaining capillary wave roughness.',
      metric: '10m Wind Speed: 6.4 m/s (Exclusion Criterion: < 3.0 m/s Threshold Met).',
      sensor: 'ECMWF ERA5 Hourly Reanalysis + Coincident MetOcean Scatterometer Feed.',
      icon: Wind,
      isTarget: false,
    },
    {
      id: 'look-3',
      category: '3. Natural Biogenic Surfactant',
      classification: 'False-Positive Look-alike',
      status: 'Excluded',
      badgeVariant: 'teal' as const,
      basis: 'Sentinel-3 OLCI ocean colour confirms low productivity and absence of algal bloom.',
      metric: 'Chlorophyll-a: 0.11 mg/m³ (Exclusion Criterion: < 0.15 mg/m³ Threshold Met).',
      sensor: 'Copernicus Sentinel-3 OLCI 300m Multi-spectral Ocean Colour Telemetry.',
      icon: Waves,
      isTarget: false,
    },
    {
      id: 'look-4',
      category: '4. Natural Subsea Hydrocarbon Seep',
      classification: 'Alternative Hypothesis',
      status: 'Low Prob',
      badgeVariant: 'warning' as const,
      basis: 'Active geological seep database confirms nearest known active vent is 26.4 km distant.',
      metric: 'Distance to Seep: 26.4 km (Exclusion Threshold: > 10.0 km Criteria Met).',
      sensor: 'GEBCO Bathymetric Survey & Global Marine Geological Vent Catalog.',
      icon: Compass,
      isTarget: false,
    },
    {
      id: 'look-5',
      category: '5. Multi-Sensor Cross-Validation',
      classification: 'Coincident Telemetry',
      status: 'Synchronized',
      badgeVariant: 'mint' as const,
      basis: 'ERA5 Wind (6.4 m/s) · Mercator Current (0.42 m/s) · Dual-Pol Ratio (6.8 dB).',
      metric: '4/4 Sensor Streams Telemetry Synchronized within ±18 min Acquisition Window.',
      sensor: 'ECMWF ERA5 + Copernicus Sentinel-1A / Sentinel-3 + CMEMS Mercator.',
      icon: Activity,
      isTarget: true,
    },
  ];

  return (
    <Card
      title="LOOK-ALIKE DISCRIMINATION MATRIX"
      subtitle="Protocol disproving false-positive ocean damping mechanisms"
      headerAction={
        <Badge variant="mint" size="sm">
          PRIMARY HYPOTHESIS SUPPORTED
        </Badge>
      }
      className={`${className} h-full flex flex-col`}
    >
      <div className="space-y-3 flex-1 flex flex-col justify-between font-sans">
        {/* Row 0: Top Protocol Banner (Aligned with left column banner) */}
        <div className="min-h-[58px] p-3 rounded-xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 text-xs font-sans text-slate-900 dark:text-slate-100 flex items-center shadow-2xs">
          <div>
            <span className="font-black text-teal-950 dark:text-teal-300 uppercase tracking-wide mr-1.5">
              Physical Damping Analysis:
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 leading-snug">
              Natural surfactants, wind shadows, and internal solitons suppress Bragg waves mimicking oil. Coincident multi-sensor telemetry verifies physical exclusion.
            </span>
          </div>
        </div>

        {/* Rows 1–5: Look-Alike & Coincident Sensor Rows */}
        <div className="space-y-2.5">
          {lookAlikeCategories.map((item) => {
            const ItemIcon = item.icon;
            return (
              <div
                key={item.id}
                className={`p-3 rounded-xl border transition-all hover:border-slate-400 shadow-2xs ${
                  item.isTarget
                    ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700'
                    : 'bg-slate-50/90 dark:bg-slate-900/60 border-slate-300 dark:border-slate-800'
                }`}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-start gap-2 min-w-0">
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                      item.isTarget
                        ? 'bg-emerald-100 dark:bg-emerald-900/50 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}>
                      <ItemIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className={`text-sm font-black tracking-tight font-sans ${item.isTarget ? 'text-emerald-950 dark:text-emerald-300' : 'text-slate-950 dark:text-white'}`}>
                          {item.category}
                        </h4>
                        {item.isTarget && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold mt-0.5 leading-snug truncate">
                        {item.classification}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <Badge variant={item.badgeVariant} size="sm">
                      {item.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {/* 3-line structured box */}
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                    <span className="font-black text-slate-950 dark:text-slate-100 shrink-0 min-w-[96px]">Assessment Basis:</span>
                    <span className="text-slate-900 dark:text-slate-200 font-semibold leading-relaxed truncate">{item.basis}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                    <span className="font-black text-slate-950 dark:text-slate-100 shrink-0 min-w-[96px]">Physical Metric:</span>
                    <span className="text-teal-950 dark:text-teal-300 font-bold leading-relaxed truncate">{item.metric}</span>
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-1.5 text-[11px] flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                    <span className="font-black text-indigo-950 dark:text-indigo-400 shrink-0 min-w-[96px] uppercase tracking-wide">Sensor Stream:</span>
                    <span className="text-indigo-900 dark:text-indigo-300 font-semibold leading-relaxed truncate">{item.sensor}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Row 6: Card footer info banner (Aligned with left column footer) */}
        <div className="min-h-[46px] p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 flex items-center justify-between text-xs text-slate-900 dark:text-slate-200 shadow-2xs">
          <span className="font-black text-slate-950 dark:text-white uppercase tracking-wider text-[11px]">
            Legal Standard: IOPC Fund Protocol 4A
          </span>
          <span className="font-bold text-teal-700 dark:text-teal-400 text-xs">
            SAR Hydrodynamic Consistency Certified
          </span>
        </div>
      </div>
    </Card>
  );
};

export default LookAlikeAssessment;
