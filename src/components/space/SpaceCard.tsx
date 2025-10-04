import React from 'react';
import { motion } from 'framer-motion';

interface SpaceCardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const SpaceCard: React.FC<SpaceCardProps> = ({
  title,
  subtitle,
  icon,
  children,
  actions,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`glass rounded-2xl border border-space-border p-5 md:p-6 relative overflow-hidden ${className}`}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 nebula-gradient opacity-50 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        {(title || icon || actions) && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {icon && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-space-brand1 to-space-brand2 flex items-center justify-center glow">
                  {icon}
                </div>
              )}
              <div>
                {title && (
                  <h3 className="text-lg font-semibold text-white">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-sm text-gray-400">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            {actions && (
              <div className="flex items-center gap-2">
                {actions}
              </div>
            )}
          </div>
        )}
        
        {/* Body */}
        <div className={title || icon ? 'mt-4' : ''}>
          {children}
        </div>
      </div>
    </motion.div>
  );
};
