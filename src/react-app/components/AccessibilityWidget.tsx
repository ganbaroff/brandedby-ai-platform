/**
 * Accessibility Features Component
 * Skip navigation, keyboard shortcuts, and screen reader enhancements
 */

import { ChevronDown, Keyboard, Monitor, Moon, Sun, Type, Volume2, VolumeX } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";

interface AccessibilityState {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  soundEnabled: boolean;
  keyboardNavVisible: boolean;
  screenReaderMode: boolean;
}

const AccessibilityWidget = memo(function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilityState>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    soundEnabled: true,
    keyboardNavVisible: false,
    screenReaderMode: false
  });

  // Apply settings to DOM
  const applySettings = useCallback((newSettings: AccessibilityState) => {
    const root = document.documentElement;
    
    // High contrast
    root.classList.toggle('high-contrast', newSettings.highContrast);
    
    // Large text
    root.classList.toggle('large-text', newSettings.largeText);
    
    // Reduced motion
    root.classList.toggle('reduced-motion', newSettings.reducedMotion);
    
    // Keyboard navigation
    root.classList.toggle('keyboard-nav', newSettings.keyboardNavVisible);
    
    // Screen reader mode
    root.classList.toggle('screen-reader', newSettings.screenReaderMode);
    
    // Save to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
  }, []);

  // Load accessibility settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
        applySettings(parsed);
      } catch {
        // Use defaults
      }
    }

    // Check for prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSettings(prev => ({ ...prev, reducedMotion: true }));
    }
  }, [applySettings]);

  // Update setting
  const updateSetting = useCallback((key: keyof AccessibilityState, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    applySettings(newSettings);
  }, [settings, applySettings]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + A: Toggle accessibility widget
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        setIsOpen(prev => !prev);
        return;
      }

      // Alt + H: Toggle high contrast
      if (e.altKey && e.key === 'h') {
        e.preventDefault();
        updateSetting('highContrast', !settings.highContrast);
        return;
      }

      // Alt + T: Toggle large text
      if (e.altKey && e.key === 't') {
        e.preventDefault();
        updateSetting('largeText', !settings.largeText);
        return;
      }

      // Alt + M: Toggle reduced motion
      if (e.altKey && e.key === 'm') {
        e.preventDefault();
        updateSetting('reducedMotion', !settings.reducedMotion);
        return;
      }

      // Tab: Show keyboard navigation
      if (e.key === 'Tab') {
        if (!settings.keyboardNavVisible) {
          updateSetting('keyboardNavVisible', true);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [settings, updateSetting]);

  // Reset all settings
  const resetSettings = useCallback(() => {
    const defaultSettings: AccessibilityState = {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      soundEnabled: true,
      keyboardNavVisible: false,
      screenReaderMode: false
    };
    setSettings(defaultSettings);
    applySettings(defaultSettings);
  }, [applySettings]);

  return (
    <>
      {/* Skip Navigation Links */}
      <div className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-50 focus:bg-white focus:p-4 focus:shadow-lg">
        <a href="#main-content" className="text-blue-600 underline">
          Skip to main content
        </a>
        <a href="#navigation" className="ml-4 text-blue-600 underline">
          Skip to navigation
        </a>
      </div>

      {/* Accessibility Widget */}
      <div className="fixed bottom-4 right-4 z-40">
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open accessibility options"
          aria-expanded={isOpen}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-colors"
        >
          <Monitor className="h-6 w-6" />
        </button>

        {/* Accessibility Panel */}
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <div 
              className="fixed inset-0 bg-black/30 z-40 sm:hidden"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border p-4 w-[calc(100vw-2rem)] sm:w-80 max-w-sm max-h-[calc(100vh-8rem)] sm:max-h-96 overflow-y-auto z-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Accessibility Options</h3>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close accessibility options"
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>

            {/* Keyboard Shortcuts Info */}
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Keyboard className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-900">Keyboard Shortcuts</span>
              </div>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>Alt + A: Toggle this menu</li>
                <li>Alt + H: Toggle high contrast</li>
                <li>Alt + T: Toggle large text</li>
                <li>Alt + M: Toggle reduced motion</li>
                <li>Tab: Navigate elements</li>
              </ul>
            </div>

            {/* Settings */}
            <div className="space-y-3">
              {/* High Contrast */}
              <label className="flex items-center justify-between">
                <div className="flex items-center">
                  {settings.highContrast ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                  <span className="text-sm font-medium">High Contrast</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.highContrast}
                  onChange={(e) => updateSetting('highContrast', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>

              {/* Large Text */}
              <label className="flex items-center justify-between">
                <div className="flex items-center">
                  <Type className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Large Text</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.largeText}
                  onChange={(e) => updateSetting('largeText', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>

              {/* Reduced Motion */}
              <label className="flex items-center justify-between">
                <div className="flex items-center">
                  <Monitor className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Reduce Motion</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.reducedMotion}
                  onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>

              {/* Sound */}
              <label className="flex items-center justify-between">
                <div className="flex items-center">
                  {settings.soundEnabled ? <Volume2 className="h-4 w-4 mr-2" /> : <VolumeX className="h-4 w-4 mr-2" />}
                  <span className="text-sm font-medium">Sound Effects</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => updateSetting('soundEnabled', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>

              {/* Screen Reader Mode */}
              <label className="flex items-center justify-between">
                <div className="flex items-center">
                  <Monitor className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Screen Reader Mode</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.screenReaderMode}
                  onChange={(e) => updateSetting('screenReaderMode', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>

            {/* Reset Button */}
            <button
              onClick={resetSettings}
              className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm"
            >
              Reset to Defaults
            </button>

            {/* Info */}
            <p className="text-xs text-gray-500 mt-3">
              These settings improve accessibility for users with disabilities. 
              Settings are saved locally in your browser.
            </p>
          </div>
          </>
        )}
      </div>
    </>
  );
});

export default AccessibilityWidget;