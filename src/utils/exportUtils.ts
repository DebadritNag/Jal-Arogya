import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import type { ProcessedData, WaterSample } from '../types';
import { validateSample } from './dataProcessing';

/**
 * Export data as Excel file
 */
export function exportToExcel(data: ProcessedData, filename: string = 'water_analysis_report'): void {
  const workbook = XLSX.utils.book_new();
  
  // Summary sheet
  const summaryData = [
    ['Water Quality Analysis Report'],
    ['Generated on:', new Date().toLocaleDateString()],
    [''],
    ['Summary Statistics'],
    ['Total Samples:', data.summary.totalSamples],
    ['Safe Samples:', data.summary.safeCount],
    ['Moderate Risk Samples:', data.summary.moderateCount],
    ['Unsafe Samples:', data.summary.unsafeCount],
    ['Average HMPI:', data.summary.averageHMPI],
    ['Average HPI:', data.summary.averageHPI],
  ];
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
  
  // Detailed results sheet
  const detailedData = data.results.map(result => {
    const sample = data.samples.find(s => s.id === result.sampleId);
    return {
      'Sample ID': result.sampleId,
      'Location': sample?.location || '',
      'Latitude': sample?.latitude,
      'Longitude': sample?.longitude,
      'Lead (mg/L)': sample?.pb,
      'Arsenic (mg/L)': sample?.as,
      'Cadmium (mg/L)': sample?.cd,
      'Chromium (mg/L)': sample?.cr,
      'Nickel (mg/L)': sample?.ni,
      'pH': sample?.pH,
      'Conductivity (μS/cm)': sample?.conductivity,
      'HMPI': result.hmpi,
      'HPI': result.hpi,
      'Classification': result.classification,
      'Risk Level': result.riskLevel,
      'Sample Date': sample?.sampleDate.toLocaleDateString(),
      'Collected By': sample?.collectedBy || '',
      'Notes': sample?.notes || '',
    };
  });
  
  const detailedSheet = XLSX.utils.json_to_sheet(detailedData);
  XLSX.utils.book_append_sheet(workbook, detailedSheet, 'Detailed Results');
  
  // Metal contributions sheet
  const contributionsData = data.results.map(result => ({
    'Sample ID': result.sampleId,
    'Lead Contribution (%)': result.metalContributions.pb,
    'Arsenic Contribution (%)': result.metalContributions.as,
    'Cadmium Contribution (%)': result.metalContributions.cd,
    'Chromium Contribution (%)': result.metalContributions.cr,
    'Nickel Contribution (%)': result.metalContributions.ni,
  }));
  
  const contributionsSheet = XLSX.utils.json_to_sheet(contributionsData);
  XLSX.utils.book_append_sheet(workbook, contributionsSheet, 'Metal Contributions');
  
  // Export file
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

/**
 * Export data as PDF report
 */
export function exportToPDF(data: ProcessedData, filename: string = 'water_analysis_report'): void {
  const doc = new jsPDF();
  let yPosition = 20;
  
  // Title
  doc.setFontSize(20);
  doc.text('JalArogya - Water Quality Analysis Report', 20, yPosition);
  yPosition += 20;
  
  // Date
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition);
  yPosition += 20;
  
  // Summary section
  doc.setFontSize(16);
  doc.text('Summary Statistics', 20, yPosition);
  yPosition += 15;
  
  doc.setFontSize(12);
  const summaryText = [
    `Total Samples: ${data.summary.totalSamples}`,
    `Safe Samples: ${data.summary.safeCount} (${((data.summary.safeCount / data.summary.totalSamples) * 100).toFixed(1)}%)`,
    `Moderate Risk Samples: ${data.summary.moderateCount} (${((data.summary.moderateCount / data.summary.totalSamples) * 100).toFixed(1)}%)`,
    `Unsafe Samples: ${data.summary.unsafeCount} (${((data.summary.unsafeCount / data.summary.totalSamples) * 100).toFixed(1)}%)`,
    `Average HMPI: ${data.summary.averageHMPI}`,
    `Average HPI: ${data.summary.averageHPI}`,
  ];
  
  summaryText.forEach(text => {
    doc.text(text, 20, yPosition);
    yPosition += 10;
  });
  
  yPosition += 10;
  
  // Classification breakdown
  doc.setFontSize(16);
  doc.text('Water Quality Classification', 20, yPosition);
  yPosition += 15;
  
  doc.setFontSize(12);
  doc.text('• Safe: HMPI ≤ 100 (Low pollution level)', 20, yPosition);
  yPosition += 8;
  doc.text('• Moderate: 100 < HMPI ≤ 200 (Moderate pollution level)', 20, yPosition);
  yPosition += 8;
  doc.text('• Unsafe: HMPI > 200 (High pollution level)', 20, yPosition);
  yPosition += 15;
  
  // Top 10 highest pollution samples
  doc.setFontSize(16);
  doc.text('Top 10 Highest Pollution Samples', 20, yPosition);
  yPosition += 15;
  
  const sortedResults = [...data.results].sort((a, b) => b.hmpi - a.hmpi).slice(0, 10);
  
  doc.setFontSize(10);
  doc.text('Sample ID', 20, yPosition);
  doc.text('Location', 60, yPosition);
  doc.text('HMPI', 120, yPosition);
  doc.text('Classification', 150, yPosition);
  yPosition += 8;
  
  sortedResults.forEach(result => {
    const sample = data.samples.find(s => s.id === result.sampleId);
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.text(result.sampleId, 20, yPosition);
    doc.text(sample?.location?.substring(0, 25) || 'N/A', 60, yPosition);
    doc.text(result.hmpi.toString(), 120, yPosition);
    doc.text(result.classification, 150, yPosition);
    yPosition += 8;
  });
  
  // Save PDF
  doc.save(`${filename}.pdf`);
}

