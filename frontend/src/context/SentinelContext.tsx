import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  PageId,
  SpillIncident,
  Vessel,
  IncidentStatus,
  IncidentSeverity,
} from '../types/oceanSentinel';
import {
  INITIAL_INCIDENTS,
  INITIAL_VESSELS,
  INITIAL_CANDIDATE_ATTRIBUTIONS,
} from '../data/sentinelData';

interface Toast {
  id: string;
  type: 'success' | 'warning' | 'alert' | 'info';
  message: string;
}

interface SettingsState {
  confidenceThreshold: number; // default 75%
  spatialWeight: number; // default 30
  temporalWeight: number; // default 25
  driftWeight: number; // default 25
  behaviorWeight: number; // default 20
  demoMode: boolean; // true
}

interface SentinelContextType {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  
  // Incidents
  incidents: SpillIncident[];
  selectedIncident: SpillIncident | null;
  setSelectedIncident: (inc: SpillIncident | null) => void;
  createIncident: (newInc: Omit<SpillIncident, 'id' | 'lastUpdated'>) => void;
  updateIncidentStatus: (id: string, status: IncidentStatus) => void;
  updateIncidentInvestigator: (id: string, investigator: string) => void;
  addIncidentNote: (id: string, note: string) => void;
  
  // Vessels
  vessels: Vessel[];
  selectedVessel: Vessel | null;
  setSelectedVessel: (v: Vessel | null) => void;
  updateVesselStatus: (id: string, status: Vessel['investigationStatus']) => void;
  
  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  dismissToast: (id: string) => void;

  // Settings
  settings: SettingsState;
  updateSettings: (newSettings: Partial<SettingsState>) => void;
  resetDemoData: () => void;
}

const SentinelContext = createContext<SentinelContextType | undefined>(undefined);

const STORAGE_KEY_INCIDENTS = 'ocean_sentinel_incidents_v1';
const STORAGE_KEY_SETTINGS = 'ocean_sentinel_settings_v1';

export const SentinelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<PageId>('command-center');
  const [selectedRegion, setSelectedRegion] = useState<string>('All Regions');
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Incidents with LocalStorage
  const [incidents, setIncidents] = useState<SpillIncident[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INCIDENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved incidents', e);
    }
    return INITIAL_INCIDENTS;
  });

  const [selectedIncident, setSelectedIncident] = useState<SpillIncident | null>(() => {
    return INITIAL_INCIDENTS[0] || null;
  });

  // Vessels
  const [vessels, setVessels] = useState<Vessel[]>(INITIAL_VESSELS);
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);

  // Settings with LocalStorage
  const [settings, setSettings] = useState<SettingsState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved settings', e);
    }
    return {
      confidenceThreshold: 75,
      spatialWeight: 30,
      temporalWeight: 25,
      driftWeight: 25,
      behaviorWeight: 20,
      demoMode: true,
    };
  });

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync incidents to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INCIDENTS, JSON.stringify(incidents));
    } catch (e) {
      console.error('Failed to save incidents', e);
    }
  }, [incidents]);

  // Sync settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  }, [settings]);

  // Actions
  const createIncident = (newInc: Omit<SpillIncident, 'id' | 'lastUpdated'>) => {
    const id = `inc-st-${Math.floor(2054 + Math.random() * 900)}`;
    const fullInc: SpillIncident = {
      ...newInc,
      id,
      lastUpdated: 'Just now',
    };
    setIncidents((prev) => [fullInc, ...prev]);
    setSelectedIncident(fullInc);
    showToast(`New incident ${fullInc.code} registered and logged to storage.`, 'success');
  };

  const updateIncidentStatus = (id: string, status: IncidentStatus) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status, lastUpdated: 'Just now' } : inc))
    );
    if (selectedIncident?.id === id) {
      setSelectedIncident((prev) => (prev ? { ...prev, status, lastUpdated: 'Just now' } : null));
    }
    showToast(`Incident status updated to ${status}.`, 'info');
  };

  const updateIncidentInvestigator = (id: string, investigator: string) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === id ? { ...inc, assignedInvestigator: investigator, lastUpdated: 'Just now' } : inc
      )
    );
    if (selectedIncident?.id === id) {
      setSelectedIncident((prev) =>
        prev ? { ...prev, assignedInvestigator: investigator, lastUpdated: 'Just now' } : null
      );
    }
    showToast(`Investigator assigned: ${investigator}`, 'success');
  };

  const addIncidentNote = (id: string, note: string) => {
    const timestamped = `${new Date().toISOString().substring(11, 16)} UTC: ${note}`;
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === id
          ? {
              ...inc,
              notes: [...(inc.notes || []), timestamped],
              lastUpdated: 'Just now',
            }
          : inc
      )
    );
    if (selectedIncident?.id === id) {
      setSelectedIncident((prev) =>
        prev
          ? {
              ...prev,
              notes: [...(prev.notes || []), timestamped],
              lastUpdated: 'Just now',
            }
          : null
      );
    }
    showToast(`Investigation note appended to dossier.`, 'info');
  };

  const updateVesselStatus = (id: string, status: Vessel['investigationStatus']) => {
    setVessels((prev) =>
      prev.map((v) => (v.id === id ? { ...v, investigationStatus: status } : v))
    );
    if (selectedVessel?.id === id) {
      setSelectedVessel((prev) => (prev ? { ...prev, investigationStatus: status } : null));
    }
    showToast(`Vessel classification updated to ${status}.`, 'info');
  };

  const updateSettings = (newSettings: Partial<SettingsState>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast(`Operational parameters updated.`, 'success');
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY_INCIDENTS);
    localStorage.removeItem(STORAGE_KEY_SETTINGS);
    setIncidents(INITIAL_INCIDENTS);
    setVessels(INITIAL_VESSELS);
    setSelectedIncident(INITIAL_INCIDENTS[0]);
    setSelectedVessel(null);
    setSettings({
      confidenceThreshold: 75,
      spatialWeight: 30,
      temporalWeight: 25,
      driftWeight: 25,
      behaviorWeight: 20,
      demoMode: true,
    });
    showToast(`Demo environment reset to baseline factory state.`, 'warning');
  };

  return (
    <SentinelContext.Provider
      value={{
        activePage,
        setActivePage,
        selectedRegion,
        setSelectedRegion,
        globalSearch,
        setGlobalSearch,
        incidents,
        selectedIncident,
        setSelectedIncident,
        createIncident,
        updateIncidentStatus,
        updateIncidentInvestigator,
        addIncidentNote,
        vessels,
        selectedVessel,
        setSelectedVessel,
        updateVesselStatus,
        toasts,
        showToast,
        dismissToast,
        settings,
        updateSettings,
        resetDemoData,
      }}
    >
      {children}
    </SentinelContext.Provider>
  );
};

export const useSentinel = () => {
  const context = useContext(SentinelContext);
  if (!context) {
    throw new Error('useSentinel must be used within a SentinelProvider');
  }
  return context;
};
