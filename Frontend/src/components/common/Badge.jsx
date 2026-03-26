export default function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-cream text-charcoal border-cream',
    success: 'bg-sage/15 text-sage border-sage/20',
    error: 'bg-rust/10 text-rust border-rust/20',
    warning: 'bg-gold/15 text-gold border-gold/20',
    info: 'bg-mist/20 text-charcoal border-mist/30',
    primary: 'bg-rust/10 text-rust border-rust/20',
    featured: 'bg-gold/15 text-gold border-gold/30',
    new: 'bg-sage/15 text-sage border-sage/20',
    sale: 'bg-rust/10 text-rust border-rust/20',
    soldout: 'bg-mist/20 text-mist border-mist/30',
    pending: 'bg-gold/15 text-gold border-gold/20',
    processing: 'bg-mist/20 text-charcoal border-mist/30',
    shipped: 'bg-sage/10 text-sage border-sage/20',
    delivered: 'bg-sage/15 text-sage border-sage/25',
    cancelled: 'bg-rust/10 text-rust border-rust/20',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1
        px-2.5 py-0.5
        text-[11px] font-semibold uppercase tracking-wider
        rounded-lg border
        transition-all duration-300
        select-none
        ${variants[variant] || variants.default}
      `}
    >
      {children}
    </span>
  );
}