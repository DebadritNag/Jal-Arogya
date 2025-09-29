// Core types for the JalArogya application

export interface WaterSample {
  id: string;
  latitude: number;
  longitude: number;
  pb: number; // Lead (mg/L)
  as: number; // Arsenic (mg/L)
  cd: number; // Cadmium (mg/L)
  cr: number; // Chromium (mg/L)
  ni: number; // Nickel (mg/L)
  pH: number;
  conductivity: number; // μS/cm
  sampleDate: Date;
  location?: string;
  collectedBy?: string;
  notes?: string;
}

export interface HMPIResult {
  sampleId: string;
  hmpi: number;
  hpi: number;
  classification: 'Safe' | 'Moderate' | 'Unsafe';
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  metalContributions: {
    pb: number;
    as: number;
    cd: number;
    cr: number;
    ni: number;
  };
  metalIndexScores: {
    pb: { value: number; status: 'Safe' | 'Unsafe'; concentration: number };
    as: { value: number; status: 'Safe' | 'Unsafe'; concentration: number };
    cd: { value: number; status: 'Safe' | 'Unsafe'; concentration: number };
    cr: { value: number; status: 'Safe' | 'Unsafe'; concentration: number };
    ni: { value: number; status: 'Safe' | 'Unsafe'; concentration: number };
  };
  usability: {
    drinking: { status: 'Safe' | 'Caution' | 'Unsafe'; reason: string };
    agriculture: { status: 'Safe' | 'Caution' | 'Unsafe'; reason: string };
    industrial: { status: 'Safe' | 'Caution' | 'Unsafe'; reason: string };
  };
}

export interface ProcessedData {
  samples: WaterSample[];
  results: HMPIResult[];
  summary: {
    totalSamples: number;
    safeCount: number;
    moderateCount: number;
    unsafeCount: number;
    averageHMPI: number;
    averageHPI: number;
  };
}

export interface LocationData {
  id: string;
  name: string;
  coordinates: [number, number];
  region: string;
  samples: WaterSample[];
  averageHMPI: number;
  classification: 'Safe' | 'Moderate' | 'Unsafe';
}

export interface RegionalAnalysis {
  region: string;
  totalSamples: number;
  averageHMPI: number;
  trendData: Array<{
    date: string;
    hmpi: number;
    hpi: number;
  }>;
  hotspots: LocationData[];
}

export type UserRole = 'citizen' | 'scientist' | 'policymaker';

// Authentication types
export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  createdAt: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupData {
  username: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  securityKey?: string;
}

export interface ChartData {
  name: string;
  value: number;
  category?: string;
  date?: string;
}

export interface MapMarker {
  id: string;
  position: [number, number];
  classification: 'Safe' | 'Moderate' | 'Unsafe';
  popup: string;
  data: WaterSample;
}

export interface ScientistProfile {
  name: string;
  specialization: string;
  institution: string;
  experience: string;
  certifications: string[];
}