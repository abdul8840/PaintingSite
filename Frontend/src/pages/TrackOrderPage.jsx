import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { trackOrder, clearTracked } from '../store/slices/orderSlice';
import OrderTimeline from '../components/order/OrderTimeline';
import Breadcrumb    from '../components/common/Breadcrumb';
import {
  HiMagnifyingGlass, HiTruck, HiReceiptRefund,
  HiCreditCard, HiCalendarDays, HiHashtag,
  HiExclamationCircle, HiSparkles,
} from 'react-icons/hi2';

const statusConfig = {
  processing: { color: 'text-[var(--color-gold)]',   bg: 'bg-[var(--color-gold)]/10',   dot: 'bg-[var(--color-gold)]'  },
  confirmed:  { color: 'text-[var(--color-sage)]',   bg: 'bg-[var(--color-sage)]/10',   dot: 'bg-[var(--color-sage)]'  },
  shipped:    { color: 'text-[var(--color-rust)]',   bg: 'bg-[var(--color-rust)]/10',   dot: 'bg-[var(--color-rust)]'  },
  delivered:  { color: 'text-emerald-600',            bg: 'bg-emerald-50',               dot: 'bg-emerald-500'          },
  cancelled:  { color: 'text-red-500',                bg: 'bg-red-50',                   dot: 'bg-red-400'              },
};