/**
 * Export data as JSON file
 */
export function exportToJSON(data: ProcessedData, filename: string = 'water_analysis_data'): void {
  const exportData = {
    metadata: {
      exportDate: new Date().toISOString(),
      version: '1.0',
      description: 'JalArogya Water Quality Analysis Data',
      totalSamples: data.summary.totalSamples
    },
    summary: data.summary,
    samples: data.samples.map(sample => ({
      ...sample,
      sampleDate: sample.sampleDate.toISOString()
    })),
    results: data.results
  };
  
  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
  saveAs(blob, `${filename}.json`);
}

/**
 * Import data from JSON file
 */
export function importFromJSON(file: File): Promise<{ samples: WaterSample[]; errors: string[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const jsonData = JSON.parse(text);
        
        // Validate JSON structure
        if (!jsonData.samples || !Array.isArray(jsonData.samples)) {
          reject(new Error('Invalid JSON format: missing or invalid samples array'));
          return;
        }
        
        const samples: WaterSample[] = [];
        const errors: string[] = [];
        
        jsonData.samples.forEach((sampleData: Record<string, unknown>, index: number) => {
          try {
            // Convert date string back to Date object
            const sample: Partial<WaterSample> = {
              ...sampleData,
              sampleDate: new Date(String(sampleData.sampleDate)),
              pb: Number(sampleData.pb),
              as: Number(sampleData.as),
              cd: Number(sampleData.cd),
              cr: Number(sampleData.cr),
              ni: Number(sampleData.ni),
              pH: Number(sampleData.pH),
              conductivity: Number(sampleData.conductivity),
              latitude: Number(sampleData.latitude),
              longitude: Number(sampleData.longitude)
            };
            
            // Validate sample data
            const validationErrors = validateSample(sample);
            if (validationErrors.length > 0) {
              errors.push(`Row ${index + 1}: ${validationErrors.join(', ')}`);
            } else {
              samples.push(sample as WaterSample);
            }
          } catch (error) {
            errors.push(`Row ${index + 1}: Invalid data format - ${error}`);
          }
        });
        
        resolve({ samples, errors });
      } catch (error) {
        reject(new Error(`Failed to parse JSON file: ${error}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Import data from CSV file
 */
export function importFromCSV(file: File): Promise<{ samples: WaterSample[]; errors: string[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          reject(new Error('CSV file must contain at least a header row and one data row'));
          return;
        }
        
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const samples: WaterSample[] = [];
        const errors: string[] = [];
        
        // Validate required headers
        const requiredHeaders = ['id', 'latitude', 'longitude', 'pb', 'as', 'cd', 'cr', 'ni', 'ph', 'conductivity'];
        const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
        
        if (missingHeaders.length > 0) {
          reject(new Error(`Missing required CSV headers: ${missingHeaders.join(', ')}`));
          return;
        }
        
        // Process data rows
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          
          if (values.length !== headers.length) {
            errors.push(`Row ${i + 1}: Column count mismatch`);
            continue;
          }
          
          try {
            const sample: Partial<WaterSample> = {
              id: values[headers.indexOf('id')] || `sample_${i}`,
              latitude: Number(values[headers.indexOf('latitude')]),
              longitude: Number(values[headers.indexOf('longitude')]),
              pb: Number(values[headers.indexOf('pb')]),
              as: Number(values[headers.indexOf('as')]),
              cd: Number(values[headers.indexOf('cd')]),
              cr: Number(values[headers.indexOf('cr')]),
              ni: Number(values[headers.indexOf('ni')]),
              pH: Number(values[headers.indexOf('ph')]),
              conductivity: Number(values[headers.indexOf('conductivity')]),
              location: values[headers.indexOf('location')] || '',
              sampleDate: values[headers.indexOf('sampledate')] ? 
                new Date(values[headers.indexOf('sampledate')]) : new Date(),
              collectedBy: values[headers.indexOf('collectedby')] || '',
              notes: values[headers.indexOf('notes')] || ''
            };
            
            // Validate sample data
            const validationErrors = validateSample(sample);
            if (validationErrors.length > 0) {
              errors.push(`Row ${i + 1}: ${validationErrors.join(', ')}`);
            } else {
              samples.push(sample as WaterSample);
            }
          } catch (error) {
            errors.push(`Row ${i + 1}: Invalid data format - ${error}`);
          }
        }
        
        resolve({ samples, errors });
      } catch (error) {
        reject(new Error(`Failed to parse CSV file: ${error}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Export sample template as JSON
 */
export function exportSampleTemplateJSON(): void {
  const template = {
    metadata: {
      description: 'JalArogya Water Sample Template',
      version: '1.0',
      instructions: 'Fill in the samples array with your water quality data'
    },
    samples: [
      {
        id: 'sample_1',
        latitude: 28.6139,
        longitude: 77.2090,
        pb: 0.005,
        as: 0.002,
        cd: 0.001,
        cr: 0.02,
        ni: 0.03,
        pH: 7.2,
        conductivity: 450,
        location: 'Delhi Area 1',
        sampleDate: '2024-01-15T00:00:00.000Z',
        collectedBy: 'Researcher 1',
        notes: 'Regular monitoring'
      },
      {
        id: 'sample_2',
        latitude: 19.0760,
        longitude: 72.8777,
        pb: 0.008,
        as: 0.003,
        cd: 0.002,
        cr: 0.03,
        ni: 0.04,
        pH: 7.8,
        conductivity: 520,
        location: 'Mumbai Area 2',
        sampleDate: '2024-01-16T00:00:00.000Z',
        collectedBy: 'Researcher 2',
        notes: 'Industrial area'
      }
    ]
  };
  
  const jsonString = JSON.stringify(template, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
  saveAs(blob, 'water_sample_template.json');
}

/**
 * Export sample template as CSV
 */
export function exportSampleTemplateCSV(): void {
  const template = [
    ['id', 'latitude', 'longitude', 'pb', 'as', 'cd', 'cr', 'ni', 'pH', 'conductivity', 'location', 'sampleDate', 'collectedBy', 'notes'],
    ['sample_1', '28.6139', '77.2090', '0.005', '0.002', '0.001', '0.02', '0.03', '7.2', '450', 'Delhi Area 1', '2024-01-15', 'Researcher 1', 'Regular monitoring'],
    ['sample_2', '19.0760', '72.8777', '0.008', '0.003', '0.002', '0.03', '0.04', '7.8', '520', 'Mumbai Area 2', '2024-01-16', 'Researcher 2', 'Industrial area'],
  ];
  
  const csvContent = template.map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, 'water_sample_template.csv');
}

/**
 * Generate summary statistics text
 */
export function generateSummaryText(data: ProcessedData): string {
  const { summary } = data;
  const safePercentage = ((summary.safeCount / summary.totalSamples) * 100).toFixed(1);
  const moderatePercentage = ((summary.moderateCount / summary.totalSamples) * 100).toFixed(1);
  const unsafePercentage = ((summary.unsafeCount / summary.totalSamples) * 100).toFixed(1);
  
  return `Water Quality Analysis Summary:
  
Total Samples Analyzed: ${summary.totalSamples}

Quality Distribution:
• Safe Water: ${summary.safeCount} samples (${safePercentage}%)
• Moderate Risk: ${summary.moderateCount} samples (${moderatePercentage}%)
• Unsafe Water: ${summary.unsafeCount} samples (${unsafePercentage}%)

Average Pollution Indices:
• Heavy Metal Pollution Index (HMPI): ${summary.averageHMPI}
• Heavy Metal Pollution Index (HPI): ${summary.averageHPI}

Recommendations:
${summary.unsafeCount > 0 ? `• Immediate attention required for ${summary.unsafeCount} unsafe samples` : ''}
${summary.moderateCount > 0 ? `• Monitoring recommended for ${summary.moderateCount} moderate risk samples` : ''}
${summary.safeCount === summary.totalSamples ? '• All samples meet safety standards' : ''}`;
}