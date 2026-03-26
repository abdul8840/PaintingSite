import { Link } from 'react-router-dom';
import Badge from '../common/Badge';

const statusVariants = {
  pending: 'warning', confirmed: 'info', processing: 'info',
  shipped: 'info', delivered: 'success', cancelled: 'error', returned: 'error',
};

export default function OrderCard({ order, isCustom = false }) {
  const detailUrl = isCustom ? `/custom-orders/${order._id}` : `/orders/${order._id}`;

  return (
    <div>
      <div>
        <div>
          <p>{order.orderNumber}</p>
          <p>{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <Badge variant={statusVariants[isCustom ? order.status : order.orderStatus]}>
          {isCustom ? order.status : order.orderStatus}
        </Badge>
      </div>

      {!isCustom && order.items && (
        <div>
          {order.items.slice(0, 3).map((item, i) => (
            <div key={i}>
              <img src={item.image} alt={item.title} />
              <div>
                <p>{item.title}</p>
                <p>Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
          {order.items.length > 3 && <p>+{order.items.length - 3} more items</p>}
        </div>
      )}

      {isCustom && (
        <div>
          <img src={order.referenceImage?.url} alt="Reference" />
          <div>
            <p>Style: {order.sketchStyle}</p>
            <p>Size: {order.canvasSize}</p>
          </div>
        </div>
      )}

      <div>
        <p>Total: ${order.totalAmount?.toFixed(2)}</p>
        <Link to={detailUrl}>View Details</Link>
      </div>
    </div>
  );
}