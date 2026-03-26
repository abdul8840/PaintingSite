import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';

export default function RecentOrders({ orders = [], customOrders = [] }) {
  return (
    <div>
      <div>
        <h3>Recent Orders</h3>
        <Link to="/orders">View All</Link>
      </div>

      {orders.length === 0 ? (
        <p>No recent orders</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td><Link to={`/orders/${order._id}`}>{order.orderNumber}</Link></td>
                <td>{order.user?.firstName} {order.user?.lastName}</td>
                <td>${order.totalAmount?.toFixed(2)}</td>
                <td><StatusBadge status={order.orderStatus} /></td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {customOrders.length > 0 && (
        <div>
          <div>
            <h3>Recent Custom Orders</h3>
            <Link to="/custom-orders">View All</Link>
          </div>
          <table>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Style</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {customOrders.map((order) => (
                <tr key={order._id}>
                  <td><Link to={`/custom-orders/${order._id}`}>{order.orderNumber}</Link></td>
                  <td>{order.user?.firstName} {order.user?.lastName}</td>
                  <td>{order.sketchStyle}</td>
                  <td>${order.totalAmount?.toFixed(2)}</td>
                  <td><StatusBadge status={order.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}