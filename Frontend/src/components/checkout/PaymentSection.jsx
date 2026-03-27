import { useState } from 'react';
import { useToast } from '../../hooks/useToast';

export default function PaymentSection({ onCreateOrder, loading }) {
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const toast = useToast();

  const handlePay = async () => {
    try {
      await onCreateOrder(paymentMethod);
    } catch (err) {
      toast.error(err.message || 'Payment failed');
    }
  };

  return (
    <div>
      <h3>Payment Method</h3>

      <div>
        <label>
          <input type="radio" name="payment" value="razorpay" checked={paymentMethod === 'razorpay'} onChange={(e) => setPaymentMethod(e.target.value)} />
          <span>Pay Online (Razorpay)</span>
          <span>UPI, Credit/Debit Card, Net Banking, Wallets</span>
        </label>

        <label>
          <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} />
          <span>Cash on Delivery (COD)</span>
        </label>
      </div>

      <button onClick={handlePay} disabled={loading}>
        {loading ? 'Processing...' : paymentMethod === 'razorpay' ? 'Pay Now' : 'Place Order (COD)'}
      </button>
    </div>
  );
}