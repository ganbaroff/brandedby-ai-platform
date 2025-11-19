/**
 * Package Context Definition
 * Separated for Fast Refresh compatibility
 */

import { createContext } from "react";

interface Package {
  name: string;
  price: number;
  duration: string;
  features: string[];
  popular: boolean;
  color: string;
}

interface PackageContextType {
  selectedPackage: Package | null;
  isLoading: boolean;
  processingPackage: string | null;
  selectPackage: (pkg: Package) => void;
  resetSelection: () => void;
  isPackageSelected: (packageName: string) => boolean;
  isPackageProcessing: (packageName: string) => boolean;
  hasSelection: boolean;
}

export const PackageContext = createContext<PackageContextType | undefined>(undefined);

export type { Package, PackageContextType };
