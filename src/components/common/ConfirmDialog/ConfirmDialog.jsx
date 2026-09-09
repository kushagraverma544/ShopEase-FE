import { Button } from '../Button/Button';
import { Modal } from '../Modal/Modal';

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  confirmVariant = 'danger',
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} className="max-w-sm">
      <p className="text-sm text-neutral-600">{description}</p>

      <div className="mt-6 flex gap-3">
        <Button variant="secondary" fullWidth onClick={onClose}>
          Cancel
        </Button>
        <Button variant={confirmVariant} fullWidth onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
