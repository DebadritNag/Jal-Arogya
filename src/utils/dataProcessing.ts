import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import type { WaterSample, ProcessedData } from '../types';
import { processSample } from './hmpiCalculations';

/**
 * Parse CSV file and convert to water samples
 */
export function parseCSV(file: File): Promise<WaterSample[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const samples = (results.data as unknown[]).map((row, index: number) => {
            const data = row as Record<string, string | number>;
            return {
              id: String(data.id || `sample_${index + 1}`),
              latitude: parseFloat(String(data.latitude || data.lat || '0')),
              longitude: parseFloat(String(data.longitude || data.lng || data.lon || '0')),
              pb: parseFloat(String(data.pb || data.lead || '0')),
              as: parseFloat(String(data.as || data.arsenic || '0')),
              cd: parseFloat(String(data.cd || data.cadmium || '0')),
              cr: parseFloat(String(data.cr || data.chromium || '0')),
              ni: parseFloat(String(data.ni || data.nickel || '0')),
              pH: parseFloat(String(data.pH || data.ph || '7')),
              conductivity: parseFloat(String(data.conductivity || data.cond || '0')),
              sampleDate: new Date(String(data.sampleDate || data.date) || Date.now()),
              location: String(data.location || ''),
              collectedBy: String(data.collectedBy || ''),
              notes: String(data.notes || ''),
            };
          }).filter(sample => 
            !isNaN(sample.latitude) && 
            !isNaN(sample.longitude) && 
            !isNaN(sample.pb) && 
            !isNaN(sample.as) && 
            !isNaN(sample.cd) && 
            !isNaN(sample.cr) && 
            !isNaN(sample.ni)
          );
          resolve(samples);
        } catch (error) {
          reject(new Error('Error parsing CSV data: ' + error));
        }
      },
      error: (error) => {
        reject(new Error('Error reading CSV file: ' + error.message));
      }
    });
  });
}

/**
 * Parse Excel file and convert to water samples
 */
export function parseExcel(file: File): Promise<WaterSample[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const samples = (jsonData as unknown[]).map((row, index: number) => {
          const data = row as Record<string, string | number>;
          return {
            id: String(data.id || `sample_${index + 1}`),
            latitude: parseFloat(String(data.latitude || data.lat || '0')),
            longitude: parseFloat(String(data.longitude || data.lng || data.lon || '0')),
            pb: parseFloat(String(data.pb || data.lead || '0')),
            as: parseFloat(String(data.as || data.arsenic || '0')),
            cd: parseFloat(String(data.cd || data.cadmium || '0')),
            cr: parseFloat(String(data.cr || data.chromium || '0')),
            ni: parseFloat(String(data.ni || data.nickel || '0')),
            pH: parseFloat(String(data.pH || data.ph || '7')),
            conductivity: parseFloat(String(data.conductivity || data.cond || '0')),
            sampleDate: new Date(String(data.sampleDate || data.date) || Date.now()),
            location: String(data.location || ''),
            collectedBy: String(data.collectedBy || ''),
            notes: String(data.notes || ''),
          };
        }).filter(sample => 
          !isNaN(sample.latitude) && 
          !isNaN(sample.longitude) && 
          !isNaN(sample.pb) && 
          !isNaN(sample.as) && 
          !isNaN(sample.cd) && 
          !isNaN(sample.cr) && 
          !isNaN(sample.ni)
        );
        
        resolve(samples);
      } catch (error) {
        reject(new Error('Error parsing Excel file: ' + error));
      }
    };
    reader.onerror = () => reject(new Error('Error reading Excel file'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Process water samples and calculate HMPI results
 */
export function processWaterSamples(samples: WaterSample[]): ProcessedData {
  const results = samples.map(sample => processSample(sample));
  
  const safeCount = results.filter(r => r.classification === 'Safe').length;
  const moderateCount = results.filter(r => r.classification === 'Moderate').length;
  const unsafeCount = results.filter(r => r.classification === 'Unsafe').length;
  
  const averageHMPI = results.reduce((sum, r) => sum + r.hmpi, 0) / results.length;
  const averageHPI = results.reduce((sum, r) => sum + r.hpi, 0) / results.length;
  
  return {
    samples,
    results,
    summary: {
      totalSamples: samples.length,
      safeCount,
      moderateCount,
      unsafeCount,
      averageHMPI: Number(averageHMPI.toFixed(2)),
      averageHPI: Number(averageHPI.toFixed(2)),
    },
  };
}

/**
 * Validate water sample data
 */
export function validateSample(sample: Partial<WaterSample>): string[] {
  const errors: string[] = [];
  
  if (!sample.latitude || isNaN(sample.latitude)) {
    errors.push('Valid latitude is required');
  }
  if (!sample.longitude || isNaN(sample.longitude)) {
    errors.push('Valid longitude is required');
  }
  if (sample.pb === undefined || isNaN(sample.pb) || sample.pb < 0) {
    errors.push('Valid lead (Pb) concentration is required');
  }
  if (sample.as === undefined || isNaN(sample.as) || sample.as < 0) {
    errors.push('Valid arsenic (As) concentration is required');
  }
  if (sample.cd === undefined || isNaN(sample.cd) || sample.cd < 0) {
    errors.push('Valid cadmium (Cd) concentration is required');
  }
  if (sample.cr === undefined || isNaN(sample.cr) || sample.cr < 0) {
    errors.push('Valid chromium (Cr) concentration is required');
  }
  if (sample.ni === undefined || isNaN(sample.ni) || sample.ni < 0) {
    errors.push('Valid nickel (Ni) concentration is required');
  }
  if (sample.pH === undefined || isNaN(sample.pH) || sample.pH < 0 || sample.pH > 14) {
    errors.push('Valid pH value (0-14) is required');
  }
  if (sample.conductivity === undefined || isNaN(sample.conductivity) || sample.conductivity < 0) {
    errors.push('Valid conductivity is required');
  }
  
  return errors;
}

/**
 * Generate sample data for testing
 */
export function generateSampleData(count: number = 50): WaterSample[] {
  const samples: WaterSample[] = [];
  const regions = [
    { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
    { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
    { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  ];
  
  for (let i = 0; i < count; i++) {
    const region = regions[Math.floor(Math.random() * regions.length)];
    const latVariation = (Math.random() - 0.5) * 0.5; // ±0.25 degrees
    const lngVariation = (Math.random() - 0.5) * 0.5;
    
    samples.push({
      id: `sample_${i + 1}`,
      latitude: region.lat + latVariation,
      longitude: region.lng + lngVariation,
      pb: Math.random() * 0.05, // 0-0.05 mg/L
      as: Math.random() * 0.02, // 0-0.02 mg/L
      cd: Math.random() * 0.01, // 0-0.01 mg/L
      cr: Math.random() * 0.1,  // 0-0.1 mg/L
      ni: Math.random() * 0.15, // 0-0.15 mg/L
      pH: 6.5 + Math.random() * 2, // 6.5-8.5
      conductivity: 200 + Math.random() * 800, // 200-1000 μS/cm
      sampleDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      location: `${region.name} Area ${Math.floor(Math.random() * 10) + 1}`,
      collectedBy: `Researcher ${Math.floor(Math.random() * 5) + 1}`,
      notes: Math.random() > 0.5 ? 'Regular monitoring sample' : '',
    });
  }
  
  return samples;
}