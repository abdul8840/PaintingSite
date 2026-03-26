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

export default function OptionsSelector({ colorStyle, onColorChange, background, onBackgroundChange, subjects, onSubjectsChange, isRush, onRushChange, notes, onNotesChange }) {
  return (
    <div>
      {/* Color Style */}
      <div>
        <label>Color Style</label>
        <div>
          {Object.entries(COLOR_STYLES).map(([key, label]) => (
            <button key={key} type="button" onClick={() => onColorChange(key)} data-selected={colorStyle === key}>{label}</button>
          ))}
        </div>
      </div>

      {/* Background */}
      <div>
        <label>Background Preference</label>
        <select value={background} onChange={(e) => onBackgroundChange(e.target.value)}>
          {Object.entries(BACKGROUNDS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Subjects */}
      <div>
        <label>Number of Subjects/People</label>
        <div>
          <button type="button" onClick={() => onSubjectsChange(Math.max(1, subjects - 1))}>-</button>
          <span>{subjects}</span>
          <button type="button" onClick={() => onSubjectsChange(Math.min(10, subjects + 1))}>+</button>
        </div>
        {subjects > 1 && <p>${(subjects - 1) * 25} extra for {subjects - 1} additional subjects</p>}
      </div>

      {/* Rush Order */}
      <div>
        <label>
          <input type="checkbox" checked={isRush} onChange={(e) => onRushChange(e.target.checked)} />
          Rush Order (50% faster, 50% premium)
        </label>
      </div>

      {/* Notes */}
      <div>
        <label>Additional Notes</label>
        <textarea value={notes} onChange={(e) => onNotesChange(e.target.value)} placeholder="Any special instructions..." maxLength={1000} rows={4} />
      </div>
    </div>
  );
}