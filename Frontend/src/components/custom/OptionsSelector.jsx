import { HiColorSwatch, HiPhotograph, HiUsers, HiLightningBolt, HiPencilAlt } from 'react-icons/hi';

const COLOR_STYLES = {
  'full-color': 'Full Color',
  'black-and-white': 'Black & White',
  'sepia': 'Sepia',
  'monochrome': 'Monochrome',
  'vintage': 'Vintage',
  'vibrant': 'Vibrant',
  'pastel': 'Pastel',
  'muted': 'Muted',
};

const BACKGROUNDS = {
  'keep-original': 'Keep Original',
  'plain-white': 'Plain White',
  'plain-black': 'Plain Black',
  'blurred': 'Blurred',
  'custom-color': 'Custom Color',
  'scenic': 'Scenic',
  'abstract-pattern': 'Abstract Pattern',
  'none': 'None/Transparent',
};

const COLOR_PREVIEWS = {
  'full-color': 'bg-gradient-to-br from-red-400 via-green-400 to-blue-400',
  'black-and-white': 'bg-gradient-to-br from-gray-800 to-gray-200',
  'sepia': 'bg-gradient-to-br from-amber-700 to-amber-200',
  'monochrome': 'bg-gradient-to-br from-slate-600 to-slate-300',
  'vintage': 'bg-gradient-to-br from-amber-600 via-orange-300 to-yellow-200',
  'vibrant': 'bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500',
  'pastel': 'bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200',
  'muted': 'bg-gradient-to-br from-stone-400 to-stone-300',
};

export default function OptionsSelector({ colorStyle, onColorChange, background, onBackgroundChange, subjects, onSubjectsChange, isRush, onRushChange, notes, onNotesChange }) {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in-up">
      {/* Color Style */}
      <div className="animate-fade-in-up stagger-1">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <HiColorSwatch className="w-5 h-5 text-charcoal" />
          <label className="text-sm sm:text-base font-medium text-ink">Color Style</label>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {Object.entries(COLOR_STYLES).map(([key, label], index) => (
            <button 
              key={key} 
              type="button" 
              onClick={() => onColorChange(key)} 
              className={`group relative p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer active:scale-[0.98] ${
                colorStyle === key 
                  ? 'border-ink bg-ink/5 shadow-lg' 
                  : 'border-cream bg-white hover:border-charcoal/30 hover:shadow-md'
              }`}
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              {/* Color Preview */}
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg mx-auto mb-2 ${COLOR_PREVIEWS[key]} shadow-sm`} />
              
              <span className={`block text-xs sm:text-sm font-medium text-center transition-colors ${
                colorStyle === key ? 'text-ink' : 'text-charcoal/70 group-hover:text-ink'
              }`}>
                {label}
              </span>
              
              {colorStyle === key && (
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

      {/* Background */}
      <div className="animate-fade-in-up stagger-2">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <HiPhotograph className="w-5 h-5 text-charcoal" />
          <label className="text-sm sm:text-base font-medium text-ink">Background Preference</label>
        </div>
        <div className="relative">
          <select 
            value={background} 
            onChange={(e) => onBackgroundChange(e.target.value)}
            className="w-full appearance-none px-4 py-3 sm:py-3.5 bg-white border border-cream rounded-xl text-ink text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage cursor-pointer transition-all duration-300 pr-12"
          >
            {Object.entries(BACKGROUNDS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-5 h-5 text-charcoal/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Number of Subjects */}
      <div className="animate-fade-in-up stagger-3">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <HiUsers className="w-5 h-5 text-charcoal" />
          <label className="text-sm sm:text-base font-medium text-ink">Number of Subjects/People</label>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center bg-white border border-cream rounded-xl overflow-hidden">
            <button 
              type="button" 
              onClick={() => onSubjectsChange(Math.max(1, subjects - 1))}
              className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center text-lg font-bold text-charcoal hover:bg-cream transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={subjects <= 1}
            >
              −
            </button>
            <span className="w-12 sm:w-14 text-center font-bold text-ink text-lg sm:text-xl">{subjects}</span>
            <button 
              type="button" 
              onClick={() => onSubjectsChange(Math.min(10, subjects + 1))}
              className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center text-lg font-bold text-charcoal hover:bg-cream transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={subjects >= 10}
            >
              +
            </button>
          </div>
          
          {subjects > 1 && (
            <p className="text-sm text-gold font-medium animate-fade-in">
              +${(subjects - 1) * 25} for {subjects - 1} additional subject{subjects > 2 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {/* Rush Order */}
      <div className="animate-fade-in-up stagger-4">
        <label className={`group flex items-start gap-4 p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
          isRush 
            ? 'border-rust bg-rust/5 shadow-lg' 
            : 'border-cream bg-white hover:border-rust/30'
        }`}>
          <div className="relative flex-shrink-0 mt-0.5">
            <input 
              type="checkbox" 
              checked={isRush} 
              onChange={(e) => onRushChange(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-6 h-6 rounded-md border-2 transition-all duration-300 flex items-center justify-center ${
              isRush 
                ? 'bg-rust border-rust' 
                : 'border-cream group-hover:border-rust/50'
            }`}>
              {isRush && (
                <svg className="w-4 h-4 text-white animate-scale-in" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <HiLightningBolt className={`w-5 h-5 ${isRush ? 'text-rust' : 'text-charcoal/40'}`} />
              <span className="font-semibold text-ink text-sm sm:text-base">Rush Order</span>
              <span className="px-2 py-0.5 bg-rust/10 text-rust text-xs font-semibold rounded-full">+50%</span>
            </div>
            <p className="text-xs sm:text-sm text-charcoal/60">
              Get your artwork 50% faster with priority processing
            </p>
          </div>
        </label>
      </div>

      {/* Additional Notes */}
      <div className="animate-fade-in-up stagger-5">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <HiPencilAlt className="w-5 h-5 text-charcoal" />
          <label className="text-sm sm:text-base font-medium text-ink">Additional Notes</label>
          <span className="text-xs text-charcoal/40">(optional)</span>
        </div>
        <textarea 
          value={notes} 
          onChange={(e) => onNotesChange(e.target.value)} 
          placeholder="Any special instructions for the artist..."
          maxLength={1000}
          rows={4}
          className="w-full px-4 py-3 sm:py-3.5 bg-white border border-cream rounded-xl text-ink placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all duration-300 resize-none text-sm sm:text-base"
        />
        <div className="flex justify-end mt-1.5">
          <span className="text-xs text-charcoal/40">{notes?.length || 0}/1000</span>
        </div>
      </div>
    </div>
  );
}