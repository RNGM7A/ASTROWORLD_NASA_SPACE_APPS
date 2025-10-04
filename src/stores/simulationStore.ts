import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { SimulationInputs, SimulationOutputs, defaultSimulator } from '../services/simulationModel';

interface SimulationState {
  // Current simulation inputs
  inputs: SimulationInputs;
  
  // Current simulation outputs
  outputs: SimulationOutputs | null;
  
  // Simulation history for comparison
  history: Array<{
    id: string;
    timestamp: number;
    inputs: SimulationInputs;
    outputs: SimulationOutputs;
    name?: string;
  }>;
  
  // UI state
  isRunning: boolean;
  showCompare: boolean;
  selectedHistoryId: string | null;
  
  // Actions
  updateInputs: (updates: Partial<SimulationInputs>) => void;
  runSimulation: () => void;
  resetToDefaults: () => void;
  addToHistory: (name?: string) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  toggleCompare: () => void;
  selectForComparison: (id: string) => void;
  exportResults: () => string;
  importResults: (data: string) => void;
}

const defaultInputs: SimulationInputs = {
  missionDays: 30,
  geneticStrain: 'C57BL/6',
  alteredGravityExposure: 'weekly',
  confinementToleranceScore: 7,
  socialIsolationDays: 3,
  baselineHealthScore: 85,
  stressReactivity: 'medium',
  activityLevel: 0.6,
  exerciseCountermeasure: 'low',
  dietVsBaseline: 1.0,
};

export const useSimulationStore = create<SimulationState>()(
  devtools(
    (set, get) => ({
      // Initial state
      inputs: defaultInputs,
      outputs: null,
      history: [],
      isRunning: false,
      showCompare: false,
      selectedHistoryId: null,
      
      // Update inputs
      updateInputs: (updates) => {
        set((state) => ({
          inputs: { ...state.inputs, ...updates }
        }));
      },
      
      // Run simulation
      runSimulation: () => {
        const { inputs } = get();
        
        set({ isRunning: true });
        
        // Simulate API delay for realistic feel
        setTimeout(() => {
          try {
            const outputs = defaultSimulator.simulate(inputs);
            set({ 
              outputs, 
              isRunning: false 
            });
          } catch (error) {
            console.error('Simulation error:', error);
            set({ isRunning: false });
          }
        }, 500);
      },
      
      // Reset to defaults
      resetToDefaults: () => {
        set({
          inputs: defaultInputs,
          outputs: null,
        });
      },
      
      // Add current simulation to history
      addToHistory: (name) => {
        const { inputs, outputs, history } = get();
        
        if (!outputs) return;
        
        const newEntry = {
          id: `sim_${Date.now()}`,
          timestamp: Date.now(),
          inputs,
          outputs,
          name: name || `Simulation ${history.length + 1}`,
        };
        
        set({
          history: [...history, newEntry],
        });
      },
      
      // Remove from history
      removeFromHistory: (id) => {
        set((state) => ({
          history: state.history.filter(entry => entry.id !== id),
          selectedHistoryId: state.selectedHistoryId === id ? null : state.selectedHistoryId,
        }));
      },
      
      // Clear all history
      clearHistory: () => {
        set({
          history: [],
          selectedHistoryId: null,
        });
      },
      
      // Toggle compare mode
      toggleCompare: () => {
        set((state) => ({
          showCompare: !state.showCompare,
          selectedHistoryId: !state.showCompare ? null : state.selectedHistoryId,
        }));
      },
      
      // Select for comparison
      selectForComparison: (id) => {
        set({ selectedHistoryId: id });
      },
      
      // Export results as JSON
      exportResults: () => {
        const { inputs, outputs, history } = get();
        
        const exportData = {
          currentSimulation: {
            inputs,
            outputs,
          },
          history,
          timestamp: Date.now(),
          version: '1.0',
        };
        
        return JSON.stringify(exportData, null, 2);
      },
      
      // Import results from JSON
      importResults: (data) => {
        try {
          const parsed = JSON.parse(data);
          
          if (parsed.currentSimulation) {
            set({
              inputs: parsed.currentSimulation.inputs,
              outputs: parsed.currentSimulation.outputs,
            });
          }
          
          if (parsed.history) {
            set({ history: parsed.history });
          }
        } catch (error) {
          console.error('Import error:', error);
        }
      },
    }),
    {
      name: 'bion-m1-simulation-store',
    }
  )
);
