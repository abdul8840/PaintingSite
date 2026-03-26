import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';

export default function CartSummary({ showCheckoutButton = true }) {
  const { totals, coupon } = useCart();

  return (
    <div>
      <h3>Order Summary</h3>
      <div>
        <div><span>Subtotal</span><span>${totals.subtotal.toFixed(2)}</span></div>
        {totals.discount > 0 && (
          <div><span>Discount {coupon && `(${coupon.code})`}</span><span>-${totals.discount.toFixed(2)}</span></div>
        )}
        <div><span>Shipping</span><span>{totals.shipping === 0 ? 'Free' : `$${totals.shipping.toFixed(2)}`}</span></div>
        <div><span>Tax</span><span>${totals.tax.toFixed(2)}</span></div>
        <div><span>Total</span><span>${totals.total.toFixed(2)}</span></div>
      </div>
      {totals.subtotal < 200 && (
        <p>Add ${(200 - totals.subtotal).toFixed(2)} more for free shipping!</p>
      )}
      {showCheckoutButton && (
        <Link to="/checkout">Proceed to Checkout</Link>
      )}
    </div>
  );
}