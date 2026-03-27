import { useSelector, useDispatch } from 'react-redux';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  selectCartCount,
  selectCartTotal,
} from '../store/slices/cartSlice';
import { showToast } from '../store/slices/uiSlice';

export const useCart = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const count = useSelector(selectCartCount);
  const totals = useSelector(selectCartTotal);
  const coupon = useSelector((state) => state.cart.coupon);

  const add = (artwork) => {
    if (!artwork || !artwork._id) {
      dispatch(showToast({ message: 'Invalid artwork', type: 'error' }));
      return;
    }

    if (artwork.stock !== undefined && artwork.stock <= 0) {
      dispatch(showToast({ message: 'This artwork is sold out', type: 'error' }));
      return;
    }

    // Check if already in cart at max quantity
    const existingItem = items.find(i => i._id === artwork._id);
    if (existingItem && existingItem.quantity >= (artwork.stock || 10)) {
      dispatch(showToast({ message: 'Maximum quantity reached', type: 'warning' }));
      return;
    }

    dispatch(addToCart({
      _id: artwork._id,
      title: artwork.title,
      slug: artwork.slug,
      price: artwork.price,
      image: artwork.images?.[0]?.url || artwork.image || '',
      artist: artwork.artist ? {
        firstName: artwork.artist.firstName,
        lastName: artwork.artist.lastName,
      } : null,
      stock: artwork.stock || 10,
    }));
    dispatch(showToast({ message: `${artwork.title} added to cart!`, type: 'success' }));
  };

  const remove = (id) => {
    dispatch(removeFromCart(id));
    dispatch(showToast({ message: 'Removed from cart', type: 'info' }));
  };

  const update = (id, quantity) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ id, quantity }));
  };

  const clear = () => {
    dispatch(clearCart());
  };

  return { items, count, totals, coupon, add, remove, update, clear };
};