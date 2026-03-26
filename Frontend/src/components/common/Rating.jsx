import { HiStar } from 'react-icons/hi';

export default function Rating({
  value = 0,
  count,
  onChange,
  interactive = false,
  size = 'default',
}) {
  const sizes = {
    small: 'w-3.5 h-3.5',
    default: 'w-4.5 h-4.5',
    large: 'w-6 h-6',
  };

  const starSize = sizes[size] || sizes.default;

  return (
    <div className="inline-flex items-center gap-1">
      {/* Stars */}
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onChange?.(star)}
            disabled={!interactive}
            className={`
              p-0.5 rounded
              transition-all duration-200
              ${
                interactive
                  ? 'cursor-pointer hover:scale-125 active:scale-90'
                  : 'cursor-default'
              }
              disabled:cursor-default
              focus:outline-none
            `}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
          >
            <HiStar
              className={`
                ${starSize}
                transition-colors duration-200
                ${
                  star <= value
                    ? 'text-gold'
                    : star <= Math.ceil(value) && value % 1 !== 0
                      ? 'text-gold/50'
                      : 'text-mist/30'
                }
                ${interactive && star > value ? 'hover:text-gold/60' : ''}
              `}
            />
          </button>
        ))}
      </div>

      {/* Count */}
      {count !== undefined && (
        <span className="text-xs text-mist ml-1">
          ({count})
        </span>
      )}
    </div>
  );
}