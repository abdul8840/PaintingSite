import Rating from '../common/Rating';
import { HiThumbUp, HiCheckCircle } from 'react-icons/hi';
import reviewApi from '../../api/reviewApi';

export default function ReviewCard({ review }) {
  const handleHelpful = () => reviewApi.markHelpful(review._id);

  return (
    <div>
      <div>
        {review.user?.avatar?.url ? (
          <img src={review.user.avatar.url} alt="" />
        ) : (
          <div>{review.user?.firstName?.[0]}</div>
        )}
        <div>
          <p>{review.user?.firstName} {review.user?.lastName}</p>
          <Rating value={review.rating} />
          {review.isVerifiedPurchase && <span><HiCheckCircle /> Verified Purchase</span>}
        </div>
        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
      </div>
      {review.title && <h4>{review.title}</h4>}
      <p>{review.comment}</p>
      <button onClick={handleHelpful}><HiThumbUp /> Helpful ({review.helpfulCount})</button>
    </div>
  );
}