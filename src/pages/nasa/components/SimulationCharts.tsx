import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SpaceCard } from '../../../components/space/SpaceCard';
import { SimulationOutputs, SimulationInputs } from '../../../services/simulationModel';
import { BarChart3, PieChart, TrendingUp, ToggleLeft, ToggleRight } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

interface SimulationChartsProps {
  outputs: SimulationOutputs;
  inputs: SimulationInputs;
}

export const SimulationCharts: React.FC<SimulationChartsProps> = ({ 
  outputs, 
  inputs 
}) => {
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar');

  // Prepare data for different chart types
  const barData = [
    {
      name: 'Bone Density',
      value: outputs.boneMineralDensityDelta,
      color: outputs.boneMineralDensityDelta < 0 ? '#ef4444' : '#10b981',
    },
    {
      name: 'Muscle Mass',
      value: outputs.muscleMassDelta,
      color: outputs.muscleMassDelta < 0 ? '#ef4444' : '#10b981',
    },
    {
      name: 'Immune Function',
      value: outputs.immuneFunctionIndexDelta,
      color: outputs.immuneFunctionIndexDelta < 0 ? '#ef4444' : '#10b981',
    },
    {
      name: 'Heart Rate',
      value: outputs.restingHRDelta,
      color: outputs.restingHRDelta > 0 ? '#ef4444' : '#10b981',
    },
    {
      name: 'Blood Pressure',
      value: outputs.mapDelta,
      color: outputs.mapDelta > 0 ? '#ef4444' : '#10b981',
    },
  ];

  const pieData = [
    {
      name: 'Bone Density',
      value: Math.abs(outputs.boneMineralDensityDelta),
      color: '#3b82f6',
    },
    {
      name: 'Muscle Mass',
      value: Math.abs(outputs.muscleMassDelta),
      color: '#10b981',
    },
    {
      name: 'Immune Function',
      value: Math.abs(outputs.immuneFunctionIndexDelta),
      color: '#f59e0b',
    },
    {
      name: 'Heart Rate',
      value: Math.abs(outputs.restingHRDelta),
      color: '#ef4444',
    },
    {
      name: 'Blood Pressure',
      value: Math.abs(outputs.mapDelta),
      color: '#8b5cf6',
    },
  ];

  const lineData = [
    { day: 0, bone: 0, muscle: 0, immune: 0 },
    { day: 7, bone: outputs.boneMineralDensityDelta * 0.3, muscle: outputs.muscleMassDelta * 0.3, immune: outputs.immuneFunctionIndexDelta * 0.3 },
    { day: 14, bone: outputs.boneMineralDensityDelta * 0.6, muscle: outputs.muscleMassDelta * 0.6, immune: outputs.immuneFunctionIndexDelta * 0.6 },
    { day: 21, bone: outputs.boneMineralDensityDelta * 0.8, muscle: outputs.muscleMassDelta * 0.8, immune: outputs.immuneFunctionIndexDelta * 0.8 },
    { day: 30, bone: outputs.boneMineralDensityDelta, muscle: outputs.muscleMassDelta, immune: outputs.immuneFunctionIndexDelta },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{`${label}: ${payload[0].value.toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                stroke="#9ca3af"
                fontSize={12}
                tick={{ fill: '#9ca3af' }}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
                tick={{ fill: '#9ca3af' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="day" 
                stroke="#9ca3af"
                fontSize={12}
                tick={{ fill: '#9ca3af' }}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
                tick={{ fill: '#9ca3af' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="bone" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Bone Density"
              />
              <Line 
                type="monotone" 
                dataKey="muscle" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Muscle Mass"
              />
              <Line 
                type="monotone" 
                dataKey="immune" 
                stroke="#f59e0b" 
                strokeWidth={2}
                name="Immune Function"
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <SpaceCard
        title="Simulation Analytics"
        icon={<BarChart3 className="w-5 h-5 text-white" />}
      >
        {/* Chart Type Toggle */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setChartType('bar')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              chartType === 'bar' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Bar Chart
          </button>
          <button
            onClick={() => setChartType('pie')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              chartType === 'pie' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <PieChart className="w-4 h-4" />
            Pie Chart
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              chartType === 'line' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Timeline
          </button>
        </div>

        {/* Chart */}
        <div className="h-[300px]">
          {renderChart()}
        </div>

        {/* Chart Description */}
        <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
          <h4 className="text-sm font-medium text-white mb-2">
            {chartType === 'bar' && 'Physiological Changes Comparison'}
            {chartType === 'pie' && 'Relative Impact Distribution'}
            {chartType === 'line' && 'Mission Timeline Progression'}
          </h4>
          <p className="text-sm text-gray-300">
            {chartType === 'bar' && 'Compare the magnitude of changes across different physiological parameters.'}
            {chartType === 'pie' && 'Visualize the relative impact of different physiological changes.'}
            {chartType === 'line' && 'Track how physiological changes develop over the course of the mission.'}
          </p>
        </div>
      </SpaceCard>
    </motion.div>
  );
};
