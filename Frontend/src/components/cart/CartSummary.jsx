import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { HiArrowRight, HiShieldCheck, HiTruck } from 'react-icons/hi';

export default function CartSummary({ showCheckoutButton = true }) {
  const { totals, coupon } = useCart();

  const freeShippingThreshold = 200;
  const amountToFreeShipping = freeShippingThreshold - totals.subtotal;
  const freeShippingProgress = Math.min(
    (totals.subtotal / freeShippingThreshold) * 100,
    100
  );

  return (
    <div
      className="
        bg-paper rounded-2xl
        border border-cream
        overflow-hidden
        sticky top-24
      "
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-cream bg-cream/30">
        <h3 className="text-base font-bold text-ink tracking-tight">
          Order Summary
        </h3>
      </div>

      {/* Line Items */}
      <div className="px-5 py-5 space-y-3">
        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-mist">Subtotal</span>
          <span className="text-sm font-semibold text-ink">
            ${totals.subtotal.toFixed(2)}
          </span>
        </div>

        {/* Discount */}
        {totals.discount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-sage">
              Discount{' '}
              {coupon && (
                <span
                  className="
                    ml-1 px-1.5 py-0.5
                    text-[10px] font-bold uppercase
                    bg-sage/10 text-sage
                    rounded-md
                  "
                >
                  {coupon.code}
                </span>
              )}
            </span>
            <span className="text-sm font-semibold text-sage">
              -${totals.discount.toFixed(2)}
            </span>
          </div>
        )}

        {/* Shipping */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-mist">Shipping</span>
          <span
            className={`
              text-sm font-semibold
              ${totals.shipping === 0 ? 'text-sage' : 'text-ink'}
            `}
          >
            {totals.shipping === 0 ? (
              <span className="flex items-center gap-1">
                <HiTruck className="w-3.5 h-3.5" />
                Free
              </span>
            ) : (
              `$${totals.shipping.toFixed(2)}`
            )}
          </span>
        </div>

        {/* Tax */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-mist">Tax</span>
          <span className="text-sm font-semibold text-ink">
            ${totals.tax.toFixed(2)}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-cream !mt-4 !mb-4" />

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-ink">Total</span>
          <span className="text-xl font-black text-ink tracking-tight">
            ${totals.total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Free Shipping Progress */}
      {amountToFreeShipping > 0 && (
        <div className="px-5 pb-4">
          <div
            className="
              p-3 rounded-xl
              bg-cream/50 border border-cream
            "
          >
            <div className="flex items-center gap-2 mb-2">
              <HiTruck className="w-4 h-4 text-rust shrink-0" />
              <p className="text-xs text-charcoal">
                Add{' '}
                <span className="font-bold text-rust">
                  ${amountToFreeShipping.toFixed(2)}
                </span>{' '}
                more for free shipping!
              </p>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-1.5 rounded-full bg-cream overflow-hidden">
              <div
                className="
                  h-full rounded-full
                  bg-gradient-to-r from-rust to-gold
                  transition-all duration-700 ease-out
                "
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Checkout Button */}
      {showCheckoutButton && (
        <div className="px-5 pb-5">
          <Link
            to="/checkout"
            className="
              group w-full
              inline-flex items-center justify-center gap-2
              px-6 py-3.5 rounded-xl
              bg-ink text-paper text-sm font-semibold
              hover:bg-charcoal
              transition-all duration-300 cursor-pointer
              active:scale-[0.98]
              shadow-lg shadow-ink/15
            "
          >
            Proceed to Checkout
            <HiArrowRight
              className="
                w-4 h-4
                group-hover:translate-x-1
                transition-transform duration-300
              "
            />
          </Link>

          {/* Security Note */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <HiShieldCheck className="w-3.5 h-3.5 text-sage" />
            <p className="text-[10px] text-mist uppercase tracking-wider font-medium">
              SSL Secured Checkout
            </p>
          </div>
        </div>
      )}
    </div>
  );
}