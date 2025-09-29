import type { WaterSample, RegionalAnalysis, LocationData, ScientistProfile } from '../types';

// Demo water samples for different regions of India
export const demoSamples: WaterSample[] = [
  // Delhi samples
  {
    id: 'DEL001',
    latitude: 28.6139,
    longitude: 77.2090,
    pb: 0.015, // Above WHO limit
    as: 0.008,
    cd: 0.002,
    cr: 0.045,
    ni: 0.065,
    pH: 7.2,
    conductivity: 850,
    sampleDate: new Date('2024-01-15'),
    location: 'Central Delhi - Connaught Place',
    collectedBy: 'Dr. Priya Sharma',
    notes: 'Near industrial area, elevated lead levels',
  },
  {
    id: 'DEL002',
    latitude: 28.7041,
    longitude: 77.1025,
    pb: 0.006,
    as: 0.004,
    cd: 0.001,
    cr: 0.028,
    ni: 0.052,
    pH: 7.8,
    conductivity: 420,
    sampleDate: new Date('2024-01-16'),
    location: 'North Delhi - Pitampura',
    collectedBy: 'Dr. Rajesh Kumar',
    notes: 'Residential area, generally good quality',
  },
  {
    id: 'DEL003',
    latitude: 28.5355,
    longitude: 77.3910,
    pb: 0.022, // High lead
    as: 0.015, // High arsenic
    cd: 0.005, // High cadmium
    cr: 0.068, // High chromium
    ni: 0.089,
    pH: 6.8,
    conductivity: 1200,
    sampleDate: new Date('2024-01-17'),
    location: 'East Delhi - Mayur Vihar',
    collectedBy: 'Dr. Amit Singh',
    notes: 'Near Yamuna river, multiple metal contamination',
  },

  // Mumbai samples
  {
    id: 'MUM001',
    latitude: 19.0760,
    longitude: 72.8777,
    pb: 0.008,
    as: 0.006,
    cd: 0.003,
    cr: 0.038,
    ni: 0.045,
    pH: 7.5,
    conductivity: 650,
    sampleDate: new Date('2024-01-18'),
    location: 'South Mumbai - Colaba',
    collectedBy: 'Dr. Meera Patel',
    notes: 'Coastal area, moderate contamination',
  },
  {
    id: 'MUM002',
    latitude: 19.1136,
    longitude: 72.8697,
    pb: 0.018, // High lead
    as: 0.012,
    cd: 0.004,
    cr: 0.055,
    ni: 0.078,
    pH: 7.1,
    conductivity: 950,
    sampleDate: new Date('2024-01-19'),
    location: 'Central Mumbai - Dharavi',
    collectedBy: 'Dr. Suresh Iyer',
    notes: 'Dense population area, industrial influence',
  },

  // Kolkata samples
  {
    id: 'KOL001',
    latitude: 22.5726,
    longitude: 88.3639,
    pb: 0.012,
    as: 0.018, // Very high arsenic
    cd: 0.003,
    cr: 0.042,
    ni: 0.058,
    pH: 7.3,
    conductivity: 780,
    sampleDate: new Date('2024-01-20'),
    location: 'Central Kolkata - Park Street',
    collectedBy: 'Dr. Anita Das',
    notes: 'High arsenic levels, requires immediate attention',
  },
  {
    id: 'KOL002',
    latitude: 22.6858,
    longitude: 88.4497,
    pb: 0.025, // Very high lead
    as: 0.021, // Very high arsenic
    cd: 0.008, // Very high cadmium
    cr: 0.075, // High chromium
    ni: 0.095,
    pH: 6.5,
    conductivity: 1450,
    sampleDate: new Date('2024-01-21'),
    location: 'North Kolkata - Dum Dum',
    collectedBy: 'Dr. Bimal Roy',
    notes: 'Industrial area, critical contamination levels',
  },

  // Chennai samples
  {
    id: 'CHE001',
    latitude: 13.0827,
    longitude: 80.2707,
    pb: 0.005,
    as: 0.003,
    cd: 0.001,
    cr: 0.025,
    ni: 0.035,
    pH: 8.1,
    conductivity: 380,
    sampleDate: new Date('2024-01-22'),
    location: 'Central Chennai - T. Nagar',
    collectedBy: 'Dr. Lakshmi Venkat',
    notes: 'Good quality water, meets all standards',
  },
  {
    id: 'CHE002',
    latitude: 13.1185,
    longitude: 80.1987,
    pb: 0.014,
    as: 0.009,
    cd: 0.004,
    cr: 0.048,
    ni: 0.067,
    pH: 7.6,
    conductivity: 720,
    sampleDate: new Date('2024-01-23'),
    location: 'North Chennai - Ambattur',
    collectedBy: 'Dr. Ravi Krishnan',
    notes: 'Industrial zone, moderate contamination',
  },

  // Bangalore samples
  {
    id: 'BLR001',
    latitude: 12.9716,
    longitude: 77.5946,
    pb: 0.007,
    as: 0.005,
    cd: 0.002,
    cr: 0.032,
    ni: 0.048,
    pH: 7.9,
    conductivity: 520,
    sampleDate: new Date('2024-01-24'),
    location: 'Central Bangalore - MG Road',
    collectedBy: 'Dr. Sunitha Rao',
    notes: 'IT corridor area, acceptable quality',
  },
  {
    id: 'BLR002',
    latitude: 12.8698,
    longitude: 77.6848,
    pb: 0.016,
    as: 0.011,
    cd: 0.005,
    cr: 0.058,
    ni: 0.082,
    pH: 7.2,
    conductivity: 890,
    sampleDate: new Date('2024-01-25'),
    location: 'Electronic City - Industrial Area',
    collectedBy: 'Dr. Manjunath Gowda',
    notes: 'Tech hub area, elevated metal levels',
  },

  // Additional samples for better data visualization
  {
    id: 'HYD001',
    latitude: 17.3850,
    longitude: 78.4867,
    pb: 0.009,
    as: 0.007,
    cd: 0.003,
    cr: 0.039,
    ni: 0.055,
    pH: 7.7,
    conductivity: 610,
    sampleDate: new Date('2024-01-26'),
    location: 'Hyderabad - HITEC City',
    collectedBy: 'Dr. Ramesh Reddy',
    notes: 'Technology district, moderate quality',
  },
  {
    id: 'PUN001',
    latitude: 18.5204,
    longitude: 73.8567,
    pb: 0.011,
    as: 0.008,
    cd: 0.003,
    cr: 0.044,
    ni: 0.061,
    pH: 7.4,
    conductivity: 680,
    sampleDate: new Date('2024-01-27'),
    location: 'Pune - Hinjewadi',
    collectedBy: 'Dr. Pooja Joshi',
    notes: 'IT park vicinity, acceptable levels',
  },
  {
    id: 'AHM001',
    latitude: 23.0225,
    longitude: 72.5714,
    pb: 0.013,
    as: 0.010,
    cd: 0.004,
    cr: 0.051,
    ni: 0.074,
    pH: 7.0,
    conductivity: 820,
    sampleDate: new Date('2024-01-28'),
    location: 'Ahmedabad - Bopal',
    collectedBy: 'Dr. Niral Shah',
    notes: 'Emerging area, moderate contamination',
  },

  // Recent trend data samples
  {
    id: 'DEL004',
    latitude: 28.4595,
    longitude: 77.0266,
    pb: 0.019,
    as: 0.013,
    cd: 0.006,
    cr: 0.062,
    ni: 0.088,
    pH: 6.9,
    conductivity: 1050,
    sampleDate: new Date('2024-02-01'),
    location: 'Gurgaon - Cyber Hub',
    collectedBy: 'Dr. Kavita Gupta',
    notes: 'Corporate district, increasing pollution trend',
  },
  {
    id: 'MUM003',
    latitude: 19.2183,
    longitude: 72.9781,
    pb: 0.021,
    as: 0.016,
    cd: 0.007,
    cr: 0.069,
    ni: 0.092,
    pH: 6.8,
    conductivity: 1180,
    sampleDate: new Date('2024-02-02'),
    location: 'Navi Mumbai - Vashi',
    collectedBy: 'Dr. Arjun Nair',
    notes: 'New development area, rising contamination',
  },
];

