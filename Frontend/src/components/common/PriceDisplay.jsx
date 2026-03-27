import { formatPrice } from '../../utils/currency';

export default function PriceDisplay({ price, comparePrice, size = 'default' }) {
  return (
    <div>
      <span>{formatPrice(price)}</span>
      {comparePrice && comparePrice > price && (
        <>
          <span>{formatPrice(comparePrice)}</span>
          <span>{Math.round(((comparePrice - price) / comparePrice) * 100)}% off</span>
        </>
      )}
    </div>
  );
}