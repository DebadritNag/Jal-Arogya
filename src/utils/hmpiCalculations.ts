import type { WaterSample, HMPIResult } from '../types';

// WHO standards for heavy metals in drinking water (mg/L)
export const WHO_STANDARDS = {
  pb: 0.01,   // Lead
  as: 0.01,   // Arsenic
  cd: 0.003,  // Cadmium
  cr: 0.05,   // Chromium
  ni: 0.07,   // Nickel
} as const;

// Weight factors for Heavy Metal Pollution Index calculation
export const WEIGHT_FACTORS = {
  pb: 4,  // Highest weight due to toxicity
  as: 4,  // Highest weight due to carcinogenic properties
  cd: 3,  // High weight
  cr: 2,  // Medium weight
  ni: 2,  // Medium weight
} as const;

/**
 * Calculate the Heavy Metal Pollution Index (HMPI) for a water sample
 * HMPI = Σ(Wi × Ci / Si) / Σ(Wi)
 * Where:
 * Wi = Weight factor for metal i
 * Ci = Concentration of metal i
 * Si = Standard value for metal i
 */
export function calculateHMPI(sample: WaterSample): number {
  const { pb, as, cd, cr, ni } = sample;
  
  const weightedSum = 
    (WEIGHT_FACTORS.pb * (pb / WHO_STANDARDS.pb)) +
    (WEIGHT_FACTORS.as * (as / WHO_STANDARDS.as)) +
    (WEIGHT_FACTORS.cd * (cd / WHO_STANDARDS.cd)) +
    (WEIGHT_FACTORS.cr * (cr / WHO_STANDARDS.cr)) +
    (WEIGHT_FACTORS.ni * (ni / WHO_STANDARDS.ni));
  
  const totalWeight = Object.values(WEIGHT_FACTORS).reduce((sum, weight) => sum + weight, 0);
  
  return Number((weightedSum / totalWeight).toFixed(2));
}

/**
 * Calculate the Heavy Metal Pollution Index (HPI) - Alternative method
 * HPI = Σ(Wi × Qi) / Σ(Wi)
 * Where Qi = 100 × (Ci - I) / (Si - I) for Ci ≠ Si
 * I = Ideal value (assumed 0 for heavy metals)
 */
export function calculateHPI(sample: WaterSample): number {
  const { pb, as, cd, cr, ni } = sample;
  
  const calculateQi = (concentration: number, standard: number): number => {
    if (concentration === standard) return 100;
    return (100 * concentration) / standard;
  };
  
  const weightedSum = 
    (WEIGHT_FACTORS.pb * calculateQi(pb, WHO_STANDARDS.pb)) +
    (WEIGHT_FACTORS.as * calculateQi(as, WHO_STANDARDS.as)) +
    (WEIGHT_FACTORS.cd * calculateQi(cd, WHO_STANDARDS.cd)) +
    (WEIGHT_FACTORS.cr * calculateQi(cr, WHO_STANDARDS.cr)) +
    (WEIGHT_FACTORS.ni * calculateQi(ni, WHO_STANDARDS.ni));
  
  const totalWeight = Object.values(WEIGHT_FACTORS).reduce((sum, weight) => sum + weight, 0);
  
  return Number((weightedSum / totalWeight).toFixed(2));
}

/**
 * Classify water safety based on HMPI value and individual metal index scores
 * According to WHO standards: if any metal index > 100, water is unsafe
 */
export function classifyWaterSafety(hmpi: number, metalIndexScores?: {
  pb: { value: number; status: 'Safe' | 'Unsafe'; concentration: number };
  as: { value: number; status: 'Safe' | 'Unsafe'; concentration: number };
  cd: { value: number; status: 'Safe' | 'Unsafe'; concentration: number };
  cr: { value: number; status: 'Safe' | 'Unsafe'; concentration: number };
  ni: { value: number; status: 'Safe' | 'Unsafe'; concentration: number };
}): 'Safe' | 'Moderate' | 'Unsafe' {
  // If metal index scores are provided, check if any metal exceeds WHO standards
  if (metalIndexScores) {
    const hasUnsafeMetal = Object.values(metalIndexScores).some(metal => metal.value > 100);
    if (hasUnsafeMetal) {
      return 'Unsafe';
    }
    // If all metals are safe (≤ 100), water is safe regardless of HMPI
    return 'Safe';
  }
  
  // Fallback to HMPI-based classification if metal index scores not available
  if (hmpi <= 100) return 'Safe';
  if (hmpi <= 200) return 'Moderate';
  return 'Unsafe';
}

