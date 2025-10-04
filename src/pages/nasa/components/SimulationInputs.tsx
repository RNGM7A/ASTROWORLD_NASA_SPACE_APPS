import React from 'react';
import { motion } from 'framer-motion';
import { SpaceCard } from '../../../components/space/SpaceCard';
import { useSimulationStore } from '../../../stores/simulationStore';
import { Settings, Calendar, Dna, Activity, Heart, Utensils } from 'lucide-react';

export const SimulationInputs: React.FC = () => {
  const { inputs, updateInputs } = useSimulationStore();

  const inputSections = [
    {
      title: 'Mission Parameters',
      icon: <Calendar className="w-5 h-5" />,
      inputs: [
        {
          label: 'Mission Days',
          type: 'range',
          value: inputs.missionDays,
          min: 0,
          max: 60,
          step: 1,
          onChange: (value: number) => updateInputs({ missionDays: value }),
          description: 'Duration of space mission (0-60 days)',
        },
      ],
    },
    {
      title: 'Genetic Strain',
      icon: <Dna className="w-5 h-5" />,
      inputs: [
        {
          label: 'Mouse Strain',
          type: 'select',
          value: inputs.geneticStrain,
          options: [
            { value: 'C57BL/6', label: 'C57BL/6 (Good bone density)' },
            { value: 'BALB/c', label: 'BALB/c (Good immune system)' },
            { value: '129S1', label: '129S1 (High muscle mass)' },
            { value: 'Other', label: 'Other (Average)' },
          ],
          onChange: (value: string) => updateInputs({ geneticStrain: value as any }),
          description: 'Genetic background affects resistance to space conditions',
        },
      ],
    },
    {
      title: 'Pre-flight Training',
      icon: <Activity className="w-5 h-5" />,
      inputs: [
        {
          label: 'Altered Gravity Exposure',
          type: 'select',
          value: inputs.alteredGravityExposure,
          options: [
            { value: 'none', label: 'None' },
            { value: 'weekly', label: 'Weekly' },
            { value: 'daily', label: 'Daily' },
          ],
          onChange: (value: string) => updateInputs({ alteredGravityExposure: value as any }),
          description: 'Frequency of simulated microgravity training',
        },
        {
          label: 'Confinement Tolerance Score',
          type: 'range',
          value: inputs.confinementToleranceScore,
          min: 0,
          max: 10,
          step: 1,
          onChange: (value: number) => updateInputs({ confinementToleranceScore: value }),
          description: 'Ability to tolerate small spaces (0-10)',
        },
        {
          label: 'Social Isolation (Days)',
          type: 'range',
          value: inputs.socialIsolationDays,
          min: 0,
          max: 21,
          step: 1,
          onChange: (value: number) => updateInputs({ socialIsolationDays: value }),
          description: 'Duration of social isolation training',
        },
      ],
    },
    {
      title: 'Health & Stress',
      icon: <Heart className="w-5 h-5" />,
      inputs: [
        {
          label: 'Baseline Health Score',
          type: 'range',
          value: inputs.baselineHealthScore,
          min: 0,
          max: 100,
          step: 5,
          onChange: (value: number) => updateInputs({ baselineHealthScore: value }),
          description: 'Pre-mission health status (0-100)',
        },
        {
          label: 'Stress Reactivity',
          type: 'select',
          value: inputs.stressReactivity,
          options: [
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
          ],
          onChange: (value: string) => updateInputs({ stressReactivity: value as any }),
          description: 'Response to stressful conditions',
        },
      ],
    },
    {
      title: 'In-flight Conditions',
      icon: <Utensils className="w-5 h-5" />,
      inputs: [
        {
          label: 'Activity Level',
          type: 'range',
          value: inputs.activityLevel,
          min: 0,
          max: 1,
          step: 0.1,
          onChange: (value: number) => updateInputs({ activityLevel: value }),
          description: 'Physical activity during mission (0-1)',
        },
        {
          label: 'Exercise Countermeasure',
          type: 'select',
          value: inputs.exerciseCountermeasure,
          options: [
            { value: 'none', label: 'None' },
            { value: 'low', label: 'Low' },
            { value: 'high', label: 'High' },
          ],
          onChange: (value: string) => updateInputs({ exerciseCountermeasure: value as any }),
          description: 'Exercise protocols to counter microgravity effects',
        },
        {
          label: 'Diet vs Baseline',
          type: 'range',
          value: inputs.dietVsBaseline,
          min: 0.6,
          max: 1.2,
          step: 0.1,
          onChange: (value: number) => updateInputs({ dietVsBaseline: value }),
          description: 'Nutritional intake relative to baseline (0.6-1.2x)',
        },
      ],
    },
  ];

  return (
    <SpaceCard
      title="Simulation Parameters"
      icon={<Settings className="w-5 h-5 text-white" />}
      className="h-fit"
    >
      <div className="space-y-6">
        {inputSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: sectionIndex * 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-white font-medium">
              {section.icon}
              <span>{section.title}</span>
            </div>
            
            <div className="space-y-4 pl-2">
              {section.inputs.map((input, inputIndex) => (
                <div key={input.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-300">
                      {input.label}
                    </label>
                    <span className="text-sm text-blue-400 font-mono">
                      {input.value}
                      {input.type === 'range' && input.label === 'Activity Level' && ''}
                      {input.type === 'range' && input.label === 'Diet vs Baseline' && 'x'}
                      {input.type === 'range' && input.label === 'Mission Days' && ' days'}
                      {input.type === 'range' && input.label === 'Social Isolation (Days)' && ' days'}
                      {input.type === 'range' && input.label === 'Baseline Health Score' && '%'}
                    </span>
                  </div>
                  
                  {input.type === 'range' ? (
                    <input
                      type="range"
                      min={input.min}
                      max={input.max}
                      step={input.step}
                      value={input.value}
                      onChange={(e) => input.onChange(Number(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                  ) : (
                    <select
                      value={input.value}
                      onChange={(e) => input.onChange(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {input.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                  
                  <p className="text-xs text-gray-400">
                    {input.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </SpaceCard>
  );
};
