import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiHeart, HiShoppingCart, HiShare } from 'react-icons/hi';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlistItem } from '../../store/slices/wishlistSlice';
import PriceDisplay from '../common/PriceDisplay';
import Rating from '../common/Rating';
import Badge from '../common/Badge';

export default function ArtworkInfo({ artwork }) {
  const { isAuthenticated } = useAuth();
  const { add } = useCart();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isWishlisted = wishlistItems.some((item) => item._id === artwork._id);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) add(artwork);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  return (
    <div>
      <div>
        <Badge>{artwork.category?.name}</Badge>
        {artwork.isFeatured && <Badge variant="featured">Featured</Badge>}
      </div>

      <h1>{artwork.title}</h1>

      {artwork.artist && (
        <p>by {artwork.artist.firstName} {artwork.artist.lastName}</p>
      )}

      <Rating value={artwork.ratings?.average} count={artwork.ratings?.count} />

      <PriceDisplay price={artwork.price} comparePrice={artwork.comparePrice} size="large" />

      <p>{artwork.description}</p>

      {/* Details */}
      <div>
        <div><span>Medium:</span> <span>{artwork.medium}</span></div>
        <div><span>Style:</span> <span>{artwork.style}</span></div>
        <div><span>Dimensions:</span> <span>{artwork.dimensions?.width}" × {artwork.dimensions?.height}" ({artwork.dimensions?.unit})</span></div>
        {artwork.isFramed && <div><span>Frame:</span> <span>{artwork.frameDetails || 'Included'}</span></div>}
        <div><span>Availability:</span> <span>{artwork.stock > 0 ? `${artwork.stock} in stock` : 'Sold Out'}</span></div>
      </div>

      {/* Tags */}
      {artwork.tags?.length > 0 && (
        <div>
          {artwork.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      )}

      {/* Actions */}
      {artwork.stock > 0 ? (
        <div>
          <div>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(Math.min(artwork.stock, quantity + 1))}>+</button>
          </div>
          <button onClick={handleAddToCart}><HiShoppingCart /> Add to Cart</button>
          <button onClick={handleBuyNow}>Buy Now</button>
        </div>
      ) : (
        <button disabled>Sold Out</button>
      )}

      <div>
        {isAuthenticated && (
          <button onClick={() => dispatch(toggleWishlistItem(artwork._id))} data-wishlisted={isWishlisted}>
            <HiHeart /> {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
          </button>
        )}
        <button onClick={() => navigator.clipboard.writeText(window.location.href)}>
          <HiShare /> Share
        </button>
      </div>
    </div>
  );
}