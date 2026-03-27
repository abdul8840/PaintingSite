import { useState } from 'react';
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

export default function CheckoutPage() {
  const { items, totals, coupon } = useCart();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [shippingAddress, setShippingAddress] = useState(user?.addresses?.find(a => a.isDefault) || null);
  const [loading, setLoading] = useState(false);

  if (items.length === 0) { navigate('/cart'); return null; }

  const handleAddressSubmit = (address) => { setShippingAddress(address); setStep(1); };

  const initiateRazorpay = (orderData, razorpayOrder, keyId) => {
    const options = {
      key: keyId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: 'SketchMint',
      description: `Order ${orderData.orderNumber}`,
      order_id: razorpayOrder.id,
      handler: async function (response) {
        try {
          // Verify payment on backend
          const verifyRes = await orderApi.verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: orderData._id,
          });

          if (verifyRes.success) {
            dispatch(clearCart());
            toast.success('Payment successful!');
            navigate(`/order-success?orderId=${orderData._id}`);
          } else {
            toast.error('Payment verification failed');
          }
        } catch (err) {
          toast.error('Payment verification failed. Contact support.');
        }
      },
      prefill: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        contact: user.phone || '',
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
      setLoading(false);
      toast.error(`Payment failed: ${response.error.description}`);
    });
    rzp.open();
  };

  const handleCreateOrder = async (paymentMethod) => {
    if (!shippingAddress) { toast.error('Please select a shipping address'); setStep(0); return; }

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

      if (paymentMethod === 'razorpay' && res.razorpayOrder) {
        initiateRazorpay(res.order, res.razorpayOrder, res.keyId);
        return;
      }

      // COD
      dispatch(clearCart());
      toast.success('Order placed successfully!');
      navigate(`/order-success?orderId=${res.order._id}`);
    } catch (err) {
      toast.error(err.message || 'Failed to create order');
    } finally {
      if (!loading) setLoading(false);
    }
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />
      <h1>Checkout</h1>
      <CheckoutSteps currentStep={step} />

      <div>
        <div>
          {step === 0 && (
            <div>
              <h2>Shipping Address</h2>
              {user?.addresses?.length > 0 && (
                <div>
                  <h3>Saved Addresses</h3>
                  {user.addresses.map((addr) => (
                    <button key={addr._id} onClick={() => { setShippingAddress(addr); setStep(1); }}>
                      <p>{addr.street}</p>
                      <p>{addr.city}, {addr.state} {addr.zipCode}</p>
                      {addr.isDefault && <span>Default</span>}
                    </button>
                  ))}
                </div>
              )}
              <h3>Or enter a new address</h3>
              <AddressForm address={shippingAddress} onSubmit={handleAddressSubmit} />
            </div>
          )}

          {step === 1 && (
            <div>
              <h2>Review Order</h2>
              <div>
                <h3>Shipping To</h3>
                <p>{shippingAddress.street}</p>
                <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                <button onClick={() => setStep(0)}>Change Address</button>
              </div>
              <div>
                <h3>Items ({items.length})</h3>
                {items.map((item) => (
                  <div key={item._id}>
                    <img src={item.image} alt={item.title} />
                    <div>
                      <p>{item.title}</p>
                      <p>{item.quantity} × {formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setStep(2)}>Continue to Payment</button>
            </div>
          )}

          {step === 2 && (
            <div>
              <button onClick={() => setStep(1)}>← Back to Review</button>
              <PaymentSection onCreateOrder={handleCreateOrder} loading={loading} />
            </div>
          )}
        </div>

        <CartSummary showCheckoutButton={false} />
      </div>
    </div>
  );
}