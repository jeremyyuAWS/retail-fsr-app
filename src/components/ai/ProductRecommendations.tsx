import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, TrendingUp, Tag, Users } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  confidence: number;
  reason: string;
  category: string;
}

export const ProductRecommendations: React.FC = () => {
  const recommendations: Product[] = [
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      price: 199.99,
      confidence: 92,
      reason: 'High demand in electronics department',
      category: 'Electronics'
    },
    {
      id: '2',
      name: 'Smart Fitness Watch',
      price: 149.99,
      confidence: 88,
      reason: 'Trending in wearable tech',
      category: 'Electronics'
    },
    {
      id: '3',
      name: 'Designer Backpack',
      price: 79.99,
      confidence: 85,
      reason: 'Popular among young professionals',
      category: 'Accessories'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">AI Product Recommendations</h3>
        <span className="text-sm text-blue-400">Updated just now</span>
      </div>
      
      <div className="grid gap-4">
        {recommendations.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/50 rounded-lg p-4 border border-gray-700"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h4 className="font-medium">{product.name}</h4>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Tag className="w-4 h-4" />
                  <span>${product.price}</span>
                  <span>•</span>
                  <span>{product.category}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">{product.confidence}%</span>
              </div>
            </div>
            
            <div className="mt-3 flex items-center space-x-2 text-sm text-gray-400">
              <Users className="w-4 h-4" />
              <span>{product.reason}</span>
            </div>
            
            <div className="mt-3 flex space-x-2">
              <button className="flex-1 px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded border border-blue-500/30 text-sm hover:bg-blue-500/30 transition-colors">
                View Details
              </button>
              <button className="flex items-center justify-center px-3 py-1.5 bg-gray-800/50 rounded border border-gray-700 text-sm hover:bg-gray-800 transition-colors">
                <ShoppingBag className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};