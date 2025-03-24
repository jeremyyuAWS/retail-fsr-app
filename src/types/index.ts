export interface SalesData {
  date: string;
  revenue: number;
  units: number;
  category: string;
  store: string;
}

export interface AIAgent {
  id: string;
  name: string;
  role: string;
  icon: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  timestamp: string;
}

export interface StoreMetrics {
  id: string;
  name: string;
  region: string;
  currentTraffic: number;
  salesTarget: number;
  currentSales: number;
  topProducts: string[];
}