// PriceDisplay.jsx
import { formatPrice } from '../../utils/currency';
import { HiSparkles, HiTrendingDown } from 'react-icons/hi';

export default function PriceDisplay({ price, comparePrice, size = 'default', showBadge = true }) {
  const hasDiscount = comparePrice && comparePrice > price;
  const discountPercent = hasDiscount ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;

  const sizeClasses = {
    small: {
      price: 'text-base sm:text-lg',
      compare: 'text-xs sm:text-sm',
      badge: 'text-[10px] px-1.5 py-0.5',
    },
    default: {
      price: 'text-lg sm:text-xl',
      compare: 'text-sm',
      badge: 'text-xs px-2 py-1',
    },
    large: {
      price: 'text-2xl sm:text-3xl',
      compare: 'text-base',
      badge: 'text-sm px-2.5 py-1',
    },
    xlarge: {
      price: 'text-3xl sm:text-4xl',
      compare: 'text-lg',
      badge: 'text-sm px-3 py-1.5',
    },
  };

  const classes = sizeClasses[size] || sizeClasses.default;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Current Price */}
      <span className={`font-bold text-ink ${classes.price}`}>
        {formatPrice(price)}
      </span>

      {/* Compare Price & Discount */}
      {hasDiscount && (
        <>
          <span className={`text-charcoal/40 line-through ${classes.compare}`}>
            {formatPrice(comparePrice)}
          </span>
          
          {showBadge && (
            <span className={`inline-flex items-center gap-1 bg-rust/10 text-rust font-semibold rounded-full ${classes.badge}`}>
              <HiTrendingDown className="w-3 h-3" />
              {discountPercent}% off
            </span>
          )}
        </>
      )}
    </div>
  );
}