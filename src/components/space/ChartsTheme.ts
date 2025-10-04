import { ChartOptions } from 'chart.js';

export const spaceChartOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: '#cbd5e1',
        font: {
          size: 12,
          family: 'Outfit, sans-serif',
        },
        padding: 20,
        usePointStyle: true,
        pointStyle: 'circle',
      },
    },
    tooltip: {
      backgroundColor: 'rgba(14, 26, 47, 0.95)',
      titleColor: '#ffffff',
      bodyColor: '#cbd5e1',
      borderColor: '#1d2a44',
      borderWidth: 1,
      cornerRadius: 8,
      titleFont: {
        size: 14,
        weight: 'bold',
        family: 'Outfit, sans-serif',
      },
      bodyFont: {
        size: 12,
        family: 'Outfit, sans-serif',
      },
      padding: 12,
    },
  },
  scales: {
    x: {
      grid: {
        color: '#20304d',
        drawBorder: false,
      },
      ticks: {
        color: '#cbd5e1',
        font: {
          size: 11,
          family: 'Outfit, sans-serif',
        },
      },
      border: {
        display: false,
      },
    },
    y: {
      grid: {
        color: '#20304d',
        drawBorder: false,
      },
      ticks: {
        color: '#cbd5e1',
        font: {
          size: 11,
          family: 'Outfit, sans-serif',
        },
      },
      border: {
        display: false,
      },
    },
  },
};

export const spaceRadarOptions: ChartOptions<'radar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(14, 26, 47, 0.95)',
      titleColor: '#ffffff',
      bodyColor: '#cbd5e1',
      borderColor: '#1d2a44',
      borderWidth: 1,
      cornerRadius: 8,
      titleFont: {
        size: 14,
        weight: 'bold',
        family: 'Outfit, sans-serif',
      },
      bodyFont: {
        size: 12,
        family: 'Outfit, sans-serif',
      },
      padding: 12,
    },
  },
  scales: {
    r: {
      beginAtZero: true,
      max: 100,
      ticks: {
        stepSize: 20,
        color: '#cbd5e1',
        font: {
          size: 10,
          family: 'Outfit, sans-serif',
        },
        backdropColor: 'transparent',
      },
      grid: {
        color: '#20304d',
      },
      angleLines: {
        color: '#20304d',
      },
      pointLabels: {
        color: '#cbd5e1',
        font: {
          size: 11,
          family: 'Outfit, sans-serif',
        },
      },
    },
  },
};

export const spaceDoughnutOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(14, 26, 47, 0.95)',
      titleColor: '#ffffff',
      bodyColor: '#cbd5e1',
      borderColor: '#1d2a44',
      borderWidth: 1,
      cornerRadius: 8,
      titleFont: {
        size: 14,
        weight: 'bold',
        family: 'Outfit, sans-serif',
      },
      bodyFont: {
        size: 12,
        family: 'Outfit, sans-serif',
      },
      padding: 12,
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

// Space theme colors for datasets
export const spaceColors = {
  primary: '#7c5cff',
  secondary: '#00e0ff',
  accent: '#4ade80',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

export const spaceGradients = {
  primary: 'rgba(124, 92, 255, 0.8)',
  secondary: 'rgba(0, 224, 255, 0.8)',
  accent: 'rgba(74, 222, 128, 0.8)',
  warning: 'rgba(245, 158, 11, 0.8)',
  error: 'rgba(239, 68, 68, 0.8)',
  info: 'rgba(59, 130, 246, 0.8)',
};

export const spaceBorders = {
  primary: '#7c5cff',
  secondary: '#00e0ff',
  accent: '#4ade80',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};
