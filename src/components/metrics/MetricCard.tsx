import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  icon: Icon,
  label,
  value,
  change,
  trend
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon className="w-6 h-6 text-blue-400" />
          <span className="text-gray-400">{label}</span>
        </div>
        {change && (
          <span className={`text-sm ${getTrendColor()}`}>
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </motion.div>
  );
};