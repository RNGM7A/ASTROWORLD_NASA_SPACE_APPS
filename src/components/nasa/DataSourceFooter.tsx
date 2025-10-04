import React from 'react';

export const DataSourceFooter: React.FC = () => {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
      <div className="text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <strong>Data Source:</strong> Curated NASA bioscience publications (demo subset)
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          This dashboard showcases a subset of NASA's bioscience research publications. 
          Each paper includes links to the original source when available.
        </p>
      </div>
    </div>
  );
};
