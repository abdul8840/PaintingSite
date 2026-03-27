import { useState } from 'react';
import { useToast } from '../../hooks/useToast';
import {
  HiCreditCard,
  HiShieldCheck,
  HiLockClosed,
} from 'react-icons/hi';

export default function PaymentSection({ onCreateOrder, loading }) {
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const toast = useToast();

  const handlePay = async () => {
    try {
      const result = await onCreateOrder(paymentMethod);
      if (paymentMethod === 'stripe' && result?.url) {
        window.location.href = result.url;
      }
    } catch (err) {
      toast.error(err.message || 'Payment failed');
    }
  };

  const paymentOptions = [
    {
      value: 'stripe',
      label: 'Credit / Debit Card',
      desc: 'Pay securely via Stripe',
      icon: HiCreditCard,
    },
  ];

  return (
    <div
      className="
        bg-paper rounded-2xl
        border border-cream
        overflow-hidden
        animate-fade-in-up
      "
      style={{ animationFillMode: 'forwards' }}
    >
      {/* Header */}
      <div className="px-5 sm:px-6 py-4 border-b border-cream bg-cream/30">
        <div className="flex items-center gap-2.5">
          <div
            className="
              w-9 h-9 rounded-xl
              bg-rust/10
              flex items-center justify-center
            "
          >
            <HiCreditCard className="w-4.5 h-4.5 text-rust" />
          </div>
          <div>
            <h3 className="text-base font-bold text-ink">Payment Method</h3>
            <p className="text-xs text-mist mt-0.5">
              Select your preferred payment method
            </p>
          </div>
        </div>
      </div>

      {/* Payment Options */}
      <div className="px-5 sm:px-6 py-5 space-y-3">
        {paymentOptions.map((option) => {
          const isSelected = paymentMethod === option.value;
          return (
            <label
              key={option.value}
              className={`
                flex items-center gap-4
                p-4 rounded-xl
                border-2 cursor-pointer
                transition-all duration-300
                ${
                  isSelected
                    ? 'border-rust bg-rust/5 shadow-md shadow-rust/5'
                    : 'border-cream hover:border-mist/50 hover:bg-cream/30'
                }
              `}
            >
              {/* Custom Radio */}
              <div className="relative shrink-0">
                <input
                  type="radio"
                  name="payment"
                  value={option.value}
                  checked={isSelected}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="sr-only peer"
                />
                <div
                  className={`
                    w-5 h-5 rounded-full
                    border-2
                    transition-all duration-300
                    ${
                      isSelected
                        ? 'border-rust'
                        : 'border-mist/50'
                    }
                  `}
                >
                  <div
                    className={`
                      w-full h-full rounded-full
                      flex items-center justify-center
                      transition-all duration-300
                    `}
                  >
                    {isSelected && (
                      <div
                        className="
                          w-2.5 h-2.5 rounded-full bg-rust
                          animate-scale-in
                        "
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Icon */}
              <div
                className={`
                  w-10 h-10 rounded-xl
                  flex items-center justify-center
                  transition-all duration-300
                  ${
                    isSelected
                      ? 'bg-rust/10'
                      : 'bg-cream'
                  }
                `}
              >
                <option.icon
                  className={`
                    w-5 h-5
                    transition-colors duration-300
                    ${isSelected ? 'text-rust' : 'text-mist'}
                  `}
                />
              </div>

              {/* Text */}
              <div>
                <p
                  className={`
                    text-sm font-semibold
                    transition-colors duration-300
                    ${isSelected ? 'text-ink' : 'text-charcoal'}
                  `}
                >
                  {option.label}
                </p>
                <p className="text-xs text-mist mt-0.5">{option.desc}</p>
              </div>
            </label>
          );
        })}
      </div>

      {/* Pay Button */}
      <div className="px-5 sm:px-6 pb-5 space-y-3">
        <button
          onClick={handlePay}
          disabled={loading}
          className="
            w-full
            inline-flex items-center justify-center gap-2
            px-6 py-3.5 rounded-xl
            bg-rust text-paper text-sm font-bold
            hover:bg-rust/90
            disabled:opacity-50 disabled:cursor-not-allowed
            disabled:hover:bg-rust
            transition-all duration-300 cursor-pointer
            active:scale-[0.98]
            shadow-lg shadow-rust/20
          "
        >
          {loading ? (
            <>
              <div
                className="
                  w-4 h-4 rounded-full
                  border-2 border-paper/30 border-t-paper
                  animate-spin
                "
              />
              Processing...
            </>
          ) : (
            <>
              <HiLockClosed className="w-4 h-4" />
              {paymentMethod === 'stripe'
                ? 'Pay with Stripe'
                : 'Place Order'}
            </>
          )}
        </button>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-1.5">
          <HiShieldCheck className="w-3.5 h-3.5 text-sage" />
          <p className="text-[10px] text-mist uppercase tracking-wider font-medium">
            256-bit SSL Encrypted Payment
          </p>
        </div>
      </div>
    </div>
  );
}