const variantMap = {
  pending: 'warning',
  confirmed: 'info',
  processing: 'info',
  'in-progress': 'info',
  shipped: 'primary',
  delivered: 'success',
  completed: 'success',
  paid: 'success',
  cancelled: 'error',
  failed: 'error',
  refunded: 'error',
  accepted: 'info',
  review: 'warning',
  'revision-requested': 'warning',
  active: 'success',
  inactive: 'error',
};

export default function StatusBadge({ status }) {
  const variant = variantMap[status] || 'default';
  return <span data-variant={variant}>{status}</span>;
}