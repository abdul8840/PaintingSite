import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/currency';

export default function CartSummary({ showCheckoutButton = true }) {
  const { totals, coupon } = useCart();

  return (
    <div>
      <h3>Order Summary</h3>
      <div>
        <div><span>Subtotal</span><span>{formatPrice(totals.subtotal)}</span></div>
        {totals.discount > 0 && (
          <div><span>Discount {coupon && `(${coupon.code})`}</span><span>-{formatPrice(totals.discount)}</span></div>
        )}
        <div><span>Shipping</span><span>{totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}</span></div>
        <div><span>GST (18%)</span><span>{formatPrice(totals.tax)}</span></div>
        <div><span>Total</span><span>{formatPrice(totals.total)}</span></div>
      </div>
      {totals.subtotal > 0 && totals.subtotal < 2000 && (
        <p>Add {formatPrice(2000 - totals.subtotal)} more for free shipping!</p>
      )}
      {showCheckoutButton && (
        <Link to="/checkout">Proceed to Checkout</Link>
      )}
    </div>
  );
}