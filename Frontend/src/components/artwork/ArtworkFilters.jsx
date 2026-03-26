import { useState, useEffect } from 'react';
import { HiAdjustments, HiX } from 'react-icons/hi';

export default function ArtworkFilters({ filters, currentFilters, onFilterChange }) {
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

  const filterContent = (
    <div>
      <div>
        <h3>Filters</h3>
        <button onClick={clearAll}>Clear All</button>
      </div>

      {/* Sort */}
      <div>
        <label>Sort By</label>
        <select value={localFilters.sort || ''} onChange={(e) => handleChange('sort', e.target.value)}>
          <option value="">Default</option>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {/* Medium */}
      {filters?.mediums && (
        <div>
          <label>Medium</label>
          <select value={localFilters.medium || ''} onChange={(e) => handleChange('medium', e.target.value)}>
            <option value="">All Mediums</option>
            {filters.mediums.map((m) => (
              <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1).replace('-', ' ')}</option>
            ))}
          </select>
        </div>
      )}

      {/* Style */}
      {filters?.styles && (
        <div>
          <label>Style</label>
          <select value={localFilters.style || ''} onChange={(e) => handleChange('style', e.target.value)}>
            <option value="">All Styles</option>
            {filters.styles.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
      )}

      {/* Price Range */}
      <div>
        <label>Price Range</label>
        <div>
          <input type="number" placeholder="Min" value={localFilters.minPrice || ''} onChange={(e) => handleChange('minPrice', e.target.value)} />
          <span>-</span>
          <input type="number" placeholder="Max" value={localFilters.maxPrice || ''} onChange={(e) => handleChange('maxPrice', e.target.value)} />
        </div>
      </div>

      {/* In Stock */}
      <div>
        <label>
          <input type="checkbox" checked={localFilters.inStock === 'true'} onChange={(e) => handleChange('inStock', e.target.checked ? 'true' : '')} />
          In Stock Only
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile filter toggle */}
      <button onClick={() => setMobileOpen(true)}>
        <HiAdjustments /> Filters
      </button>

      {/* Desktop filters */}
      <div>{filterContent}</div>

      {/* Mobile filters modal */}
      {mobileOpen && (
        <div>
          <div onClick={() => setMobileOpen(false)}></div>
          <div>
            <div>
              <h3>Filters</h3>
              <button onClick={() => setMobileOpen(false)}><HiX /></button>
            </div>
            {filterContent}
          </div>
        </div>
      )}
    </>
  );
}