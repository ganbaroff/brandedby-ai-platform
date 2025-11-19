/**
 * Performance Monitor Component
 * Real-time performance metrics and optimization suggestions
 */

import { PerformanceCache, PerformanceMonitor } from "@/shared/performance-optimizer";
import { Activity, AlertTriangle, BarChart3, Clock, Zap } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";

interface PerformanceData {
  fps: number;
  memory: number;
  loadTime: number;
  cacheSize: number;
  warnings: string[];
}

const PerformanceWidget = memo(function PerformanceWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    fps: 60,
    memory: 0,
    loadTime: 0,
    cacheSize: 0,
    warnings: []
  });
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Monitor FPS
  const monitorFPS = useCallback(() => {
    let frames = 0;
    let lastTime = performance.now();

    const countFrames = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime));
        setPerformanceData(prev => ({ ...prev, fps }));
        
        frames = 0;
        lastTime = currentTime;
      }
      
      if (isMonitoring) {
        requestAnimationFrame(countFrames);
      }
    };
    
    requestAnimationFrame(countFrames);
  }, [isMonitoring]);

  // Monitor memory usage
  const monitorMemory = useCallback(() => {
    if ('memory' in performance) {
      const memInfo = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory;
      const memoryMB = Math.round((memInfo?.usedJSHeapSize || 0) / 1024 / 1024);
      setPerformanceData(prev => ({ ...prev, memory: memoryMB }));
    }
  }, []);

  // Check performance warnings
  const checkWarnings = useCallback(() => {
    const warnings: string[] = [];
    const stats = PerformanceMonitor.getStats();
    
    // Check slow operations
    Object.entries(stats).forEach(([name, stat]) => {
      if (stat.avg > 100) {
        warnings.push(`Slow operation: ${name} (${stat.avg.toFixed(0)}ms avg)`);
      }
    });
    
    // Check memory usage
    if (performanceData.memory > 100) {
      warnings.push(`High memory usage: ${performanceData.memory}MB`);
    }
    
    // Check FPS
    if (performanceData.fps < 30) {
      warnings.push(`Low FPS detected: ${performanceData.fps}`);
    }
    
    setPerformanceData(prev => ({ ...prev, warnings }));
  }, [performanceData.memory, performanceData.fps]);

  // Update performance data
  useEffect(() => {
    if (!isMonitoring) return;

    const updateMetrics = () => {
      monitorMemory();
      checkWarnings();
      
      // Update cache size
      const cacheStats = PerformanceCache.getStats();
      setPerformanceData(prev => ({ ...prev, cacheSize: cacheStats.size }));
      
      // Update load time
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;
        setPerformanceData(prev => ({ ...prev, loadTime: Math.round(loadTime) }));
      }
    };

    const interval = setInterval(updateMetrics, 5000); // Увеличил интервал до 5 секунд

    return () => clearInterval(interval);
  }, [isMonitoring, monitorMemory, checkWarnings]);

  // Start/stop monitoring
  useEffect(() => {
    if (isMonitoring) {
      monitorFPS();
    }
  }, [isMonitoring, monitorFPS]);

  const getPerformanceColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'text-green-600';
    if (value <= thresholds.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 z-30">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Performance Monitor"
        className={`p-3 rounded-full shadow-lg transition-colors ${
          isMonitoring 
            ? 'bg-green-600 text-white animate-pulse' 
            : 'bg-gray-600 text-white hover:bg-gray-700'
        }`}
      >
        <Activity className="h-5 w-5" />
      </button>

      {/* Performance Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border p-4 w-80 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Performance Monitor
            </h3>
            <button
              onClick={toggleMonitoring}
              className={`px-3 py-1 text-sm rounded ${
                isMonitoring
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {isMonitoring ? 'Stop' : 'Start'}
            </button>
          </div>

          {/* Metrics */}
          <div className="space-y-3">
            {/* FPS */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">FPS</span>
              <span className={`text-sm font-bold ${getPerformanceColor(60 - performanceData.fps, { good: 0, warning: 30 })}`}>
                {performanceData.fps}
              </span>
            </div>

            {/* Memory */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Memory</span>
              <span className={`text-sm font-bold ${getPerformanceColor(performanceData.memory, { good: 50, warning: 100 })}`}>
                {performanceData.memory}MB
              </span>
            </div>

            {/* Load Time */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Load Time</span>
              <span className={`text-sm font-bold ${getPerformanceColor(performanceData.loadTime, { good: 1000, warning: 3000 })}`}>
                {performanceData.loadTime}ms
              </span>
            </div>

            {/* Cache Size */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Cache Items</span>
              <span className="text-sm font-bold text-blue-600">
                {performanceData.cacheSize}
              </span>
            </div>
          </div>

          {/* Performance Score */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Performance Score</span>
              <Zap className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    performanceData.warnings.length === 0
                      ? 'bg-green-500'
                      : performanceData.warnings.length <= 2
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{
                    width: `${Math.max(20, 100 - (performanceData.warnings.length * 20))}%`
                  }}
                />
              </div>
              <span className="text-xs font-medium text-gray-600">
                {Math.max(20, 100 - (performanceData.warnings.length * 20))}%
              </span>
            </div>
          </div>

          {/* Warnings */}
          {performanceData.warnings.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">Performance Issues</span>
              </div>
              <div className="space-y-1">
                {performanceData.warnings.map((warning, index) => (
                  <div key={index} className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                    {warning}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-4 space-y-2">
            <button
              onClick={() => {
                PerformanceCache.clear();
                setPerformanceData(prev => ({ ...prev, cacheSize: 0 }));
              }}
              className="w-full px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Clear Cache
            </button>
            <button
              onClick={() => {
                PerformanceMonitor.logSlowOperations(50);
              }}
              className="w-full px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
            >
              Log Performance Stats
            </button>
          </div>

          {/* Development Notice */}
          <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
            <Clock className="h-3 w-3 inline mr-1" />
            Development mode only - will be removed in production
          </div>
        </div>
      )}
    </div>
  );
});

export default PerformanceWidget;