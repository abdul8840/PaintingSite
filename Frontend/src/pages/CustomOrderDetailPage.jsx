import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomOrderById } from '../store/slices/customOrderSlice';
import customOrderApi from '../api/customOrderApi';
import { useToast } from '../hooks/useToast';
import OrderDetails from '../components/order/OrderDetails';
import Breadcrumb from '../components/common/Breadcrumb';
import Loader from '../components/common/Loader';
import { HiCheckCircle, HiRefresh, HiUserCircle, HiPhotograph, HiArrowLeft, HiExclamationCircle } from 'react-icons/hi';

export default function CustomOrderDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: order, loading } = useSelector((state) => state.customOrders);
  const toast = useToast();
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => { 
    dispatch(fetchCustomOrderById(id)); 
  }, [dispatch, id]);

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await customOrderApi.approve(id);
      dispatch(fetchCustomOrderById(id));
      toast.success('Order approved! Your artwork will be shipped soon.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevision = async () => {
    const notes = prompt('What changes would you like?');
    if (!notes) return;
    setActionLoading(true);
    try {
      await customOrderApi.requestRevision(id, { notes });
      dispatch(fetchCustomOrderById(id));
      toast.success('Revision requested! The artist will work on your changes.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || !order) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <Loader text="Loading order details..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={[
            { label: 'Custom Orders', href: '/custom-orders' }, 
            { label: order.orderNumber }
          ]} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Back Button */}
        <Link 
          to="/custom-orders"
          className="inline-flex items-center gap-2 text-charcoal/60 hover:text-ink transition-colors mb-6 cursor-pointer"
        >
          <HiArrowLeft className="w-4 h-4" />
          Back to Custom Orders
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 animate-fade-in-up">
            <OrderDetails order={order} isCustom />

            {/* Review Section */}
            {order.status === 'review' && (
              <div className="bg-gradient-to-br from-gold/10 to-gold/5 rounded-2xl border border-gold/30 p-6 sm:p-8 animate-fade-in-up">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <HiPhotograph className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-ink mb-1">Review Your Artwork</h3>
                    <p className="text-sm text-charcoal/70">
                      Your artwork is ready for review. Please approve it or request revisions.
                    </p>
                  </div>
                </div>

                {/* Revision Counter */}
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl mb-6">
                  <div className="flex-1">
                    <p className="text-sm text-charcoal/60 mb-1">Revisions Used</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-cream rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gold transition-all duration-500 rounded-full"
                          style={{ width: `${(order.revisionCount / order.maxRevisions) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-ink">
                        {order.revisionCount}/{order.maxRevisions}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button 
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-sage text-white rounded-xl font-semibold hover:bg-sage/90 transition-all duration-300 hover:shadow-lg hover:shadow-sage/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    <HiCheckCircle className="w-5 h-5" />
                    Approve & Complete
                  </button>
                  
                  {order.revisionCount < order.maxRevisions && (
                    <button 
                      onClick={handleRevision}
                      disabled={actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-ink border-2 border-ink rounded-xl font-semibold hover:bg-ink hover:text-white transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                    >
                      <HiRefresh className="w-5 h-5" />
                      Request Revision
                    </button>
                  )}
                </div>

                {order.revisionCount >= order.maxRevisions && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-rust">
                    <HiExclamationCircle className="w-4 h-4" />
                    Maximum revisions reached. Additional revisions may incur extra charges.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6 animate-fade-in-up stagger-2">
            {/* Assigned Artist */}
            {order.assignedArtist && (
              <div className="bg-white rounded-2xl border border-cream p-5 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-ink mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-sage rounded-full" />
                  Your Artist
                </h3>
                
                <div className="flex items-center gap-4">
                  {order.assignedArtist.avatar?.url ? (
                    <img 
                      src={order.assignedArtist.avatar.url}
                      alt={`${order.assignedArtist.firstName}`}
                      className="w-14 h-14 rounded-xl object-cover ring-2 ring-cream"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sage to-sage/70 flex items-center justify-center">
                      <span className="text-xl font-bold text-white">
                        {order.assignedArtist.firstName?.[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-ink">
                      {order.assignedArtist.firstName} {order.assignedArtist.lastName}
                    </p>
                    <p className="text-sm text-charcoal/60">Professional Artist</p>
                  </div>
                </div>
              </div>
            )}

            {/* Help Card */}
            <div className="bg-cream/50 rounded-2xl p-5 sm:p-6">
              <h4 className="font-semibold text-ink mb-2">Need Help?</h4>
              <p className="text-sm text-charcoal/70 mb-4">
                If you have any questions about your order, our support team is here to help.
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
    </div>
  );
}