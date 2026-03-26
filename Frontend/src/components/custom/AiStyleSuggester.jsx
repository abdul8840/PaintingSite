import { useState } from 'react';
import aiApi from '../../api/aiApi';
import { useToast } from '../../hooks/useToast';
import { HiSparkles, HiLightningBolt, HiCheckCircle } from 'react-icons/hi';

export default function AiStyleSuggester({ imageUrl, onSelectStyle, onSuggestionsReceived }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleAnalyze = async () => {
    if (!imageUrl) { toast.error('Please upload an image first'); return; }
    setLoading(true);
    try {
      const res = await aiApi.suggestStyle({ imageUrl });
      setSuggestions(res.suggestions);
      onSuggestionsReceived?.(res.suggestions);
      toast.success('AI analysis complete!');
    } catch (err) {
      toast.error(err.message || 'AI analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* AI Analyze Button */}
      <button 
        type="button" 
        onClick={handleAnalyze} 
        disabled={loading || !imageUrl}
        className={`group relative w-full flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-6 py-3 sm:py-4 rounded-xl font-medium text-sm sm:text-base transition-all duration-300 cursor-pointer active:scale-[0.98] overflow-hidden ${
          loading || !imageUrl 
            ? 'bg-cream text-charcoal/40 cursor-not-allowed' 
            : 'bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white hover:shadow-xl hover:shadow-purple-500/30'
        }`}
      >
        {/* Animated background shimmer */}
        {!loading && imageUrl && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        )}
        
        <HiSparkles className={`w-5 h-5 sm:w-6 sm:h-6 ${loading ? '' : 'animate-pulse'}`} />
        <span>{loading ? 'Analyzing with AI...' : 'AI Style Suggestion'}</span>
        
        {loading && (
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
      </button>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 sm:p-5 border border-purple-100 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <HiLightningBolt className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h4 className="font-semibold text-ink text-sm sm:text-base">AI Recommended Styles</h4>
          </div>
          
          <div className="space-y-2 sm:space-y-3">
            {suggestions.map((s, i) => (
              <button 
                key={i} 
                type="button" 
                onClick={() => onSelectStyle(s.style)}
                className="w-full text-left bg-white rounded-xl p-3 sm:p-4 border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all duration-300 cursor-pointer active:scale-[0.99] group animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <span className="font-medium text-ink capitalize text-sm sm:text-base group-hover:text-purple-700 transition-colors">
                    {s.style.replace(/-/g, ' ')}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-semibold ${
                    s.confidence >= 0.8 ? 'bg-sage/10 text-sage' :
                    s.confidence >= 0.5 ? 'bg-gold/10 text-gold' :
                    'bg-charcoal/10 text-charcoal'
                  }`}>
                    <HiCheckCircle className="w-3 h-3" />
                    {Math.round(s.confidence * 100)}% match
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-charcoal/60 leading-relaxed">{s.reason}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}