import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar
} from "recharts";

// Enhanced UI Components from your new files
const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl bg-slate-900/60 border border-cyan-400/20 shadow-lg shadow-cyan-500/10 ${className}`}>{children}</div>
);

const SectionTitle = ({ children }) => (
  <div className="text-sm tracking-wider text-cyan-300/90 uppercase font-semibold pt-3 pb-2 px-4">{children}</div>
);

// Neon grid backdrop
const GridBg = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.15),transparent_60%)]" />
    <svg className="absolute inset-0 h-full w-full opacity-20" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" className="text-cyan-500" />
    </svg>
  </div>
);

// Mouse figure for the simulation
const MouseFigure = () => (
  <div className="w-full max-w-[240px] mx-auto">
    <img 
      src="/images/Gemini_Generated_Image_mf146zmf146zmf14-removebg-preview.png" 
      alt="Mouse Model" 
      className="w-full h-auto object-contain drop-shadow-[0_0_20px_rgba(34,211,238,0.7)]"
    />
  </div>
);

const Simulator: React.FC = () => {
  const [missionDays, setMissionDays] = useState(30);
  const [geneticStrain, setGeneticStrain] = useState('C57BL/6');
  const [activityLevel, setActivityLevel] = useState(0.6);
  const [exerciseCountermeasure, setExerciseCountermeasure] = useState('low');
  const [baselineHealth, setBaselineHealth] = useState(85);
  const [stressReactivity, setStressReactivity] = useState('medium');
  const [dietVsBaseline, setDietVsBaseline] = useState(1.0);
  const [showLongitudinal, setShowLongitudinal] = useState(false);
  const [compareStrains, setCompareStrains] = useState(false);
  
  // Advanced Bion-M1 simulation calculations
  const calculateSimulation = () => {
    // Mission intensity factor (0-1)
    const missionIntensity = Math.min(missionDays / 60, 1);
    
    // Genetic strain modifiers
    const strainModifiers = {
      'C57BL/6': { bone: 0.8, muscle: 0.7, immune: 0.6, cv: 0.7 },
      'BALB/c': { bone: 0.6, muscle: 0.5, immune: 0.8, cv: 0.5 },
      '129S1': { bone: 0.9, muscle: 0.8, immune: 0.5, cv: 0.8 },
      'Other': { bone: 0.7, muscle: 0.7, immune: 0.7, cv: 0.7 }
    };
    
    const strain = strainModifiers[geneticStrain as keyof typeof strainModifiers];
    
    // Exercise countermeasure factor
    const exerciseFactor = exerciseCountermeasure === 'none' ? 0 : 
                          exerciseCountermeasure === 'low' ? 0.3 : 0.6;
    
    // Stress level calculation
    const stressLevel = (100 - baselineHealth) / 100 * 0.4 + 
                       (stressReactivity === 'low' ? 0.1 : stressReactivity === 'medium' ? 0.3 : 0.5);
    
    // Bone density calculation (based on microgravity bone loss studies)
    const boneDensity = (-0.8 * missionIntensity + 0.3 * activityLevel + 0.4 * exerciseFactor + 0.2 * (dietVsBaseline - 1)) * strain.bone * 100;
    
    // Muscle mass calculation
    const muscleMass = (-0.6 * missionIntensity + 0.5 * activityLevel + 0.6 * exerciseFactor + 0.3 * (dietVsBaseline - 1)) * strain.muscle * 100;
    
    // Immune function calculation
    const immuneFunction = (-0.4 * stressLevel + 0.4 * (baselineHealth / 100) + 0.2 * (dietVsBaseline - 1)) * strain.immune * 100;
    
    // Cardiovascular changes
    const heartRateChange = (0.3 * stressLevel * 20 - 0.2 * activityLevel * 10 - 0.3 * (baselineHealth / 100) * 15) * strain.cv;
    const bloodPressureChange = (0.4 * stressLevel * 15 - 0.1 * activityLevel * 5 - 0.2 * (baselineHealth / 100) * 10) * strain.cv;
    
    return {
      boneDensity: Math.round(boneDensity * 10) / 10,
      muscleMass: Math.round(muscleMass * 10) / 10,
      immuneFunction: Math.round(immuneFunction * 10) / 10,
      heartRateChange: Math.round(heartRateChange * 10) / 10,
      bloodPressureChange: Math.round(bloodPressureChange * 10) / 10
    };
  };
  
  const results = calculateSimulation();


  // Generate chart data for longitudinal view
  const generateLongitudinalData = () => {
    const data = [];
    for (let week = 0; week <= Math.ceil(missionDays / 7); week++) {
      const weekIntensity = Math.min(week / (missionDays / 7), 1);
      const strainModifiers = {
        'C57BL/6': { bone: 0.8, muscle: 0.7, immune: 0.6, cv: 0.7 },
        'BALB/c': { bone: 0.6, muscle: 0.5, immune: 0.8, cv: 0.5 },
        '129S1': { bone: 0.9, muscle: 0.8, immune: 0.5, cv: 0.8 },
        'Other': { bone: 0.7, muscle: 0.7, immune: 0.7, cv: 0.7 }
      };
      const strain = strainModifiers[geneticStrain as keyof typeof strainModifiers];
      
      const exerciseFactor = exerciseCountermeasure === 'none' ? 0 : 
                            exerciseCountermeasure === 'low' ? 0.3 : 0.6;
      const stressLevel = (100 - baselineHealth) / 100 * 0.4 + 
                         (stressReactivity === 'low' ? 0.1 : stressReactivity === 'medium' ? 0.3 : 0.5);
      
      const boneDensity = (-0.8 * weekIntensity + 0.3 * activityLevel + 0.4 * exerciseFactor + 0.2 * (dietVsBaseline - 1)) * strain.bone * 100;
      const muscleMass = (-0.6 * weekIntensity + 0.5 * activityLevel + 0.6 * exerciseFactor + 0.3 * (dietVsBaseline - 1)) * strain.muscle * 100;
      const immuneFunction = (-0.4 * stressLevel + 0.4 * (baselineHealth / 100) + 0.2 * (dietVsBaseline - 1)) * strain.immune * 100;
      
      data.push({
        week: `Week ${week}`,
        boneDensity: Math.round(boneDensity * 10) / 10,
        muscleMass: Math.round(muscleMass * 10) / 10,
        immuneFunction: Math.round(immuneFunction * 10) / 10
      });
    }
    return data;
  };

  const longitudinalData = generateLongitudinalData();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative">
      <GridBg />
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between rounded-2xl border border-cyan-400/20 bg-slate-900/60 px-5 py-4 shadow-lg shadow-cyan-500/10 mb-6"
        >
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-wide text-cyan-300">Bion-M1 Mouse Simulator</h1>
            <p className="text-xs text-slate-400">Space Biology Research · Live telemetry · Synthetic data for demo</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowLongitudinal(!showLongitudinal)}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
                showLongitudinal ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              📈 Longitudinal
            </button>
            <button
              onClick={() => setCompareStrains(!compareStrains)}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
                compareStrains ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              🧬 Strains
            </button>
          </div>
        </motion.div>
        <div className="grid grid-cols-12 gap-4">
          {/* Left column - Controls */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <Card>
              <SectionTitle>Mission Parameters</SectionTitle>
              <div className="px-4 pb-4 space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-2">
                    Mission Days: {missionDays}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={missionDays}
                    onChange={(e) => setMissionDays(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-slate-400 mb-2">Genetic Strain</label>
                  <select
                    value={geneticStrain}
                    onChange={(e) => setGeneticStrain(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-cyan-400/20 rounded text-slate-100 text-sm"
                  >
                    <option value="C57BL/6">C57BL/6 (Good bone density)</option>
                    <option value="BALB/c">BALB/c (Good immune system)</option>
                    <option value="129S1">129S1 (High muscle mass)</option>
                    <option value="Other">Other (Average)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs text-slate-400 mb-2">
                    Activity Level: {Math.round(activityLevel * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-slate-400 mb-2">Exercise Countermeasure</label>
                  <select
                    value={exerciseCountermeasure}
                    onChange={(e) => setExerciseCountermeasure(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-cyan-400/20 rounded text-slate-100 text-sm"
                  >
                    <option value="none">None</option>
                    <option value="low">Low</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs text-slate-400 mb-2">
                    Baseline Health: {baselineHealth}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={baselineHealth}
                    onChange={(e) => setBaselineHealth(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-slate-400 mb-2">Stress Reactivity</label>
                  <select
                    value={stressReactivity}
                    onChange={(e) => setStressReactivity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-cyan-400/20 rounded text-slate-100 text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs text-slate-400 mb-2">
                    Diet vs Baseline: {dietVsBaseline}x
                  </label>
                  <input
                    type="range"
                    min="0.6"
                    max="1.2"
                    step="0.1"
                    value={dietVsBaseline}
                    onChange={(e) => setDietVsBaseline(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Center column - Mouse Model */}
          <div className="col-span-12 lg:col-span-4">
            <Card className="relative flex items-center justify-center h-full min-h-[540px]">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs text-cyan-300/80">Mouse Model · Bion-M1</div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-3 rounded-full bg-cyan-300/10 blur-sm" />
              <MouseFigure />
            </Card>
          </div>

          {/* Right column - Results */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <Card>
              <SectionTitle>Physiological Changes</SectionTitle>
              <div className="px-4 pb-4 space-y-3">
                <div className={`p-3 rounded-lg border ${results.boneDensity < 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
                  <div className="text-lg font-bold text-slate-100">
                    {results.boneDensity > 0 ? '+' : ''}{results.boneDensity}%
                  </div>
                  <div className="text-xs text-slate-400">Bone Mineral Density</div>
                </div>
                
                <div className={`p-3 rounded-lg border ${results.muscleMass < 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
                  <div className="text-lg font-bold text-slate-100">
                    {results.muscleMass > 0 ? '+' : ''}{results.muscleMass}%
                  </div>
                  <div className="text-xs text-slate-400">Muscle Mass (CSA)</div>
                </div>
                
                <div className={`p-3 rounded-lg border ${results.immuneFunction < 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
                  <div className="text-lg font-bold text-slate-100">
                    {results.immuneFunction > 0 ? '+' : ''}{results.immuneFunction}%
                  </div>
                  <div className="text-xs text-slate-400">Immune Function Index</div>
                </div>
                
                <div className={`p-3 rounded-lg border ${results.heartRateChange > 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
                  <div className="text-lg font-bold text-slate-100">
                    {results.heartRateChange > 0 ? '+' : ''}{results.heartRateChange} bpm
                  </div>
                  <div className="text-xs text-slate-400">Resting Heart Rate</div>
                </div>
                
                <div className={`p-3 rounded-lg border ${results.bloodPressureChange > 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
                  <div className="text-lg font-bold text-slate-100">
                    {results.bloodPressureChange > 0 ? '+' : ''}{results.bloodPressureChange} mmHg
                  </div>
                  <div className="text-xs text-slate-400">Mean Arterial Pressure</div>
                </div>
              </div>
            </Card>

            <Card>
              <SectionTitle>Mission Summary</SectionTitle>
              <div className="px-4 pb-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Based on the Bion-M1 study, this {missionDays}-day mission with {geneticStrain} mice shows 
                  {results.boneDensity < -10 ? ' significant bone loss' : ' minimal bone changes'} and 
                  {results.muscleMass < -5 ? ' notable muscle atrophy' : ' stable muscle mass'}. 
                  The {exerciseCountermeasure} exercise protocol and {Math.round(activityLevel * 100)}% activity level 
                  {results.boneDensity > -5 && results.muscleMass > -3 ? ' appear effective' : ' may need adjustment'}.
                </p>
              </div>
            </Card>
          </div>
        </div>
      
        {/* Longitudinal Health Predictions */}
        {showLongitudinal && (
          <div className="grid grid-cols-12 gap-4 mt-4">
            <div className="col-span-12">
              <Card>
                <SectionTitle>Longitudinal Health Predictions</SectionTitle>
                <div className="px-4 pb-4">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={longitudinalData} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeOpacity={0.1} />
                        <XAxis dataKey="week" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                        <YAxis width={28} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: "#0b1220", border: "1px solid #164e63" }} />
                        <Legend wrapperStyle={{ fontSize: 10 }} />
                        <Line type="monotone" dataKey="boneDensity" stroke="#ef4444" strokeWidth={2} name="Bone Density" />
                        <Line type="monotone" dataKey="muscleMass" stroke="#f59e0b" strokeWidth={2} name="Muscle Mass" />
                        <Line type="monotone" dataKey="immuneFunction" stroke="#3b82f6" strokeWidth={2} name="Immune Function" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      
        {/* Strain Comparison */}
        {compareStrains && (
          <div className="grid grid-cols-12 gap-4 mt-4">
            <div className="col-span-12">
              <Card>
                <SectionTitle>Genomic Strain Comparison</SectionTitle>
                <div className="px-4 pb-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { strain: 'C57BL/6', color: '#3b82f6', description: 'High bone density, moderate muscle mass, good cardiovascular health' },
              { strain: 'BALB/c', color: '#10b981', description: 'Lower bone density, excellent immune system, moderate cardiovascular' },
              { strain: '129S1', color: '#f59e0b', description: 'Excellent bone and muscle, lower immune function, great cardiovascular' },
              { strain: 'Other', color: '#8b5cf6', description: 'Average across all physiological parameters' }
            ].map((strainInfo) => {
              const strainModifiers = {
                'C57BL/6': { bone: 0.8, muscle: 0.7, immune: 0.6, cv: 0.7 },
                'BALB/c': { bone: 0.6, muscle: 0.5, immune: 0.8, cv: 0.5 },
                '129S1': { bone: 0.9, muscle: 0.8, immune: 0.5, cv: 0.8 },
                'Other': { bone: 0.7, muscle: 0.7, immune: 0.7, cv: 0.7 }
              };
              
              const strain = strainModifiers[strainInfo.strain as keyof typeof strainModifiers];
              const missionIntensity = Math.min(missionDays / 60, 1);
              const exerciseFactor = exerciseCountermeasure === 'none' ? 0 : exerciseCountermeasure === 'low' ? 0.3 : 0.6;
              const stressLevel = (100 - baselineHealth) / 100 * 0.4 + (stressReactivity === 'low' ? 0.1 : stressReactivity === 'medium' ? 0.3 : 0.5);
              
              const boneDensity = (-0.8 * missionIntensity + 0.3 * activityLevel + 0.4 * exerciseFactor + 0.2 * (dietVsBaseline - 1)) * strain.bone * 100;
              const muscleMass = (-0.6 * missionIntensity + 0.5 * activityLevel + 0.6 * exerciseFactor + 0.3 * (dietVsBaseline - 1)) * strain.muscle * 100;
              const immuneFunction = (-0.4 * stressLevel + 0.4 * (baselineHealth / 100) + 0.2 * (dietVsBaseline - 1)) * strain.immune * 100;
              
              return (
                <div key={strainInfo.strain} className="bg-slate-800/50 p-4 rounded-lg border border-cyan-400/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: strainInfo.color }}
                    />
                    <h3 className="font-semibold text-cyan-300 text-sm">{strainInfo.strain}</h3>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Bone:</span>
                      <span className={boneDensity < 0 ? 'text-red-400' : 'text-emerald-400'}>
                        {boneDensity > 0 ? '+' : ''}{Math.round(boneDensity * 10) / 10}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Muscle:</span>
                      <span className={muscleMass < 0 ? 'text-red-400' : 'text-emerald-400'}>
                        {muscleMass > 0 ? '+' : ''}{Math.round(muscleMass * 10) / 10}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Immune:</span>
                      <span className={immuneFunction < 0 ? 'text-red-400' : 'text-emerald-400'}>
                        {immuneFunction > 0 ? '+' : ''}{Math.round(immuneFunction * 10) / 10}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-cyan-400/20">
                    <p className="text-xs text-slate-400 mb-2">{strainInfo.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
          
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Simulator;
