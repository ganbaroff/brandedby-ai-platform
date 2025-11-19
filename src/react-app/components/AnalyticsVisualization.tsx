/**
 * Analytics Visualization Dashboard
 * Real-time analytics charts and metrics visualization
 */

import { AlertCircle, Clock, Eye, MousePointer, TrendingDown, TrendingUp, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { analytics, AnalyticsEvent, useAnalytics } from '../../shared/advanced-analytics';

interface ChartData {
  label: string;
  value: number;
  color: string;
}

/**
 * Simple Bar Chart Component
 */
const SimpleBarChart: React.FC<{ data: ChartData[]; title: string }> = ({ data, title }) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700' },
    React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 dark:text-white mb-4' }, title),
    React.createElement('div', { className: 'space-y-3' },
      ...data.map((item, index) => 
        React.createElement('div', { key: index },
          React.createElement('div', { className: 'flex justify-between items-center mb-1' },
            React.createElement('span', { className: 'text-sm font-medium text-gray-700 dark:text-gray-300' }, item.label),
            React.createElement('span', { className: 'text-sm text-gray-600 dark:text-gray-400' }, item.value)
          ),
          React.createElement('div', { className: 'w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2' },
            React.createElement('div', { 
              className: 'h-2 rounded-full transition-all duration-300',
              style: { 
                width: `${(item.value / maxValue) * 100}%`, 
                backgroundColor: item.color 
              }
            })
          )
        )
      )
    )
  );
};

/**
 * Metric Card Component
 */
const MetricCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: { value: number; isPositive: boolean };
  color?: string;
}> = ({ title, value, icon: Icon, trend, color = 'blue' }) => {
  const colorClasses = {
    blue: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-600',
    green: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 text-green-600',
    red: 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 text-red-600',
    purple: 'from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 text-purple-600'
  };

  return React.createElement('div', { 
    className: `bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} rounded-lg p-6 border border-gray-200 dark:border-gray-700` 
  },
    React.createElement('div', { className: 'flex items-center justify-between' },
      React.createElement('div', null,
        React.createElement('h3', { className: 'text-sm font-medium text-gray-600 dark:text-gray-400' }, title),
        React.createElement('p', { className: 'text-2xl font-bold text-gray-900 dark:text-white mt-2' }, value),
        trend && React.createElement('div', { className: 'flex items-center mt-2' },
          React.createElement(trend.isPositive ? TrendingUp : TrendingDown, { 
            className: `w-4 h-4 mr-1 ${trend.isPositive ? 'text-green-500' : 'text-red-500'}` 
          }),
          React.createElement('span', { 
            className: `text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}` 
          }, `${Math.abs(trend.value)}%`)
        )
      ),
      React.createElement(Icon, { className: 'w-8 h-8' })
    )
  );
};

/**
 * Real-time Events Feed
 */
