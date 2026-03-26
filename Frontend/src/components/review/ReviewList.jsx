import { useState, useEffect } from 'react';
import reviewApi from '../../api/reviewApi';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import { useAuth } from '../../hooks/useAuth';
import Pagination from '../common/Pagination';

export default function ReviewList({ artworkId }) {
  const { isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await reviewApi.getByArtwork(artworkId, `page=${page}&sort=${sort}`);
      setReviews(res.reviews);
      setPagination({ page: res.pagination.page, limit: res.pagination.limit, total: res.total, pages: res.pagination.pages });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, [artworkId, page, sort]);

  const handleReviewAdded = (review) => {
    setReviews([review, ...reviews]);
  };

  return (
    <div>
      <div>
        <h2>Reviews</h2>
        <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
          <option value="helpful">Most Helpful</option>
        </select>
      </div>

      {isAuthenticated && <ReviewForm artworkId={artworkId} onReviewAdded={handleReviewAdded} />}

      {loading ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p>No reviews yet. Be the first!</p>
      ) : (
        <div>
          {reviews.map((review) => <ReviewCard key={review._id} review={review} />)}
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={setPage} />
    </div>
  );
}