import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import orderApi from '../api/orderApi';
import { HiCheckCircle } from 'react-icons/hi';
import { HiShoppingBag, HiArrowRight, HiSparkles, HiReceiptRefund } from 'react-icons/hi2';
import Loader from '../components/common/Loader';

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [orderType, setOrderType] = useState('artwork');
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const sessionId = searchParams.get('session_id');
  const type = searchParams.get('type');

  useEffect(() => {
    if (sessionId) {
      orderApi.verifySession(sessionId)
        .then(res => {
          setOrder(res.order);
          setOrderType(res.orderType || type || 'artwork');
          setShowConfetti(true);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setShowConfetti(true);
    }
  }, [sessionId, type]);

  if (loading) return <Loader text="Verifying your payment..." />;

  const statusColors = {
    paid: 'text-[var(--color-sage)] bg-[var(--color-sage)]/10',
    pending: 'text-[var(--color-gold)] bg-[var(--color-gold)]/10',
    failed: 'text-[var(--color-rust)] bg-[var(--color-rust)]/10',
  };

  const orderStatusColors = {
    processing: 'text-[var(--color-gold)] bg-[var(--color-gold)]/10',
    confirmed: 'text-[var(--color-sage)] bg-[var(--color-sage)]/10',
    shipped: 'text-[var(--color-rust)] bg-[var(--color-rust)]/10',
  };

  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex items-center justify-center px-4 py-12 sm:py-20 relative overflow-hidden">

      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-[var(--color-sage)]/8 blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[var(--color-rust)]/6 blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-[var(--color-gold)]/5 blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Floating decorative dots */}
      <span className="absolute top-16 left-8 w-3 h-3 rounded-full bg-[var(--color-gold)]/40 animate-float hidden sm:block" />
      <span className="absolute top-32 right-12 w-2 h-2 rounded-full bg-[var(--color-rust)]/40 animate-float stagger-3 hidden sm:block" />
      <span className="absolute bottom-24 left-16 w-2 h-2 rounded-full bg-[var(--color-sage)]/40 animate-float stagger-5 hidden sm:block" />
      <span className="absolute bottom-16 right-20 w-3 h-3 rounded-full bg-[var(--color-mist)]/60 animate-float stagger-2 hidden sm:block" />

      <div className="w-full max-w-lg relative z-10">

        {/* Main card */}
        <div className="bg-white/80 backdrop-blur-sm border border-[var(--color-cream)] rounded-3xl shadow-2xl shadow-[var(--color-ink)]/8 overflow-hidden animate-scale-in">

          {/* Top gradient strip */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[var(--color-rust)] via-[var(--color-gold)] to-[var(--color-sage)]" />

          <div className="p-8 sm:p-10">

            {/* Success icon with rings */}
            <div className="flex justify-center mb-8">
              <div className="relative flex items-center justify-center">
                {/* Outer pulse ring */}
                <span className="absolute w-28 h-28 rounded-full bg-[var(--color-sage)]/15 animate-ping" />
                {/* Middle ring */}
                <span className="absolute w-22 h-22 rounded-full bg-[var(--color-sage)]/20" />
                {/* Icon container */}
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-sage)]/20 to-[var(--color-sage)]/5 border-2 border-[var(--color-sage)]/30 flex items-center justify-center shadow-lg shadow-[var(--color-sage)]/20">
                  <HiCheckCircle className="w-11 h-11 text-[var(--color-sage)] drop-shadow-sm" />
                </div>
                {/* Sparkle accents */}
                <HiSparkles className="absolute -top-1 -right-1 w-5 h-5 text-[var(--color-gold)] animate-float stagger-1" />
                <HiSparkles className="absolute -bottom-1 -left-1 w-4 h-4 text-[var(--color-rust)]/60 animate-float stagger-3" />
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-8 animate-fade-in-up stagger-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-ink)] mb-3 tracking-tight">
                Order Placed Successfully!
              </h1>
              <p className="text-[var(--color-charcoal)]/70 text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
                Thank you for your purchase! We'll send you an email confirmation shortly.
              </p>
            </div>

            {/* Order details card */}
            {order ? (
              <div className="bg-[var(--color-cream)]/60 border border-[var(--color-mist)]/30 rounded-2xl p-5 sm:p-6 mb-6 animate-fade-in-up stagger-2 space-y-3.5">

                {/* Order number */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-charcoal)]/60 font-medium flex items-center gap-1.5">
                    <HiReceiptRefund className="w-4 h-4" />
                    Order Number
                  </span>
                  <span className="text-sm font-bold text-[var(--color-ink)] bg-white px-3 py-1 rounded-lg border border-[var(--color-cream)] shadow-sm font-mono tracking-wide">
                    #{order.orderNumber}
                  </span>
                </div>

                <div className="h-px bg-[var(--color-mist)]/20" />

                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-charcoal)]/60 font-medium">Total Amount</span>
                  <span className="text-lg font-bold text-gradient">
                    ${order.totalAmount?.toFixed(2)}
                  </span>
                </div>

                <div className="h-px bg-[var(--color-mist)]/20" />

                {/* Payment status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-charcoal)]/60 font-medium">Payment Status</span>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusColors[order.paymentStatus] || 'text-[var(--color-charcoal)] bg-[var(--color-mist)]/20'}`}>
                    {order.paymentStatus}
                  </span>
                </div>

                <div className="h-px bg-[var(--color-mist)]/20" />

                {/* Order status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-charcoal)]/60 font-medium">Order Status</span>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${orderStatusColors[order.orderStatus] || 'text-[var(--color-charcoal)] bg-[var(--color-mist)]/20'}`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-[var(--color-cream)]/60 border border-[var(--color-mist)]/30 rounded-2xl p-5 sm:p-6 mb-6 animate-fade-in-up stagger-2 text-center">
                <HiShoppingBag className="w-8 h-8 text-[var(--color-mist)] mx-auto mb-2" />
                <p className="text-[var(--color-charcoal)]/70 text-sm">Your order has been received and is being processed.</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up stagger-3">
              {orderType === 'custom' ? (
                <Link
                  to="/custom-orders"
                  className="cursor-pointer flex-1 flex items-center justify-center gap-2 bg-[var(--color-ink)] text-[var(--color-paper)] text-sm font-semibold px-5 py-3 rounded-xl hover:bg-[var(--color-charcoal)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[var(--color-ink)]/20 group"
                >
                  <HiReceiptRefund className="w-4 h-4" />
                  View Custom Orders
                  <HiArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              ) : (
                <Link
                  to="/orders"
                  className="cursor-pointer flex-1 flex items-center justify-center gap-2 bg-[var(--color-ink)] text-[var(--color-paper)] text-sm font-semibold px-5 py-3 rounded-xl hover:bg-[var(--color-charcoal)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[var(--color-ink)]/20 group"
                >
                  <HiReceiptRefund className="w-4 h-4" />
                  View My Orders
                  <HiArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              )}

              <Link
                to="/shop"
                className="cursor-pointer flex-1 flex items-center justify-center gap-2 bg-[var(--color-cream)] text-[var(--color-ink)] text-sm font-semibold px-5 py-3 rounded-xl border border-[var(--color-mist)]/40 hover:bg-[var(--color-paper)] hover:border-[var(--color-mist)]/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md group"
              >
                <HiShoppingBag className="w-4 h-4" />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Bottom strip */}
          <div className="px-8 sm:px-10 py-4 bg-[var(--color-cream)]/40 border-t border-[var(--color-mist)]/20">
            <p className="text-xs text-center text-[var(--color-charcoal)]/50">
              A confirmation email will be sent to your registered email address.
            </p>
          </div>
        </div>

        {/* Progress steps */}
        <div className="mt-6 bg-white/60 backdrop-blur-sm border border-[var(--color-cream)] rounded-2xl p-5 animate-fade-in-up stagger-4">
          <div className="flex items-center justify-between relative">
            {/* Connecting line */}
            <div className="absolute left-0 right-0 top-4 h-0.5 bg-[var(--color-cream)] mx-8 z-0" />
            <div className="absolute left-0 top-4 h-0.5 bg-gradient-to-r from-[var(--color-sage)] to-[var(--color-gold)] z-0" style={{ width: '33%', marginLeft: '2rem' }} />

            {[
              { label: 'Order Placed', done: true },
              { label: 'Processing', done: false },
              { label: 'Shipped', done: false },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${step.done
                  ? 'bg-[var(--color-sage)] border-[var(--color-sage)] text-white shadow-md shadow-[var(--color-sage)]/30'
                  : 'bg-white border-[var(--color-mist)]/50 text-[var(--color-mist)]'
                  }`}>
                  {step.done ? (
                    <HiCheckCircle className="w-4 h-4" />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
                <span className={`text-xs font-medium whitespace-nowrap ${step.done ? 'text-[var(--color-sage)]' : 'text-[var(--color-mist)]'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}