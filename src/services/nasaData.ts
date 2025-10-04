export interface Paper {
  title: string;
  authors: string[];
  year: number | null;
  summary: string;
  link: string;
}

export interface NasaIndexes {
  byYear: Map<number, Paper[]>;
  byKeyword: Map<string, Paper[]>;
  byOrganism: Map<string, Paper[]>;
}

export interface KpiData {
  totalPapers: number;
  yearsRange: { min: number; max: number };
  organismsCount: number;
  medianYear: number;
}

export interface OrganismStats {
  mouse: number;
  human: number;
  plant: number;
  drosophila: number;
  microbe: number;
  other: number;
}

// Stop words to filter out from keyword indexing
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after',
  'above', 'below', 'between', 'among', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
  'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'
]);

// Organism keywords for classification
export const ORGANISM_KEYWORDS = {
  mouse: ['mouse', 'mice', 'murine', 'rodent'],
  human: ['human', 'humanity', 'patient', 'clinical', 'humans'],
  plant: ['plant', 'arabidopsis', 'seedling', 'vegetation', 'botanical'],
  drosophila: ['drosophila', 'fruit fly', 'flies'],
  microbe: ['bacteria', 'microbe', 'microbial', 'fungal', 'virus', 'pathogen', 'microbiome']
};

/**
 * Loads NASA papers from the data file
 */
export async function loadNasaPapers(): Promise<Paper[]> {
  try {
    console.log('Fetching NASA data from /data/nasa_bioscience.json');
    const response = await fetch('/data/nasa_bioscience.json');
    console.log('Response status:', response.status, response.statusText);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    
    const rawData = await response.json();
    
    // Transform and validate data
    const papers: Paper[] = rawData.map((item: any) => ({
      title: item.title || 'Untitled',
      authors: Array.isArray(item.authors) ? item.authors : [],
      year: coerceYear(item.year),
      summary: item.summary || '',
      link: item.link || ''
    }));

    // Deduplicate by title
    const seen = new Set<string>();
    const uniquePapers = papers.filter(paper => {
      const key = paper.title.toLowerCase().trim();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });

    return uniquePapers;
  } catch (error) {
    console.error('Error loading NASA papers:', error);
    throw error;
  }
}

/**
 * Coerces year to number or null
 */
function coerceYear(year: any): number | null {
  if (typeof year === 'number' && !isNaN(year)) {
    return year;
  }
  if (typeof year === 'string') {
    const parsed = parseInt(year, 10);
    if (!isNaN(parsed)) {
      return parsed;
    }
  }
  return null;
}

/**
 * Builds search indexes for papers
 */
export function buildIndex(papers: Paper[]): NasaIndexes {
  const byYear = new Map<number, Paper[]>();
  const byKeyword = new Map<string, Paper[]>();
  const byOrganism = new Map<string, Paper[]>();

  papers.forEach(paper => {
    // Index by year
    if (paper.year !== null) {
      if (!byYear.has(paper.year)) {
        byYear.set(paper.year, []);
      }
      byYear.get(paper.year)!.push(paper);
    }

    // Index by keywords (title + summary)
    const text = `${paper.title} ${paper.summary}`.toLowerCase();
    const words = text.split(/\s+/).filter(word => 
      word.length > 2 && !STOP_WORDS.has(word)
    );
    
    words.forEach(word => {
      if (!byKeyword.has(word)) {
        byKeyword.set(word, []);
      }
      byKeyword.get(word)!.push(paper);
    });

    // Index by organism
    const textLower = text.toLowerCase();
    Object.entries(ORGANISM_KEYWORDS).forEach(([organism, keywords]) => {
      if (keywords.some(keyword => textLower.includes(keyword))) {
        if (!byOrganism.has(organism)) {
          byOrganism.set(organism, []);
        }
        byOrganism.get(organism)!.push(paper);
      }
    });
  });

  return { byYear, byKeyword, byOrganism };
}

/**
 * Gets KPI data from papers
 */
export function getKpis(papers: Paper[]): KpiData {
  const years = papers
    .map(p => p.year)
    .filter((year): year is number => year !== null)
    .sort((a, b) => a - b);

  const totalPapers = papers.length;
  const yearsRange = years.length > 0 
    ? { min: years[0], max: years[years.length - 1] }
    : { min: 0, max: 0 };
  
  const medianYear = years.length > 0 
    ? years[Math.floor(years.length / 2)]
    : 0;

  const { byOrganism } = buildIndex(papers);
  const organismsCount = byOrganism.size;

  return {
    totalPapers,
    yearsRange,
    organismsCount,
    medianYear
  };
}

/**
 * Gets organism statistics
 */
