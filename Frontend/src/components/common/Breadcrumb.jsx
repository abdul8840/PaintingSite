import { Link } from 'react-router-dom';
import { HiChevronRight, HiHome } from 'react-icons/hi';

export default function Breadcrumb({ items }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="py-4 md:py-5"
    >
      <ol className="flex items-center flex-wrap gap-1">
        {/* Home */}
        <li>
          <Link
            to="/"
            className="
              inline-flex items-center gap-1.5
              px-2 py-1 rounded-lg
              text-xs sm:text-sm font-medium text-mist
              hover:text-rust hover:bg-cream
              transition-all duration-300 cursor-pointer
            "
          >
            <HiHome className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </li>

        {/* Items */}
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1">
            <HiChevronRight className="w-3.5 h-3.5 text-mist/50 shrink-0" />
            {item.href ? (
              <Link
                to={item.href}
                className="
                  px-2 py-1 rounded-lg
                  text-xs sm:text-sm font-medium text-mist
                  hover:text-rust hover:bg-cream
                  transition-all duration-300 cursor-pointer
                  truncate max-w-[120px] sm:max-w-[200px]
                "
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="
                  px-2 py-1
                  text-xs sm:text-sm font-semibold text-ink
                  truncate max-w-[150px] sm:max-w-[250px]
                "
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}