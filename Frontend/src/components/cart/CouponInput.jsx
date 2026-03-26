import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  applyCoupon,
  removeCoupon,
  selectCartSubtotal,
} from '../../store/slices/cartSlice';
import { useToast } from '../../hooks/useToast';
import couponApi from '../../api/couponApi';
import { HiTag, HiX, HiCheck } from 'react-icons/hi';

export default function CouponInput() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const toast = useToast();
  const subtotal = useSelector(selectCartSubtotal);
  const coupon = useSelector((state) => state.cart.coupon);

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      const res = await couponApi.validate({
        code: code.trim(),
        orderAmount: subtotal,
        orderType: 'artwork',
      });
      dispatch(
        applyCoupon({ coupon: res.coupon, discount: res.coupon.discount })
      );
      toast.success(`Coupon applied! You save $${res.coupon.discount.toFixed(2)}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    dispatch(removeCoupon());
    setCode('');
    toast.info('Coupon removed');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleApply();
    }
  };

  /* ---- Applied State ---- */
  if (coupon) {
    return (
      <div
        className="
          flex items-center justify-between gap-3
          px-4 py-3 rounded-xl
          bg-sage/10 border border-sage/20
          animate-scale-in
        "
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="
              w-8 h-8 rounded-lg
              bg-sage/15
              flex items-center justify-center
              shrink-0
            "
          >
            <HiCheck className="w-4 h-4 text-sage" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-sage font-bold uppercase tracking-wider">
              {coupon.code}
            </p>
            <p className="text-[10px] text-sage/70 mt-0.5">
              Saving ${coupon.discount.toFixed(2)}
            </p>
          </div>
        </div>

        <button
          onClick={handleRemove}
          className="
            p-1.5 rounded-lg
            text-sage/60 hover:text-rust hover:bg-rust/5
            transition-all duration-300 cursor-pointer
            active:scale-90
            shrink-0
          "
          aria-label="Remove coupon"
        >
          <HiX className="w-4 h-4" />
        </button>
      </div>
    );
  }

  /* ---- Input State ---- */
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-charcoal mb-2">
        <HiTag className="w-3.5 h-3.5 text-mist" />
        Coupon Code
      </label>
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={handleKeyDown}
          placeholder="Enter code"
          className="
            flex-1 min-w-0
            px-4 py-2.5 rounded-xl
            bg-cream/50 border border-cream
            text-sm text-ink font-medium
            placeholder:text-mist placeholder:font-normal
            uppercase tracking-wider
            focus:outline-none focus:border-rust/40
            focus:shadow-md focus:shadow-rust/5
            transition-all duration-300
          "
        />
        <button
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="
            px-5 py-2.5 rounded-xl
            bg-ink text-paper text-sm font-semibold
            hover:bg-charcoal
            disabled:opacity-40 disabled:cursor-not-allowed
            disabled:hover:bg-ink
            transition-all duration-300 cursor-pointer
            active:scale-[0.98]
            shadow-sm shadow-ink/10
            shrink-0
          "
        >
          {loading ? (
            <span className="flex items-center gap-1.5">
              <div
                className="
                  w-3.5 h-3.5 rounded-full
                  border-2 border-paper/30 border-t-paper
                  animate-spin
                "
              />
              Applying
            </span>
          ) : (
            'Apply'
          )}
        </button>
      </div>
    </div>
  );
}