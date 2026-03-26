import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.pages <= 1) return null;

  const { page, pages, total, limit } = pagination;

  const getPages = () => {
    const p = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(pages, page + 2);
    if (start > 1) {
      p.push(1);
      if (start > 2) p.push('...');
    }
    for (let i = start; i <= end; i++) p.push(i);
    if (end < pages) {
      if (end < pages - 1) p.push('...');
      p.push(pages);
    }
    return p;
  };

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div
      className="
        flex flex-col sm:flex-row items-center justify-between gap-4
        py-6 mt-6
        border-t border-cream
      "
    >
      {/* Info */}
      <span className="text-xs sm:text-sm text-mist order-2 sm:order-1">
        Showing{' '}
        <span className="font-semibold text-charcoal">{startItem}</span>
        –
        <span className="font-semibold text-charcoal">{endItem}</span>
        {' '}of{' '}
        <span className="font-semibold text-charcoal">{total}</span>
      </span>

      {/* Page Buttons */}
      <div className="flex items-center gap-1 order-1 sm:order-2">
        {/* Previous */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="
            p-2 rounded-xl
            text-charcoal
            hover:bg-cream hover:text-rust
            disabled:opacity-30 disabled:cursor-not-allowed
            disabled:hover:bg-transparent disabled:hover:text-charcoal
            transition-all duration-300 cursor-pointer
            active:scale-90
          "
          aria-label="Previous page"
        >
          <HiChevronLeft className="w-4 h-4" />
        </button>

        {/* Pages */}
        {getPages().map((p, i) =>
          p === '...' ? (
            <span
              key={`dots-${i}`}
              className="
                w-9 h-9
                flex items-center justify-center
                text-xs text-mist
                select-none
              "
            >
              ···
            </span>
          ) : (
            <button
              key={`page-${p}`}
              onClick={() => onPageChange(p)}
              className={`
                w-9 h-9 rounded-xl
                text-sm font-semibold
                transition-all duration-300 cursor-pointer
                active:scale-90
                ${
                  p === page
                    ? 'bg-ink text-paper shadow-md shadow-ink/10'
                    : 'text-charcoal hover:bg-cream hover:text-rust'
                }
              `}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === pages}
          className="
            p-2 rounded-xl
            text-charcoal
            hover:bg-cream hover:text-rust
            disabled:opacity-30 disabled:cursor-not-allowed
            disabled:hover:bg-transparent disabled:hover:text-charcoal
            transition-all duration-300 cursor-pointer
            active:scale-90
          "
          aria-label="Next page"
        >
          <HiChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}