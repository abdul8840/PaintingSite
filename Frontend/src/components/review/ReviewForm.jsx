import { useState } from 'react';
import Rating from '../common/Rating';
import reviewApi from '../../api/reviewApi';
import { useToast } from '../../hooks/useToast';
import { HiPencilAlt, HiStar } from 'react-icons/hi';

export default function ReviewForm({ artworkId, onReviewAdded }) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) { toast.error('Please select a rating'); return; }
    if (!comment.trim()) { toast.error('Please write a review'); return; }

    setLoading(true);
    try {
      const res = await reviewApi.create({ artwork: artworkId, rating, title, comment });
      toast.success('Review submitted!');
      onReviewAdded?.(res.review);
      setRating(0); setTitle(''); setComment('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-cream p-4 sm:p-6 animate-fade-in-up hover:shadow-md transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 sm:mb-6">
        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-gold/20 to-gold/10 rounded-lg flex items-center justify-center">
          <HiPencilAlt className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-ink">Write a Review</h3>
      </div>

      <div className="space-y-4 sm:space-y-5">
        {/* Rating */}
        <div className="animate-fade-in-up stagger-1">
          <label className="block text-sm font-medium text-ink mb-2 sm:mb-3">
            Your Rating <span className="text-rust">*</span>
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-0.5 sm:p-1 transition-transform duration-200 hover:scale-110 cursor-pointer active:scale-95"
                >
                  <HiStar 
                    className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors duration-200 ${
                      star <= rating ? 'text-gold fill-gold' : 'text-cream'
                    }`} 
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <span className="text-sm text-charcoal/60 animate-fade-in">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="animate-fade-in-up stagger-2">
          <label className="block text-sm font-medium text-ink mb-2">
            Review Title <span className="text-charcoal/40">(optional)</span>
          </label>
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            maxLength={100}
            className="w-full px-4 py-2.5 sm:py-3 bg-paper border border-cream rounded-xl text-ink placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all duration-300 text-sm sm:text-base"
            placeholder="Summarize your experience"
          />
          <div className="flex justify-end mt-1">
            <span className="text-xs text-charcoal/40">{title.length}/100</span>
          </div>
        </div>

        {/* Comment */}
        <div className="animate-fade-in-up stagger-3">
          <label className="block text-sm font-medium text-ink mb-2">
            Your Review <span className="text-rust">*</span>
          </label>
          <textarea 
            value={comment} 
            onChange={(e) => setComment(e.target.value)} 
            required 
            maxLength={1000} 
            rows={4}
            className="w-full px-4 py-2.5 sm:py-3 bg-paper border border-cream rounded-xl text-ink placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all duration-300 resize-none text-sm sm:text-base"
            placeholder="Share your thoughts about this artwork..."
          />
          <div className="flex justify-end mt-1">
            <span className="text-xs text-charcoal/40">{comment.length}/1000</span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 animate-fade-in-up stagger-4">
          <button 
            type="submit" 
            disabled={loading || !rating || !comment.trim()}
            className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-ink text-white rounded-xl font-medium hover:bg-charcoal transition-all duration-300 hover:shadow-lg hover:shadow-ink/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Submitting...</span>
              </>
            ) : (
              <span>Submit Review</span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}