export default function Badge({ children, variant = 'default' }) {
  return <span data-variant={variant}>{children}</span>;
}