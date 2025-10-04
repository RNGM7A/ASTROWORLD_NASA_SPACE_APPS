import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulationStore } from '../../../stores/simulationStore';
import { X, Save, Trash2, GitCompare, Download } from 'lucide-react';
import { SimulationOutputs } from '../../../services/simulationModel';

export const CompareDrawer: React.FC = () => {
  const {
    history,
    selectedHistoryId,
    addToHistory,
    removeFromHistory,
    clearHistory,
    selectForComparison,
    exportResults,
  } = useSimulationStore();

  const [newSimulationName, setNewSimulationName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const handleSaveCurrent = () => {
    if (newSimulationName.trim()) {
      addToHistory(newSimulationName);
      setNewSimulationName('');
      setShowSaveDialog(false);
    }
  };

  const selectedSimulation = history.find(sim => sim.id === selectedHistoryId);

  const ComparisonCard: React.FC<{
    title: string;
    outputs: SimulationOutputs;
    isSelected?: boolean;
    isCurrent?: boolean;
  }> = ({ title, outputs, isSelected, isCurrent }) => (
    <div className={`p-4 rounded-lg border ${
      isSelected ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 bg-gray-800/50'
    } ${isCurrent ? 'border-green-500 bg-green-500/10' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-white">{title}</h4>
        {isCurrent && <span className="text-xs text-green-400">Current</span>}
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-400">Bone:</span>
            <span className={outputs.boneMineralDensityDelta < 0 ? 'text-red-400' : 'text-green-400'}>
              {outputs.boneMineralDensityDelta > 0 ? '+' : ''}{outputs.boneMineralDensityDelta.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Muscle:</span>
            <span className={outputs.muscleMassDelta < 0 ? 'text-red-400' : 'text-green-400'}>
              {outputs.muscleMassDelta > 0 ? '+' : ''}{outputs.muscleMassDelta.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-400">Immune:</span>
            <span className={outputs.immuneFunctionIndexDelta < 0 ? 'text-red-400' : 'text-green-400'}>
              {outputs.immuneFunctionIndexDelta > 0 ? '+' : ''}{outputs.immuneFunctionIndexDelta.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">HR:</span>
            <span className={outputs.restingHRDelta > 0 ? 'text-red-400' : 'text-green-400'}>
              {outputs.restingHRDelta > 0 ? '+' : ''}{outputs.restingHRDelta.toFixed(1)} bpm
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center p-4"
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="bg-gray-900 border border-gray-700 rounded-t-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <GitCompare className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Simulation Comparison</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSaveDialog(true)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Current
              </button>
              <button
                onClick={useSimulationStore.getState().toggleCompare}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 overflow-y-auto">
            {/* Save Dialog */}
            <AnimatePresence>
              {showSaveDialog && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 bg-gray-800 rounded-lg border border-gray-600"
                >
                  <h3 className="text-lg font-medium text-white mb-3">Save Current Simulation</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSimulationName}
                      onChange={(e) => setNewSimulationName(e.target.value)}
                      placeholder="Enter simulation name..."
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleSaveCurrent}
                      disabled={!newSimulationName.trim()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setShowSaveDialog(false)}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Current vs Selected Comparison */}
            {selectedSimulation && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Side-by-Side Comparison</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ComparisonCard
                    title="Current Simulation"
                    outputs={useSimulationStore.getState().outputs!}
                    isCurrent={true}
                  />
                  <ComparisonCard
                    title={selectedSimulation.name}
                    outputs={selectedSimulation.outputs}
                    isSelected={true}
                  />
                </div>
              </div>
            )}

            {/* History List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Saved Simulations</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const data = exportResults();
                      const blob = new Blob([data], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `bion-m1-comparison-${new Date().toISOString().split('T')[0]}.json`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export All
                  </button>
                  <button
                    onClick={clearHistory}
                    className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </button>
                </div>
              </div>

              {history.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <GitCompare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No saved simulations yet</p>
                  <p className="text-sm">Save your current simulation to compare different scenarios</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {history.map((simulation) => (
                    <div key={simulation.id} className="relative group">
                      <button
                        onClick={() => selectForComparison(simulation.id)}
                        className={`w-full p-4 rounded-lg border transition-all ${
                          selectedHistoryId === simulation.id
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-white text-left">{simulation.name}</h4>
                          <span className="text-xs text-gray-400">
                            {new Date(simulation.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Bone:</span>
                              <span className={simulation.outputs.boneMineralDensityDelta < 0 ? 'text-red-400' : 'text-green-400'}>
                                {simulation.outputs.boneMineralDensityDelta > 0 ? '+' : ''}{simulation.outputs.boneMineralDensityDelta.toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Muscle:</span>
                              <span className={simulation.outputs.muscleMassDelta < 0 ? 'text-red-400' : 'text-green-400'}>
                                {simulation.outputs.muscleMassDelta > 0 ? '+' : ''}{simulation.outputs.muscleMassDelta.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Immune:</span>
                              <span className={simulation.outputs.immuneFunctionIndexDelta < 0 ? 'text-red-400' : 'text-green-400'}>
                                {simulation.outputs.immuneFunctionIndexDelta > 0 ? '+' : ''}{simulation.outputs.immuneFunctionIndexDelta.toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">HR:</span>
                              <span className={simulation.outputs.restingHRDelta > 0 ? 'text-red-400' : 'text-green-400'}>
                                {simulation.outputs.restingHRDelta > 0 ? '+' : ''}{simulation.outputs.restingHRDelta.toFixed(1)} bpm
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => removeFromHistory(simulation.id)}
                        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
