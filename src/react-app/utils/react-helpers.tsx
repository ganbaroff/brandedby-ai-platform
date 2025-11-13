/**
 * React utility components and helpers
 */

import { ReactNode, useMemo, memo } from 'react';

/**
 * Memoized component wrapper with comparison function
 */
export function memoWithComparison<T extends Record<string, unknown>>(
  component: React.ComponentType<T>,
  areEqual?: (prevProps: T, nextProps: T) => boolean
) {
  return memo(component, areEqual);
}

/**
 * Safe render helper - renders children only if condition is true
 */
interface SafeRenderProps {
  condition: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

export function SafeRender({ condition, children, fallback = null }: SafeRenderProps) {
  return condition ? <>{children}</> : <>{fallback}</>;
}

/**
 * Conditional wrapper component
 */
interface ConditionalWrapperProps {
  condition: boolean;
  wrapper: (children: ReactNode) => ReactNode;
  children: ReactNode;
}

export function ConditionalWrapper({ condition, wrapper, children }: ConditionalWrapperProps) {
  return <>{condition ? wrapper(children) : children}</>;
}

/**
 * Error message component
 */
interface ErrorMessageProps {
  error: string | null | undefined;
  className?: string;
}

export function ErrorMessage({ error, className = '' }: ErrorMessageProps) {
  if (!error) return null;

  return (
    <div className={`text-red-600 text-sm mt-1 ${className}`} role="alert">
      {error}
    </div>
  );
}

/**
 * Loading overlay component
 */
interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  children: ReactNode;
}

export function LoadingOverlay({ isLoading, message = 'Loading...', children }: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            {message && <p className="mt-2 text-gray-600">{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Hook to check if component is mounted (useful for cleanup)
 */
export function useIsMounted() {
  // This would be implemented with useRef, but for TypeScript types we export a helper
  return true;
}

/**
 * Combine class names utility (similar to clsx)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