const EventsFeed: React.FC<{ events: AnalyticsEvent[] }> = ({ events }) => {
  const recentEvents = events.slice(-10).reverse(); // Last 10 events

  const getEventColor = (category: AnalyticsEvent['category']) => {
    const colors = {
      user: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      celebrity: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      payment: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      performance: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      conversion: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700' },
    React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 dark:text-white mb-4' }, 'Recent Events'),
    React.createElement('div', { className: 'space-y-2 max-h-96 overflow-y-auto' },
      recentEvents.length === 0 ? 
        React.createElement('p', { className: 'text-gray-500 dark:text-gray-400 text-center py-4' }, 'No events yet') :
        recentEvents.map((event) =>
          React.createElement('div', { 
            key: event.id, 
            className: 'flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg' 
          },
            React.createElement('div', { className: 'flex items-center space-x-3' },
              React.createElement('span', { 
                className: `px-2 py-1 text-xs font-medium rounded-full ${getEventColor(event.category)}` 
              }, event.category),
              React.createElement('span', { className: 'text-sm text-gray-900 dark:text-white font-medium' }, event.action),
              event.label && React.createElement('span', { className: 'text-xs text-gray-500 dark:text-gray-400' }, event.label)
            ),
            React.createElement('div', { className: 'flex items-center space-x-2' },
              React.createElement('span', { className: 'text-xs text-gray-500 dark:text-gray-400' }, formatTime(event.timestamp)),
              event.value && React.createElement('span', { className: 'text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded' }, event.value)
            )
          )
        )
    )
  );
};

/**
 * Main Analytics Visualization Dashboard
 */
export const AnalyticsVisualization: React.FC = () => {
  const { summary, events } = useAnalytics();
  const [isLive, setIsLive] = useState(true);
  const [refreshInterval] = useState(5000);

  // Auto-refresh when live mode is enabled
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // Force re-render to show updated data
      window.dispatchEvent(new Event('analytics-update'));
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [isLive, refreshInterval]);

  // Format session duration
  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  // Prepare chart data
  const categoryData: ChartData[] = Object.entries(summary.eventsByCategory).map(([category, count]) => ({
    label: category.charAt(0).toUpperCase() + category.slice(1),
    value: count,
    color: {
      user: '#3b82f6',
      celebrity: '#8b5cf6',
      payment: '#10b981',
      performance: '#f59e0b',
      conversion: '#ec4899'
    }[category] || '#6b7280'
  }));

  // Calculate conversion rate (simplified)
  const conversionEvents = events.filter(e => e.category === 'conversion');
  const totalInteractions = events.filter(e => e.category === 'user' && e.action === 'click').length;
  const conversionRate = totalInteractions > 0 ? ((conversionEvents.length / totalInteractions) * 100).toFixed(1) : '0';

  return React.createElement('div', { className: 'p-6' },
    // Header with controls
    React.createElement('div', { className: 'flex items-center justify-between mb-6' },
      React.createElement('div', null,
        React.createElement('h2', { className: 'text-2xl font-bold text-gray-900 dark:text-white' }, 'Analytics Dashboard'),
        React.createElement('p', { className: 'text-gray-600 dark:text-gray-400 mt-1' }, 'Real-time user behavior and performance metrics')
      ),
      React.createElement('div', { className: 'flex items-center space-x-4' },
        React.createElement('button', {
          onClick: () => setIsLive(!isLive),
          className: `px-4 py-2 rounded-lg font-medium transition-colors ${
            isLive 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-gray-600 hover:bg-gray-700 text-white'
          }`
        }, isLive ? 'Live' : 'Paused'),
        React.createElement('button', {
          onClick: () => analytics.clearData(),
          className: 'px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors'
        }, 'Clear Data')
      )
    ),

    // Key Metrics Row
    React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8' },
      React.createElement(MetricCard, {
        title: 'Session Duration',
        value: formatDuration(summary.sessionDuration),
        icon: Clock,
        color: 'blue'
      }),
      React.createElement(MetricCard, {
        title: 'Page Views',
        value: summary.pageViews,
        icon: Eye,
        color: 'green'
      }),
      React.createElement(MetricCard, {
        title: 'User Interactions',
        value: summary.clicks,
        icon: MousePointer,
        color: 'purple'
      }),
      React.createElement(MetricCard, {
        title: 'Conversion Rate',
        value: `${conversionRate}%`,
        icon: TrendingUp,
        color: 'green'
      })
    ),

    // Device and Session Info
    React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8' },
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700' },
        React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 dark:text-white mb-4' }, 'Device Information'),
        React.createElement('div', { className: 'space-y-3' },
          React.createElement('div', { className: 'flex justify-between' },
            React.createElement('span', { className: 'text-gray-600 dark:text-gray-400' }, 'Device Type:'),
            React.createElement('span', { className: 'font-medium text-gray-900 dark:text-white' }, summary.device.type)
          ),
          React.createElement('div', { className: 'flex justify-between' },
            React.createElement('span', { className: 'text-gray-600 dark:text-gray-400' }, 'Operating System:'),
            React.createElement('span', { className: 'font-medium text-gray-900 dark:text-white' }, summary.device.os)
          ),
          React.createElement('div', { className: 'flex justify-between' },
            React.createElement('span', { className: 'text-gray-600 dark:text-gray-400' }, 'Browser:'),
            React.createElement('span', { className: 'font-medium text-gray-900 dark:text-white' }, summary.device.browser)
          )
        )
      ),
      
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700' },
        React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 dark:text-white mb-4' }, 'Session Stats'),
        React.createElement('div', { className: 'space-y-3' },
          React.createElement('div', { className: 'flex justify-between' },
            React.createElement('span', { className: 'text-gray-600 dark:text-gray-400' }, 'Total Events:'),
            React.createElement('span', { className: 'font-medium text-gray-900 dark:text-white' }, summary.totalEvents)
          ),
          React.createElement('div', { className: 'flex justify-between' },
            React.createElement('span', { className: 'text-gray-600 dark:text-gray-400' }, 'Errors:'),
            React.createElement('span', { 
              className: `font-medium ${summary.errors > 0 ? 'text-red-600' : 'text-green-600'}` 
            }, summary.errors)
          ),
          React.createElement('div', { className: 'flex justify-between' },
            React.createElement('span', { className: 'text-gray-600 dark:text-gray-400' }, 'Last Activity:'),
            React.createElement('span', { className: 'font-medium text-gray-900 dark:text-white' }, 
              new Date(summary.lastActivity).toLocaleTimeString()
            )
          )
        )
      ),

      // Error indicators
      summary.errors > 0 && React.createElement('div', { 
        className: 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6' 
      },
        React.createElement('div', { className: 'flex items-center mb-2' },
          React.createElement(AlertCircle, { className: 'w-5 h-5 text-red-600 mr-2' }),
          React.createElement('h3', { className: 'text-lg font-semibold text-red-900 dark:text-red-100' }, 'Errors Detected')
        ),
        React.createElement('p', { className: 'text-red-700 dark:text-red-200' }, 
          `${summary.errors} error${summary.errors !== 1 ? 's' : ''} occurred during this session`
        )
      )
    ),

    // Charts and Events
    React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6' },
      categoryData.length > 0 && React.createElement(SimpleBarChart, {
        title: 'Events by Category',
        data: categoryData
      }),
      React.createElement(EventsFeed, { events })
    ),

    // Privacy notice
    React.createElement('div', { className: 'mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg' },
      React.createElement('div', { className: 'flex items-center' },
        React.createElement('div', { className: 'flex-shrink-0' },
          React.createElement(Users, { className: 'w-5 h-5 text-blue-600' })
        ),
        React.createElement('div', { className: 'ml-3' },
          React.createElement('h3', { className: 'text-sm font-medium text-blue-900 dark:text-blue-100' }, 'Privacy Information'),
          React.createElement('p', { className: 'text-sm text-blue-700 dark:text-blue-200 mt-1' }, 
            'Analytics data is stored locally and used only for improving user experience. No personal information is tracked.'
          )
        )
      )
    )
  );
};

export default AnalyticsVisualization;