// Demo regional analysis data
export const demoRegionalAnalysis: RegionalAnalysis[] = [
  {
    region: 'Delhi NCR',
    totalSamples: 4,
    averageHMPI: 145.6,
    trendData: [
      { date: '2024-01', hmpi: 132.4, hpi: 156.8 },
      { date: '2024-02', hmpi: 158.9, hpi: 189.2 },
      { date: '2024-03', hmpi: 145.6, hpi: 172.1 },
    ],
    hotspots: [
      {
        id: 'DEL_HOT1',
        name: 'East Delhi Industrial Zone',
        coordinates: [28.5355, 77.3910],
        region: 'Delhi NCR',
        samples: demoSamples.filter(s => s.id === 'DEL003'),
        averageHMPI: 189.5,
        classification: 'Unsafe',
      },
    ],
  },
  {
    region: 'Mumbai Metropolitan',
    totalSamples: 3,
    averageHMPI: 138.2,
    trendData: [
      { date: '2024-01', hmpi: 125.3, hpi: 148.7 },
      { date: '2024-02', hmpi: 151.1, hpi: 179.3 },
      { date: '2024-03', hmpi: 138.2, hpi: 165.8 },
    ],
    hotspots: [
      {
        id: 'MUM_HOT1',
        name: 'Dharavi Industrial Area',
        coordinates: [19.1136, 72.8697],
        region: 'Mumbai Metropolitan',
        samples: demoSamples.filter(s => s.id === 'MUM002'),
        averageHMPI: 172.8,
        classification: 'Moderate',
      },
    ],
  },
  {
    region: 'West Bengal',
    totalSamples: 2,
    averageHMPI: 198.7,
    trendData: [
      { date: '2024-01', hmpi: 185.4, hpi: 221.6 },
      { date: '2024-02', hmpi: 212.0, hpi: 267.3 },
      { date: '2024-03', hmpi: 198.7, hpi: 244.5 },
    ],
    hotspots: [
      {
        id: 'KOL_HOT1',
        name: 'North Kolkata Industrial Belt',
        coordinates: [22.6858, 88.4497],
        region: 'West Bengal',
        samples: demoSamples.filter(s => s.id === 'KOL002'),
        averageHMPI: 267.3,
        classification: 'Unsafe',
      },
    ],
  },
  {
    region: 'Tamil Nadu',
    totalSamples: 2,
    averageHMPI: 89.4,
    trendData: [
      { date: '2024-01', hmpi: 82.1, hpi: 95.6 },
      { date: '2024-02', hmpi: 96.7, hpi: 112.3 },
      { date: '2024-03', hmpi: 89.4, hpi: 103.9 },
    ],
    hotspots: [],
  },
  {
    region: 'Karnataka',
    totalSamples: 2,
    averageHMPI: 124.7,
    trendData: [
      { date: '2024-01', hmpi: 118.3, hpi: 137.2 },
      { date: '2024-02', hmpi: 131.1, hpi: 152.8 },
      { date: '2024-03', hmpi: 124.7, hpi: 145.0 },
    ],
    hotspots: [],
  },
];

