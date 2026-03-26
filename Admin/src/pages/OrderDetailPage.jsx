import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById, updateOrderStatus, clearCurrent } from '../store/slices/orderSlice';
import OrderStatusUpdate from '../components/order/OrderStatusUpdate';
import StatusBadge from '../components/common/StatusBadge';
import Loader from '../components/common/Loader';
import { useToast } from '../hooks/useToast';
import { 
  HiArrowLeft, 
  HiUser, 
  HiShoppingBag, 
  HiCurrencyDollar, 
  HiLocationMarker,
  HiClock,
  HiTruck
} from 'react-icons/hi';

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  if (loading || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/orders')}
          className="group inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-200 mb-4 sm:mb-6 cursor-pointer"
        >
          <HiArrowLeft className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1" />
          <span className="text-sm sm:text-base font-medium">Back to Orders</span>
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                Order {order.orderNumber}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <StatusBadge status={order.orderStatus} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-gray-800 to-gray-900"></div>
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <HiUser className="w-6 h-6 text-gray-700" />
                  <h3 className="text-lg font-bold text-gray-900">Customer Information</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-base font-semibold text-gray-900">
                    {order.user?.firstName} {order.user?.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{order.user?.email}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-gray-800 to-gray-900"></div>
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <HiShoppingBag className="w-6 h-6 text-gray-700" />
                  <h3 className="text-lg font-bold text-gray-900">Order Items</h3>
                </div>
                
                <div className="space-y-4">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">{item.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                        <p className="text-sm font-bold text-gray-900 mt-2">
                          ${(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Status History */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-gray-800 to-gray-900"></div>
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <HiClock className="w-6 h-6 text-gray-700" />
                  <h3 className="text-lg font-bold text-gray-900">Status History</h3>
                </div>
                
                <div className="space-y-3">
                  {order.statusHistory?.map((entry, i) => (
                    <div key={i} className="flex gap-3 pb-3 border-b border-gray-200 last:border-0">
                      <div className="flex-shrink-0 mt-1">
                        <StatusBadge status={entry.status} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">
                          {new Date(entry.date).toLocaleString()}
                        </p>
                        {entry.note && (
                          <p className="text-sm text-gray-700 mt-1">{entry.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-green-600 to-emerald-600"></div>
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <HiCurrencyDollar className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-bold text-gray-900">Payment Summary</h3>
                </div>
                
                <div className="space-y-3">
                  <PriceRow label="Subtotal" value={order.subtotal} />
                  {order.discount > 0 && (
                    <PriceRow label="Discount" value={-order.discount} className="text-green-600" />
                  )}
                  <PriceRow label="Shipping" value={order.shippingCost} />
                  <PriceRow label="Tax" value={order.tax} />
                  <div className="border-t-2 border-gray-200 pt-3 mt-3">
                    <PriceRow label="Total" value={order.totalAmount} className="text-xl font-bold" />
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-medium text-gray-700">Payment Status:</span>
                    <StatusBadge status={order.paymentStatus} />
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-gray-800 to-gray-900"></div>
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <HiLocationMarker className="w-6 h-6 text-gray-700" />
                  <h3 className="text-lg font-bold text-gray-900">Shipping Address</h3>
                </div>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>{order.shippingAddress?.street}</p>
                  <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
                  <p>{order.shippingAddress?.country}</p>
                </div>
                
                {order.trackingNumber && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                      <HiTruck className="w-4 h-4 text-blue-600" />
                      <p className="text-xs font-semibold text-blue-900">Tracking Number</p>
                    </div>
                    <p className="text-sm font-mono font-bold text-blue-800">{order.trackingNumber}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Status Update Panel */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
              <div className="p-4 sm:p-6">
                <OrderStatusUpdate 
                  currentStatus={order.orderStatus} 
                  onUpdate={handleStatusUpdate} 
                  loading={loading} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Component
function PriceRow({ label, value, className = '' }) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <span className="text-sm font-medium text-gray-700">{label}:</span>
      <span className="text-sm font-semibold text-gray-900">
        ${typeof value === 'number' ? value.toFixed(2) : '0.00'}
      </span>
    </div>
  );
}