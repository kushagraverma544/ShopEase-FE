import { X } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '../../../utils/cn';
import { IconButton } from '../IconButton/IconButton';

export function Modal({ open, onClose, title, children, className }) {
  useEffect(() => {
    if (!open) return undefined;

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-(--z-modal) flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="fixed inset-0 bg-neutral-900/50"
      />

      <div
        className={cn(
          'relative w-full max-w-md rounded-xl bg-neutral-0 p-6 shadow-elevated max-h-[85vh] overflow-y-auto',
          className,
        )}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
          <IconButton icon={X} label="Close" size="sm" onClick={onClose} />
        </div>

        {children}
      </div>
    </div>,
    document.body,
  );
}
