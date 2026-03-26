export default function PriceDisplay({
  price,
  comparePrice,
  size = 'default',
}) {
  const sizes = {
    small: {
      price: 'text-sm',
      compare: 'text-xs',
      badge: 'text-[9px] px-1.5 py-0.5',
    },
    default: {
      price: 'text-lg',
      compare: 'text-sm',
      badge: 'text-[10px] px-2 py-0.5',
    },
    large: {
      price: 'text-2xl sm:text-3xl',
      compare: 'text-base',
      badge: 'text-xs px-2.5 py-1',
    },
  };

  const s = sizes[size] || sizes.default;
  const hasDiscount = comparePrice && comparePrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : 0;

  return (
    <div className="flex items-center flex-wrap gap-2">
      {/* Current Price */}
      <span
        className={`
          ${s.price} font-bold text-ink tracking-tight
        `}
      >
        ${price?.toFixed(2)}
      </span>

      {hasDiscount && (
        <>
          {/* Original Price */}
          <span
            className={`
              ${s.compare} text-mist line-through
            `}
          >
            ${comparePrice.toFixed(2)}
          </span>

          {/* Discount Badge */}
          <span
            className={`
              ${s.badge}
              inline-flex items-center
              font-bold uppercase tracking-wider
              bg-rust/10 text-rust
              rounded-lg
            `}
          >
            {discountPercent}% off
          </span>
        </>
      )}
    </div>
  );
}