/**
 * Determine risk level based on HPI value
 */
export function determineRiskLevel(hpi: number): 'Low' | 'Medium' | 'High' | 'Critical' {
  if (hpi <= 25) return 'Low';
  if (hpi <= 50) return 'Medium';
  if (hpi <= 100) return 'High';
  return 'Critical';
}

/**
 * Calculate individual metal contributions to pollution
 */
export function calculateMetalContributions(sample: WaterSample): {
  pb: number;
  as: number;
  cd: number;
  cr: number;
  ni: number;
} {
  const { pb, as, cd, cr, ni } = sample;
  
  return {
    pb: Number(((pb / WHO_STANDARDS.pb) * 100).toFixed(2)),
    as: Number(((as / WHO_STANDARDS.as) * 100).toFixed(2)),
    cd: Number(((cd / WHO_STANDARDS.cd) * 100).toFixed(2)),
    cr: Number(((cr / WHO_STANDARDS.cr) * 100).toFixed(2)),
    ni: Number(((ni / WHO_STANDARDS.ni) * 100).toFixed(2)),
  };
}

/**
 * Calculate individual metal index scores based on WHO standards
 * Metal Index = (Concentration / WHO Standard) × 100
 * Values > 100 indicate exceeding WHO standards
 */
export function calculateMetalIndexScores(sample: WaterSample): {
  pb: { value: number; status: 'Safe' | 'Unsafe'; concentration: number };
  as: { value: number; status: 'Safe' | 'Unsafe'; concentration: number };
  cd: { value: number; status: 'Safe' | 'Unsafe'; concentration: number };
  cr: { value: number; status: 'Safe' | 'Unsafe'; concentration: number };
  ni: { value: number; status: 'Safe' | 'Unsafe'; concentration: number };
} {
  const { pb, as, cd, cr, ni } = sample;
  
  const calculateIndex = (concentration: number, standard: number) => {
    const value = Number(((concentration / standard) * 100).toFixed(1));
    return {
      value,
      status: (value <= 100 ? 'Safe' : 'Unsafe') as 'Safe' | 'Unsafe',
      concentration: Number(concentration.toFixed(4))
    };
  };
  
  return {
    pb: calculateIndex(pb, WHO_STANDARDS.pb),
    as: calculateIndex(as, WHO_STANDARDS.as),
    cd: calculateIndex(cd, WHO_STANDARDS.cd),
    cr: calculateIndex(cr, WHO_STANDARDS.cr),
    ni: calculateIndex(ni, WHO_STANDARDS.ni),
  };
}

/**
 * Process a single water sample and return HMPI result
 */
export function processSample(sample: WaterSample): HMPIResult {
  const hmpi = calculateHMPI(sample);
  const hpi = calculateHPI(sample);
  const metalContributions = calculateMetalContributions(sample);
  const metalIndexScores = calculateMetalIndexScores(sample);
  
  // Use metal index scores for accurate safety classification
  const classification = classifyWaterSafety(hmpi, metalIndexScores);
  const riskLevel = determineRiskLevel(hpi);
  
  // Determine usability for different purposes
  const usability = determineWaterUsability({ hmpi, hpi, metalIndexScores });
  
  return {
    sampleId: sample.id,
    hmpi,
    hpi,
    classification,
    riskLevel,
    metalContributions,
    metalIndexScores,
    usability,
  };
}

/**
 * Get color for classification
 */
export function getClassificationColor(classification: 'Safe' | 'Moderate' | 'Unsafe'): string {
  switch (classification) {
    case 'Safe': return '#10B981'; // Green
    case 'Moderate': return '#F59E0B'; // Yellow
    case 'Unsafe': return '#EF4444'; // Red
    default: return '#6B7280'; // Gray
  }
}

