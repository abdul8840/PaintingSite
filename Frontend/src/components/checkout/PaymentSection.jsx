import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useToast } from '../../hooks/useToast';

export default function PaymentSection({ onCreateOrder, loading }) {
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const toast = useToast();

  const handlePay = async () => {
    try {
      const result = await onCreateOrder(paymentMethod);

      if (paymentMethod === 'stripe' && result?.url) {
        window.location.href = result.url;
      }
    } catch (err) {
      toast.error(err.message || 'Payment failed');
    }
  };

  return (
    <div>
      <h3>Payment Method</h3>
      <div>
        <label>
          <input type="radio" name="payment" value="stripe" checked={paymentMethod === 'stripe'} onChange={(e) => setPaymentMethod(e.target.value)} />
          <span>Credit/Debit Card (Stripe)</span>
        </label>
      </div>
      <button onClick={handlePay} disabled={loading}>
        {loading ? 'Processing...' : paymentMethod === 'stripe' ? 'Pay with Stripe' : 'Place Order'}
      </button>
    </div>
  );
}