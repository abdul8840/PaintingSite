// CartPage.jsx
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import CouponInput from '../components/cart/CouponInput';
import EmptyState from '../components/common/EmptyState';
import Breadcrumb from '../components/common/Breadcrumb';
import { HiShoppingCart, HiTrash, HiArrowLeft, HiShieldCheck, HiTruck, HiRefresh, HiSparkles } from 'react-icons/hi';

export default function CartPage() {
  const { items, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-paper">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Breadcrumb items={[{ label: 'Cart' }]} />
          </div>
        </div>
        
        {/* Empty State */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="flex flex-col items-center justify-center text-center animate-fade-in-up">
            <div className="relative mb-8">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-cream rounded-full flex items-center justify-center animate-float">
                <HiShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-mist" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-rust/10 rounded-full flex items-center justify-center">
                <HiSparkles className="w-4 h-4 text-rust" />
              </div>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-3">Your cart is empty</h2>
            <p className="text-charcoal/60 mb-8 max-w-md">
              Looks like you haven't added any artwork to your cart yet. Explore our collection and find something you love!
            </p>
            
            <Link 
              to="/shop"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-ink text-white rounded-xl font-semibold hover:bg-charcoal transition-all duration-300 hover:shadow-xl hover:shadow-ink/20 cursor-pointer active:scale-[0.98]"
            >
              <span>Explore Gallery</span>
              <HiArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={[{ label: 'Cart' }]} />
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-white to-paper border-b border-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 animate-fade-in-up">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-ink rounded-2xl flex items-center justify-center shadow-lg shadow-ink/20">
                  <HiShoppingCart className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-rust text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                  {items.length}
                </div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink">Shopping Cart</h1>
                <p className="text-charcoal/60 mt-1">
                  {items.length} item{items.length !== 1 ? 's' : ''} waiting for you
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4">
              <Link 
                to="/shop"
                className="group flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-cream hover:bg-mist/30 rounded-xl text-charcoal hover:text-ink transition-all duration-300 text-sm sm:text-base cursor-pointer"
              >
                <HiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="hidden sm:inline">Continue Shopping</span>
                <span className="sm:hidden">Shop</span>
              </Link>
              <button 
                onClick={clear}
                className="group flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 border-2 border-rust/20 text-rust hover:bg-rust hover:text-white hover:border-rust rounded-xl transition-all duration-300 text-sm sm:text-base cursor-pointer"
              >
                <HiTrash className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5">
            {/* Items Header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-cream/50 rounded-xl text-sm font-medium text-charcoal/70 animate-fade-in-up">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>
            
            {/* Cart Items List */}
            <div className="space-y-4">
              {items.map((item, index) => (
                <div 
                  key={item._id}
                  className="animate-fade-in-up opacity-0"
                  style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
                >
                  <CartItem item={item} />
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-cream animate-fade-in-up stagger-3">
              {[
                { icon: HiShieldCheck, title: 'Secure Checkout', desc: '256-bit SSL encryption' },
                { icon: HiTruck, title: 'Free Shipping', desc: 'On orders over ₹999' },
                { icon: HiRefresh, title: 'Easy Returns', desc: '30-day return policy' },
              ].map((badge, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border border-cream hover:border-sage/30 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-sage/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <badge.icon className="w-5 h-5 text-sage" />
                  </div>
                  <div>
                    <p className="font-medium text-ink text-sm">{badge.title}</p>
                    <p className="text-xs text-charcoal/50">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-5">
              {/* Coupon Section */}
              <div className="bg-white rounded-2xl border border-cream p-5 sm:p-6 animate-fade-in-up stagger-1 hover:shadow-lg hover:shadow-ink/5 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-gold/10 rounded-lg flex items-center justify-center">
                    <HiSparkles className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="text-lg font-semibold text-ink">Have a Coupon?</h3>
                </div>
                <CouponInput />
              </div>
              
              {/* Cart Summary */}
              <div className="animate-fade-in-up stagger-2">
                <CartSummary />
              </div>

              {/* Secure Payment Info */}
              <div className="bg-gradient-to-br from-sage/5 to-sage/10 rounded-2xl border border-sage/20 p-5 animate-fade-in-up stagger-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-sage/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <HiShieldCheck className="w-5 h-5 text-sage" />
                  </div>
                  <div>
                    <p className="font-semibold text-ink text-sm">100% Secure Payment</p>
                    <p className="text-xs text-charcoal/60 mt-1 leading-relaxed">
                      Your payment information is processed securely. We accept all major payment methods.
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      {['Visa', 'MC', 'UPI', 'Net'].map((method, i) => (
                        <span 
                          key={i}
                          className="px-2 py-1 bg-white rounded text-xs font-medium text-charcoal/70 border border-cream"
                        >
                          {method}
                        </span>
                      ))}
                    </div>
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