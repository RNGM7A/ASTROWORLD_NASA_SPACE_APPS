import React from 'react';
import { Doughnut } from 'react-chartjs-2';

interface DonutCardProps {
  title: string;
  data: Array<{ label: string; value: number; color: string }>;
  className?: string;
}

export const DonutCard: React.FC<DonutCardProps> = ({
  title,
  data,
  className = ''
}) => {
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        data: data.map(item => item.value),
        backgroundColor: data.map(item => item.color),
        borderWidth: 0,
        cutout: '60%',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          <Doughnut data={chartData} options={options} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {total}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {item.label}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
