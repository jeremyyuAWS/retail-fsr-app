import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, TrendingUp, AlertCircle, ArrowRight, BarChart3 } from 'lucide-react';

interface StockItem {
  id: string;
  name: string;
  currentStock: number;
  optimalStock: number;
  reorderPoint: number;
  demand: number;
  trend: 'up' | 'down' | 'stable';
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
}

export const StockOptimization: React.FC = () => {
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  
  const stockItems: StockItem[] = [
    {
      id: '1',
      name: 'Wireless Earbuds',
      currentStock: 15,
      optimalStock: 50,
      reorderPoint: 20,
      demand: 25,
      trend: 'up',
      recommendation: 'Order 35 units to meet increasing demand',
      priority: 'high'
    },
    {
      id: '2',
      name: 'Smart Watches',
      currentStock: 30,
      optimalStock: 40,
      reorderPoint: 15,
      demand: 18,
      trend: 'stable',
      recommendation: 'Monitor demand pattern, consider ordering in 2 weeks',
      priority: 'medium'
    },
    {
      id: '3',
      name: 'Bluetooth Speakers',
      currentStock: 25,
      optimalStock: 35,
      reorderPoint: 10,
      demand: 8,
      trend: 'down',
      recommendation: 'Hold ordering, current stock sufficient for demand',
      priority: 'low'
    }
  ];

  const filteredItems = selectedPriority === 'all' 
    ? stockItems 
    : stockItems.filter(item => item.priority === selectedPriority);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-400 border-red-500/30 bg-red-500/10';
      case 'medium':
        return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
      case 'low':
        return 'text-green-400 border-green-500/30 bg-green-500/10';
      default:
        return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-400 transform rotate-180" />;
      default:
        return <ArrowRight className="w-4 h-4 text-yellow-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Package className="w-6 h-6 text-blue-400" />
          <h3 className="text-lg font-semibold">Stock Optimization</h3>
        </div>
        <div className="flex space-x-2">
          {['all', 'high', 'medium', 'low'].map(priority => (
            <button
              key={priority}
              onClick={() => setSelectedPriority(priority)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                selectedPriority === priority
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-gray-900/50 text-gray-400 border border-gray-700 hover:border-gray-600'
              }`}
            >
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {filteredItems.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-900/50 rounded-lg p-4 border border-gray-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium">{item.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-0.5 text-xs rounded-full border ${getPriorityColor(item.priority)}`}>
                      {item.priority.toUpperCase()}
                    </span>
                    <div className="flex items-center space-x-1 text-sm">
                      <BarChart3 className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400">Demand: {item.demand} units/day</span>
                    </div>
                  </div>
                </div>
                {getTrendIcon(item.trend)}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="bg-gray-800/50 rounded-lg p-2">
                  <div className="text-sm text-gray-400">Current Stock</div>
                  <div className="font-medium">{item.currentStock} units</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-2">
                  <div className="text-sm text-gray-400">Optimal Level</div>
                  <div className="font-medium">{item.optimalStock} units</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-2">
                  <div className="text-sm text-gray-400">Reorder Point</div>
                  <div className="font-medium">{item.reorderPoint} units</div>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-blue-400 mt-1" />
                <p className="text-sm text-gray-400">{item.recommendation}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};