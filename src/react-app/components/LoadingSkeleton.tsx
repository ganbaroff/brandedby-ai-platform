/**
 * Loading Skeleton Component - Autonomous optimization
 * Improves perceived performance during data loading
 */

import { memo } from "react";

interface LoadingSkeletonProps {
  count?: number;
  className?: string;
}

const LoadingSkeleton = memo(function LoadingSkeleton({ 
  count = 3, 
  className = "h-4 bg-gray-200 rounded" 
}: LoadingSkeletonProps) {
  return (
    <div className="animate-pulse space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={className}></div>
      ))}
    </div>
  );
});

export default LoadingSkeleton;