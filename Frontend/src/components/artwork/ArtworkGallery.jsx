import { useState } from 'react';
import { HiChevronLeft, HiChevronRight, HiPhotograph } from 'react-icons/hi';
import ImageZoom from '../common/ImageZoom';

export default function ArtworkGallery({ images = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div
        className="
          aspect-square rounded-2xl bg-cream
          flex flex-col items-center justify-center gap-3
        "
      >
        <HiPhotograph className="w-12 h-12 text-mist" />
        <p className="text-sm text-mist font-medium">No images available</p>
      </div>
    );
  }

  const goTo = (index) => {
    if (index < 0) setActiveIndex(images.length - 1);
    else if (index >= images.length) setActiveIndex(0);
    else setActiveIndex(index);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Main Image */}
      <div className="relative group">
        <div
          className="
            aspect-[4/5] sm:aspect-[3/4] lg:aspect-square
            rounded-2xl overflow-hidden
            border border-cream
            bg-cream
          "
        >
          <ImageZoom
            src={images[activeIndex]?.url}
            alt={images[activeIndex]?.alt || 'Artwork'}
          />
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => goTo(activeIndex - 1)}
              className="
                absolute left-3 top-1/2 -translate-y-1/2
                w-10 h-10 rounded-xl
                bg-paper/80 glass
                flex items-center justify-center
                text-charcoal hover:text-ink hover:bg-paper
                shadow-lg shadow-ink/10
                opacity-0 -translate-x-2
                group-hover:opacity-100 group-hover:translate-x-0
                transition-all duration-300 cursor-pointer
                active:scale-90
              "
              aria-label="Previous image"
            >
              <HiChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => goTo(activeIndex + 1)}
              className="
                absolute right-3 top-1/2 -translate-y-1/2
                w-10 h-10 rounded-xl
                bg-paper/80 glass
                flex items-center justify-center
                text-charcoal hover:text-ink hover:bg-paper
                shadow-lg shadow-ink/10
                opacity-0 translate-x-2
                group-hover:opacity-100 group-hover:translate-x-0
                transition-all duration-300 cursor-pointer
                active:scale-90
              "
              aria-label="Next image"
            >
              <HiChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div
            className="
              absolute bottom-3 left-1/2 -translate-x-1/2
              px-3 py-1.5 rounded-xl
              bg-ink/60 glass
              text-[11px] font-semibold text-paper
              opacity-0 group-hover:opacity-100
              transition-all duration-300
            "
          >
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div
          className="
            flex gap-2 sm:gap-2.5
            overflow-x-auto
            pb-1
            scrollbar-none
          "
        >
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`
                relative shrink-0
                w-16 h-16 sm:w-20 sm:h-20
                rounded-xl overflow-hidden
                border-2
                transition-all duration-300 cursor-pointer
                active:scale-95
                ${
                  i === activeIndex
                    ? 'border-rust shadow-md shadow-rust/15 ring-1 ring-rust/20'
                    : 'border-cream hover:border-mist opacity-60 hover:opacity-100'
                }
              `}
              aria-label={`View image ${i + 1}`}
            >
              <img
                src={img.url}
                alt={img.alt || `View ${i + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Active indicator dot */}
              {i === activeIndex && (
                <div
                  className="
                    absolute bottom-1 left-1/2 -translate-x-1/2
                    w-1 h-1 rounded-full bg-rust
                  "
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}