import { memo, useEffect, useState } from "react";

interface ScrollProgressIndicatorProps {
  /** Position on screen */
  position?: 'left' | 'right';
  /** Show percentage text */
  showPercentage?: boolean;
  /** Custom color */
  color?: string;
}

const ScrollProgressIndicator = memo(function ScrollProgressIndicator({ 
  position = 'right',
  showPercentage = false,
  color = 'from-blue-600 to-purple-600'
}: ScrollProgressIndicatorProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      
      // Calculate scroll percentage
      const totalScrollableHeight = documentHeight - windowHeight;
      const progress = (scrollTop / totalScrollableHeight) * 100;
      
      setScrollProgress(Math.min(100, Math.max(0, progress)));
      
      // Show indicator after scrolling 50px
      setIsVisible(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const positionClasses = position === 'left' ? 'left-4' : 'right-4';

  return (
    <div
      className={`fixed ${positionClasses} top-1/2 -translate-y-1/2 z-40 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
      }`}
      style={{ pointerEvents: 'none' }}
    >
      {/* Container */}
      <div className="relative flex items-center gap-3">
        {/* Progress Bar */}
        <div className="relative w-1 h-48 bg-gray-200 rounded-full overflow-hidden shadow-sm">
          {/* Animated gradient fill */}
          <div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${color} transition-all duration-300 ease-out rounded-full`}
            style={{ height: `${scrollProgress}%` }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-white/30 animate-pulse" />
          </div>
          
          {/* Animated dot at current position */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-gradient-to-br ${color} rounded-full shadow-lg transition-all duration-300`}
            style={{ bottom: `${scrollProgress}%`, transform: 'translate(-50%, 50%)' }}
          >
            <div className="absolute inset-0 bg-white/40 rounded-full animate-ping" />
          </div>
        </div>

        {/* Percentage indicator (optional) */}
        {showPercentage && (
          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-md border border-gray-200">
            <span className={`text-xs font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
              {Math.round(scrollProgress)}%
            </span>
          </div>
        )}
      </div>

      {/* Section markers (optional - показывает ключевые точки страницы) */}
      <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between pointer-events-none">
        {[0, 25, 50, 75, 100].map((marker) => (
          <div
            key={marker}
            className={`w-2 h-0.5 rounded-full transition-all duration-200 ${
              scrollProgress >= marker ? 'bg-gray-400' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
});

export default ScrollProgressIndicator;
