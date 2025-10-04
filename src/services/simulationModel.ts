// Bion-M1 Mouse Simulation Model
// Based on "Mice in Bion-M 1 space mission: training and selection" study

export interface SimulationInputs {
  // Mission parameters
  missionDays: number; // 0-60, default 30
  
  // Genetic strain
  geneticStrain: 'C57BL/6' | 'BALB/c' | '129S1' | 'Other';
  
  // Pre-flight training
  alteredGravityExposure: 'none' | 'weekly' | 'daily';
  confinementToleranceScore: number; // 0-10
  socialIsolationDays: number; // 0-21
  
  // Health & stress
  baselineHealthScore: number; // 0-100
  stressReactivity: 'low' | 'medium' | 'high';
  
  // In-flight parameters
  activityLevel: number; // 0-1
  exerciseCountermeasure: 'none' | 'low' | 'high';
  dietVsBaseline: number; // 0.6-1.2
}

export interface SimulationOutputs {
  boneMineralDensityDelta: number; // Δ%
  muscleMassDelta: number; // Δ% (CSA)
  immuneFunctionIndexDelta: number; // Δ% (composite)
  restingHRDelta: number; // Δ bpm
  mapDelta: number; // Δ mmHg
}

export interface SimulationConfig {
  coefficients: {
    // Bone density factors
    boneGravityFactor: number;
    boneActivityFactor: number;
    boneExerciseFactor: number;
    boneDietFactor: number;
    boneStrainFactor: number;
    
    // Muscle mass factors
    muscleGravityFactor: number;
    muscleActivityFactor: number;
    muscleExerciseFactor: number;
    muscleDietFactor: number;
    muscleStrainFactor: number;
    
    // Immune function factors
    immuneStressFactor: number;
    immuneIsolationFactor: number;
    immuneHealthFactor: number;
    immuneDietFactor: number;
    immuneStrainFactor: number;
    
    // Cardiovascular factors
    hrStressFactor: number;
    hrActivityFactor: number;
    hrHealthFactor: number;
    hrStrainFactor: number;
    
    mapStressFactor: number;
    mapActivityFactor: number;
    mapHealthFactor: number;
    mapStrainFactor: number;
  };
  
  strainModifiers: {
    'C57BL/6': {
      boneResistance: number;
      muscleResistance: number;
      immuneResistance: number;
      cardiovascularResistance: number;
    };
    'BALB/c': {
      boneResistance: number;
      muscleResistance: number;
      immuneResistance: number;
      cardiovascularResistance: number;
    };
    '129S1': {
      boneResistance: number;
      muscleResistance: number;
      immuneResistance: number;
      cardiovascularResistance: number;
    };
    'Other': {
      boneResistance: number;
      muscleResistance: number;
      immuneResistance: number;
      cardiovascularResistance: number;
    };
  };
}

export const defaultConfig: SimulationConfig = {
  coefficients: {
    // Bone density factors (based on microgravity bone loss studies)
    boneGravityFactor: -0.8, // Primary microgravity effect
    boneActivityFactor: 0.3, // Activity helps maintain bone
    boneExerciseFactor: 0.4, // Exercise countermeasures
    boneDietFactor: 0.2, // Nutrition impact
    boneStrainFactor: 0.1, // Genetic resistance
    
    // Muscle mass factors
    muscleGravityFactor: -0.6, // Microgravity muscle loss
    muscleActivityFactor: 0.5, // Activity maintains muscle
    muscleExerciseFactor: 0.6, // Exercise countermeasures
    muscleDietFactor: 0.3, // Protein/nutrition
    muscleStrainFactor: 0.15, // Genetic factors
    
    // Immune function factors
    immuneStressFactor: -0.4, // Stress suppresses immunity
    immuneIsolationFactor: -0.3, // Social isolation impact
    immuneHealthFactor: 0.4, // Baseline health
    immuneDietFactor: 0.2, // Nutrition
    immuneStrainFactor: 0.1, // Genetic resistance
    
    // Cardiovascular factors
    hrStressFactor: 0.3, // Stress increases HR
    hrActivityFactor: -0.2, // Activity can lower resting HR
    hrHealthFactor: -0.3, // Health reduces HR
    hrStrainFactor: 0.05, // Genetic factors
    
    mapStressFactor: 0.4, // Stress increases MAP
    mapActivityFactor: -0.1, // Activity effects
    mapHealthFactor: -0.2, // Health reduces MAP
    mapStrainFactor: 0.1, // Genetic factors
  },
  
  strainModifiers: {
    'C57BL/6': {
      boneResistance: 0.8, // Good bone density
      muscleResistance: 0.7, // Moderate muscle
      immuneResistance: 0.6, // Moderate immune
      cardiovascularResistance: 0.7, // Good CV
    },
    'BALB/c': {
      boneResistance: 0.6, // Lower bone density
      muscleResistance: 0.5, // Lower muscle
      immuneResistance: 0.8, // Good immune
      cardiovascularResistance: 0.5, // Lower CV
    },
    '129S1': {
      boneResistance: 0.9, // High bone density
      muscleResistance: 0.8, // High muscle
      immuneResistance: 0.5, // Lower immune
      cardiovascularResistance: 0.8, // Good CV
    },
    'Other': {
      boneResistance: 0.7, // Average
      muscleResistance: 0.7, // Average
      immuneResistance: 0.7, // Average
      cardiovascularResistance: 0.7, // Average
    },
  },
};

