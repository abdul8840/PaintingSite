import { useState } from 'react';
import Rating from '../common/Rating';
import reviewApi from '../../api/reviewApi';
import { useToast } from '../../hooks/useToast';

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
    <form onSubmit={handleSubmit}>
      <h3>Write a Review</h3>
      <div>
        <label>Your Rating</label>
        <Rating value={rating} onChange={setRating} interactive />
      </div>
      <div>
        <label>Title (optional)</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} />
      </div>
      <div>
        <label>Your Review</label>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} required maxLength={1000} rows={4} />
      </div>
      <button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit Review'}</button>
    </form>
  );
}