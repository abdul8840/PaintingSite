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
    e.stopPropagation();
    if (isAuthenticated) dispatch(toggleWishlistItem(artwork._id));
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (artwork.stock > 0) add(artwork);
  };

  const discountPercent =
    artwork.comparePrice > artwork.price
      ? Math.round(
          ((artwork.comparePrice - artwork.price) / artwork.comparePrice) * 100
        )
      : 0;

  return (
    <Link
      to={`/artwork/${artwork.slug}`}
      className="group block cursor-pointer"
    >
      <div
        className="
          relative bg-paper rounded-2xl overflow-hidden
          border border-cream
          hover-lift
          transition-all duration-500
          hover:border-mist/50
        "
      >
        {/* ---- Image Container ---- */}
        <div className="relative aspect-[3/4] overflow-hidden bg-cream">
          <img
            src={artwork.images?.[0]?.url || '/placeholder.jpg'}
            alt={artwork.title}
            loading="lazy"
            className="
              w-full h-full object-cover
              group-hover:scale-110
              transition-transform duration-700 ease-out
            "
          />

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <span
              className="
                absolute top-3 left-3
                px-2.5 py-1 rounded-lg
                bg-rust text-paper
                text-[10px] font-bold uppercase tracking-wider
                shadow-lg shadow-rust/25
                animate-scale-in
              "
            >
              {discountPercent}% OFF
            </span>
          )}

          {/* Sold Out Overlay */}
          {artwork.stock === 0 && (
            <div
              className="
                absolute inset-0
                bg-ink/40 glass
                flex items-center justify-center
              "
            >
              <span
                className="
                  px-4 py-2 rounded-xl
                  bg-paper/90 text-ink
                  text-xs font-bold uppercase tracking-widest
                "
              >
                Sold Out
              </span>
            </div>
          )}

          {/* Hover Action Buttons */}
          <div
            className="
              absolute top-3 right-3
              flex flex-col gap-2
              opacity-0 translate-x-3
              group-hover:opacity-100 group-hover:translate-x-0
              transition-all duration-400 ease-out
            "
          >
            {isAuthenticated && (
              <button
                onClick={handleWishlist}
                className={`
                  w-9 h-9 rounded-xl
                  flex items-center justify-center
                  shadow-lg shadow-ink/10
                  transition-all duration-300 cursor-pointer
                  active:scale-90
                  ${
                    isWishlisted
                      ? 'bg-rust text-paper shadow-rust/25'
                      : 'bg-paper/90 glass text-charcoal hover:bg-rust hover:text-paper'
                  }
                `}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <HiHeart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            )}
            {artwork.stock > 0 && (
              <button
                onClick={handleAddToCart}
                className="
                  w-9 h-9 rounded-xl
                  bg-paper/90 glass
                  flex items-center justify-center
                  text-charcoal
                  hover:bg-ink hover:text-paper
                  shadow-lg shadow-ink/10
                  transition-all duration-300 cursor-pointer
                  active:scale-90
                "
                aria-label="Add to cart"
              >
                <HiShoppingCart className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Bottom Quick-Add Bar (mobile-friendly) */}
          {artwork.stock > 0 && (
            <div
              className="
                absolute bottom-0 left-0 right-0
                p-3
                opacity-0 translate-y-full
                group-hover:opacity-100 group-hover:translate-y-0
                transition-all duration-400 ease-out
                hidden sm:block
              "
            >
              <button
                onClick={handleAddToCart}
                className="
                  w-full py-2.5 rounded-xl
                  bg-ink/90 glass text-paper
                  text-xs font-semibold uppercase tracking-wider
                  hover:bg-ink
                  transition-all duration-300 cursor-pointer
                  active:scale-[0.98]
                "
              >
                Quick Add
              </button>
            </div>
          )}
        </div>

        {/* ---- Info ---- */}
        <div className="p-4">
          {/* Category */}
          {artwork.category?.name && (
            <p
              className="
                text-[10px] font-bold uppercase tracking-widest
                text-rust mb-1.5
              "
            >
              {artwork.category.name}
            </p>
          )}

          {/* Title */}
          <h3
            className="
              text-sm font-bold text-ink
              leading-snug
              group-hover:text-rust
              transition-colors duration-300
              line-clamp-1
            "
          >
            {artwork.title}
          </h3>

          {/* Artist */}
          {artwork.artist && (
            <p className="text-xs text-mist mt-1 line-clamp-1">
              by {artwork.artist.firstName} {artwork.artist.lastName}
            </p>
          )}

          {/* Rating */}
          {artwork.ratings?.average > 0 && (
            <div className="mt-2">
              <Rating
                value={artwork.ratings.average}
                count={artwork.ratings.count}
                size="small"
              />
            </div>
          )}

          {/* Price */}
          <div className="mt-2.5">
            <PriceDisplay
              price={artwork.price}
              comparePrice={artwork.comparePrice}
              size="small"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}