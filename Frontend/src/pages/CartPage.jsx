import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import CouponInput from '../components/cart/CouponInput';
import EmptyState from '../components/common/EmptyState';
import Breadcrumb from '../components/common/Breadcrumb';
import { HiShoppingCart, HiTrash, HiArrowLeft } from 'react-icons/hi';

export default function CartPage() {
  const { items, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-paper">
        <div className="bg-white border-b border-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Breadcrumb items={[{ label: 'Cart' }]} />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <EmptyState 
            icon={HiShoppingCart} 
            title="Your cart is empty" 
            description="Browse our gallery to find beautiful artworks." 
            actionLabel="Shop Now" 
            actionHref="/shop" 
          />
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-ink rounded-xl flex items-center justify-center">
              <HiShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-ink">Shopping Cart</h1>
              <p className="text-sm text-charcoal/60">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              to="/shop"
              className="flex items-center gap-2 px-4 py-2.5 text-charcoal/70 hover:text-ink transition-colors text-sm sm:text-base cursor-pointer"
            >
              <HiArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
            <button 
              onClick={clear}
              className="flex items-center gap-2 px-4 py-2.5 text-rust hover:bg-rust/10 rounded-lg transition-all duration-300 text-sm sm:text-base cursor-pointer"
            >
              <HiTrash className="w-4 h-4" />
              <span className="hidden sm:inline">Clear Cart</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4 animate-fade-in-up stagger-1">
            {items.map((item, index) => (
              <div 
                key={item._id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CartItem item={item} />
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 animate-fade-in-up stagger-2">
            <div className="sticky top-4 space-y-4 sm:space-y-6">
              {/* Coupon Input */}
              <div className="bg-white rounded-2xl border border-cream p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-ink mb-4">Have a Coupon?</h3>
                <CouponInput />
              </div>
              
              {/* Cart Summary */}
              <CartSummary />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}