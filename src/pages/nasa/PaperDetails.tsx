import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Copy, Download, FileText, Calendar, Users, Tag, Play, Pause } from 'lucide-react';
import { SpaceCard } from '../../components/space/SpaceCard';
import { PageHeader } from '../../components/space/PageHeader';
import { IndividualKnowledgeGraph } from '../../components/nasa/IndividualKnowledgeGraph';
import PageMeta from '../../components/common/PageMeta';
import ChatBot from '../../components/chat/ChatBot';

interface DetailedPaper {
  title: string;
  summary: string;
  bullet: string[];
}

const PaperDetails: React.FC = () => {
  const { paperId } = useParams<{ paperId: string }>();
  const navigate = useNavigate();
  const [detailedPaper, setDetailedPaper] = useState<DetailedPaper | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Speech functions
  const startSpeaking = () => {
    if (!detailedPaper?.summary) return;
    
    // Stop any current speech
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(detailedPaper.summary);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    
    speechSynthesis.speak(utterance);
  };

  const togglePause = () => {
    if (isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
    } else {
      speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  useEffect(() => {
    const loadDetailedPaper = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/nasa_pubs_long_summary_bullet_updated.json');
        if (!response.ok) {
          throw new Error('Failed to load detailed paper data');
        }
        const data: DetailedPaper[] = await response.json();
        
        // Find the paper by index (paperId is the index in the array)
        const index = parseInt(paperId || '0', 10);
        if (index >= 0 && index < data.length) {
          setDetailedPaper(data[index]);
        } else {
          setError('Paper not found');
        }
      } catch (err) {
        setError('Failed to load paper details');
        console.error('Error loading detailed paper:', err);
      } finally {
        setLoading(false);
      }
    };

    if (paperId) {
      loadDetailedPaper();
    }
  }, [paperId]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadPaper = () => {
    if (!detailedPaper) return;
    
    const content = `Title: ${detailedPaper.title}\n\nSummary:\n${detailedPaper.summary}\n\nKey Points:\n${detailedPaper.bullet.map(point => `• ${point}`).join('\n')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${detailedPaper.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-8 starfield min-h-screen">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading paper details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !detailedPaper) {
    return (
      <div className="p-6 space-y-8 starfield min-h-screen">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-white mb-2">Error</h3>
            <p className="text-gray-400 mb-4">{error || 'Paper not found'}</p>
            <button
              onClick={() => navigate('/nasa/explorer')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Explorer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta 
        title={`${detailedPaper.title} - NASA BioExplorer`} 
        description={detailedPaper.summary.substring(0, 160) + '...'}
      />
      <div className="p-6 space-y-8 starfield min-h-screen">
        {/* Header */}
        <PageHeader
          title="Paper Details"
          subtitle="Comprehensive analysis and detailed information"
          breadcrumb={['NASA BioExplorer', 'Explorer', 'Details']}
          actions={
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(detailedPaper.title)}
                className="flex items-center gap-2 px-3 py-2 bg-space-card border border-space-border rounded-lg text-white hover:glow transition-all duration-300"
              >
                <Copy className="w-4 h-4" />
                Copy Title
              </button>
              <button
                onClick={downloadPaper}
                className="flex items-center gap-2 px-3 py-2 bg-space-card border border-space-border rounded-lg text-white hover:glow transition-all duration-300"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={() => navigate('/nasa/explorer')}
                className="flex items-center gap-2 px-3 py-2 bg-space-card border border-space-border rounded-lg text-white hover:glow transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Explorer
              </button>
            </div>
          }
        />

        {/* Paper Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SpaceCard>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-2">
                  {detailedPaper.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>NASA Research Publication</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>Scientific Research</span>
                  </div>
                </div>
              </div>
            </div>
          </SpaceCard>
        </motion.div>

        {/* Summary Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <SpaceCard
            title="Research Summary"
            icon={<FileText className="w-5 h-5 text-white" />}
            actions={
              <div className="flex items-center gap-2">
                {!isSpeaking ? (
                  <button
                    onClick={startSpeaking}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors"
                    title="Read aloud"
                  >
                    <Play className="w-3 h-3" />
                    Read Aloud
                  </button>
                ) : (
                  <>
                    <button
                      onClick={togglePause}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/30 transition-colors"
                      title={isPaused ? "Resume" : "Pause"}
                    >
                      {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                      {isPaused ? "Resume" : "Pause"}
                    </button>
                    <button
                      onClick={stopSpeaking}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                      title="Stop"
                    >
                      Stop
                    </button>
                  </>
                )}
              </div>
            }
          >
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {detailedPaper.summary}
              </p>
            </div>
          </SpaceCard>
        </motion.div>

        {/* Key Points Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SpaceCard
            title="Key Research Points"
            icon={<Tag className="w-5 h-5 text-white" />}
          >
            <div className="space-y-3">
              {detailedPaper.bullet.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    {point}
                  </p>
                </motion.div>
              ))}
            </div>
          </SpaceCard>
        </motion.div>


        {/* Individual Knowledge Graph Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <IndividualKnowledgeGraph 
            publication={detailedPaper} 
            className="w-full"
          />
        </motion.div>

        {/* ChatBot */}
        {detailedPaper && (
          <ChatBot
            paperTitle={detailedPaper.title}
            paperSummary={detailedPaper.summary}
          />
        )}
      </div>
    </>
  );
};

export default PaperDetails;
