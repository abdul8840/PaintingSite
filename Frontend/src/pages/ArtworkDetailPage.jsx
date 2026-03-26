import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArtworkBySlug, fetchRelatedArtworks, clearCurrentArtwork } from '../store/slices/artworkSlice';
import ArtworkGallery from '../components/artwork/ArtworkGallery';
import ArtworkInfo from '../components/artwork/ArtworkInfo';
import ArtworkGrid from '../components/artwork/ArtworkGrid';
import ReviewList from '../components/review/ReviewList';
import Breadcrumb from '../components/common/Breadcrumb';
import Loader from '../components/common/Loader';

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

  if (detailLoading) return <Loader text="Loading artwork..." />;
  if (!artwork) return <div><p>Artwork not found</p></div>;

  return (
    <div>
      <Breadcrumb items={[
        { label: 'Shop', href: '/shop' },
        { label: artwork.category?.name, href: `/category/${artwork.category?.slug}` },
        { label: artwork.title },
      ]} />

      <div>
        <ArtworkGallery images={artwork.images} />
        <ArtworkInfo artwork={artwork} />
      </div>

      {/* Artist Info */}
      {artwork.artist && (
        <section>
          <h2>About the Artist</h2>
          <div>
            {artwork.artist.avatar?.url && <img src={artwork.artist.avatar.url} alt="" />}
            <div>
              <h3>{artwork.artist.firstName} {artwork.artist.lastName}</h3>
              {artwork.artist.artistBio && <p>{artwork.artist.artistBio}</p>}
            </div>
          </div>
        </section>
      )}

      <ReviewList artworkId={artwork._id} />

      {related.length > 0 && (
        <section>
          <h2>Related Artworks</h2>
          <ArtworkGrid artworks={related} />
        </section>
      )}
    </div>
  );
}