// Demo scientist profiles for enhanced data
export const demoScientists: ScientistProfile[] = [
  {
    name: 'Dr. Priya Sharma',
    specialization: 'Environmental Chemistry',
    institution: 'All India Institute of Medical Sciences, Delhi',
    experience: '15 years',
    certifications: ['WHO Water Quality Expert', 'Environmental Impact Assessment'],
  },
  {
    name: 'Dr. Rajesh Kumar',
    specialization: 'Hydrology & Water Resources',
    institution: 'Indian Institute of Technology, Delhi',
    experience: '12 years',
    certifications: ['Groundwater Management Specialist', 'Water Quality Analyst'],
  },
  {
    name: 'Dr. Amit Singh',
    specialization: 'Heavy Metal Contamination',
    institution: 'Central Pollution Control Board',
    experience: '18 years',
    certifications: ['Toxic Metal Analysis Expert', 'Environmental Monitoring'],
  },
  {
    name: 'Dr. Meera Patel',
    specialization: 'Coastal Hydrology',
    institution: 'Indian Institute of Technology, Bombay',
    experience: '10 years',
    certifications: ['Marine Pollution Assessment', 'Coastal Water Quality'],
  },
  {
    name: 'Dr. Suresh Iyer',
    specialization: 'Industrial Water Treatment',
    institution: 'National Environmental Engineering Research Institute',
    experience: '20 years',
    certifications: ['Industrial Effluent Treatment', 'Water Recycling Systems'],
  },
  {
    name: 'Dr. Anita Das',
    specialization: 'Arsenic Contamination Studies',
    institution: 'Jadavpur University, Kolkata',
    experience: '16 years',
    certifications: ['Arsenic Detection & Mitigation', 'Rural Water Quality'],
  },
  {
    name: 'Dr. Bimal Roy',
    specialization: 'Industrial Pollution Control',
    institution: 'Bengal Engineering & Science University',
    experience: '22 years',
    certifications: ['Industrial Waste Management', 'Heavy Metal Analysis'],
  },
  {
    name: 'Dr. Lakshmi Venkat',
    specialization: 'Public Health & Water Safety',
    institution: 'Christian Medical College, Vellore',
    experience: '14 years',
    certifications: ['Public Health Water Standards', 'Epidemiological Studies'],
  },
  {
    name: 'Dr. Ravi Krishnan',
    specialization: 'Environmental Toxicology',
    institution: 'Anna University, Chennai',
    experience: '11 years',
    certifications: ['Toxicological Risk Assessment', 'Environmental Health'],
  },
  {
    name: 'Dr. Sunitha Rao',
    specialization: 'Water Quality Monitoring',
    institution: 'Indian Institute of Science, Bangalore',
    experience: '13 years',
    certifications: ['Advanced Water Analysis', 'Quality Control Systems'],
  },
];

