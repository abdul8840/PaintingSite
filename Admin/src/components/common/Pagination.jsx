import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.pages <= 1) return null;
  const { page, pages, total, limit } = pagination;

  return (
    <div>
      <span>Showing {((page - 1) * limit) + 1}-{Math.min(page * limit, total)} of {total}</span>
      <div>
        <button onClick={() => onPageChange(page - 1)} disabled={page === 1}><HiChevronLeft /> Prev</button>
        <span>Page {page} of {pages}</span>
        <button onClick={() => onPageChange(page + 1)} disabled={page === pages}>Next <HiChevronRight /></button>
      </div>
    </div>
  );
}