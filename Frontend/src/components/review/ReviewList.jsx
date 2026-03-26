import { useState, useEffect } from 'react';
import reviewApi from '../../api/reviewApi';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import { useAuth } from '../../hooks/useAuth';
import Pagination from '../common/Pagination';
import { HiChatAlt2, HiSortDescending } from 'react-icons/hi';

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
    <div className="space-y-6 sm:space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-charcoal/10 to-charcoal/5 rounded-xl flex items-center justify-center">
            <HiChatAlt2 className="w-5 h-5 sm:w-6 sm:h-6 text-charcoal" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-ink">Customer Reviews</h2>
            <p className="text-sm text-charcoal/60">
              {pagination?.total || 0} review{pagination?.total !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <HiSortDescending className="w-4 h-4 sm:w-5 sm:h-5 text-charcoal/40" />
          </div>
          <select 
            value={sort} 
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="w-full sm:w-auto appearance-none pl-9 sm:pl-10 pr-10 py-2.5 sm:py-3 bg-white border border-cream rounded-xl text-ink text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage cursor-pointer transition-all duration-300"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-charcoal/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Review Form (for authenticated users) */}
      {isAuthenticated && (
        <div className="animate-fade-in-up stagger-1">
          <ReviewForm artworkId={artworkId} onReviewAdded={handleReviewAdded} />
        </div>
      )}

      {/* Reviews Content */}
      {loading ? (
        /* Loading Skeleton */
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-cream p-4 sm:p-6 animate-pulse">
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cream" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-cream rounded w-1/4" />
                  <div className="h-3 bg-cream rounded w-1/6" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-cream rounded w-3/4" />
                <div className="h-4 bg-cream rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        /* Empty State */
        <div className="text-center py-12 sm:py-16 bg-white rounded-xl border border-cream animate-fade-in">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-cream rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <HiChatAlt2 className="w-8 h-8 sm:w-10 sm:h-10 text-mist" />
          </div>
          <p className="text-charcoal/60 text-base sm:text-lg mb-2">No reviews yet</p>
          <p className="text-charcoal/40 text-sm">Be the first to share your thoughts!</p>
        </div>
      ) : (
        /* Reviews List */
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div 
              key={review._id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center pt-4 sm:pt-6 animate-fade-in-up">
          <Pagination pagination={pagination} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}