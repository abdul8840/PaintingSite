import { useEffect } from 'react';
import { HiX } from 'react-icons/hi';

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'default' 
}) {
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

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    small: 'max-w-sm',
    default: 'max-w-lg',
    large: 'max-w-2xl',
    xlarge: 'max-w-4xl',
    full: 'max-w-[95vw]',
  };

  return (
    <div 
      onClick={onClose}
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        p-4 sm:p-6
        bg-black/50 backdrop-blur-sm
        animate-fadeIn
      "
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className={`
          ${sizeClasses[size]}
          w-full
          bg-bg-primary
          rounded-xl sm:rounded-2xl
          shadow-xl
          overflow-hidden
          animate-scaleIn
        `}
      >
        {/* Header */}
        <div className="
          flex items-center justify-between
          px-4 sm:px-6 py-3 sm:py-4
          border-b border-border-light
          bg-bg-secondary
        ">
          <h2 className="
            text-lg sm:text-xl
            font-semibold
            text-text-primary
            truncate
            pr-4
          ">
            {title}
          </h2>
          <button 
            onClick={onClose}
            className="
              flex-shrink-0
              p-2
              rounded-lg
              text-text-muted hover:text-text-primary
              hover:bg-bg-hover active:bg-bg-active
              transition-colors duration-200
              cursor-pointer
              focus-ring
            "
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>
        
        {/* Body */}
        <div className="
          px-4 sm:px-6 py-4 sm:py-5
          max-h-[calc(100vh-200px)]
          overflow-y-auto
        ">
          {children}
        </div>
      </div>
    </div>
  );
}