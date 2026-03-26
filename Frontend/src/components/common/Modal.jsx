import { useEffect } from 'react';
import { HiX } from 'react-icons/hi';

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed inset-0 z-[200]
        flex items-center justify-center
        p-4 sm:p-6
      "
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className="
          absolute inset-0
          bg-ink/50 glass
          animate-fade-in
        "
      />

      {/* Modal Panel */}
      <div
        className="
          relative w-full max-w-lg
          bg-paper rounded-2xl
          shadow-2xl shadow-ink/20
          border border-cream
          animate-scale-in
          max-h-[90vh] overflow-hidden
          flex flex-col
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="
            flex items-center justify-between
            px-5 sm:px-6 py-4
            border-b border-cream
            shrink-0
          "
        >
          <h2 className="text-lg font-bold text-ink tracking-tight">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="
              p-2 rounded-xl
              text-mist hover:text-rust hover:bg-cream
              transition-all duration-300 cursor-pointer
              active:scale-90
            "
            aria-label="Close modal"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 sm:px-6 py-5 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}