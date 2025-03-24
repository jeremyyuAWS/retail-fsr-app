import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, TrendingUp, Users, Package } from 'lucide-react';
import { MetricCard } from '../components/metrics/MetricCard';
import { SalesChart } from '../components/charts/SalesChart';
import { StoreHeatmap } from '../components/visualizations/StoreHeatmap';
import { generateTimeSeriesData } from '../utils/mockData';

export const Dashboard: React.FC = () => {
  const timeSeriesData = generateTimeSeriesData(30);

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
        className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
      >
        <div className="flex items-center space-x-4 mb-6">
          <LayoutDashboard className="w-8 h-8 text-blue-400" />
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
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
          className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
        >
          <StoreHeatmap />
        </motion.div>
      </div>
    </div>
  );
};