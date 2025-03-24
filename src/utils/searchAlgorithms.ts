import Fuse from 'fuse.js';
import natural from 'natural';
const { TfIdf, WordTokenizer } = natural;

interface SearchResult {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
}

export class AdvancedSearch {
  private fuseSearch: Fuse<SearchResult>;
  private tfidf: any;
  private tokenizer: any;
  private documents: SearchResult[];

  constructor(documents: SearchResult[]) {
    // Initialize Fuse.js for fuzzy searching
    this.fuseSearch = new Fuse(documents, {
      keys: ['title', 'content', 'tags'],
      includeScore: true,
      threshold: 0.3,
      distance: 100
    });

    // Initialize TF-IDF for relevance scoring
    this.tfidf = new TfIdf();
    this.tokenizer = new WordTokenizer();
    this.documents = documents;

    // Add documents to TF-IDF
    documents.forEach((doc, index) => {
      this.tfidf.addDocument(
        `${doc.title} ${doc.content} ${doc.tags.join(' ')}`
      );
    });
  }

  search(query: string, category?: string): SearchResult[] {
    // Get fuzzy search results
    const fuseResults = this.fuseSearch.search(query);

    // Get TF-IDF scores
    const queryTokens = this.tokenizer.tokenize(query.toLowerCase());
    const tfidfScores = this.documents.map((_, index) => {
      return queryTokens.reduce((score, token) => {
        return score + this.tfidf.tfidf(token, index);
      }, 0);
    });

    // Combine and normalize scores
    const results = fuseResults.map(result => {
      const doc = result.item;
      const fuseScore = 1 - (result.score || 0); // Convert to positive score
      const tfidfScore = tfidfScores[this.documents.indexOf(doc)] / Math.max(...tfidfScores);
      
      // Combined score with weights
      const combinedScore = (fuseScore * 0.6) + (tfidfScore * 0.4);

      return {
        ...doc,
        score: combinedScore,
        relevance: Math.round(combinedScore * 100)
      };
    });

    // Filter by category if specified
    const filteredResults = category && category !== 'all'
      ? results.filter(result => result.category === category)
      : results;

    // Sort by combined score
    return filteredResults.sort((a, b) => b.score - a.score);
  }

  getSuggestions(query: string): string[] {
    const tokens = this.tokenizer.tokenize(query.toLowerCase());
    const suggestions: Set<string> = new Set();

    this.documents.forEach(doc => {
      const docTokens = this.tokenizer.tokenize(
        `${doc.title} ${doc.content}`.toLowerCase()
      );

      tokens.forEach(token => {
        docTokens.forEach(docToken => {
          if (docToken.startsWith(token)) {
            suggestions.add(docToken);
          }
        });
      });
    });

    return Array.from(suggestions).slice(0, 5);
  }

  getRelatedTopics(query: string): string[] {
    const queryTokens = this.tokenizer.tokenize(query.toLowerCase());
    const topics: Map<string, number> = new Map();

    this.documents.forEach(doc => {
      doc.tags.forEach(tag => {
        const currentCount = topics.get(tag) || 0;
        topics.set(tag, currentCount + 1);
      });
    });

    return Array.from(topics.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([topic]) => topic)
      .slice(0, 5);
  }
}