// Enhanced demo location data for nearby feature with more comprehensive data
export const demoLocations: LocationData[] = [
  {
    id: 'LOC001',
    name: 'Central Park Water Point',
    coordinates: [28.6139, 77.2090],
    region: 'Delhi NCR',
    samples: [demoSamples[0]],
    averageHMPI: 145.2,
    classification: 'Moderate',
  },
  {
    id: 'LOC002',
    name: 'Residential Complex Well',
    coordinates: [28.7041, 77.1025],
    region: 'Delhi NCR',
    samples: [demoSamples[1]],
    averageHMPI: 87.3,
    classification: 'Safe',
  },
  {
    id: 'LOC003',
    name: 'Industrial Area Bore Well',
    coordinates: [28.5355, 77.3910],
    region: 'Delhi NCR',
    samples: [demoSamples[2]],
    averageHMPI: 198.7,
    classification: 'Unsafe',
  },
  {
    id: 'LOC004',
    name: 'Metro Station Water Facility',
    coordinates: [28.6285, 77.2120],
    region: 'Delhi NCR',
    samples: [],
    averageHMPI: 112.5,
    classification: 'Moderate',
  },
  {
    id: 'LOC005',
    name: 'University Campus Well',
    coordinates: [28.6850, 77.2070],
    region: 'Delhi NCR',
    samples: [],
    averageHMPI: 95.8,
    classification: 'Safe',
  },
  {
    id: 'LOC006',
    name: 'Hospital Water Supply',
    coordinates: [28.5980, 77.2050],
    region: 'Delhi NCR',
    samples: [],
    averageHMPI: 78.3,
    classification: 'Safe',
  },
  {
    id: 'LOC007',
    name: 'Industrial Estate Borewell',
    coordinates: [28.5100, 77.4150],
    region: 'Delhi NCR',
    samples: [],
    averageHMPI: 167.9,
    classification: 'Moderate',
  },
  {
    id: 'LOC008',
    name: 'Slum Area Hand Pump',
    coordinates: [28.5850, 77.3200],
    region: 'Delhi NCR',
    samples: [],
    averageHMPI: 234.1,
    classification: 'Unsafe',
  },
];

// Function to get nearby locations based on coordinates
export const getNearbyLocations = (latitude: number, longitude: number, radiusKm: number = 10): LocationData[] => {
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);
  
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  
  return demoLocations
    .map(location => ({
      ...location,
      distance: calculateDistance(latitude, longitude, location.coordinates[0], location.coordinates[1])
    }))
    .filter(location => location.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 8); // Limit to 8 nearby locations
};

