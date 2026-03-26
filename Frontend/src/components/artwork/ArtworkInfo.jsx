import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiHeart,
  HiShoppingCart,
  HiShare,
  HiCheck,
  HiMinus,
  HiPlus,
} from 'react-icons/hi';
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
  const [copied, setCopied] = useState(false);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) add(artwork);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const details = [
    { label: 'Medium', value: artwork.medium },
    { label: 'Style', value: artwork.style },
    {
      label: 'Dimensions',
      value: `${artwork.dimensions?.width}" × ${artwork.dimensions?.height}" (${artwork.dimensions?.unit})`,
    },
    artwork.isFramed && {
      label: 'Frame',
      value: artwork.frameDetails || 'Included',
    },
    {
      label: 'Availability',
      value: artwork.stock > 0 ? `${artwork.stock} in stock` : 'Sold Out',
      highlight: artwork.stock > 0,
    },
  ].filter(Boolean);

  return (
    <div className="space-y-6 lg:space-y-7">
      {/* ---- Badges ---- */}
      <div className="flex flex-wrap items-center gap-2">
        {artwork.category?.name && (
          <Badge>{artwork.category.name}</Badge>
        )}
        {artwork.isFeatured && <Badge variant="featured">Featured</Badge>}
        {artwork.stock === 0 && <Badge variant="soldout">Sold Out</Badge>}
      </div>

      {/* ---- Title ---- */}
      <h1
        className="
          text-2xl sm:text-3xl lg:text-4xl
          font-black text-ink tracking-tight leading-tight
        "
      >
        {artwork.title}
      </h1>

      {/* ---- Artist ---- */}
      {artwork.artist && (
        <p className="text-sm text-mist">
          by{' '}
          <span className="font-semibold text-charcoal hover:text-rust transition-colors duration-300 cursor-pointer">
            {artwork.artist.firstName} {artwork.artist.lastName}
          </span>
        </p>
      )}

      {/* ---- Rating ---- */}
      {artwork.ratings?.average > 0 && (
        <div className="flex items-center gap-3">
          <Rating
            value={artwork.ratings.average}
            count={artwork.ratings.count}
          />
          <span className="text-xs text-mist">
            {artwork.ratings.average.toFixed(1)} out of 5
          </span>
        </div>
      )}

      {/* ---- Price ---- */}
      <div
        className="
          py-4 px-5 rounded-2xl
          bg-cream/40 border border-cream
        "
      >
        <PriceDisplay
          price={artwork.price}
          comparePrice={artwork.comparePrice}
          size="large"
        />
      </div>

      {/* ---- Description ---- */}
      {artwork.description && (
        <div>
          <p className="text-sm text-charcoal/80 leading-relaxed">
            {artwork.description}
          </p>
        </div>
      )}

      {/* ---- Details Grid ---- */}
      <div
        className="
          rounded-2xl border border-cream
          overflow-hidden
          divide-y divide-cream
        "
      >
        {details.map((detail, i) => (
          <div
            key={i}
            className="
              flex items-center justify-between
              px-4 sm:px-5 py-3
              text-sm
              hover:bg-cream/30
              transition-colors duration-200
            "
          >
            <span className="text-mist font-medium">{detail.label}</span>
            <span
              className={`
                font-semibold text-right
                ${
                  detail.highlight
                    ? 'text-sage'
                    : detail.value === 'Sold Out'
                      ? 'text-rust'
                      : 'text-ink'
                }
              `}
            >
              {detail.value}
            </span>
          </div>
        ))}
      </div>

      {/* ---- Tags ---- */}
      {artwork.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {artwork.tags.map((tag) => (
            <span
              key={tag}
              className="
                px-3 py-1 rounded-lg
                bg-cream/60 border border-cream
                text-xs font-medium text-charcoal
                hover:border-mist hover:bg-cream
                transition-all duration-300 cursor-default
              "
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* ---- Divider ---- */}
      <div className="h-px bg-cream" />

      {/* ---- Cart Actions ---- */}
      {artwork.stock > 0 ? (
        <div className="space-y-4">
          {/* Quantity & Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Quantity Selector */}
            <div
              className="
                inline-flex items-center
                rounded-xl border border-cream
                overflow-hidden
                shrink-0
              "
            >
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="
                  w-10 h-11
                  flex items-center justify-center
                  text-charcoal hover:text-ink hover:bg-cream
                  transition-all duration-300 cursor-pointer
                  active:scale-90
                  disabled:opacity-30 disabled:cursor-not-allowed
                "
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <HiMinus className="w-3.5 h-3.5" />
              </button>
              <span
                className="
                  w-12 h-11
                  flex items-center justify-center
                  text-sm font-bold text-ink
                  border-x border-cream
                  bg-cream/20
                "
              >
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity(Math.min(artwork.stock, quantity + 1))
                }
                className="
                  w-10 h-11
                  flex items-center justify-center
                  text-charcoal hover:text-ink hover:bg-cream
                  transition-all duration-300 cursor-pointer
                  active:scale-90
                  disabled:opacity-30 disabled:cursor-not-allowed
                "
                disabled={quantity >= artwork.stock}
                aria-label="Increase quantity"
              >
                <HiPlus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="
                group flex-1
                inline-flex items-center justify-center gap-2
                px-6 py-3 rounded-xl
                bg-ink text-paper text-sm font-semibold
                hover:bg-charcoal
                transition-all duration-300 cursor-pointer
                active:scale-[0.98]
                shadow-md shadow-ink/10
              "
            >
              <HiShoppingCart
                className="
                  w-4 h-4
                  group-hover:scale-110
                  transition-transform duration-300
                "
              />
              Add to Cart
            </button>
          </div>

          {/* Buy Now */}
          <button
            onClick={handleBuyNow}
            className="
              w-full
              inline-flex items-center justify-center
              px-6 py-3 rounded-xl
              bg-rust text-paper text-sm font-semibold
              hover:bg-rust/90
              transition-all duration-300 cursor-pointer
              active:scale-[0.98]
              shadow-lg shadow-rust/20
            "
          >
            Buy Now
          </button>
        </div>
      ) : (
        <button
          disabled
          className="
            w-full py-3 rounded-xl
            bg-mist/20 text-mist
            text-sm font-semibold
            cursor-not-allowed
          "
        >
          Sold Out
        </button>
      )}

      {/* ---- Secondary Actions ---- */}
      <div className="flex items-center gap-3">
        {isAuthenticated && (
          <button
            onClick={() => dispatch(toggleWishlistItem(artwork._id))}
            className={`
              group flex-1
              inline-flex items-center justify-center gap-2
              px-4 py-2.5 rounded-xl
              border text-sm font-semibold
              transition-all duration-300 cursor-pointer
              active:scale-[0.98]
              ${
                isWishlisted
                  ? 'bg-rust/10 border-rust/20 text-rust hover:bg-rust/15'
                  : 'border-cream text-charcoal hover:border-mist hover:text-rust'
              }
            `}
          >
            <HiHeart
              className={`
                w-4 h-4
                group-hover:scale-110
                transition-transform duration-300
                ${isWishlisted ? 'fill-current' : ''}
              `}
            />
            {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
          </button>
        )}

        <button
          onClick={handleShare}
          className="
            group
            inline-flex items-center justify-center gap-2
            px-4 py-2.5 rounded-xl
            border border-cream text-sm font-semibold text-charcoal
            hover:border-mist hover:text-ink
            transition-all duration-300 cursor-pointer
            active:scale-[0.98]
          "
        >
          {copied ? (
            <>
              <HiCheck className="w-4 h-4 text-sage" />
              <span className="text-sage">Copied!</span>
            </>
          ) : (
            <>
              <HiShare
                className="
                  w-4 h-4
                  group-hover:scale-110
                  transition-transform duration-300
                "
              />
              Share
            </>
          )}
        </button>
      </div>
    </div>
  );
}