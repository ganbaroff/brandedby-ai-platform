/**
 * Breadcrumbs Navigation Component
 * Clean breadcrumb navigation with icons and animations
 */

import { ChevronRight, Home } from "lucide-react";
import { memo } from "react";
import { Link, useLocation } from "react-router";

interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs = memo(function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const location = useLocation();
  
  // Auto-generate breadcrumbs from URL if items not provided
  const breadcrumbItems = items || generateBreadcrumbsFromPath(location.pathname);
  
  if (breadcrumbItems.length <= 1) return null;

  return (
    <nav className={`${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          const isFirst = index === 0;
          
          return (
            <li key={item.path} className="flex items-center">
              {/* Separator */}
              {!isFirst && (
                <ChevronRight className="w-4 h-4 text-neutral-400 mx-2" />
              )}
              
              {isLast ? (
                // Current page (not clickable)
                <span className="flex items-center gap-2 text-neutral-600 font-medium">
                  {item.icon}
                  {item.label}
                </span>
              ) : (
                // Clickable breadcrumb
                <Link
                  to={item.path}
                  className="flex items-center gap-2 text-neutral-500 hover:text-primary-600 transition-colors duration-200 group"
                >
                  {item.icon && (
                    <span className="group-hover:text-primary-600 transition-colors">
                      {item.icon}
                    </span>
                  )}
                  <span className="hover:underline">{item.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

// Auto-generate breadcrumbs from pathname
function generateBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  const paths = pathname.split('/').filter(Boolean);
  
  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Home',
      path: '/',
      icon: <Home className="w-4 h-4" />
    }
  ];

  let currentPath = '';
  
  paths.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Convert path segments to readable labels
    let label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Special cases for known routes
    const routeLabels: Record<string, string> = {
      'celebrities': 'Celebrities',
      'celebrity': 'Celebrity',
      'selfie-upload': 'Upload Selfie',
      'payment': 'Payment',
      'dashboard': 'Dashboard',
      'admin': 'Admin',
      'admin-panel': 'Admin Panel',
      'blog': 'Blog'
    };

    if (routeLabels[segment]) {
      label = routeLabels[segment];
    }

    // For dynamic routes (like /celebrity/123), show a generic label
    if (index === paths.length - 1 && /^\d+$/.test(segment)) {
      label = 'Details';
    }

    breadcrumbs.push({
      label,
      path: currentPath
    });
  });

  return breadcrumbs;
}

// Breadcrumb container with background
export const BreadcrumbContainer = memo(function BreadcrumbContainer({
  children,
  title,
  subtitle,
  className = ""
}: {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={`bg-neutral-50 border-b border-neutral-200 ${className}`}>
      <div className="container mx-auto px-4 max-w-7xl py-6">
        {children}
        
        {(title || subtitle) && (
          <div className="mt-4">
            {title && (
              <h1 className="text-3xl font-bold text-neutral-900">{title}</h1>
            )}
            {subtitle && (
              <p className="text-neutral-600 mt-2">{subtitle}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

export default Breadcrumbs;