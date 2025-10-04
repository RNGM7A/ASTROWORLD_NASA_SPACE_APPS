import React from 'react';

interface TrendCardProps {
  title: string;
  data: Array<{ label: string; value: number }>;
  chartType?: 'line' | 'bar';
  className?: string;
}

export const TrendCard: React.FC<TrendCardProps> = ({
  title,
  data,
  chartType = 'line',
  className = ''
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <div className="h-48 flex items-end justify-between gap-1">
        {data.map((item, index) => {
          const height = (item.value / maxValue) * 100;
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="relative w-full">
                {chartType === 'bar' ? (
                  <div
                    className="bg-blue-500 rounded-t-sm transition-all duration-300 hover:bg-blue-600"
                    style={{ height: `${height}%` }}
                    title={`${item.label}: ${item.value}`}
                  />
                ) : (
                  <div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full"
                    style={{ bottom: `${height}%` }}
                    title={`${item.label}: ${item.value}`}
                  />
                )}
              </div>
              <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 text-center">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
