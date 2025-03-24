import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Calendar, ArrowUpRight, ArrowDownRight, Activity, Brain, Filter, RefreshCw, Maximize2, ChevronDown, ZoomIn, Clock, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format, subDays } from 'date-fns';

interface TrendData {
  id: string;
  metric: string;
  currentValue: number;
  previousValue: number;
  change: number;
  trend: 'up' | 'down';
  insights: string[];
  recommendations: string[];
  historicalData: { date: string; value: number; prediction: number }[];
  impactScore: number;
  confidence: number;
  timestamp: Date;
  alerts: string[];
}

export const AITrendAnalysis: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('week');
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [expandedInsights, setExpandedInsights] = useState<string[]>([]);
  const [showDetailedChart, setShowDetailedChart] = useState<string | null>(null);
  const [updateCount, setUpdateCount] = useState(0);

  const generateHistoricalData = useCallback((baseValue: number, days: number) => {
    return Array.from({ length: days }, (_, i) => {
      const date = format(subDays(new Date(), days - 1 - i), 'MMM dd');
      const value = baseValue * (1 + (Math.sin(i / 2) * 0.1) + (Math.random() * 0.1 - 0.05));
      const prediction = value * (1 + (Math.random() * 0.15 - 0.05));
      return { date, value, prediction };
    });
  }, []);

  useEffect(() => {
    const mockTrendData: TrendData[] = [
      {
        id: '1',
        metric: 'Store Traffic',
        currentValue: 2847,
        previousValue: 2640,
        change: 7.8,
        trend: 'up',
        insights: [
          'Peak hours have shifted 2 hours later compared to last month',
          'Electronics section showing 32% higher engagement',
          'Weekend traffic increased by 15% after new promotion',
          'Customer dwell time in mobile devices area up by 45%',
          'Entry point A shows 25% more traffic than point B'
        ],
        recommendations: [
          'Adjust staff scheduling to match new peak hours',
          'Increase inventory for high-engagement electronics',
          'Consider extending weekend promotion strategy',
          'Add more demo units in mobile devices section',
          'Optimize entry point B layout based on A\'s success'
        ],
        historicalData: generateHistoricalData(2500, 30),
        impactScore: 85,
        confidence: 92,
        timestamp: new Date(),
        alerts: [
          'Unusual traffic spike detected in electronics section',
          'Staff coverage below optimal during peak hours'
        ]
      },
      {
        id: '2',
        metric: 'Sales Conversion',
        currentValue: 24.5,
        previousValue: 22.8,
        change: 7.4,
        trend: 'up',
        insights: [
          'Premium product conversion rate increased by 28%',
          'Cross-sell success rate improved in electronics by 15%',
          'New display layout showing 22% better engagement',
          'Mobile payment usage up 40% after promotion',
          'First-time customer conversion improved by 18%'
        ],
        recommendations: [
          'Expand premium product placement strategy',
          'Implement successful cross-sell tactics in other departments',
          'Roll out new display layout to other sections',
          'Increase mobile payment promotion visibility',
          'Enhance first-time customer experience program'
        ],
        historicalData: generateHistoricalData(20, 30),
        impactScore: 90,
        confidence: 88,
        timestamp: new Date(),
        alerts: [
          'Conversion rate exceeding historical average by 15%',
          'Mobile payment adoption rate accelerating'
        ]
      },
      {
        id: '3',
        metric: 'Average Transaction',
        currentValue: 128.50,
        previousValue: 135.20,
        change: -4.9,
        trend: 'down',
        insights: [
          'Basket size decreased 8% in non-promotional items',
          'Premium category sales dropped 12% this week',
          'Promotional items driving 35% more transactions',
          'Seasonal items showing 15% lower attachment rate',
          'Customer price sensitivity increased by 20%'
        ],
        recommendations: [
          'Review pricing strategy for non-promotional items',
          'Develop targeted premium category promotion',
          'Optimize promotional mix for higher margins',
          'Create seasonal item bundles for better value',
          'Implement dynamic pricing based on sensitivity data'
        ],
        historicalData: generateHistoricalData(120, 30),
        impactScore: 75,
        confidence: 85,
        timestamp: new Date(),
        alerts: [
          'Transaction value trending below target',
          'Premium category performance requires attention'
        ]
      }
    ];

    setTrendData(mockTrendData);
  }, [selectedPeriod, generateHistoricalData]);

  useEffect(() => {
    if (isAutoRefresh) {
      const interval = setInterval(() => {
        setTrendData(prev => prev.map(trend => {
          const newValue = trend.currentValue * (1 + (Math.random() * 0.02 - 0.01));
          const historicalData = [...trend.historicalData];
          historicalData.push({
            date: format(new Date(), 'MMM dd'),
            value: newValue,
            prediction: newValue * (1 + (Math.random() * 0.15 - 0.05))
          });
          if (historicalData.length > 30) historicalData.shift();
          
          return {
            ...trend,
            currentValue: newValue,
            historicalData,
            timestamp: new Date()
          };
        }));
        setUpdateCount(prev => prev + 1);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isAutoRefresh]);

  const toggleInsightExpansion = (id: string) => {
    setExpandedInsights(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getImpactColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const DetailedChart = ({ data }: { data: TrendData }) => (
    <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm z-10 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">{data.metric} Detailed Analysis</h3>
        <button
          onClick={() => setShowDetailedChart(null)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ×
        </button>
      </div>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.historicalData}>
            <defs>
              <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="predictionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              stroke="#6B7280"
              tick={{ fill: '#9CA3AF' }}
            />
            <YAxis
              stroke="#6B7280"
              tick={{ fill: '#9CA3AF' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(17, 24, 39, 0.8)',
                border: '1px solid rgb(75, 85, 99)',
                borderRadius: '0.5rem'
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#valueGradient)"
              name="Actual"
            />
            <Area
              type="monotone"
              dataKey="prediction"
              stroke="#8B5CF6"
              fillOpacity={1}
              fill="url(#predictionGradient)"
              name="Prediction"
              strokeDasharray="5 5"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Activity className="w-6 h-6 text-blue-400" />
          <h3 className="text-lg font-semibold">AI Trend Analysis</h3>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Updates: {updateCount}</span>
          </div>
          <button
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-colors ${
              isAutoRefresh
                ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                : 'bg-gray-900/50 text-gray-400 border-gray-700'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isAutoRefresh ? 'animate-spin' : ''}`} />
            <span className="text-sm">Auto Refresh</span>
          </button>
          
          <div className="flex items-center space-x-2 bg-gray-900/50 rounded-lg p-2 border border-gray-700">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div className="flex space-x-1">
              {['day', 'week', 'month'].map(period => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period as any)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    selectedPeriod === period
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence>
          {trendData.map(trend => (
            <motion.div
              key={trend.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative bg-gray-900/50 rounded-lg p-4 border border-gray-700"
            >
              {showDetailedChart === trend.id && <DetailedChart data={trend} />}
              
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-medium">{trend.metric}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-2xl font-bold">
                      {trend.metric.includes('Sales') ? '$' : ''}
                      {trend.currentValue.toLocaleString()}
                      {trend.metric.includes('Conversion') ? '%' : ''}
                    </span>
                    <div className="flex items-center space-x-1">
                      {trend.trend === 'up' ? (
                        <ArrowUpRight className="w-4 h-4 text-green-400" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-400" />
                      )}
                      <span 
                        className={trend.trend === 'up' ? 'text-green-400' : 'text-red-400'}
                      >
                        {trend.change > 0 ? '+' : ''}{trend.change}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-sm">
                    <div className="flex items-center space-x-1">
                      <span className="text-gray-400">Impact Score:</span>
                      <span className={getImpactColor(trend.impactScore)}>
                        {trend.impactScore}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-gray-400">Confidence:</span>
                      <span className="text-blue-400">{trend.confidence}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowDetailedChart(trend.id)}
                    className="p-1.5 text-gray-400 hover:text-white transition-colors"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                  <TrendingUp 
                    className={`w-5 h-5 ${
                      trend.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`} 
                  />
                </div>
              </div>

              {trend.alerts.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-400">Alerts</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {trend.alerts.map((alert, index) => (
                      <div
                        key={index}
                        className="bg-yellow-400/10 border border-yellow-400/20 rounded p-2 text-sm text-yellow-200"
                      >
                        {alert}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Brain className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-gray-400">AI Insights</span>
                    </div>
                    <button
                      onClick={() => toggleInsightExpansion(trend.id)}
                      className="text-sm text-gray-400 hover:text-white transition-colors flex items-center space-x-1"
                    >
                      <span>{expandedInsights.includes(trend.id) ? 'Show Less' : 'Show All'}</span>
                      <ChevronDown 
                        className={`w-4 h-4 transform transition-transform ${
                          expandedInsights.includes(trend.id) ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {(expandedInsights.includes(trend.id) 
                      ? trend.insights 
                      : trend.insights.slice(0, 3)
                    ).map((insight, index) => (
                      <div
                        key={index}
                        className="bg-gray-800/50 rounded p-2 text-sm text-gray-300"
                      >
                        {insight}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Filter className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-gray-400">AI Recommendations</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {(expandedInsights.includes(trend.id)
                      ? trend.recommendations
                      : trend.recommendations.slice(0, 3)
                    ).map((recommendation, index) => (
                      <div
                        key={index}
                        className="bg-gray-800/50 rounded p-2 text-sm text-gray-300 border border-purple-500/20"
                      >
                        {recommendation}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Maximize2 className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-gray-400">Historical Trend</span>
                    </div>
                    <span className="text-xs text-gray-500">Last 7 days</span>
                  </div>
                  <div className="h-20">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trend.historicalData.slice(-7)}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};