// Generate metal contamination data for nearby locations
export const generateMetalContaminationData = (location: LocationData) => {
  // Generate realistic metal contamination percentages based on HMPI
  const baseContamination = location.averageHMPI / 100;
  
  return {
    pb: Math.min(baseContamination * 0.8 + Math.random() * 0.4, 5.0),
    as: Math.min(baseContamination * 0.9 + Math.random() * 0.3, 4.5),
    cd: Math.min(baseContamination * 0.6 + Math.random() * 0.5, 3.8),
    cr: Math.min(baseContamination * 1.1 + Math.random() * 0.6, 6.2),
    ni: Math.min(baseContamination * 0.7 + Math.random() * 0.4, 4.1),
  };
};

// Citizen-friendly explanations
export const waterQualityGuide = {
  classifications: {
    Safe: {
      description: 'Water meets all safety standards and is safe for drinking',
      actionRequired: 'Continue regular monitoring',
      color: '#10B981',
      icon: '✅',
    },
    Moderate: {
      description: 'Water has moderate contamination levels - caution advised',
      actionRequired: 'Consider water treatment before consumption',
      color: '#F59E0B',
      icon: '⚠️',
    },
    Unsafe: {
      description: 'Water has high contamination levels - not safe for drinking',
      actionRequired: 'Immediate action required - use alternative water source',
      color: '#EF4444',
      icon: '🚫',
    },
  },
  metals: {
    pb: {
      name: 'Lead (Pb)',
      sources: 'Old pipes, industrial discharge, paint',
      healthEffects: 'Neurological damage, kidney problems',
      whoLimit: '0.01 mg/L',
    },
    as: {
      name: 'Arsenic (As)',
      sources: 'Natural deposits, industrial activities',
      healthEffects: 'Cancer, skin problems, cardiovascular disease',
      whoLimit: '0.01 mg/L',
    },
    cd: {
      name: 'Cadmium (Cd)',
      sources: 'Industrial discharge, fertilizers',
      healthEffects: 'Kidney damage, bone disease',
      whoLimit: '0.003 mg/L',
    },
    cr: {
      name: 'Chromium (Cr)',
      sources: 'Industrial processes, leather tanning',
      healthEffects: 'Skin irritation, respiratory problems',
      whoLimit: '0.05 mg/L',
    },
    ni: {
      name: 'Nickel (Ni)',
      sources: 'Natural deposits, industrial activities',
      healthEffects: 'Allergic reactions, respiratory issues',
      whoLimit: '0.07 mg/L',
    },
  },
};

// Interactive chart data for policymaker interface
export const generateInteractiveChartData = () => {
  const months = ['Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024'];
  
  return {
    trendData: months.map(month => ({
      month,
      'Delhi NCR': 145 + Math.random() * 30 - 15,
      'Mumbai Metropolitan': 138 + Math.random() * 25 - 12,
      'West Bengal': 198 + Math.random() * 40 - 20,
      'Tamil Nadu': 89 + Math.random() * 20 - 10,
      'Karnataka': 124 + Math.random() * 30 - 15,
    })),
    metalDistribution: [
      { metal: 'Lead (Pb)', contamination: 15.8, limit: 10, color: '#EF4444' },
      { metal: 'Arsenic (As)', contamination: 18.2, limit: 10, color: '#F97316' },
      { metal: 'Cadmium (Cd)', contamination: 12.5, limit: 3, color: '#EAB308' },
      { metal: 'Chromium (Cr)', contamination: 22.1, limit: 50, color: '#10B981' },
      { metal: 'Nickel (Ni)', contamination: 14.7, limit: 70, color: '#3B82F6' },
    ],
    riskAssessment: [
      { region: 'Delhi NCR', lowRisk: 25, mediumRisk: 45, highRisk: 20, criticalRisk: 10 },
      { region: 'Mumbai Metropolitan', lowRisk: 30, mediumRisk: 40, highRisk: 25, criticalRisk: 5 },
      { region: 'West Bengal', lowRisk: 15, mediumRisk: 25, highRisk: 35, criticalRisk: 25 },
      { region: 'Tamil Nadu', lowRisk: 60, mediumRisk: 30, highRisk: 8, criticalRisk: 2 },
      { region: 'Karnataka', lowRisk: 40, mediumRisk: 35, highRisk: 20, criticalRisk: 5 },
    ],
  };
};