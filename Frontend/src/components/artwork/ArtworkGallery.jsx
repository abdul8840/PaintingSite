import { useState } from 'react';
import ImageZoom from '../common/ImageZoom';

export default function ArtworkGallery({ images = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) return <div>No images available</div>;

  return (
    <div>
      <div>
        <ImageZoom src={images[activeIndex]?.url} alt={images[activeIndex]?.alt || 'Artwork'} />
      </div>
      {images.length > 1 && (
        <div>
          {images.map((img, i) => (
            <button key={i} onClick={() => setActiveIndex(i)} data-active={i === activeIndex}>
              <img src={img.url} alt={img.alt || `View ${i + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}