import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist } from '../store/slices/wishlistSlice';
import ArtworkGrid from '../components/artwork/ArtworkGrid';
import EmptyState  from '../components/common/EmptyState';
import Breadcrumb  from '../components/common/Breadcrumb';
import { Link } from 'react-router-dom';
import {
  HiHeart, HiSparkles, HiShoppingBag, HiArrowRight,
} from 'react-icons/hi2';

export default function WishlistPage() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.wishlist);

  useEffect(() => { dispatch(fetchWishlist()); }, [dispatch]);

  return (
    <div className="min-h-screen bg-[var(--color-paper)]">

      {/* Sticky breadcrumb bar */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-[var(--color-cream)]
                      sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={[{ label: 'Wishlist' }]} />
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full
                        bg-[var(--color-rust)]/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full
                        bg-[var(--color-sage)]/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between
                        gap-4 mb-8 animate-fade-in-down">
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br
                            from-[var(--color-rust)] to-[var(--color-gold)]
                            flex items-center justify-center shadow-lg
                            shadow-[var(--color-rust)]/25 flex-shrink-0">
              <HiHeart className="w-7 h-7 text-white" />
              {items.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1
                                 rounded-full bg-[var(--color-ink)] text-[var(--color-paper)]
                                 text-xs font-bold flex items-center justify-center
                                 border-2 border-[var(--color-paper)]">
                  {items.length}
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <HiSparkles className="w-3.5 h-3.5 text-[var(--color-gold)]" />
                <span className="text-xs font-semibold text-[var(--color-gold)]
                                 uppercase tracking-widest">
                  Saved Collection
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-ink)]
                             tracking-tight">
                My Wishlist
                {items.length > 0 && (
                  <span className="ml-2 text-lg font-normal
                                   text-[var(--color-mist)]">
                    ({items.length})
                  </span>
                )}
              </h1>
            </div>
          </div>

          {/* CTA — only when items exist */}
          {items.length > 0 && (
            <Link
              to="/shop"
              className="cursor-pointer self-start sm:self-auto flex items-center gap-2
                         px-5 py-2.5 bg-[var(--color-ink)] text-[var(--color-paper)]
                         text-sm font-semibold rounded-xl shadow-md
                         shadow-[var(--color-ink)]/20 hover:bg-[var(--color-charcoal)]
                         hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200
                         group animate-fade-in-up stagger-2"
            >
              <HiShoppingBag className="w-4 h-4" />
              Browse More
              <HiArrowRight className="w-4 h-4 transition-transform duration-200
                                       group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        {/* Stats bar — when items exist */}
        {items.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-7 animate-fade-in-up stagger-2">
            {[
              { label: 'Saved Artworks', value: items.length },
              {
                label: 'Artists',
                value: new Set(items.map(i => i.artist?._id)).size,
              },
              {
                label: 'Est. Total',
                value: `$${items.reduce((s, i) => s + (i.price || 0), 0).toFixed(0)}`,
              },
            ].map(({ label, value }) => (
              <div key={label}
                className="flex items-center gap-3 px-4 py-2.5 bg-white/80 border
                           border-[var(--color-cream)] rounded-xl shadow-sm">
                <span className="text-sm font-bold text-[var(--color-ink)]">{value}</span>
                <span className="text-xs text-[var(--color-mist)]">{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        {loading ? (
          /* Skeleton grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
                          xl:grid-cols-4 gap-5 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}
                className="bg-white/60 border border-[var(--color-cream)]
                           rounded-2xl overflow-hidden animate-shimmer"
                style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="aspect-square bg-[var(--color-cream)]" />
                <div className="p-4 space-y-2.5">
                  <div className="h-4 bg-[var(--color-cream)] rounded-lg w-3/4" />
                  <div className="h-3 bg-[var(--color-cream)] rounded-lg w-1/2" />
                  <div className="h-5 bg-[var(--color-cream)] rounded-lg w-1/3 mt-1" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (

          /* Empty state */
          <div className="animate-fade-in-up">
            <div className="max-w-md mx-auto text-center py-16 sm:py-24">
              <div className="relative inline-flex items-center justify-center
                              w-24 h-24 mb-6">
                <span className="absolute inset-0 rounded-full
                                 bg-[var(--color-rust)]/10 animate-ping" />
                <div className="relative w-20 h-20 rounded-full
                                bg-gradient-to-br from-[var(--color-rust)]/15
                                to-[var(--color-gold)]/10 border-2
                                border-[var(--color-rust)]/20 flex items-center
                                justify-center">
                  <HiHeart className="w-9 h-9 text-[var(--color-rust)]/50" />
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-ink)] mb-3">
                Your wishlist is empty
              </h2>
              <p className="text-[var(--color-charcoal)]/60 text-sm sm:text-base
                            leading-relaxed mb-8">
                Save artworks you love for later. Browse our gallery and tap the
                heart icon to add them here.
              </p>

              <Link
                to="/shop"
                className="cursor-pointer inline-flex items-center gap-2 px-7 py-3.5
                           bg-[var(--color-ink)] text-[var(--color-paper)] text-sm
                           font-semibold rounded-2xl shadow-lg shadow-[var(--color-ink)]/20
                           hover:bg-[var(--color-charcoal)] hover:-translate-y-0.5
                           hover:shadow-xl transition-all duration-200 group"
              >
                <HiShoppingBag className="w-4 h-4" />
                Browse Gallery
                <HiArrowRight className="w-4 h-4 transition-transform duration-200
                                         group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in-up stagger-3">
            <ArtworkGrid artworks={items} />
          </div>
        )}
      </div>
    </div>
  );
}