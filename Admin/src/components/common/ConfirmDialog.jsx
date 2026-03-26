import Modal from './Modal';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', variant = 'danger' }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p>{message}</p>
      <div>
        <button onClick={onClose}>Cancel</button>
        <button onClick={() => { onConfirm(); onClose(); }} data-variant={variant}>{confirmText}</button>
      </div>
    </Modal>
  );
}