/**
 * Skeleton Loading Components
 * Modern shimmer loading states for better UX
 */

import { memo } from "react";

// Base Skeleton Component
export const Skeleton = memo(function Skeleton({ 
  className = "",
  variant = "rectangular"
}: {
  className?: string;
  variant?: "rectangular" | "circular" | "text";
}) {
  const baseClasses = "animate-pulse bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-[length:200%_100%]";
  
  const variantClasses = {
    rectangular: "rounded-lg",
    circular: "rounded-full",
    text: "rounded-md h-4"
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{
        animation: 'shimmer 1.5s ease-in-out infinite'
      }}
    />
  );
});

// Celebrity Card Skeleton
export const CelebrityCardSkeleton = memo(function CelebrityCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" variant="text" />
        <Skeleton className="h-4 w-1/2" variant="text" />
        
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="w-3 h-3" variant="circular" />
            ))}
          </div>
          <Skeleton className="h-4 w-8" variant="text" />
        </div>
      </div>
    </div>
  );
});

// Feature Card Skeleton
export const FeatureCardSkeleton = memo(function FeatureCardSkeleton() {
  return (
    <div className="p-8 bg-white rounded-3xl shadow-lg">
      <Skeleton className="w-16 h-16 mb-6" />
      <Skeleton className="h-8 w-3/4 mb-4" variant="text" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" variant="text" />
        <Skeleton className="h-4 w-5/6" variant="text" />
        <Skeleton className="h-4 w-4/6" variant="text" />
      </div>
    </div>
  );
});

// Pricing Card Skeleton  
export const PricingCardSkeleton = memo(function PricingCardSkeleton() {
  return (
    <div className="p-8 bg-white rounded-3xl shadow-2xl">
      <div className="text-center mb-6">
        <Skeleton className="h-8 w-20 mx-auto mb-2" variant="text" />
        <Skeleton className="h-12 w-16 mx-auto mb-2" variant="text" />
        <Skeleton className="h-4 w-24 mx-auto" variant="text" />
      </div>

      <div className="space-y-3 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="w-5 h-5" variant="circular" />
            <Skeleton className="h-4 flex-1" variant="text" />
          </div>
        ))}
      </div>

      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  );
});

// Blog Card Skeleton
export const BlogCardSkeleton = memo(function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <Skeleton className="aspect-video w-full" />
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-full" variant="text" />
        <Skeleton className="h-4 w-5/6" variant="text" />
        
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" variant="text" />
          <Skeleton className="h-3 w-4/5" variant="text" />
          <Skeleton className="h-3 w-3/5" variant="text" />
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-4 w-20" variant="text" />
          <Skeleton className="h-4 w-16" variant="text" />
        </div>
      </div>
    </div>
  );
});

// Hero Section Skeleton
export const HeroSkeleton = memo(function HeroSkeleton() {
  return (
    <section className="relative pt-24 pb-16 overflow-hidden min-h-[90vh] flex items-center bg-neutral-50">
      <div className="relative container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Skeleton className="h-8 w-48 rounded-full" />
            
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" variant="text" />
              <Skeleton className="h-16 w-5/6" variant="text" />
            </div>
            
            <div className="space-y-2">
              <Skeleton className="h-6 w-full" variant="text" />
              <Skeleton className="h-6 w-4/5" variant="text" />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Skeleton className="h-14 w-48 rounded-2xl" />
              <Skeleton className="h-14 w-40 rounded-2xl" />
            </div>
            
            <div className="flex items-center gap-8 pt-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="text-center">
                  <Skeleton className="h-8 w-12 mx-auto mb-1" variant="text" />
                  <Skeleton className="h-4 w-16 mx-auto" variant="text" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <Skeleton className="aspect-video w-full rounded-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
});

// Grid Skeletons
export const CelebrityGridSkeleton = memo(function CelebrityGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {[...Array(count)].map((_, i) => (
        <CelebrityCardSkeleton key={i} />
      ))}
    </div>
  );
});

export const FeatureGridSkeleton = memo(function FeatureGridSkeleton() {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {[...Array(3)].map((_, i) => (
        <FeatureCardSkeleton key={i} />
      ))}
    </div>
  );
});

export const PricingGridSkeleton = memo(function PricingGridSkeleton() {
  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {[...Array(3)].map((_, i) => (
        <PricingCardSkeleton key={i} />
      ))}
    </div>
  );
});

export const BlogGridSkeleton = memo(function BlogGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(count)].map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
});