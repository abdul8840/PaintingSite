import { useState } from 'react';
import { useToast } from '../../hooks/useToast';
import couponApi from '../../api/couponApi';
import { HiTag, HiX, HiCheckCircle } from 'react-icons/hi';

export default function CustomCouponInput({ subtotal, onApply, onRemove, appliedCoupon }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      const res = await couponApi.validate({
        code: code.trim(),
        orderAmount: subtotal,
        orderType: 'custom-order',
      });
      onApply({
        code: res.coupon.code,
        discount: res.coupon.discount,
      });
      toast.success(`Coupon applied! You save $${res.coupon.discount.toFixed(2)}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    onRemove();
    setCode('');
    toast.info('Coupon removed');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleApply();
    }
  };

  // Applied Coupon State
  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between bg-sage/10 border border-sage/30 rounded-xl px-4 py-3 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-sage/20 rounded-lg flex items-center justify-center">
            <HiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-sage" />
          </div>
          <div>
            <span className="font-semibold text-ink text-sm sm:text-base">{appliedCoupon.code}</span>
            <p className="text-xs text-sage">Coupon applied successfully</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sage font-bold text-sm sm:text-base">-${appliedCoupon.discount.toFixed(2)}</span>
          <button 
            onClick={handleRemove}
            className="p-1.5 sm:p-2 text-charcoal/40 hover:text-rust hover:bg-rust/10 rounded-lg transition-all duration-300 cursor-pointer"
            aria-label="Remove coupon"
          >
            <HiX className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    );
  }

  // Input State
  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="relative flex-1">
          <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2">
            <HiTag className="w-4 h-4 sm:w-5 sm:h-5 text-mist" />
          </div>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            placeholder="Enter coupon code"
            className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-paper border border-cream rounded-xl text-ink placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all duration-300 text-sm sm:text-base uppercase tracking-wider"
          />
        </div>
        <button 
          onClick={handleApply} 
          disabled={loading || !code.trim()}
          className="px-5 sm:px-6 py-2.5 sm:py-3 bg-ink text-white rounded-xl font-medium hover:bg-charcoal transition-all duration-300 hover:shadow-lg hover:shadow-ink/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] text-sm sm:text-base whitespace-nowrap flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Applying...</span>
            </>
          ) : (
            <span>Apply</span>
          )}
        </button>
      </div>
      <p className="mt-2 text-xs text-charcoal/50">Have a promo code? Enter it above for a discount.</p>
    </div>
  );
}