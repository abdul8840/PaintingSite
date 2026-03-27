// PriceCalculator.jsx
import { formatPrice } from '../../utils/currency';
import { HiCurrencyRupee, HiSparkles, HiClock, HiTruck, HiShieldCheck, HiLightningBolt } from 'react-icons/hi';

export default function PriceCalculator({ pricing, loading }) {
  if (!pricing && !loading) return null;

  return (
    <div className="bg-white rounded-2xl border border-cream overflow-hidden shadow-lg shadow-ink/5">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-ink to-charcoal">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <HiCurrencyRupee className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Price Breakdown</h3>
            <p className="text-xs text-white/60">Real-time calculation</p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-6">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 bg-cream rounded animate-shimmer" style={{ width: `${60 + i * 5}%` }} />
                <div className="h-4 w-16 bg-cream rounded animate-shimmer" />
              </div>
            ))}
            <div className="pt-3 mt-3 border-t-2 border-dashed border-cream">
              <div className="flex items-center justify-between">
                <div className="h-6 w-20 bg-cream rounded animate-shimmer" />
                <div className="h-8 w-28 bg-cream rounded animate-shimmer" />
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-charcoal/50 mt-4 flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Calculating your price...
          </p>
        </div>
      )}

      {/* Price Details */}
      {!loading && pricing && (
        <div className="p-5 space-y-3">
          {/* Base Calculations */}
          <div className="space-y-2.5">
            {/* Base Price */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-charcoal/70">Base Price</span>
              <span className="font-medium text-ink">{formatPrice(pricing.basePrice)}</span>
            </div>

            {/* Size Multiplier */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-charcoal/70">Size Multiplier</span>
                <span className="px-1.5 py-0.5 bg-sage/10 text-sage text-xs font-medium rounded">
                  Canvas
                </span>
              </div>
              <span className="font-medium text-ink">×{pricing.sizeMultiplier}</span>
            </div>

            {/* Style Multiplier */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-charcoal/70">Style Multiplier</span>
                <span className="px-1.5 py-0.5 bg-gold/10 text-gold text-xs font-medium rounded">
                  Art Style
                </span>
              </div>
              <span className="font-medium text-ink">×{pricing.styleMultiplier}</span>
            </div>
          </div>

          {/* Additional Costs */}
          {(pricing.framingCost > 0 || pricing.subjectsCost > 0 || pricing.rushOrderCost > 0) && (
            <div className="pt-3 mt-3 border-t border-cream space-y-2.5">
              {pricing.framingCost > 0 && (
                <div className="flex items-center justify-between text-sm animate-fade-in">
                  <div className="flex items-center gap-2">
                    <span className="text-charcoal/70">Framing</span>
                    <span className="px-1.5 py-0.5 bg-charcoal/10 text-charcoal text-xs font-medium rounded">
                      Premium
                    </span>
                  </div>
                  <span className="font-medium text-ink">+{formatPrice(pricing.framingCost)}</span>
                </div>
              )}

              {pricing.subjectsCost > 0 && (
                <div className="flex items-center justify-between text-sm animate-fade-in">
                  <span className="text-charcoal/70">Additional Subjects</span>
                  <span className="font-medium text-ink">+{formatPrice(pricing.subjectsCost)}</span>
                </div>
              )}

              {pricing.rushOrderCost > 0 && (
                <div className="flex items-center justify-between text-sm p-2 bg-rust/5 rounded-lg border border-rust/10 -mx-2 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <HiLightningBolt className="w-4 h-4 text-rust" />
                    <span className="text-rust font-medium">Rush Order</span>
                  </div>
                  <span className="font-semibold text-rust">+{formatPrice(pricing.rushOrderCost)}</span>
                </div>
              )}
            </div>
          )}

          {/* Subtotal */}
          <div className="flex items-center justify-between text-sm pt-3 border-t border-cream">
            <span className="text-charcoal/70">Subtotal</span>
            <span className="font-semibold text-ink">{formatPrice(pricing.subtotal)}</span>
          </div>

          {/* Shipping */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <HiTruck className="w-4 h-4 text-charcoal/40" />
              <span className="text-charcoal/70">Shipping</span>
            </div>
            <span className="font-medium text-ink">{formatPrice(pricing.shippingCost)}</span>
          </div>

          {/* Tax */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-charcoal/70">GST</span>
              <span className="text-xs text-charcoal/40">(18%)</span>
            </div>
            <span className="font-medium text-ink">{formatPrice(pricing.tax)}</span>
          </div>

          {/* Divider */}
          <div className="border-t-2 border-dashed border-cream" />

          {/* Total */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-lg font-bold text-ink">Total</span>
              <p className="text-xs text-charcoal/50">Including all taxes</p>
            </div>
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-bold text-gradient">
                {formatPrice(pricing.totalAmount)}
              </span>
            </div>
          </div>

          {/* Estimated Completion */}
          <div className="flex items-center gap-3 p-3 bg-sage/5 rounded-xl border border-sage/20 mt-4">
            <div className="w-10 h-10 bg-sage/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <HiClock className="w-5 h-5 text-sage" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">
                Estimated Completion
              </p>
              <p className="text-xs text-charcoal/60">
                <span className="font-bold text-sage">{pricing.estimatedCompletionDays} business days</span>
                {pricing.rushOrderCost > 0 && (
                  <span className="ml-1 text-rust">(Rush)</span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Trust Badge */}
      <div className="px-5 py-3 bg-cream/30 border-t border-cream">
        <div className="flex items-center justify-center gap-2 text-xs text-charcoal/50">
          <HiShieldCheck className="w-4 h-4 text-sage" />
          <span>100% Satisfaction Guaranteed</span>
        </div>
      </div>
    </div>
  );
}