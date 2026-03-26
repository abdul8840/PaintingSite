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

export default function SizeSelector({ value, onChange, customSize, onCustomSizeChange }) {
  return (
    <div>
      <label>Canvas Size</label>
      <div>
        {Object.entries(SIZE_LABELS).map(([key, label]) => (
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
      {value === 'custom' && (
        <div>
          <input
            type="number"
            placeholder="Width"
            value={customSize?.width || ''}
            onChange={(e) => onCustomSizeChange({ ...customSize, width: Number(e.target.value) })}
            min="4"
            max="60"
          />
          <span>×</span>
          <input
            type="number"
            placeholder="Height"
            value={customSize?.height || ''}
            onChange={(e) => onCustomSizeChange({ ...customSize, height: Number(e.target.value) })}
            min="4"
            max="60"
          />
          <span>inches</span>
        </div>
      )}
    </div>
  );
}