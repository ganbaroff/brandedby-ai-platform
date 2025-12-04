/**
 * Service Worker Registration and Management
 * Handles PWA functionality, offline support, and caching
 */

import React, { useEffect, useState } from 'react';

interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isOnline: boolean;
  cacheSize: number;
  updateAvailable: boolean;
}

/**
 * Hook for managing service worker functionality
 */
export const useServiceWorker = () => {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: 'serviceWorker' in navigator,
    isRegistered: false,
    isOnline: navigator.onLine,
    cacheSize: 0,
    updateAvailable: false
  });

  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // Register service worker
  useEffect(() => {
    // Don't register Service Worker in development
    if (import.meta.env.DEV) {
      console.log('[SW] Service Worker disabled in development mode');
      
      // Unregister any existing service workers in dev
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => {
            registration.unregister().then(() => {
              console.log('[SW] Unregistered existing service worker');
            });
          });
        });
        
        // Clear all caches
        caches.keys().then((names) => {
          names.forEach((name) => {
            caches.delete(name);
          });
          console.log('[SW] Cleared all caches');
        });
      }
      return;
    }

    if (!state.isSupported) {
      console.log('Service Worker not supported');
      return;
    }

    const registerSW = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully:', reg);
        
        setRegistration(reg);
        setState(prev => ({ ...prev, isRegistered: true }));

        // Check for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setState(prev => ({ ...prev, updateAvailable: true }));
                console.log('Service Worker update available');
              }
            });
          }
        });

        // Listen for controlling worker changes
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('Service Worker controller changed');
          window.location.reload();
        });

      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    };

    registerSW();
  }, [state.isSupported]);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Get cache size
  const getCacheSize = async () => {
    if (!registration || !registration.active) return 0;

    return new Promise<number>((resolve) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        if (event.data.type === 'CACHE_SIZE') {
          const sizeInMB = event.data.size / (1024 * 1024);
          setState(prev => ({ ...prev, cacheSize: sizeInMB }));
          resolve(sizeInMB);
        }
      };

      registration.active?.postMessage(
        { type: 'GET_CACHE_SIZE' },
        [messageChannel.port2]
      );
    });
  };

  // Clear cache
  const clearCache = async () => {
    if (!registration || !registration.active) return;

    return new Promise<void>((resolve) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        if (event.data.type === 'CACHE_CLEARED') {
          setState(prev => ({ ...prev, cacheSize: 0 }));
          console.log('Cache cleared successfully');
          resolve();
        }
      };

      registration.active?.postMessage(
        { type: 'CLEAR_CACHE' },
        [messageChannel.port2]
      );
    });
  };

  // Update service worker
  const updateServiceWorker = () => {
    if (!registration) return;

    const messageChannel = new MessageChannel();
    registration.waiting?.postMessage({ type: 'SKIP_WAITING' }, [messageChannel.port2]);
  };

  return {
    ...state,
    registration,
    getCacheSize,
    clearCache,
    updateServiceWorker
  };
};

/**
 * Service Worker Status Component
 */
export const ServiceWorkerStatus: React.FC = () => {
  const sw = useServiceWorker();
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (sw.isRegistered) {
      sw.getCacheSize();
    }
  }, [sw]);

  if (!sw.isSupported) {
    return null;
  }

  const onlineStatusClass = sw.isOnline 
    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';

  const statusDotClass = sw.isOnline ? 'bg-green-500' : 'bg-red-500';

  return React.createElement('div', { className: 'fixed bottom-4 right-4 z-50' },
    // Online/Offline Indicator
    React.createElement('div', { 
      className: `inline-flex items-center px-3 py-2 rounded-full text-sm font-medium mb-2 ${onlineStatusClass}` 
    },
      React.createElement('div', { className: `w-2 h-2 rounded-full mr-2 ${statusDotClass}` }),
      sw.isOnline ? 'Online' : 'Offline'
    ),

    // Update Available Notice
    sw.updateAvailable && React.createElement('div', { 
      className: 'bg-blue-100 border border-blue-200 text-blue-800 px-4 py-2 rounded-lg mb-2 text-sm' 
    },
      React.createElement('div', { className: 'flex items-center justify-between' },
        React.createElement('span', null, 'Update available'),
        React.createElement('button', {
          onClick: sw.updateServiceWorker,
          className: 'ml-2 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700'
        }, 'Update')
      )
    ),

    // Service Worker Details Toggle
    process.env.NODE_ENV === 'development' && React.createElement('button', {
      onClick: () => setShowDetails(!showDetails),
      className: 'bg-gray-800 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700'
    }, 'SW Status'),

    // Detailed Status Panel
    showDetails && React.createElement('div', {
      className: 'absolute bottom-12 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 w-64'
    },
      React.createElement('h3', { className: 'font-semibold text-sm mb-3' }, 'Service Worker Status'),
      
      React.createElement('div', { className: 'space-y-2 text-xs' },
        React.createElement('div', { className: 'flex justify-between' },
          React.createElement('span', null, 'Registered:'),
          React.createElement('span', { 
            className: sw.isRegistered ? 'text-green-600' : 'text-red-600' 
          }, sw.isRegistered ? 'Yes' : 'No')
        ),
        
        React.createElement('div', { className: 'flex justify-between' },
          React.createElement('span', null, 'Cache Size:'),
          React.createElement('span', null, `${sw.cacheSize.toFixed(2)} MB`)
        ),
        
        React.createElement('div', { className: 'flex justify-between' },
          React.createElement('span', null, 'Connection:'),
          React.createElement('span', { 
            className: sw.isOnline ? 'text-green-600' : 'text-red-600' 
          }, sw.isOnline ? 'Online' : 'Offline')
        )
      ),

      React.createElement('div', { className: 'mt-3 pt-3 border-t border-gray-200 dark:border-gray-600' },
        React.createElement('button', {
          onClick: sw.getCacheSize,
          className: 'w-full bg-blue-600 text-white py-1 rounded text-xs hover:bg-blue-700 mb-1'
        }, 'Refresh Cache Info'),
        
        React.createElement('button', {
          onClick: sw.clearCache,
          className: 'w-full bg-red-600 text-white py-1 rounded text-xs hover:bg-red-700'
        }, 'Clear Cache')
      )
    )
  );
};

/**
 * PWA Install Prompt Component
 */
export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    (deferredPrompt as unknown as { prompt: () => void }).prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await (deferredPrompt as unknown as { userChoice: Promise<{ outcome: string }> }).userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // Clear the deferredPrompt so it can only be used once
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) {
    return null;
  }

  return React.createElement('div', {
    className: 'fixed top-4 left-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 md:left-auto md:w-80'
  },
    React.createElement('div', { className: 'flex items-center justify-between' },
      React.createElement('div', null,
        React.createElement('h3', { className: 'font-semibold text-sm' }, 'Install BrandedBy'),
        React.createElement('p', { className: 'text-xs opacity-90 mt-1' },
          'Add to home screen for faster access and offline support'
        )
      ),
      React.createElement('div', { className: 'flex gap-2 ml-4' },
        React.createElement('button', {
          onClick: handleInstallClick,
          className: 'bg-white text-blue-600 px-3 py-1 rounded text-xs font-medium hover:bg-gray-100'
        }, 'Install'),
        React.createElement('button', {
          onClick: handleDismiss,
          className: 'text-white opacity-75 hover:opacity-100 text-xs'
        }, '✕')
      )
    )
  );
};

export default {
  useServiceWorker,
  ServiceWorkerStatus,
  PWAInstallPrompt
};