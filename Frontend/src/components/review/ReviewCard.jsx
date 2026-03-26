import Rating from '../common/Rating';
import { HiThumbUp, HiCheckCircle } from 'react-icons/hi';
import reviewApi from '../../api/reviewApi';
import { useState } from 'react';

export default function ReviewCard({ review }) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount || 0);
  const [isHelpful, setIsHelpful] = useState(false);

  const handleHelpful = async () => {
    if (isHelpful) return;
    try {
      await reviewApi.markHelpful(review._id);
      setHelpfulCount(prev => prev + 1);
      setIsHelpful(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-cream p-4 sm:p-6 hover:shadow-lg hover:border-sage/20 transition-all duration-300 animate-fade-in-up group">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 mb-4">
        {/* Avatar */}
        <div className="flex items-center gap-3 sm:block">
          {review.user?.avatar?.url ? (
            <img 
              src={review.user.avatar.url} 
              alt={`${review.user?.firstName}'s avatar`}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-cream"
            />
          ) : (
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-sage to-sage/70 flex items-center justify-center text-white font-semibold text-base sm:text-lg">
              {review.user?.firstName?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
          
          {/* Mobile: Name inline with avatar */}
          <div className="sm:hidden">
            <p className="font-medium text-ink text-sm">
              {review.user?.firstName} {review.user?.lastName}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <Rating value={review.rating} size="sm" />
              {review.isVerifiedPurchase && (
                <span className="inline-flex items-center gap-1 text-xs text-sage font-medium">
                  <HiCheckCircle className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Desktop: User Info */}
        <div className="hidden sm:flex flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-ink">
              {review.user?.firstName} {review.user?.lastName}
            </p>
            {review.isVerifiedPurchase && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-sage/10 text-sage text-xs font-medium rounded-full">
                <HiCheckCircle className="w-3.5 h-3.5" />
                <span>Verified Purchase</span>
              </span>
            )}
          </div>
          <Rating value={review.rating} size="sm" />
        </div>

        {/* Date */}
        <span className="hidden sm:block text-sm text-charcoal/50 whitespace-nowrap">
          {new Date(review.createdAt).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </span>
      </div>

      {/* Review Title */}
      {review.title && (
        <h4 className="font-semibold text-ink text-base sm:text-lg mb-2 leading-snug">
          {review.title}
        </h4>
      )}

      {/* Review Comment */}
      <p className="text-charcoal/80 text-sm sm:text-base leading-relaxed mb-4">
        {review.comment}
      </p>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-cream/80">
        {/* Mobile Date */}
        <span className="sm:hidden text-xs text-charcoal/50">
          {new Date(review.createdAt).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </span>

        {/* Helpful Button */}
        <button 
          onClick={handleHelpful}
          disabled={isHelpful}
          className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer active:scale-95 ${
            isHelpful 
              ? 'bg-sage/10 text-sage' 
              : 'bg-paper text-charcoal/70 hover:bg-cream hover:text-ink'
          }`}
        >
          <HiThumbUp className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${isHelpful ? 'scale-110' : 'group-hover:scale-110'}`} />
          <span>{isHelpful ? 'Helpful!' : 'Helpful'}</span>
          <span className="text-charcoal/50">({helpfulCount})</span>
        </button>
      </div>
    </div>
  );
}