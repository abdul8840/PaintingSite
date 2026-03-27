// CartSummary.jsx
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/currency';
import { HiArrowRight, HiTruck, HiSparkles, HiShieldCheck, HiGift, HiInformationCircle } from 'react-icons/hi';

export default function CartSummary({ showCheckoutButton = true }) {
  const { totals, coupon, items } = useCart();
  
  const freeShippingThreshold = 2000;
  const amountToFreeShipping = freeShippingThreshold - totals.subtotal;
  const freeShippingProgress = Math.min((totals.subtotal / freeShippingThreshold) * 100, 100);

  return (
    <div className="bg-white rounded-2xl border border-cream overflow-hidden shadow-lg shadow-ink/5">
      {/* Header */}
      <div className="px-5 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-ink to-charcoal">
        <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <HiSparkles className="w-5 h-5 text-gold" />
          Order Summary
        </h3>
        <p className="text-sm text-white/60 mt-1">
          {items?.length || 0} item{items?.length !== 1 ? 's' : ''} in your cart
        </p>
      </div>
      
      {/* Free Shipping Progress */}
      {totals.subtotal > 0 && totals.subtotal < freeShippingThreshold && (
        <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-sage/5 to-sage/10 border-b border-cream">
          <div className="flex items-center justify-between text-sm mb-2">
            <div className="flex items-center gap-2">
              <HiTruck className="w-4 h-4 text-sage" />
              <span className="text-charcoal/70">Free shipping progress</span>
            </div>
            <span className="font-semibold text-sage">{Math.round(freeShippingProgress)}%</span>
          </div>
          
          {/* Progress Bar */}
          <div className="h-2.5 bg-cream rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-sage to-sage/80 rounded-full transition-all duration-700 ease-out relative"
              style={{ width: `${freeShippingProgress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-shimmer" />
            </div>
          </div>
          
          <p className="text-xs text-charcoal/60 mt-2 flex items-center gap-1">
            <HiGift className="w-3.5 h-3.5 text-rust" />
            Add <span className="font-bold text-rust">{formatPrice(amountToFreeShipping)}</span> more for 
            <span className="font-semibold text-sage"> FREE shipping!</span>
          </p>
        </div>
      )}
      
      {/* Achieved Free Shipping */}
      {totals.subtotal >= freeShippingThreshold && (
        <div className="px-5 sm:px-6 py-3 bg-sage/10 border-b border-sage/20">
          <div className="flex items-center gap-2 text-sage">
            <div className="w-6 h-6 bg-sage rounded-full flex items-center justify-center">
              <HiTruck className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold">You've unlocked FREE shipping! 🎉</span>
          </div>
        </div>
      )}
      
      {/* Price Breakdown */}
      <div className="px-5 sm:px-6 py-5 sm:py-6 space-y-3 sm:space-y-4">
        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span className="text-charcoal/70">Subtotal</span>
          <span className="font-medium text-ink">{formatPrice(totals.subtotal)}</span>
        </div>
        
        {/* Discount */}
        {totals.discount > 0 && (
          <div className="flex items-center justify-between py-2 px-3 bg-rust/5 rounded-xl border border-rust/10 -mx-1">
            <div className="flex items-center gap-2">
              <HiSparkles className="w-4 h-4 text-rust" />
              <span className="text-rust font-medium">
                Discount 
                {coupon && (
                  <span className="ml-1 px-1.5 py-0.5 bg-rust/10 rounded text-xs">
                    {coupon.code}
                  </span>
                )}
              </span>
            </div>
            <span className="font-semibold text-rust">-{formatPrice(totals.discount)}</span>
          </div>
        )}
        
        {/* Shipping */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-charcoal/70">Shipping</span>
            {totals.shipping === 0 && (
              <span className="px-1.5 py-0.5 bg-sage/10 text-sage text-xs font-medium rounded">
                FREE
              </span>
            )}
          </div>
          <span className={`font-medium ${totals.shipping === 0 ? 'text-sage line-through decoration-sage/50' : 'text-ink'}`}>
            {totals.shipping === 0 ? '₹99' : formatPrice(totals.shipping)}
          </span>
        </div>
        
        {/* Tax */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-charcoal/70">GST</span>
            <span className="text-xs text-charcoal/40">(18%)</span>
            <button className="text-charcoal/30 hover:text-charcoal/60 transition-colors cursor-pointer">
              <HiInformationCircle className="w-4 h-4" />
            </button>
          </div>
          <span className="font-medium text-ink">{formatPrice(totals.tax)}</span>
        </div>
        
        {/* Divider */}
        <div className="border-t-2 border-dashed border-cream my-2" />
        
        {/* Total */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="text-lg font-bold text-ink">Total</span>
            <p className="text-xs text-charcoal/50">Including all taxes</p>
          </div>
          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-bold text-ink">
              {formatPrice(totals.total)}
            </span>
            {totals.discount > 0 && (
              <p className="text-xs text-sage font-medium mt-1">
                You're saving {formatPrice(totals.discount)}!
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Checkout Button */}
      {showCheckoutButton && (
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 space-y-3">
          <Link 
            to="/checkout"
            className="group flex items-center justify-center gap-3 w-full px-6 py-4 bg-gradient-to-r from-ink to-charcoal text-white rounded-xl font-bold text-base sm:text-lg transition-all duration-500 hover:shadow-xl hover:shadow-ink/30 cursor-pointer active:scale-[0.98]"
          >
            <span>Proceed to Checkout</span>
            <HiArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
          
          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 py-2">
            <HiShieldCheck className="w-4 h-4 text-sage" />
            <span className="text-xs text-charcoal/50">Secure checkout powered by Razorpay</span>
          </div>
        </div>
      )}
      
      {/* Trust Indicators */}
      <div className="px-5 sm:px-6 py-4 bg-cream/30 border-t border-cream">
        <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
          {[
            { icon: '🔒', label: 'Secure' },
            { icon: '📦', label: 'Tracked' },
            { icon: '↩️', label: '30-Day Returns' },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <span className="text-sm">{item.icon}</span>
              <span className="text-xs text-charcoal/60 font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}