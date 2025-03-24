import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, History } from 'lucide-react';

interface SearchSuggestionsProps {
  suggestions: string[];
  recentSearches: string[];
  onSelect: (suggestion: string) => void;
  visible: boolean;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  recentSearches,
  onSelect,
  visible
}) => {
  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-sm rounded-lg border border-gray-700 shadow-lg overflow-hidden z-50"
      >
        {suggestions.length > 0 && (
          <div className="p-2">
            <div className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-400">
              <Sparkles className="w-4 h-4" />
              <span>AI Suggestions</span>
            </div>
            <div className="space-y-1">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSelect(suggestion)}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-800/50 transition-colors flex items-center space-x-2"
                >
                  <Search className="w-4 h-4 text-gray-400" />
                  <span>{suggestion}</span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {recentSearches.length > 0 && (
          <div className="border-t border-gray-700 p-2">
            <div className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-400">
              <History className="w-4 h-4" />
              <span>Recent Searches</span>
            </div>
            <div className="space-y-1">
              {recentSearches.slice(0, 3).map((search, index) => (
                <motion.button
                  key={search}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSelect(search)}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-800/50 transition-colors flex items-center space-x-2"
                >
                  <Search className="w-4 h-4 text-gray-400" />
                  <span>{search}</span>
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};