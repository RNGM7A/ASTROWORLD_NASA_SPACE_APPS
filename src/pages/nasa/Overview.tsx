import React, { useState, useEffect, useMemo } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { 
  FileText,
  Calendar, 
  Users, 
  Clock,
  Download,
  Copy,
  ExternalLink,
  BarChart3,
  PieChart
} from 'lucide-react';
import { SpaceCard } from '../../components/space/SpaceCard';
import { MetricCard } from '../../components/space/MetricCard';
import { PageHeader } from '../../components/space/PageHeader';
import { DataSourceFooter } from '../../components/nasa/DataSourceFooter';
import { spaceChartOptions, spaceDoughnutOptions, spaceColors, spaceGradients, spaceBorders } from '../../components/space/ChartsTheme';
import PageMeta from '../../components/common/PageMeta';
import { 
  loadNasaPapers, 
  Paper, 
  getKpis, 
  getOrganismStats, 
  getPapersPerYear,
  getPapersPerYearByOrganism
} from '../../services/nasaData';

const Overview: React.FC = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true);
        const data = await loadNasaPapers();
        setPapers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load papers');
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, []);

  const kpis = useMemo(() => getKpis(papers), [papers]);
  const organismStats = useMemo(() => getOrganismStats(papers), [papers]);
  const papersPerYear = useMemo(() => getPapersPerYear(papers), [papers]);
  const papersPerYearByOrganism = useMemo(() => getPapersPerYearByOrganism(papers), [papers]);

  const organismChartData = useMemo(() => [
    { label: 'Mouse', value: organismStats.mouse, color: spaceColors.primary },
    { label: 'Human', value: organismStats.human, color: spaceColors.accent },
    { label: 'Plant', value: organismStats.plant, color: spaceColors.warning },
    { label: 'Drosophila', value: organismStats.drosophila, color: spaceColors.error },
    { label: 'Microbe', value: organismStats.microbe, color: spaceColors.secondary },
    { label: 'Other', value: organismStats.other, color: '#6B7280' },
  ].filter(item => item.value > 0), [organismStats]);

  const papersPerYearChartData = {
    labels: papersPerYear.map(item => item.year.toString()),
    datasets: [
      {
        label: 'Papers per Year',
        data: papersPerYear.map(item => item.count),
        backgroundColor: spaceGradients.primary,
        borderColor: spaceBorders.primary,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const papersByOrganismChartData = {
    labels: papersPerYear.map(item => item.year.toString()),
    datasets: Object.entries(papersPerYearByOrganism).map(([organism, data], index) => {
      const organismData = organismChartData.find(item => item.label.toLowerCase() === organism);
      return {
        label: organism.charAt(0).toUpperCase() + organism.slice(1),
        data: data.map(item => item.count),
        backgroundColor: organismData?.color + '80' || spaceGradients.primary,
        borderColor: organismData?.color || spaceBorders.primary,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      };
    }),
  };

  const organismDoughnutData = {
    labels: organismChartData.map(item => item.label),
    datasets: [
      {
        data: organismChartData.map(item => item.value),
        backgroundColor: organismChartData.map(item => item.color + '80'),
        borderColor: organismChartData.map(item => item.color),
        borderWidth: 2,
        cutout: '60%',
      },
    ],
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
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
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta 
        title="NASA BioExplorer - Overview" 
        description="Comprehensive analysis of NASA bioscience publications with KPIs, charts, and research highlights"
      />
      <div className="p-6 space-y-8 starfield min-h-screen">
        {/* Header */}
        <PageHeader
          title="Overview"
          subtitle="Comprehensive analysis of NASA bioscience publications"
          breadcrumb={['NASA BioExplorer', 'Overview']}
        />

        {/* KPI Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <MetricCard
            label="Total Papers"
            value={kpis.totalPapers.toLocaleString()}
            icon={<FileText className="w-5 h-5 text-white" />}
          />
          <MetricCard
            label="Year Range"
            value={`${kpis.yearsRange.min}-${kpis.yearsRange.max}`}
            icon={<Calendar className="w-5 h-5 text-white" />}
          />
          <MetricCard
            label="Organisms Studied"
            value={kpis.organismsCount}
            icon={<Users className="w-5 h-5 text-white" />}
          />
          <MetricCard
            label="Median Year"
            value={kpis.medianYear}
            icon={<Clock className="w-5 h-5 text-white" />}
          />
        </motion.div>

        {/* Charts */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Papers per Year */}
          <SpaceCard
            title="Papers per Year"
            icon={<BarChart3 className="w-5 h-5 text-white" />}
          >
            <div className="h-80">
              <Bar data={papersPerYearChartData} options={spaceChartOptions} />
            </div>
          </SpaceCard>

          {/* Organism Distribution */}
          <SpaceCard
            title="Distribution by Organism"
            icon={<PieChart className="w-5 h-5 text-white" />}
          >
            <div className="h-80">
              <Doughnut data={organismDoughnutData} options={spaceDoughnutOptions} />
            </div>
            <div className="mt-4 space-y-2">
              {organismChartData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-300">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-white">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </SpaceCard>
        </motion.div>

        {/* Papers by Year by Organism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <SpaceCard
            title="Papers per Year by Organism"
            icon={<BarChart3 className="w-5 h-5 text-white" />}
          >
            <div className="h-80">
              <Bar data={papersByOrganismChartData} options={spaceChartOptions} />
            </div>
          </SpaceCard>
        </motion.div>

      <DataSourceFooter />
      </div>
    </>
  );
};

export default Overview;
