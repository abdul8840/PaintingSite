import { HiSparkles, HiCheckCircle } from 'react-icons/hi';

const STYLE_LABELS = {
  'pencil-sketch': 'Pencil Sketch',
  'charcoal-sketch': 'Charcoal Sketch',
  'watercolor': 'Watercolor',
  'oil-painting': 'Oil Painting',
  'digital-illustration': 'Digital Illustration',
  'line-art': 'Line Art',
  'pop-art': 'Pop Art',
  'caricature': 'Caricature',
  'realistic': 'Realistic',
  'abstract': 'Abstract',
};

const STYLE_ICONS = {
  'pencil-sketch': '✏️',
  'charcoal-sketch': '🖤',
  'watercolor': '🎨',
  'oil-painting': '🖼️',
  'digital-illustration': '💻',
  'line-art': '✍️',
  'pop-art': '🎯',
  'caricature': '😄',
  'realistic': '📷',
  'abstract': '🌀',
};

export default function StyleSelector({ value, onChange, options = [], aiSuggestions = [] }) {
  const styles = options.length > 0 ? options : Object.keys(STYLE_LABELS);

  const getSuggestionConfidence = (style) => {
    const suggestion = aiSuggestions.find(s => s.style === style);
    return suggestion ? Math.round(suggestion.confidence * 100) : null;
  };

  const sortedStyles = [...styles].sort((a, b) => {
    const confA = getSuggestionConfidence(a) || 0;
    const confB = getSuggestionConfidence(b) || 0;
    return confB - confA;
  });

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <HiSparkles className="w-5 h-5 text-charcoal" />
        <label className="text-sm sm:text-base font-medium text-ink">Sketch Style</label>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
        {sortedStyles.map((style, index) => {
          const confidence = getSuggestionConfidence(style);
          const isAiRecommended = confidence && confidence >= 70;
          
          return (
            <button
              key={style}
              type="button"
              onClick={() => onChange(style)}
              className={`group relative p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer active:scale-[0.98] animate-fade-in-up ${
                value === style 
                  ? 'border-ink bg-ink/5 shadow-lg' 
                  : isAiRecommended
                  ? 'border-purple-200 bg-purple-50/50 hover:border-purple-400 hover:shadow-md'
                  : 'border-cream bg-white hover:border-charcoal/30 hover:shadow-md'
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* AI Badge */}
              {isAiRecommended && (
                <div className="absolute -top-2 -left-2 z-10">
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold rounded-full shadow-lg">
                    <HiSparkles className="w-2.5 h-2.5" />
                    AI
                  </span>
                </div>
              )}

              {/* Style Icon */}
              <div className="text-2xl sm:text-3xl mb-2 text-center">
                {STYLE_ICONS[style] || '🎨'}
              </div>
              
              {/* Style Name */}
              <span className={`block text-xs sm:text-sm font-medium text-center transition-colors leading-tight ${
                value === style ? 'text-ink' : 'text-charcoal/70 group-hover:text-ink'
              }`}>
                {STYLE_LABELS[style] || style}
              </span>
              
              {/* Confidence Badge */}
              {confidence && (
                <div className="mt-2 flex justify-center">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold ${
                    confidence >= 80 ? 'bg-sage/10 text-sage' :
                    confidence >= 60 ? 'bg-gold/10 text-gold' :
                    'bg-charcoal/10 text-charcoal/60'
                  }`}>
                    <HiCheckCircle className="w-3 h-3" />
                    {confidence}%
                  </span>
                </div>
              )}
              
              {/* Selected indicator */}
              {value === style && (
                <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-ink rounded-full flex items-center justify-center animate-scale-in">
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* AI Suggestions Info */}
      {aiSuggestions.length > 0 && (
        <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-charcoal/50 flex items-center gap-1.5">
          <HiSparkles className="w-4 h-4 text-purple-500" />
          AI has analyzed your image and recommended the best matching styles
        </p>
      )}
    </div>
  );
}