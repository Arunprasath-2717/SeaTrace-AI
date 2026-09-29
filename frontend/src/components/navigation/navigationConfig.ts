export interface NavItemConfig {
  id: string;
  label: string;
  path: string;
  iconName: 'LayoutDashboard' | 'AlertTriangle' | 'Scan' | 'ShieldCheck' | 'Compass' | 'Ship' | 'GitCompare' | 'FileCheck' | 'FileText' | 'Database' | 'Activity';
  badge?: string;
}

export interface NavSectionConfig {
  id: string;
  title: string;
  items: NavItemConfig[];
}

export const navigationConfig: NavSectionConfig[] = [
  {
    id: 'overview',
    title: 'OVERVIEW',
    items: [
      {
        id: 'dashboard',
        label: 'Command Dashboard',
        path: '/app',
        iconName: 'LayoutDashboard',
      },
    ],
  },
  {
    id: 'investigate',
    title: 'INVESTIGATE',
    items: [
      {
        id: 'incidents',
        label: 'Incidents',
        path: '/app/incidents',
        iconName: 'AlertTriangle',
        badge: '3 Active',
      },
      {
        id: 'detection',
        label: 'Detection',
        path: '/app/detection',
        iconName: 'Scan',
      },
      {
        id: 'validation',
        label: 'Validation',
        path: '/app/validation',
        iconName: 'ShieldCheck',
      },
      {
        id: 'origin',
        label: 'Origin Reconstruction',
        path: '/app/origin',
        iconName: 'Compass',
      },
      {
        id: 'vessels',
        label: 'Vessel Intelligence',
        path: '/app/vessels',
        iconName: 'Ship',
      },
      {
        id: 'counterfactual',
        label: 'Counterfactual Simulation',
        path: '/app/counterfactual',
        iconName: 'GitCompare',
      },
    ],
  },
  {
    id: 'evidence',
    title: 'EVIDENCE',
    items: [
      {
        id: 'evidence-package',
        label: 'Evidence Package',
        path: '/app/evidence',
        iconName: 'FileCheck',
      },
      {
        id: 'reports',
        label: 'Reports',
        path: '/app/reports',
        iconName: 'FileText',
      },
    ],
  },
  {
    id: 'system',
    title: 'SYSTEM',
    items: [
      {
        id: 'data-sources',
        label: 'Data Sources',
        path: '/app/data-sources',
        iconName: 'Database',
      },
      {
        id: 'system-status',
        label: 'System Status',
        path: '/app/system-status',
        iconName: 'Activity',
      },
    ],
  },
];
