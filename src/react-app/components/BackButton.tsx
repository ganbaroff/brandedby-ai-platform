import { ArrowLeft } from "lucide-react";
import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  /** Custom fallback route if no history */
  fallbackRoute?: string;
  /** Custom label text */
  label?: string;
  /** Additional CSS classes */
  className?: string;
  /** Variant style */
  variant?: 'default' | 'minimal' | 'floating';
}

const BackButton = memo(function BackButton({ 
  fallbackRoute = '/', 
  label = 'Back',
  className = '',
  variant = 'default'
}: BackButtonProps) {
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Fallback to home or custom route
      navigate(fallbackRoute);
    }
  }, [navigate, fallbackRoute]);

  const variantClasses = {
    default: 'inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow transition-all duration-200',
    minimal: 'inline-flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-gray-900 transition-colors duration-200',
    floating: 'fixed top-20 left-4 z-40 inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl text-gray-700 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-200'
  };

  return (
    <button
      onClick={handleBack}
      className={`${variantClasses[variant]} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${className}`}
      aria-label="Go back to previous page"
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="font-medium text-sm">{label}</span>
    </button>
  );
});

export default BackButton;
