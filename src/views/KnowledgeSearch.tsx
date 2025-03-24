import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { SearchSuggestions } from '../components/ai/SearchSuggestions';

export const KnowledgeSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  const suggestions = [
    'Sales techniques for electronics',
    'Customer objection handling',
    'Product knowledge base'
  ];

  const recentSearches = [
    'Return policy',
    'Warranty claims',
    'Price matching'
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
      >
        <div className="flex items-center space-x-4 mb-6">
          <Search className="w-8 h-8 text-blue-400" />
          <h1 className="text-2xl font-bold">Knowledge Search</h1>
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search the knowledge base..."
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 px-4 pl-12 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          
          <SearchSuggestions
            suggestions={suggestions}
            recentSearches={recentSearches}
            onSelect={(suggestion) => {
              setSearchQuery(suggestion);
              setShowSuggestions(false);
            }}
            visible={showSuggestions}
          />
        </div>
      </motion.div>
    </div>
  );
};