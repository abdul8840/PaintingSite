import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import orderApi from '../api/orderApi';
import { HiCheckCircle } from 'react-icons/hi';

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      orderApi.verifySession(sessionId).then(res => setOrder(res.order)).catch(() => {});
    }
  }, [sessionId]);

  return (
    <div>
      <HiCheckCircle />
      <h1>Order Placed Successfully!</h1>
      {order && (
        <div>
          <p>Order Number: <strong>{order.orderNumber}</strong></p>
          <p>Total: <strong>${order.totalAmount?.toFixed(2)}</strong></p>
          <p>Status: {order.orderStatus}</p>
        </div>
      )}
      <p>Thank you for your purchase! We'll send you an email confirmation shortly.</p>
      <div>
        <Link to="/orders">View My Orders</Link>
        <Link to="/shop">Continue Shopping</Link>
      </div>
    </div>
  );
}