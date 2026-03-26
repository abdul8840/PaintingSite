import { HiStar } from 'react-icons/hi';

export default function Rating({ value = 0, count, onChange, interactive = false }) {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => interactive && onChange?.(star)}
          disabled={!interactive}
          data-filled={star <= value}
        >
          <HiStar />
        </button>
      ))}
      {count !== undefined && <span>({count})</span>}
    </div>
  );
}