export class BionM1Simulator {
  private config: SimulationConfig;
  
  constructor(config: SimulationConfig = defaultConfig) {
    this.config = config;
  }
  
  simulate(inputs: SimulationInputs): SimulationOutputs {
    const strain = inputs.geneticStrain;
    const strainMod = this.config.strainModifiers[strain];
    const coeffs = this.config.coefficients;
    
    // Calculate mission intensity factor (0-1)
    const missionIntensity = Math.min(inputs.missionDays / 60, 1);
    
    // Calculate training effectiveness
    const trainingEffectiveness = this.calculateTrainingEffectiveness(inputs);
    
    // Calculate stress level
    const stressLevel = this.calculateStressLevel(inputs);
    
    // Bone Mineral Density Δ%
    const boneDensityDelta = this.calculateBoneDensity(
      inputs, 
      missionIntensity, 
      trainingEffectiveness, 
      strainMod
    );
    
    // Muscle Mass Δ%
    const muscleMassDelta = this.calculateMuscleMass(
      inputs, 
      missionIntensity, 
      trainingEffectiveness, 
      strainMod
    );
    
    // Immune Function Index Δ%
    const immuneFunctionDelta = this.calculateImmuneFunction(
      inputs, 
      missionIntensity, 
      stressLevel, 
      strainMod
    );
    
    // Resting HR Δ
    const restingHRDelta = this.calculateRestingHR(
      inputs, 
      missionIntensity, 
      stressLevel, 
      strainMod
    );
    
    // MAP Δ
    const mapDelta = this.calculateMAP(
      inputs, 
      missionIntensity, 
      stressLevel, 
      strainMod
    );
    
    return {
      boneMineralDensityDelta: Math.round(boneDensityDelta * 100) / 100,
      muscleMassDelta: Math.round(muscleMassDelta * 100) / 100,
      immuneFunctionIndexDelta: Math.round(immuneFunctionDelta * 100) / 100,
      restingHRDelta: Math.round(restingHRDelta * 10) / 10,
      mapDelta: Math.round(mapDelta * 10) / 10,
    };
  }
  
  private calculateTrainingEffectiveness(inputs: SimulationInputs): number {
    let effectiveness = 0.5; // Base effectiveness
    
    // Altered gravity exposure
    switch (inputs.alteredGravityExposure) {
      case 'none': effectiveness += 0; break;
      case 'weekly': effectiveness += 0.2; break;
      case 'daily': effectiveness += 0.4; break;
    }
    
    // Confinement tolerance
    effectiveness += (inputs.confinementToleranceScore / 10) * 0.3;
    
    // Social isolation (negative impact)
    effectiveness -= (inputs.socialIsolationDays / 21) * 0.2;
    
    return Math.max(0, Math.min(1, effectiveness));
  }
  
  private calculateStressLevel(inputs: SimulationInputs): number {
    let stress = 0.3; // Base stress level
    
    // Health score (inverse relationship)
    stress += (100 - inputs.baselineHealthScore) / 100 * 0.4;
    
    // Stress reactivity
    switch (inputs.stressReactivity) {
      case 'low': stress += 0.1; break;
      case 'medium': stress += 0.3; break;
      case 'high': stress += 0.5; break;
    }
    
    // Social isolation
    stress += (inputs.socialIsolationDays / 21) * 0.2;
    
    return Math.max(0, Math.min(1, stress));
  }
  
