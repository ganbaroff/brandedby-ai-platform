import { memo } from 'react';
import { Globe, Flag } from 'lucide-react';

export type CelebrityRegion = 'international' | 'azerbaijan';

interface CelebrityRegionSelectorProps {
  selectedRegion: CelebrityRegion;
  onRegionChange: (region: CelebrityRegion) => void;
}

const CelebrityRegionSelector = memo(({ selectedRegion, onRegionChange }: CelebrityRegionSelectorProps) => {
  return (
    <div className="flex items-center gap-3 p-1 bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-white/20">
      <button
        onClick={() => onRegionChange('international')}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
          ${selectedRegion === 'international'
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
            : 'text-gray-600 hover:bg-gray-100'
          }
        `}
        aria-label="Show international celebrities"
        aria-pressed={selectedRegion === 'international'}
      >
        <Globe className="w-5 h-5" />
        <span>International</span>
      </button>

      <button
        onClick={() => onRegionChange('azerbaijan')}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
          ${selectedRegion === 'azerbaijan'
            ? 'bg-gradient-to-r from-red-500 via-blue-500 to-green-500 text-white shadow-lg'
            : 'text-gray-600 hover:bg-gray-100'
          }
        `}
        aria-label="Show Azerbaijan celebrities"
        aria-pressed={selectedRegion === 'azerbaijan'}
      >
        <Flag className="w-5 h-5" />
        <span>Azerbaijan</span>
      </button>
    </div>
  );
});

CelebrityRegionSelector.displayName = 'CelebrityRegionSelector';

export default CelebrityRegionSelector;
