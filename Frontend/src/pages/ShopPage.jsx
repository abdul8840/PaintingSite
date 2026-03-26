import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArtworks, fetchFilterOptions } from '../store/slices/artworkSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import ArtworkGrid    from '../components/artwork/ArtworkGrid';
import ArtworkFilters from '../components/artwork/ArtworkFilters';
import Pagination     from '../components/common/Pagination';
import Breadcrumb     from '../components/common/Breadcrumb';
import {
  HiSquares2X2, HiViewColumns, HiAdjustmentsHorizontal,
  HiXMark, HiMagnifyingGlass, HiSparkles,
} from 'react-icons/hi2';

export default function ShopPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { items, pagination, loading, filters } =
    useSelector((state) => state.artworks);
  const { items: categories } = useSelector((state) => state.categories);

  const [showFilters,  setShowFilters]  = useState(false);
  const [gridCols,     setGridCols]     = useState(3);

  const currentFilters = Object.fromEntries(searchParams.entries());
  const activeFilterCount = Object.keys(currentFilters).filter(
    k => k !== 'page' && k !== 'sort' && currentFilters[k]
  ).length;

  useEffect(() => {
    dispatch(fetchFilterOptions());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchArtworks(searchParams.toString()));
  }, [dispatch, searchParams]);

  const handleFilterChange = (newFilters) => {
    setSearchParams(new URLSearchParams(newFilters));
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    setSearchParams(params);
  };

  const clearFilter = (key) => {
    const next = { ...currentFilters };
    delete next[key];
    handleFilterChange(next);
  };

  return (
    <div className="min-h-screen bg-[var(--color-paper)]">

      {/* ── Page header ── */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-[var(--color-cream)]
                      sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={[{ label: 'Shop' }]} />
        </div>
      </div>

      {/* ── Hero strip ── */}
      <div className="relative bg-[var(--color-ink)] overflow-hidden">
        {/* subtle pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(var(--color-paper) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }} />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full
                        bg-[var(--color-rust)]/20 blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full
                        bg-[var(--color-gold)]/15 blur-2xl -translate-x-1/3 translate-y-1/3" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex items-center gap-2 mb-2 animate-fade-in-down">
            <HiSparkles className="w-4 h-4 text-[var(--color-gold)]" />
            <span className="text-xs font-semibold text-[var(--color-gold)] uppercase tracking-widest">
              Original Artworks
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-paper)]
                         tracking-tight animate-fade-in-up stagger-1">
            Art Gallery
          </h1>
          <p className="text-[var(--color-mist)] text-sm sm:text-base mt-3 max-w-md
                        animate-fade-in-up stagger-2">
            {pagination?.total
              ? `Discover ${pagination.total} handcrafted artworks from talented creators`
              : 'Discover handcrafted artworks from talented creators'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* ── Category quick links ── */}
        <div className="mb-6 animate-fade-in-up stagger-2">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 -mx-1 px-1">
            {/* All button */}
            <button
              onClick={() => handleFilterChange({})}
              className={`cursor-pointer flex-shrink-0 px-4 py-2 rounded-full text-xs
                          font-semibold border transition-all duration-200 whitespace-nowrap
                          ${!currentFilters.category
                            ? 'bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)] shadow-md'
                            : 'bg-white border-[var(--color-cream)] text-[var(--color-charcoal)] hover:border-[var(--color-mist)] hover:bg-[var(--color-cream)]/60'}`}
            >
              All Works
            </button>

            {categories.map((cat, i) => (
              <button
                key={cat._id}
                onClick={() =>
                  handleFilterChange({ ...currentFilters, category: cat._id })
                }
                className={`cursor-pointer flex-shrink-0 px-4 py-2 rounded-full text-xs
                            font-semibold border transition-all duration-200 whitespace-nowrap
                            animate-fade-in-up`}
                style={{ animationDelay: `${(i + 3) * 0.05}s` }}
              >
                <span className={`${currentFilters.category === cat._id
                  ? 'text-[var(--color-paper)]'
                  : 'text-[var(--color-charcoal)]'}`}>
                  {cat.name}
                </span>
                <style>{`
                  button[data-cat="${cat._id}"] {
                    background: ${currentFilters.category === cat._id
                      ? 'var(--color-ink)' : 'white'};
                    border-color: ${currentFilters.category === cat._id
                      ? 'var(--color-ink)' : 'var(--color-cream)'};
                  }
                `}</style>
              </button>
            ))}
          </div>
        </div>

        {/* ── Toolbar: active filters + grid toggle + filter btn ── */}
        <div className="flex flex-wrap items-center gap-3 mb-6 animate-fade-in-up stagger-3">

          {/* Active filter chips */}
          {Object.entries(currentFilters)
            .filter(([k]) => k !== 'page')
            .map(([key, val]) => (
              <span key={key}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                           bg-[var(--color-ink)]/8 border border-[var(--color-ink)]/12
                           text-xs font-medium text-[var(--color-charcoal)] animate-fade-in">
                <span className="capitalize">{key}:</span>
                <span className="text-[var(--color-rust)] font-semibold truncate max-w-[120px]">
                  {val}
                </span>
                <button
                  onClick={() => clearFilter(key)}
                  className="cursor-pointer ml-0.5 text-[var(--color-mist)]
                             hover:text-[var(--color-rust)] transition-colors duration-150"
                >
                  <HiXMark className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}

          <div className="ml-auto flex items-center gap-2">
            {/* Grid view toggle */}
            <div className="hidden sm:flex items-center gap-1 bg-white border
                            border-[var(--color-cream)] rounded-xl p-1">
              {[2, 3, 4].map(cols => (
                <button
                  key={cols}
                  onClick={() => setGridCols(cols)}
                  className={`cursor-pointer p-1.5 rounded-lg transition-all duration-150
                              ${gridCols === cols
                                ? 'bg-[var(--color-ink)] text-[var(--color-paper)] shadow-sm'
                                : 'text-[var(--color-mist)] hover:text-[var(--color-charcoal)]'}`}
                >
                  {cols === 2
                    ? <HiViewColumns  className="w-4 h-4" />
                    : cols === 3
                      ? <HiSquares2X2 className="w-4 h-4" />
                      : <HiSquares2X2 className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>

            {/* Filter toggle btn (mobile) */}
            <button
              onClick={() => setShowFilters(v => !v)}
              className="cursor-pointer lg:hidden flex items-center gap-2 px-4 py-2
                         bg-[var(--color-ink)] text-[var(--color-paper)] text-xs
                         font-semibold rounded-xl shadow-md hover:bg-[var(--color-charcoal)]
                         transition-all duration-200 relative"
            >
              <HiAdjustmentsHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full
                                 bg-[var(--color-rust)] text-white text-[10px] font-bold
                                 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── Search result banner ── */}
        {currentFilters.search && (
          <div className="flex items-center gap-2 mb-5 px-4 py-3 bg-[var(--color-gold)]/8
                          border border-[var(--color-gold)]/20 rounded-xl animate-fade-in">
            <HiMagnifyingGlass className="w-4 h-4 text-[var(--color-gold)] flex-shrink-0" />
            <p className="text-sm text-[var(--color-charcoal)]">
              Search results for{' '}
              <strong className="text-[var(--color-ink)]">
                "{currentFilters.search}"
              </strong>
              {pagination?.total && (
                <span className="text-[var(--color-mist)] ml-1.5">
                  — {pagination.total} results
                </span>
              )}
            </p>
            <button
              onClick={() => clearFilter('search')}
              className="cursor-pointer ml-auto text-[var(--color-mist)]
                         hover:text-[var(--color-rust)] transition-colors duration-150"
            >
              <HiXMark className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── Main layout ── */}
        <div className="flex gap-6 lg:gap-8 relative">

          {/* Sidebar filters — desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white/80 backdrop-blur-sm border
                            border-[var(--color-cream)] rounded-2xl overflow-hidden
                            shadow-sm animate-fade-in-up">
              <div className="h-1 w-full bg-gradient-to-r from-[var(--color-rust)]
                              via-[var(--color-gold)] to-[var(--color-sage)]" />
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-[var(--color-ink)] flex
                                 items-center gap-2">
                    <HiAdjustmentsHorizontal className="w-4 h-4" />
                    Filters
                  </h2>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={() => handleFilterChange({})}
                      className="cursor-pointer text-xs font-medium text-[var(--color-rust)]
                                 hover:underline transition-all duration-150"
                    >
                      Clear all ({activeFilterCount})
                    </button>
                  )}
                </div>
                <ArtworkFilters
                  filters={filters}
                  currentFilters={currentFilters}
                  onFilterChange={handleFilterChange}
                />
              </div>
            </div>
          </aside>

          {/* Mobile filter drawer */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-[var(--color-ink)]/40 backdrop-blur-sm
                           animate-fade-in"
                onClick={() => setShowFilters(false)}
              />
              {/* Drawer */}
              <div className="relative ml-auto w-80 max-w-[90vw] h-full bg-[var(--color-paper)]
                              shadow-2xl animate-slide-in-right flex flex-col">
                <div className="h-1 w-full bg-gradient-to-r from-[var(--color-rust)]
                                via-[var(--color-gold)] to-[var(--color-sage)]" />
                <div className="flex items-center justify-between px-5 py-4
                                border-b border-[var(--color-cream)]">
                  <h2 className="text-sm font-bold text-[var(--color-ink)] flex
                                 items-center gap-2">
                    <HiAdjustmentsHorizontal className="w-4 h-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-[var(--color-ink)]
                                       text-[var(--color-paper)] text-xs font-bold">
                        {activeFilterCount}
                      </span>
                    )}
                  </h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="cursor-pointer p-1.5 rounded-lg text-[var(--color-charcoal)]
                               hover:bg-[var(--color-cream)] transition-colors duration-150"
                  >
                    <HiXMark className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-5">
                  <ArtworkFilters
                    filters={filters}
                    currentFilters={currentFilters}
                    onFilterChange={(f) => { handleFilterChange(f); setShowFilters(false); }}
                  />
                </div>
                {activeFilterCount > 0 && (
                  <div className="p-4 border-t border-[var(--color-cream)]">
                    <button
                      onClick={() => { handleFilterChange({}); setShowFilters(false); }}
                      className="cursor-pointer w-full py-2.5 rounded-xl border
                                 border-[var(--color-mist)]/40 text-sm font-semibold
                                 text-[var(--color-rust)] hover:bg-[var(--color-rust)]/5
                                 transition-all duration-150"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Artwork grid */}
          <div className="flex-1 min-w-0">
            <ArtworkGrid
              artworks={items}
              loading={loading}
              columns={gridCols}
            />

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="mt-10 animate-fade-in-up">
                <Pagination
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}