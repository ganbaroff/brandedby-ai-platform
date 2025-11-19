/**
 * Package Hook
 * Custom hook for accessing package context
 */

import { useContext } from "react";
import { PackageContext, type PackageContextType } from "../contexts/PackageContext";

export function usePackage(): PackageContextType {
  const context = useContext(PackageContext);
  
  if (context === undefined) {
    throw new Error('usePackage must be used within a PackageProvider');
  }
  
  return context;
}