import React from 'react';

interface FiltersPanelProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedOrganisms: string[];
  onOrganismsChange: (organisms: string[]) => void;
  yearRange: { min: number; max: number };
  onYearRangeChange: (range: { min: number; max: number }) => void;
  organismOptions: Array<{ label: string; value: string; count: number }>;
  availableYears: { min: number; max: number };
  className?: string;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
  searchQuery,
  onSearchChange,
  selectedOrganisms,
  onOrganismsChange,
  yearRange,
  onYearRangeChange,
  organismOptions,
  availableYears,
  className = ''
}) => {
  const handleOrganismToggle = (organism: string) => {
    if (selectedOrganisms.includes(organism)) {
      onOrganismsChange(selectedOrganisms.filter(o => o !== organism));
    } else {
      onOrganismsChange([...selectedOrganisms, organism]);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Filters
      </h3>
      
      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Search Papers
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title or summary..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Year Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Publication Year: {yearRange.min} - {yearRange.max}
        </label>
        <div className="space-y-3">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 dark:text-gray-400 min-w-[3rem]">
              {availableYears.min}
            </span>
            <div className="flex-1 py-2">
              <input
                type="range"
                min={availableYears.min}
                max={availableYears.max}
                value={yearRange.min}
                onChange={(e) => {
                  const minValue = parseInt(e.target.value);
                  console.log('Min slider changed:', minValue, 'current max:', yearRange.max);
                  // Allow min to be set, but ensure it doesn't exceed max
                  const newMin = Math.min(minValue, yearRange.max);
                  onYearRangeChange({ ...yearRange, min: newMin });
                }}
                className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                Min: {yearRange.min}
              </div>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 min-w-[3rem]">
              {availableYears.max}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 dark:text-gray-400 min-w-[3rem]">
              {availableYears.min}
            </span>
            <div className="flex-1 py-2">
              <input
                type="range"
                min={availableYears.min}
                max={availableYears.max}
                value={yearRange.max}
                onChange={(e) => {
                  const maxValue = parseInt(e.target.value);
                  console.log('Max slider changed:', maxValue, 'current min:', yearRange.min);
                  // Allow max to be set, but ensure it doesn't go below min
                  const newMax = Math.max(maxValue, yearRange.min);
                  onYearRangeChange({ ...yearRange, max: newMax });
                }}
                className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                Max: {yearRange.max}
              </div>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 min-w-[3rem]">
              {availableYears.max}
            </span>
          </div>
        </div>
      </div>

      {/* Organisms */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Organisms
        </label>
        <div className="space-y-2">
          {organismOptions.map((option) => (
            <label key={option.value} className="flex items-center justify-between gap-3 cursor-pointer">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedOrganisms.includes(option.value)}
                  onChange={() => handleOrganismToggle(option.value)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                  {option.label}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {option.count}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
