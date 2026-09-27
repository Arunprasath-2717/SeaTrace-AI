// Maritime Boundaries, Shipping Lanes, and Ecological Zones for Indian Waters

export interface GeoPath {
  id: string;
  name: string;
  type: 'EEZ' | 'ShippingLane' | 'MarineProtectedArea';
  coordinates: [number, number][]; // [lng, lat]
  color: string;
}

export const INDIAN_EEZ_BOUNDARY: GeoPath = {
  id: 'ind-eez',
  name: 'India Exclusive Economic Zone (EEZ - 200 NM)',
  type: 'EEZ',
  color: '#00d4ff',
  coordinates: [
    // Gujarat / Arabian Sea western border
    [67.5, 23.5],
    [66.8, 22.0],
    [67.2, 20.5],
    [68.5, 18.5],
    [69.8, 16.0],
    [71.0, 13.5],
    [71.8, 11.0],
    [72.5, 8.0],
    // South of Kanyakumari / Lakshadweep
    [75.0, 5.5],
    [77.0, 5.0],
    [78.5, 6.0],
    // Gulf of Mannar median line
    [79.5, 8.5],
    [80.5, 10.0],
    // Bay of Bengal eastern boundary
    [82.5, 12.0],
    [85.0, 14.5],
    [87.5, 17.0],
    [89.0, 19.5],
    [89.5, 21.2],
  ]
};

export const MAJOR_SHIPPING_LANES: GeoPath[] = [
  {
    id: 'lane-arabian-gulf',
    name: 'Persian Gulf to Malacca Deep Sea Trunk Route',
    type: 'ShippingLane',
    color: '#38bdf8',
    coordinates: [
      [60.0, 24.0],
      [65.0, 20.5],
      [70.0, 16.5],
      [74.0, 11.5],
      [77.5, 7.0],
      [80.5, 5.8],
      [85.0, 5.7],
      [90.0, 5.8],
      [95.0, 5.5],
    ]
  },
  {
    id: 'lane-mumbai-high',
    name: 'Mumbai High Offshore Oil Corridor',
    type: 'ShippingLane',
    color: '#0ea5e9',
    coordinates: [
      [71.2, 19.5],
      [71.8, 18.8],
      [72.4, 18.2],
      [72.8, 18.9],
    ]
  },
  {
    id: 'lane-bay-of-bengal',
    name: 'Kolkata-Chennai-Colombo Shipping Lane',
    type: 'ShippingLane',
    color: '#38bdf8',
    coordinates: [
      [88.2, 21.5],
      [86.8, 19.5],
      [84.5, 16.5],
      [81.8, 13.5],
      [80.5, 10.0],
      [80.0, 7.5],
    ]
  },
  {
    id: 'lane-six-degree',
    name: 'Six Degree Channel (Great Nicobar Entrance to Malacca)',
    type: 'ShippingLane',
    color: '#06b6d4',
    coordinates: [
      [90.0, 6.0],
      [93.5, 6.0],
      [95.5, 5.8],
      [97.5, 5.2],
    ]
  }
];

export const SENSITIVE_MARINE_AREAS = [
  {
    id: 'gulf-of-mannar-mpa',
    name: 'Gulf of Mannar Biosphere Reserve',
    center: [79.2, 9.1],
    radiusKm: 45,
    riskLevel: 'Severe Ecological Vulnerability (Coral Reefs & Dugongs)'
  },
  {
    id: 'sunderbans-delta',
    name: 'Sundarbans Mangrove Marine Biosphere',
    center: [88.8, 21.6],
    radiusKm: 60,
    riskLevel: 'Critical Wetland Habitat (Royal Bengal Tiger & Cetaceans)'
  },
  {
    id: 'lakshadweep-atolls',
    name: 'Lakshadweep Coral Atolls Reserve',
    center: [72.6, 10.5],
    radiusKm: 50,
    riskLevel: 'Fragile Coral Reef Ecosystem'
  }
];
