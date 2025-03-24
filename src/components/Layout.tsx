import React from 'react';
import { MessagesSquare, BarChart3, Search, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'coach', name: 'AI Sales Coach', Icon: MessagesSquare },
  { id: 'analysis', name: 'Data Analysis', Icon: BarChart3 },
  { id: 'knowledge', name: 'Knowledge Search', Icon: Search },
  { id: 'dashboard', name: 'Dashboard', Icon: LayoutDashboard },
];

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <nav className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <MessagesSquare className="w-8 h-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold">AI Sales Coach</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {tabs.map(({ id, name, Icon }) => (
            <motion.button
              key={id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onTabChange(id)}
              className={`
                relative p-4 rounded-xl border transition-all duration-200
                ${activeTab === id 
                  ? 'border-blue-500 bg-blue-500/10 text-blue-400' 
                  : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'}
              `}
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5" />
                <span className="font-medium">{name}</span>
              </div>
              {activeTab === id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                />
              )}
            </motion.button>
          ))}
        </div>
        
        <div className="flex">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
};