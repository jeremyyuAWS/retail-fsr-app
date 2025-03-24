import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { motion } from 'framer-motion';
import { Calendar, Filter, TrendingUp } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SalesChartProps {
  data: {
    date: string;
    value: number;
    forecast: number;
  }[];
}

export const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  const [timeRange, setTimeRange] = useState('30d');
  const [showForecast, setShowForecast] = useState(true);
  const [highlightedPoint, setHighlightedPoint] = useState<number | null>(null);

  const timeRanges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' }
  ];

  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Actual Sales',
        data: data.map(item => item.value),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      ...(showForecast ? [{
        label: 'Forecast',
        data: data.map(item => item.forecast),
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4
      }] : [])
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(229, 231, 235)',
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        titleColor: 'rgb(229, 231, 235)',
        bodyColor: 'rgb(229, 231, 235)',
        borderColor: 'rgb(75, 85, 99)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(75, 85, 99, 0.2)'
        },
        ticks: {
          color: 'rgb(229, 231, 235)',
          callback: function(value: any) {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              notation: 'compact'
            }).format(value);
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)'
        },
        ticks: {
          color: 'rgb(229, 231, 235)'
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    },
    onHover: (event: any, elements: any) => {
      if (elements && elements.length) {
        setHighlightedPoint(elements[0].index);
      } else {
        setHighlightedPoint(null);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gray-900/50 rounded-lg p-2 border border-gray-700">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div className="flex space-x-1">
              {timeRanges.map(range => (
                <button
                  key={range.value}
                  onClick={() => setTimeRange(range.value)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    timeRange === range.value
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={() => setShowForecast(!showForecast)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
              showForecast
                ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                : 'bg-gray-900/50 text-gray-400 border-gray-700'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Forecast</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 px-3 py-2 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Filter</span>
          </button>
        </div>
      </div>

      <div className="relative h-[400px]">
        <Line data={chartData} options={options} />
        
        {highlightedPoint !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 right-4 bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 border border-gray-700"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Current Value:</span>
                <span className="font-medium text-blue-400">
                  ${data[highlightedPoint].value.toLocaleString()}
                </span>
              </div>
              {showForecast && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Forecast:</span>
                  <span className="font-medium text-purple-400">
                    ${data[highlightedPoint].forecast.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};