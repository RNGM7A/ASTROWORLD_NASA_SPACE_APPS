import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { SpaceCard } from '../space/SpaceCard';
import { Target, BookOpen, Tag, Lightbulb, GitBranch, Loader2, Filter, Eye, EyeOff, Network } from 'lucide-react';

interface DetailedPaper {
  title: string;
  summary: string;
  bullet: string[];
  year?: number;
  authors?: string[];
}

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: 'publication' | 'concept' | 'method' | 'finding' | 'exposure' | 'author';
  size: number;
  color: string;
  importance: number;
  fx?: number | null;
  fy?: number | null;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  type: 'mentions' | 'relates' | 'uses' | 'discovers' | 'exposes';
  strength: number;
  label?: string;
}

interface KnowledgeGraphProps {
  publication: DetailedPaper;
  className?: string;
}

export const IndividualKnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ 
  publication, 
  className = '' 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [graphData, setGraphData] = useState<{ nodes: GraphNode[]; links: GraphLink[] } | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    showConcepts: true,
    showMethods: true,
    showFindings: true,
    showExposures: true,
    showAuthors: true
  });

  // Color scheme for different node types
  const nodeColors = {
    publication: '#3b82f6',
    concept: '#10b981',
    method: '#f59e0b',
    finding: '#ef4444',
    exposure: '#8b5cf6',
    author: '#06b6d4'
  };

  // Extract and categorize concepts
  const extractConcepts = useCallback((text: string): { concepts: string[]; methods: string[]; findings: string[]; exposures: string[] } => {
    const concepts: string[] = [];
    const methods: string[] = [];
    const findings: string[] = [];
    const exposures: string[] = [];

    const textLower = text.toLowerCase();

    // Scientific concepts
    const conceptPatterns = [
      /\b(microgravity|spaceflight|radiation|stress|metabolism|immune|cardiovascular|neural|cellular|bone|muscle)\b/g,
      /\b(adaptation|response|mechanism|pathway|regulation|expression|function|structure)\b/g,
      /\b(protein|gene|dna|rna|enzyme|hormone|cytokine|receptor|molecule)\b/g
    ];

    // Research methods
    const methodPatterns = [
      /\b(experiment|study|analysis|measurement|assessment|evaluation|testing|observation)\b/g,
      /\b(clinical|laboratory|field|simulation|modeling|statistical|computational)\b/g,
      /\b(imaging|spectroscopy|chromatography|microscopy|sequencing|pcr|elisa)\b/g
    ];

    // Research findings
    const findingPatterns = [
      /\b(increased|decreased|enhanced|reduced|improved|altered|modified|changed)\b/g,
      /\b(significant|significant|correlation|association|relationship|effect|impact)\b/g,
      /\b(result|outcome|conclusion|finding|discovery|evidence|data|result)\b/g
    ];

    // Environmental exposures
    const exposurePatterns = [
      /\b(radiation|microgravity|stress|temperature|pressure|oxygen|carbon dioxide)\b/g,
      /\b(space|environment|conditions|factors|exposure|dose|duration|intensity)\b/g,
      /\b(cosmic|solar|galactic|particle|electromagnetic|ionizing|non-ionizing)\b/g
    ];

    // Extract concepts
    conceptPatterns.forEach(pattern => {
      const matches = textLower.match(pattern);
      if (matches) concepts.push(...matches);
    });

    // Extract methods
    methodPatterns.forEach(pattern => {
      const matches = textLower.match(pattern);
      if (matches) methods.push(...matches);
    });

    // Extract findings
    findingPatterns.forEach(pattern => {
      const matches = textLower.match(pattern);
      if (matches) findings.push(...matches);
    });

    // Extract exposures
    exposurePatterns.forEach(pattern => {
      const matches = textLower.match(pattern);
      if (matches) exposures.push(...matches);
    });

    return {
      concepts: [...new Set(concepts)].filter(c => c.length > 3),
      methods: [...new Set(methods)].filter(m => m.length > 3),
      findings: [...new Set(findings)].filter(f => f.length > 3),
      exposures: [...new Set(exposures)].filter(e => e.length > 3)
    };
  }, []);

  // Generate graph data
  const generateGraphData = useCallback(() => {
    if (!publication) return null;

    setIsLoading(true);
    setError(null);

    try {
      const nodes: GraphNode[] = [];
      const links: GraphLink[] = [];
      const nodeMap = new Map<string, GraphNode>();

      // Create main publication node
      const pubId = 'main_publication';
      const pubNode: GraphNode = {
        id: pubId,
        label: 'Research Paper',
        type: 'publication',
        size: 25,
        color: nodeColors.publication,
        importance: 10,
        fx: 450,
        fy: 300
      };
      nodes.push(pubNode);
      nodeMap.set(pubId, pubNode);

      // Extract and categorize content
      const allText = `${publication.summary} ${publication.bullet.join(' ')}`;
      const extracted = extractConcepts(allText);

      // Add concept nodes
      if (filters.showConcepts) {
        extracted.concepts.forEach((concept, index) => {
          const conceptId = `concept_${concept}`;
          if (!nodeMap.has(conceptId)) {
            const conceptNode: GraphNode = {
              id: conceptId,
              label: concept,
              type: 'concept',
              size: 12,
              color: nodeColors.concept,
              importance: 5
            };
            nodes.push(conceptNode);
            nodeMap.set(conceptId, conceptNode);

            links.push({
              source: pubId,
              target: conceptId,
              type: 'mentions',
              strength: 0.8,
              label: 'mentions'
            });
          }
        });
      }

      // Add method nodes
      if (filters.showMethods) {
        extracted.methods.forEach((method, index) => {
          const methodId = `method_${method}`;
          if (!nodeMap.has(methodId)) {
            const methodNode: GraphNode = {
              id: methodId,
              label: method,
              type: 'method',
              size: 10,
              color: nodeColors.method,
              importance: 4
            };
            nodes.push(methodNode);
            nodeMap.set(methodId, methodNode);

            links.push({
              source: pubId,
              target: methodId,
              type: 'uses',
              strength: 0.7,
              label: 'uses'
            });
          }
        });
      }

      // Add finding nodes
      if (filters.showFindings) {
        extracted.findings.forEach((finding, index) => {
          const findingId = `finding_${finding}`;
          if (!nodeMap.has(findingId)) {
            const findingNode: GraphNode = {
              id: findingId,
              label: finding,
              type: 'finding',
              size: 10,
              color: nodeColors.finding,
              importance: 6
            };
            nodes.push(findingNode);
            nodeMap.set(findingId, findingNode);

            links.push({
              source: pubId,
              target: findingId,
              type: 'discovers',
              strength: 0.9,
              label: 'discovers'
            });
          }
        });
      }

      // Add exposure nodes
      if (filters.showExposures) {
        extracted.exposures.forEach((exposure, index) => {
          const exposureId = `exposure_${exposure}`;
          if (!nodeMap.has(exposureId)) {
            const exposureNode: GraphNode = {
              id: exposureId,
              label: exposure,
              type: 'exposure',
              size: 10,
              color: nodeColors.exposure,
              importance: 5
            };
            nodes.push(exposureNode);
            nodeMap.set(exposureId, exposureNode);

            links.push({
              source: pubId,
              target: exposureId,
              type: 'exposes',
              strength: 0.6,
              label: 'exposes'
            });
          }
        });
      }

      // Add author nodes if available
      if (filters.showAuthors && publication.authors && publication.authors.length > 0) {
        publication.authors.slice(0, 5).forEach((author, index) => {
          const authorId = `author_${author}`;
          const authorNode: GraphNode = {
            id: authorId,
            label: author,
            type: 'author',
            size: 8,
            color: nodeColors.author,
            importance: 3
          };
          nodes.push(authorNode);
          nodeMap.set(authorId, authorNode);

          links.push({
            source: pubId,
            target: authorId,
            type: 'relates',
            strength: 0.5,
            label: 'authored by'
          });
        });
      }

      return { nodes, links };
    } catch (error) {
      setError(`Failed to generate graph: ${error}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [publication, filters, extractConcepts]);

  // Generate graph when component mounts or filters change
  useEffect(() => {
    const data = generateGraphData();
    if (data) {
      setGraphData(data);
    }
  }, [generateGraphData]);

  // Render the graph
  useEffect(() => {
    if (!graphData || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 1000;
    const height = 700;
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };

    svg.attr("width", width).attr("height", height);

    // Add subtle grid
    const gridSize = 50;
    const gridGroup = svg.append("g").attr("class", "grid");
    
    for (let x = 0; x <= width; x += gridSize) {
      gridGroup.append("line")
        .attr("x1", x).attr("y1", 0)
        .attr("x2", x).attr("y2", height)
        .attr("stroke", "#374151")
        .attr("stroke-width", 0.5)
        .attr("opacity", 0.3);
    }
    
    for (let y = 0; y <= height; y += gridSize) {
      gridGroup.append("line")
        .attr("x1", 0).attr("y1", y)
        .attr("x2", width).attr("y2", y)
        .attr("stroke", "#374151")
        .attr("stroke-width", 0.5)
        .attr("opacity", 0.3);
    }

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Create force simulation
    const simulation = d3.forceSimulation(graphData.nodes)
      .force("link", d3.forceLink(graphData.links).id((d: any) => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));

    // Create curved links
    const link = g.append("g")
      .selectAll("path")
      .data(graphData.links)
      .enter().append("path")
      .attr("stroke", (d: any) => {
        if (d.type === 'mentions') return '#10b981';
        if (d.type === 'uses') return '#f59e0b';
        if (d.type === 'discovers') return '#ef4444';
        if (d.type === 'exposes') return '#8b5cf6';
        return '#6b7280';
      })
      .attr("stroke-width", (d: any) => Math.max(2, d.strength * 4))
      .attr("stroke-opacity", 0.6)
      .attr("fill", "none")
      .attr("stroke-dasharray", (d: any) => d.type === 'relates' ? "5,5" : "none");

    // Create nodes
    const node = g.append("g")
      .selectAll("circle")
      .data(graphData.nodes)
      .enter().append("circle")
      .attr("r", (d: any) => d.size)
      .attr("fill", (d: any) => d.color)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 3)
      .style("cursor", "pointer")
      .style("filter", "drop-shadow(0 4px 8px rgba(0,0,0,0.3))")
      .call(d3.drag<SVGCircleElement, GraphNode>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .on("click", (event, d) => {
        setSelectedNode(d);
      })
      .on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", (d: any) => d.size * 1.2)
          .attr("stroke-width", 4);
      })
      .on("mouseout", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", (d: any) => d.size)
          .attr("stroke-width", 3);
      });

    // Create labels
    const labels = g.append("g")
      .selectAll("text")
      .data(graphData.nodes)
      .enter().append("text")
      .text((d: any) => d.label)
      .attr("font-size", (d: any) => d.type === 'publication' ? "16px" : "12px")
      .attr("font-family", "Arial, sans-serif")
      .attr("font-weight", (d: any) => d.type === 'publication' ? "bold" : "normal")
      .attr("fill", "#ffffff")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("pointer-events", "none")
      .style("user-select", "none")
      .style("text-shadow", "2px 2px 4px rgba(0,0,0,0.8)");

    // Create edge labels
    const edgeLabels = g.append("g")
      .selectAll("text")
      .data(graphData.links.filter((d: any) => d.label))
      .enter().append("text")
      .text((d: any) => d.label)
      .attr("font-size", "10px")
      .attr("font-family", "Arial, sans-serif")
      .attr("fill", "#9ca3af")
      .attr("text-anchor", "middle")
      .style("pointer-events", "none")
      .style("user-select", "none");

    // Update positions on simulation tick
    simulation.on("tick", () => {
      // Update curved links
      link.attr("d", (d: any) => {
        const source = d.source;
        const target = d.target;
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dr = Math.sqrt(dx * dx + dy * dy) * 0.3;
        return `M${source.x},${source.y}A${dr},${dr} 0 0,1 ${target.x},${target.y}`;
      });

      // Update nodes
      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);

      // Update labels
      labels
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y);

      // Update edge labels
      edgeLabels
        .attr("x", (d: any) => (d.source.x + d.target.x) / 2)
        .attr("y", (d: any) => (d.source.y + d.target.y) / 2);
    });

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

  }, [graphData]);

  const handleFilterChange = (filterType: string, value: boolean) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  if (isLoading) {
    return (
      <SpaceCard title="Knowledge Graph" icon={<Network className="w-5 h-5 text-white" />}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-white text-lg">Generating knowledge graph...</p>
          </div>
        </div>
      </SpaceCard>
    );
  }

  if (error) {
    return (
      <SpaceCard title="Knowledge Graph" icon={<Network className="w-5 h-5 text-white" />}>
        <div className="flex items-center justify-center h-64">
          <p className="text-red-400 text-lg">{error}</p>
        </div>
      </SpaceCard>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <SpaceCard title="Interactive Knowledge Graph" icon={<Network className="w-5 h-5 text-white" />}>
        <div className="space-y-6">
          {/* Filter Controls */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Node Filters
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(filters).map(([key, value]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handleFilterChange(key, e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-300 capitalize">
                    {key.replace('show', '').toLowerCase()}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Graph Visualization */}
          {graphData && (
            <div className="bg-gray-900 rounded-lg p-4 overflow-hidden">
              <svg
                ref={svgRef}
                className="w-full h-[700px] border border-gray-700 rounded"
                style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
              />
            </div>
          )}

          {/* Legend */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {Object.entries(nodeColors).map(([type, color]) => (
              <div key={type} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: color }}
                />
                <span className="text-gray-300 capitalize">{type}</span>
              </div>
            ))}
          </div>

          {/* Selected Node Info */}
          {selectedNode && (
            <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-blue-400 font-semibold mb-2">Selected Node</h4>
              <p className="text-white"><strong>Label:</strong> {selectedNode.label}</p>
              <p className="text-white"><strong>Type:</strong> {selectedNode.type}</p>
              <p className="text-white"><strong>Importance:</strong> {selectedNode.importance}/10</p>
            </div>
          )}
        </div>
      </SpaceCard>
    </motion.div>
  );
};