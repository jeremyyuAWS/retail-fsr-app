import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';

export const MasterDashboard: React.FC = () => {
  const insights = [
    {
      icon: TrendingUp,
      title: "Sales Performance",
      description: "Revenue is up 15% this week, driven by electronics department",
      color: "text-green-400"
    },
    {
      icon: AlertCircle,
      title: "Stock Alert",
      description: "Low inventory detected for 5 top-selling items",
      color: "text-red-400"
    },
    {
      icon: Sparkles,
      title: "AI Recommendation",
      description: "Consider running a promotion on winter apparel",
      color: "text-blue-400"
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
          <Brain className="w-8 h-8 text-blue-400" />
          <h1 className="text-2xl font-bold">AI Master Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-900/50 rounded-lg p-4 border border-gray-700"
            >
              <div className="flex items-center space-x-3 mb-3">
                <insight.icon className={`w-6 h-6 ${insight.color}`} />
                <h3 className="font-semibold">{insight.title}</h3>
              </div>
              <p className="text-gray-400">{insight.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
        >
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center space-x-3 text-gray-400">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <span>AI Agent analyzed department performance</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
        >
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {['View Sales Report', 'Check Inventory', 'Staff Schedule', 'Store Analytics'].map((action, index) => (
              <button
                key={index}
                className="p-3 text-sm bg-gray-900/50 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};