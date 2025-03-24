import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Package, Users } from 'lucide-react';
import { MetricCard } from '../components/metrics/MetricCard';
import { SalesChart } from '../components/charts/SalesChart';
import { StoreHeatmap } from '../components/visualizations/StoreHeatmap';
import { AIAssistant } from '../components/ai/AIAssistant';
import { ProductRecommendations } from '../components/ai/ProductRecommendations';
import { AIInsights } from '../components/ai/AIInsights';
import { StockOptimization } from '../components/ai/StockOptimization';
import { AITrendAnalysis } from '../components/ai/AITrendAnalysis';
import { generateTimeSeriesData, generateSalesData } from '../utils/mockData';

export const AnalyticsDashboard: React.FC = () => {
  const [timeSeriesData, setTimeSeriesData] = useState(generateTimeSeriesData(30));
  const [salesData, setSalesData] = useState(generateSalesData(30));

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setTimeSeriesData(generateTimeSeriesData(30));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const metrics = [
    { 
      icon: TrendingUp,
      label: 'Total Sales',
      value: '$124,592',
      change: '+14.2%',
      trend: 'up' as const
    },
    {
      icon: Users,
      label: 'Store Traffic',
      value: '2,847',
      change: '+7.8%',
      trend: 'up' as const
    },
    {
      icon: Package,
      label: 'Stock Items',
      value: '1,234',
      change: '-2.3%',
      trend: 'down' as const
    }
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
        >
          <SalesChart data={timeSeriesData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <AIInsights />
          <AITrendAnalysis />
          <ProductRecommendations />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
        >
          <StoreHeatmap />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <StockOptimization />
          <AIAssistant />
        </motion.div>
      </div>
    </div>
  );
};