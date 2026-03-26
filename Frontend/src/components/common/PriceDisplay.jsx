export default function PriceDisplay({ price, comparePrice, size = 'default' }) {
  return (
    <div>
      <span>${price?.toFixed(2)}</span>
      {comparePrice && comparePrice > price && (
        <>
          <span>${comparePrice.toFixed(2)}</span>
          <span>{Math.round(((comparePrice - price) / comparePrice) * 100)}% off</span>
        </>
      )}
    </div>
  );
}