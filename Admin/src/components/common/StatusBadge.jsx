const variantStyles = {
  pending: {
    bg: 'bg-warning-bg',
    text: 'text-[var(--color-warning-text)]',
    dot: 'bg-warning',
  },
  confirmed: {
    bg: 'bg-info-bg',
    text: 'text-[var(--color-info-text)]',
    dot: 'bg-info',
  },
  processing: {
    bg: 'bg-info-bg',
    text: 'text-[var(--color-info-text)]',
    dot: 'bg-info',
  },
  'in-progress': {
    bg: 'bg-info-bg',
    text: 'text-[var(--color-info-text)]',
    dot: 'bg-info',
  },
  shipped: {
    bg: 'bg-[#e0e7ff]',
    text: 'text-[#3730a3]',
    dot: 'bg-[#6366f1]',
  },
  delivered: {
    bg: 'bg-success-bg',
    text: 'text-[var(--color-success-text)]',
    dot: 'bg-success',
  },
  completed: {
    bg: 'bg-success-bg',
    text: 'text-[var(--color-success-text)]',
    dot: 'bg-success',
  },
  paid: {
    bg: 'bg-success-bg',
    text: 'text-[var(--color-success-text)]',
    dot: 'bg-success',
  },
  cancelled: {
    bg: 'bg-error-bg',
    text: 'text-[var(--color-error-text)]',
    dot: 'bg-error',
  },
  failed: {
    bg: 'bg-error-bg',
    text: 'text-[var(--color-error-text)]',
    dot: 'bg-error',
  },
  refunded: {
    bg: 'bg-error-bg',
    text: 'text-[var(--color-error-text)]',
    dot: 'bg-error',
  },
  accepted: {
    bg: 'bg-info-bg',
    text: 'text-[var(--color-info-text)]',
    dot: 'bg-info',
  },
  review: {
    bg: 'bg-warning-bg',
    text: 'text-[var(--color-warning-text)]',
    dot: 'bg-warning',
  },
  'revision-requested': {
    bg: 'bg-warning-bg',
    text: 'text-[var(--color-warning-text)]',
    dot: 'bg-warning',
  },
  active: {
    bg: 'bg-success-bg',
    text: 'text-[var(--color-success-text)]',
    dot: 'bg-success',
  },
  inactive: {
    bg: 'bg-error-bg',
    text: 'text-[var(--color-error-text)]',
    dot: 'bg-error',
  },
  default: {
    bg: 'bg-bg-tertiary',
    text: 'text-text-secondary',
    dot: 'bg-text-muted',
  },
};

export default function StatusBadge({ status }) {
  const styles = variantStyles[status] || variantStyles.default;
  
  const formatStatus = (str) => {
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <span className={`
      inline-flex items-center gap-1.5
      px-2.5 py-1
      text-xs font-medium
      rounded-full
      whitespace-nowrap
      ${styles.bg}
      ${styles.text}
    `}>
      <span className={`
        w-1.5 h-1.5
        rounded-full
        ${styles.dot}
      `} />
      {formatStatus(status)}
    </span>
  );
}