  private calculateBoneDensity(
    inputs: SimulationInputs, 
    missionIntensity: number, 
    trainingEffectiveness: number, 
    strainMod: any
  ): number {
    const coeffs = this.config.coefficients;
    
    let delta = 0;
    
    // Microgravity effect (primary)
    delta += coeffs.boneGravityFactor * missionIntensity;
    
    // Training effectiveness
    delta += coeffs.boneActivityFactor * trainingEffectiveness;
    
    // Exercise countermeasures
    const exerciseFactor = inputs.exerciseCountermeasure === 'none' ? 0 : 
                         inputs.exerciseCountermeasure === 'low' ? 0.3 : 0.6;
    delta += coeffs.boneExerciseFactor * exerciseFactor;
    
    // Diet
    delta += coeffs.boneDietFactor * (inputs.dietVsBaseline - 1);
    
    // Strain resistance
    delta *= strainMod.boneResistance;
    
    return delta * 100; // Convert to percentage
  }
  
  private calculateMuscleMass(
    inputs: SimulationInputs, 
    missionIntensity: number, 
    trainingEffectiveness: number, 
    strainMod: any
  ): number {
    const coeffs = this.config.coefficients;
    
    let delta = 0;
    
    // Microgravity effect
    delta += coeffs.muscleGravityFactor * missionIntensity;
    
    // Training effectiveness
    delta += coeffs.muscleActivityFactor * trainingEffectiveness;
    
    // Exercise countermeasures
    const exerciseFactor = inputs.exerciseCountermeasure === 'none' ? 0 : 
                         inputs.exerciseCountermeasure === 'low' ? 0.3 : 0.6;
    delta += coeffs.muscleExerciseFactor * exerciseFactor;
    
    // Diet
    delta += coeffs.muscleDietFactor * (inputs.dietVsBaseline - 1);
    
    // Strain resistance
    delta *= strainMod.muscleResistance;
    
    return delta * 100; // Convert to percentage
  }
  
  private calculateImmuneFunction(
    inputs: SimulationInputs, 
    missionIntensity: number, 
    stressLevel: number, 
    strainMod: any
  ): number {
    const coeffs = this.config.coefficients;
    
    let delta = 0;
    
    // Stress impact
    delta += coeffs.immuneStressFactor * stressLevel;
    
    // Social isolation
    delta += coeffs.immuneIsolationFactor * (inputs.socialIsolationDays / 21);
    
    // Baseline health
    delta += coeffs.immuneHealthFactor * (inputs.baselineHealthScore / 100);
    
    // Diet
    delta += coeffs.immuneDietFactor * (inputs.dietVsBaseline - 1);
    
    // Strain resistance
    delta *= strainMod.immuneResistance;
    
    return delta * 100; // Convert to percentage
  }
  
  private calculateRestingHR(
    inputs: SimulationInputs, 
    missionIntensity: number, 
    stressLevel: number, 
    strainMod: any
  ): number {
    const coeffs = this.config.coefficients;
    
    let delta = 0;
    
    // Stress impact
    delta += coeffs.hrStressFactor * stressLevel * 20; // Scale to bpm
    
    // Activity level
    delta += coeffs.hrActivityFactor * inputs.activityLevel * 10;
    
    // Health impact
    delta += coeffs.hrHealthFactor * (inputs.baselineHealthScore / 100) * 15;
    
    // Strain factors
    delta *= strainMod.cardiovascularResistance;
    
    return delta;
  }
  
  private calculateMAP(
    inputs: SimulationInputs, 
    missionIntensity: number, 
    stressLevel: number, 
    strainMod: any
  ): number {
    const coeffs = this.config.coefficients;
    
    let delta = 0;
    
    // Stress impact
    delta += coeffs.mapStressFactor * stressLevel * 15; // Scale to mmHg
    
    // Activity level
    delta += coeffs.mapActivityFactor * inputs.activityLevel * 5;
    
    // Health impact
    delta += coeffs.mapHealthFactor * (inputs.baselineHealthScore / 100) * 10;
    
    // Strain factors
    delta *= strainMod.cardiovascularResistance;
    
    return delta;
  }
  
  // Method to update configuration
  updateConfig(newConfig: Partial<SimulationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
  
  // Method to get current configuration
  getConfig(): SimulationConfig {
    return this.config;
  }
}

// Export default simulator instance
export const defaultSimulator = new BionM1Simulator();
