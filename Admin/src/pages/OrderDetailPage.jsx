import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById, updateOrderStatus, clearCurrent } from '../store/slices/orderSlice';
import OrderStatusUpdate from '../components/order/OrderStatusUpdate';
import StatusBadge from '../components/common/StatusBadge';
import Loader from '../components/common/Loader';
import { useToast } from '../hooks/useToast';

export default function OrderDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const toast = useToast();
  const { current: order, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderById(id));
    return () => dispatch(clearCurrent());
  }, [dispatch, id]);

  const handleStatusUpdate = async (data) => {
    try {
      await dispatch(updateOrderStatus({ id, data })).unwrap();
      toast.success('Order status updated!');
    } catch (err) {
      toast.error(err);
    }
  };

  if (loading || !order) return <Loader />;

  return (
    <div>
      <div>
        <h1>Order {order.orderNumber}</h1>
        <StatusBadge status={order.orderStatus} />
      </div>

      <div>
        {/* Customer Info */}
        <div>
          <h3>Customer</h3>
          <p>{order.user?.firstName} {order.user?.lastName}</p>
          <p>{order.user?.email}</p>
        </div>

        {/* Items */}
        <div>
          <h3>Items</h3>
          {order.items?.map((item, i) => (
            <div key={i}>
              <img src={item.image} alt="" style={{ width: 60 }} />
              <div>
                <p>{item.title}</p>
                <p>Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Payment */}
        <div>
          <h3>Payment Summary</h3>
          <div><span>Subtotal:</span> <span>${order.subtotal?.toFixed(2)}</span></div>
          {order.discount > 0 && <div><span>Discount:</span> <span>-${order.discount.toFixed(2)}</span></div>}
          <div><span>Shipping:</span> <span>${order.shippingCost?.toFixed(2)}</span></div>
          <div><span>Tax:</span> <span>${order.tax?.toFixed(2)}</span></div>
          <div><span>Total:</span> <span>${order.totalAmount?.toFixed(2)}</span></div>
          <div><span>Payment Status:</span> <StatusBadge status={order.paymentStatus} /></div>
        </div>

        {/* Shipping */}
        <div>
          <h3>Shipping Address</h3>
          <p>{order.shippingAddress?.street}</p>
          <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
          <p>{order.shippingAddress?.country}</p>
          {order.trackingNumber && <p>Tracking: {order.trackingNumber}</p>}
        </div>

        {/* Status Timeline */}
        <div>
          <h3>Status History</h3>
          {order.statusHistory?.map((entry, i) => (
            <div key={i}>
              <StatusBadge status={entry.status} />
              <span>{new Date(entry.date).toLocaleString()}</span>
              {entry.note && <p>{entry.note}</p>}
            </div>
          ))}
        </div>

        {/* Update Status */}
        <OrderStatusUpdate currentStatus={order.orderStatus} onUpdate={handleStatusUpdate} loading={loading} />
      </div>
    </div>
  );
}