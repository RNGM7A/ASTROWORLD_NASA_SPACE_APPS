import React from 'react';
import { motion } from 'framer-motion';

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: {
    delta: number;
    positive?: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  trend,
  icon,
  className = ''
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ duration: 0.2 }}
      className={`glass rounded-2xl border border-space-border p-6 hover:glow transition-all duration-300 ${className}`}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 nebula-gradient opacity-30 pointer-events-none rounded-2xl" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-space-brand1 to-space-brand2 flex items-center justify-center glow">
                {icon}
              </div>
            )}
          </div>
          {trend && (
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              trend.positive 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {trend.positive ? '+' : ''}{trend.delta}%
            </div>
          )}
        </div>
        
        {/* Value */}
        <div className="mb-2">
          <div className="text-3xl md:text-4xl font-bold text-white">
            {value}
          </div>
        </div>
        
        {/* Label */}
        <div className="text-sm text-gray-400">
          {label}
        </div>
      </div>
    </motion.div>
  );
};
