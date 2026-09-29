import React from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Satellite, Ship, Waves, Wind, Mountain, Database } from 'lucide-react';

export type DataSourceStatus =
  | 'Connected'
  | 'Available'
  | 'Not Connected'
  | 'Synthetic / Controlled Scenario';

interface DataSourceItem {
  id: string;
  name: string;
  category: 'Satellite' | 'AIS' | 'Ocean Currents' | 'Wind' | 'Wave Data' | 'Geospatial Data' | 'Ocean Drift Model';
  provider: string;
  accessStatus: DataSourceStatus;
  accessDetails: string;
  integrationStatus: string;
}

const dataSources: DataSourceItem[] = [
  {
    id: 'src-sat-1',
    name: 'Copernicus Sentinel-1 SAR (C-Band)',
    category: 'Satellite',
    provider: 'European Space Agency (ESA) / Copernicus Data Space',
    accessStatus: 'Available',
    accessDetails: 'Public REST API / Open Access Hub with free researcher credentials.',
    integrationStatus: 'Active scene ingested in prototype scenario.',
  },
  {
    id: 'src-ais-1',
    name: 'Historical AIS Trajectory Streams',
    category: 'AIS',
    provider: 'Seeded Scenario Database (PostGIS Local Archive)',
    accessStatus: 'Synthetic / Controlled Scenario',
    accessDetails: 'Calibrated benchmark dataset containing candidate tanker corridors for algorithmic testing.',
    integrationStatus: 'Fully loaded in local PostGIS spatial index.',
  },
  {
    id: 'src-ais-2',
    name: 'Commercial Satellite AIS (Spire / exactEarth)',
    category: 'AIS',
    provider: 'Commercial Maritime Transponder Providers',
    accessStatus: 'Not Connected',
    accessDetails: 'Requires commercial enterprise streaming subscription and API token.',
    integrationStatus: 'Planned for Phase 3 operational deployment; not connected in prototype.',
  },
  {
    id: 'src-ocean-1',
    name: 'HYCOM Global 1/12° Ocean Current Analysis',
    category: 'Ocean Currents',
    provider: 'National Oceanic and Atmospheric Administration (NOAA)',
    accessStatus: 'Available',
    accessDetails: 'Public OPeNDAP / NetCDF server providing 3-hourly 3D hydrodynamic vectors.',
    integrationStatus: 'Local bounding box subset parsed for Gulf of Mexico scenario.',
  },
  {
    id: 'src-wind-1',
    name: 'ECMWF ERA5 Atmospheric Reanalysis',
    category: 'Wind',
    provider: 'European Centre for Medium-Range Weather Forecasts (ECMWF)',
    accessStatus: 'Available',
    accessDetails: 'Climate Data Store (CDS) API providing hourly 10m u/v wind components.',
    integrationStatus: 'Pre-fetched and coupled with OpenDrift forcing.',
  },
  {
    id: 'src-wave-1',
    name: 'NOAA WaveWatch III (WW3)',
    category: 'Wave Data',
    provider: 'NOAA Environmental Modeling Center',
    accessStatus: 'Available',
    accessDetails: 'Global ocean surface wave directional spectrum and significant wave height.',
    integrationStatus: 'Stokes drift monochromatic approximation enabled.',
  },
  {
    id: 'src-geo-1',
    name: 'Natural Earth & OpenStreetMap Vector Tiles',
    category: 'Geospatial Data',
    provider: 'Open-Source Geospatial Community & MapLibre',
    accessStatus: 'Connected',
    accessDetails: 'Local MapLibre style specifications and vector basemaps.',
    integrationStatus: 'Live client-side rendering active.',
  },
  {
    id: 'src-model-1',
    name: 'OpenDrift / OpenOil Lagrangian Trajectory Engine',
    category: 'Ocean Drift Model',
    provider: 'Norwegian Meteorological Institute (MET Norway)',
    accessStatus: 'Connected',
    accessDetails: 'Python scientific modeling library running reverse and forward oil drift advection.',
    integrationStatus: 'Connected via backend service adapter.',
  },
];

