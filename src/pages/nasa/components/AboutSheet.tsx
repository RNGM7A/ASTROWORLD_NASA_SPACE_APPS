import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, BookOpen, Users, Calendar, ExternalLink } from 'lucide-react';

export const AboutSheet: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const studyDetails = {
    title: "Mice in Bion-M 1 space mission: training and selection",
    authors: ["Korneeva EV", "Popova EN", "Tsvirkun DV", "Sychev VN"],
    year: 2014,
    link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4136787/",
    abstract: "The paper discusses the training and selection process of mice for the Bion-M 1 space mission conducted by NASA. The study focuses on the effects of spaceflight on mice and the importance of proper training and selection criteria for successful missions. The authors highlight the challenges and considerations involved in preparing mice for space travel and the potential insights gained from studying their behavior and physiology in microgravity environments.",
  };

  const keyFindings = [
    "Selection of diverse mice population for Bion-M 1 mission",
    "Rigorous training program to simulate space conditions",
    "Significant physiological changes in mice due to microgravity exposure",
    "Feasibility of using mice as a model organism for space research",
    "Implications for astronaut health and future space missions"
  ];

  const simulationAssumptions = [
    {
      category: "Bone Density",
      assumptions: [
        "Microgravity causes 0.8% bone loss per month",
        "Exercise countermeasures can reduce loss by 40%",
        "Genetic strain affects resistance by ±20%",
        "Diet quality impacts bone maintenance"
      ]
    },
    {
      category: "Muscle Mass",
      assumptions: [
        "Microgravity causes 0.6% muscle loss per month",
        "Activity level directly correlates with muscle retention",
        "Exercise protocols can maintain 60% of muscle mass",
        "Genetic factors influence muscle response"
      ]
    },
    {
      category: "Immune Function",
      assumptions: [
        "Stress suppresses immune function by 40%",
        "Social isolation reduces immune response by 30%",
        "Baseline health score affects immune resilience",
        "Diet quality impacts immune system function"
      ]
    },
    {
      category: "Cardiovascular",
      assumptions: [
        "Stress increases heart rate by 20-30 bpm",
        "Activity level can reduce resting HR by 10-15 bpm",
        "Health status affects cardiovascular adaptation",
        "Genetic strain influences cardiovascular response"
      ]
    }
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 bg-space-card border border-space-border rounded-lg text-white hover:glow transition-all duration-300"
      >
        <Info className="w-4 h-4" />
        About
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-bold text-white">About the Bion-M1 Simulator</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {/* Study Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Original Study
                  </h3>
                  
                  <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
                    <h4 className="font-medium text-white mb-2">{studyDetails.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {studyDetails.authors.join(', ')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {studyDetails.year}
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">{studyDetails.abstract}</p>
                    <a
                      href={studyDetails.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Original Paper
                    </a>
                  </div>
                </div>

                {/* Key Findings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Key Findings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {keyFindings.map((finding, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{finding}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Simulation Assumptions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Simulation Assumptions</h3>
                  <div className="space-y-4">
                    {simulationAssumptions.map((category, index) => (
                      <div key={index} className="p-4 bg-gray-800 rounded-lg border border-gray-600">
                        <h4 className="font-medium text-white mb-3">{category.category}</h4>
                        <ul className="space-y-2">
                          {category.assumptions.map((assumption, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                              <span className="text-blue-400 mt-1">•</span>
                              <span>{assumption}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Technical Implementation</h3>
                  <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium text-white mb-2">Model Features</h4>
                        <ul className="space-y-1 text-gray-300">
                          <li>• Real-time parameter adjustment</li>
                          <li>• Genetic strain modifiers</li>
                          <li>• Training effectiveness calculations</li>
                          <li>• Stress level modeling</li>
                          <li>• Multi-parameter optimization</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-white mb-2">Data Sources</h4>
                        <ul className="space-y-1 text-gray-300">
                          <li>• Bion-M1 mission data</li>
                          <li>• NASA bioscience publications</li>
                          <li>• Microgravity research studies</li>
                          <li>• Mouse physiology databases</li>
                          <li>• Space medicine protocols</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                  <h4 className="font-medium text-yellow-400 mb-2">Important Disclaimer</h4>
                  <p className="text-sm text-yellow-200">
                    This simulator is for educational and research purposes only. The model is based on 
                    published scientific literature but should not be used for clinical decision-making. 
                    Actual space mission outcomes may vary significantly from simulation predictions.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
