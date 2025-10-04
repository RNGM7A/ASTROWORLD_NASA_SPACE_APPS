import React, { useState, useEffect, useMemo } from 'react';
import { Radar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { Brain, Copy, Download, Target } from 'lucide-react';
import { SpaceCard } from '../../components/space/SpaceCard';
import { PageHeader } from '../../components/space/PageHeader';
import { DataSourceFooter } from '../../components/nasa/DataSourceFooter';
import { spaceRadarOptions, spaceColors } from '../../components/space/ChartsTheme';
import PageMeta from '../../components/common/PageMeta';
import { 
  loadNasaPapers, 
  Paper, 
  getKpis, 
  getOrganismStats,
  getPapersPerYear,
  calculateRelevanceScore
} from '../../services/nasaData';

const Insights: React.FC = () => {
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

  // Generate AI Summary (heuristic-based for now)
  const aiSummary = useMemo(() => {
    if (papers.length === 0) return '';

    const totalPapers = papers.length;
    const yearSpan = kpis.yearsRange.max - kpis.yearsRange.min;
    const avgPapersPerYear = totalPapers / yearSpan;
    
    const topOrganism = Object.entries(organismStats)
      .filter(([_, count]) => count > 0)
      .sort(([_, a], [__, b]) => b - a)[0];
    
    const recentPapers = papers.filter(p => p.year && p.year >= kpis.yearsRange.max - 5);
    const recentCount = recentPapers.length;
    const recentPercentage = ((recentCount / totalPapers) * 100).toFixed(1);

    return `The NASA bioscience publication dataset contains ${totalPapers.toLocaleString()} papers spanning ${yearSpan} years (${kpis.yearsRange.min}-${kpis.yearsRange.max}), with an average of ${avgPapersPerYear.toFixed(1)} publications per year. The most studied organism is ${topOrganism?.[0] || 'various species'} with ${topOrganism?.[1] || 0} papers. Recent research activity shows ${recentCount} papers (${recentPercentage}%) published in the last 5 years, indicating ${recentCount > totalPapers * 0.3 ? 'strong' : 'moderate'} ongoing research activity in space bioscience.`;
  }, [papers, kpis, organismStats]);

  // Knowledge gaps radar chart data
  const radarData = useMemo(() => {
    const researchAreas = [
      { name: 'Bone/Skeletal', keywords: ['bone', 'skeletal', 'osteoporosis', 'osteoclast', 'osteoblast', 'calcium'] },
      { name: 'Cardiovascular', keywords: ['cardiovascular', 'heart', 'blood pressure', 'circulation', 'cardiac'] },
      { name: 'Immune', keywords: ['immune', 'immunity', 'lymphocyte', 'antibody', 'inflammation', 'resistance'] },
      { name: 'Neuro/CNS', keywords: ['neuro', 'neural', 'brain', 'cns', 'cognitive', 'memory', 'neuron'] },
      { name: 'Microbiome/Host-Microbe', keywords: ['microbiome', 'microbe', 'bacteria', 'gut', 'microbial', 'flora'] }
    ];

    // Calculate keyword hits per year normalized
    const data = researchAreas.map(area => {
      const yearlyHits = papersPerYear.map(yearData => {
        const yearPapers = papers.filter(p => p.year === yearData.year);
        const hits = yearPapers.filter(paper => {
          const text = `${paper.title} ${paper.summary}`.toLowerCase();
          return area.keywords.some(keyword => text.includes(keyword));
        }).length;
        return hits;
      });

      // Calculate average hits per year, normalized by total papers in that year
      const totalHits = yearlyHits.reduce((sum, hits) => sum + hits, 0);
      const totalPapersInYears = papersPerYear.reduce((sum, yearData) => sum + yearData.count, 0);
      
      // Normalize to 0-100 scale
      return totalPapersInYears > 0 ? (totalHits / totalPapersInYears) * 100 : 0;
    });

    return {
      labels: researchAreas.map(area => area.name),
      datasets: [
        {
          label: 'Research Coverage',
          data,
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(59, 130, 246, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(59, 130, 246, 1)',
        },
      ],
    };
  }, [papers, papersPerYear]);

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  // Consensus vs disagreement heatmap (placeholder)
  const heatmapData = useMemo(() => {
    const topics = ['Bone Loss', 'Immune Suppression', 'Cardiovascular Changes', 'Cognitive Effects', 'Microbiome Shifts'];
    const decades = ['1990s', '2000s', '2010s', '2020s'];
    
    // Simulate variance data (placeholder)
    return {
      topics,
      decades,
      data: topics.map(() => 
        decades.map(() => Math.random() * 100) // Random variance values
      )
    };
  }, []);

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
        title="NASA BioExplorer - Research Insights" 
        description="AI-powered analysis and knowledge gap identification for NASA bioscience research"
      />
      <div className="p-6 space-y-8 starfield min-h-screen">
        {/* Header */}
        <PageHeader
          title="Research Insights"
          subtitle="AI-powered analysis and knowledge gap identification"
          breadcrumb={['NASA BioExplorer', 'Insights']}
        />

        {/* AI Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <SpaceCard
            title="AI Summary"
            icon={<Brain className="w-5 h-5 text-white" />}
            actions={
              <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30 rounded-full">
                Generated
              </span>
            }
          >
            <p className="text-gray-300 leading-relaxed mb-4">
              {aiSummary}
            </p>
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-xs text-blue-300">
                <strong>Note:</strong> This summary is generated using client-side heuristics. 
                In a production environment, this would be powered by a dedicated AI API for more sophisticated analysis.
              </p>
            </div>
          </SpaceCard>
        </motion.div>

        {/* Knowledge Gaps Radar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SpaceCard
            title="Knowledge Gaps Radar"
            subtitle="Research coverage across key bioscience domains (normalized by publication volume)"
            icon={<Target className="w-5 h-5 text-white" />}
          >
            <div className="h-80">
              <Radar data={radarData} options={spaceRadarOptions} />
            </div>
            <div className="mt-4 text-xs text-gray-400">
              Higher values indicate more research coverage in that area relative to overall publication volume.
            </div>
          </SpaceCard>
        </motion.div>

        {/* Consensus vs Disagreement Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <SpaceCard
            title="Research Consensus Analysis"
            subtitle="Variance in research findings across topics and time periods (placeholder visualization)"
            icon={<Target className="w-5 h-5 text-white" />}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-3 text-sm font-medium text-gray-400">
                      Topic
                    </th>
                    {heatmapData.decades.map(decade => (
                      <th key={decade} className="text-center py-2 px-3 text-sm font-medium text-gray-400">
                        {decade}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {heatmapData.topics.map((topic, topicIndex) => (
                    <tr key={topic} className="border-t border-space-border">
                      <td className="py-2 px-3 text-sm text-white">
                        {topic}
                      </td>
                      {heatmapData.data[topicIndex].map((variance, decadeIndex) => {
                        const intensity = Math.min(100, variance) / 100;
                        const bgColor = `rgba(239, 68, 68, ${intensity})`; // Red intensity
                        return (
                          <td key={decadeIndex} className="text-center py-2 px-3">
                            <div 
                              className="inline-block w-8 h-8 rounded text-xs flex items-center justify-center text-white font-medium"
                              style={{ backgroundColor: bgColor }}
                              title={`Variance: ${variance.toFixed(1)}%`}
                            >
                              {variance > 50 ? 'H' : 'L'}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-200 rounded"></div>
                <span>Low Variance (High Consensus)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-600 rounded"></div>
                <span>High Variance (Disagreement)</span>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-xs text-yellow-300">
                <strong>TODO:</strong> This heatmap is currently a placeholder. 
                A full implementation would analyze sentiment and consensus patterns across research findings using NLP techniques.
              </p>
            </div>
          </SpaceCard>
        </motion.div>

        {/* Key Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <SpaceCard className="p-4">
            <div className="text-2xl font-bold text-white">
              {papers.length.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">
              Total Publications
            </div>
          </SpaceCard>
          <SpaceCard className="p-4">
            <div className="text-2xl font-bold text-white">
              {kpis.yearsRange.max - kpis.yearsRange.min}
            </div>
            <div className="text-sm text-gray-400">
              Years of Research
            </div>
          </SpaceCard>
          <SpaceCard className="p-4">
            <div className="text-2xl font-bold text-white">
              {organismStats.mouse + organismStats.human + organismStats.plant + organismStats.drosophila + organismStats.microbe + organismStats.other}
            </div>
            <div className="text-sm text-gray-400">
              Organism Studies
            </div>
          </SpaceCard>
          <SpaceCard className="p-4">
            <div className="text-2xl font-bold text-white">
              {(papers.length / (kpis.yearsRange.max - kpis.yearsRange.min + 1)).toFixed(1)}
            </div>
            <div className="text-sm text-gray-400">
              Avg Papers/Year
            </div>
          </SpaceCard>
        </motion.div>
      <DataSourceFooter />
      </div>
    </>
  );
};

export default Insights;
