import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiSearch, HiX } from 'react-icons/hi';

export default function SearchBar({ onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    // Close on escape
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  return (
    <div
      className="
        absolute top-full left-0 w-full
        bg-paper/98 glass
        border-t border-cream
        shadow-lg shadow-ink/5
        animate-fade-in-down
        z-40
      "
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-4">
        <form
          onSubmit={handleSubmit}
          className="
            relative flex items-center
            bg-cream/60 rounded-2xl
            border border-mist/30
            focus-within:border-rust/40
            focus-within:shadow-md focus-within:shadow-rust/5
            transition-all duration-300
            overflow-hidden
          "
        >
          <HiSearch className="absolute left-4 w-5 h-5 text-mist" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search artworks, styles, artists..."
            className="
              w-full py-3.5 pl-12 pr-12
              bg-transparent text-ink
              placeholder:text-mist
              text-sm md:text-base
              focus:outline-none
            "
          />
          <button
            type="button"
            onClick={onClose}
            className="
              absolute right-2 p-2 rounded-xl
              text-mist hover:text-rust hover:bg-cream
              transition-all duration-300 cursor-pointer
              active:scale-90
            "
            aria-label="Close search"
          >
            <HiX className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}