import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { trackOrder, clearTracked } from '../store/slices/orderSlice';
import OrderTimeline from '../components/order/OrderTimeline';
import Breadcrumb from '../components/common/Breadcrumb';
import { HiSearch } from 'react-icons/hi';

export default function TrackOrderPage() {
  const dispatch = useDispatch();
  const { tracked, loading, error } = useSelector((state) => state.orders);
  const [orderNumber, setOrderNumber] = useState('');

  const handleTrack = (e) => {
    e.preventDefault();
    if (orderNumber.trim()) {
      dispatch(clearTracked());
      dispatch(trackOrder(orderNumber.trim()));
    }
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Track Order' }]} />
      <h1>Track Your Order</h1>

      <form onSubmit={handleTrack}>
        <input value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="Enter your order number (e.g., SM-xxx)" />
        <button type="submit" disabled={loading}><HiSearch /> {loading ? 'Tracking...' : 'Track'}</button>
      </form>

      {error && <p>Order not found. Please check the order number.</p>}

      {tracked && (
        <div>
          <h2>Order {tracked.orderNumber}</h2>
          <div>
            <p>Status: {tracked.orderStatus}</p>
            <p>Payment: {tracked.paymentStatus}</p>
            {tracked.trackingNumber && <p>Tracking #: {tracked.trackingNumber}</p>}
            {tracked.estimatedDelivery && <p>Estimated Delivery: {new Date(tracked.estimatedDelivery).toLocaleDateString()}</p>}
          </div>
          <OrderTimeline statusHistory={tracked.statusHistory} />
        </div>
      )}
    </div>
  );
}