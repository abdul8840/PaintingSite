import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
import { HiLocationMarker, HiPencil, HiShoppingBag, HiCheck, HiArrowLeft, HiArrowRight, HiShieldCheck } from 'react-icons/hi';

export default function CheckoutPage() {
  const { items, totals, coupon } = useCart();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [shippingAddress, setShippingAddress] = useState(user?.addresses?.find(a => a.isDefault) || null);
  const [loading, setLoading] = useState(false);

  if (items.length === 0) { 
    navigate('/cart'); 
    return null; 
  }

  const handleAddressSubmit = (address) => {
    setShippingAddress(address);
    setStep(1);
  };

  const handleCreateOrder = async (paymentMethod) => {
    setLoading(true);
    try {
      const orderData = {
        items: items.map(i => ({ artwork: i._id, quantity: i.quantity })),
        shippingAddress,
        paymentMethod,
        couponCode: coupon?.code,
      };

      const res = await orderApi.create(orderData);

      if (paymentMethod === 'stripe' && res.url) {
        dispatch(clearCart());
        return res;
      }

      dispatch(clearCart());
      navigate(`/order-success?orderId=${res.order._id}`);
    } catch (err) {
      toast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={[{ label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 animate-fade-in-up">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink mb-2">Checkout</h1>
          <p className="text-charcoal/60">Complete your order in a few simple steps</p>
        </div>

        {/* Steps */}
        <div className="mb-8 sm:mb-10 animate-fade-in-up stagger-1">
          <CheckoutSteps currentStep={step} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2">
            {/* Step 0: Shipping Address */}
            {step === 0 && (
              <div className="animate-fade-in-up">
                <div className="bg-white rounded-2xl border border-cream p-5 sm:p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 bg-sage/10 rounded-xl flex items-center justify-center">
                      <HiLocationMarker className="w-5 h-5 sm:w-6 sm:h-6 text-sage" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-ink">Shipping Address</h2>
                  </div>
                  
                  {/* Saved Addresses */}
                  {user?.addresses?.length > 0 && (
                    <div className="mb-6 sm:mb-8">
                      <h3 className="text-sm font-medium text-charcoal/70 mb-3 sm:mb-4">Saved Addresses</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {user.addresses.map((addr, index) => (
                          <button 
                            key={addr._id} 
                            onClick={() => { setShippingAddress(addr); setStep(1); }}
                            className={`group text-left p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer active:scale-[0.98] hover:shadow-md animate-fade-in-up ${
                              shippingAddress?._id === addr._id 
                                ? 'border-sage bg-sage/5' 
                                : 'border-cream hover:border-sage/50'
                            }`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            {addr.isDefault && (
                              <span className="inline-block px-2 py-0.5 bg-sage/10 text-sage text-xs font-medium rounded-full mb-2">
                                Default
                              </span>
                            )}
                            <p className="font-medium text-ink text-sm sm:text-base">{addr.street}</p>
                            <p className="text-charcoal/60 text-sm">{addr.city}, {addr.state} {addr.zipCode}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Divider */}
                  <div className="relative my-6 sm:my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-cream" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-4 text-sm text-charcoal/50">Or enter a new address</span>
                    </div>
                  </div>
                  
                  {/* Address Form */}
                  <AddressForm address={shippingAddress} onSubmit={handleAddressSubmit} />
                </div>
              </div>
            )}

            {/* Step 1: Review Order */}
            {step === 1 && (
              <div className="space-y-4 sm:space-y-6 animate-fade-in-up">
                {/* Shipping Address Review */}
                <div className="bg-white rounded-2xl border border-cream p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-sage rounded-lg flex items-center justify-center">
                        <HiCheck className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-ink text-base sm:text-lg">Shipping To</h3>
                    </div>
                    <button 
                      onClick={() => setStep(0)}
                      className="flex items-center gap-1.5 text-sm text-charcoal/60 hover:text-ink transition-colors cursor-pointer"
                    >
                      <HiPencil className="w-4 h-4" />
                      Change
                    </button>
                  </div>
                  <div className="pl-12 sm:pl-13">
                    <p className="font-medium text-ink text-sm sm:text-base">{shippingAddress.street}</p>
                    <p className="text-charcoal/60 text-sm">{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                  </div>
                </div>

                {/* Order Items Review */}
                <div className="bg-white rounded-2xl border border-cream p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-5 sm:mb-6">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                      <HiShoppingBag className="w-5 h-5 text-gold" />
                    </div>
                    <h3 className="font-semibold text-ink text-base sm:text-lg">Order Items ({items.length})</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div 
                        key={item._id}
                        className="flex gap-4 p-3 sm:p-4 bg-paper rounded-xl animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-ink text-sm sm:text-base truncate">{item.title}</p>
                          <p className="text-charcoal/60 text-sm mt-1">
                            {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-semibold text-ink text-sm sm:text-base">
                          ${(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Continue Button */}
                <button 
                  onClick={() => setStep(2)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-ink text-white rounded-xl font-semibold hover:bg-charcoal transition-all duration-300 hover:shadow-lg hover:shadow-ink/20 cursor-pointer active:scale-[0.98]"
                >
                  Continue to Payment
                  <HiArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="animate-fade-in-up">
                <div className="bg-white rounded-2xl border border-cream p-5 sm:p-6 lg:p-8">
                  {/* Back Button */}
                  <button 
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 text-charcoal/60 hover:text-ink transition-colors mb-6 cursor-pointer"
                  >
                    <HiArrowLeft className="w-4 h-4" />
                    Back to Review
                  </button>
                  
                  <PaymentSection onCreateOrder={handleCreateOrder} loading={loading} />
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Order Summary */}
          <div className="lg:col-span-1 animate-fade-in-up stagger-2">
            <div className="sticky top-4">
              <CartSummary showCheckoutButton={false} />
              
              {/* Security Badge */}
              <div className="mt-4 p-4 bg-white rounded-xl border border-cream">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-sage/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HiShieldCheck className="w-5 h-5 text-sage" />
                  </div>
                  <div>
                    <p className="font-medium text-ink text-sm">Secure Checkout</p>
                    <p className="text-xs text-charcoal/50">Your payment is protected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}