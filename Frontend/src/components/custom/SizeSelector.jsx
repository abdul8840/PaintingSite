import { HiOutlineViewBoards } from 'react-icons/hi';

const SIZE_LABELS = {
  '8x10': '8" × 10"',
  '11x14': '11" × 14"',
  '12x16': '12" × 16"',
  '16x20': '16" × 20"',
  '18x24': '18" × 24"',
  '20x24': '20" × 24"',
  '24x30': '24" × 30"',
  '24x36': '24" × 36"',
  '30x40': '30" × 40"',
  '36x48': '36" × 48"',
  'custom': 'Custom Size',
};

const SIZE_CATEGORIES = {
  small: ['8x10', '11x14', '12x16'],
  medium: ['16x20', '18x24', '20x24'],
  large: ['24x30', '24x36', '30x40', '36x48'],
};

export default function SizeSelector({ value, onChange, customSize, onCustomSizeChange }) {
  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <HiOutlineViewBoards className="w-5 h-5 text-charcoal" />
        <label className="text-sm sm:text-base font-medium text-ink">Canvas Size</label>
      </div>
      
      {/* Size Grid */}
      <div className="space-y-4 sm:space-y-5">
        {/* Small Sizes */}
        <div>
          <p className="text-xs font-medium text-charcoal/50 uppercase tracking-wider mb-2">Small</p>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {SIZE_CATEGORIES.small.map((key, index) => (
              <button
                key={key}
                type="button"
                onClick={() => onChange(key)}
                className={`group relative p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer active:scale-[0.98] ${
                  value === key 
                    ? 'border-ink bg-ink/5 shadow-lg' 
                    : 'border-cream bg-white hover:border-charcoal/30 hover:shadow-md'
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <span className={`block text-sm sm:text-base font-medium text-center transition-colors ${
                  value === key ? 'text-ink' : 'text-charcoal/70 group-hover:text-ink'
                }`}>
                  {SIZE_LABELS[key]}
                </span>
                
                {value === key && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-ink rounded-full flex items-center justify-center animate-scale-in">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Medium Sizes */}
        <div>
          <p className="text-xs font-medium text-charcoal/50 uppercase tracking-wider mb-2">Medium</p>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {SIZE_CATEGORIES.medium.map((key, index) => (
              <button
                key={key}
                type="button"
                onClick={() => onChange(key)}
                className={`group relative p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer active:scale-[0.98] ${
                  value === key 
                    ? 'border-ink bg-ink/5 shadow-lg' 
                    : 'border-cream bg-white hover:border-charcoal/30 hover:shadow-md'
                }`}
                style={{ animationDelay: `${(index + 3) * 0.05}s` }}
              >
                <span className={`block text-sm sm:text-base font-medium text-center transition-colors ${
                  value === key ? 'text-ink' : 'text-charcoal/70 group-hover:text-ink'
                }`}>
                  {SIZE_LABELS[key]}
                </span>
                
                {value === key && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-ink rounded-full flex items-center justify-center animate-scale-in">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Large Sizes */}
        <div>
          <p className="text-xs font-medium text-charcoal/50 uppercase tracking-wider mb-2">Large</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {SIZE_CATEGORIES.large.map((key, index) => (
              <button
                key={key}
                type="button"
                onClick={() => onChange(key)}
                className={`group relative p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer active:scale-[0.98] ${
                  value === key 
                    ? 'border-ink bg-ink/5 shadow-lg' 
                    : 'border-cream bg-white hover:border-charcoal/30 hover:shadow-md'
                }`}
                style={{ animationDelay: `${(index + 6) * 0.05}s` }}
              >
                <span className={`block text-sm sm:text-base font-medium text-center transition-colors ${
                  value === key ? 'text-ink' : 'text-charcoal/70 group-hover:text-ink'
                }`}>
                  {SIZE_LABELS[key]}
                </span>
                
                {value === key && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-ink rounded-full flex items-center justify-center animate-scale-in">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Size Option */}
        <div>
          <button
            type="button"
            onClick={() => onChange('custom')}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer active:scale-[0.99] ${
              value === 'custom' 
                ? 'border-gold bg-gold/5 shadow-lg' 
                : 'border-cream border-dashed bg-white hover:border-gold/50 hover:bg-gold/5'
            }`}
          >
            <span className={`text-sm sm:text-base font-medium transition-colors ${
              value === 'custom' ? 'text-gold' : 'text-charcoal/60 hover:text-gold'
            }`}>
              ✨ Custom Size
            </span>
          </button>
        </div>
      </div>

      {/* Custom Size Inputs */}
      {value === 'custom' && (
        <div className="mt-4 sm:mt-5 p-4 sm:p-5 bg-gold/5 border border-gold/20 rounded-xl animate-fade-in-up">
          <p className="text-sm font-medium text-ink mb-3">Enter custom dimensions</p>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex-1">
              <label className="block text-xs text-charcoal/50 mb-1">Width</label>
              <input
                type="number"
                placeholder="Width"
                value={customSize?.width || ''}
                onChange={(e) => onCustomSizeChange({ ...customSize, width: Number(e.target.value) })}
                min="4"
                max="60"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-cream rounded-lg text-ink text-center font-medium focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all duration-300 text-sm sm:text-base"
              />
            </div>
            <span className="text-xl sm:text-2xl text-charcoal/30 font-light mt-5">×</span>
            <div className="flex-1">
              <label className="block text-xs text-charcoal/50 mb-1">Height</label>
              <input
                type="number"
                placeholder="Height"
                value={customSize?.height || ''}
                onChange={(e) => onCustomSizeChange({ ...customSize, height: Number(e.target.value) })}
                min="4"
                max="60"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-cream rounded-lg text-ink text-center font-medium focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all duration-300 text-sm sm:text-base"
              />
            </div>
            <span className="text-sm sm:text-base text-charcoal/50 mt-5">inches</span>
          </div>
          <p className="text-xs text-charcoal/50 mt-2">Min: 4" | Max: 60"</p>
        </div>
      )}
    </div>
  );
}