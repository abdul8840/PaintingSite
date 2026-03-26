import ArtworkCard from './ArtworkCard';
import { HiPhotograph } from 'react-icons/hi';

export default function ArtworkGrid({ artworks, loading }) {
  if (loading) {
    return (
      <div
        className="
          grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
          gap-4 sm:gap-5 lg:gap-6
        "
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="
              rounded-2xl overflow-hidden
              border border-cream
              bg-paper
            "
          >
            {/* Image skeleton */}
            <div className="aspect-[3/4] bg-cream animate-shimmer" />
            {/* Info skeleton */}
            <div className="p-4 space-y-2.5">
              <div className="w-16 h-2.5 rounded-full bg-cream animate-shimmer" />
              <div className="w-full h-3.5 rounded-full bg-cream animate-shimmer" />
              <div className="w-24 h-2.5 rounded-full bg-cream animate-shimmer" />
              <div className="flex gap-0.5 mt-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div
                    key={j}
                    className="w-3.5 h-3.5 rounded bg-cream animate-shimmer"
                  />
                ))}
              </div>
              <div className="w-20 h-4 rounded-full bg-cream animate-shimmer mt-1" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!artworks || artworks.length === 0) {
    return (
      <div
        className="
          flex flex-col items-center justify-center
          py-16 sm:py-24 px-4 text-center
          animate-fade-in-up
        "
        style={{ animationFillMode: 'forwards' }}
      >
        <div
          className="
            w-20 h-20 rounded-3xl bg-cream
            flex items-center justify-center mb-5
          "
        >
          <HiPhotograph className="w-9 h-9 text-mist" />
        </div>
        <p className="text-lg font-bold text-ink">No artworks found</p>
        <p className="text-sm text-mist mt-1.5 max-w-sm">
          Try adjusting your filters or search to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
        gap-4 sm:gap-5 lg:gap-6
      "
    >
      {artworks.map((artwork, i) => (
        <div
          key={artwork._id}
          className="animate-fade-in-up opacity-0"
          style={{
            animationDelay: `${i * 0.06}s`,
            animationFillMode: 'forwards',
          }}
        >
          <ArtworkCard artwork={artwork} />
        </div>
      ))}
    </div>
  );
}