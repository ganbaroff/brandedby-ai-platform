/**
 * Image Error Boundary Component
 * Catches and handles image loading errors gracefully
 */

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ImageErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Image Error Boundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div className="flex items-center justify-center bg-gray-100 rounded">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Image failed to load</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ImageErrorBoundary;