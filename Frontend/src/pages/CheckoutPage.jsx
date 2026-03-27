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

// Load Razorpay script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const { items, totals, coupon } = useCart();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [shippingAddress, setShippingAddress] = useState(
    user?.addresses?.find(a => a.isDefault) || null
  );
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay script on component mount
  useEffect(() => {
    loadRazorpayScript().then((loaded) => {
      setRazorpayLoaded(loaded);
      if (!loaded) {
        toast.error('Payment gateway failed to load. Please refresh the page.');
      }
    });
  }, []);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleAddressSubmit = (address) => {
    setShippingAddress(address);
    setStep(1);
  };

  const initiateRazorpay = async (orderData, razorpayOrder, keyId) => {
    // Double-check Razorpay is loaded
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
          // Verify payment on backend
          const verifyRes = await orderApi.verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: orderData._id,
          });

          if (verifyRes.success) {
            dispatch(clearCart());
            toast.success('Payment successful! Order confirmed.');
            navigate(`/order-success?orderId=${orderData._id}`);
          } else {
            toast.error('Payment verification failed. Please contact support.');
          }
        } catch (err) {
          console.error('Payment verification error:', err);
          toast.error('Payment verification failed. Please contact support.');
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
        email: user?.email || '',
        contact: user?.phone || '',
      },
      theme: {
        color: '#4f46e5',
      },
      modal: {
        ondismiss: function () {
          setLoading(false);
          toast.info('Payment cancelled');
        },
      },
    };

    const rzp = new window.Razorpay(options);
    
    rzp.on('payment.failed', function (response) {
      console.error('Payment failed:', response.error);
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
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country || 'IN',
        },
        paymentMethod,
        couponCode: coupon?.code || undefined,
      };

      const res = await orderApi.create(orderData);

      if (paymentMethod === 'razorpay') {
        if (!res.razorpayOrder) {
          throw new Error('Payment initialization failed');
        }
        
        if (!razorpayLoaded) {
          const loaded = await loadRazorpayScript();
          if (!loaded) {
            throw new Error('Payment gateway unavailable');
          }
          setRazorpayLoaded(true);
        }
        
        initiateRazorpay(res.order, res.razorpayOrder, res.keyId);
        return;
      }

      // COD
      dispatch(clearCart());
      toast.success('Order placed successfully!');
      navigate(`/order-success?orderId=${res.order._id}`);
    } catch (err) {
      console.error('Create order error:', err);
      toast.error(err.message || 'Failed to create order. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <Breadcrumb items={[{ label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />
      <h1>Checkout</h1>
      <CheckoutSteps currentStep={step} steps={['Address', 'Review', 'Payment']} />

      <div className="checkout-layout">
        <div className="checkout-main">
          {step === 0 && (
            <div className="address-step">
              <h2>Shipping Address</h2>
              {user?.addresses?.length > 0 && (
                <div className="saved-addresses">
                  <h3>Saved Addresses</h3>
                  <div className="address-list">
                    {user.addresses.map((addr) => (
                      <button
                        key={addr._id}
                        className={`address-card ${shippingAddress?._id === addr._id ? 'selected' : ''}`}
                        onClick={() => { setShippingAddress(addr); setStep(1); }}
                      >
                        <p>{addr.street}</p>
                        <p>{addr.city}, {addr.state} {addr.zipCode}</p>
                        {addr.isDefault && <span className="default-badge">Default</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <h3>Or enter a new address</h3>
              <AddressForm 
                address={shippingAddress} 
                onSubmit={handleAddressSubmit} 
                isLoading={loading}
              />
            </div>
          )}

          {step === 1 && (
            <div className="review-step">
              <h2>Review Order</h2>
              <div className="review-section">
                <h3>Shipping To</h3>
                <div className="address-details">
                  <p>{shippingAddress.street}</p>
                  <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                  <p>{shippingAddress.country}</p>
                  <button 
                    className="change-btn"
                    onClick={() => setStep(0)}
                  >
                    Change Address
                  </button>
                </div>
              </div>
              
              <div className="review-section">
                <h3>Items ({items.reduce((sum, item) => sum + item.quantity, 0)})</h3>
                <div className="order-items">
                  {items.map((item) => (
                    <div key={item._id} className="order-item">
                      <img src={item.images?.[0]?.url || item.image} alt={item.title} />
                      <div className="item-details">
                        <p className="item-title">{item.title}</p>
                        <p className="item-quantity">Quantity: {item.quantity}</p>
                      </div>
                      <div className="item-price">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <button 
                className="continue-btn"
                onClick={() => setStep(2)}
              >
                Continue to Payment
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="payment-step">
              <button 
                className="back-btn"
                onClick={() => setStep(1)}
              >
                ← Back to Review
              </button>
              <PaymentSection 
                onCreateOrder={handleCreateOrder} 
                loading={loading}
                totals={totals}
                coupon={coupon}
              />
            </div>
          )}
        </div>

        <div className="checkout-sidebar">
          <CartSummary showCheckoutButton={false} />
        </div>
      </div>
    </div>
  );
}