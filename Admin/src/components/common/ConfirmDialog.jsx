import Modal from './Modal';

export default function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  variant = 'danger' 
}) {
  const variantStyles = {
    danger: 'bg-error text-white hover:bg-red-600 active:bg-red-700',
    warning: 'bg-warning text-white hover:bg-amber-600 active:bg-amber-700',
    success: 'bg-success text-white hover:bg-green-600 active:bg-green-700',
    info: 'bg-info text-white hover:bg-blue-600 active:bg-blue-700',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="py-4">
        <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
          {message}
        </p>
      </div>
      
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-border-light">
        <button 
          onClick={onClose}
          className="
            flex-1 sm:flex-none
            px-4 sm:px-6 py-2.5
            bg-bg-tertiary hover:bg-bg-hover active:bg-bg-active
            text-text-primary font-medium
            rounded-lg
            border border-border-medium
            transition-all duration-200
            cursor-pointer
            focus-ring
          "
        >
          Cancel
        </button>
        <button 
          onClick={() => { onConfirm(); onClose(); }} 
          className={`
            flex-1 sm:flex-none
            px-4 sm:px-6 py-2.5
            font-medium
            rounded-lg
            transition-all duration-200
            cursor-pointer
            focus-ring
            ${variantStyles[variant] || variantStyles.danger}
          `}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}