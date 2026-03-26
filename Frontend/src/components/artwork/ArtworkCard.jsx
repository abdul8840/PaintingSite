import { Link } from 'react-router-dom';
import { HiHeart, HiShoppingCart } from 'react-icons/hi';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlistItem } from '../../store/slices/wishlistSlice';
import PriceDisplay from '../common/PriceDisplay';
import Rating from '../common/Rating';

export default function ArtworkCard({ artwork }) {
  const { isAuthenticated } = useAuth();
  const { add } = useCart();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isWishlisted = wishlistItems.some((item) => item._id === artwork._id);

  const handleWishlist = (e) => {
    e.preventDefault();
    if (isAuthenticated) dispatch(toggleWishlistItem(artwork._id));
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (artwork.stock > 0) add(artwork);
  };

  return (
    <Link to={`/artwork/${artwork.slug}`}>
      <div>
        <div>
          <img src={artwork.images?.[0]?.url || '/placeholder.jpg'} alt={artwork.title} loading="lazy" />
          {artwork.comparePrice > artwork.price && (
            <span>{Math.round(((artwork.comparePrice - artwork.price) / artwork.comparePrice) * 100)}% OFF</span>
          )}
          <div>
            {isAuthenticated && (
              <button onClick={handleWishlist} data-wishlisted={isWishlisted}>
                <HiHeart />
              </button>
            )}
            {artwork.stock > 0 && (
              <button onClick={handleAddToCart}>
                <HiShoppingCart />
              </button>
            )}
          </div>
        </div>
        <div>
          <p>{artwork.category?.name}</p>
          <h3>{artwork.title}</h3>
          {artwork.artist && <p>by {artwork.artist.firstName} {artwork.artist.lastName}</p>}
          <Rating value={artwork.ratings?.average} count={artwork.ratings?.count} />
          <PriceDisplay price={artwork.price} comparePrice={artwork.comparePrice} />
          {artwork.stock === 0 && <span>Sold Out</span>}
        </div>
      </div>
    </Link>
  );
}