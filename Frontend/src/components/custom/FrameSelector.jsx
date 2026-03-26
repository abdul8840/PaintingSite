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

export default function FrameSelector({ value, onChange }) {
  return (
    <div>
      <label>Framing Option</label>
      <div>
        {Object.entries(FRAME_LABELS).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            data-selected={value === key}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}