export const DataSourcesPage: React.FC = () => {
  const getStatusBadge = (status: DataSourceStatus) => {
    switch (status) {
      case 'Connected':
        return <Badge variant="mint" size="sm">CONNECTED</Badge>;
      case 'Available':
        return <Badge variant="teal" size="sm">AVAILABLE</Badge>;
      case 'Synthetic / Controlled Scenario':
        return <Badge variant="warning" size="sm">SYNTHETIC / SCENARIO</Badge>;
      case 'Not Connected':
      default:
        return <Badge variant="neutral" size="sm">NOT CONNECTED</Badge>;
    }
  };

  const getCategoryIcon = (category: DataSourceItem['category']) => {
    switch (category) {
      case 'Satellite':
        return <Satellite className="w-4 h-4 text-teal-700 dark:text-teal-400" />;
      case 'AIS':
        return <Ship className="w-4 h-4 text-indigo-700 dark:text-indigo-400" />;
      case 'Ocean Currents':
        return <Waves className="w-4 h-4 text-sky-600 dark:text-sky-400" />;
      case 'Wind':
        return <Wind className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />;
      case 'Wave Data':
        return <Waves className="w-4 h-4 text-purple-700 dark:text-purple-400" />;
      case 'Geospatial Data':
        return <Mountain className="w-4 h-4 text-amber-700 dark:text-amber-400" />;
      case 'Ocean Drift Model':
        return <Database className="w-4 h-4 text-teal-700 dark:text-teal-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-950 dark:text-white">
            Data Sources & Integration Architecture
          </h2>
          <p className="text-xs text-slate-800 dark:text-slate-300 font-semibold mt-1">
            Status of remote sensing constellations, oceanic circulation models, and vessel telemetry
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="mint" size="md">2 CONNECTED</Badge>
          <Badge variant="teal" size="md">4 AVAILABLE</Badge>
          <Badge variant="warning" size="md">1 SYNTHETIC</Badge>
          <Badge variant="neutral" size="md">1 NOT CONNECTED</Badge>
        </div>
      </div>

      {/* Honest Rigor Notice */}
      <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-300 font-sans leading-relaxed">
        <strong className="text-slate-950 dark:text-white">Data Connection Policy: </strong>
        SEATRACE clearly distinguishes live APIs, open scientific datasets, synthetic/controlled benchmark scenarios, and unconnected commercial feeds. We do not invent simulated provider credentials or pretend external commercial feeds are active.
      </div>

      {/* Data Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dataSources.map((source) => (
          <Card
            key={source.id}
            title={source.name}
            subtitle={source.provider}
            headerAction={getStatusBadge(source.accessStatus)}
            className="flex flex-col"
          >
            <div className="space-y-2.5 text-xs font-mono flex-1">
              <div className="flex items-center gap-2 text-teal-800 dark:text-teal-400 font-bold">
                {getCategoryIcon(source.category)}
                <span className="font-bold text-slate-950 dark:text-white uppercase text-[10px]">
                  Category: {source.category}
                </span>
              </div>

              <div className="p-2 rounded bg-slate-50 dark:bg-slate-900/40 border border-slate-300 dark:border-slate-800 font-sans text-slate-800 dark:text-slate-300 text-[11px] leading-relaxed">
                <span className="font-black text-slate-950 dark:text-white block font-mono text-[10px] uppercase mb-0.5">
                  Access Model
                </span>
                {source.accessDetails}
              </div>

              <div className="text-[11px] font-sans text-slate-700 dark:text-slate-400 font-medium">
                <span className="text-slate-950 dark:text-slate-200 font-mono text-[10px] font-bold uppercase">Status: </span>
                {source.integrationStatus}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DataSourcesPage;
