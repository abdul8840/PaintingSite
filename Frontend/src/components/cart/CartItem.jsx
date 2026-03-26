import { Link } from 'react-router-dom';
import { HiTrash, HiPlus, HiMinus } from 'react-icons/hi';
import { useCart } from '../../hooks/useCart';

export default function CartItem({ item }) {
  const { update, remove } = useCart();

  return (
    <div
      className="
        group relative
        flex flex-col sm:flex-row items-start gap-4
        p-4 sm:p-5
        bg-paper rounded-2xl
        border border-cream
        hover:border-mist/40
        transition-all duration-300
      "
    >
      {/* ---- Image ---- */}
      <Link
        to={`/artwork/${item.slug}`}
        className="
          shrink-0
          w-full sm:w-24 md:w-28
          aspect-square sm:aspect-square
          rounded-xl overflow-hidden
          bg-cream
          cursor-pointer
          group/img
        "
      >
        <img
          src={item.image}
          alt={item.title}
          className="
            w-full h-full object-cover
            group-hover/img:scale-110
            transition-transform duration-500
          "
        />
      </Link>

      {/* ---- Info ---- */}
      <div className="flex-1 min-w-0 w-full">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Link
              to={`/artwork/${item.slug}`}
              className="cursor-pointer"
            >
              <h3
                className="
                  text-sm sm:text-base font-bold text-ink
                  hover:text-rust
                  transition-colors duration-300
                  line-clamp-1
                "
              >
                {item.title}
              </h3>
            </Link>

            {item.artist && (
              <p className="text-xs text-mist mt-0.5 line-clamp-1">
                by {item.artist.firstName} {item.artist.lastName}
              </p>
            )}

            {/* Unit Price */}
            <p className="text-sm font-semibold text-charcoal mt-1.5">
              ${item.price.toFixed(2)}
              <span className="text-xs text-mist font-normal ml-1">each</span>
            </p>
          </div>

          {/* Remove Button - Desktop */}
          <button
            onClick={() => remove(item._id)}
            className="
              hidden sm:flex
              p-2 rounded-xl
              text-mist hover:text-rust hover:bg-rust/5
              opacity-0 group-hover:opacity-100
              transition-all duration-300 cursor-pointer
              active:scale-90
            "
            aria-label="Remove item"
          >
            <HiTrash className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Row: Quantity + Total + Remove(mobile) */}
        <div className="flex items-center justify-between mt-3 sm:mt-4 gap-3">
          {/* Quantity Selector */}
          <div
            className="
              inline-flex items-center
              rounded-xl border border-cream
              overflow-hidden
            "
          >
            <button
              onClick={() => update(item._id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="
                w-8 h-8 sm:w-9 sm:h-9
                flex items-center justify-center
                text-charcoal hover:text-ink hover:bg-cream
                disabled:opacity-30 disabled:cursor-not-allowed
                disabled:hover:bg-transparent
                transition-all duration-300 cursor-pointer
                active:scale-90
              "
              aria-label="Decrease quantity"
            >
              <HiMinus className="w-3 h-3" />
            </button>
            <span
              className="
                w-10 h-8 sm:w-11 sm:h-9
                flex items-center justify-center
                text-xs sm:text-sm font-bold text-ink
                border-x border-cream
                bg-cream/20
                select-none
              "
            >
              {item.quantity}
            </span>
            <button
              onClick={() => update(item._id, item.quantity + 1)}
              disabled={item.quantity >= item.stock}
              className="
                w-8 h-8 sm:w-9 sm:h-9
                flex items-center justify-center
                text-charcoal hover:text-ink hover:bg-cream
                disabled:opacity-30 disabled:cursor-not-allowed
                disabled:hover:bg-transparent
                transition-all duration-300 cursor-pointer
                active:scale-90
              "
              aria-label="Increase quantity"
            >
              <HiPlus className="w-3 h-3" />
            </button>
          </div>

          {/* Line Total */}
          <p className="text-base sm:text-lg font-bold text-ink tracking-tight">
            ${(item.price * item.quantity).toFixed(2)}
          </p>

          {/* Remove Button - Mobile */}
          <button
            onClick={() => remove(item._id)}
            className="
              sm:hidden
              p-2 rounded-xl
              text-mist hover:text-rust hover:bg-rust/5
              transition-all duration-300 cursor-pointer
              active:scale-90
            "
            aria-label="Remove item"
          >
            <HiTrash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}