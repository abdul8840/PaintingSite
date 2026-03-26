import { useState } from 'react';
import { HiAdjustments, HiX, HiChevronDown } from 'react-icons/hi';

export default function ArtworkFilters({
  filters,
  currentFilters,
  onFilterChange,
}) {
  const [localFilters, setLocalFilters] = useState(currentFilters || {});
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleChange = (key, value) => {
    const updated = { ...localFilters, [key]: value };
    if (!value) delete updated[key];
    setLocalFilters(updated);
    onFilterChange(updated);
  };

  const clearAll = () => {
    setLocalFilters({});
    onFilterChange({});
  };

  const activeCount = Object.keys(localFilters).filter(
    (k) => localFilters[k]
  ).length;

  const SelectField = ({ label, value, onChange, children }) => (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-2">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="
            w-full appearance-none
            px-4 py-2.5 pr-10 rounded-xl
            bg-cream/50 border border-cream
            text-sm text-ink
            focus:outline-none focus:border-rust/40 focus:shadow-md focus:shadow-rust/5
            transition-all duration-300 cursor-pointer
          "
        >
          {children}
        </select>
        <HiChevronDown
          className="
            absolute right-3 top-1/2 -translate-y-1/2
            w-4 h-4 text-mist pointer-events-none
          "
        />
      </div>
    </div>
  );

  const filterContent = (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-ink uppercase tracking-wider">
          Filters
          {activeCount > 0 && (
            <span
              className="
                ml-2 inline-flex items-center justify-center
                w-5 h-5 rounded-full
                bg-rust text-paper text-[10px] font-bold
              "
            >
              {activeCount}
            </span>
          )}
        </h3>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="
              text-xs font-semibold text-rust
              hover:text-rust/70
              transition-colors duration-300 cursor-pointer
              underline underline-offset-2
            "
          >
            Clear All
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-cream" />

      {/* Sort */}
      <SelectField
        label="Sort By"
        value={localFilters.sort || ''}
        onChange={(e) => handleChange('sort', e.target.value)}
      >
        <option value="">Default</option>
        <option value="newest">Newest</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating">Top Rated</option>
        <option value="popular">Most Popular</option>
      </SelectField>

      {/* Medium */}
      {filters?.mediums && (
        <SelectField
          label="Medium"
          value={localFilters.medium || ''}
          onChange={(e) => handleChange('medium', e.target.value)}
        >
          <option value="">All Mediums</option>
          {filters.mediums.map((m) => (
            <option key={m} value={m}>
              {m.charAt(0).toUpperCase() + m.slice(1).replace('-', ' ')}
            </option>
          ))}
        </SelectField>
      )}

      {/* Style */}
      {filters?.styles && (
        <SelectField
          label="Style"
          value={localFilters.style || ''}
          onChange={(e) => handleChange('style', e.target.value)}
        >
          <option value="">All Styles</option>
          {filters.styles.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </SelectField>
      )}

      {/* Price Range */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-2">
          Price Range
        </label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-mist">
              $
            </span>
            <input
              type="number"
              placeholder="Min"
              value={localFilters.minPrice || ''}
              onChange={(e) => handleChange('minPrice', e.target.value)}
              className="
                w-full pl-7 pr-3 py-2.5 rounded-xl
                bg-cream/50 border border-cream
                text-sm text-ink placeholder:text-mist
                focus:outline-none focus:border-rust/40 focus:shadow-md focus:shadow-rust/5
                transition-all duration-300
                [appearance:textfield]
                [&::-webkit-outer-spin-button]:appearance-none
                [&::-webkit-inner-spin-button]:appearance-none
              "
            />
          </div>
          <span className="text-xs text-mist font-medium">to</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-mist">
              $
            </span>
            <input
              type="number"
              placeholder="Max"
              value={localFilters.maxPrice || ''}
              onChange={(e) => handleChange('maxPrice', e.target.value)}
              className="
                w-full pl-7 pr-3 py-2.5 rounded-xl
                bg-cream/50 border border-cream
                text-sm text-ink placeholder:text-mist
                focus:outline-none focus:border-rust/40 focus:shadow-md focus:shadow-rust/5
                transition-all duration-300
                [appearance:textfield]
                [&::-webkit-outer-spin-button]:appearance-none
                [&::-webkit-inner-spin-button]:appearance-none
              "
            />
          </div>
        </div>
      </div>

      {/* In Stock Toggle */}
      <div>
        <label
          className="
            flex items-center gap-3
            cursor-pointer group
            py-1
          "
        >
          <div className="relative">
            <input
              type="checkbox"
              checked={localFilters.inStock === 'true'}
              onChange={(e) =>
                handleChange('inStock', e.target.checked ? 'true' : '')
              }
              className="sr-only peer"
            />
            <div
              className="
                w-10 h-[22px] rounded-full
                bg-cream border border-mist/30
                peer-checked:bg-rust peer-checked:border-rust
                transition-all duration-300
              "
            />
            <div
              className="
                absolute top-0.5 left-0.5
                w-[18px] h-[18px] rounded-full
                bg-paper shadow-sm
                peer-checked:translate-x-[18px]
                transition-transform duration-300
              "
            />
          </div>
          <span
            className="
              text-sm font-medium text-charcoal
              group-hover:text-ink
              transition-colors duration-300
            "
          >
            In Stock Only
          </span>
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* ---- Mobile Filter Toggle ---- */}
      <button
        onClick={() => setMobileOpen(true)}
        className="
          lg:hidden
          inline-flex items-center gap-2
          px-4 py-2.5 rounded-xl
          bg-paper border border-cream
          text-sm font-semibold text-charcoal
          hover:border-mist hover:text-ink
          transition-all duration-300 cursor-pointer
          active:scale-[0.98]
          shadow-sm
        "
      >
        <HiAdjustments className="w-4 h-4" />
        Filters
        {activeCount > 0 && (
          <span
            className="
              ml-0.5 inline-flex items-center justify-center
              w-5 h-5 rounded-full
              bg-rust text-paper text-[10px] font-bold
            "
          >
            {activeCount}
          </span>
        )}
      </button>

      {/* ---- Desktop Sidebar ---- */}
      <div
        className="
          hidden lg:block
          w-full
          bg-paper rounded-2xl
          border border-cream
          p-5
          sticky top-24
        "
      >
        {filterContent}
      </div>

      {/* ---- Mobile Filters Drawer ---- */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[150] lg:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-ink/40 glass animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <div
            className="
              absolute bottom-0 left-0 right-0
              max-h-[85vh]
              bg-paper rounded-t-3xl
              shadow-2xl shadow-ink/20
              animate-slide-up
              flex flex-col
            "
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-mist/40" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-cream">
              <h3 className="text-base font-bold text-ink">Filters</h3>
              <button
                onClick={() => setMobileOpen(false)}
                className="
                  p-2 rounded-xl
                  text-mist hover:text-rust hover:bg-cream
                  transition-all duration-300 cursor-pointer
                  active:scale-90
                "
                aria-label="Close filters"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              {filterContent}
            </div>

            {/* Apply Button */}
            <div className="border-t border-cream px-5 py-4">
              <button
                onClick={() => setMobileOpen(false)}
                className="
                  w-full py-3 rounded-xl
                  bg-ink text-paper text-sm font-semibold
                  hover:bg-charcoal
                  transition-all duration-300 cursor-pointer
                  active:scale-[0.98]
                  shadow-md shadow-ink/10
                "
              >
                Apply Filters
                {activeCount > 0 && (
                  <span className="ml-2 text-paper/60">
                    ({activeCount} active)
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}