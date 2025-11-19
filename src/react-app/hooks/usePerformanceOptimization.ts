/**
 * Performance Optimization Hooks
 * Reusable hooks for optimizing React components performance
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Hook for debouncing values to prevent excessive re-renders
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for throttling function calls
 */
export function useThrottle<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastExecRef = useRef<number>(0);

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastExecRef.current > delay) {
      func(...args);
      lastExecRef.current = now;
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        func(...args);
        lastExecRef.current = Date.now();
      }, delay - (now - lastExecRef.current));
    }
  }, [func, delay]) as T;
}

/**
 * Hook for memoizing expensive computations with dependencies
 */
export function useExpensiveMemo<T>(
  factory: () => T,
  deps: React.DependencyList,
  shouldRecompute?: (prevDeps: React.DependencyList, nextDeps: React.DependencyList) => boolean
): T {
  const prevDepsRef = useRef<React.DependencyList | undefined>(undefined);
  const memoizedValue = useRef<T | undefined>(undefined);

  const needsRecompute = useMemo(() => {
    if (!prevDepsRef.current) return true;
    
    if (shouldRecompute) {
      return shouldRecompute(prevDepsRef.current, deps);
    }
    
    return deps.some((dep, index) => dep !== prevDepsRef.current![index]);
  }, [deps, shouldRecompute]);

  if (needsRecompute) {
    memoizedValue.current = factory();
    prevDepsRef.current = deps;
  }

  return memoizedValue.current!;
}

/**
 * Hook for optimizing re-renders by stabilizing object references
 */
export function useStableCallback<T extends (...args: unknown[]) => unknown>(
  callback: T
): T {
  const callbackRef = useRef<T>(callback);
  callbackRef.current = callback;

  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args);
  }, []) as T;
}

/**
 * Hook for memoizing arrays and objects with deep comparison
 */
export function useDeepMemo<T>(value: T): T {
  const ref = useRef<T>(value);

  const areEqual = useMemo(() => {
    return JSON.stringify(ref.current) === JSON.stringify(value);
  }, [value]);

  if (!areEqual) {
    ref.current = value;
  }

  return ref.current;
}

/**
 * Hook for tracking component render count (development only)
 */
export function useRenderCount(componentName: string): number {
  const renderCount = useRef(0);
  renderCount.current++;

  if (process.env.NODE_ENV === 'development') {
    console.log(`${componentName} rendered ${renderCount.current} times`);
  }

  return renderCount.current;
}

/**
 * Hook for lazy initialization of expensive values
 */
export function useLazyValue<T>(initializer: () => T): T {
  const [value] = useState(initializer);
  return value;
}

/**
 * Hook for optimizing list rendering with virtualization hints
 */
export function useVirtualizedList<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  return useMemo(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const bufferCount = Math.floor(visibleCount * 0.5);
    
    return {
      visibleCount,
      bufferCount,
      totalHeight: items.length * itemHeight,
      getVisibleRange: (scrollTop: number) => {
        const startIndex = Math.floor(scrollTop / itemHeight);
        const endIndex = Math.min(
          startIndex + visibleCount + bufferCount,
          items.length
        );
        
        return {
          start: Math.max(0, startIndex - bufferCount),
          end: endIndex,
          items: items.slice(
            Math.max(0, startIndex - bufferCount),
            endIndex
          )
        };
      }
    };
  }, [items, itemHeight, containerHeight]);
}

/**
 * Hook for performance monitoring
 */
export function usePerformanceMonitor(componentName: string) {
  const renderStartTime = useRef<number | undefined>(undefined);

  useEffect(() => {
    renderStartTime.current = performance.now();
  });

  useEffect(() => {
    if (renderStartTime.current) {
      const renderTime = performance.now() - renderStartTime.current;
      if (renderTime > 16) { // More than one frame
        console.warn(`${componentName} slow render: ${renderTime.toFixed(2)}ms`);
      }
    }
  });

  const logPerformance = useCallback((operationName: string, operation: () => void) => {
    const start = performance.now();
    operation();
    const duration = performance.now() - start;
    
    if (duration > 10) {
      console.warn(`${componentName}.${operationName} took ${duration.toFixed(2)}ms`);
    }
  }, [componentName]);

  return { logPerformance };
}