import { useState } from 'react';
import { HiZoomIn } from 'react-icons/hi';

export default function ImageZoom({ src, alt }) {
  const [zoomed, setZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPosition({ x, y });
  };

  return (
    <div
      className="
        group relative
        w-full overflow-hidden
        rounded-2xl
        bg-cream
        cursor-zoom-in
      "
      onMouseEnter={() => setZoomed(true)}
      onMouseLeave={() => setZoomed(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Main Image */}
      <img
        src={src}
        alt={alt}
        className={`
          w-full h-full object-cover
          transition-all duration-500
          ${zoomed ? 'opacity-0' : 'opacity-100'}
        `}
      />

      {/* Zoomed View */}
      {zoomed && (
        <div
          className="
            absolute inset-0
            bg-no-repeat
            transition-none
          "
          style={{
            backgroundImage: `url(${src})`,
            backgroundPosition: `${position.x}% ${position.y}%`,
            backgroundSize: '250%',
          }}
        />
      )}

      {/* Zoom Hint Icon */}
      <div
        className={`
          absolute bottom-3 right-3
          w-9 h-9 rounded-xl
          bg-ink/60 glass
          flex items-center justify-center
          transition-all duration-300
          pointer-events-none
          ${zoomed ? 'opacity-0 scale-75' : 'opacity-0 group-hover:opacity-100 scale-100'}
        `}
      >
        <HiZoomIn className="w-4 h-4 text-paper" />
      </div>
    </div>
  );
}