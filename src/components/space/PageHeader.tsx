import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Orbit } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string[];
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumb = ['NASA BioExplorer'],
  actions
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative mb-8"
    >
      {/* Background gradient spot */}
      <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-space-brand1/20 to-transparent rounded-full blur-xl" />
      
      <div className="relative z-10">
        {/* Breadcrumb */}
        {breadcrumb.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            {breadcrumb.map((item, index) => (
              <React.Fragment key={item}>
                {index > 0 && <ChevronRight className="w-4 h-4" />}
                <span className={index === breadcrumb.length - 1 ? 'text-white' : ''}>
                  {item}
                </span>
              </React.Fragment>
            ))}
          </div>
        )}
        
        {/* Header Content */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* NASA Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-space-brand1 to-space-brand2 flex items-center justify-center glow">
                <Orbit className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold space-gradient">
                  {title}
                </h1>
                {subtitle && (
                  <p className="mt-2 text-gray-400">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Actions */}
          {actions && (
            <div className="flex items-center gap-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
