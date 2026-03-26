import { useEffect } from 'react';
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
  HiClipboardList, 
  HiCurrencyDollar, 
  HiLocationMarker,
  HiLightBulb,
  HiClock
} from 'react-icons/hi';

export default function CustomOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
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
          onClick={() => navigate('/custom-orders')}
          className="group inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-200 mb-4 sm:mb-6 cursor-pointer"
        >
          <HiArrowLeft className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1" />
          <span className="text-sm sm:text-base font-medium">Back to Custom Orders</span>
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                Custom Order {order.orderNumber}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Created on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <StatusBadge status={order.status} />
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

            {/* Reference Images */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-gray-800 to-gray-900"></div>
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <HiPhotograph className="w-6 h-6 text-gray-700" />
                  <h3 className="text-lg font-bold text-gray-900">Reference Images</h3>
                </div>
                
                {/* Main Reference */}
                <div className="mb-4">
                  <img 
                    src={order.referenceImage?.url} 
                    alt="Reference" 
                    className="w-full max-w-md rounded-lg border-2 border-gray-200 shadow-md"
                  />
                </div>

                {/* Additional Images */}
                {order.additionalImages?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Additional Images</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {order.additionalImages.map((img, i) => (
                        <img 
                          key={i} 
                          src={img.url} 
                          alt={`Additional ${i + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200 hover:scale-105 transition-transform duration-200 cursor-pointer"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-gray-800 to-gray-900"></div>
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <HiClipboardList className="w-6 h-6 text-gray-700" />
                  <h3 className="text-lg font-bold text-gray-900">Order Details</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DetailItem label="Style" value={order.sketchStyle} />
                  <DetailItem label="Canvas Size" value={order.canvasSize} />
                  <DetailItem label="Color Style" value={order.colorStyle} />
                  <DetailItem label="Framing" value={order.framingOption} />
                  <DetailItem label="Background" value={order.backgroundPreference} />
                  <DetailItem label="Subjects" value={order.numberOfSubjects} />
                  <DetailItem 
                    label="Rush Order" 
                    value={order.isRushOrder ? 'Yes' : 'No'}
                    valueClass={order.isRushOrder ? 'text-red-600 font-semibold' : ''}
                  />
                </div>

                {order.additionalNotes && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-1">Additional Notes:</p>
                    <p className="text-sm text-gray-600">{order.additionalNotes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Progress & Final Images */}
            {(order.progressImages?.length > 0 || order.finalImage?.url) && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-gray-800 to-gray-900"></div>
                <div className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <HiPhotograph className="w-6 h-6 text-gray-700" />
                    <h3 className="text-lg font-bold text-gray-900">Artwork Progress</h3>
                  </div>

                  {/* Progress Images */}
                  {order.progressImages?.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Progress Updates</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {order.progressImages.map((img, i) => (
                          <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                            <img 
                              src={img.url} 
                              alt={img.stage}
                              className="w-full h-48 object-cover"
                            />
                            <div className="p-3 bg-gray-50">
                              <p className="text-sm font-medium text-gray-900">{img.stage}</p>
                              <p className="text-xs text-gray-600">{new Date(img.uploadedAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Final Image */}
                  {order.finalImage?.url && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Final Artwork</h4>
                      <img 
                        src={order.finalImage.url} 
                        alt="Final" 
                        className="w-full max-w-lg rounded-lg border-2 border-gray-900 shadow-xl"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* AI Suggestions */}
            {order.aiSuggestedStyles?.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
                <div className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <HiLightBulb className="w-6 h-6 text-purple-600" />
                    <h3 className="text-lg font-bold text-gray-900">AI Suggested Styles</h3>
                  </div>
                  <div className="space-y-3">
                    {order.aiSuggestedStyles.map((s, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{s.style}</p>
                          <p className="text-sm text-gray-600">{s.reason}</p>
                        </div>
                        <span className="ml-4 px-3 py-1 rounded-full text-sm font-bold bg-purple-600 text-white">
                          {Math.round(s.confidence * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Pricing */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-green-600 to-emerald-600"></div>
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <HiCurrencyDollar className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-bold text-gray-900">Pricing</h3>
                </div>
                
                <div className="space-y-3">
                  <PriceRow label="Base Price" value={order.basePrice} />
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
            {order.shippingAddress && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-gray-800 to-gray-900"></div>
                <div className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <HiLocationMarker className="w-6 h-6 text-gray-700" />
                    <h3 className="text-lg font-bold text-gray-900">Shipping Address</h3>
                  </div>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>{order.shippingAddress.street}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                  </div>
                </div>
              </div>
            )}

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

            {/* Management Panel */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
              <div className="p-4 sm:p-6">
                <CustomOrderManager order={order} onUpdate={handleUpdate} loading={loading} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function DetailItem({ label, value, valueClass = '' }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-sm font-medium text-gray-900 ${valueClass}`}>{value}</p>
    </div>
  );
}

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