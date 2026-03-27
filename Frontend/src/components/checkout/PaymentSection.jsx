// PaymentSection.jsx
import { useState } from 'react';
import { useToast } from '../../hooks/useToast';
import { 
  HiCreditCard, HiCurrencyRupee, HiShieldCheck, HiLockClosed,
  HiCheck, HiCash, HiDeviceMobile, HiOfficeBuilding
} from 'react-icons/hi';

const PAYMENT_METHODS = [
  {
    id: 'razorpay',
    name: 'Pay Online',
    description: 'UPI, Credit/Debit Card, Net Banking, Wallets',
    icon: HiCreditCard,
    recommended: true,
    options: [
      { name: 'UPI', icon: HiDeviceMobile },
      { name: 'Cards', icon: HiCreditCard },
      { name: 'Net Banking', icon: HiOfficeBuilding },
    ],
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay when you receive your order',
    icon: HiCash,
    note: '₹50 COD fee applicable',
  },
];

export default function PaymentSection({ onCreateOrder, loading, total }) {
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const toast = useToast();

  const handlePay = async () => {
    try {
      await onCreateOrder(paymentMethod);
    } catch (err) {
      toast.error(err.message || 'Payment failed');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-cream overflow-hidden shadow-lg shadow-ink/5">
      {/* Header */}
      <div className="px-5 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-ink to-charcoal">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <HiLockClosed className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">Payment Method</h3>
            <p className="text-xs text-white/60">Choose how you'd like to pay</p>
          </div>
        </div>
      </div>

      {/* Payment Options */}
      <div className="p-5 sm:p-6 space-y-4">
        {PAYMENT_METHODS.map((method, index) => {
          const isSelected = paymentMethod === method.id;
          const Icon = method.icon;
          
          return (
            <label
              key={method.id}
              className={`group relative block p-4 sm:p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 animate-fade-in-up ${
                isSelected
                  ? 'border-sage bg-sage/5 shadow-lg shadow-sage/10'
                  : 'border-cream bg-white hover:border-sage/50 hover:shadow-md'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <input
                type="radio"
                name="payment"
                value={method.id}
                checked={isSelected}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="sr-only"
              />

              <div className="flex items-start gap-4">
                {/* Radio Circle */}
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300 ${
                  isSelected ? 'border-sage bg-sage' : 'border-charcoal/30'
                }`}>
                  {isSelected && <HiCheck className="w-3 h-3 text-white" />}
                </div>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  isSelected ? 'bg-sage/20' : 'bg-cream'
                }`}>
                  <Icon className={`w-6 h-6 transition-colors ${
                    isSelected ? 'text-sage' : 'text-charcoal/50'
                  }`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-semibold transition-colors ${
                      isSelected ? 'text-ink' : 'text-charcoal'
                    }`}>
                      {method.name}
                    </span>
                    {method.recommended && (
                      <span className="px-2 py-0.5 bg-sage/10 text-sage text-xs font-semibold rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-charcoal/60 mt-1">
                    {method.description}
                  </p>

                  {/* Payment Options Icons */}
                  {method.options && isSelected && (
                    <div className="flex items-center gap-3 mt-3 animate-fade-in">
                      {method.options.map((opt, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white rounded-lg border border-cream"
                        >
                          <opt.icon className="w-4 h-4 text-charcoal/50" />
                          <span className="text-xs font-medium text-charcoal/70">{opt.name}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* COD Note */}
                  {method.note && isSelected && (
                    <p className="text-xs text-rust mt-2 flex items-center gap-1 animate-fade-in">
                      <HiCurrencyRupee className="w-3 h-3" />
                      {method.note}
                    </p>
                  )}
                </div>
              </div>

              {/* Selected Checkmark */}
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <div className="w-6 h-6 bg-sage rounded-full flex items-center justify-center">
                    <HiCheck className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </label>
          );
        })}
      </div>

      {/* Pay Button */}
      <div className="px-5 sm:px-6 pb-5 sm:pb-6">
        <button
          onClick={handlePay}
          disabled={loading}
          className="group w-full flex items-center justify-center gap-3 px-6 py-4 sm:py-5 bg-gradient-to-r from-ink to-charcoal text-white rounded-xl font-bold text-base sm:text-lg transition-all duration-500 hover:shadow-2xl hover:shadow-ink/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {loading ? (
            <>
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Processing...</span>
            </>
          ) : (
            <>
              {paymentMethod === 'razorpay' ? (
                <>
                  <HiLockClosed className="w-5 h-5" />
                  <span>Pay Now</span>
                  {total && (
                    <span className="ml-2 px-3 py-1 bg-white/20 rounded-lg text-sm">
                      {total}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <HiCheck className="w-5 h-5" />
                  <span>Place Order (COD)</span>
                </>
              )}
            </>
          )}
        </button>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-3 mt-4 py-3 bg-sage/5 rounded-xl border border-sage/20">
          <HiShieldCheck className="w-5 h-5 text-sage" />
          <span className="text-sm text-charcoal/70">
            <span className="font-medium text-ink">256-bit SSL</span> Secure Payment
          </span>
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center gap-4 mt-3 flex-wrap">
          {['Visa', 'MC', 'UPI', 'Paytm', 'GPay'].map((brand, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-cream rounded text-xs font-medium text-charcoal/60 border border-cream"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}