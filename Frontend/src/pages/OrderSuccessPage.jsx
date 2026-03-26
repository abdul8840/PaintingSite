import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import orderApi from '../api/orderApi';
import { HiCheckCircle } from 'react-icons/hi';
import Loader from '../components/common/Loader';

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [orderType, setOrderType] = useState('artwork');
  const [loading, setLoading] = useState(true);
  const sessionId = searchParams.get('session_id');
  const type = searchParams.get('type');

  useEffect(() => {
    if (sessionId) {
      orderApi.verifySession(sessionId)
        .then(res => {
          setOrder(res.order);
          setOrderType(res.orderType || type || 'artwork');
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [sessionId, type]);

  if (loading) return <Loader text="Verifying your payment..." />;

  return (
    <div>
      <HiCheckCircle />
      <h1>Order Placed Successfully!</h1>

      {order ? (
        <div>
          <p>Order Number: <strong>{order.orderNumber}</strong></p>
          <p>Total: <strong>${order.totalAmount?.toFixed(2)}</strong></p>
          <p>Payment Status: <strong>{order.paymentStatus}</strong></p>
          <p>Order Status: <strong>{order.orderStatus}</strong></p>
        </div>
      ) : (
        <p>Your order has been received.</p>
      )}

      <p>Thank you for your purchase! We'll send you an email confirmation shortly.</p>

      <div>
        {orderType === 'custom' ? (
          <Link to="/custom-orders">View Custom Orders</Link>
        ) : (
          <Link to="/orders">View My Orders</Link>
        )}
        <Link to="/shop">Continue Shopping</Link>
      </div>
    </div>
  );
}