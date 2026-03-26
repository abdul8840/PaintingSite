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

export default function StyleSelector({ value, onChange, options = [], aiSuggestions = [] }) {
  const styles = options.length > 0 ? options : Object.keys(STYLE_LABELS);

  const getSuggestionConfidence = (style) => {
    const suggestion = aiSuggestions.find(s => s.style === style);
    return suggestion ? Math.round(suggestion.confidence * 100) : null;
  };

  return (
    <div>
      <label>Sketch Style</label>
      <div>
        {styles.map((style) => {
          const confidence = getSuggestionConfidence(style);
          return (
            <button
              key={style}
              type="button"
              onClick={() => onChange(style)}
              data-selected={value === style}
            >
              <span>{STYLE_LABELS[style] || style}</span>
              {confidence && <span>AI: {confidence}% match</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}