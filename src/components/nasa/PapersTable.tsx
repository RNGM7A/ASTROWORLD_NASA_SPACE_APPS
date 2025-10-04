import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Paper, getOrganismStats, ORGANISM_KEYWORDS } from '../../services/nasaData';

interface PapersTableProps {
  papers: Paper[];
  onPageChange?: (page: number) => void;
  currentPage?: number;
  pageSize?: number;
  className?: string;
}

export const PapersTable: React.FC<PapersTableProps> = ({
  papers,
  onPageChange,
  currentPage = 1,
  pageSize = 20,
  className = ''
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  const getOrganismTags = (paper: Paper): string[] => {
    const text = `${paper.title} ${paper.summary}`.toLowerCase();
    const tags: string[] = [];
    
    Object.entries(ORGANISM_KEYWORDS).forEach(([organism, keywords]) => {
      if (keywords.some(keyword => text.includes(keyword))) {
        tags.push(organism);
      }
    });
    
    return tags;
  };

  const toggleRow = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const copyCitation = (paper: Paper) => {
    const citation = `${paper.authors.join(', ')} (${paper.year || 'Unknown'}). ${paper.title}.`;
    navigator.clipboard.writeText(citation);
  };


  const paginatedPapers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return papers.slice(startIndex, endIndex);
  }, [papers, currentPage, pageSize]);

  const totalPages = Math.ceil(papers.length / pageSize);

  if (papers.length === 0) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 ${className}`}>
        <div className="text-center">
          <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📄</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No papers found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Organisms
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Authors
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedPapers.map((paper, index) => {
              const globalIndex = (currentPage - 1) * pageSize + index;
              const isExpanded = expandedRows.has(globalIndex);
              const organismTags = getOrganismTags(paper);
              
              return (
                <React.Fragment key={`${paper.title}-${index}`}>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white max-w-md">
                        {paper.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {paper.year || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {organismTags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          >
                            {tag}
                          </span>
                        ))}
                        {organismTags.length > 2 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            +{organismTags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {paper.authors.length}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleRow(globalIndex)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {isExpanded ? 'Hide' : 'View'}
                        </button>
                        <button
                          onClick={() => navigate(`/nasa/details/${globalIndex}`)}
                          className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                        >
                          More Details
                        </button>
                        {paper.link && (
                          <a
                            href={paper.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          >
                            Link
                          </a>
                        )}
                        <button
                          onClick={() => navigate('/nasa/simulator')}
                          className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300 font-medium"
                        >
                          Simulate Exp
                        </button>
                      </div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                              Summary
                            </h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {paper.summary || 'No summary available.'}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                              Authors
                            </h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {paper.authors.join(', ')}
                            </p>
                          </div>
                          {organismTags.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                Organism Tags
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {organismTags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <button
                              onClick={() => copyCitation(paper)}
                              className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
                            >
                              Copy Citation
                            </button>
                            {paper.link && (
                              <a
                                href={paper.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 text-xs font-medium text-green-600 bg-green-100 rounded-md hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
                              >
                                View Paper
                              </a>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing{' '}
                <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span>
                {' '}to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * pageSize, papers.length)}
                </span>
                {' '}of{' '}
                <span className="font-medium">{papers.length}</span>
                {' '}results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  if (pageNum > totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange?.(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pageNum === currentPage
                          ? 'z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-300'
                          : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
