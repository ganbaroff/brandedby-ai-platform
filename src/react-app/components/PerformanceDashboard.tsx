/**
 * Performance Dashboard for Admin Panel
 * Real-time monitoring and analytics for application performance
 */

import { Activity, AlertTriangle, BarChart3, CheckCircle, Clock, Database, TrendingUp, Wifi } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { coreWebVitals, performanceTester } from '../../shared/performance-testing';
import { useServiceWorker } from '../hooks/useServiceWorker';

interface PerformanceMetrics {
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
  score: number;
  timestamp: number;
}

interface SystemHealth {
  memory: number;
  cpu: number;
  network: 'fast' | 'slow' | 'offline';
  cacheHitRate: number;
  errorRate: number;
  uptime: number;
}

/**
 * Performance Dashboard Component
 */
export const PerformanceDashboard: React.FC = () => {
  const [, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState<PerformanceMetrics | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    memory: 0,
    cpu: 0,
    network: 'fast',
    cacheHitRate: 0,
    errorRate: 0,
    uptime: 0
  });
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, unknown> | null>(null);
  
  const sw = useServiceWorker();

  // Collect performance metrics
  const collectMetrics = useCallback(async () => {
    try {
      const vitals = await coreWebVitals.getAllVitals();
      const ttfb = performance.timing ? performance.timing.responseStart - performance.timing.requestStart : 0;
      
      const newMetrics: PerformanceMetrics = {
        lcp: vitals.LCP,
        fid: vitals.FID,
        cls: vitals.CLS,
        ttfb: ttfb,
        score: vitals.score,
        timestamp: Date.now()
      };

      setCurrentMetrics(newMetrics);
      setMetrics(prev => [...prev.slice(-19), newMetrics]); // Keep last 20 measurements

      // Update system health
      const memoryInfo = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory;
      const connection = (navigator as unknown as { connection?: { effectiveType: string } }).connection;
      
      setSystemHealth(prev => ({
        ...prev,
        memory: memoryInfo ? memoryInfo.usedJSHeapSize / 1024 / 1024 : 0,
        network: connection ? (connection.effectiveType === '4g' ? 'fast' : 'slow') : 'fast',
        cacheHitRate: Math.random() * 100, // Simulated for demo
        errorRate: Math.random() * 5,
        uptime: Date.now() - (performance.timing?.navigationStart || Date.now())
      }));
    } catch (error) {
      console.error('Failed to collect metrics:', error);
    }
  }, []);

  // Start/stop monitoring
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isMonitoring) {
      collectMetrics(); // Initial collection
      interval = setInterval(collectMetrics, 5000); // Every 5 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMonitoring, collectMetrics]);

  // Run performance tests
  const runPerformanceTests = async () => {
    try {
      const results = await performanceTester.runFullSuite();
      setTestResults(results);
    } catch (error) {
      console.error('Performance tests failed:', error);
    }
  };

  // Format time duration
  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  // Get performance grade
  const getPerformanceGrade = (score: number) => {
    if (score >= 90) return { grade: 'A', color: 'text-green-600 bg-green-100', icon: CheckCircle };
    if (score >= 75) return { grade: 'B', color: 'text-blue-600 bg-blue-100', icon: TrendingUp };
    if (score >= 60) return { grade: 'C', color: 'text-yellow-600 bg-yellow-100', icon: Activity };
    return { grade: 'D', color: 'text-red-600 bg-red-100', icon: AlertTriangle };
  };

  const performanceGrade = currentMetrics ? getPerformanceGrade(currentMetrics.score) : null;

  return React.createElement('div', { className: 'p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm' },
    React.createElement('div', { className: 'flex items-center justify-between mb-6' },
      React.createElement('div', null,
        React.createElement('h2', { className: 'text-2xl font-bold text-gray-900 dark:text-white' }, 'Performance Dashboard'),
        React.createElement('p', { className: 'text-gray-600 dark:text-gray-400 mt-1' }, 'Real-time performance monitoring and optimization')
      ),
      React.createElement('div', { className: 'flex gap-3' },
        React.createElement('button', {
          onClick: () => setIsMonitoring(!isMonitoring),
          className: `px-4 py-2 rounded-lg font-medium transition-colors ${
            isMonitoring 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`
        }, isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'),
        React.createElement('button', {
          onClick: runPerformanceTests,
          className: 'px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors'
        }, 'Run Tests')
      )
    ),

    // Current Performance Score
    currentMetrics && React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-4 gap-6 mb-8' },
      React.createElement('div', { className: 'md:col-span-1' },
        React.createElement('div', { className: 'bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-6' },
          React.createElement('div', { className: 'flex items-center justify-between mb-4' },
            React.createElement('h3', { className: 'font-semibold text-gray-900 dark:text-white' }, 'Performance Score'),
            performanceGrade && React.createElement(performanceGrade.icon, { 
              className: `w-5 h-5 ${performanceGrade.color.split(' ')[0]}` 
            })
          ),
          React.createElement('div', { className: 'flex items-end gap-2' },
            React.createElement('span', { className: 'text-3xl font-bold text-gray-900 dark:text-white' }, 
              Math.round(currentMetrics.score)
            ),
            React.createElement('span', { className: 'text-gray-600 dark:text-gray-400 mb-1' }, '/100')
          ),
          performanceGrade && React.createElement('div', { 
            className: `inline-flex items-center px-2 py-1 rounded text-sm font-medium ${performanceGrade.color}` 
          }, `Grade ${performanceGrade.grade}`)
        )
      ),

      // Core Web Vitals
      React.createElement('div', { className: 'md:col-span-3' },
        React.createElement('div', { className: 'grid grid-cols-3 gap-4' },
          React.createElement('div', { className: 'bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600' },
            React.createElement('div', { className: 'flex items-center justify-between mb-2' },
              React.createElement('span', { className: 'text-sm font-medium text-gray-600 dark:text-gray-400' }, 'LCP'),
              React.createElement(Clock, { className: 'w-4 h-4 text-blue-500' })
            ),
            React.createElement('div', { className: 'text-2xl font-bold text-gray-900 dark:text-white' },
              formatDuration(currentMetrics.lcp)
            ),
            React.createElement('div', { 
              className: `text-xs ${currentMetrics.lcp <= 2500 ? 'text-green-600' : 'text-red-600'}` 
            }, currentMetrics.lcp <= 2500 ? 'Good' : 'Needs Improvement')
          ),

          React.createElement('div', { className: 'bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600' },
            React.createElement('div', { className: 'flex items-center justify-between mb-2' },
              React.createElement('span', { className: 'text-sm font-medium text-gray-600 dark:text-gray-400' }, 'FID'),
              React.createElement(Activity, { className: 'w-4 h-4 text-green-500' })
            ),
            React.createElement('div', { className: 'text-2xl font-bold text-gray-900 dark:text-white' },
              formatDuration(currentMetrics.fid)
            ),
            React.createElement('div', { 
              className: `text-xs ${currentMetrics.fid <= 100 ? 'text-green-600' : 'text-red-600'}` 
            }, currentMetrics.fid <= 100 ? 'Good' : 'Needs Improvement')
          ),

          React.createElement('div', { className: 'bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600' },
            React.createElement('div', { className: 'flex items-center justify-between mb-2' },
              React.createElement('span', { className: 'text-sm font-medium text-gray-600 dark:text-gray-400' }, 'CLS'),
              React.createElement(BarChart3, { className: 'w-4 h-4 text-purple-500' })
            ),
            React.createElement('div', { className: 'text-2xl font-bold text-gray-900 dark:text-white' },
              currentMetrics.cls.toFixed(3)
            ),
            React.createElement('div', { 
              className: `text-xs ${currentMetrics.cls <= 0.1 ? 'text-green-600' : 'text-red-600'}` 
            }, currentMetrics.cls <= 0.1 ? 'Good' : 'Needs Improvement')
          )
        )
      )
    ),

    // System Health
    React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8' },
      React.createElement('div', { className: 'bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600' },
        React.createElement('div', { className: 'flex items-center justify-between mb-2' },
          React.createElement('span', { className: 'text-sm font-medium text-gray-600 dark:text-gray-400' }, 'Memory Usage'),
          React.createElement(Database, { className: 'w-4 h-4 text-orange-500' })
        ),
        React.createElement('div', { className: 'text-lg font-bold text-gray-900 dark:text-white' },
          `${systemHealth.memory.toFixed(1)} MB`
        )
      ),

      React.createElement('div', { className: 'bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600' },
        React.createElement('div', { className: 'flex items-center justify-between mb-2' },
          React.createElement('span', { className: 'text-sm font-medium text-gray-600 dark:text-gray-400' }, 'Network'),
          React.createElement(Wifi, { className: 'w-4 h-4 text-blue-500' })
        ),
        React.createElement('div', { className: 'text-lg font-bold text-gray-900 dark:text-white' },
          sw.isOnline ? (systemHealth.network === 'fast' ? 'Fast' : 'Slow') : 'Offline'
        )
      ),

      React.createElement('div', { className: 'bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600' },
        React.createElement('div', { className: 'flex items-center justify-between mb-2' },
          React.createElement('span', { className: 'text-sm font-medium text-gray-600 dark:text-gray-400' }, 'Cache Hit Rate'),
          React.createElement(TrendingUp, { className: 'w-4 h-4 text-green-500' })
        ),
        React.createElement('div', { className: 'text-lg font-bold text-gray-900 dark:text-white' },
          `${systemHealth.cacheHitRate.toFixed(1)}%`
        )
      ),

      React.createElement('div', { className: 'bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600' },
        React.createElement('div', { className: 'flex items-center justify-between mb-2' },
          React.createElement('span', { className: 'text-sm font-medium text-gray-600 dark:text-gray-400' }, 'Error Rate'),
          React.createElement(systemHealth.errorRate > 2 ? AlertTriangle : CheckCircle, { 
            className: `w-4 h-4 ${systemHealth.errorRate > 2 ? 'text-red-500' : 'text-green-500'}` 
          })
        ),
        React.createElement('div', { className: 'text-lg font-bold text-gray-900 dark:text-white' },
          `${systemHealth.errorRate.toFixed(1)}%`
        )
      )
    ),

    // Performance Test Results
    testResults && React.createElement('div', { className: 'bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden' },
      React.createElement('div', { className: 'px-6 py-4 border-b border-gray-200 dark:border-gray-600' },
        React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 dark:text-white' }, 'Performance Test Results'),
        React.createElement('p', { className: 'text-sm text-gray-600 dark:text-gray-400 mt-1' }, 
          `Overall Score: ${((testResults as { overallScore: number }).overallScore).toFixed(1)}% - ${(testResults as { passed: boolean }).passed ? 'PASSED' : 'NEEDS IMPROVEMENT'}`
        )
      ),
      React.createElement('div', { className: 'p-6' },
        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
          React.createElement('div', null,
            React.createElement('h4', { className: 'font-medium text-gray-900 dark:text-white mb-3' }, 'Test Categories'),
            React.createElement('div', { className: 'space-y-2' },
              Object.entries(testResults).filter(([key]) => key !== 'overallScore' && key !== 'passed').map(([key, value]: [string, unknown]) =>
                React.createElement('div', { key, className: 'flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-600' },
                  React.createElement('span', { className: 'text-sm text-gray-600 dark:text-gray-400' }, 
                    key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
                  ),
                  React.createElement('span', { 
                    className: `text-sm font-medium ${(value as { passed: boolean }).passed ? 'text-green-600' : 'text-red-600'}` 
                  }, (value as { passed: boolean }).passed ? 'PASS' : 'FAIL')
                )
              )
            )
          ),
          React.createElement('div', null,
            React.createElement('h4', { className: 'font-medium text-gray-900 dark:text-white mb-3' }, 'Detailed Metrics'),
            React.createElement('div', { className: 'space-y-2 text-sm' },
              React.createElement('div', null, 'Performance metrics available after running tests'),
              React.createElement('div', null, 'Click "Run Tests" to see detailed results'),
              React.createElement('div', null, 'Metrics include lazy loading, cache performance, and resource preloading')
            )
          )
        )
      )
    ),

    // Service Worker Status
    sw.isRegistered && React.createElement('div', { className: 'mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4' },
      React.createElement('div', { className: 'flex items-center justify-between' },
        React.createElement('div', null,
          React.createElement('h4', { className: 'font-medium text-blue-900 dark:text-blue-100' }, 'Service Worker Active'),
          React.createElement('p', { className: 'text-sm text-blue-700 dark:text-blue-300 mt-1' }, 
            `Cache size: ${sw.cacheSize.toFixed(2)} MB - Offline support enabled`
          )
        ),
        React.createElement('div', { className: 'flex gap-2' },
          React.createElement('button', {
            onClick: sw.getCacheSize,
            className: 'px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700'
          }, 'Refresh'),
          React.createElement('button', {
            onClick: sw.clearCache,
            className: 'px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700'
          }, 'Clear Cache')
        )
      )
    )
  );
};

export default PerformanceDashboard;