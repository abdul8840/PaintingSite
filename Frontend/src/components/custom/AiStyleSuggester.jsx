// AiStyleSuggester.jsx
import { useState } from 'react';
import aiApi from '../../api/aiApi';
import { useToast } from '../../hooks/useToast';
import { HiSparkles, HiCheckCircle, HiLightningBolt, HiRefresh, HiArrowRight } from 'react-icons/hi';

const STYLE_ICONS = {
  'pencil-sketch': '✏️',
  'charcoal-sketch': '🖤',
  'watercolor': '🎨',
  'oil-painting': '🖼️',
  'digital-illustration': '💻',
  'line-art': '〰️',
  'pop-art': '🎭',
  'caricature': '😄',
  'realistic': '📷',
  'abstract': '🌀',
};

export default function AiStyleSuggester({ imageUrl, onSelectStyle, onSuggestionsReceived }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const toast = useToast();

  const handleAnalyze = async () => {
    if (!imageUrl) {
      toast.error('Please upload an image first');
      return;
    }

    setLoading(true);
    setAnalyzed(false);
    setSelectedStyle(null);

    try {
      const res = await aiApi.suggestStyle({ imageUrl });

      if (res.success && res.suggestions && res.suggestions.length > 0) {
        setSuggestions(res.suggestions);
        setAnalyzed(true);
        if (onSuggestionsReceived) {
          onSuggestionsReceived(res.suggestions);
        }
        toast.success(
          res.source === 'ai'
            ? 'AI analysis complete!'
            : 'Style suggestions ready!'
        );
      } else {
        toast.error('Could not analyze image. Please try again.');
      }
    } catch (err) {
      console.error('AI suggest error:', err);
      toast.error('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStyle = (style) => {
    setSelectedStyle(style);
    if (onSelectStyle) {
      onSelectStyle(style);
      toast.success(`Selected: ${style.replace(/-/g, ' ')}`);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'sage';
    if (confidence >= 0.6) return 'gold';
    return 'rust';
  };

  return (
    <div className="space-y-4">
      {/* Analyze Button */}
      <button
        type="button"
        onClick={handleAnalyze}
        disabled={loading || !imageUrl}
        className={`group relative w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden ${
          analyzed 
            ? 'bg-sage/10 text-sage border-2 border-sage/30 hover:bg-sage/20' 
            : 'bg-gradient-to-r from-gold via-rust to-gold bg-[length:200%_100%] text-white hover:shadow-xl hover:shadow-rust/20 animate-gradient-shift'
        }`}
      >
        {/* Shimmer Effect */}
        {!analyzed && !loading && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        )}
        
        {loading ? (
          <>
            <div className="relative">
              <HiSparkles className="w-5 h-5 animate-spin" />
              <div className="absolute inset-0 animate-ping">
                <HiSparkles className="w-5 h-5 opacity-50" />
              </div>
            </div>
            <span>Analyzing your photo...</span>
          </>
        ) : analyzed ? (
          <>
            <HiRefresh className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            <span>Re-analyze Photo</span>
          </>
        ) : (
          <>
            <HiSparkles className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            <span>AI Style Suggestion</span>
            <HiLightningBolt className="w-4 h-4 opacity-70" />
          </>
        )}
      </button>

      {/* Loading State */}
      {loading && (
        <div className="p-6 bg-gradient-to-br from-cream to-paper rounded-2xl border border-cream animate-fade-in-up">
          <div className="flex items-center gap-4">
            {/* Animated Orbs */}
            <div className="relative w-16 h-16 flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-rust/20 animate-ping" />
              <div className="absolute inset-2 rounded-full bg-gold/30 animate-ping" style={{ animationDelay: '0.2s' }} />
              <div className="absolute inset-4 rounded-full bg-sage/40 animate-ping" style={{ animationDelay: '0.4s' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <HiSparkles className="w-8 h-8 text-rust animate-pulse" />
              </div>
            </div>
            
            <div>
              <p className="font-semibold text-ink">AI Analysis in Progress</p>
              <p className="text-sm text-charcoal/60 mt-1">
                Our AI is examining colors, composition, and mood...
              </p>
              
              {/* Progress Dots */}
              <div className="flex gap-1.5 mt-3">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-rust animate-bounce"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suggestions List */}
      {suggestions.length > 0 && !loading && (
        <div className="animate-fade-in-up">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-rust to-gold rounded-lg flex items-center justify-center">
              <HiSparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-ink">AI Recommended Styles</h4>
              <p className="text-xs text-charcoal/50">Click a style to select it</p>
            </div>
          </div>

          {/* Suggestions Grid */}
          <div className="space-y-3">
            {suggestions.map((s, i) => {
              const confidenceColor = getConfidenceColor(s.confidence);
              const isSelected = selectedStyle === s.style;
              
              return (
                <button
                  key={`${s.style}-${i}`}
                  type="button"
                  onClick={() => handleSelectStyle(s.style)}
                  className={`group relative w-full text-left p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer active:scale-[0.98] ${
                    isSelected
                      ? 'border-sage bg-sage/5 shadow-lg shadow-sage/10'
                      : 'border-cream bg-white hover:border-sage/50 hover:shadow-md'
                  }`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {/* Rank Badge */}
                  <div className={`absolute -top-2 -left-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-md ${
                    i === 0 
                      ? 'bg-gradient-to-br from-gold to-rust text-white' 
                      : 'bg-ink text-white'
                  }`}>
                    {i + 1}
                  </div>

                  {/* Selected Checkmark */}
                  {isSelected && (
                    <div className="absolute top-3 right-3">
                      <HiCheckCircle className="w-6 h-6 text-sage animate-scale-in" />
                    </div>
                  )}

                  <div className="flex items-start gap-3 pl-4">
                    {/* Style Icon */}
                    <div className="text-2xl">
                      {STYLE_ICONS[s.style] || '🎨'}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      {/* Style Name & Confidence */}
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-semibold text-ink capitalize">
                          {s.style.replace(/-/g, ' ')}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full bg-${confidenceColor}`} />
                          <span className={`text-sm font-medium text-${confidenceColor}`}>
                            {Math.round((s.confidence || 0) * 100)}% match
                          </span>
                        </div>
                      </div>
                      
                      {/* Confidence Bar */}
                      <div className="h-1.5 bg-cream rounded-full overflow-hidden mb-2">
                        <div 
                          className={`h-full bg-${confidenceColor} rounded-full transition-all duration-700`}
                          style={{ width: `${(s.confidence || 0) * 100}%` }}
                        />
                      </div>
                      
                      {/* Reason */}
                      <p className="text-sm text-charcoal/60 line-clamp-2">
                        {s.reason}
                      </p>
                    </div>
                    
                    {/* Arrow */}
                    <HiArrowRight className={`w-5 h-5 text-charcoal/30 flex-shrink-0 transition-all duration-300 ${
                      isSelected 
                        ? 'text-sage translate-x-1' 
                        : 'group-hover:text-sage group-hover:translate-x-1'
                    }`} />
                  </div>
                  
                  {/* Best Match Badge */}
                  {i === 0 && (
                    <div className="absolute -top-2 right-4 px-2 py-0.5 bg-gradient-to-r from-gold to-rust text-white text-xs font-bold rounded-full shadow-md">
                      Best Match
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}