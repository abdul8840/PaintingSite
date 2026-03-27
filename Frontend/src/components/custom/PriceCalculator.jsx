import { formatPrice } from '../../utils/currency';

export default function PriceCalculator({ pricing, loading }) {
  if (!pricing) return null;

  return (
    <div>
      <h3>Price Breakdown</h3>
      {loading ? (
        <p>Calculating...</p>
      ) : (
        <div>
          <div><span>Base Price</span><span>{formatPrice(pricing.basePrice)}</span></div>
          <div><span>Size Multiplier</span><span>×{pricing.sizeMultiplier}</span></div>
          <div><span>Style Multiplier</span><span>×{pricing.styleMultiplier}</span></div>
          {pricing.framingCost > 0 && <div><span>Framing</span><span>{formatPrice(pricing.framingCost)}</span></div>}
          {pricing.subjectsCost > 0 && <div><span>Additional Subjects</span><span>{formatPrice(pricing.subjectsCost)}</span></div>}
          {pricing.rushOrderCost > 0 && <div><span>Rush Order</span><span>{formatPrice(pricing.rushOrderCost)}</span></div>}
          <div><span>Subtotal</span><span>{formatPrice(pricing.subtotal)}</span></div>
          <div><span>Shipping</span><span>{formatPrice(pricing.shippingCost)}</span></div>
          <div><span>GST (18%)</span><span>{formatPrice(pricing.tax)}</span></div>
          <div><span>Total</span><span>{formatPrice(pricing.totalAmount)}</span></div>
          <p>Estimated completion: {pricing.estimatedCompletionDays} days</p>
        </div>
      )}
    </div>
  );
}