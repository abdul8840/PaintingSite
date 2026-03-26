import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomOrderById, updateCustomOrder, clearCurrent } from '../store/slices/customOrderSlice';
import CustomOrderManager from '../components/custom-order/CustomOrderManager';
import StatusBadge from '../components/common/StatusBadge';
import Loader from '../components/common/Loader';
import { useToast } from '../hooks/useToast';

export default function CustomOrderDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const toast = useToast();
  const { current: order, loading } = useSelector((state) => state.customOrders);

  useEffect(() => {
    dispatch(fetchCustomOrderById(id));
    return () => dispatch(clearCurrent());
  }, [dispatch, id]);

  const handleUpdate = async (data) => {
    try {
      await dispatch(updateCustomOrder({ id, data })).unwrap();
      toast.success('Custom order updated!');
    } catch (err) {
      toast.error(err);
    }
  };

  if (loading || !order) return <Loader />;

  return (
    <div>
      <div>
        <h1>Custom Order {order.orderNumber}</h1>
        <StatusBadge status={order.status} />
      </div>

      <div>
        {/* Customer */}
        <div>
          <h3>Customer</h3>
          <p>{order.user?.firstName} {order.user?.lastName}</p>
          <p>{order.user?.email}</p>
        </div>

        {/* Reference Image */}
        <div>
          <h3>Reference Image</h3>
          <img src={order.referenceImage?.url} alt="Reference" style={{ maxWidth: 400 }} />
          {order.additionalImages?.length > 0 && (
            <div>
              <h4>Additional Images</h4>
              {order.additionalImages.map((img, i) => (
                <img key={i} src={img.url} alt="" style={{ width: 100, height: 100, objectFit: 'cover' }} />
              ))}
            </div>
          )}
        </div>

        {/* Order Details */}
        <div>
          <h3>Order Details</h3>
          <div><span>Style:</span> <span>{order.sketchStyle}</span></div>
          <div><span>Canvas Size:</span> <span>{order.canvasSize}</span></div>
          <div><span>Color Style:</span> <span>{order.colorStyle}</span></div>
          <div><span>Framing:</span> <span>{order.framingOption}</span></div>
          <div><span>Background:</span> <span>{order.backgroundPreference}</span></div>
          <div><span>Subjects:</span> <span>{order.numberOfSubjects}</span></div>
          <div><span>Rush Order:</span> <span>{order.isRushOrder ? 'Yes' : 'No'}</span></div>
          {order.additionalNotes && <div><span>Notes:</span> <span>{order.additionalNotes}</span></div>}
        </div>

        {/* Pricing */}
        <div>
          <h3>Pricing</h3>
          <div><span>Base Price:</span> <span>${order.basePrice?.toFixed(2)}</span></div>
          <div><span>Subtotal:</span> <span>${order.subtotal?.toFixed(2)}</span></div>
          {order.discount > 0 && <div><span>Discount:</span> <span>-${order.discount.toFixed(2)}</span></div>}
          <div><span>Shipping:</span> <span>${order.shippingCost?.toFixed(2)}</span></div>
          <div><span>Tax:</span> <span>${order.tax?.toFixed(2)}</span></div>
          <div><span>Total:</span> <span>${order.totalAmount?.toFixed(2)}</span></div>
          <div><span>Payment:</span> <StatusBadge status={order.paymentStatus} /></div>
        </div>

        {/* Shipping */}
        {order.shippingAddress && (
          <div>
            <h3>Shipping Address</h3>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
          </div>
        )}

        {/* AI Suggestions */}
        {order.aiSuggestedStyles?.length > 0 && (
          <div>
            <h3>AI Suggested Styles</h3>
            {order.aiSuggestedStyles.map((s, i) => (
              <div key={i}>
                <span>{s.style}</span>
                <span>{Math.round(s.confidence * 100)}%</span>
                <span>{s.reason}</span>
              </div>
            ))}
          </div>
        )}

        {/* Progress Images */}
        {order.progressImages?.length > 0 && (
          <div>
            <h3>Progress Images</h3>
            {order.progressImages.map((img, i) => (
              <div key={i}>
                <img src={img.url} alt={img.stage} style={{ width: 150 }} />
                <p>{img.stage} - {new Date(img.uploadedAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}

        {/* Final Image */}
        {order.finalImage?.url && (
          <div>
            <h3>Final Artwork</h3>
            <img src={order.finalImage.url} alt="Final" style={{ maxWidth: 400 }} />
          </div>
        )}

        {/* Status History */}
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

        {/* Management Panel */}
        <CustomOrderManager order={order} onUpdate={handleUpdate} loading={loading} />
      </div>
    </div>
  );
}