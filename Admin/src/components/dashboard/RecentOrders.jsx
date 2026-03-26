import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import { HiArrowRight, HiShoppingBag, HiColorSwatch, HiExternalLink } from 'react-icons/hi';

export default function RecentOrders({ orders = [], customOrders = [] }) {
  return (
    <div className="space-y-6">
      {/* Regular Orders */}
      <div className="bg-bg-primary rounded-xl border border-border-light overflow-hidden">
        {/* Header */}
        <div className="
          flex flex-col sm:flex-row sm:items-center justify-between gap-3
          px-4 sm:px-6 py-4
          border-b border-border-light
          bg-bg-secondary
        ">
          <div className="flex items-center gap-3">
            <div className="
              w-10 h-10
              bg-theme-primary/10
              rounded-lg
              flex items-center justify-center
            ">
              <HiShoppingBag className="w-5 h-5 text-theme-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Recent Orders</h3>
              <p className="text-sm text-text-muted">{orders.length} orders</p>
            </div>
          </div>
          <Link 
            to="/orders"
            className="
              inline-flex items-center gap-2
              px-4 py-2
              text-sm font-medium
              text-theme-primary hover:text-theme-accent
              bg-theme-primary/5 hover:bg-theme-primary/10
              rounded-lg
              transition-colors duration-200
              cursor-pointer
            "
          >
            View All
            <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Content */}
        {orders.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <div className="
              w-16 h-16
              mx-auto mb-4
              bg-bg-tertiary
              rounded-full
              flex items-center justify-center
            ">
              <HiShoppingBag className="w-8 h-8 text-text-muted" />
            </div>
            <p className="text-text-secondary font-medium">No recent orders</p>
            <p className="text-sm text-text-muted mt-1">Orders will appear here once customers start purchasing</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-border-light">
                  <th className="
                    px-4 sm:px-6 py-3
                    text-left text-xs font-semibold
                    text-text-secondary uppercase tracking-wider
                  ">
                    Order #
                  </th>
                  <th className="
                    px-4 sm:px-6 py-3
                    text-left text-xs font-semibold
                    text-text-secondary uppercase tracking-wider
                  ">
                    Customer
                  </th>
                  <th className="
                    px-4 sm:px-6 py-3
                    text-left text-xs font-semibold
                    text-text-secondary uppercase tracking-wider
                  ">
                    Amount
                  </th>
                  <th className="
                    px-4 sm:px-6 py-3
                    text-left text-xs font-semibold
                    text-text-secondary uppercase tracking-wider
                  ">
                    Status
                  </th>
                  <th className="
                    px-4 sm:px-6 py-3
                    text-left text-xs font-semibold
                    text-text-secondary uppercase tracking-wider
                  ">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {orders.map((order) => (
                  <tr 
                    key={order._id}
                    className="hover:bg-bg-secondary transition-colors duration-150"
                  >
                    <td className="px-4 sm:px-6 py-4">
                      <Link 
                        to={`/orders/${order._id}`}
                        className="
                          inline-flex items-center gap-1.5
                          text-sm font-medium
                          text-theme-primary hover:text-theme-accent
                          transition-colors duration-200
                          cursor-pointer
                        "
                      >
                        {order.orderNumber}
                        <HiExternalLink className="w-3.5 h-3.5 opacity-50" />
                      </Link>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="
                          w-8 h-8
                          bg-bg-tertiary
                          rounded-full
                          flex items-center justify-center
                          text-xs font-semibold
                          text-text-secondary
                        ">
                          {order.user?.firstName?.[0]}{order.user?.lastName?.[0]}
                        </div>
                        <span className="text-sm text-text-primary">
                          {order.user?.firstName} {order.user?.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className="text-sm font-semibold text-text-primary">
                        ${order.totalAmount?.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <StatusBadge status={order.orderStatus} />
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className="text-sm text-text-secondary">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Custom Orders */}
      {customOrders.length > 0 && (
        <div className="bg-bg-primary rounded-xl border border-border-light overflow-hidden">
          {/* Header */}
          <div className="
            flex flex-col sm:flex-row sm:items-center justify-between gap-3
            px-4 sm:px-6 py-4
            border-b border-border-light
            bg-bg-secondary
          ">
            <div className="flex items-center gap-3">
              <div className="
                w-10 h-10
                bg-purple-100
                rounded-lg
                flex items-center justify-center
              ">
                <HiColorSwatch className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Recent Custom Orders</h3>
                <p className="text-sm text-text-muted">{customOrders.length} orders</p>
              </div>
            </div>
            <Link 
              to="/custom-orders"
              className="
                inline-flex items-center gap-2
                px-4 py-2
                text-sm font-medium
                text-purple-600 hover:text-purple-700
                bg-purple-50 hover:bg-purple-100
                rounded-lg
                transition-colors duration-200
                cursor-pointer
              "
            >
              View All
              <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-border-light">
                  <th className="
                    px-4 sm:px-6 py-3
                    text-left text-xs font-semibold
                    text-text-secondary uppercase tracking-wider
                  ">
                    Order #
                  </th>
                  <th className="
                    px-4 sm:px-6 py-3
                    text-left text-xs font-semibold
                    text-text-secondary uppercase tracking-wider
                  ">
                    Customer
                  </th>
                  <th className="
                    px-4 sm:px-6 py-3
                    text-left text-xs font-semibold
                    text-text-secondary uppercase tracking-wider
                  ">
                    Style
                  </th>
                  <th className="
                    px-4 sm:px-6 py-3
                    text-left text-xs font-semibold
                    text-text-secondary uppercase tracking-wider
                  ">
                    Amount
                  </th>
                  <th className="
                    px-4 sm:px-6 py-3
                    text-left text-xs font-semibold
                    text-text-secondary uppercase tracking-wider
                  ">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {customOrders.map((order) => (
                  <tr 
                    key={order._id}
                    className="hover:bg-bg-secondary transition-colors duration-150"
                  >
                    <td className="px-4 sm:px-6 py-4">
                      <Link 
                        to={`/custom-orders/${order._id}`}
                        className="
                          inline-flex items-center gap-1.5
                          text-sm font-medium
                          text-purple-600 hover:text-purple-700
                          transition-colors duration-200
                          cursor-pointer
                        "
                      >
                        {order.orderNumber}
                        <HiExternalLink className="w-3.5 h-3.5 opacity-50" />
                      </Link>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="
                          w-8 h-8
                          bg-purple-100
                          rounded-full
                          flex items-center justify-center
                          text-xs font-semibold
                          text-purple-600
                        ">
                          {order.user?.firstName?.[0]}{order.user?.lastName?.[0]}
                        </div>
                        <span className="text-sm text-text-primary">
                          {order.user?.firstName} {order.user?.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className="
                        inline-flex
                        px-2.5 py-1
                        text-xs font-medium
                        text-purple-700
                        bg-purple-50
                        rounded-full
                        capitalize
                      ">
                        {order.sketchStyle}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className="text-sm font-semibold text-text-primary">
                        ${order.totalAmount?.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}