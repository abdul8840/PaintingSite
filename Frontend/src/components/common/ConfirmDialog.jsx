import Modal from './Modal';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel' }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p>{message}</p>
      <div>
        <button onClick={onClose}>{cancelText}</button>
        <button onClick={() => { onConfirm(); onClose(); }}>{confirmText}</button>
      </div>
    </Modal>
  );
}