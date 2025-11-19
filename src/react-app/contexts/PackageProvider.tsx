/**
 * Package Provider Component
 * Handles package selection state and logic
 */

import logger from "@/shared/logger";
import { ReactNode, useCallback, useState } from "react";
import { PackageContext, type Package, type PackageContextType } from "./PackageContext";

interface PackageProviderProps {
  children: ReactNode;
}

export function PackageProvider({ children }: PackageProviderProps) {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processingPackage, setProcessingPackage] = useState<string | null>(null);

  const selectPackage = useCallback((pkg: Package) => {
    // Prevent duplicate selections
    if (processingPackage || (selectedPackage && selectedPackage.name === pkg.name)) {
      return;
    }

    setProcessingPackage(pkg.name);
    setIsLoading(true);

    // Comprehensive logging with package details
    logger.logUserAction('package_selection_initiated', {
      packageName: pkg.name,
      price: pkg.price,
      duration: pkg.duration,
      popular: pkg.popular,
      previousSelection: selectedPackage?.name || null,
      timestamp: new Date().toISOString(),
      sessionId: crypto.randomUUID(),
      userAgent: navigator.userAgent,
      screenSize: `${screen.width}x${screen.height}`,
      page: 'home',
      section: 'pricing'
    });

    // Realistic processing simulation with success/error handling
    const processingTime = 1000 + Math.random() * 1500; // 1-2.5 seconds
    
    setTimeout(() => {
      // Success rate 95% (simulate occasional failures)
      const success = Math.random() > 0.05;
      
      if (success) {
        setSelectedPackage(pkg);
        setIsLoading(false);
        setProcessingPackage(null);

        logger.info('Package selection completed successfully', {
          packageName: pkg.name,
          price: pkg.price,
          processingTime: `${processingTime}ms`,
          success: true
        });

        // Trigger analytics for popular package
        if (pkg.popular) {
          logger.logUserAction('popular_package_selected', {
            packageName: pkg.name,
            conversionLikelihood: 'high',
            recommendedUpsells: ['premium_features', 'bulk_discount']
          });
        }

      } else {
        // Handle rare failure cases
        setIsLoading(false);
        setProcessingPackage(null);
        
        logger.error('Package selection failed', {
          packageName: pkg.name,
          error: 'Processing timeout',
          retry: true
        });
      }
    }, processingTime);

  }, [selectedPackage, processingPackage]);

  const resetSelection = useCallback(() => {
    const previousPackage = selectedPackage;
    
    setSelectedPackage(null);
    setIsLoading(false);
    setProcessingPackage(null);

    logger.logUserAction('package_selection_reset', {
      previousPackage: previousPackage?.name || null,
      timestamp: new Date().toISOString(),
      reason: 'user_initiated'
    });
  }, [selectedPackage]);

  const isPackageSelected = useCallback((packageName: string) => {
    return selectedPackage?.name === packageName;
  }, [selectedPackage]);

  const isPackageProcessing = useCallback((packageName: string) => {
    return processingPackage === packageName && isLoading;
  }, [processingPackage, isLoading]);

  const contextValue: PackageContextType = {
    selectedPackage,
    isLoading,
    processingPackage,
    selectPackage,
    resetSelection,
    isPackageSelected,
    isPackageProcessing,
    hasSelection: !!selectedPackage
  };

  return (
    <PackageContext.Provider value={contextValue}>
      {children}
    </PackageContext.Provider>
  );
}