/**
 * Determine water usability for different purposes based on HMPI, HPI, and metal index scores
 */
export function determineWaterUsability(sample: {
  hmpi: number;
  hpi: number;
  metalIndexScores: {
    pb: { value: number; status: 'Safe' | 'Unsafe'; concentration: number };
    as: { value: number; status: 'Safe' | 'Unsafe'; concentration: number };
    cd: { value: number; status: 'Safe' | 'Unsafe'; concentration: number };
    cr: { value: number; status: 'Safe' | 'Unsafe'; concentration: number };
    ni: { value: number; status: 'Safe' | 'Unsafe'; concentration: number };
  };
}): {
  drinking: { status: 'Safe' | 'Caution' | 'Unsafe'; reason: string };
  agriculture: { status: 'Safe' | 'Caution' | 'Unsafe'; reason: string };
  industrial: { status: 'Safe' | 'Caution' | 'Unsafe'; reason: string };
} {
  const { hmpi, hpi, metalIndexScores } = sample;
  
  // Check critical metals for drinking water (Pb, As, Cd have lower tolerance)
  const criticalMetalsUnsafe = metalIndexScores.pb.value > 100 || 
                               metalIndexScores.as.value > 100 || 
                               metalIndexScores.cd.value > 100;
  
  // Check all metals for basic safety
  const anyMetalUnsafe = Object.values(metalIndexScores).some(metal => metal.value > 100);
  
  // Drinking water assessment (strictest standards)
  let drinking: { status: 'Safe' | 'Caution' | 'Unsafe'; reason: string };
  if (criticalMetalsUnsafe) {
    drinking = { 
      status: 'Unsafe', 
      reason: 'Critical metals (Pb/As/Cd) exceed WHO drinking water standards' 
    };
  } else if (anyMetalUnsafe || hmpi > 100) {
    drinking = { 
      status: 'Unsafe', 
      reason: 'Metal contamination exceeds WHO drinking water standards' 
    };
  } else if (hmpi > 75 || hpi > 75) {
    drinking = { 
      status: 'Caution', 
      reason: 'Approaching WHO limits - regular monitoring recommended' 
    };
  } else {
    drinking = { 
      status: 'Safe', 
      reason: 'Meets WHO drinking water standards' 
    };
  }
  
  // Agricultural water assessment (more tolerant than drinking)
  let agriculture: { status: 'Safe' | 'Caution' | 'Unsafe'; reason: string };
  if (criticalMetalsUnsafe && (metalIndexScores.pb.value > 200 || metalIndexScores.as.value > 150 || metalIndexScores.cd.value > 200)) {
    agriculture = { 
      status: 'Unsafe', 
      reason: 'High toxic metal levels harmful to crops and soil' 
    };
  } else if (hmpi > 300 || hpi > 200) {
    agriculture = { 
      status: 'Unsafe', 
      reason: 'Contamination levels may damage crops and accumulate in soil' 
    };
  } else if (anyMetalUnsafe || hmpi > 150 || hpi > 100) {
    agriculture = { 
      status: 'Caution', 
      reason: 'Monitor crop uptake - may affect sensitive plants' 
    };
  } else {
    agriculture = { 
      status: 'Safe', 
      reason: 'Suitable for irrigation and crop production' 
    };
  }
  
  // Industrial water assessment (most tolerant)
  let industrial: { status: 'Safe' | 'Caution' | 'Unsafe'; reason: string };
  if (hmpi > 500 || hpi > 400) {
    industrial = { 
      status: 'Unsafe', 
      reason: 'May cause corrosion and equipment damage' 
    };
  } else if (hmpi > 300 || hpi > 200 || anyMetalUnsafe) {
    industrial = { 
      status: 'Caution', 
      reason: 'May require treatment for sensitive processes' 
    };
  } else {
    industrial = { 
      status: 'Safe', 
      reason: 'Suitable for most industrial applications' 
    };
  }
  
  return { drinking, agriculture, industrial };
}