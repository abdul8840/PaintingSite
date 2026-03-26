import { useState } from 'react';
import { useToast } from '../../hooks/useToast';
import couponApi from '../../api/couponApi';

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

  if (appliedCoupon) {
    return (
      <div>
        <span>{appliedCoupon.code}</span>
        <span>-${appliedCoupon.discount.toFixed(2)}</span>
        <button onClick={handleRemove}>Remove</button>
      </div>
    );
  }

  return (
    <div>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="Coupon code"
      />
      <button onClick={handleApply} disabled={loading || !code.trim()}>
        {loading ? 'Applying...' : 'Apply'}
      </button>
    </div>
  );
}