export function getOrganismStats(papers: Paper[]): OrganismStats {
  const { byOrganism } = buildIndex(papers);
  
  return {
    mouse: byOrganism.get('mouse')?.length || 0,
    human: byOrganism.get('human')?.length || 0,
    plant: byOrganism.get('plant')?.length || 0,
    drosophila: byOrganism.get('drosophila')?.length || 0,
    microbe: byOrganism.get('microbe')?.length || 0,
    other: papers.length - Object.values({
      mouse: byOrganism.get('mouse')?.length || 0,
      human: byOrganism.get('human')?.length || 0,
      plant: byOrganism.get('plant')?.length || 0,
      drosophila: byOrganism.get('drosophila')?.length || 0,
      microbe: byOrganism.get('microbe')?.length || 0,
    }).reduce((sum, count) => sum + count, 0)
  };
}

/**
 * Search papers by query
 */
export function searchPapers(papers: Paper[], query: string): Paper[] {
  if (!query.trim()) return papers;
  
  const { byKeyword } = buildIndex(papers);
  const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
  
  if (searchTerms.length === 0) return papers;
  
  // Find papers that match any of the search terms
  const matchingPapers = new Set<Paper>();
  
  searchTerms.forEach(term => {
    // Exact match
    if (byKeyword.has(term)) {
      byKeyword.get(term)!.forEach(paper => matchingPapers.add(paper));
    }
    
    // Partial match
    byKeyword.forEach((papers, keyword) => {
      if (keyword.includes(term)) {
        papers.forEach(paper => matchingPapers.add(paper));
      }
    });
  });
  
  return Array.from(matchingPapers);
}

/**
 * Filter papers by organism
 */
export function filterByOrganism(papers: Paper[], organisms: string[]): Paper[] {
  if (organisms.length === 0) return papers;
  
  const { byOrganism } = buildIndex(papers);
  const matchingPapers = new Set<Paper>();
  
  organisms.forEach(organism => {
    if (byOrganism.has(organism)) {
      byOrganism.get(organism)!.forEach(paper => matchingPapers.add(paper));
    }
  });
  
  return Array.from(matchingPapers);
}

/**
 * Filter papers by year range
 */
export function filterByYearRange(papers: Paper[], minYear: number, maxYear: number): Paper[] {
  return papers.filter(paper => {
    if (paper.year === null) return false;
    return paper.year >= minYear && paper.year <= maxYear;
  });
}

/**
 * Get papers per year data for charts
 */
export function getPapersPerYear(papers: Paper[]): { year: number; count: number }[] {
  const { byYear } = buildIndex(papers);
  const years = Array.from(byYear.keys()).sort((a, b) => a - b);
  
  return years.map(year => ({
    year,
    count: byYear.get(year)!.length
  }));
}

/**
 * Get papers per year by organism for stacked charts
 */
export function getPapersPerYearByOrganism(papers: Paper[]): Record<string, { year: number; count: number }[]> {
  const { byYear } = buildIndex(papers);
  const years = Array.from(byYear.keys()).sort((a, b) => a - b);
  const result: Record<string, { year: number; count: number }[]> = {};
  
  Object.keys(ORGANISM_KEYWORDS).forEach(organism => {
    result[organism] = years.map(year => ({
      year,
      count: byYear.get(year)!.filter(paper => {
        const text = `${paper.title} ${paper.summary}`.toLowerCase();
        return ORGANISM_KEYWORDS[organism as keyof typeof ORGANISM_KEYWORDS].some(
          keyword => text.includes(keyword)
        );
      }).length
    }));
  });
  
  // Add "other" category
  result.other = years.map(year => ({
    year,
    count: byYear.get(year)!.filter(paper => {
      const text = `${paper.title} ${paper.summary}`.toLowerCase();
      return !Object.values(ORGANISM_KEYWORDS).flat().some(keyword => text.includes(keyword));
    }).length
  }));
  
  return result;
}

/**
 * Calculate relevance score for papers based on keywords
 */
export function calculateRelevanceScore(paper: Paper, keywords: string[]): number {
  const text = `${paper.title} ${paper.summary}`.toLowerCase();
  let score = 0;
  
  keywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase();
    // Title matches get higher score
    if (paper.title.toLowerCase().includes(keywordLower)) {
      score += 3;
    }
    // Summary matches get lower score
    if (text.includes(keywordLower)) {
      score += 1;
    }
  });
  
  return score;
}

/**
 * Get top papers by relevance
 */
export function getTopPapersByRelevance(papers: Paper[], keywords: string[], limit: number = 10): Paper[] {
  return papers
    .map(paper => ({
      paper,
      score: calculateRelevanceScore(paper, keywords)
    }))
    .sort((a, b) => b.score - a.score)
    .filter(item => item.score > 0)
    .slice(0, limit)
    .map(item => item.paper);
}
