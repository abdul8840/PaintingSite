import { Link } from 'react-router-dom';
import { HiPhotograph, HiTrendingUp, HiShoppingCart, HiArrowRight } from 'react-icons/hi';

export default function TopArtworks({ artworks = [] }) {
  if (!artworks.length) {
    return (
      <div className="
        bg-bg-primary
        rounded-xl
        border border-border-light
        p-6 sm:p-8
      ">
        <div className="flex items-center gap-3 mb-6">
          <div className="
            w-10 h-10
            bg-amber-100
            rounded-lg
            flex items-center justify-center
          ">
            <HiTrendingUp className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary">Top Selling Artworks</h3>
        </div>
        
        <div className="
          flex flex-col items-center justify-center
          py-12
          text-center
        ">
          <div className="
            w-16 h-16
            bg-bg-tertiary
            rounded-full
            flex items-center justify-center
            mb-4
          ">
            <HiPhotograph className="w-8 h-8 text-text-muted" />
          </div>
          <p className="text-text-secondary font-medium">No sales data yet</p>
          <p className="text-sm text-text-muted mt-1">Top sellers will appear here once artworks start selling</p>
        </div>
      </div>
    );
  }

  // Medal colors for top 3
  const medalColors = [
    'bg-amber-400 text-amber-900', // Gold
    'bg-gray-300 text-gray-700',   // Silver
    'bg-amber-600 text-amber-100', // Bronze
  ];

  return (
    <div className="
      bg-bg-primary
      rounded-xl
      border border-border-light
      overflow-hidden
    ">
      {/* Header */}
      <div className="
        flex flex-col sm:flex-row sm:items-center justify-between gap-3
        px-4 sm:px-6 py-4
        border-b border-border-light
        bg-bg-secondary
      ">
        <div className="flex items-center gap-3">
          <div className="
            w-10 h-10
            bg-amber-100
            rounded-lg
            flex items-center justify-center
          ">
            <HiTrendingUp className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Top Selling Artworks</h3>
            <p className="text-sm text-text-muted">Best performers this month</p>
          </div>
        </div>
        <Link 
          to="/artworks"
          className="
            inline-flex items-center gap-2
            px-4 py-2
            text-sm font-medium
            text-amber-600 hover:text-amber-700
            bg-amber-50 hover:bg-amber-100
            rounded-lg
            transition-colors duration-200
            cursor-pointer
          "
        >
          View All
          <HiArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Artwork List */}
      <div className="divide-y divide-border-light">
        {artworks.map((art, i) => (
          <div 
            key={art._id}
            className="
              flex items-center gap-3 sm:gap-4
              p-4 sm:px-6
              hover:bg-bg-secondary
              transition-colors duration-150
              group
            "
          >
            {/* Rank Badge */}
            <div className={`
              flex-shrink-0
              w-8 h-8
              rounded-full
              flex items-center justify-center
              text-sm font-bold
              ${i < 3 ? medalColors[i] : 'bg-bg-tertiary text-text-secondary'}
            `}>
              {i + 1}
            </div>

            {/* Artwork Image */}
            <div className="
              flex-shrink-0
              w-14 h-14 sm:w-16 sm:h-16
              rounded-lg
              overflow-hidden
              border border-border-light
              group-hover:border-theme-secondary
              transition-colors duration-200
            ">
              {art.images?.[0]?.url ? (
                <img 
                  src={art.images[0].url} 
                  alt={art.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="
                  w-full h-full
                  bg-bg-tertiary
                  flex items-center justify-center
                ">
                  <HiPhotograph className="w-6 h-6 text-text-muted" />
                </div>
              )}
            </div>

            {/* Artwork Info */}
            <div className="flex-1 min-w-0">
              <Link 
                to={`/artworks/${art._id}`}
                className="
                  text-sm sm:text-base font-medium
                  text-text-primary
                  hover:text-theme-primary
                  transition-colors duration-200
                  cursor-pointer
                  line-clamp-1
                "
              >
                {art.title}
              </Link>
              <p className="text-sm text-text-secondary mt-0.5">
                ${art.price?.toLocaleString()}
              </p>
            </div>

            {/* Sales Badge */}
            <div className="
              flex-shrink-0
              flex items-center gap-1.5
              px-3 py-1.5
              bg-success/10
              text-success
              text-sm font-semibold
              rounded-full
            ">
              <HiShoppingCart className="w-4 h-4" />
              <span>{art.sold}</span>
              <span className="hidden sm:inline text-xs font-normal opacity-70">sold</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Summary */}
      <div className="
        px-4 sm:px-6 py-3
        bg-bg-secondary
        border-t border-border-light
      ">
        <p className="text-sm text-text-muted text-center">
          Total sold: <span className="font-semibold text-text-primary">
            {artworks.reduce((sum, art) => sum + (art.sold || 0), 0)}
          </span> artworks
        </p>
      </div>
    </div>
  );
}