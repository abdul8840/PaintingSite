import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { applyCoupon, removeCoupon, selectCartSubtotal } from '../../store/slices/cartSlice';
import { useToast } from '../../hooks/useToast';
import couponApi from '../../api/couponApi';

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
      const res = await couponApi.validate({ code: code.trim(), orderAmount: subtotal, orderType: 'artwork' });
      dispatch(applyCoupon({ coupon: res.coupon, discount: res.coupon.discount }));
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

  if (coupon) {
    return (
      <div>
        <span>{coupon.code}</span>
        <span>-${coupon.discount.toFixed(2)}</span>
        <button onClick={handleRemove}>Remove</button>
      </div>
    );
  }

  return (
    <div>
      <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Coupon code" />
      <button onClick={handleApply} disabled={loading || !code.trim()}>
        {loading ? 'Applying...' : 'Apply'}
      </button>
    </div>
  );
}