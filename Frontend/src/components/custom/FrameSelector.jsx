import { HiOutlineViewBoards } from 'react-icons/hi';

const FRAME_LABELS = {
  'no-frame': 'No Frame',
  'basic-black': 'Basic Black',
  'basic-white': 'Basic White',
  'wooden-natural': 'Wooden Natural',
  'wooden-dark': 'Wooden Dark',
  'golden-classic': 'Golden Classic',
  'silver-modern': 'Silver Modern',
  'floating-frame': 'Floating Frame',
};

const FRAME_COLORS = {
  'no-frame': 'bg-paper border-2 border-dashed border-mist',
  'basic-black': 'bg-ink',
  'basic-white': 'bg-white border border-cream',
  'wooden-natural': 'bg-gradient-to-br from-amber-200 to-amber-400',
  'wooden-dark': 'bg-gradient-to-br from-amber-800 to-amber-950',
  'golden-classic': 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500',
  'silver-modern': 'bg-gradient-to-br from-gray-300 via-gray-200 to-gray-400',
  'floating-frame': 'bg-white border-4 border-charcoal',
};

export default function FrameSelector({ value, onChange }) {
  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <HiOutlineViewBoards className="w-5 h-5 text-charcoal" />
        <label className="text-sm sm:text-base font-medium text-ink">Framing Option</label>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
        {Object.entries(FRAME_LABELS).map(([key, label], index) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`group relative p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer active:scale-[0.98] animate-fade-in-up ${
              value === key 
                ? 'border-ink bg-ink/5 shadow-lg' 
                : 'border-cream bg-white hover:border-charcoal/30 hover:shadow-md'
            }`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {/* Frame Preview */}
            <div className="flex justify-center mb-2 sm:mb-3">
              <div className={`w-10 h-12 sm:w-12 sm:h-14 rounded-sm ${FRAME_COLORS[key]} shadow-sm`}>
                {key !== 'no-frame' && (
                  <div className="w-full h-full flex items-center justify-center p-1 sm:p-1.5">
                    <div className="w-full h-full bg-cream/80 rounded-[1px]" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Label */}
            <span className={`block text-xs sm:text-sm font-medium text-center transition-colors ${
              value === key ? 'text-ink' : 'text-charcoal/70 group-hover:text-ink'
            }`}>
              {label}
            </span>
            
            {/* Selected indicator */}
            {value === key && (
              <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-ink rounded-full flex items-center justify-center animate-scale-in">
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}