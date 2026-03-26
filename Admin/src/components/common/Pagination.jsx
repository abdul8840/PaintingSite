import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.pages <= 1) return null;
  
  const { page, pages, total, limit } = pagination;
  const startItem = ((page - 1) * limit) + 1;
  const endItem = Math.min(page * limit, total);

  const getVisiblePages = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || (i >= page - delta && i <= page + delta)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <div className="
      flex flex-col sm:flex-row
      items-center justify-between
      gap-4
      px-4 sm:px-6 py-3 sm:py-4
      bg-bg-primary
      border-t border-border-light
    ">
      {/* Info Text */}
      <span className="
        text-sm
        text-text-secondary
        order-2 sm:order-1
      ">
        Showing <span className="font-medium text-text-primary">{startItem}</span>
        {' '}-{' '}
        <span className="font-medium text-text-primary">{endItem}</span>
        {' '}of{' '}
        <span className="font-medium text-text-primary">{total}</span> results
      </span>
      
      {/* Pagination Controls */}
      <div className="
        flex items-center gap-1 sm:gap-2
        order-1 sm:order-2
      ">
        {/* Previous Button */}
        <button 
          onClick={() => onPageChange(page - 1)} 
          disabled={page === 1}
          className="
            flex items-center gap-1
            px-2 sm:px-3 py-2
            text-sm font-medium
            text-text-secondary hover:text-text-primary
            bg-bg-primary hover:bg-bg-secondary
            border border-border-light
            rounded-lg
            transition-colors duration-200
            cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed
            disabled:hover:bg-bg-primary
            focus-ring
          "
        >
          <HiChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </button>
        
        {/* Page Numbers - Desktop */}
        <div className="hidden sm:flex items-center gap-1">
          {getVisiblePages().map((pageNum, idx) => (
            pageNum === '...' ? (
              <span key={`dots-${idx}`} className="px-2 text-text-muted">...</span>
            ) : (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`
                  min-w-[40px] py-2
                  text-sm font-medium
                  rounded-lg
                  transition-colors duration-200
                  cursor-pointer
                  focus-ring
                  ${pageNum === page
                    ? 'bg-theme-primary text-white'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                  }
                `}
              >
                {pageNum}
              </button>
            )
          ))}
        </div>
        
        {/* Page Info - Mobile */}
        <span className="
          sm:hidden
          px-3 py-2
          text-sm font-medium
          text-text-primary
        ">
          {page} / {pages}
        </span>
        
        {/* Next Button */}
        <button 
          onClick={() => onPageChange(page + 1)} 
          disabled={page === pages}
          className="
            flex items-center gap-1
            px-2 sm:px-3 py-2
            text-sm font-medium
            text-text-secondary hover:text-text-primary
            bg-bg-primary hover:bg-bg-secondary
            border border-border-light
            rounded-lg
            transition-colors duration-200
            cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed
            disabled:hover:bg-bg-primary
            focus-ring
          "
        >
          <span className="hidden sm:inline">Next</span>
          <HiChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}