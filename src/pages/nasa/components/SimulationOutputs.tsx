import React from 'react';
import { motion } from 'framer-motion';
import { SpaceCard } from '../../../components/space/SpaceCard';
import { SimulationOutputs as OutputsType } from '../../../services/simulationModel';
import { 
  Bone, 
  Zap, 
  Shield, 
  Heart, 
  Activity,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

interface SimulationOutputsProps {
  outputs: OutputsType;
  isRunning: boolean;
}

export const SimulationOutputs: React.FC<SimulationOutputsProps> = ({ 
  outputs, 
  isRunning 
}) => {
  const kpiCards = [
    {
      title: 'Bone Mineral Density',
      value: outputs.boneMineralDensityDelta,
      unit: '%',
      icon: <Bone className="w-6 h-6" />,
      color: outputs.boneMineralDensityDelta < 0 ? 'text-red-400' : 'text-green-400',
      bgColor: outputs.boneMineralDensityDelta < 0 ? 'bg-red-500/20' : 'bg-green-500/20',
      description: 'Change in bone mineral density',
      trend: outputs.boneMineralDensityDelta < 0 ? 'down' : 'up',
    },
    {
      title: 'Muscle Mass (CSA)',
      value: outputs.muscleMassDelta,
      unit: '%',
      icon: <Zap className="w-6 h-6" />,
      color: outputs.muscleMassDelta < 0 ? 'text-red-400' : 'text-green-400',
      bgColor: outputs.muscleMassDelta < 0 ? 'bg-red-500/20' : 'bg-green-500/20',
      description: 'Change in muscle cross-sectional area',
      trend: outputs.muscleMassDelta < 0 ? 'down' : 'up',
    },
    {
      title: 'Immune Function',
      value: outputs.immuneFunctionIndexDelta,
      unit: '%',
      icon: <Shield className="w-6 h-6" />,
      color: outputs.immuneFunctionIndexDelta < 0 ? 'text-red-400' : 'text-green-400',
      bgColor: outputs.immuneFunctionIndexDelta < 0 ? 'bg-red-500/20' : 'bg-green-500/20',
      description: 'Change in immune function index',
      trend: outputs.immuneFunctionIndexDelta < 0 ? 'down' : 'up',
    },
    {
      title: 'Resting Heart Rate',
      value: outputs.restingHRDelta,
      unit: 'bpm',
      icon: <Heart className="w-6 h-6" />,
      color: outputs.restingHRDelta > 0 ? 'text-red-400' : 'text-green-400',
      bgColor: outputs.restingHRDelta > 0 ? 'bg-red-500/20' : 'bg-green-500/20',
      description: 'Change in resting heart rate',
      trend: outputs.restingHRDelta > 0 ? 'up' : 'down',
    },
    {
      title: 'Mean Arterial Pressure',
      value: outputs.mapDelta,
      unit: 'mmHg',
      icon: <Activity className="w-6 h-6" />,
      color: outputs.mapDelta > 0 ? 'text-red-400' : 'text-green-400',
      bgColor: outputs.mapDelta > 0 ? 'bg-red-500/20' : 'bg-green-500/20',
      description: 'Change in mean arterial pressure',
      trend: outputs.mapDelta > 0 ? 'up' : 'down',
    },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SpaceCard
        title="Simulation Results"
        icon={<Activity className="w-5 h-5 text-white" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {kpiCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              className={`p-4 rounded-lg border border-gray-600 ${card.bgColor} ${
                isRunning ? 'animate-pulse' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  {card.icon}
                </div>
                <div className={`flex items-center gap-1 ${getTrendColor(card.trend)}`}>
                  {getTrendIcon(card.trend)}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-bold ${card.color}`}>
                    {card.value > 0 ? '+' : ''}{card.value}
                  </span>
                  <span className="text-sm text-gray-400">{card.unit}</span>
                </div>
                
                <h3 className="text-sm font-medium text-white">
                  {card.title}
                </h3>
                
                <p className="text-xs text-gray-400">
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-600"
        >
          <h4 className="text-sm font-medium text-white mb-2">Simulation Summary</h4>
          <div className="text-sm text-gray-300 space-y-1">
            <p>
              Based on the current parameters, the simulation predicts:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                <span className={outputs.boneMineralDensityDelta < 0 ? 'text-red-400' : 'text-green-400'}>
                  {outputs.boneMineralDensityDelta < 0 ? 'Decreased' : 'Increased'}
                </span> bone density by {Math.abs(outputs.boneMineralDensityDelta).toFixed(1)}%
              </li>
              <li>
                <span className={outputs.muscleMassDelta < 0 ? 'text-red-400' : 'text-green-400'}>
                  {outputs.muscleMassDelta < 0 ? 'Decreased' : 'Increased'}
                </span> muscle mass by {Math.abs(outputs.muscleMassDelta).toFixed(1)}%
              </li>
              <li>
                <span className={outputs.immuneFunctionIndexDelta < 0 ? 'text-red-400' : 'text-green-400'}>
                  {outputs.immuneFunctionIndexDelta < 0 ? 'Decreased' : 'Increased'}
                </span> immune function by {Math.abs(outputs.immuneFunctionIndexDelta).toFixed(1)}%
              </li>
            </ul>
          </div>
        </motion.div>
      </SpaceCard>
    </motion.div>
  );
};
