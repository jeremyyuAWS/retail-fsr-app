import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { hexbin } from 'd3-hexbin';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ArrowUpRight, ArrowDownRight, Filter, Clock, Map, Layers } from 'lucide-react';

interface Point {
  x: number;
  y: number;
  value: number;
  timestamp: Date;
}

interface Fixture {
  x: number;
  y: number;
  label: string;
  traffic: number;
  trend: 'up' | 'down';
  percentage: string;
  category: string;
  sales: number;
  conversion: number;
}

interface StoreHeatmapProps {
  width?: number;
  height?: number;
}

export const StoreHeatmap: React.FC<StoreHeatmapProps> = ({ 
  width = 600, 
  height = 400 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedFixture, setSelectedFixture] = useState<Fixture | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState<'traffic' | 'sales' | 'conversion'>('traffic');
  const [timeRange, setTimeRange] = useState<'1h' | '4h' | '24h'>('1h');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Electronics', 'Clothing', 'Home'];

  // Generate fixtures with more detailed data
  const fixtures: Fixture[] = [
    { 
      x: width * 0.2, 
      y: height * 0.3, 
      label: "Electronics",
      traffic: 245,
      trend: 'up',
      percentage: '+12%',
      category: 'Electronics',
      sales: 12500,
      conversion: 0.15
    },
    { 
      x: width * 0.5, 
      y: height * 0.6, 
      label: "Clothing",
      traffic: 189,
      trend: 'down',
      percentage: '-5%',
      category: 'Clothing',
      sales: 8900,
      conversion: 0.12
    },
    { 
      x: width * 0.8, 
      y: height * 0.4, 
      label: "Home",
      traffic: 167,
      trend: 'up',
      percentage: '+8%',
      category: 'Home',
      sales: 15600,
      conversion: 0.18
    }
  ];

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const filteredFixtures = selectedCategory === 'all' 
      ? fixtures 
      : fixtures.filter(f => f.category === selectedCategory);

    const points: Point[] = [];
    
    // Generate points with higher density around fixtures
    filteredFixtures.forEach(fixture => {
      for (let i = 0; i < 50; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 100;
        points.push({
          x: fixture.x + Math.cos(angle) * radius,
          y: fixture.y + Math.sin(angle) * radius,
          value: Math.random() * 100,
          timestamp: new Date(Date.now() - Math.random() * 3600000)
        });
      }
    });

    // Add some random points throughout the store
    for (let i = 0; i < 50; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        value: Math.random() * 100,
        timestamp: new Date(Date.now() - Math.random() * 3600000)
      });
    }

    // Create hexbin generator
    const hexbinGenerator = hexbin()
      .radius(30)
      .extent([[0, 0], [width, height]]);

    // Group points into hexbins
    const bins = hexbinGenerator(points.map(d => [d.x, d.y]));

    // Color scale based on view mode
    const getColorScale = () => {
      switch (viewMode) {
        case 'sales':
          return d3.scaleSequential(d3.interpolateReds);
        case 'conversion':
          return d3.scaleSequential(d3.interpolateGreens);
        default:
          return d3.scaleSequential(d3.interpolateYlOrRd);
      }
    };

    const colorScale = getColorScale()
      .domain([0, d3.max(bins, (d: any) => d.length) || 0]);

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    // Add gradient definitions
    const defs = svg.append("defs");
    
    // Radial gradient for fixtures
    filteredFixtures.forEach((fixture, i) => {
      const gradient = defs.append("radialGradient")
        .attr("id", `fixture-glow-${i}`)
        .attr("cx", "50%")
        .attr("cy", "50%")
        .attr("r", "50%");

      gradient.append("stop")
        .attr("offset", "0%")
        .attr("style", "stop-color: rgb(59, 130, 246); stop-opacity: 0.3");

      gradient.append("stop")
        .attr("offset", "100%")
        .attr("style", "stop-color: rgb(59, 130, 246); stop-opacity: 0");
    });

    // Add hexagons with animation
    const hexagons = svg.append("g")
      .selectAll("path")
      .data(bins)
      .join("path")
      .attr("d", (d: any) => `M${d.x},${d.y}${hexbinGenerator.hexagon()}`)
      .attr("fill", (d: any) => colorScale(d.length))
      .attr("stroke", "rgba(255,255,255,0.2)")
      .attr("stroke-width", "1px")
      .style("opacity", 0)
      .transition()
      .duration(1000)
      .style("opacity", 1);

    // Add fixture markers
    const fixtureGroups = svg.selectAll(".fixture")
      .data(filteredFixtures)
      .join("g")
      .attr("class", "fixture")
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        setSelectedFixture(d);
        setTooltipPosition({ 
          x: event.clientX, 
          y: event.clientY 
        });
      });

    // Add fixture glow
    fixtureGroups.append("circle")
      .attr("r", 40)
      .attr("fill", (_, i) => `url(#fixture-glow-${i})`);

    // Add fixture points
    fixtureGroups.append("circle")
      .attr("r", 6)
      .attr("fill", "rgb(59, 130, 246)")
      .attr("stroke", "white")
      .attr("stroke-width", 2);

    // Add fixture labels
    fixtureGroups.append("text")
      .attr("text-anchor", "middle")
      .attr("y", -20)
      .attr("fill", "white")
      .attr("font-size", "12px")
      .text(d => d.label);

  }, [width, height, viewMode, selectedCategory]);

  const getMetricValue = (fixture: Fixture) => {
    switch (viewMode) {
      case 'sales':
        return `$${fixture.sales.toLocaleString()}`;
      case 'conversion':
        return `${(fixture.conversion * 100).toFixed(1)}%`;
      default:
        return `${fixture.traffic} visitors`;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Map className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold">Store Traffic Heatmap</h3>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-400">Last updated:</span>
          <span className="text-blue-400">Just now</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gray-900/50 rounded-lg p-2 border border-gray-700">
            <Clock className="w-4 h-4 text-gray-400" />
            <div className="flex space-x-1">
              {['1h', '4h', '24h'].map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range as any)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    timeRange === range
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-gray-900/50 rounded-lg p-2 border border-gray-700">
            <Layers className="w-4 h-4 text-gray-400" />
            <div className="flex space-x-1">
              {['traffic', 'sales', 'conversion'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as any)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    viewMode === mode
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-900/50 text-sm rounded-lg border border-gray-700 px-3 py-1.5 text-gray-400 focus:outline-none focus:border-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="relative bg-gray-900/50 rounded-xl p-4 border border-gray-700">
        <svg
          ref={svgRef}
          style={{ width: '100%', height: '100%', minHeight: '400px' }}
          className="overflow-visible"
        />

        <AnimatePresence>
          {selectedFixture && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-4 right-4 w-64 bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">{selectedFixture.label}</h4>
                <button
                  onClick={() => setSelectedFixture(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Current {viewMode}</span>
                  <span className="font-medium">{getMetricValue(selectedFixture)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Trend</span>
                  <div className="flex items-center space-x-1">
                    {selectedFixture.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4 text-green-400" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-400" />
                    )}
                    <span className={selectedFixture.trend === 'up' ? 'text-green-400' : 'text-red-400'}>
                      {selectedFixture.percentage}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-700">
                  <div className="text-sm text-gray-400">Quick Stats</div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-gray-900/50 rounded p-2">
                      <div className="text-xs text-gray-500">Sales</div>
                      <div className="font-medium">${selectedFixture.sales.toLocaleString()}</div>
                    </div>
                    <div className="bg-gray-900/50 rounded p-2">
                      <div className="text-xs text-gray-500">Conversion</div>
                      <div className="font-medium">{(selectedFixture.conversion * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {['Low', 'Medium', 'High'].map((level, index) => (
          <div
            key={level}
            className="flex items-center space-x-2 text-sm text-gray-400"
          >
            <div
              className="w-3 h-3 rounded"
              style={{
                backgroundColor: d3.interpolateYlOrRd(index / 2)
              }}
            />
            <span>{level} {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};