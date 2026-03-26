import { HiCurrencyDollar, HiCalculator, HiClock } from 'react-icons/hi';

export default function PriceCalculator({ pricing, loading }) {
  if (!pricing) return null;

  return (
    <div className="bg-white rounded-xl border border-cream p-4 sm:p-6 animate-fade-in-up sticky top-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 sm:mb-6 pb-4 border-b border-cream">
        <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-gold/20 to-gold/10 rounded-xl flex items-center justify-center">
          <HiCalculator className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-ink">Price Breakdown</h3>
      </div>

      {loading ? (
        /* Loading State */
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 bg-cream rounded w-1/3" />
              <div className="h-4 bg-cream rounded w-1/4" />
            </div>
          ))}
          <div className="h-px bg-cream my-4" />
          <div className="flex justify-between">
            <div className="h-6 bg-cream rounded w-1/4" />
            <div className="h-6 bg-cream rounded w-1/3" />
          </div>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {/* Base Price */}
          <div className="flex justify-between items-center text-sm sm:text-base animate-fade-in-up stagger-1">
            <span className="text-charcoal/70">Base Price</span>
            <span className="font-medium text-ink">${pricing.basePrice?.toFixed(2)}</span>
          </div>

          {/* Size Multiplier */}
          <div className="flex justify-between items-center text-sm sm:text-base animate-fade-in-up stagger-2">
            <span className="text-charcoal/70">Size Multiplier</span>
            <span className="font-medium text-ink">×{pricing.sizeMultiplier}</span>
          </div>

          {/* Style Multiplier */}
          <div className="flex justify-between items-center text-sm sm:text-base animate-fade-in-up stagger-3">
            <span className="text-charcoal/70">Style Multiplier</span>
            <span className="font-medium text-ink">×{pricing.styleMultiplier}</span>
          </div>

          {/* Framing Cost */}
          {pricing.framingCost > 0 && (
            <div className="flex justify-between items-center text-sm sm:text-base animate-fade-in-up">
              <span className="text-charcoal/70">Framing</span>
              <span className="font-medium text-ink">+${pricing.framingCost.toFixed(2)}</span>
            </div>
          )}

          {/* Additional Subjects */}
          {pricing.subjectsCost > 0 && (
            <div className="flex justify-between items-center text-sm sm:text-base animate-fade-in-up">
              <span className="text-charcoal/70">Additional Subjects</span>
              <span className="font-medium text-gold">+${pricing.subjectsCost.toFixed(2)}</span>
            </div>
          )}

          {/* Rush Order */}
          {pricing.rushOrderCost > 0 && (
            <div className="flex justify-between items-center text-sm sm:text-base animate-fade-in-up">
              <span className="text-charcoal/70 flex items-center gap-1.5">
                <HiClock className="w-4 h-4 text-rust" />
                Rush Order
              </span>
              <span className="font-medium text-rust">+${pricing.rushOrderCost.toFixed(2)}</span>
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-cream my-2 sm:my-3" />

          {/* Subtotal */}
          <div className="flex justify-between items-center text-sm sm:text-base animate-fade-in-up stagger-4">
            <span className="text-charcoal/70">Subtotal</span>
            <span className="font-medium text-ink">${pricing.subtotal?.toFixed(2)}</span>
          </div>

          {/* Shipping */}
          <div className="flex justify-between items-center text-sm sm:text-base animate-fade-in-up stagger-5">
            <span className="text-charcoal/70">Shipping</span>
            <span className="font-medium text-ink">
              {pricing.shippingCost > 0 ? `$${pricing.shippingCost.toFixed(2)}` : 'Free'}
            </span>
          </div>

          {/* Tax */}
          <div className="flex justify-between items-center text-sm sm:text-base animate-fade-in-up stagger-6">
            <span className="text-charcoal/70">Tax</span>
            <span className="font-medium text-ink">${pricing.tax?.toFixed(2)}</span>
          </div>

          {/* Divider */}
          <div className="h-px bg-ink/10 my-2 sm:my-3" />

          {/* Total */}
          <div className="flex justify-between items-center animate-fade-in-up stagger-7">
            <span className="text-base sm:text-lg font-bold text-ink">Total</span>
            <span className="text-xl sm:text-2xl font-bold text-ink">${pricing.totalAmount?.toFixed(2)}</span>
          </div>

          {/* Estimated Completion */}
          <div className="mt-4 sm:mt-5 pt-4 border-t border-cream animate-fade-in-up stagger-8">
            <div className="flex items-center gap-3 p-3 sm:p-4 bg-sage/10 rounded-xl">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-sage/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <HiClock className="w-5 h-5 text-sage" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-charcoal/60">Estimated Completion</p>
                <p className="font-bold text-ink text-sm sm:text-base">
                  {pricing.estimatedCompletionDays} business day{pricing.estimatedCompletionDays !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}