import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.pages <= 1) return null;
  const { page, pages, total } = pagination;

  const getPages = () => {
    const p = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(pages, page + 2);
    if (start > 1) { p.push(1); if (start > 2) p.push('...'); }
    for (let i = start; i <= end; i++) p.push(i);
    if (end < pages) { if (end < pages - 1) p.push('...'); p.push(pages); }
    return p;
  };

  return (
    <div>
      <span>Showing {((page - 1) * pagination.limit) + 1}-{Math.min(page * pagination.limit, total)} of {total}</span>
      <div>
        <button onClick={() => onPageChange(page - 1)} disabled={page === 1}><HiChevronLeft /></button>
        {getPages().map((p, i) => (
          p === '...' ? <span key={i}>...</span> :
          <button key={i} onClick={() => onPageChange(p)} data-active={p === page}>{p}</button>
        ))}
        <button onClick={() => onPageChange(page + 1)} disabled={page === pages}><HiChevronRight /></button>
      </div>
    </div>
  );
}