import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArtworkBySlug, fetchRelatedArtworks, clearCurrentArtwork } from '../store/slices/artworkSlice';
import ArtworkGallery from '../components/artwork/ArtworkGallery';
import ArtworkInfo from '../components/artwork/ArtworkInfo';
import ArtworkGrid from '../components/artwork/ArtworkGrid';
import ReviewList from '../components/review/ReviewList';
import Breadcrumb from '../components/common/Breadcrumb';
import Loader from '../components/common/Loader';
import { HiArrowLeft, HiExclamationCircle } from 'react-icons/hi';

export default function ArtworkDetailPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { current: artwork, related, detailLoading } = useSelector((state) => state.artworks);

  useEffect(() => {
    dispatch(fetchArtworkBySlug(slug));
    return () => dispatch(clearCurrentArtwork());
  }, [dispatch, slug]);

  useEffect(() => {
    if (artwork?._id) dispatch(fetchRelatedArtworks(artwork._id));
  }, [dispatch, artwork?._id]);

  if (detailLoading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <Loader text="Loading artwork..." />
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center px-4">
        <div className="text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center mx-auto mb-6">
            <HiExclamationCircle className="w-10 h-10 text-mist" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-3">Artwork Not Found</h1>
          <p className="text-charcoal/60 mb-6">The artwork you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-white rounded-xl font-medium hover:bg-charcoal transition-all duration-300 cursor-pointer"
          >
            <HiArrowLeft className="w-5 h-5" />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={[
            { label: 'Shop', href: '/shop' },
            { label: artwork.category?.name, href: `/category/${artwork.category?.slug}` },
            { label: artwork.title },
          ]} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 mb-12 sm:mb-16 lg:mb-20">
          {/* Gallery */}
          <div className="animate-fade-in-up">
            <ArtworkGallery images={artwork.images} />
          </div>
          
          {/* Info */}
          <div className="animate-fade-in-up stagger-2">
            <ArtworkInfo artwork={artwork} />
          </div>
        </div>

        {/* Artist Info Section */}
        {artwork.artist && (
          <section className="mb-12 sm:mb-16 lg:mb-20 animate-fade-in-up">
            <div className="bg-white rounded-2xl border border-cream p-6 sm:p-8 lg:p-10">
              <h2 className="text-xl sm:text-2xl font-bold text-ink mb-6 flex items-center gap-3">
                <span className="w-1.5 h-6 sm:h-8 bg-sage rounded-full" />
                About the Artist
              </h2>
              
              <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6 lg:gap-8">
                {/* Avatar */}
                {artwork.artist.avatar?.url ? (
                  <img 
                    src={artwork.artist.avatar.url} 
                    alt={`${artwork.artist.firstName} ${artwork.artist.lastName}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-cream flex-shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-sage to-sage/70 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl sm:text-3xl font-bold text-white">
                      {artwork.artist.firstName?.[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
                
                {/* Info */}
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-ink mb-2">
                    {artwork.artist.firstName} {artwork.artist.lastName}
                  </h3>
                  {artwork.artist.artistBio && (
                    <p className="text-sm sm:text-base text-charcoal/70 leading-relaxed">
                      {artwork.artist.artistBio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Reviews Section */}
        <section className="mb-12 sm:mb-16 lg:mb-20">
          <ReviewList artworkId={artwork._id} />
        </section>

        {/* Related Artworks */}
        {related.length > 0 && (
          <section className="animate-fade-in-up">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-ink flex items-center gap-3">
                <span className="w-1.5 h-6 sm:h-8 bg-gold rounded-full" />
                Related Artworks
              </h2>
              <Link 
                to="/shop"
                className="text-sm sm:text-base text-charcoal/60 hover:text-ink transition-colors flex items-center gap-1 cursor-pointer"
              >
                View All
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <ArtworkGrid artworks={related} />
          </section>
        )}
      </div>
    </div>
  );
}