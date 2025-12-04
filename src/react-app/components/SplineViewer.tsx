import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    SplineViewerLoaded?: boolean;
  }
}

const loadSplineRuntime = () => {
  return new Promise<void>((resolve, reject) => {
    // Check if already loaded
    if (window.SplineViewerLoaded || customElements.get('spline-viewer')) {
      window.SplineViewerLoaded = true;
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.9.28/build/spline-viewer.js';
    
    // Suppress WebGL errors during initialization
    const originalError = console.error;
    console.error = (...args: unknown[]) => {
      // Filter out WebGL framebuffer errors
      const message = String(args[0] || '');
      if (message.includes('GL_INVALID_FRAMEBUFFER_OPERATION') || 
          message.includes('Framebuffer is incomplete')) {
        return;
      }
      originalError.apply(console, args);
    };
    
    script.onload = () => {
      // Wait a bit for custom element to register
      setTimeout(() => {
        console.error = originalError;
        if (customElements.get('spline-viewer')) {
          window.SplineViewerLoaded = true;
          resolve();
        } else {
          reject(new Error('Spline viewer custom element not registered'));
        }
      }, 100);
    };
    
    script.onerror = () => {
      console.error = originalError;
      reject(new Error('Failed to load Spline runtime'));
    };
    
    document.head.appendChild(script);
  });
};

type SplineMode = 'web' | 'react';

export function SplineViewer({ url, mode = 'web', className }: { url: string; mode?: SplineMode; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let splineViewer: HTMLElement | null = null;
    const container = containerRef.current;

    const initSpline = async () => {
      if (!mounted) return;
      
      setIsLoading(true);
      setError(null);

      try {
        await loadSplineRuntime();
        
        if (!mounted || !container) return;

        // Create spline-viewer element
        splineViewer = document.createElement('spline-viewer');
        splineViewer.setAttribute('url', url);
        splineViewer.setAttribute('loading-anim-type', 'spinner-small-dark');
        splineViewer.style.width = '100%';
        splineViewer.style.height = '100%';

        // Add to container
        container.innerHTML = '';
        container.appendChild(splineViewer);

        // Wait for load
        await new Promise<void>((resolve) => {
          const checkLoad = () => {
            if (splineViewer && splineViewer.shadowRoot) {
              resolve();
            } else {
              setTimeout(checkLoad, 100);
            }
          };
          checkLoad();
        });

        if (mounted) {
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to initialize Spline:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load 3D scene');
          setIsLoading(false);
        }
      }
    };

    initSpline();

    return () => {
      mounted = false;
      if (splineViewer && container) {
        container.removeChild(splineViewer);
      }
    };
  }, [url, mode]);

  return (
    <div className={`relative ${className || ''}`}>
      <div ref={containerRef} className="w-full h-full" />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SplineViewer;