export default function TrackOrderPage() {
  const dispatch = useDispatch();
  const { tracked, loading, error } = useSelector((state) => state.orders);
  const [orderNumber, setOrderNumber] = useState('');
  const [searched, setSearched]       = useState(false);

  const handleTrack = (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    dispatch(clearTracked());
    setSearched(true);
    dispatch(trackOrder(orderNumber.trim()));
  };

  const cfg = statusConfig[tracked?.orderStatus] ?? {
    color: 'text-[var(--color-charcoal)]',
    bg:    'bg-[var(--color-cream)]',
    dot:   'bg-[var(--color-mist)]',
  };

  return (
    <div className="min-h-screen bg-[var(--color-paper)]">

      {/* Sticky breadcrumb bar */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-[var(--color-cream)]
                      sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <Breadcrumb items={[{ label: 'Track Order' }]} />
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full
                        bg-[var(--color-sage)]/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full
                        bg-[var(--color-rust)]/5 blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 relative z-10">

        {/* Page heading */}
        <div className="text-center mb-10 animate-fade-in-down">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl
                          bg-[var(--color-ink)] shadow-xl shadow-[var(--color-ink)]/20
                          mb-5 relative">
            <HiTruck className="w-7 h-7 text-[var(--color-gold)]" />
            <span className="absolute inset-0 rounded-2xl border-2
                             border-[var(--color-gold)]/25 animate-ping" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-ink)] tracking-tight">
            Track Your Order
          </h1>
          <p className="text-[var(--color-charcoal)]/60 text-sm sm:text-base mt-2">
            Enter your order number to see real-time delivery status
          </p>
        </div>

        {/* Search card */}
        <div className="bg-white/85 backdrop-blur-sm border border-[var(--color-cream)]
                        rounded-3xl shadow-xl shadow-[var(--color-ink)]/6
                        overflow-hidden animate-scale-in mb-6">
          <div className="h-1.5 w-full bg-gradient-to-r from-[var(--color-rust)]
                          via-[var(--color-gold)] to-[var(--color-sage)]" />

          <form onSubmit={handleTrack} className="p-6 sm:p-8">
            <label className="block text-xs font-semibold text-[var(--color-charcoal)]
                               uppercase tracking-wide mb-2">
              Order Number
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <HiHashtag className="absolute left-3.5 top-1/2 -translate-y-1/2
                                      w-4 h-4 text-[var(--color-mist)]" />
                <input
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g., SM-001234"
                  className="w-full pl-10 pr-4 py-3 bg-[var(--color-cream)]/40
                             border border-[var(--color-mist)]/40 rounded-xl text-sm
                             text-[var(--color-ink)] placeholder-[var(--color-mist)]
                             focus:outline-none focus:border-[var(--color-ink)]
                             focus:bg-white focus:ring-2 focus:ring-[var(--color-ink)]/8
                             transition-all duration-200 font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !orderNumber.trim()}
                className="cursor-pointer flex items-center gap-2 px-5 py-3
                           bg-[var(--color-ink)] text-[var(--color-paper)] text-sm
                           font-semibold rounded-xl shadow-md shadow-[var(--color-ink)]/20
                           hover:bg-[var(--color-charcoal)] hover:-translate-y-0.5
                           hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                           disabled:transform-none transition-all duration-200
                           whitespace-nowrap group"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10"
                              stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span className="hidden sm:inline">Tracking...</span>
                  </>
                ) : (
                  <>
                    <HiMagnifyingGlass className="w-4 h-4 transition-transform duration-200
                                                  group-hover:scale-110" />
                    <span className="hidden sm:inline">Track</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-[var(--color-mist)] mt-3 flex items-center gap-1.5">
              <HiSparkles className="w-3 h-3 text-[var(--color-gold)]" />
              Your order number can be found in your confirmation email.
            </p>
          </form>
        </div>

        {/* Error state */}
        {error && searched && !loading && (
          <div className="flex items-start gap-3 bg-[var(--color-rust)]/8
                          border border-[var(--color-rust)]/20 rounded-2xl p-5
                          animate-fade-in mb-6">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-rust)]/10 flex
                            items-center justify-center flex-shrink-0">
              <HiExclamationCircle className="w-5 h-5 text-[var(--color-rust)]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--color-rust)] mb-0.5">
                Order not found
              </p>
              <p className="text-xs text-[var(--color-charcoal)]/60">
                Please double-check the order number and try again, or contact our support team.
              </p>
            </div>
          </div>
        )}

        {/* Order result */}
        {tracked && (
          <div className="space-y-5 animate-fade-in-up">

            {/* Summary card */}
            <div className="bg-white/85 backdrop-blur-sm border border-[var(--color-cream)]
                            rounded-3xl shadow-xl shadow-[var(--color-ink)]/6 overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-[var(--color-rust)]
                              via-[var(--color-gold)] to-[var(--color-sage)]" />

              <div className="p-6 sm:p-8">
                {/* Order number + status */}
                <div className="flex flex-col sm:flex-row sm:items-center
                                sm:justify-between gap-4 mb-6">
                  <div>
                    <p className="text-xs text-[var(--color-mist)] font-medium mb-0.5">
                      Order Number
                    </p>
                    <h2 className="text-xl font-bold text-[var(--color-ink)] font-mono tracking-wide">
                      #{tracked.orderNumber}
                    </h2>
                  </div>
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full
                                   text-sm font-semibold capitalize self-start sm:self-auto
                                   ${cfg.color} ${cfg.bg}`}>
                    <span className={`w-2 h-2 rounded-full ${cfg.dot} animate-pulse`} />
                    {tracked.orderStatus}
                  </span>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* Payment status */}
                  <div className="flex items-center gap-3 p-4 bg-[var(--color-cream)]/50
                                  border border-[var(--color-mist)]/20 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-ink)] flex
                                    items-center justify-center flex-shrink-0">
                      <HiCreditCard className="w-5 h-5 text-[var(--color-gold)]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[var(--color-mist)] font-medium">
                        Payment
                      </p>
                      <p className="text-sm font-semibold text-[var(--color-ink)] capitalize truncate">
                        {tracked.paymentStatus}
                      </p>
                    </div>
                  </div>

                  {/* Tracking number */}
                  {tracked.trackingNumber && (
                    <div className="flex items-center gap-3 p-4 bg-[var(--color-cream)]/50
                                    border border-[var(--color-mist)]/20 rounded-2xl">
                      <div className="w-10 h-10 rounded-xl bg-[var(--color-ink)] flex
                                      items-center justify-center flex-shrink-0">
                        <HiTruck className="w-5 h-5 text-[var(--color-gold)]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-[var(--color-mist)] font-medium">
                          Tracking #
                        </p>
                        <p className="text-sm font-semibold text-[var(--color-ink)]
                                      font-mono truncate">
                          {tracked.trackingNumber}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Estimated delivery */}
                  {tracked.estimatedDelivery && (
                    <div className="flex items-center gap-3 p-4 bg-[var(--color-cream)]/50
                                    border border-[var(--color-mist)]/20 rounded-2xl
                                    sm:col-span-2">
                      <div className="w-10 h-10 rounded-xl bg-[var(--color-ink)] flex
                                      items-center justify-center flex-shrink-0">
                        <HiCalendarDays className="w-5 h-5 text-[var(--color-gold)]" />
                      </div>
                      <div>
                        <p className="text-xs text-[var(--color-mist)] font-medium">
                          Estimated Delivery
                        </p>
                        <p className="text-sm font-semibold text-[var(--color-ink)]">
                          {new Date(tracked.estimatedDelivery).toLocaleDateString(
                            'en-US',
                            { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Timeline card */}
            <div className="bg-white/85 backdrop-blur-sm border border-[var(--color-cream)]
                            rounded-3xl shadow-xl shadow-[var(--color-ink)]/6 overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-[var(--color-rust)]
                              via-[var(--color-gold)] to-[var(--color-sage)]" />
              <div className="p-6 sm:p-8">
                <h3 className="text-sm font-bold text-[var(--color-ink)] flex items-center
                               gap-2 mb-6">
                  <HiReceiptRefund className="w-4 h-4 text-[var(--color-rust)]" />
                  Order Timeline
                </h3>
                <OrderTimeline statusHistory={tracked.statusHistory} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}