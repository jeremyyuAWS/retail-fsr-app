import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, TrendingUp, ShoppingBag, Users, AlertCircle } from 'lucide-react';

interface Insight {
  id: string;
  type: 'prediction' | 'alert' | 'recommendation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  value?: string;
  trend?: 'up' | 'down';
  percentage?: string;
  timestamp: Date;
}

export const AIInsights: React.FC = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'predictions', 'alerts', 'recommendations'];

  useEffect(() => {
    // Simulate real-time insights
    const mockInsights: Insight[] = [
      {
        id: '1',
        type: 'prediction',
        title: 'Sales Forecast Alert',
        description: 'Electronics department projected to exceed target by 25% this week',
        impact: 'high',
        category: 'predictions',
        value: '$45,000',
        trend: 'up',
        percentage: '+25%',
        timestamp: new Date()
      },
      {
        id: '2',
        type: 'alert',
        title: 'Stock Level Warning',
        description: 'Premium headphones inventory below threshold',
        impact: 'high',
        category: 'alerts',
        value: '5 units',
        trend: 'down',
        percentage: '-60%',
        timestamp: new Date()
      },
      {
        id: '3',
        type: 'recommendation',
        title: 'Cross-Sell Opportunity',
        description: 'Recommend phone cases with new smartphone purchases',
        impact: 'medium',
        category: 'recommendations',
        value: '+15% attachment rate',
        trend: 'up',
        percentage: '+15%',
        timestamp: new Date()
      }
    ];

    setInsights(mockInsights);

    // Simulate real-time updates
    const interval = setInterval(() => {
      const newInsight: Insight = {
        id: Math.random().toString(),
        type: 'prediction',
        title: 'Real-Time Update',
        description: 'Customer traffic increasing in electronics section',
        impact: 'medium',
        category: 'predictions',
        value: '45 customers',
        trend: 'up',
        percentage: '+12%',
        timestamp: new Date()
      };

      setInsights(prev => [newInsight, ...prev].slice(0, 5));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const filteredInsights = insights.filter(
    insight => selectedCategory === 'all' || insight.category === selectedCategory
  );

  const getIconByType = (type: string) => {
    switch (type) {
      case 'prediction':
        return TrendingUp;
      case 'alert':
        return AlertCircle;
      case 'recommendation':
        return ShoppingBag;
      default:
        return Brain;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-blue-400';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="w-6 h-6 text-blue-400" />
          <h3 className="text-lg font-semibold">AI Insights</h3>
        </div>
        <div className="flex space-x-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-gray-900/50 text-gray-400 border border-gray-700 hover:border-gray-600'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {filteredInsights.map(insight => {
            const Icon = getIconByType(insight.type);
            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gray-900/50 rounded-lg p-4 border border-gray-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Icon className={`w-5 h-5 mt-1 ${getImpactColor(insight.impact)}`} />
                    <div>
                      <h4 className="font-medium">{insight.title}</h4>
                      <p className="text-sm text-gray-400 mt-1">{insight.description}</p>
                    </div>
                  </div>
                  {insight.value && (
                    <div className="text-right">
                      <span className="font-medium">{insight.value}</span>
                      {insight.trend && insight.percentage && (
                        <div className="flex items-center justify-end space-x-1 mt-1">
                          {insight.trend === 'up' ? (
                            <TrendingUp className="w-4 h-4 text-green-400" />
                          ) : (
                            <TrendingUp className="w-4 h-4 text-red-400 transform rotate-180" />
                          )}
                          <span className={insight.trend === 'up' ? 'text-green-400' : 'text-red-400'}>
                            {insight.percentage}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 mt-3 text-sm text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>
                    {new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
                      Math.floor((insight.timestamp.getTime() - Date.now()) / 1000 / 60),
                      'minute'
                    )}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};