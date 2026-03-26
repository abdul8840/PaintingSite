import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist } from '../store/slices/wishlistSlice';
import ArtworkGrid from '../components/artwork/ArtworkGrid';
import EmptyState from '../components/common/EmptyState';
import Breadcrumb from '../components/common/Breadcrumb';
import { HiHeart } from 'react-icons/hi';

export default function WishlistPage() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.wishlist);

  useEffect(() => { dispatch(fetchWishlist()); }, [dispatch]);

  return (
    <div>
      <Breadcrumb items={[{ label: 'Wishlist' }]} />
      <h1>My Wishlist ({items.length})</h1>
      {items.length === 0 ? (
        <EmptyState icon={HiHeart} title="Your wishlist is empty" description="Save artworks you love for later." actionLabel="Browse Gallery" actionHref="/shop" />
      ) : (
        <ArtworkGrid artworks={items} />
      )}
    </div>
  );
}