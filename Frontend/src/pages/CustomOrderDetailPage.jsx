import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomOrderById } from '../store/slices/customOrderSlice';
import customOrderApi from '../api/customOrderApi';
import { useToast } from '../hooks/useToast';
import OrderDetails from '../components/order/OrderDetails';
import Breadcrumb from '../components/common/Breadcrumb';
import Loader from '../components/common/Loader';

export default function CustomOrderDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: order, loading } = useSelector((state) => state.customOrders);
  const toast = useToast();

  useEffect(() => { dispatch(fetchCustomOrderById(id)); }, [dispatch, id]);

  const handleApprove = async () => {
    try {
      await customOrderApi.approve(id);
      dispatch(fetchCustomOrderById(id));
      toast.success('Order approved!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRevision = async () => {
    const notes = prompt('What changes would you like?');
    if (!notes) return;
    try {
      await customOrderApi.requestRevision(id, { notes });
      dispatch(fetchCustomOrderById(id));
      toast.success('Revision requested');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading || !order) return <Loader />;

  return (
    <div>
      <Breadcrumb items={[{ label: 'Custom Orders', href: '/custom-orders' }, { label: order.orderNumber }]} />
      <OrderDetails order={order} isCustom />

      {order.status === 'review' && (
        <div>
          <h3>Review the artwork</h3>
          <p>Revisions used: {order.revisionCount}/{order.maxRevisions}</p>
          <div>
            <button onClick={handleApprove}>Approve & Complete</button>
            {order.revisionCount < order.maxRevisions && (
              <button onClick={handleRevision}>Request Revision</button>
            )}
          </div>
        </div>
      )}

      {order.assignedArtist && (
        <div>
          <h3>Your Artist</h3>
          <p>{order.assignedArtist.firstName} {order.assignedArtist.lastName}</p>
        </div>
      )}
    </div>
  );
}