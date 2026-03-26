import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById, cancelOrder } from '../store/slices/orderSlice';
import { useToast } from '../hooks/useToast';
import OrderDetails from '../components/order/OrderDetails';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Breadcrumb from '../components/common/Breadcrumb';
import Loader from '../components/common/Loader';

export default function OrderDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: order, loading } = useSelector((state) => state.orders);
  const [showCancel, setShowCancel] = useState(false);
  const toast = useToast();

  useEffect(() => { dispatch(fetchOrderById(id)); }, [dispatch, id]);

  const handleCancel = async () => {
    try {
      await dispatch(cancelOrder({ id, reason: 'Cancelled by customer' })).unwrap();
      toast.success('Order cancelled');
    } catch (err) {
      toast.error(err);
    }
  };

  if (loading || !order) return <Loader />;

  const canCancel = !['shipped', 'delivered', 'cancelled'].includes(order.orderStatus);

  return (
    <div>
      <Breadcrumb items={[{ label: 'My Orders', href: '/orders' }, { label: order.orderNumber }]} />
      <OrderDetails order={order} />
      {canCancel && <button onClick={() => setShowCancel(true)}>Cancel Order</button>}
      <ConfirmDialog isOpen={showCancel} onClose={() => setShowCancel(false)} onConfirm={handleCancel} title="Cancel Order" message="Are you sure you want to cancel this order?" confirmText="Yes, Cancel" />
    </div>
  );
}