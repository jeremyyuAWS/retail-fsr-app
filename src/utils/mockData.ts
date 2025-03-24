import { faker } from '@faker-js/faker';
import { addDays, subDays, format } from 'date-fns';
import type { SalesData, AIRecommendation, StoreMetrics } from '../types';

export const generateSalesData = (days: number): SalesData[] => {
  const data: SalesData[] = [];
  const categories = ['Electronics', 'Clothing', 'Home', 'Sports', 'Beauty'];
  const stores = ['Store A', 'Store B', 'Store C'];

  for (let i = 0; i < days; i++) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    categories.forEach(category => {
      stores.forEach(store => {
        data.push({
          date,
          revenue: faker.number.float({ min: 1000, max: 50000, precision: 2 }),
          units: faker.number.int({ min: 10, max: 500 }),
          category,
          store
        });
      });
    });
  }

  return data;
};

export const generateAIRecommendations = (count: number): AIRecommendation[] => {
  const recommendations: AIRecommendation[] = [];
  const priorities = ['high', 'medium', 'low'] as const;
  const categories = ['Sales', 'Inventory', 'Customer Service', 'Marketing'];

  for (let i = 0; i < count; i++) {
    recommendations.push({
      id: faker.string.uuid(),
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      priority: priorities[faker.number.int({ min: 0, max: 2 })],
      category: categories[faker.number.int({ min: 0, max: 3 })],
      timestamp: faker.date.recent().toISOString()
    });
  }

  return recommendations;
};

export const generateStoreMetrics = (count: number): StoreMetrics[] => {
  const metrics: StoreMetrics[] = [];
  const regions = ['North', 'South', 'East', 'West'];

  for (let i = 0; i < count; i++) {
    metrics.push({
      id: faker.string.uuid(),
      name: `Store ${faker.location.city()}`,
      region: regions[faker.number.int({ min: 0, max: 3 })],
      currentTraffic: faker.number.int({ min: 50, max: 500 }),
      salesTarget: faker.number.int({ min: 10000, max: 100000 }),
      currentSales: faker.number.int({ min: 5000, max: 120000 }),
      topProducts: Array.from({ length: 3 }, () => faker.commerce.productName())
    });
  }

  return metrics;
};

export const generateTimeSeriesData = (days: number) => {
  const data = [];
  const startDate = subDays(new Date(), days);

  for (let i = 0; i < days; i++) {
    const currentDate = addDays(startDate, i);
    data.push({
      date: format(currentDate, 'MMM dd'),
      value: faker.number.int({ min: 1000, max: 5000 }),
      forecast: faker.number.int({ min: 1000, max: 5000 })
    });
  }

  return data;
};