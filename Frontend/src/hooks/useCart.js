import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, updateQuantity, clearCart, selectCartCount, selectCartTotal } from '../store/slices/cartSlice';
import { showToast } from '../store/slices/uiSlice';

export const useCart = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const count = useSelector(selectCartCount);
  const totals = useSelector(selectCartTotal);
  const coupon = useSelector((state) => state.cart.coupon);

  const add = (artwork) => {
    dispatch(addToCart({
      _id: artwork._id,
      title: artwork.title,
      slug: artwork.slug,
      price: artwork.price,
      image: artwork.images?.[0]?.url || '',
      artist: artwork.artist,
      stock: artwork.stock,
    }));
    dispatch(showToast({ message: 'Added to cart!', type: 'success' }));
  };

  const remove = (id) => {
    dispatch(removeFromCart(id));
    dispatch(showToast({ message: 'Removed from cart', type: 'info' }));
  };

  const update = (id, quantity) => dispatch(updateQuantity({ id, quantity }));
  const clear = () => dispatch(clearCart());

  return { items, count, totals, coupon, add, remove, update, clear };
};