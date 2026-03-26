import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import CouponInput from '../components/cart/CouponInput';
import EmptyState from '../components/common/EmptyState';
import Breadcrumb from '../components/common/Breadcrumb';
import { HiShoppingCart } from 'react-icons/hi';

export default function CartPage() {
  const { items, clear } = useCart();

  if (items.length === 0) {
    return (
      <div>
        <Breadcrumb items={[{ label: 'Cart' }]} />
        <EmptyState icon={HiShoppingCart} title="Your cart is empty" description="Browse our gallery to find beautiful artworks." actionLabel="Shop Now" actionHref="/shop" />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb items={[{ label: 'Cart' }]} />
      <div>
        <div>
          <h1>Shopping Cart ({items.length} items)</h1>
          <button onClick={clear}>Clear Cart</button>
        </div>
        <div>
          <div>
            {items.map((item) => <CartItem key={item._id} item={item} />)}
          </div>
          <div>
            <CouponInput />
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
}