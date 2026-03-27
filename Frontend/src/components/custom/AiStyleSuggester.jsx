import { useState } from 'react';
import aiApi from '../../api/aiApi';
import { useToast } from '../../hooks/useToast';
import { HiSparkles, HiCheckCircle } from 'react-icons/hi';

export default function AiStyleSuggester({ imageUrl, onSelectStyle, onSuggestionsReceived }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const toast = useToast();

  const handleAnalyze = async () => {
    if (!imageUrl) {
      toast.error('Please upload an image first');
      return;
    }

    setLoading(true);
    setAnalyzed(false);

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
    if (onSelectStyle) {
      onSelectStyle(style);
      toast.success(`Selected: ${style.replace(/-/g, ' ')}`);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleAnalyze}
        disabled={loading || !imageUrl}
      >
        <HiSparkles />
        {loading ? 'Analyzing your photo...' : analyzed ? 'Re-analyze Photo' : 'AI Style Suggestion'}
      </button>

      {loading && (
        <p>Our AI is analyzing your image to suggest the best styles...</p>
      )}

      {suggestions.length > 0 && !loading && (
        <div>
          <h4>
            <HiSparkles /> Recommended Styles
          </h4>
          <p>Click a style to select it</p>

          {suggestions.map((s, i) => (
            <button
              key={`${s.style}-${i}`}
              type="button"
              onClick={() => handleSelectStyle(s.style)}
            >
              <div>
                <span>
                  {i + 1}. {s.style.replace(/-/g, ' ')}
                </span>
                <span>
                  {Math.round((s.confidence || 0) * 100)}% match
                </span>
              </div>
              <p>{s.reason}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}