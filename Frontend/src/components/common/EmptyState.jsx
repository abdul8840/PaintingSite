import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}) {
  return (
    <div
      className="
        flex flex-col items-center justify-center
        text-center
        py-16 sm:py-20 md:py-28 px-4
        animate-fade-in-up
      "
      style={{ animationFillMode: 'forwards' }}
    >
      {/* Icon */}
      {Icon && (
        <div
          className="
            w-20 h-20 sm:w-24 sm:h-24
            rounded-3xl
            bg-cream
            flex items-center justify-center
            mb-6
            animate-float
          "
        >
          <Icon className="w-9 h-9 sm:w-11 sm:h-11 text-mist" />
        </div>
      )}

      {/* Title */}
      <h3 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="mt-2 text-sm text-mist max-w-sm leading-relaxed">
          {description}
        </p>
      )}

      {/* Action */}
      {actionLabel && actionHref && (
        <Link
          to={actionHref}
          className="
            group inline-flex items-center gap-2
            mt-6
            px-6 py-3 rounded-xl
            bg-ink text-paper text-sm font-semibold
            hover:bg-charcoal
            transition-all duration-300 cursor-pointer
            active:scale-[0.98]
            shadow-md shadow-ink/10
          "
        >
          {actionLabel}
          <HiArrowRight
            className="
              w-4 h-4
              group-hover:translate-x-1
              transition-transform duration-300
            "
          />
        </Link>
      )}
    </div>
  );
}