import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { clearCart } from '../store/slices/cartSlice';
import orderApi from '../api/orderApi';
import CheckoutSteps from '../components/checkout/CheckoutSteps';
import AddressForm from '../components/checkout/AddressForm';
import CartSummary from '../components/cart/CartSummary';
import PaymentSection from '../components/checkout/PaymentSection';
import Breadcrumb from '../components/common/Breadcrumb';
import { formatPrice } from '../utils/currency';
import {
  HiMapPin, HiClipboardDocumentList, HiCreditCard,
  HiCheckCircle, HiArrowLeft, HiArrowRight,
  HiPencilSquare, HiShoppingBag, HiSparkles,
  HiHome, HiStar,
} from 'react-icons/hi2';

/* ─────────────────────────────────────────
   Razorpay script loader
───────────────────────────────────────── */
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

/* ─────────────────────────────────────────
   Step meta
───────────────────────────────────────── */
const STEPS = [
  { label: 'Address', icon: HiMapPin              },
  { label: 'Review',  icon: HiClipboardDocumentList},
  { label: 'Payment', icon: HiCreditCard          },
];

/* ─────────────────────────────────────────
   Address card sub-component
───────────────────────────────────────── */
function SavedAddressCard({ addr, selected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={`cursor-pointer w-full text-left p-4 rounded-2xl border-2
                  transition-all duration-200 hover-lift group relative
                  ${selected
                    ? 'border-[var(--color-ink)] bg-[var(--color-ink)]/4 shadow-md'
                    : 'border-[var(--color-cream)] bg-white hover:border-[var(--color-mist)] hover:bg-[var(--color-cream)]/40'
                  }`}
    >
      {/* Selected check */}
      {selected && (
        <span className="absolute top-3 right-3">
          <HiCheckCircle className="w-5 h-5 text-[var(--color-sage)]" />
        </span>
      )}

      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center
                         flex-shrink-0 transition-all duration-200
                         ${selected
                           ? 'bg-[var(--color-ink)] shadow-md'
                           : 'bg-[var(--color-cream)] group-hover:bg-[var(--color-mist)]/30'}`}>
          <HiHome className={`w-4 h-4 ${selected
            ? 'text-[var(--color-gold)]'
            : 'text-[var(--color-mist)]'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--color-ink)] truncate">
            {addr.street}
          </p>
          <p className="text-xs text-[var(--color-charcoal)]/60 mt-0.5">
            {addr.city}, {addr.state} {addr.zipCode}
          </p>
          {addr.country && (
            <p className="text-xs text-[var(--color-mist)]">{addr.country}</p>
          )}
          {addr.isDefault && (
            <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold
                             uppercase tracking-wide px-2 py-0.5 rounded-full
                             bg-[var(--color-sage)]/15 text-[var(--color-sage)]
                             border border-[var(--color-sage)]/25">
              <HiStar className="w-2.5 h-2.5" />
              Default
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

/* ─────────────────────────────────────────
   Section wrapper
───────────────────────────────────────── */
function SectionCard({ title, icon: Icon, children, className = '' }) {
  return (
    <div className={`bg-white/85 backdrop-blur-sm border border-[var(--color-cream)]
                     rounded-2xl shadow-sm overflow-hidden ${className}`}>
      <div className="h-1 w-full bg-gradient-to-r from-[var(--color-rust)]
                      via-[var(--color-gold)] to-[var(--color-sage)]" />
      <div className="p-6 sm:p-7">
        {(title || Icon) && (
          <div className="flex items-center gap-3 mb-6">
            {Icon && (
              <div className="w-9 h-9 rounded-xl bg-[var(--color-ink)] flex items-center
                              justify-center flex-shrink-0 shadow-md">
                <Icon className="w-4 h-4 text-[var(--color-gold)]" />
              </div>
            )}
            {title && (
              <h2 className="text-lg font-bold text-[var(--color-ink)] tracking-tight">
                {title}
              </h2>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Page
───────────────────────────────────────── */
export default function CheckoutPage() {
  const { items, totals, coupon } = useCart();
  const { user }   = useAuth();
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const toast      = useToast();

  const [step, setStep]                       = useState(0);
  const [shippingAddress, setShippingAddress] = useState(
    user?.addresses?.find(a => a.isDefault) || null
  );
  const [loading, setLoading]                 = useState(false);
  const [razorpayLoaded, setRazorpayLoaded]   = useState(false);
  const [selectedAddrId, setSelectedAddrId]   = useState(
    user?.addresses?.find(a => a.isDefault)?._id || null
  );

  /* load Razorpay */
  useEffect(() => {
    loadRazorpayScript().then(loaded => {
      setRazorpayLoaded(loaded);
      if (!loaded) toast.error('Payment gateway failed to load. Please refresh.');
    });
  }, []);

  /* redirect if empty cart */
  if (items.length === 0) { navigate('/cart'); return null; }

  /* ── handlers ── */
  const handleAddressSubmit = (address) => {
    setShippingAddress(address);
    setStep(1);
  };

  const handleSelectSavedAddress = (addr) => {
    setSelectedAddrId(addr._id);
    setShippingAddress(addr);
  };

  const handleConfirmSavedAddress = () => {
    if (!shippingAddress) {
      toast.error('Please select an address');
      return;
    }
    setStep(1);
  };

  const initiateRazorpay = async (orderData, razorpayOrder, keyId) => {
    if (!window.Razorpay) {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Payment gateway unavailable. Please try again.');
        setLoading(false);
        return;
      }
    }

    const options = {
      key: keyId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: 'SketchMint',
      description: `Order ${orderData.orderNumber}`,
      order_id: razorpayOrder.id,
      handler: async function (response) {
        try {
          setLoading(true);
          const verifyRes = await orderApi.verifyPayment({
            razorpay_order_id:   response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature:  response.razorpay_signature,
            orderId: orderData._id,
          });
          if (verifyRes.success) {
            dispatch(clearCart());
            toast.success('Payment successful! Order confirmed.');
            navigate(`/order-success?orderId=${orderData._id}`);
          } else {
            toast.error('Payment verification failed. Please contact support.');
          }
        } catch {
          toast.error('Payment verification failed. Please contact support.');
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name:    `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
        email:   user?.email   || '',
        contact: user?.phone   || '',
      },
      theme: { color: '#1a1208' },
      modal: {
        ondismiss: () => {
          setLoading(false);
          toast.info('Payment cancelled');
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (response) => {
      setLoading(false);
      toast.error(`Payment failed: ${response.error.description || 'Please try again'}`);
    });
    rzp.open();
  };

  const handleCreateOrder = async (paymentMethod) => {
    if (!shippingAddress) {
      toast.error('Please select a shipping address');
      setStep(0);
      return;
    }
    setLoading(true);
    try {
      const orderData = {
        items: items.map(i => ({ artwork: i._id, quantity: i.quantity })),
        shippingAddress: {
          street:  shippingAddress.street,
          city:    shippingAddress.city,
          state:   shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country || 'IN',
        },
        paymentMethod,
        couponCode: coupon?.code || undefined,
      };

      const res = await orderApi.create(orderData);

      if (paymentMethod === 'razorpay') {
        if (!res.razorpayOrder) throw new Error('Payment initialization failed');
        if (!razorpayLoaded) {
          const loaded = await loadRazorpayScript();
          if (!loaded) throw new Error('Payment gateway unavailable');
          setRazorpayLoaded(true);
        }
        initiateRazorpay(res.order, res.razorpayOrder, res.keyId);
        return;
      }

      dispatch(clearCart());
      toast.success('Order placed successfully!');
      navigate(`/order-success?orderId=${res.order._id}`);
    } catch (err) {
      toast.error(err.message || 'Failed to create order. Please try again.');
      setLoading(false);
    }
  };

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="min-h-screen bg-[var(--color-paper)]">

      {/* ── Sticky breadcrumb bar ── */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-[var(--color-cream)]
                      sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={[
            { label: 'Cart',     href: '/cart' },
            { label: 'Checkout' },
          ]} />
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full
                        bg-[var(--color-rust)]/4 blur-3xl" />
        <div className="absolute bottom-0 -left-32 w-80 h-80 rounded-full
                        bg-[var(--color-sage)]/4 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10
                      relative z-10">

        {/* ── Page title ── */}
        <div className="mb-8 animate-fade-in-down">
          <div className="flex items-center gap-3 mb-1">
            <HiSparkles className="w-4 h-4 text-[var(--color-gold)]" />
            <span className="text-xs font-bold text-[var(--color-gold)] uppercase
                             tracking-widest">
              Secure Checkout
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-ink)]
                         tracking-tight">
            Checkout
          </h1>
        </div>

        {/* ── Step indicator ── */}
        <div className="mb-8 animate-fade-in-up stagger-1">
          <div className="bg-white/85 backdrop-blur-sm border border-[var(--color-cream)]
                          rounded-2xl shadow-sm p-4 sm:p-5">
            <div className="flex items-center justify-between relative">
              {/* Connecting line background */}
              <div className="absolute left-0 right-0 top-5 h-0.5 mx-10
                              bg-[var(--color-cream)] z-0" />
              {/* Filled line */}
              <div
                className="absolute left-0 top-5 h-0.5 mx-10 bg-gradient-to-r
                           from-[var(--color-rust)] to-[var(--color-gold)] z-0
                           transition-all duration-500"
                style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
              />

              {STEPS.map(({ label, icon: Icon }, i) => {
                const done    = i < step;
                const current = i === step;
                return (
                  <div key={label} className="flex flex-col items-center gap-2 z-10">
                    <button
                      onClick={() => i < step && setStep(i)}
                      disabled={i >= step}
                      className={`cursor-pointer w-10 h-10 rounded-xl flex items-center
                                  justify-center border-2 transition-all duration-300
                                  font-bold text-sm
                                  ${done
                                    ? 'bg-[var(--color-sage)] border-[var(--color-sage)] text-white shadow-lg shadow-[var(--color-sage)]/25 hover:scale-105'
                                    : current
                                      ? 'bg-[var(--color-ink)] border-[var(--color-ink)] text-[var(--color-paper)] shadow-lg shadow-[var(--color-ink)]/25 scale-110'
                                      : 'bg-white border-[var(--color-cream)] text-[var(--color-mist)] cursor-default'
                                  }`}
                    >
                      {done
                        ? <HiCheckCircle className="w-5 h-5" />
                        : <Icon className="w-4 h-4" />}
                    </button>
                    <span className={`text-xs font-semibold transition-colors duration-300
                                      hidden sm:block
                                      ${current
                                        ? 'text-[var(--color-ink)]'
                                        : done
                                          ? 'text-[var(--color-sage)]'
                                          : 'text-[var(--color-mist)]'}`}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Mobile step label */}
            <p className="sm:hidden text-center text-sm font-semibold
                          text-[var(--color-ink)] mt-3">
              Step {step + 1} of {STEPS.length}: {STEPS[step].label}
            </p>
          </div>
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* ── Left: step content ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* ════════════ STEP 0 — ADDRESS ════════════ */}
            {step === 0 && (
              <div key="step-0" className="space-y-5 animate-fade-in-up">

                {/* Saved addresses */}
                {user?.addresses?.length > 0 && (
                  <SectionCard title="Saved Addresses" icon={HiMapPin}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                      {user.addresses.map(addr => (
                        <SavedAddressCard
                          key={addr._id}
                          addr={addr}
                          selected={selectedAddrId === addr._id}
                          onSelect={() => handleSelectSavedAddress(addr)}
                        />
                      ))}
                    </div>
                    {selectedAddrId && (
                      <button
                        onClick={handleConfirmSavedAddress}
                        className="cursor-pointer w-full flex items-center justify-center
                                   gap-2 py-3 bg-[var(--color-ink)] text-[var(--color-paper)]
                                   text-sm font-semibold rounded-xl shadow-md
                                   shadow-[var(--color-ink)]/20 hover:bg-[var(--color-charcoal)]
                                   hover:-translate-y-0.5 hover:shadow-lg transition-all
                                   duration-200 group"
                      >
                        Ship to Selected Address
                        <HiArrowRight className="w-4 h-4 transition-transform duration-200
                                                  group-hover:translate-x-1" />
                      </button>
                    )}
                  </SectionCard>
                )}

                {/* New address form */}
                <SectionCard
                  title={user?.addresses?.length > 0
                    ? 'Or Enter a New Address'
                    : 'Shipping Address'}
                  icon={HiHome}
                >
                  <AddressForm
                    address={shippingAddress}
                    onSubmit={handleAddressSubmit}
                    isLoading={loading}
                  />
                </SectionCard>
              </div>
            )}

            {/* ════════════ STEP 1 — REVIEW ════════════ */}
            {step === 1 && (
              <div key="step-1" className="space-y-5 animate-fade-in-up">

                {/* Shipping to */}
                <SectionCard title="Shipping To" icon={HiMapPin}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--color-cream)]
                                      flex items-center justify-center flex-shrink-0">
                        <HiHome className="w-4 h-4 text-[var(--color-charcoal)]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-ink)]">
                          {shippingAddress.street}
                        </p>
                        <p className="text-sm text-[var(--color-charcoal)]/60 mt-0.5">
                          {shippingAddress.city}, {shippingAddress.state}{' '}
                          {shippingAddress.zipCode}
                        </p>
                        {shippingAddress.country && (
                          <p className="text-xs text-[var(--color-mist)] mt-0.5">
                            {shippingAddress.country}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setStep(0)}
                      className="cursor-pointer flex items-center gap-1.5 px-3 py-2
                                 rounded-xl text-xs font-semibold
                                 text-[var(--color-charcoal)] bg-[var(--color-cream)]
                                 hover:bg-[var(--color-mist)]/30 hover:text-[var(--color-ink)]
                                 transition-all duration-200 flex-shrink-0 group"
                    >
                      <HiPencilSquare className="w-3.5 h-3.5" />
                      Change
                    </button>
                  </div>
                </SectionCard>

                {/* Order items */}
                <SectionCard
                  title={`Order Items (${totalItems})`}
                  icon={HiShoppingBag}
                >
                  <div className="space-y-3">
                    {items.map((item, idx) => (
                      <div
                        key={item._id}
                        className="flex items-center gap-4 p-3 rounded-xl
                                   bg-[var(--color-cream)]/40 border border-[var(--color-mist)]/15
                                   hover:bg-[var(--color-cream)]/70 transition-all duration-150
                                   animate-fade-in-up"
                        style={{ animationDelay: `${idx * 0.06}s`, animationFillMode: 'both' }}
                      >
                        {/* Thumbnail */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0
                                        border border-[var(--color-cream)] shadow-sm bg-white">
                          <img
                            src={item.images?.[0]?.url || item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[var(--color-ink)]
                                        truncate">
                            {item.title}
                          </p>
                          <p className="text-xs text-[var(--color-mist)] mt-0.5">
                            Qty: {item.quantity}
                          </p>
                        </div>

                        {/* Price */}
                        <p className="text-sm font-bold text-[var(--color-ink)] flex-shrink-0">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Totals mini summary */}
                  {totals && (
                    <div className="mt-5 pt-4 border-t border-[var(--color-cream)]
                                    space-y-2">
                      {[
                        { label: 'Subtotal',  val: totals.subtotal  },
                        { label: 'Shipping',  val: totals.shipping  },
                        coupon && { label: `Discount (${coupon.code})`, val: -totals.discount, neg: true },
                      ].filter(Boolean).map(({ label, val, neg }) => (
                        <div key={label}
                          className="flex items-center justify-between text-sm">
                          <span className="text-[var(--color-charcoal)]/60">{label}</span>
                          <span className={`font-medium ${neg
                            ? 'text-[var(--color-sage)]'
                            : 'text-[var(--color-ink)]'}`}>
                            {neg ? '−' : ''}{formatPrice(Math.abs(val ?? 0))}
                          </span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between pt-2
                                      border-t border-[var(--color-cream)]">
                        <span className="text-sm font-bold text-[var(--color-ink)]">
                          Total
                        </span>
                        <span className="text-lg font-bold text-gradient">
                          {formatPrice(totals.total)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <button
                    onClick={() => setStep(2)}
                    className="cursor-pointer mt-6 w-full flex items-center justify-center
                               gap-2 py-3.5 bg-[var(--color-ink)] text-[var(--color-paper)]
                               text-sm font-semibold rounded-xl shadow-lg
                               shadow-[var(--color-ink)]/20 hover:bg-[var(--color-charcoal)]
                               hover:-translate-y-0.5 hover:shadow-xl transition-all
                               duration-200 group"
                  >
                    <HiCreditCard className="w-4 h-4" />
                    Continue to Payment
                    <HiArrowRight className="w-4 h-4 transition-transform duration-200
                                             group-hover:translate-x-1" />
                  </button>

                  {/* Back */}
                  <button
                    onClick={() => setStep(0)}
                    className="cursor-pointer mt-2 w-full flex items-center justify-center
                               gap-2 py-2.5 rounded-xl text-sm font-medium
                               text-[var(--color-charcoal)]/70 hover:text-[var(--color-ink)]
                               hover:bg-[var(--color-cream)] transition-all duration-200"
                  >
                    <HiArrowLeft className="w-4 h-4" />
                    Back to Address
                  </button>
                </SectionCard>
              </div>
            )}

            {/* ════════════ STEP 2 — PAYMENT ════════════ */}
            {step === 2 && (
              <div key="step-2" className="space-y-5 animate-fade-in-up">

                {/* Address recap pill */}
                <div className="flex items-center gap-3 px-4 py-3 bg-[var(--color-sage)]/8
                                border border-[var(--color-sage)]/20 rounded-xl">
                  <HiCheckCircle className="w-4 h-4 text-[var(--color-sage)] flex-shrink-0" />
                  <span className="text-xs text-[var(--color-charcoal)]/70 flex-1 truncate">
                    Delivering to:{' '}
                    <strong className="text-[var(--color-ink)]">
                      {shippingAddress?.street}, {shippingAddress?.city}
                    </strong>
                  </span>
                  <button
                    onClick={() => setStep(0)}
                    className="cursor-pointer text-xs font-semibold text-[var(--color-rust)]
                               hover:underline flex-shrink-0"
                  >
                    Edit
                  </button>
                </div>

                {/* Payment section card */}
                <SectionCard title="Payment Method" icon={HiCreditCard}>
                  <PaymentSection
                    onCreateOrder={handleCreateOrder}
                    loading={loading}
                    totals={totals}
                    coupon={coupon}
                  />
                </SectionCard>

                {/* Back */}
                <button
                  onClick={() => setStep(1)}
                  className="cursor-pointer w-full flex items-center justify-center gap-2
                             py-2.5 rounded-xl text-sm font-medium
                             text-[var(--color-charcoal)]/70 hover:text-[var(--color-ink)]
                             hover:bg-[var(--color-cream)] transition-all duration-200
                             border border-[var(--color-cream)]"
                >
                  <HiArrowLeft className="w-4 h-4" />
                  Back to Review
                </button>
              </div>
            )}
          </div>

          {/* ── Right: order summary sidebar ── */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-4 animate-fade-in-up stagger-3">

              {/* Summary card wrapper */}
              <div className="bg-white/85 backdrop-blur-sm border border-[var(--color-cream)]
                              rounded-2xl shadow-sm overflow-hidden">
                <div className="h-1 w-full bg-gradient-to-r from-[var(--color-rust)]
                                via-[var(--color-gold)] to-[var(--color-sage)]" />
                <div className="p-5">
                  <h3 className="text-sm font-bold text-[var(--color-ink)] flex items-center
                                 gap-2 mb-4">
                    <HiShoppingBag className="w-4 h-4 text-[var(--color-rust)]" />
                    Order Summary
                    <span className="ml-auto text-xs font-medium text-[var(--color-mist)]
                                     bg-[var(--color-cream)] px-2 py-0.5 rounded-full">
                      {totalItems} item{totalItems !== 1 ? 's' : ''}
                    </span>
                  </h3>
                  <CartSummary showCheckoutButton={false} />
                </div>
              </div>

              {/* Security badges */}
              <div className="bg-white/60 backdrop-blur-sm border border-[var(--color-cream)]
                              rounded-2xl p-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { emoji: '🔒', label: 'SSL Secure' },
                    { emoji: '🛡️', label: 'Encrypted'  },
                    { emoji: '✅', label: 'Verified'   },
                  ].map(({ emoji, label }) => (
                    <div key={label} className="flex flex-col items-center gap-1">
                      <span className="text-lg">{emoji}</span>
                      <span className="text-[10px] font-semibold text-[var(--color-mist)]
                                       uppercase tracking-wide">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Help note */}
              <p className="text-xs text-center text-[var(--color-mist)] px-2">
                Need help?{' '}
                <a href="/contact"
                  className="cursor-pointer text-[var(--color-rust)] hover:underline
                             font-medium">
                  Contact us
                </a>{' '}
                — we're here for you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}