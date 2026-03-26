import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById, cancelOrder } from '../store/slices/orderSlice';
import { useToast } from '../hooks/useToast';
import OrderDetails from '../components/order/OrderDetails';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Breadcrumb from '../components/common/Breadcrumb';
import Loader from '../components/common/Loader';
import { HiArrowLeft, HiXCircle, HiExclamationCircle, HiSupport } from 'react-icons/hi';

export default function OrderDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: order, loading, cancelLoading } = useSelector((state) => state.orders);
  const [showCancel, setShowCancel] = useState(false);
  const toast = useToast();

  useEffect(() => { 
    dispatch(fetchOrderById(id)); 
  }, [dispatch, id]);

  const handleCancel = async () => {
    try {
      await dispatch(cancelOrder({ id, reason: 'Cancelled by customer' })).unwrap();
      toast.success('Order cancelled successfully');
      setShowCancel(false);
    } catch (err) {
      toast.error(err);
    }
  };

  if (loading || !order) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <Loader text="Loading order details..." />
      </div>
    );
  }

  const canCancel = !['shipped', 'delivered', 'cancelled'].includes(order.orderStatus);

  return (
    <div className="min-h-screen bg-paper">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={[
            { label: 'My Orders', href: '/orders' }, 
            { label: order.orderNumber }
          ]} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Back Button */}
        <Link 
          to="/orders"
          className="inline-flex items-center gap-2 text-charcoal/60 hover:text-ink transition-colors mb-6 cursor-pointer"
        >
          <HiArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 animate-fade-in-up">
            <OrderDetails order={order} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6 animate-fade-in-up stagger-2">
            {/* Cancel Order Card */}
            {canCancel && (
              <div className="bg-white rounded-2xl border border-cream p-5 sm:p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-rust/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HiExclamationCircle className="w-5 h-5 text-rust" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink mb-1">Need to Cancel?</h3>
                    <p className="text-sm text-charcoal/60">
                      You can cancel this order before it ships.
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setShowCancel(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rust/10 text-rust rounded-xl font-medium hover:bg-rust/20 transition-all duration-300 cursor-pointer active:scale-[0.98]"
                >
                  <HiXCircle className="w-5 h-5" />
                  Cancel Order
                </button>
              </div>
            )}

            {/* Cancelled Notice */}
            {order.orderStatus === 'cancelled' && (
              <div className="bg-rust/5 rounded-2xl border border-rust/20 p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-2">
                  <HiXCircle className="w-6 h-6 text-rust" />
                  <h3 className="font-semibold text-rust">Order Cancelled</h3>
                </div>
                <p className="text-sm text-charcoal/70">
                  This order has been cancelled. If you have any questions, please contact support.
                </p>
              </div>
            )}

            {/* Help Card */}
            <div className="bg-cream/50 rounded-2xl p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-sage/10 rounded-lg flex items-center justify-center">
                  <HiSupport className="w-5 h-5 text-sage" />
                </div>
                <h4 className="font-semibold text-ink">Need Help?</h4>
              </div>
              <p className="text-sm text-charcoal/70 mb-4">
                Have questions about your order? Our support team is here to help.
              </p>
              <Link 
                to="/contact"
                className="inline-flex items-center gap-2 text-sm font-medium text-sage hover:text-sage/80 transition-colors cursor-pointer"
              >
                Contact Support
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog 
        isOpen={showCancel} 
        onClose={() => setShowCancel(false)} 
        onConfirm={handleCancel} 
        title="Cancel Order" 
        message="Are you sure you want to cancel this order? This action cannot be undone and you will receive a refund within 5-7 business days."
        confirmText="Yes, Cancel Order"
        confirmVariant="danger"
        loading={cancelLoading}
      />
    </div>
  );
}