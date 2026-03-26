export default function PriceCalculator({ pricing, loading }) {
  if (!pricing) return null;

  return (
    <div>
      <h3>Price Breakdown</h3>
      {loading ? (
        <p>Calculating...</p>
      ) : (
        <div>
          <div><span>Base Price</span><span>${pricing.basePrice?.toFixed(2)}</span></div>
          <div><span>Size Multiplier</span><span>×{pricing.sizeMultiplier}</span></div>
          <div><span>Style Multiplier</span><span>×{pricing.styleMultiplier}</span></div>
          {pricing.framingCost > 0 && <div><span>Framing</span><span>${pricing.framingCost.toFixed(2)}</span></div>}
          {pricing.subjectsCost > 0 && <div><span>Additional Subjects</span><span>${pricing.subjectsCost.toFixed(2)}</span></div>}
          {pricing.rushOrderCost > 0 && <div><span>Rush Order</span><span>${pricing.rushOrderCost.toFixed(2)}</span></div>}
          <div><span>Subtotal</span><span>${pricing.subtotal?.toFixed(2)}</span></div>
          <div><span>Shipping</span><span>${pricing.shippingCost?.toFixed(2)}</span></div>
          <div><span>Tax</span><span>${pricing.tax?.toFixed(2)}</span></div>
          <div><span>Total</span><span>${pricing.totalAmount?.toFixed(2)}</span></div>
          <p>Estimated completion: {pricing.estimatedCompletionDays} days</p>
        </div>
      )}
    </div>
  );
}