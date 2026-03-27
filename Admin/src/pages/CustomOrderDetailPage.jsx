import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomOrderById, updateCustomOrder, clearCurrent } from '../store/slices/customOrderSlice';
import CustomOrderManager from '../components/custom-order/CustomOrderManager';
import StatusBadge from '../components/common/StatusBadge';
import Loader from '../components/common/Loader';
import { useToast } from '../hooks/useToast';
import {
  HiArrowLeft,
  HiUser,
  HiPhotograph,
  HiDocumentText,
  HiCurrencyDollar,
  HiLocationMarker,
  HiClock,
  HiLightBulb,
  HiChevronDown,
  HiChevronUp,
  HiCheckCircle,
  HiTruck,
  HiSparkles,
} from 'react-icons/hi';

export default function CustomOrderDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { current: order, loading, error } = useSelector((state) => state.customOrders);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    images: true,
    specs: true,
    pricing: true,
    shipping: true,
    progress: true,
    history: true,
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchCustomOrderById(id));
    }
    return () => {
      dispatch(clearCurrent());
    };
  }, [dispatch, id]);

  const handleUpdate = async (data) => {
    setUpdateLoading(true);
    try {
      await dispatch(updateCustomOrder({ id, data })).unwrap();
      toast.success('Custom order updated!');
      dispatch(fetchCustomOrderById(id));
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Update failed');
    } finally {
      setUpdateLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader text="Loading custom order..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-black text-white rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiDocumentText className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Error Loading Order</h2>
          <p className="text-white/60 mb-6">{error}</p>
          <button
            onClick={() => navigate('/custom-orders')}
            className="w-full px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            Back to Custom Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-black text-white rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiDocumentText className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
          <p className="text-white/60 mb-6">The order you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/custom-orders')}
            className="w-full px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            Back to Custom Orders
          </button>
        </div>
      </div>
    );
  }

  const CollapsibleSection = ({ title, icon: Icon, isExpanded, onToggle, children }) => (
    <div className="bg-white border-2 border-black rounded-2xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center">
            <Icon className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-black">{title}</h2>
        </div>
        {isExpanded ? (
          <HiChevronUp className="w-6 h-6 text-black" />
        ) : (
          <HiChevronDown className="w-6 h-6 text-black" />
        )}
      </button>
      {isExpanded && (
        <div className="p-6 pt-0 border-t-2 border-black/10">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white border-b-4 border-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/custom-orders')}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
          >
            <HiArrowLeft className="w-5 h-5" />
            Back to Custom Orders
          </button>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                Order #{order.orderNumber}
              </h1>
              <p className="text-white/60">
                Created {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={order.status} />
              <StatusBadge status={order.paymentStatus} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info Card */}
            <div className="bg-white border-2 border-black rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center">
                  <HiUser className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-black">Customer Information</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Name</p>
                  <p className="text-lg font-semibold text-black">
                    {order.user?.firstName} {order.user?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="text-black">{order.user?.email}</p>
                </div>
                {order.user?.phone && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Phone</p>
                    <p className="text-black">{order.user.phone}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Reference Images */}
            <CollapsibleSection
              title="Reference Images"
              icon={HiPhotograph}
              isExpanded={expandedSections.images}
              onToggle={() => toggleSection('images')}
            >
              <div className="space-y-6">
                {order.referenceImage?.url ? (
                  <div>
                    <p className="text-sm font-semibold text-black mb-3">Main Reference</p>
                    <div className="relative group">
                      <img
                        src={order.referenceImage.url}
                        alt="Reference"
                        className="w-full h-auto max-h-96 object-contain rounded-xl border-2 border-black"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                    <HiPhotograph className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No reference image uploaded</p>
                  </div>
                )}

                {order.additionalImages?.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-black mb-3">
                      Additional Images ({order.additionalImages.length})
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {order.additionalImages.map((img, i) => (
                        <div key={i} className="relative group">
                          <img
                            src={img.url}
                            alt={`Additional ${i + 1}`}
                            className="w-full h-32 object-cover rounded-xl border-2 border-black"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CollapsibleSection>

            {/* Specifications */}
            <CollapsibleSection
              title="Order Specifications"
              icon={HiDocumentText}
              isExpanded={expandedSections.specs}
              onToggle={() => toggleSection('specs')}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SpecItem label="Sketch Style" value={order.sketchStyle?.replace(/-/g, ' ')} />
                  <SpecItem
                    label="Canvas Size"
                    value={`${order.canvasSize}${order.customSize ? ` (${order.customSize.width}×${order.customSize.height} ${order.customSize.unit || 'in'})` : ''}`}
                  />
                  <SpecItem label="Color Style" value={order.colorStyle?.replace(/-/g, ' ')} />
                  <SpecItem label="Framing" value={order.framingOption?.replace(/-/g, ' ')} />
                  <SpecItem label="Background" value={order.backgroundPreference?.replace(/-/g, ' ')} />
                  <SpecItem label="Subjects" value={order.numberOfSubjects} />
                  <SpecItem
                    label="Rush Order"
                    value={order.isRushOrder ? 'Yes' : 'No'}
                    highlight={order.isRushOrder}
                  />
                  <SpecItem
                    label="Est. Completion"
                    value={`${order.estimatedCompletionDays} days`}
                  />
                </div>

                {order.additionalNotes && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                    <p className="text-sm font-semibold text-black mb-2">Customer Notes</p>
                    <p className="text-gray-700 whitespace-pre-wrap">{order.additionalNotes}</p>
                  </div>
                )}
              </div>
            </CollapsibleSection>

            {/* AI Suggestions */}
            {order.aiSuggestedStyles?.length > 0 && (
              <div className="bg-gradient-to-br from-black to-gray-800 text-white rounded-2xl p-6 border-2 border-black">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <HiSparkles className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold">AI Style Suggestions</h2>
                </div>
                <div className="space-y-3">
                  {order.aiSuggestedStyles.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
                    >
                      <div className="flex-1">
                        <p className="font-semibold capitalize mb-1">
                          {s.style?.replace(/-/g, ' ')}
                        </p>
                        <p className="text-sm text-white/60">{s.reason}</p>
                      </div>
                      <div className="ml-4 text-right">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-sm font-semibold">
                            {Math.round((s.confidence || 0) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Progress Images */}
            {order.progressImages?.length > 0 && (
              <CollapsibleSection
                title="Progress Updates"
                icon={HiClock}
                isExpanded={expandedSections.progress}
                onToggle={() => toggleSection('progress')}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {order.progressImages.map((img, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                      <img
                        src={img.url}
                        alt={img.stage || `Progress ${i + 1}`}
                        className="w-full h-48 object-cover rounded-lg border-2 border-black mb-3"
                      />
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-black capitalize">
                          {img.stage || `Update ${i + 1}`}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(img.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
            )}

            {/* Final Image */}
            {order.finalImage?.url && (
              <div className="bg-gradient-to-br from-black to-gray-800 text-white rounded-2xl p-6 border-2 border-black">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <HiCheckCircle className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold">Final Artwork</h2>
                </div>
                <img
                  src={order.finalImage.url}
                  alt="Final artwork"
                  className="w-full h-auto max-h-96 object-contain rounded-xl border-2 border-white/20"
                />
              </div>
            )}

            {/* Status History */}
            <CollapsibleSection
              title="Status History"
              icon={HiClock}
              isExpanded={expandedSections.history}
              onToggle={() => toggleSection('history')}
            >
              {order.statusHistory?.length > 0 ? (
                <div className="space-y-3">
                  {order.statusHistory.map((entry, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border-2 border-gray-200"
                    >
                      <div className="flex-shrink-0 mt-1">
                        <StatusBadge status={entry.status} />
                      </div>
                      <div className="flex-1 min-w-0">
                        {entry.note && (
                          <p className="text-gray-700 mb-1">{entry.note}</p>
                        )}
                        <p className="text-sm text-gray-500">
                          {new Date(entry.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No status history available</p>
              )}
            </CollapsibleSection>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Pricing Card */}
            <div className="bg-black text-white rounded-2xl p-6 border-2 border-black sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <HiCurrencyDollar className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold">Pricing Breakdown</h2>
              </div>

              <div className="space-y-3 mb-6">
                <PriceRow label="Base Price" value={order.basePrice} />
                <PriceRow label="Size Multiplier" value={`×${order.sizeMultiplier}`} isMultiplier />
                <PriceRow label="Style Multiplier" value={`×${order.styleMultiplier}`} isMultiplier />
                {order.framingCost > 0 && <PriceRow label="Framing" value={order.framingCost} />}
                {order.subjectsCost > 0 && <PriceRow label="Extra Subjects" value={order.subjectsCost} />}
                {order.rushOrderCost > 0 && <PriceRow label="Rush Order" value={order.rushOrderCost} highlight />}
                <div className="border-t border-white/20 pt-3">
                  <PriceRow label="Subtotal" value={order.subtotal} semibold />
                </div>
                {order.discount > 0 && (
                  <PriceRow
                    label={`Discount${order.coupon?.code ? ` (${order.coupon.code})` : ''}`}
                    value={-order.discount}
                    highlight
                  />
                )}
                <PriceRow label="Shipping" value={order.shippingCost} />
                <PriceRow label="Tax" value={order.tax} />
                <div className="border-t-2 border-white/40 pt-3 mt-3">
                  <PriceRow label="Total Amount" value={order.totalAmount} bold large />
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-sm text-white/60 mb-2">Payment Status</p>
                <StatusBadge status={order.paymentStatus} />
              </div>
            </div>

            {/* Shipping Info */}
            {order.shippingAddress && (
              <div className="bg-white border-2 border-black rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center">
                    <HiLocationMarker className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-black">Shipping Address</h2>
                </div>
                <div className="space-y-1 text-gray-700">
                  <p className="font-semibold text-black">{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                    {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
                {order.trackingNumber && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <div className="flex items-center gap-2 text-black">
                      <HiTruck className="w-5 h-5" />
                      <div>
                        <p className="text-xs text-gray-500">Tracking Number</p>
                        <p className="font-mono font-semibold">{order.trackingNumber}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Management Panel */}
            <div className="bg-white border-2 border-black rounded-2xl p-6">
              <CustomOrderManager
                order={order}
                onUpdate={handleUpdate}
                loading={updateLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
const SpecItem = ({ label, value, highlight }) => (
  <div className={`p-4 rounded-xl border-2 ${highlight ? 'bg-black text-white border-black' : 'bg-gray-50 border-gray-200'}`}>
    <p className={`text-xs font-semibold mb-1 ${highlight ? 'text-white/60' : 'text-gray-500'}`}>
      {label}
    </p>
    <p className={`font-semibold capitalize ${highlight ? 'text-white' : 'text-black'}`}>
      {value || 'N/A'}
    </p>
  </div>
);

const PriceRow = ({ label, value, isMultiplier, semibold, bold, large, highlight }) => (
  <div className="flex items-center justify-between">
    <span className={`${bold ? 'font-bold' : semibold ? 'font-semibold' : ''} ${large ? 'text-lg' : 'text-sm'} ${highlight ? 'text-green-400' : 'text-white/80'}`}>
      {label}
    </span>
    <span className={`${bold ? 'font-bold' : semibold ? 'font-semibold' : ''} ${large ? 'text-2xl' : 'text-base'} ${highlight ? 'text-green-400' : 'text-white'}`}>
      {isMultiplier ? value : typeof value === 'number' ? `$${value.toFixed(2)}` : value}
    </span>
  </div>
);