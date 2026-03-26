import { useState } from 'react';
import aiApi from '../../api/aiApi';
import { useToast } from '../../hooks/useToast';
import { HiSparkles } from 'react-icons/hi';

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
    <div>
      <button type="button" onClick={handleAnalyze} disabled={loading || !imageUrl}>
        <HiSparkles />
        {loading ? 'Analyzing...' : 'AI Style Suggestion'}
      </button>

      {suggestions.length > 0 && (
        <div>
          <h4>AI Recommended Styles</h4>
          {suggestions.map((s, i) => (
            <button key={i} type="button" onClick={() => onSelectStyle(s.style)}>
              <div>
                <span>{s.style.replace(/-/g, ' ')}</span>
                <span>{Math.round(s.confidence * 100)}% match</span>
              </div>
              <p>{s.reason}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}