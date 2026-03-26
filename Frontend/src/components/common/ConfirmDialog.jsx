import Modal from './Modal';
import { HiExclamation } from 'react-icons/hi';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}) {
  const confirmStyles = {
    danger:
      'bg-rust text-paper hover:bg-rust/90 shadow-md shadow-rust/20',
    warning:
      'bg-gold text-ink hover:bg-gold/90 shadow-md shadow-gold/20',
    default:
      'bg-ink text-paper hover:bg-charcoal shadow-md shadow-ink/10',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center text-center">
        {/* Warning Icon */}
        <div
          className="
            w-14 h-14 rounded-2xl
            bg-rust/10
            flex items-center justify-center
            mb-4
          "
        >
          <HiExclamation className="w-7 h-7 text-rust" />
        </div>

        {/* Message */}
        <p className="text-sm text-charcoal/80 leading-relaxed max-w-sm">
          {message}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-6 pt-4 border-t border-cream">
        <button
          onClick={onClose}
          className="
            flex-1 px-4 py-2.5 rounded-xl
            text-sm font-semibold text-charcoal
            bg-cream hover:bg-mist/30
            transition-all duration-300 cursor-pointer
            active:scale-[0.98]
          "
        >
          {cancelText}
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`
            flex-1 px-4 py-2.5 rounded-xl
            text-sm font-semibold
            transition-all duration-300 cursor-pointer
            active:scale-[0.98]
            ${confirmStyles[variant] || confirmStyles.default}
          `}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}