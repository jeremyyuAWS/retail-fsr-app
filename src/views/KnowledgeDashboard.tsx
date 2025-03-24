import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Book, Clock, ArrowRight, Brain, Star, Bookmark, History, TrendingUp, MessageSquare, Filter, Tag, ExternalLink } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  category: string;
  relevance: number;
  lastUpdated: Date;
  views: number;
  tags: string[];
  aiSummary?: string;
  relatedTopics: string[];
}

interface SavedSearch {
  id: string;
  query: string;
  timestamp: Date;
  results: number;
  category: string;
}

export const KnowledgeDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [showAISummary, setShowAISummary] = useState(true);
  const [bookmarkedResults, setBookmarkedResults] = useState<string[]>([]);

  const categories = ['all', 'Products', 'Policies', 'Procedures', 'Training', 'FAQs'];

  const recentSearches = [
    {
      id: '1',
      query: "Product return policy",
      timestamp: new Date(),
      results: 15,
      category: 'Policies'
    },
    {
      id: '2',
      query: "Holiday promotion details",
      timestamp: new Date(Date.now() - 3600000),
      results: 8,
      category: 'Products'
    },
    {
      id: '3',
      query: "Inventory check process",
      timestamp: new Date(Date.now() - 7200000),
      results: 12,
      category: 'Procedures'
    },
    {
      id: '4',
      query: "Customer loyalty program",
      timestamp: new Date(Date.now() - 10800000),
      results: 10,
      category: 'Policies'
    }
  ];

  const mockSearchResults: SearchResult[] = [
    {
      id: '1',
      title: "Return Policy Guidelines",
      content: "30-day return policy with receipt. Items must be unused and in original packaging.",
      category: 'Policies',
      relevance: 95,
      lastUpdated: new Date(),
      views: 1250,
      tags: ['returns', 'policy', 'customer service'],
      aiSummary: "Key points: 30-day window, receipt required, original packaging needed. Recent update: Extended holiday returns until January 31st.",
      relatedTopics: ['Refund Process', 'Gift Returns', 'Warranty Claims']
    },
    {
      id: '2',
      title: "Current Promotions Overview",
      content: "20% off winter apparel, Buy-one-get-one 50% off electronics accessories.",
      category: 'Products',
      relevance: 88,
      lastUpdated: new Date(),
      views: 890,
      tags: ['promotions', 'sales', 'discounts'],
      aiSummary: "Active promotions: Winter apparel discount, Electronics BOGO. High-performing categories: Accessories, Winter wear.",
      relatedTopics: ['Seasonal Sales', 'Member Discounts', 'Clearance Items']
    },
    {
      id: '3',
      title: "Loyalty Program Benefits",
      content: "Points system: 1 point per dollar, 500 points = $5 reward. Extra perks for VIP members.",
      category: 'Policies',
      relevance: 92,
      lastUpdated: new Date(),
      views: 1500,
      tags: ['loyalty', 'rewards', 'members'],
      aiSummary: "Program highlights: Point-based rewards, VIP tiers, special events access. New feature: Digital reward tracking.",
      relatedTopics: ['VIP Benefits', 'Point System', 'Member Events']
    }
  ];

  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      // Simulate search delay
      const timer = setTimeout(() => {
        setSearchResults(mockSearchResults.filter(result => 
          result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.content.toLowerCase().includes(searchQuery.toLowerCase())
        ));
        setIsSearching(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const toggleBookmark = (resultId: string) => {
    setBookmarkedResults(prev => 
      prev.includes(resultId) 
        ? prev.filter(id => id !== resultId)
        : [...prev, resultId]
    );
  };

  const SearchResultCard = ({ result }: { result: SearchResult }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/50 rounded-lg p-4 border border-gray-700"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-medium text-lg">{result.title}</h3>
          <div className="flex items-center space-x-3 mt-1 text-sm text-gray-400">
            <span className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{result.lastUpdated.toLocaleDateString()}</span>
            </span>
            <span className="flex items-center space-x-1">
              <MessageSquare className="w-4 h-4" />
              <span>{result.views} views</span>
            </span>
            <span className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4" />
              <span>{result.relevance}% relevant</span>
            </span>
          </div>
        </div>
        <button
          onClick={() => toggleBookmark(result.id)}
          className={`p-1.5 rounded-lg transition-colors ${
            bookmarkedResults.includes(result.id)
              ? 'text-yellow-400 bg-yellow-400/10'
              : 'text-gray-400 hover:text-yellow-400'
          }`}
        >
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

      <p className="text-gray-300 mb-4">{result.content}</p>

      {showAISummary && result.aiSummary && (
        <div className="mb-4 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-400">AI Summary</span>
          </div>
          <p className="text-sm text-gray-300">{result.aiSummary}</p>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {result.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs rounded-full bg-gray-800 text-gray-300 border border-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Tag className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-400">Related Topics</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.relatedTopics.map((topic, index) => (
              <button
                key={index}
                className="px-3 py-1 text-sm rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Search className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold">Knowledge Search</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowAISummary(!showAISummary)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-colors ${
                showAISummary
                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  : 'bg-gray-900/50 text-gray-400 border-gray-700'
              }`}
            >
              <Brain className="w-4 h-4" />
              <span className="text-sm">AI Summary</span>
            </button>
            <div className="flex items-center space-x-2 bg-gray-900/50 rounded-lg p-2 border border-gray-700">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-sm text-gray-400 focus:outline-none"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for product information, policies, or procedures..."
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 px-4 pl-12 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          {isSearching && (
            <div className="absolute right-4 top-3.5">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400" />
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center space-x-3 mb-4">
            <History className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-semibold">Recent Searches</h2>
          </div>
          <div className="space-y-3">
            {recentSearches.map((search) => (
              <motion.div
                key={search.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-blue-500 cursor-pointer transition-colors group"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">{search.query}</span>
                    <span className="text-sm text-gray-400">{search.results} results</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(search.timestamp).toLocaleTimeString()}</span>
                    <span>•</span>
                    <span>{search.category}</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Star className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-semibold">Popular Topics</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: 'Return Process', views: '1.2k', link: '#' },
              { title: 'Warranty Claims', views: '950', link: '#' },
              { title: 'Price Match', views: '850', link: '#' },
              { title: 'Store Locations', views: '780', link: '#' }
            ].map((topic, index) => (
              <motion.a
                key={index}
                href={topic.link}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-blue-500 group transition-colors"
              >
                <span className="font-medium group-hover:text-blue-400 transition-colors">
                  {topic.title}
                </span>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <MessageSquare className="w-4 h-4" />
                  <span>{topic.views}</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      {searchResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold">Search Results</h2>
          <div className="grid gap-4">
            {searchResults.map(result => (
              <SearchResultCard key={result.id} result={result} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};