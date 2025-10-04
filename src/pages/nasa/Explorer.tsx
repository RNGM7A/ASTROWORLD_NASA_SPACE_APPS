import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { motion } from 'framer-motion';
import { Search, Copy, Download } from 'lucide-react';
import { SpaceCard } from '../../components/space/SpaceCard';
import { PageHeader } from '../../components/space/PageHeader';
import { FiltersPanel } from '../../components/nasa/FiltersPanel';
import { PapersTable } from '../../components/nasa/PapersTable';
import { DataSourceFooter } from '../../components/nasa/DataSourceFooter';
import PageMeta from '../../components/common/PageMeta';
import { 
  loadNasaPapers, 
  Paper, 
  searchPapers,
  filterByOrganism,
  filterByYearRange,
  getKpis,
  ORGANISM_KEYWORDS
} from '../../services/nasaData';

const Explorer: React.FC = () => {
  console.log('Explorer component rendering...');
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedOrganisms, setSelectedOrganisms] = useState<string[]>(
    searchParams.get('organisms')?.split(',').filter(Boolean) || []
  );
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true);
        console.log('Loading NASA papers...');
        const data = await loadNasaPapers();
        console.log('Loaded papers:', data.length);
        setPapers(data);
      } catch (err) {
        console.error('Error loading papers:', err);
        setError(err instanceof Error ? err.message : 'Failed to load papers');
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedOrganisms.length > 0) params.set('organisms', selectedOrganisms.join(','));
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    setSearchParams(params);
  }, [searchQuery, selectedOrganisms, currentPage, setSearchParams]);


  const organismOptions = useMemo(() => {
    const stats = Object.keys(ORGANISM_KEYWORDS).map(organism => ({
      label: organism.charAt(0).toUpperCase() + organism.slice(1),
      value: organism,
      count: papers.filter(paper => {
        const text = `${paper.title} ${paper.summary}`.toLowerCase();
        return ORGANISM_KEYWORDS[organism as keyof typeof ORGANISM_KEYWORDS].some(
          keyword => text.includes(keyword)
        );
      }).length
    })).filter(option => option.count > 0);

    return stats;
  }, [papers]);

  const availableYears = useMemo(() => {
    const years = papers
      .map(p => p.year)
      .filter((year): year is number => year !== null)
      .sort((a, b) => a - b);
    
    return {
      min: years[0] || 0,
      max: years[years.length - 1] || 0
    };
  }, [papers]);

  const yearRange = useMemo(() => {
    // Use full available range if no URL params
    const min = parseInt(searchParams.get('minYear') || availableYears.min.toString());
    const max = parseInt(searchParams.get('maxYear') || availableYears.max.toString());
    return { min, max };
  }, [searchParams, availableYears]);

  const handleYearRangeChange = (range: { min: number; max: number }) => {
    const params = new URLSearchParams(searchParams);
    params.set('minYear', range.min.toString());
    params.set('maxYear', range.max.toString());
    setSearchParams(params);
  };

  // Apply all filters
  const filteredPapers = useMemo(() => {
    let filtered = papers;

    // Search filter
    if (searchQuery.trim()) {
      filtered = searchPapers(filtered, searchQuery);
    }

    // Organism filter
    if (selectedOrganisms.length > 0) {
      filtered = filterByOrganism(filtered, selectedOrganisms);
    }

    // Year range filter
    console.log('Year range filter:', { min: yearRange.min, max: yearRange.max, papersBefore: filtered.length });
    filtered = filterByYearRange(filtered, yearRange.min, yearRange.max);
    console.log('Papers after year filter:', filtered.length);

    return filtered;
  }, [papers, searchQuery, selectedOrganisms, yearRange]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="p-6 starfield min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-cyan-300">Loading NASA papers...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 starfield min-h-screen">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Error loading data
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta 
        title="NASA BioExplorer - Paper Explorer" 
        description="Search and filter through NASA bioscience publications with advanced filtering and pagination"
      />
      <div className="p-6 space-y-8 starfield min-h-screen">
        {/* Header */}
        <PageHeader
          title="Paper Explorer"
          subtitle="Search and filter through NASA bioscience publications"
          breadcrumb={['NASA BioExplorer', 'Explorer']}
        />

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <SpaceCard className="p-4">
            <div className="text-2xl font-bold text-white">
              {papers.length.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">
              Total Papers
            </div>
          </SpaceCard>
          <SpaceCard className="p-4">
            <div className="text-2xl font-bold text-white">
              {filteredPapers.length.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">
              Filtered Results
            </div>
          </SpaceCard>
          <SpaceCard className="p-4">
            <div className="text-2xl font-bold text-white">
              {organismOptions.length}
            </div>
            <div className="text-sm text-gray-400">
              Organism Types
            </div>
          </SpaceCard>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-4 gap-6"
        >
          {/* Filters Panel */}
          <div className="lg:col-span-1">
            <SpaceCard
              title="Filters"
              icon={<Search className="w-5 h-5 text-white" />}
            >
              <FiltersPanel
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedOrganisms={selectedOrganisms}
                onOrganismsChange={setSelectedOrganisms}
                yearRange={yearRange}
                onYearRangeChange={handleYearRangeChange}
                organismOptions={organismOptions}
                availableYears={availableYears}
              />
            </SpaceCard>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <PapersTable
              papers={filteredPapers}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </motion.div>


      <DataSourceFooter />
      </div>
    </>
  );
};

export default Explorer;
